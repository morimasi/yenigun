
import React from 'react';

interface AdminTopNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  institutionName: string;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({ activeTab, setActiveTab, institutionName }) => {
  const MENU_ITEMS = [
    { id: 'pipeline', label: 'ADAY AKIŞI', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
    { id: 'analytics', label: 'STRATEJİK VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
    { id: 'calendar', label: 'MÜLAKAT TAKVİMİ', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
    { id: 'settings', label: 'SİSTEM AYARLARI', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0' }
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 w-full">
      {/* Kurumsal Marka Bloğu */}
      <div className="md:w-72 p-8 bg-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden border border-slate-800 shrink-0 group">
        <div className="relative z-10">
          <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1 opacity-80">Yeni Gün AI</h2>
          <p className="text-xl font-black tracking-tighter leading-none">{institutionName.split(' ')[0]} AKADEMİ</p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
      </div>

      {/* Yatay Menü Bloğu */}
      <nav className="flex-1 flex items-center bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white shadow-xl shadow-slate-200/50 p-3 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-3 w-full min-w-max">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-8 py-5 rounded-[2.2rem] transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap ${
                activeTab === item.id 
                ? 'bg-orange-600 text-white shadow-2xl shadow-orange-600/40 translate-y-0 scale-100' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminTopNav;
