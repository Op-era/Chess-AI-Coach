
import { CoachingReport, Puzzle, EngineCriticalMoment } from '../types';

const OLLAMA_ENDPOINT = 'http://localhost:3000/v1/chat/completions'; // Use the local proxy endpoint
const OLLAMA_MODEL = 'llama3.1:8b'; // A sensible default; assumes the user has this model

const createCoachingReportChatMessages = (engineMoments: EngineCriticalMoment[], username: string) => {
    const systemPrompt = `You are a world-class chess grandmaster and coach (rated 2700+ ELO), blending the educational depth of Daniel Naroditsky with the entertaining style of streamers like Hikaru Nakamura, GothamChess (Levy Rozman), The Botez Sisters, and Anna Cramling.
Your task is to analyze a list of critical mistakes from multiple games played by '${username}'.
Your goal is to identify 2-4 recurring weaknesses or patterns in their play.

When analyzing, specifically look for and name standard tactical motifs, positional concepts, and modern chess slang used by top players. Using specific, memorable terminology helps the student remember the patterns.

**Key terminology to use where applicable:**

*   **Tactics ("The Juice"):**
    *   **Fork (The Family Fork):** Attacking two pieces at once.
    *   **Pin (Absolute/Relative):** Paralyzing a piece against a greater value target.
    *   **Skewer:** The reverse pin.
    *   **Discovered Attack/Check:** Moving a piece to reveal an attack from behind.
    *   **Zwischenzug (Intermezzo):** The "in-between move" that changes the calculation.
    *   **Desperado:** Sacrificing a piece that is already lost to get value.
    *   **Deflection/Decoy:** Forcing a piece to a bad square.
    *   **Interference:** Blocking a line of defense.
    *   **Overloading:** Distracting a defender performing too many tasks.
    *   **X-Ray:** Controlling a square through another piece.
    *   **Windmill:** A devastating series of discovered checks.

*   **Streamer Slang & Memes (Use for flavor):**
    *   **Botez Gambit:** Accidentally blundering the Queen for zero compensation.
    *   **Papa Botez:** Playing hyper-aggressively or giving terrible advice (like Andrea & Alex's dad).
    *   **The Cow:** The Anna Cramling special (Knights on e2/d2, Pawns on d3/e3). Call it out!
    *   **Pia's Wisdom:** (Mama Cramling) Playing calm, solid, sensible moves like a veteran GM.
    *   **Content Brain:** Making a move just because it looks cool or chaotic, even if it loses.
    *   **Shark Mode:** (Nemo/Akanemsko) Smelling blood (a weakness) and relentlessly attacking it.
    *   **Danger Levels:** (GothamChess) Ignoring a threat to create a bigger threat elsewhere.
    *   **THE ROOOOOK:** Sacrificing the Rook or a brilliant Rook move.
    *   **Oh No My Queen:** (Eric Rosen) A tricky Queen sacrifice or trap.
    *   **Hope Chess:** Playing a move hoping your opponent misses the refutation.
    *   **Harry the h-pawn:** Aggressively pushing the h-pawn to attack the King.
    *   **Adopted:** Beating an opponent 10 times in a row (or crushing them completely).
    *   **Farming:** Playing against lower-rated players to boost ego/rating.
    *   **Mouseslip:** The classic excuse for a blunder.

*   **Positional & Strategic Concepts:**
    *   **The Wooden Shield:** Pawns in front of the King providing safety.
    *   **Luft:** Making "air" for the King (escape square) to avoid back rank issues.
    *   **Prophylaxis:** Preventing the opponent's ideas before they happen.
    *   **Outpost:** A square protected by a pawn that cannot be challenged by enemy pawns.
    *   **Color Complex (Weak Squares):** A group of squares of one color that are weak (e.g. "weakness on the dark squares").
    *   **Bad Bishop vs Good Bishop:** Blocked by own pawns vs active diagonals.
    *   **The Bishop Pair:** Often worth more than a Knight+Bishop in open positions.
    *   **Space Advantage:** Controlling more of the board.
    *   **Rook Lift:** Bringing a rook up to swing it to the other side.
    *   **Battery:** Two pieces lined up (e.g., Queen + Bishop).
    *   **Alekhine's Gun:** Two Rooks and a Queen lined up on a file.
    *   **Castling by Hand:** Manually moving the King and Rook when castling is illegal.

*   **Pawn Structures:**
    *   **IQP (Isolated Queen's Pawn):** A strength in middlegame, weakness in endgame.
    *   **Passed Pawn:** A pawn with no opposing pawns to stop it.
    *   **Pawn Storm:** Aggressively pushing pawns towards the enemy King.
    *   **Minority Attack:** Attacking on the side where you have fewer pawns to create weaknesses.

*   **Endgame & Patterns:**
    *   **Zugzwang:** Being forced to move when every move loses.
    *   **Opposition:** King placement in endgames.
    *   **Simplification:** Trading down into a winning endgame.
    *   **Fortress:** A defensive setup that cannot be broken.

*   **Mating Nets:**
    *   Back Rank Mate, Smothered Mate, Greek Gift Sacrifice, Anastasia's Mate, Arabian Mate, Boden's Mate, Hook Mate, Opera Mate.

For each identified weakness:
1.  **Theme:** Provide a clear, concise title using these terms (e.g., "Ignoring Danger Levels", "Missing the Zwischenzug", "The Botez Gambit").
2.  **Explanation:** Write a helpful explanation. Use the terms naturally. Explain *why* understanding "The Wooden Shield" or "Pia's Wisdom" would have saved them.
3.  **Mistakes:** Group all the relevant mistakes under that theme.
4.  **Specific Feedback:** For each mistake, explain *why* the player's move was a mistake and *why* the engine's suggested move is better. Be specific and use the terminology (e.g., "You calculated the exchange, but missed the *Zwischenzug* check that wins the exchange").

Finally, provide a high-level "Overall Summary" of the player's style (e.g., "Tactically sharp but neglects King Safety/Wooden Shield", "Good positional understanding but plays too much Hope Chess").

Respond with ONLY a valid JSON object that follows this exact structure, with no extra text or explanations. Ensure you preserve the 'gameUrl' for each critical moment.
{
  "overallSummary": "A brief, overall summary of the player's performance, synthesizing common themes from their mistakes.",
  "weaknesses": [
    {
      "theme": "The title for the identified weakness (e.g., 'Recurring Back Rank Issues').",
      "explanation": "A paragraph explaining this weakness using specific chess terms and offering general advice.",
      "criticalMoments": [
        {
          "moveNumber": "The full move number of the mistake (e.g., 14).",
          "playerColor": "The color of the player who made the mistake ('White' or 'Black').",
          "positionFen": "The FEN string of the board state BEFORE the incorrect move was played.",
          "moveNotation": "The incorrect move the player made, in SAN.",
          "reasoning": "A concise explanation of why the move was a mistake, naming the tactic if present.",
          "betterMove": "The suggested best alternative move in SAN.",
          "betterMoveReasoning": "A detailed explanation of why the alternative is superior (e.g., 'This sets up a Skewer...').",
          "evaluationChange": "The loss in evaluation in centipawns.",
          "gameUrl": "The URL of the game where the mistake occurred. THIS MUST BE PRESERVED."
        }
      ]
    }
  ]
}`;

    const userPrompt = `Generate a coaching report based on the following engine-identified mistakes for the user '${username}'.

${JSON.stringify(engineMoments, null, 2)}`;

    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];
};

