
import React from 'react';

interface PredictBarProps {
  label: string;
  value: number;
  color: string;
  description?: string;
}

export const PredictBar: React.FC<PredictBarProps> = ({ label, value, color, description }) => (
  <div className="group space-y-4 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-end">
      <div>
         <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{label}</span>
         {description && <span className="text-[10px] font-bold text-slate-300 uppercase leading-none">{description}</span>}
      </div>
      <span className={`text-4xl font-black ${color}`}>%{value || 0}</span>
    </div>
    <div className="h-3.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')}`} 
        style={{ width: `${value || 0}%` }}
      ></div>
    </div>
  </div>
);
