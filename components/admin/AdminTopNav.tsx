
import React, { useState, useRef, useEffect } from 'react';

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
      icon: 'M4 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM14 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM4 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      items: [
        { id: 'pipeline', label: 'Başvuru Havuzu', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'calendar', label: 'Mülakat Takvimi', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z' },
        { id: 'comm', label: 'İletişim Merkezi', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      ]
    },
    {
      id: 'analysis',
      label: 'ANALİZ',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      items: [
        { id: 'decision', label: 'Karar Destek (AI)', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'analytics', label: 'Genel İstatistik', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
      ]
    },
    {
      id: 'academy',
      label: 'AKADEMİ',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      items: [
        { id: 'training', label: 'Hizmet İçi Eğitim', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { id: 'arms', label: 'Personel Dosyaları', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'methodology', label: 'Soru Envanteri', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'archive', label: 'Dijital Arşiv', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
      ]
    },
    {
      id: 'sys',
      label: 'SİSTEM',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0',
      items: [
        { id: 'settings', label: 'Parametreler', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }
      ]
    }
  ];

  return (
    <div className="flex items-center justify-between h-full px-6 bg-white text-slate-600 font-sans" ref={navRef}>
      <div className="flex items-center gap-4 shrink-0 mr-8">
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md select-none border border-slate-700">
          YG
        </div>
        <div className="hidden xl:block">
           <h1 className="text-slate-900 text-[12px] font-black uppercase tracking-tight leading-none">{institutionName}</h1>
           <div className="flex items-center gap-1.5 mt-0.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AKADEMİ AKTİF v6.0</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-2 h-full">
        {GROUPS.map((group) => {
          const isGroupActive = group.items.some(i => i.id === activeTab);
          const isOpen = openCategory === group.id;

          return (
            <div key={group.id} className="relative h-full flex items-center">
              <button
                onClick={() => setOpenCategory(isOpen ? null : group.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[11px] font-black uppercase tracking-wide select-none group/btn ${
                  isGroupActive 
                  ? 'bg-orange-50 text-orange-700' 
                  : isOpen 
                    ? 'bg-slate-50 text-slate-900' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <svg className={`w-4 h-4 ${isGroupActive ? 'text-orange-600' : 'text-slate-400 group-hover/btn:text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={group.icon} />
                </svg>
                <span>{group.label}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isGroupActive ? 'text-orange-400' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute top-[calc(100%-4px)] left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[999] animate-scale-in origin-top-left flex flex-col gap-1">
                   {group.items.map(item => {
                     const isActive = activeTab === item.id;
                     return (
                       <button
                         key={item.id}
                         onClick={() => { setActiveTab(item.id); setOpenCategory(null); }}
                         className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group/item ${
                           isActive 
                           ? 'bg-slate-900 text-white shadow-md' 
                           : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                         }`}
                       >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 group-hover/item:text-slate-600'
                          }`}>
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                             </svg>
                          </div>
                          <div>
                             <span className="text-[11px] font-bold block leading-none mb-0.5">{item.label}</span>
                             <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-slate-300'}`}>Modül Erişimi</span>
                          </div>
                       </button>
                     );
                   })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pl-6 border-l border-slate-200 ml-6 shrink-0 h-8">
        <button
          onClick={onRefresh}
          disabled={isProcessing}
          title="Verileri Yenile"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 transition-all disabled:opacity-50 shadow-sm"
        >
          <svg className={`w-4 h-4 ${isProcessing ? 'animate-spin text-orange-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AdminTopNav;