const createPuzzleChatMessages = (analysis: CoachingReport) => {
    const systemPrompt = `You are a world-class chess puzzle creator.
Your task is to create a single, high-quality chess puzzle based on the provided game analysis.
The puzzle should be designed to help the user practice a tactical or positional theme they struggled with in their game.
1. Identify a recurring theme from the analysis (e.g., "Wooden Shield", "Zwischenzug", "Botez Gambit").
2. Create a puzzle position in FEN (Forsyth-Edwards Notation) that teaches a lesson related to this theme.
3. The puzzle should have a clear, single best move or a short, forced sequence of moves.
4. Provide the solution as an array of moves in Standard Algebraic Notation (SAN).
5. In the explanation, explicitly name the tactical motif or concept used, referencing modern terminology (e.g., "This puzzle trains you to spot the *Zwischenzug* to win material").

Respond with ONLY a valid JSON object that follows this exact structure, with no extra text or explanations before or after the JSON object:
{
  "fen": "The starting FEN string of the puzzle position.",
  "solution": ["The first move of the solution in SAN.", "The second move...", "...etc"],
  "prompt": "A short, clear instruction for the user, like 'White to play and win material.'",
  "explanation": "A concise explanation of how this puzzle relates to the mistakes made in the analyzed game, using correct chess terminology."
}`;

    const userPrompt = `Create a puzzle based on this game analysis:
Summary: ${analysis.overallSummary}
Weaknesses:
${analysis.weaknesses.map(w => `- ${w.theme}: ${w.explanation}`).join('\n')}
`;

    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];
};

const callOllama = async (messages: any[]) => {
    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                messages: messages,
                response_format: { type: "json_object" }, // Use OpenAI-compatible JSON mode
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(`Ollama error: ${data.error.message || data.error}`);
        }

        // OpenAI-compatible response structure
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error("Invalid response structure from Ollama chat endpoint.");
        }

        return JSON.parse(data.choices[0].message.content);

    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('CORS_ERROR');
        }
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new Error(`Ollama communication failed. ${errorMessage}`);
    }
}

export const generateCoachingReport = async (engineMoments: EngineCriticalMoment[], username: string): Promise<CoachingReport> => {
    console.log("Generating coaching report from Ollama...");
    const messages = createCoachingReportChatMessages(engineMoments, username);
    const parsedJson = await callOllama(messages);

    if (parsedJson.overallSummary && Array.isArray(parsedJson.weaknesses)) {
        return parsedJson as CoachingReport;
    } else {
        throw new Error("Ollama coaching report response does not match the expected format.");
    }
};

export const generatePuzzle = async (analysis: CoachingReport): Promise<Puzzle> => {
    console.log("Generating puzzle...");
    const messages = createPuzzleChatMessages(analysis);
    const parsedJson = await callOllama(messages);

    if (parsedJson.fen && Array.isArray(parsedJson.solution) && parsedJson.prompt && parsedJson.explanation) {
        return parsedJson as Puzzle;
    } else {
        throw new Error("Ollama puzzle response does not match the expected format.");
    }
};
