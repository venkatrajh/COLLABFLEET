import React from 'react';
import { Sparkles } from 'lucide-react';

interface CollaborationBadgeProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
}

export const CollaborationBadge: React.FC<CollaborationBadgeProps> = ({ score, size = 'md' }) => {
  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-brand-cyan stroke-brand-cyan';
    if (val >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (val >= 70) return 'text-amber-400 stroke-amber-400';
    return 'text-slate-400 stroke-slate-400';
  };

  const radius = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const stroke = size === 'sm' ? 2.5 : size === 'lg' ? 4 : 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg 
          className="transform -rotate-90" 
          width={(radius + stroke) * 2} 
          height={(radius + stroke) * 2}
        >
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <span className={`absolute font-extrabold ${
          size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'
        } text-white`}>
          {score}
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300">
          <Sparkles className="w-3 h-3 text-brand-cyan" />
          <span>Collaboration Score</span>
        </div>
        <span className="text-[10px] text-slate-400">
          {score >= 90 ? 'Outstanding capacity & route fit' : 'Good collaborative match'}
        </span>
      </div>
    </div>
  );
};
