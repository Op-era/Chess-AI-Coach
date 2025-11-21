import React, { useMemo } from 'react';
import { Chess } from 'chess.js';
import {
  WhitePawnIcon, WhiteKnightIcon, WhiteBishopIcon, WhiteRookIcon, WhiteQueenIcon,
  BlackPawnIcon, BlackKnightIcon, BlackBishopIcon, BlackRookIcon, BlackQueenIcon,
} from './icons';

interface CapturedPiecesProps {
  game: Chess;
  color: 'white' | 'black';
  currentPly: number;
}

const pieceValues: { [key: string]: number } = {
  p: 1, n: 3, b: 3, r: 5, q: 9,
};

const pieceComponents: { [key: string]: React.FC } = {
  'wp': WhitePawnIcon, 'wn': WhiteKnightIcon, 'wb': WhiteBishopIcon, 'wr': WhiteRookIcon, 'wq': WhiteQueenIcon,
  'bp': BlackPawnIcon, 'bn': BlackKnightIcon, 'bb': BlackBishopIcon, 'br': BlackRookIcon, 'bq': BlackQueenIcon,
};

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ game, color, currentPly }) => {
  const { captured, materialDiff } = useMemo(() => {
    const history = game.history({ verbose: true });
    let whiteCaptured = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    let blackCaptured = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    let whiteValue = 0;
    let blackValue = 0;

    for (let i = 0; i < currentPly; i++) {
      const move = history[i];
      if (move && move.captured) {
        if (move.color === 'w') { // White captured a black piece
          blackCaptured[move.captured]++;
          whiteValue += pieceValues[move.captured];
        } else { // Black captured a white piece
          whiteCaptured[move.captured]++;
          blackValue += pieceValues[move.captured];
        }
      }
    }

    const capturedByColor = color === 'white' ? blackCaptured : whiteCaptured;
    const pieces = [];
    for (const [piece, count] of Object.entries(capturedByColor)) {
      for (let i = 0; i < count; i++) {
        const pieceKey = `${color === 'white' ? 'b' : 'w'}${piece}`;
        pieces.push(pieceKey);
      }
    }
    
    return {
      captured: pieces,
      materialDiff: whiteValue - blackValue,
    };
  }, [game, currentPly, color]);

  const displayAdvantage = color === 'white' ? materialDiff : -materialDiff;

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-grow flex flex-wrap content-start gap-0.5">
        {captured.map((pieceKey, index) => {
          const PieceComponent = pieceComponents[pieceKey];
          return PieceComponent ? <PieceComponent key={index} /> : null;
        })}
      </div>
      {displayAdvantage > 0 && (
        <div className="text-sm font-semibold text-slate-400 self-center">
          +{displayAdvantage}
        </div>
      )}
    </div>
  );
};

export default CapturedPieces;
