
import React, { useState, useRef, useEffect } from 'react';
import { UserSession, StaffRole } from '../../types';

interface AdminTopNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  institutionName: string;
  onRefresh: () => void;
  isProcessing: boolean;
  user: UserSession | null;
  onLogout?: () => void;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  institutionName, 
  onRefresh, 
  isProcessing,
  user,
  onLogout
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

  const ALL_GROUPS = [
    {
      id: 'ops',
      label: 'OPERASYON',
      roles: [StaffRole.Admin, StaffRole.Mentor],
      icon: 'M4 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM14 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM4 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      items: [
        { id: 'pipeline', label: 'Başvuru Havuzu', roles: [StaffRole.Admin, StaffRole.Mentor], icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'calendar', label: 'Mülakat Takvimi', roles: [StaffRole.Admin, StaffRole.Mentor], icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z' },
        { id: 'comm', label: 'İletişim Merkezi', roles: [StaffRole.Admin], icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      ]
    },
    {
      id: 'clinic',
      label: 'KLİNİK & ANALİZ',
      roles: [StaffRole.Admin, StaffRole.Mentor],
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      items: [
        { id: 'clinical_lab', label: 'Nöral Test Lab', roles: [StaffRole.Admin, StaffRole.Mentor], icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        { id: 'decision', label: 'MİA Muhakeme', roles: [StaffRole.Admin], icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { id: 'analytics', label: 'Yetenek İstatistik', roles: [StaffRole.Admin, StaffRole.Mentor], icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
      ]
    },
    {
      id: 'academy',
      label: 'AKADEMİ & KADRO',
      roles: [StaffRole.Admin, StaffRole.Mentor, StaffRole.Staff],
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      items: [
        { id: 'arms', label: 'Personel (ARMS)', roles: [StaffRole.Admin, StaffRole.Mentor], icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'training', label: 'Eğitim Fabrikası', roles: [StaffRole.Admin, StaffRole.Mentor, StaffRole.Staff], icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l5 5v11a2 2 0 01-2 2z' },
        { id: 'archive', label: 'Dijital Arşiv', roles: [StaffRole.Admin], icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
      ]
    },
    {
      id: 'sys',
      label: 'YÖNETİM',
      roles: [StaffRole.Admin],
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      items: [
        { id: 'admin_dashboard', label: 'Admin Paneli', roles: [StaffRole.Admin], icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'methodology', label: 'Envanter Editörü', roles: [StaffRole.Admin], icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'settings', label: 'Sistem Ayarları', roles: [StaffRole.Admin], icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' }
      ]
    }
  ];

  const userRole = user?.role || StaffRole.Staff;
  const filteredGroups = ALL_GROUPS.filter(g => g.roles.includes(userRole));

  return (
    <div className="flex items-center justify-between h-full px-6 bg-white text-slate-600 font-sans border-b border-slate-100" ref={navRef}>
      <div className="flex items-center gap-4 shrink-0 mr-8">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md border border-slate-700 select-none">YG</div>
        <div className="hidden xl:block">
           <h1 className="text-slate-900 text-[12px] font-black uppercase tracking-tight leading-none">{institutionName}</h1>
           <div className="flex items-center gap-1.5 mt-0.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{userRole.toUpperCase()} MODU AKTİF</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-1 h-full">
        {filteredGroups.map((group) => {
          const groupItems = group.items.filter(i => i.roles.includes(userRole));
          const isGroupActive = groupItems.some(i => i.id === activeTab);
          const isOpen = openCategory === group.id;

          return (
            <div key={group.id} className="relative h-full flex items-center group/cat">
              <button
                onClick={() => setOpenCategory(isOpen ? null : group.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-[11px] font-black uppercase tracking-wide select-none ${
                  isGroupActive 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <svg className={`w-4 h-4 ${isGroupActive ? 'text-orange-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={group.icon} />
                </svg>
                <span>{group.label}</span>
              </button>

              <div className={`absolute top-[calc(100%-8px)] left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[999] transition-all origin-top-left ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 {groupItems.map(item => {
                   const isActive = activeTab === item.id;
                   return (
                     <button
                       key={item.id}
                       onClick={() => { setActiveTab(item.id); setOpenCategory(null); }}
                       className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group/item w-full ${
                         isActive 
                         ? 'bg-slate-900 text-white shadow-lg' 
                         : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                       }`}
                     >
                        <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover/item:text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>
                     </button>
                   );
                 })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pl-6 border-l border-slate-100 ml-6 shrink-0 h-8">
        <button
          onClick={onRefresh}
          disabled={isProcessing}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 hover:text-orange-600 transition-all disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isProcessing ? 'animate-spin text-orange-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
          </svg>
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all"
        >
          ÇIKIŞ
        </button>
      </div>
    </div>
  );
};

export default AdminTopNav;
