import React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  arrowPosition?: 'end' | 'start';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showArrow = false,
  arrowPosition = 'end',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles: pill shape, font-ui, transitions, focus-ring
  const baseStyles =
    'inline-flex items-center justify-center font-ui font-semibold rounded-full select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] focus-visible:ring-offset-2 active:scale-[0.98]';

  // Size variations
  const sizeStyles = {
    sm: 'text-xs h-9 px-4 gap-1.5',
    md: 'text-sm h-11 px-5 gap-2',
    lg: 'text-base h-12 px-7 gap-2.5',
  }[size];

  // Variant styling strictly from design tokens
  const variantStyles = {
    primary:
      'bg-[#123B5D] text-white hover:bg-[#0E2F4A] shadow-sm hover:shadow-[#123B5D]/20 active:bg-[#0B253A]',
    secondary:
      'bg-[#20C5C2] text-[#0B253A] hover:bg-[#1CA9A7] shadow-sm hover:shadow-[#20C5C2]/20 active:bg-[#168A88]',
    outline:
      'border-2 border-[#123B5D] text-[#123B5D] bg-transparent hover:bg-[#F1F3F5] active:bg-[#DEE4E8]',
    ghost:
      'text-[#123B5D] bg-transparent hover:bg-[#F1F3F5] active:bg-[#DEE4E8]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {showArrow && arrowPosition === 'start' && (
        <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
      )}
      <span>{children}</span>
      {showArrow && arrowPosition === 'end' && (
        <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
      )}
    </button>
  );
};
