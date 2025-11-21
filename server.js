const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

// --- CONFIGURATION ---
const OLLAMA_HOST = 'http://127.0.0.1:11434';
const OLLAMA_PORT = 3000;
const STOCKFISH_PORT = 3001;

// --- OLLAMA PROXY (Port 3000) ---
const proxy = httpProxy.createProxyServer({});

// Error handling for the proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res.headersSent) return;
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
});

const ollamaServer = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`[Ollama Proxy] ${req.method} ${req.url}`);
  proxy.web(req, res, { target: OLLAMA_HOST });
});

ollamaServer.listen(OLLAMA_PORT, () => {
  console.log(`✅ Ollama Proxy running on http://localhost:${OLLAMA_PORT}`);
});

// --- STOCKFISH API (Port 3001) ---
// We use the 'stockfish' npm package for the engine.
// If not installed, we'll return a mock response to prevent crashing.
let stockfish = null;
try {
  stockfish = require('stockfish');
} catch (e) {
  console.warn("⚠️  'stockfish' npm package not found. Stockfish endpoints will return mock data.");
  console.warn("👉  Run: npm install stockfish");
}

const stockfishServer = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/v1/stockfish' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { fen } = JSON.parse(body);
        if (!fen) throw new Error('Missing FEN');

        console.log(`[Stockfish API] Analyzing: ${fen}`);

        if (!stockfish) {
            // Mock response if engine is missing
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ cp: 0, bestMove: 'e2e4', note: "Mock data (npm install stockfish)" }));
            return;
        }

        // Initialize Engine for this request
        const engine = stockfish();
        let bestMoveFound = false;

        engine.onmessage = function(line) {
            // Parse UCI output
            // Look for "bestmove e2e4"
            if (line.startsWith('bestmove')) {
                const parts = line.split(' ');
                const bestMove = parts[1];
                if (!bestMoveFound) {
                    // If we somehow finished without finding a score line (rare), return simple
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ bestMove, score: 0 }));
                    bestMoveFound = true;
                }
            }
            
            // Look for "info depth ... score cp 50 ..." or "score mate 3"
            if (line.startsWith('info') && line.includes('score')) {
                // Very basic parsing of the last info line before bestmove
                // In a real app, you'd want to debounce this or wait for specific depth
                const cpMatch = line.match(/score cp (-?\d+)/);
                const mateMatch = line.match(/score mate (-?\d+)/);
                
                if (mateMatch) {
                    // We attach the result to the engine object temporarily or just wait for bestmove?
                    // Actually, for a simple HTTP request/response, we can't stream easily.
                    // We will wait for a specific depth or time, then kill it?
                    // Standard UCI: go depth 15.
                    // This callback fires multiple times. We want the RESULT of the analysis.
                }
            }
        };

        // A simplified Promise-based wrapper for the analysis
        const analyze = new Promise((resolve) => {
            let lastScore = { type: 'cp', value: 0 };
            
            engine.onmessage = (line) => {
                // Parse score
                if (line.startsWith('info') && line.includes('score')) {
                    const cpMatch = line.match(/score cp (-?\d+)/);
                    const mateMatch = line.match(/score mate (-?\d+)/);
                    if (mateMatch) lastScore = { type: 'mate', value: parseInt(mateMatch[1]) };
                    else if (cpMatch) lastScore = { type: 'cp', value: parseInt(cpMatch[1]) };
                }
                
                // Parse bestmove (end of analysis)
                if (line.startsWith('bestmove')) {
                    const bestMove = line.split(' ')[1];
                    resolve({ bestMove, score: lastScore });
                }
            };

            engine.postMessage(`position fen ${fen}`);
            engine.postMessage('go depth 12'); // Depth 12 is fast enough for HTTP
        });

        analyze.then((result) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            let responseBody = { bestMove: result.bestMove };
            if (result.score.type === 'mate') responseBody.mate = result.score.value;
            else responseBody.cp = result.score.value;
            
            res.end(JSON.stringify(responseBody));
        });

      } catch (err) {
        console.error("Stockfish Error:", err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

stockfishServer.listen(STOCKFISH_PORT, () => {
  console.log(`✅ Stockfish API running on http://localhost:${STOCKFISH_PORT}`);
});
