import React from 'react';

const Input = ({ label, error, suffix, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted ml-1 mb-0.5">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`w-full bg-bg/50 border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-muted/30 ${
            suffix ? 'pr-12' : ''
          } ${error ? 'border-danger/50 focus:border-danger' : ''}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted pointer-events-none group-focus-within:text-accent transition-colors">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="text-[10px] font-bold text-danger mt-1 ml-1 uppercase tracking-wider">{error}</span>}
    </div>
  );
};

export default Input;
