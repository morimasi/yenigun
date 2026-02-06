
import React, { useState, useRef, useEffect } from 'react';
import NotificationCenter from './NotificationCenter';

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
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const GROUPS = [
    {
      id: 'ops',
      label: 'OPERASYON',
      icon: 'M4 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM14 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z',
      items: [
        { id: 'pipeline', label: 'Başvuru Havuzu', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7' },
        { id: 'calendar', label: 'Mülakat Takvimi', icon: 'M8 7V3m8 4V3m-9 8h10' },
        { id: 'comm', label: 'İletişim Merkezi', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8' },
      ]
    },
    {
      id: 'analysis',
      label: 'ANALİZ',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 v10',
      items: [
        { id: 'decision', label: 'Karar Destek (AI)', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'analytics', label: 'Genel İstatistik', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4' },
      ]
    },
    {
      id: 'academy',
      label: 'AKADEMİ',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253',
      items: [
        { id: 'training', label: 'Hizmet İçi Eğitim', icon: 'M12 6.253v13m0-13' },
        { id: 'arms', label: 'Personel Dosyaları', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857' },
        { id: 'methodology', label: 'Soru Envanteri', icon: 'M9 5H7a2 2 0 00-2 2v12' },
        { id: 'archive', label: 'Dijital Arşiv', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4' },
      ]
    },
    {
      id: 'sys',
      label: 'SİSTEM',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066',
      items: [
        { id: 'settings', label: 'Parametreler', icon: 'M12 6V4m0 2a2 2 0 100 4' },
        { id: 'admin', label: 'ADMIN PANELİ', icon: 'M9 12l2 2 4-4m5.618-4.016' }
      ]
    }
  ];

  return (
    <div className="flex items-center justify-between h-full px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200 text-slate-600 font-sans relative z-[1001]" ref={navRef}>
      <div className="flex items-center gap-4 shrink-0 mr-12">
        <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-900/10 border border-slate-800">YG</div>
        <div className="hidden lg:block">
           <h1 className="text-slate-950 text-xs font-black uppercase tracking-tight leading-none">{institutionName}</h1>
           <div className="flex items-center gap-1.5 mt-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AKADEMİ KONTROL</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-1 h-full overflow-visible">
        {GROUPS.map((group) => {
          const isGroupActive = group.items.some(i => i.id === activeTab);
          const isOpen = openCategory === group.id;

          return (
            <div key={group.id} className="relative h-full flex items-center shrink-0">
              <button
                onClick={() => setOpenCategory(isOpen ? null : group.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-wide select-none group/btn ${
                  isGroupActive 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                  : isOpen 
                    ? 'bg-slate-100 text-slate-950' 
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <span>{group.label}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute top-[calc(100%-8px)] left-0 w-64 bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 p-3 z-[9999] animate-scale-in origin-top-left flex flex-col gap-1 ring-1 ring-black/5">
                   {group.items.map(item => (
                       <button
                         key={item.id}
                         onClick={() => { setActiveTab(item.id); setOpenCategory(null); }}
                         className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left group/item ${
                            activeTab === item.id 
                            ? 'bg-slate-950 text-white shadow-lg' 
                            : 'hover:bg-slate-50 text-slate-600 hover:text-slate-950'
                         }`}
                       >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                             activeTab === item.id ? 'bg-white/10' : 'bg-slate-100 group-hover/item:bg-orange-100'
                          }`}>
                             <svg className={`w-4 h-4 ${activeTab === item.id ? 'text-orange-500' : 'text-slate-400 group-hover/item:text-orange-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                             </svg>
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>
                       </button>
                   ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pl-8 border-l border-slate-200 ml-6 shrink-0 h-10">
        <NotificationCenter />
        <button 
           onClick={onRefresh} 
           className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm ${isProcessing ? 'animate-spin' : ''}`}
           title="Sistemi Senkronize Et"
        >
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
           </svg>
        </button>
      </div>
    </div>
  );
};

export default AdminTopNav;
