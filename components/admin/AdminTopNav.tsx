
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
      label: 'AKADEMİ',
      items: [
        { id: 'pipeline', label: 'ADAYLAR', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
        { id: 'arms', label: 'KADRO (ARMS)', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      ]
    },
    {
      label: 'PLANLAMA',
      items: [
        { id: 'calendar', label: 'AJANDA', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
        { id: 'comm', label: 'MESAJLAR', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
      ]
    },
    {
      label: 'STRATEJİ',
      items: [
        { id: 'analytics', label: 'VERİ/KPI', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
        { id: 'lab', label: 'KLİNİK LAB', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
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
    <div className="w-full bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 h-14">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-black text-white text-xs">YG</div>
        <div className="hidden lg:block border-l border-slate-200 pl-3">
           <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none">{institutionName}</h2>
           <p className="text-[7px] font-bold text-orange-600 uppercase tracking-widest mt-1">YÖNETİM KOMUTASI</p>
        </div>
      </div>

      <nav className="flex items-center gap-1">
        {GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="flex items-center border-r last:border-0 border-slate-100 pr-2 mr-2 gap-1 h-8">
            <span className="hidden xl:block text-[8px] font-black text-slate-300 uppercase tracking-widest mr-2">{group.label}</span>
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-md scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <svg className={`w-3.5 h-3.5 ${activeTab === item.id ? 'text-orange-500' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                </svg>
                <span className={`text-[10px] font-black uppercase tracking-tight whitespace-nowrap ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex items-center">
         <button onClick={onRefresh} disabled={isProcessing} className={`p-2 text-slate-400 hover:text-orange-600 transition-colors ${isProcessing ? 'animate-spin' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
         </button>
      </div>
    </div>
  );
};

export default AdminTopNav;
