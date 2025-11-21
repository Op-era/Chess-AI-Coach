import React, { useMemo } from 'react';

interface EvaluationBarProps {
  score: number; // in centipawns, from White's perspective
  isLoading: boolean;
}

const EvaluationBar: React.FC<EvaluationBarProps> = ({ score, isLoading }) => {
    // A sigmoid-like function to map score to a percentage (0-100)
    // This makes the bar more responsive to changes near 0
    const getWhiteHeightPercentage = (cp: number) => {
        if (cp > 29000) return 100; // Mate for white
        if (cp < -29000) return 0;  // Mate for black
        // Clamp the score for visualization to prevent massive swings from looking identical
        const cappedCp = Math.max(-1000, Math.min(1000, cp));
        return 100 / (1 + Math.exp(-0.004 * cappedCp));
    };

    const whiteHeight = getWhiteHeightPercentage(score);
    
    const formattedScore = useMemo(() => {
        if (isLoading) return '...';
        if (Math.abs(score) > 29000) {
            const mateIn = 30000 - Math.abs(score);
            return `#${mateIn}`;
        }
        const pawnAdvantage = (score / 100).toFixed(1);
        // Avoid showing "-0.0"
        if (pawnAdvantage === '-0.0') return '0.0';
        return parseFloat(pawnAdvantage) >= 0 ? `+${pawnAdvantage}` : pawnAdvantage;
    }, [score, isLoading]);

    return (
        <div className="flex flex-col items-center w-8 h-full">
             <div className="w-full flex-grow relative bg-slate-700 rounded-full overflow-hidden my-1">
                {isLoading ? (
                    <div className="absolute inset-0 bg-slate-700 animate-pulse" />
                ) : (
                    <div 
                        className="absolute bottom-0 left-0 right-0 bg-slate-200 transition-all duration-300 ease-in-out"
                        style={{ height: `${whiteHeight}%` }}
                    />
                )}
            </div>
            <div className="h-6 flex items-center justify-center">
                <p className="font-mono font-bold text-sm text-slate-200">{formattedScore}</p>
            </div>
        </div>
    );
};

export default EvaluationBar;
