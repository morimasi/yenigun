
import React, { useState, useEffect } from 'react';
import { Candidate, StaffMember, GlobalConfig, StaffRole, Branch } from '../../types';
import MethodologyInventoryView from './MethodologyInventoryView';
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
    if (!confirm("Bu kullanıcı kalıcı olarak silinecektir. Onaylıyor musunuz?")) return;
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
    if (!confirm(`${candidate.name} personel olarak atanacak. Devam edilsin mi?`)) return;
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
        // Adayı arşivle
        await storageService.updateCandidate({
          ...candidate,
          status: 'archived',
          archiveCategory: 'HIRED_CONTRACTED',
          archiveNote: 'Personel olarak atandı.'
        });
        alert("Personel ataması başarılı. Şifre adaya iletilmelidir.");
        onRefresh();
      }
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      {/* Admin Sub Nav */}
      <div className="bg-slate-900 p-4 flex gap-4 shrink-0">
        <button onClick={() => setActiveSubTab('users')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'users' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Kullanıcı Yönetimi</button>
        <button onClick={() => setActiveSubTab('inventory')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'inventory' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Metodoloji Stüdyosu</button>
        <button onClick={() => setActiveSubTab('system')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'system' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Sistem Parametreleri</button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeSubTab === 'users' && (
          <div className="flex-1 flex flex-col p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button onClick={() => setUserType('candidate')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${userType === 'candidate' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>Adaylar</button>
                <button onClick={() => setUserType('staff')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${userType === 'staff' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>Personel</button>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{userType === 'candidate' ? candidates.length : staffList.length} KAYIT LİSTELENİYOR</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-100 rounded-[2rem]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                  <tr>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">İsim / Branş</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">E-Posta / Tel</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Durum / Rol</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(userType === 'candidate' ? candidates : staffList).map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <p className="text-[11px] font-black text-slate-900 uppercase">{u.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{u.branch}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-[10px] font-bold text-slate-600">{u.email}</p>
                        <p className="text-[10px] font-medium text-slate-400">{u.phone || '-'}</p>
                      </td>
                      <td className="p-4">
                        {userType === 'candidate' ? (
                          <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-[9px] font-black uppercase">{(u as Candidate).status}</span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[9px] font-black uppercase">{(u as StaffMember).role}</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {userType === 'candidate' && (u as Candidate).status !== 'archived' && (
                          <button onClick={() => handlePromote(u as Candidate)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase hover:bg-emerald-600">ATA</button>
                        )}
                        <button onClick={() => handleDeleteUser(u.id, userType)} className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-[9px] font-black uppercase hover:bg-rose-500 hover:text-white">SİL</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === 'inventory' && <MethodologyInventoryView />}

        {activeSubTab === 'system' && (
          <div className="p-12 max-w-4xl mx-auto space-y-12">
            <div className="bg-orange-50 border border-orange-100 p-8 rounded-[3rem] relative overflow-hidden">
               <h3 className="text-xl font-black text-orange-900 uppercase mb-4">Küresel Ağırlık Matrisi</h3>
               <p className="text-xs font-bold text-orange-700 uppercase mb-8">AI Karar Destek motorunun liyakat puanlama yüzdelerini buradan ayarlayın.</p>
               <div className="grid grid-cols-2 gap-8">
                  {Object.entries(config.weightMatrix).map(([key, val]) => (
                    <div key={key} className="space-y-2">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-500 uppercase">{key}</label>
                          <span className="text-sm font-black text-orange-600">%{val}</span>
                       </div>
                       <input 
                         type="range" min="0" max="100" 
                         value={val} 
                         onChange={e => onUpdateConfig({...config, weightMatrix: {...config.weightMatrix, [key]: parseInt(e.target.value)}})}
                         className="w-full h-1.5 bg-orange-200 rounded-full appearance-none cursor-pointer accent-orange-600"
                       />
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
               <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
                  <h4 className="text-[11px] font-black text-orange-500 uppercase mb-6">Risk Motoru Ayarları</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] font-bold uppercase">Etik İhlal Cezası</span>
                        <input type="number" className="bg-white/5 border border-white/10 w-16 p-1 text-center rounded" value={config.riskEngine.criticalEthicalViolationPenalty} />
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] font-bold uppercase">Auto-Reject Eşiği</span>
                        <input type="number" className="bg-white/5 border border-white/10 w-16 p-1 text-center rounded" value={config.systemSettings.autoRejectBelowScore} />
                     </div>
                  </div>
               </div>
               <div className="bg-slate-50 border border-slate-200 p-8 rounded-[3rem]">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase mb-6">Kurumsal Kimlik</h4>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest"
                    value={config.institutionName}
                    onChange={e => onUpdateConfig({...config, institutionName: e.target.value})}
                  />
                  <p className="mt-4 text-[9px] font-bold text-slate-400 uppercase">Bu isim tüm raporlarda ve iletişim şablonlarında kullanılır.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
