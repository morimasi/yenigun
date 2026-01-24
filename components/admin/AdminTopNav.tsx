
import React, { useState, useEffect } from 'react';

interface AdminTopNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  institutionName: string;
  onRefresh: () => void;
  isProcessing: boolean;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  institutionName, 
  onRefresh, 
  isProcessing 
}) => {
  const MENU_ITEMS = [
    { id: 'pipeline', label: 'ADAY AKIŞI', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
    { id: 'analytics', label: 'STRATEJİK VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
    { id: 'calendar', label: 'MÜLAKAT TAKVİMİ', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
    { id: 'decision', label: 'KARAR DESTEK', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'lab', label: 'KLİNİK LAB', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'settings', label: 'AYARLAR', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in no-print">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 w-full">
        <div className="md:w-72 p-8 bg-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden border border-slate-800 shrink-0 group">
          <div className="relative z-10">
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1 opacity-80">Yeni Gün AI</h2>
            <p className="text-xl font-black tracking-tighter leading-none">{institutionName.split(' ')[0]} AKADEMİ</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        <nav className="flex-1 flex items-center bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white shadow-xl shadow-slate-200/50 p-2 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 w-full min-w-max">
            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-7 py-4 rounded-[2rem] transition-all duration-500 font-black text-[10px] uppercase tracking-[0.15em] whitespace-nowrap ${
                  activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/40 translate-y-0' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <svg className={`w-3.5 h-3.5 ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
            
            <div className="flex-1 min-w-[20px]"></div>

            <button
                onClick={onRefresh}
                disabled={isProcessing}
                className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest transition-all hover:bg-black shadow-lg ${isProcessing ? 'opacity-70' : ''}`}
            >
                <svg className={`w-4 h-4 text-orange-500 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
                </svg>
                <span>TAZELA</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminTopNav;
