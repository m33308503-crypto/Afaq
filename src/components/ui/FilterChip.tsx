import React from 'react';
import { X } from 'lucide-react';

export interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  count?: number;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  onRemove,
  onClick,
  active = false,
  className = '',
  count,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-ui font-medium border transition-all duration-150 select-none ${
        active
          ? 'bg-[#20C5C2] border-[#1CA9A7] text-[#0B253A] shadow-xs'
          : 'bg-[#EDFAFA] border-[#B3EBEA] text-[#0E2F4A] hover:bg-[#D7F5F4]'
      } ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`inline-flex items-center justify-center text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
            active ? 'bg-[#0E2F4A] text-white' : 'bg-[#D7F5F4] text-[#126E6D]'
          }`}
        >
          {count}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 -ml-1 mr-0.5 rounded-full hover:bg-black/10 text-current transition-colors focus:outline-none"
          title={`إزالة فلتر ${label}`}
          aria-label={`إزالة فلتر ${label}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
