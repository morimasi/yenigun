
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
        { id: 'pipeline', label: 'AKİŞ', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
        { id: 'calendar', label: 'TAKTAK', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
      ]
    },
    {
      label: 'ZEKA',
      items: [
        { id: 'analytics', label: 'VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
        { id: 'decision', label: 'KARAR', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'lab', label: 'LAB', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
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
    <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-4 w-full h-auto lg:h-[85vh] lg:w-[100px] lg:sticky lg:top-32 no-print z-[60]">
      {/* BRAND LOGO AREA (Hidden on small mobile) */}
      <div className="hidden lg:flex flex-col items-center justify-center p-4 mb-4 bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-800 shrink-0 group overflow-hidden">
        <span className="text-[8px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">YG</span>
        <div className="absolute -right-6 -bottom-6 w-12 h-12 bg-orange-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
      </div>

      {/* DOCK CONTAINER */}
      <nav className="flex-1 flex flex-row lg:flex-col items-center justify-center bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white shadow-2xl p-2 md:p-3 space-y-0 lg:space-y-8 overflow-x-auto lg:overflow-x-hidden custom-scrollbar">
        {GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-row lg:flex-col items-center gap-2 lg:gap-4 px-2 lg:px-0">
            {/* Kategori Etiketi (Dikey) */}
            <span className="hidden lg:block text-[7px] font-black text-slate-300 uppercase tracking-[0.3em] origin-center -rotate-180 [writing-mode:vertical-lr] mb-2">{group.label}</span>
            
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl transition-all duration-500 ${
                  activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <svg className={`w-5 h-5 md:w-6 md:h-6 ${activeTab === item.id ? 'text-white animate-pulse-slow' : 'text-slate-300 group-hover:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={item.icon} />
                </svg>
                <span className="text-[7px] font-black uppercase mt-1 tracking-tighter hidden lg:block opacity-60 group-hover:opacity-100">{item.label}</span>
                
                {/* TOOLTIP (Optional on Sidebar) */}
                <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[8px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] hidden lg:block shadow-2xl">
                  {item.id.toUpperCase()} MODÜLÜ
                </div>
              </button>
            ))}
            
            {gIdx !== GROUPS.length - 1 && <div className="hidden lg:block w-8 h-[1px] bg-slate-100 mx-auto my-2"></div>}
          </div>
        ))}

        {/* MOBILE REFRESH (Visible only on top bar mobile) */}
        <button
            onClick={onRefresh}
            disabled={isProcessing}
            className="flex lg:hidden items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white ml-auto"
        >
            <svg className={`w-5 h-5 text-orange-500 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
            </svg>
        </button>
      </nav>
    </div>
  );
};

export default AdminTopNav;
