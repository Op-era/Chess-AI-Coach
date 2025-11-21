# Chess AI Coach

An application that loads your chess.com games, analyzes them with a local Stockfish engine, and uses your local Ollama LLM to provide personalized coaching reports.

## 1. Prerequisites

*   **Node.js** (v16+)
*   **Ollama**: Installed and running. [Download Ollama](https://ollama.com/)
*   **A Chess Model**: You need a model pulled in Ollama (e.g., `llama3.1:8b`).
    ```bash
    ollama pull llama3.1:8b
    ```

## 2. Installation

Open your terminal in the project directory and install the dependencies:

```bash
npm install
npm install http-proxy stockfish
```

*   `http-proxy`: Used to forward requests to Ollama without CORS issues.
*   `stockfish`: The chess engine for Node.js.

## 3. Startup Instructions

You need to run two things: the backend server (proxies & engine) and the frontend React app.

### Step 1: Start Ollama
Ensure Ollama is running in the background.
```bash
ollama serve
```

### Step 2: Start the Backend Server
This script runs the Ollama Proxy (port 3000) and the Stockfish API (port 3001).

```bash
node server.js
```
*Keep this terminal window open.*

### Step 3: Start the Frontend
Open a **new** terminal window in the project directory:

```bash
npm run dev
```

Click the link provided (usually `http://localhost:5173`) to open the app in your browser.

## 4. Usage

1.  Enter your **Chess.com username**.
2.  Click **"Search Player"**.
3.  Select the games you want to analyze.
4.  Click **"Analyze Selected Games"**.
5.  Wait for the magic! The app will use Stockfish to find mistakes and Ollama to explain them using modern chess terminology.
