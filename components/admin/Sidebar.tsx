
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  institutionName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, institutionName }) => {
  const MENU_ITEMS = [
    { id: 'pipeline', label: 'ADAY AKIŞI', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
    { id: 'analytics', label: 'STRATEJİK VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
    { id: 'calendar', label: 'MÜLAKAT TAKVİMİ', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
    { id: 'settings', label: 'SİSTEM AYARLARI', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0' }
  ];

  return (
    <aside className="xl:w-80 space-y-6">
      <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-3 opacity-80">Yeni Gün AI</h2>
          <p className="text-3xl font-black tracking-tighter leading-none">{institutionName.split(' ')[0]}</p>
          <p className="text-[9px] mt-4 font-bold text-slate-500 tracking-widest uppercase">Dual-Engine v3.0</p>
        </div>
      </div>

      <nav className="p-3 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-sm space-y-2">
        {MENU_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[2.2rem] transition-all duration-500 font-black text-[11px] uppercase tracking-widest ${
              activeTab === item.id ? 'bg-orange-600 text-white shadow-2xl translate-x-3' : 'text-slate-500 hover:bg-white'
            }`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
