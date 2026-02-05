
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
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10',
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
    <div className="flex items-center justify-between h-full px-4 md:px-6 bg-white text-slate-600 font-sans" ref={navRef}>
      <div className="flex items-center gap-3 shrink-0 mr-4 md:mr-8">
        <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs md:text-sm shadow-md border border-slate-700">YG</div>
        <div className="hidden sm:block">
           <h1 className="text-slate-900 text-[10px] md:text-[12px] font-black uppercase tracking-tight leading-none truncate max-w-[120px] md:max-w-none">{institutionName}</h1>
           <div className="flex items-center gap-1.5 mt-1">
             <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
             <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">AKADEMİ AKTİF</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-1 md:gap-2 h-full overflow-x-auto no-scrollbar scroll-smooth">
        {GROUPS.map((group) => {
          const isGroupActive = group.items.some(i => i.id === activeTab);
          const isOpen = openCategory === group.id;

          return (
            <div key={group.id} className="relative h-full flex items-center shrink-0">
              <button
                onClick={() => setOpenCategory(isOpen ? null : group.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all text-[10px] md:text-[11px] font-black uppercase tracking-wide select-none group/btn whitespace-nowrap ${
                  isGroupActive 
                  ? 'bg-orange-50 text-orange-700' 
                  : isOpen 
                    ? 'bg-slate-50 text-slate-900' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="hidden md:inline">{group.label}</span>
                <span className="md:hidden">{group.label.substring(0, 4)}..</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute top-[calc(100%-4px)] left-0 w-56 md:w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[999] animate-scale-in origin-top-left flex flex-col gap-1">
                   {group.items.map(item => (
                       <button
                         key={item.id}
                         onClick={() => { setActiveTab(item.id); setOpenCategory(null); }}
                         className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${activeTab === item.id ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}`}
                       >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTab === item.id ? 'bg-white/10' : 'bg-slate-100'}`}><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                          <span className="text-[11px] font-bold uppercase truncate">{item.label}</span>
                       </button>
                   ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 md:gap-3 pl-4 md:pl-6 border-l border-slate-200 ml-2 md:ml-6 shrink-0 h-8">
        <NotificationCenter />
        <button onClick={onRefresh} className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-orange-600 transition-all ${isProcessing ? 'animate-spin' : ''}`}>
           <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default AdminTopNav;
