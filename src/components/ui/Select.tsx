import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  value: string;
  onChangeValue: (value: string) => void;
  wrapperClassName?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChangeValue,
  wrapperClassName = '',
  className = '',
  placeholder,
  disabled,
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${wrapperClassName}`}>
      <select
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        disabled={disabled}
        className={`w-full h-12 pr-4 pl-11 text-sm font-ui bg-white text-slate-900 border border-slate-200 rounded-xl appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#20C5C2] focus:ring-2 focus:ring-[#20C5C2]/30 hover:border-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="py-2 text-slate-900">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Left Chevron Icon (in RTL it appears on the left side) */}
      <div className="absolute left-3.5 pointer-events-none text-slate-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};
