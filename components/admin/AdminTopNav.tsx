
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
      label: 'OPERASYON',
      items: [
        { id: 'pipeline', label: 'ADAY AKIŞI', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
        { id: 'calendar', label: 'TAKTAK', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
      ]
    },
    {
      label: 'STRATEJİ',
      items: [
        { id: 'analytics', label: 'VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
        { id: 'decision', label: 'KARAR', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'lab', label: 'KLİNİK LAB', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
      ]
    },
    {
      label: 'SİSTEM',
      items: [
        { id: 'methodology', label: 'ENVANTER', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'settings', label: 'AYARLAR', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' }
      ]
    }
  ];

  return (
    <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-[240px] lg:sticky lg:top-8 no-print z-[60] animate-fade-in h-fit">
      {/* BRAND UNIT */}
      <div className="hidden lg:flex items-center gap-3 p-5 bg-slate-900 rounded-[2rem] shadow-xl border border-slate-800 overflow-hidden relative group">
        <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg relative z-10">YG</div>
        <div className="relative z-10 min-w-0">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">AKADEMİ</p>
          <h2 className="text-[12px] font-black text-white uppercase tracking-tighter mt-1 truncate">{institutionName}</h2>
        </div>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 flex flex-row lg:flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-2 lg:p-3 space-y-0 lg:space-y-4 overflow-x-auto lg:overflow-x-hidden">
        {GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-row lg:flex-col px-1 lg:px-0 gap-1 lg:gap-1">
            <span className="hidden lg:block text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1 ml-4">{group.label}</span>
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <svg className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-orange-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                </svg>
                <span className={`text-[11px] font-black uppercase tracking-tight whitespace-nowrap ${activeTab === item.id ? 'text-white' : 'text-slate-600'}`}>
                  {item.label}
                </span>
              </button>
            ))}
            {gIdx !== GROUPS.length - 1 && <div className="hidden lg:block h-[1px] bg-slate-50 mx-4 my-2"></div>}
          </div>
        ))}

        {/* REFRESH BOTTOM */}
        <div className="hidden lg:block pt-2 mt-auto border-t border-slate-50">
           <button
              onClick={onRefresh}
              disabled={isProcessing}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-500 bg-slate-50 text-slate-400 hover:bg-orange-600 hover:text-white ${isProcessing ? 'opacity-70' : ''}`}
           >
              <svg className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-tight">SİSTEMİ TAZELA</span>
           </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminTopNav;
