
import React, { useState, useRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  variant?: 'default' | 'glass' | 'solid' | 'primary';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style, variant = 'default' }) => {
  const baseStyles = "rounded-3xl transition-all duration-300 relative overflow-hidden";
  
  // Theme-specific variants
  const variants = {
    default: "bg-white dark:bg-navy-900 border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-none",
    glass: "bg-white/80 dark:bg-navy-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-none",
    solid: "bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-white/5",
    primary: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 border border-white/10"
  };

  return (
    <div 
      onClick={onClick}
      style={style}
      className={`
        ${baseStyles}
        ${variants[variant]}
        p-5
        ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.98]' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide";
  
  const variants = {
    primary: "bg-slate-900 dark:bg-blue-600 text-white shadow-lg hover:bg-slate-800 dark:hover:bg-blue-500 hover:shadow-xl dark:shadow-blue-900/20",
    gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border border-white/10",
    secondary: "bg-white dark:bg-navy-800 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-navy-700",
    ghost: "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
    danger: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const ProgressBar: React.FC<{ progress: number; color?: string }> = ({ progress, color = 'bg-blue-600' }) => (
  <div className="h-1.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden mt-3">
    <div 
      className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
    />
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-200' }) => (
  <span className={`${color} px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-transparent`}>
    {children}
  </span>
);

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  onEdit?: () => void;
  className?: string;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({ children, onDelete, onEdit, className = '' }) => {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Maximum swipe distance (approx width of buttons)
  // If Edit exists: -150px (wider for labels), else -80px
  const maxSwipe = onEdit ? -150 : -80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    if (diff < 0) {
      // Add resistance
      setOffset(Math.max(diff, maxSwipe - 30));
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    // Threshold to snap open
    if (offset < (maxSwipe / 2)) {
      setOffset(maxSwipe); 
    } else {
      setOffset(0); 
    }
  };

  const reset = () => setOffset(0);

  return (
    <div className={`relative overflow-visible ${className}`}>
      {/* Background Actions - Ensure z-index is correct relative to content */}
      <div className="absolute inset-y-0 right-0 flex items-center justify-end h-full py-2 gap-2 pr-1 z-0">
        {onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); reset(); }} 
            className="w-16 h-[92%] bg-blue-500 rounded-2xl text-white flex flex-col items-center justify-center shadow-sm active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            <span className="text-[10px] font-bold mt-0.5">Edit</span>
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); reset(); }} 
          className="w-16 h-[92%] bg-red-500 rounded-2xl text-white flex flex-col items-center justify-center shadow-sm active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          <span className="text-[10px] font-bold mt-0.5">Delete</span>
        </button>
      </div>

      {/* Foreground Content - higher z-index to cover buttons */}
      <div 
        className="relative z-10 transition-transform duration-300 cubic-bezier(0.2, 0.8, 0.2, 1) touch-pan-y bg-transparent"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};
