import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  accent?: 'default' | 'green' | 'amber' | 'red' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon,
  accent = 'default'
}) => {
  const getAccentClass = () => {
    switch (accent) {
      case 'green':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'amber':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'red':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'blue':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-neutral-900 bg-[#FAF9F6] border-[#EBEAE5]';
    }
  };

  return (
    <div className="bg-white border border-[#E5E4DE] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#111111] transition-all space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        {icon && (
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${getAccentClass()}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
          {value}
        </div>

        {(subtext || trend) && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium pt-0.5">
            {trend && (
              <span className={`font-bold inline-flex items-center gap-0.5 ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {trend.value}
              </span>
            )}
            {subtext && <span>{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
