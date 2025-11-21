
import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from './icons';

interface ControlsProps {
  currentPly: number;
  totalPly: number;
  onNavigate: (ply: number) => void;
}

const ControlButton: React.FC<{ onClick: () => void; disabled: boolean, children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-2 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      {children}
    </button>
);


const Controls: React.FC<ControlsProps> = ({ currentPly, totalPly, onNavigate }) => {
  const totalMoves = Math.ceil(totalPly / 2);
  const currentMoveNumber = Math.floor((currentPly + 1) / 2);

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <ControlButton onClick={() => onNavigate(0)} disabled={currentPly === 0}>
        <ChevronsLeftIcon />
      </ControlButton>
      <ControlButton onClick={() => onNavigate(currentPly - 1)} disabled={currentPly === 0}>
        <ChevronLeftIcon />
      </ControlButton>
      <div className="px-4 py-2 bg-slate-800 rounded-md text-sm font-mono w-24 text-center">
        {currentMoveNumber} / {totalMoves}
      </div>
      <ControlButton onClick={() => onNavigate(currentPly + 1)} disabled={currentPly >= totalPly}>
        <ChevronRightIcon />
      </ControlButton>
      <ControlButton onClick={() => onNavigate(totalPly)} disabled={currentPly >= totalPly}>
        <ChevronsRightIcon />
      </ControlButton>
    </div>
  );
};

export default Controls;
