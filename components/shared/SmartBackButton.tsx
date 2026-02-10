
import React from 'react';

interface SmartBackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  isVisible?: boolean;
}

export const SmartBackButton: React.FC<SmartBackButtonProps> = ({ 
  onClick, 
  label = "GERİ DÖN", 
  className = "",
  isVisible = true 
}) => {
  if (!isVisible) return null;

  return (
    <button 
      onClick={onClick}
      className={`group flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95 no-print ${className}`}
      aria-label="Bir önceki adıma geri dön"
    >
      <div className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
    </button>
  );
};
