
import React, { useState } from 'react';

interface AdminTopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  institutionName: string;
  onRefresh: () => void;
  isProcessing: boolean;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({ activeTab, setActiveTab, institutionName, onRefresh, isProcessing }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const ALL_GROUPS = [
    {
      id: 'ops',
      label: 'OPERASYON',
      icon: 'M4 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM14 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM4 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      items: [
        { id: 'pipeline', label: 'Başvuru Havuzu', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'calendar', label: 'Mülakat Takvimi', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z' },
      ]
    },
    {
      id: 'academy',
      label: 'AKADEMİ',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      items: [
        { id: 'arms', label: 'Personel Dosyaları (ARMS)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'training', label: 'Hizmet İçi Eğitim', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l5 5v11a2 2 0 01-2 2z' },
        { id: 'archive', label: 'Dijital Arşiv', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
      ]
    },
    {
      id: 'sys',
      label: 'SİSTEM',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0',
      items: [
        { id: 'admin_dashboard', label: 'YÖNETİM PANELİ (ADMIN)', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
        { id: 'settings', label: 'Parametreler', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' },
      ]
    }
  ];

  return (
    <div className="flex items-center justify-between h-full px-6 bg-white text-slate-600 font-sans shadow-sm border-b border-slate-100">
      <div className="flex items-center gap-4 shrink-0 mr-12">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg border border-slate-700">YG</div>
        <h1 className="text-slate-900 text-sm font-black uppercase tracking-widest hidden xl:block">{institutionName}</h1>
      </div>

      <div className="flex-1 flex items-center gap-2">
        {ALL_GROUPS.map((group) => (
          <div key={group.id} className="relative group/cat">
            <button
              onClick={() => setOpenCategory(openCategory === group.id ? null : group.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[11px] font-black uppercase tracking-wide ${
                group.items.some(i => i.id === activeTab) ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={group.icon} />
              </svg>
              <span>{group.label}</span>
            </button>

            <div className={`absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[999] opacity-0 pointer-events-none group-hover/cat:opacity-100 group-hover/cat:pointer-events-auto transition-all translate-y-2 group-hover/cat:translate-y-0`}>
               {group.items.map(item => (
                 <button
                   key={item.id}
                   onClick={() => { setActiveTab(item.id); setOpenCategory(null); }}
                   className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full ${
                     activeTab === item.id ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
                   }`}
                 >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pl-6 border-l border-slate-100 ml-6 shrink-0 h-8">
        <button
          onClick={onRefresh}
          disabled={isProcessing}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 hover:text-orange-600 transition-all disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AdminTopNav;
