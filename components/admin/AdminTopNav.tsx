
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
        { id: 'comm', label: 'İLETİŞİM', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
      ]
    },
    {
      label: 'STRATEJİ',
      items: [
        { id: 'analytics', label: 'VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
        { id: 'decision', label: 'KARAR', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'arms', label: 'MENTOR (ARMS)', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      ]
    },
    {
      label: 'BELLEK',
      items: [
        { id: 'archive', label: 'ARŞİV', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
        { id: 'methodology', label: 'ENVANTER', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      ]
    },
    {
      label: 'SİSTEM',
      items: [
        { id: 'settings', label: 'AYARLAR', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' }
      ]
    }
  ];

  return (
    <div className="flex flex-col bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] mt-2 p-2">
      <div className="flex items-center justify-between gap-4 px-6 h-16">
        <div className="flex items-center gap-4 py-2 px-4 bg-slate-900 rounded-2xl shadow-lg border border-slate-800">
          <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center font-black text-sm">YG</div>
          <div className="hidden md:block">
            <h2 className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{institutionName}</h2>
            <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest mt-1">YÖNETİM KOMUTASI</p>
          </div>
        </div>

        <nav className="flex-1 flex items-center justify-center gap-1 md:gap-4 overflow-x-auto no-scrollbar">
          {GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="flex items-center gap-1 md:gap-2 px-2 md:px-4 border-r last:border-0 border-slate-100 h-10">
              <span className="hidden xl:block text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mr-2">{group.label}</span>
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <svg className={`w-4 h-4 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                  </svg>
                  <span className={`text-[10px] font-black uppercase tracking-tight whitespace-nowrap ${activeTab === item.id ? 'text-white' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
           <button
              onClick={onRefresh}
              disabled={isProcessing}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 bg-slate-50 text-slate-400 hover:bg-orange-600 hover:text-white ${isProcessing ? 'opacity-70' : ''}`}
              title="Sistemi Tazela"
           >
              <svg className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
              </svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTopNav;
