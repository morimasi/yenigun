
import React from 'react';

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
  const GROUPS = [
    {
      id: 'ops',
      label: 'OPS',
      items: [
        { id: 'pipeline', label: 'Başvuru', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'calendar', label: 'Takvim', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z' },
        { id: 'comm', label: 'İletişim', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      ]
    },
    {
      id: 'analysis',
      label: 'ANALİZ',
      items: [
        { id: 'decision', label: 'Karar (AI)', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'lab', label: 'Lab', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        { id: 'analytics', label: 'İstatistik', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      ]
    },
    {
      id: 'memory',
      label: 'KURUM',
      items: [
        { id: 'arms', label: 'Mentor', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { id: 'methodology', label: 'Envanter', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'archive', label: 'Arşiv', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
      ]
    },
    {
      id: 'sys',
      label: 'AYAR',
      items: [
        { id: 'settings', label: 'Sistem', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' }
      ]
    }
  ];

  return (
    <div className="flex items-center justify-between h-full px-4 bg-white text-slate-600">
      
      {/* BRAND & LOGO (Compact) */}
      <div className="flex items-center gap-3 shrink-0 mr-6">
        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm select-none">
          YG
        </div>
        <div className="hidden lg:block">
           <h1 className="text-slate-900 text-[11px] font-black uppercase tracking-tight leading-none">{institutionName}</h1>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">v5.1</span>
        </div>
      </div>

      {/* HORIZONTAL NAVIGATION (Dense) */}
      <div className="flex-1 flex items-center h-full overflow-x-auto gap-4 no-scrollbar">
        {GROUPS.map((group, idx) => (
          <React.Fragment key={group.id}>
            {/* SEPARATOR */}
            {idx > 0 && <div className="w-px h-6 bg-slate-200 shrink-0"></div>}
            
            {/* GROUP ITEMS */}
            <div className="flex items-center gap-1">
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-[11px] font-bold uppercase tracking-tight ${
                    activeTab === item.id 
                    ? 'bg-slate-100 text-orange-700 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* RIGHT ACTIONS (Minimal) */}
      <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-4 shrink-0 h-8">
        <button
          onClick={onRefresh}
          disabled={isProcessing}
          title="Yenile"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all disabled:opacity-50 border border-slate-200"
        >
          <svg className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AdminTopNav;
