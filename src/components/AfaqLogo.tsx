import React from 'react';

interface AfaqLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark-on-light' | 'white-on-dark';
  showTagline?: boolean;
}

export const AfaqLogo: React.FC<AfaqLogoProps> = ({
  className = '',
  size = 'md',
  theme = 'dark-on-light',
  showTagline = false,
}) => {
  const isWhite = theme === 'white-on-dark';
  const textColor = isWhite ? 'text-white' : 'text-[#123B5D]';
  const subTextColor = isWhite ? 'text-white/80' : 'text-[#41627D]';

  // Sizing mappings
  const dimensions = {
    sm: { icon: 34, text: 'text-lg', subtext: 'text-[10px]' },
    md: { icon: 44, text: 'text-2xl', subtext: 'text-xs' },
    lg: { icon: 56, text: 'text-3xl', subtext: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon SVG: Curved Wave & Mountain Silhouette */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="شعار آفاق"
      >
        {/* Upper Deep Blue Arc (or White when inverted) */}
        <path
          d="M 12 78 C 22 52 42 22 66 18 C 84 15 92 28 88 40 C 85 49 76 54 68 53 C 58 52 48 38 46 28 C 36 38 24 58 20 78 Z"
          fill={isWhite ? '#FFFFFF' : '#123B5D'}
        />
        {/* Lower Vibrant Turquoise Arc */}
        <path
          d="M 28 82 C 40 60 56 46 72 45 C 80 44 86 50 84 56 C 81 63 71 67 62 65 C 50 63 39 74 34 82 Z"
          fill="#20C5C2"
        />
      </svg>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-heading font-extrabold tracking-tight ${dimensions.text} ${textColor}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          آفـاق
        </span>
        <span
          className={`font-ui font-bold tracking-[0.22em] uppercase mt-0.5 ${dimensions.subtext} ${subTextColor}`}
        >
          AFAQ
        </span>
        {showTagline && (
          <span className="text-[11px] text-[#20C5C2] font-ui mt-0.5">
            اكتشف آفاقك الجديدة
          </span>
        )}
      </div>
    </div>
  );
};
