import { Chess } from 'chess.js';
import { EngineCriticalMoment } from '../types';

const STOCKFISH_ENDPOINT = 'http://localhost:3001/v1/stockfish';

class StockfishService {
    
    private async evaluatePosition(fen: string): Promise<{ score: number, bestMove: string }> {
        try {
            const response = await fetch(STOCKFISH_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fen })
            });

            if (!response.ok) {
                console.error(`Stockfish API error: ${response.status} ${response.statusText}`);
                return { score: 0, bestMove: '' };
            }

            const data = await response.json();
            
            // Handle common JSON return formats for chess engines.
            // We assume the server returns a score in centipawns (cp) or a mate score.
            // Standard UCI convention: score is relative to the side to move.
            
            let score = 0;
            if (typeof data.mate === 'number' && data.mate !== null && data.mate !== 0) {
                // Convert mate score to a large number (preserving sign for winning/losing)
                // Example: Mate in 1 for us -> +29999. Mate in 1 for them -> -29999.
                // Note: data.mate usually implies moves to mate. Positive = we mate, Negative = we get mated.
                score = (data.mate > 0 ? 30000 : -30000) - Math.abs(data.mate);
            } else if (typeof data.score === 'number') {
                score = data.score;
            } else if (typeof data.cp === 'number') {
                score = data.cp;
            }

            const bestMove = data.bestMove || data.best_move || '';

            return { score, bestMove };

        } catch (e) {
            console.error("Failed to connect to Stockfish service:", e);
            return { score: 0, bestMove: '' };
        }
    }
    
    public async evaluateFenHistory(fens: string[], onProgress: (progress: string) => void): Promise<number[]> {
        const evaluations: number[] = [];

        for (let i = 0; i < fens.length; i++) {
            const fen = fens[i];
            // Update progress periodically
            if (i % 5 === 0 || i === fens.length - 1) {
                onProgress(`Evaluating position ${i + 1} of ${fens.length}...`);
            }
            
            const { score } = await this.evaluatePosition(fen);
            const turn = fen.split(' ')[1]; // 'w' or 'b'

            // Standard UCI score is from the side to move's perspective.
            // We want White's perspective for the UI graph.
            // If it is White's turn, score is already White's perspective.
            // If it is Black's turn, a positive score means Black is winning (bad for White).
            const normalizedScore = turn === 'w' ? score : -score;
            evaluations.push(normalizedScore);
        }
        onProgress('Full game evaluation complete.');
        return evaluations;
    }

    public async findCriticalMoments(pgn: string, username: string, gameUrl: string, onProgress: (progress: string) => void): Promise<EngineCriticalMoment[]> {
        const game = new Chess();
        try {
            game.loadPgn(pgn);
        } catch (e) {
            console.error("Invalid PGN", e);
            return [];
        }
        
        const whiteUsername = game.header().White;
        // Determine which color the user played
        const playerColorHeader = (whiteUsername && whiteUsername.toLowerCase() === username.toLowerCase()) ? 'White' : 'Black';
        const playerColor = playerColorHeader === 'White' ? 'w' : 'b';
        
        const history = game.history({ verbose: true });
        const gameCopy = new Chess();
        const mistakes: EngineCriticalMoment[] = [];

        for (let i = 0; i < history.length; i++) {
            const move = history[i];
            const fenBeforeMove = gameCopy.fen();
            
            if (i % 2 === 0) {
                 onProgress(`Analyzing move ${Math.floor(i / 2) + 1} of ${Math.ceil(history.length / 2)}...`);
            }
            
            // We only analyze the user's moves
            if (move.color === playerColor) {
                // 1. Evaluate position BEFORE player moves
                const { score: evalBefore, bestMove: engineBestMove } = await this.evaluatePosition(fenBeforeMove);
                
                // 2. Make the player's move
                gameCopy.move(move.san);
                
                // 3. Evaluate position AFTER player moves
                const { score: evalAfter } = await this.evaluatePosition(gameCopy.fen());

                // 4. Normalize both evaluations to White's perspective to perform arithmetic comparison
                let evalWhitePovBefore: number;
                let evalWhitePovAfter: number;

                if (move.color === 'w') { 
                    // White to move. Score is White POV.
                    evalWhitePovBefore = evalBefore; 
                    // After White moves, it is Black to move. Score is Black POV.
                    // So negate it to get White POV.
                    evalWhitePovAfter = -evalAfter; 
                } else { 
                    // Black to move. Score is Black POV.
                    // Negate to get White POV.
                    evalWhitePovBefore = -evalBefore; 
                    // After Black moves, it is White to move. Score is White POV.
                    evalWhitePovAfter = evalAfter;  
                }

                // 5. Calculate the drop in evaluation from the PLAYER'S perspective
                let evalDrop: number;
                if (move.color === 'w') {
                    // White wants score to be high. Drop = Before - After.
                    evalDrop = evalWhitePovBefore - evalWhitePovAfter;
                } else {
                    // Black wants score to be low (negative).
                    // Black Advantage = -WhiteScore.
                    // Drop = (BlackAdvantageBefore) - (BlackAdvantageAfter)
                    //      = (-evalWhitePovBefore) - (-evalWhitePovAfter)
                    //      = evalWhitePovAfter - evalWhitePovBefore
                    evalDrop = evalWhitePovAfter - evalWhitePovBefore;
                }

                // 6. Identify Mistakes (threshold: > 100 centipawns)
                if (evalDrop > 100) { 
                    mistakes.push({
                        moveNumber: Math.floor(i / 2) + 1,
                        playerColor: playerColorHeader,
                        positionFen: fenBeforeMove,
                        playerMove: move.san,
                        engineBestMove: engineBestMove,
                        evaluationDrop: evalDrop,
                        gameUrl: gameUrl,
                    });
                }
            } else {
                 // Just update board state for opponent's move
                 gameCopy.move(move.san);
            }
        }
        onProgress('Finalizing analysis...');

        // Return top 3 mistakes sorted by severity
        return mistakes.sort((a, b) => b.evaluationDrop - a.evaluationDrop).slice(0, 3);
    }
}

export const stockfishService = new StockfishService();
