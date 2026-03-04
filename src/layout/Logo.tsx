import React from 'react';

const Logo: React.FC<{ className?: string; innerClassName?: string }> = ({
  className = "w-24 h-24",
  innerClassName = "scale-110"
}) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden bg-white border-2 border-brand-border shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-110 active:scale-95 group ${className}`}>
      <img
        src="/logo.jpeg"
        alt="Brent Street Pizza Logo"
        className={`w-full h-full object-contain transition-transform duration-500 group-hover:rotate-6 ${innerClassName}`}
      />
    </div>
  );
};

export default Logo;
