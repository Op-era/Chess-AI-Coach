import React from 'react';
import { CoachingReport, CriticalMoment } from '../types';
import { BrainCircuitIcon } from './icons';
import { Chess } from 'chess.js';

interface AnalysisPanelProps {
  coachingReport: CoachingReport | null;
  isAnalyzing: boolean;
  analysisStatus: string;
  username: string;
  currentPly: number;
  game: Chess | null; // Game currently on the board
  selectedGameUrl: string | null;
  onMomentSelect: (moment: CriticalMoment) => void;
}

const CriticalMomentCard: React.FC<{ moment: CriticalMoment, isHighlighted: boolean, onSelect: () => void }> = ({ moment, isHighlighted, onSelect }) => (
    <div 
        onClick={onSelect}
        className={`p-4 rounded-lg transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-sky-600 ${isHighlighted ? 'bg-sky-900/50 ring-2 ring-sky-500' : 'bg-slate-800'}`}>
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-lg text-slate-100">
                Move {moment.moveNumber}: {moment.moveNotation}
            </h4>
            <span className="text-sm font-mono px-2 py-1 bg-red-900/70 text-red-300 rounded-md">
                -{Math.round(moment.evaluationChange / 100)}.{Math.round(moment.evaluationChange % 100).toString().padStart(2,'0')}
            </span>
        </div>
        <div className="mt-2 space-y-3 text-sm">
            <div>
                <p className="font-semibold text-red-400">Why it's a mistake:</p>
                <p className="text-slate-300">{moment.reasoning}</p>
            </div>
            <div>
                <p className="font-semibold text-green-400">A better move: {moment.betterMove}</p>
                <p className="text-slate-300">{moment.betterMoveReasoning}</p>
            </div>
        </div>
    </div>
);


const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ coachingReport, isAnalyzing, analysisStatus, username, currentPly, game, selectedGameUrl, onMomentSelect }) => {
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-lg h-full">
                <BrainCircuitIcon />
                <p className="mt-2 text-lg font-semibold animate-pulse text-sky-400">{analysisStatus || 'Analyzing games...'}</p>
                <p className="text-sm text-slate-400">Using Stockfish engine and your local Ollama model.</p>
            </div>
        );
    }

    if (!coachingReport) {
        return (
             <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg h-full">
                <BrainCircuitIcon />
                <p className="mt-2 text-lg font-semibold text-slate-400">Coaching Report</p>
                <p className="text-sm text-slate-500 text-center">Select games and click "Analyze" to get an AI-powered coaching report.</p>
            </div>
        );
    }
    
    const currentMoveNumber = Math.floor((currentPly - 1) / 2) + 1;
    const playerColor = (currentPly - 1) % 2 === 0 ? 'White' : 'Black';

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-sky-400 border-b-2 border-slate-700 pb-2 mb-3">AI Coach Summary</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{coachingReport.overallSummary}</p>
            </div>

            {coachingReport.weaknesses.map((weakness, index) => (
                 <div key={index}>
                    <h3 className="text-xl font-bold text-amber-400 border-b-2 border-slate-700 pb-2 mb-3">{weakness.theme}</h3>
                    <p className="text-slate-300 mb-4">{weakness.explanation}</p>
                    <div className="space-y-4">
                        {weakness.criticalMoments.map((moment, momentIndex) => {
                            const isHighlighted = selectedGameUrl === moment.gameUrl &&
                                                moment.moveNumber === currentMoveNumber && 
                                                moment.playerColor === playerColor;
                            
                            // Only show moments for the user
                            if (!game) return null;
                            const pgnColor = game.header()[moment.playerColor] || '';
                            const userIsPlayer = pgnColor.toLowerCase() === username.toLowerCase();
                            if (!userIsPlayer) return null;

                            return <CriticalMomentCard key={momentIndex} moment={moment} isHighlighted={isHighlighted} onSelect={() => onMomentSelect(moment)} />;
                        })}
                    </div>
                </div>
            ))}

        </div>
    );
};

export default AnalysisPanel;