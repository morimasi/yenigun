
import React, { useState, useEffect } from 'react';
import { Candidate, StaffMember, GlobalConfig, StaffRole, Branch } from '../../types';
import MethodologyInventoryView from './MethodologyInventoryView';
import SettingsView from './SettingsView';
import { storageService } from '../../services/storageService';

interface AdminPanelProps {
  candidates: Candidate[];
  onRefresh: () => void;
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ candidates, onRefresh, config, onUpdateConfig }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'inventory' | 'system'>('users');
  const [userType, setUserType] = useState<'candidate' | 'staff'>('candidate');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (activeSubTab === 'users' && userType === 'staff') {
      fetchStaff();
    }
  }, [activeSubTab, userType]);

  const fetchStaff = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/staff?action=list_all');
      if (res.ok) setStaffList(await res.json());
    } finally { setIsProcessing(false); }
  };

  const handleDeleteUser = async (id: string, type: 'candidate' | 'staff') => {
    if (!confirm("BU İŞLEM GERİ ALINAMAZ: Seçili kayıt veri tabanından tamamen imha edilecektir. Onaylıyor musunuz?")) return;
    setIsProcessing(true);
    try {
      if (type === 'candidate') {
        await storageService.deleteCandidate(id);
        onRefresh();
      } else {
        await fetch(`/api/staff?action=delete&id=${id}`, { method: 'DELETE' });
        fetchStaff();
      }
    } finally { setIsProcessing(false); }
  };

  const handlePromote = async (candidate: Candidate) => {
    if (!confirm(`${candidate.name} için personel atama süreci başlatılacak. Onaylıyor musunuz?`)) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/staff?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: candidate.name,
          email: candidate.email,
          branch: candidate.branch,
          experience_years: candidate.experienceYears,
          role: StaffRole.Staff,
          password: 'yg' + Math.floor(1000 + Math.random() * 9000)
        })
      });
      if (res.ok) {
        await storageService.updateCandidate({
          ...candidate,
          status: 'archived',
          archiveCategory: 'HIRED_CONTRACTED',
          archiveNote: 'Akademik mülakat sonrası personel olarak atandı.'
        });
        alert("Atama başarılı. Aday dosyası 'Dijital Arşiv' modülüne mühürlendi.");
        onRefresh();
      }
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      
      {/* GLOBAL ADMIN NAV */}
      <div className="bg-slate-950 p-4 flex justify-between items-center shrink-0 border-b border-white/5">
        <div className="flex gap-2">
           {[
             { id: 'users', label: 'KULLANICI YÖNETİMİ', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
             { id: 'inventory', label: 'METODOLOJİ STÜDYOSU', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2' },
             { id: 'system', label: 'SİSTEM PARAMETRELERİ', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveSubTab(tab.id as any)} 
               className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
               {tab.label}
             </button>
           ))}
        </div>
        <div className="flex items-center gap-4 pr-4">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Çekirdek Aktif</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative z-0">
        {activeSubTab === 'users' && (
          <div className="flex-1 flex flex-col p-8 space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                <button onClick={() => setUserType('candidate')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${userType === 'candidate' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Başvuru Havuzu</button>
                <button onClick={() => setUserType('staff')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${userType === 'staff' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Akademik Kadro</button>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam Kayıt</p>
                   <p className="text-xl font-black text-slate-900 leading-none mt-1">{userType === 'candidate' ? candidates.length : staffList.length}</p>
                </div>
                <button onClick={onRefresh} className={`p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all ${isProcessing ? 'animate-spin' : ''}`}>
                   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-200 rounded-[3rem] bg-white shadow-inner">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 z-10">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Klinik Kimlik & Branş</th>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">E-Posta & İletişim</th>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Statüsü</th>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">MIA Aksiyonları</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(userType === 'candidate' ? candidates : staffList).map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-sm shadow-inner group-hover:bg-orange-600 group-hover:text-white transition-all">{u.name.charAt(0)}</div>
                           <div>
                              <p className="text-[13px] font-black text-slate-900 uppercase leading-none mb-1.5">{u.name}</p>
                              <p className="text-[9px] font-bold text-orange-600 uppercase tracking-tight">{u.branch}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-[11px] font-bold text-slate-600 lowercase">{u.email}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1">{u.phone || 'Girilmemiş'}</p>
                      </td>
                      <td className="p-6">
                        {userType === 'candidate' ? (
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                            (u as Candidate).status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>{(u as Candidate).status}</span>
                        ) : (
                          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-[9px] font-black uppercase tracking-widest">{(u as StaffMember).role}</span>
                        )}
                      </td>
                      <td className="p-6 text-right space-x-2">
                        {userType === 'candidate' && (u as Candidate).status !== 'archived' && (
                          <button onClick={() => handlePromote(u as Candidate)} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">KADROYA KAT</button>
                        )}
                        <button onClick={() => handleDeleteUser(u.id, userType)} className="px-4 py-2.5 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">İmha Et</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(userType === 'candidate' ? candidates : staffList).length === 0 && (
                <div className="p-32 text-center opacity-20 grayscale">
                   <svg className="w-16 h-16 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <p className="text-[12px] font-black uppercase tracking-[0.5em]">Veri Kaydı Yok</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'inventory' && <MethodologyInventoryView />}

        {activeSubTab === 'system' && (
          <div className="flex-1 overflow-hidden">
            <SettingsView config={config} onUpdateConfig={onUpdateConfig} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
