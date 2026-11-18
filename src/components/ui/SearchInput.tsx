import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value: string;
  onChangeValue: (value: string) => void;
  onClear?: () => void;
  wrapperClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeValue,
  onClear,
  placeholder = 'ابحث عن فعاليات، ورش، أو دورات...',
  className = '',
  wrapperClassName = '',
  disabled,
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${wrapperClassName}`}>
      {/* Right Search Icon (in RTL it appears on the right side) */}
      <div className="absolute right-4 pointer-events-none text-slate-400">
        <Search className="w-5 h-5" strokeWidth={1.75} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-12 pr-12 pl-10 text-sm font-ui bg-white text-slate-900 border border-slate-200 rounded-xl placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-[#20C5C2] focus:ring-2 focus:ring-[#20C5C2]/30 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
        {...props}
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChangeValue('');
            onClear?.();
          }}
          className="absolute left-3 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="مسح البحث"
          aria-label="مسح البحث"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
