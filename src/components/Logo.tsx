import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
  mono?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', mono = false }) => {
  if (variant === 'mark') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 96 96"
        className={`w-8 h-8 shrink-0 ${className}`}
        role="img"
        aria-label="Ownbench mark"
      >
        <rect width="96" height="96" rx="20" fill={mono ? 'currentColor' : '#1F7A55'} />
        <rect x="14" y="66" width="68" height="10" rx="2" fill="#FAFAF6" />
        <circle cx="48" cy="45" r="21" fill={mono ? '#FAFAF6' : '#F2C230'} />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* The 3-shape mark: Cutting mat green, chalk bar bench, yellow tool disc */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 96 96"
        className="w-8 h-8 shrink-0"
        role="img"
        aria-label="Ownbench icon"
      >
        <rect width="96" height="96" rx="20" fill={mono ? 'currentColor' : '#1F7A55'} />
        <rect x="14" y="66" width="68" height="10" rx="2" fill="#FAFAF6" />
        <circle cx="48" cy="45" r="21" fill={mono ? '#FAFAF6' : '#F2C230'} />
      </svg>
      <span className="font-display font-extrabold text-2xl tracking-tight text-current leading-none">
        Ownbench
      </span>
    </div>
  );
};
