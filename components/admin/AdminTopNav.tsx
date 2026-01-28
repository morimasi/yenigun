
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
      label: 'OPERASYONEL SÜREÇ',
      items: [
        { id: 'pipeline', label: 'ADAY AKIŞI', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
        { id: 'calendar', label: 'TAKTAK TAKVİMİ', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
      ]
    },
    {
      label: 'STRATEJİK ZEKA',
      items: [
        { id: 'analytics', label: 'STRATEJİK VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
        { id: 'decision', label: 'KARAR DESTEK', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'lab', label: 'KLİNİK LAB', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
      ]
    },
    {
      label: 'YÖNETİM & SİSTEM',
      items: [
        { id: 'methodology', label: 'ENVANTER', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'settings', label: 'AYARLAR', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' }
      ]
    }
  ];

  return (
    <div className="flex flex-row lg:flex-col gap-6 w-full lg:w-[280px] lg:sticky lg:top-32 no-print z-[60] animate-fade-in">
      {/* KURUMSAL KİMLİK BLOĞU */}
      <div className="hidden lg:flex items-center gap-4 p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden relative group">
        <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg relative z-10">
          YG
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">AKADEMİ</p>
          <h2 className="text-[14px] font-black text-white uppercase tracking-tighter mt-1 truncate max-w-[140px]">{institutionName}</h2>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
      </div>

      {/* ANA NAVİGASYON GÖVDESİ */}
      <nav className="flex-1 flex flex-row lg:flex-col bg-white rounded-[3rem] border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] p-3 lg:p-4 space-y-0 lg:space-y-8 overflow-x-auto lg:overflow-x-hidden custom-scrollbar">
        {GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-row lg:flex-col px-2 lg:px-0 gap-2 lg:gap-2">
            {/* GRUP BAŞLIĞI */}
            <span className="hidden lg:block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 ml-4">
              {group.label}
            </span>
            
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30 translate-x-2' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <svg className={`w-6 h-6 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-orange-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                  </svg>
                </div>
                <span className={`text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-700'}`}>
                  {item.label}
                </span>
                
                {/* AKTİF İNDİKATÖRÜ */}
                {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                )}
              </button>
            ))}
            
            {gIdx !== GROUPS.length - 1 && (
              <div className="hidden lg:block h-[1px] bg-slate-100 mx-4 my-2 opacity-50"></div>
            )}
          </div>
        ))}

        {/* TAZELA BUTONU (Sidebara Entegre - Alt Kısım) */}
        <div className="hidden lg:block pt-4 mt-auto border-t border-slate-50">
           <button
              onClick={onRefresh}
              disabled={isProcessing}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all duration-500 bg-slate-900 text-white hover:bg-orange-600 shadow-lg ${isProcessing ? 'opacity-70' : ''}`}
           >
              <svg className={`w-6 h-6 text-orange-500 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
              </svg>
              <span className="text-[12px] font-black uppercase tracking-tight">TAZELA</span>
           </button>
        </div>

        {/* MOBİL REFRESH */}
        <button
            onClick={onRefresh}
            disabled={isProcessing}
            className="flex lg:hidden items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white ml-auto"
        >
            <svg className={`w-5 h-5 text-orange-500 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
            </svg>
        </button>
      </nav>
    </div>
  );
};

export default AdminTopNav;
