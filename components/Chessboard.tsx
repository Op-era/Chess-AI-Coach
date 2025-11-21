import React, { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { CustomSquareStyles, CoachingReport, CriticalMoment } from '../types';

interface ChessboardProps {
  fen: string;
  game: Chess | null;
  currentPly: number;
  coachingReport: CoachingReport | null;
  username: string;
  boardOrientation: 'white' | 'black';
}

const ChessboardComponent: React.FC<ChessboardProps> = ({ fen, game, currentPly, coachingReport, username, boardOrientation }) => {

  const customSquareStyles = useMemo<CustomSquareStyles>(() => {
    if (!coachingReport || !game) return {};

    const history = game.history({ verbose: true });
    if (currentPly === 0 || currentPly > history.length) return {};
    
    const currentMove = history[currentPly - 1];
    if (!currentMove) return {};

    const currentMoveNumber = Math.floor((currentPly - 1) / 2) + 1;
    const playerColor = (currentPly - 1) % 2 === 0 ? 'White' : 'Black';

    let moment: CriticalMoment | undefined;

    for (const weakness of coachingReport.weaknesses) {
      moment = weakness.criticalMoments.find(m => {
          const pgnColor = game.header()[playerColor] || '';
          const userIsPlayer = pgnColor.toLowerCase() === username.toLowerCase();
          // The PGN 'Site' header from chess.com conveniently contains the game URL.
          const gameUrlMatch = game.header().Site?.includes(m.gameUrl);
          
          return gameUrlMatch && m.moveNumber === currentMoveNumber && m.playerColor === playerColor && userIsPlayer;
      });
      if (moment) break;
    }


    if (moment) {
        return {
            [currentMove.from]: { backgroundColor: 'rgba(239, 68, 68, 0.6)' }, // red-500
            [currentMove.to]: { backgroundColor: 'rgba(239, 68, 68, 0.8)' },
        };
    }

    return {};
  }, [currentPly, coachingReport, game, username]);

  return (
    <div className="w-full max-w-[600px] mx-auto" style={{ display: 'block' }}>
      <Chessboard
        position={fen}
        boardOrientation={boardOrientation}
        customBoardTheme={{
          light: { backgroundColor: '#e6d5b8' },
          dark: { backgroundColor: '#8c6c5a' },
        }}
        customSquareStyles={customSquareStyles}
      />
    </div>
  );
};

const FallbackChessboard: React.FC = () => (
    <div className="w-full max-w-[600px] aspect-square bg-slate-700 flex items-center justify-center rounded-md">
        <p className="text-center text-slate-400">Chessboard library not available.<br/>This requires an environment with `react-chessboard` and `chess.js`.</p>
    </div>
);

// FIX: Change to React.FC to allow special props like 'key' to be passed without type errors.
const ExportedChessboard: React.FC<ChessboardProps> = (props) => {
    if (typeof Chessboard !== 'function' || typeof Chess !== 'function') {
        return <FallbackChessboard />;
    }
    return <ChessboardComponent {...props} />;
};


export default ExportedChessboard;