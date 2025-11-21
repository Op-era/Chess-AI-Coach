import React, { useState, useEffect, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Puzzle } from '../types';

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onExit: () => void;
}

type Feedback = {
  type: 'correct' | 'incorrect' | 'solved' | 'info';
  message: string;
};

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ puzzle, onExit }) => {
  const [game, setGame] = useState(new Chess(puzzle.fen));
  const [fen, setFen] = useState(puzzle.fen);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [solutionStep, setSolutionStep] = useState(0);

  useEffect(() => {
    // Reset board when puzzle changes
    const newGame = new Chess(puzzle.fen);
    setGame(newGame);
    setFen(newGame.fen());
    setSolutionStep(0);
    setFeedback({ type: 'info', message: puzzle.prompt });
  }, [puzzle]);

  const boardOrientation = useMemo(() => (game.turn() === 'w' ? 'white' : 'black'), [game]);

  function handlePieceDrop(sourceSquare: string, targetSquare: string) {
    if (solutionStep >= puzzle.solution.length) return false; // Puzzle solved

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Assume queen promotion for simplicity
      });

      if (move === null) return false;

      // Check if the user's move matches the solution
      if (move.san === puzzle.solution[solutionStep]) {
        setFeedback({ type: 'correct', message: 'Correct!' });
        const nextStep = solutionStep + 1;
        
        // If puzzle is not over, play opponent's response
        if (nextStep < puzzle.solution.length) {
          setTimeout(() => {
            gameCopy.move(puzzle.solution[nextStep]);
            setFen(gameCopy.fen());
            setGame(gameCopy);
            setSolutionStep(nextStep + 1);
            setFeedback(null); // Clear feedback for next user move
          }, 500);
        } else {
            setFeedback({ type: 'solved', message: 'Puzzle solved!' });
        }
        setFen(gameCopy.fen());
        setGame(gameCopy);
        setSolutionStep(nextStep);
      } else {
        setFeedback({ type: 'incorrect', message: 'Incorrect, try again!' });
        // Don't update board, wait for user to try correct move
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  
  const handleReset = () => {
      const newGame = new Chess(puzzle.fen);
      setGame(newGame);
      setFen(newGame.fen());
      setSolutionStep(0);
      setFeedback({ type: 'info', message: puzzle.prompt });
  }

  const feedbackColor = {
    correct: 'text-green-400',
    incorrect: 'text-red-400',
    solved: 'text-sky-400',
    info: 'text-amber-400',
  }[feedback?.type || 'info'];

  return (
    <div className="relative">
        <div className="w-full max-w-[600px] mx-auto text-[0]">
          <Chessboard
            position={fen}
            onPieceDrop={handlePieceDrop}
            boardOrientation={boardOrientation}
            customBoardTheme={{
              light: { backgroundColor: '#e6d5b8' },
              dark: { backgroundColor: '#8c6c5a' },
            }}
          />
        </div>
        <div className="mt-4 text-center">
            {feedback && <p className={`text-lg font-semibold ${feedbackColor}`}>{feedback.message}</p>}
            <p className="text-sm text-slate-300 mt-1">{puzzle.explanation}</p>
            <div className="flex justify-center gap-4 mt-4">
                <button onClick={handleReset} className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 transition">Reset Puzzle</button>
                <button onClick={onExit} className="px-4 py-2 bg-sky-700 rounded hover:bg-sky-600 transition">Back to Game Analysis</button>
            </div>
        </div>
    </div>
  );
};

export default PuzzleBoard;