
import React, { useState, useEffect } from 'react';

interface AdminTopNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  institutionName: string;
  onExportAll?: () => void;
  isExporting?: boolean;
  onRefresh: () => void;
  isProcessing: boolean;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  institutionName, 
  onExportAll, 
  isExporting, 
  onRefresh, 
  isProcessing 
}) => {
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString('tr-TR'));

  const handleRefresh = () => {
    onRefresh();
    setLastSync(new Date().toLocaleTimeString('tr-TR'));
  };

  const MENU_ITEMS = [
    { id: 'pipeline', label: 'ADAY AKIŞI', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
    { id: 'analytics', label: 'STRATEJİK VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
    { id: 'calendar', label: 'MÜLAKAT TAKVİMİ', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
    { id: 'settings', label: 'SİSTEM AYARLARI', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in no-print">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 w-full">
        {/* Kurumsal Marka Bloğu */}
        <div className="md:w-72 p-8 bg-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden border border-slate-800 shrink-0 group">
          <div className="relative z-10">
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1 opacity-80">Yeni Gün AI</h2>
            <p className="text-xl font-black tracking-tighter leading-none">{institutionName.split(' ')[0]} AKADEMİ</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        {/* Yatay Menü Bloğu */}
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

            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={handleRefresh}
                disabled={isProcessing}
                className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest transition-all hover:bg-black active:scale-95 shadow-lg ${isProcessing ? 'opacity-70' : ''}`}
              >
                <svg className={`w-4 h-4 text-orange-500 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
                </svg>
                <span>{isProcessing ? 'GÜNCELLENİYOR...' : 'ŞİMDİ TAZELA'}</span>
              </button>

              <button
                onClick={onExportAll}
                disabled={isExporting}
                className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] border-2 border-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-widest whitespace-nowrap transition-all hover:border-slate-300 hover:text-slate-600 ${isExporting ? 'opacity-50 cursor-wait' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>ZIP</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
      
      {/* Canlı Akış Durum Çubuğu */}
      <div className="flex justify-end px-12 -mt-2">
         <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
               CANLI AKIŞ AKTİF: Veriler her 30sn'de bir bulutla el sıkışıyor.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AdminTopNav;
