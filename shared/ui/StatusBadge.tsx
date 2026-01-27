
import React from 'react';
import { Candidate } from '../../types';

interface StatusBadgeProps {
  status: Candidate['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const configs = {
    pending: { label: 'Beklemede', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    interview_scheduled: { label: 'Mülakat', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Reddedildi', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    hired: { label: 'İşe Alındı', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    withdrawn: { label: 'Çekildi', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.color}`}>
      {config.label}
    </span>
  );
};
