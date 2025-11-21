import React from 'react';
import { ChessComGame } from '../types';

interface GameListProps {
  games: ChessComGame[];
  onViewGame: (game: ChessComGame) => void;
  onToggleGameSelection: (gameUrl: string) => void;
  selectedGameUrls: string[];
  currentlyViewingUrl: string | null;
  isLoading: boolean;
}

const GameItem: React.FC<{
    game: ChessComGame,
    isSelectedForAnalysis: boolean,
    isCurrentlyViewing: boolean,
    onView: () => void,
    onToggle: () => void
}> = ({ game, isSelectedForAnalysis, isCurrentlyViewing, onView, onToggle }) => {
    const white = game.white.username;
    const black = game.black.username;
    const result = game.white.result === 'win' ? '1-0' : game.black.result === 'win' ? '0-1' : '½-½';
    const date = new Date(game.end_time * 1000).toLocaleDateString();

    return (
        <li
            onClick={onView}
            className={`p-3 rounded-lg transition-colors flex items-center gap-3 cursor-pointer ${isCurrentlyViewing ? 'bg-sky-800' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
            <input
                type="checkbox"
                checked={isSelectedForAnalysis}
                onChange={onToggle}
                onClick={(e) => e.stopPropagation()}
                className="form-checkbox h-5 w-5 bg-slate-700 border-slate-600 rounded text-sky-500 focus:ring-sky-500"
                aria-label={`Select game between ${white} and ${black} for analysis`}
            />
            <div className="flex-grow">
                 <div className="flex justify-between items-center text-sm font-semibold">
                    <span>{white} ({game.white.rating})</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${result === '1-0' ? 'bg-green-700' : result === '0-1' ? 'bg-red-700' : 'bg-slate-600'}`}>
                        {result}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                    <span>{black} ({game.black.rating})</span>
                </div>
                <div className="text-xs text-slate-400 flex justify-between">
                    <span>{game.time_class}</span>
                    <span>{date}</span>
                </div>
            </div>
        </li>
    );
};

const GameList: React.FC<GameListProps> = ({ games, onViewGame, onToggleGameSelection, selectedGameUrls, currentlyViewingUrl, isLoading }) => {
  if (isLoading) {
    return (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                 <div key={i} className="bg-slate-800 p-3 rounded-lg animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                 </div>
            ))}
        </div>
    );
  }
  
  if (games.length === 0) {
      return <div className="text-center text-slate-500 py-10">No recent games found.</div>
  }

  return (
    <ul className="space-y-2">
      {games.map(game => (
        <GameItem 
            key={game.url} 
            game={game}
            isSelectedForAnalysis={selectedGameUrls.includes(game.url)}
            isCurrentlyViewing={currentlyViewingUrl === game.url}
            onView={() => onViewGame(game)}
            onToggle={() => onToggleGameSelection(game.url)}
        />
      ))}
    </ul>
  );
};

export default GameList;