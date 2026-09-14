import React from 'react';
import { DateRangePeriod } from '../../types/adminTypes';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  selectedPeriod: DateRangePeriod;
  onPeriodChange: (period: DateRangePeriod) => void;
  className?: string;
}

const PERIOD_OPTIONS: { key: DateRangePeriod; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: 'custom', label: 'Custom' }
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1 bg-[#FAF9F6] border border-[#E5E4DE] p-1 rounded-xl text-xs font-bold shrink-0 ${className}`}>
      <div className="pl-2 pr-1 text-neutral-400 flex items-center">
        <Calendar className="w-3.5 h-3.5" />
      </div>
      {PERIOD_OPTIONS.map((option) => {
        const isActive = selectedPeriod === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onPeriodChange(option.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
