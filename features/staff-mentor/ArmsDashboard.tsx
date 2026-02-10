
import React, { useState, useMemo, useEffect } from 'react';
import { StaffMember, Branch, StaffRole, Candidate } from '../../types';
import StaffProfileView from './StaffProfileView';
import { exportService } from '../../services/exportService';
import { SmartBackButton } from '../../components/shared/SmartBackButton';

interface ArmsDashboardProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const ArmsDashboard: React.FC<ArmsDashboardProps> = ({ refreshTrigger, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add_staff' | 'profile'>('dashboard');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newStaff, setNewStaff] = useState({
    name: '', email: '', role: StaffRole.Staff, branch: Branch.OzelEgitim, experience_years: 0, password: 'yg' + Math.floor(1000 + Math.random() * 9000)
  });

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=list_all&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, [refreshTrigger]);

  const handleBack = () => {
    if (activeTab === 'profile' || activeTab === 'add_staff') {
      setActiveTab('dashboard');
      setSelectedStaffId(null);
    }
  };

  const selectProfile = (id: string) => {
    setSelectedStaffId(id);
    setActiveTab('profile');
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Personel "${newStaff.name}" başarıyla sisteme mühürlendi.`);
        setNewStaff({ name: '', email: '', role: StaffRole.Staff, branch: Branch.OzelEgitim, experience_years: 0, password: 'yg' + Math.floor(1000 + Math.random() * 9000) });
        setActiveTab('dashboard');
        await fetchStaff();
      }
    } catch (e) { alert("Hata."); }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    try {
      const res = await fetch('/api/staff?action=update_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStaff)
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingStaff(null);
        fetchStaff();
      }
    } catch (e) { alert("Hata."); }
  };

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => 
      s.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR')) ||
      s.branch.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
    );
  }, [staffList, searchTerm]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full relative">
      
      {activeTab !== 'dashboard' && (
        <div className="flex justify-start mb-2">
           <SmartBackButton onClick={handleBack} label="LİSTEYE DÖN" />
        </div>
      )}

      {/* COMMAND HEADER */}
      <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 shrink-0">
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-20 h-20 bg-slate-100 text-slate-900 rounded-[2.5rem] flex items-center justify-center font-black text-3xl shadow-xl rotate-3">YG</div>
           <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Personel Dosyaları</h2>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">ARMS Bilişsel İzleme & Dosyalama</p>
           </div>
        </div>
        <div className="relative z-10 flex items-center gap-6">
           <div className="flex gap-12 mr-8 border-r border-white/10 pr-12 text-center">
              <div>
                 <p className="text-4xl font-black text-white leading-none">{staffList.length}</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">AKTİF UZMAN</p>
              </div>
           </div>
           <button onClick={() => setActiveTab('add_staff')} className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              YENİ PERSONEL
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
         {(activeTab === 'dashboard') && (
            <div className="xl:col-span-12 flex flex-col bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden h-full">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 space-y-4">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">KADRO LİSTESİ</h4>
                      <div className="relative w-80">
                         <input type="text" placeholder="İsim veya Branş Ara..." className="w-full bg-white rounded-2xl p-4 text-[11px] font-bold outline-none border border-slate-200 focus:border-orange-500 transition-all shadow-inner pl-12" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                         <svg className="w-4 h-4 text-slate-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredStaff.map(s => (
                        <div key={s.id} onClick={() => selectProfile(s.id)} className="p-8 bg-slate-50 rounded-[3rem] border-2 border-transparent hover:border-orange-500 hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                           <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl mb-6 shadow-lg group-hover:bg-orange-600 transition-colors">{s.name.charAt(0)}</div>
                           <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-2">{s.name}</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{s.branch}</p>
                           <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-[9px] font-black text-slate-500">LIYAKAT: %{s.last_score || 0}</span>
                              <span className="text-[10px] font-black text-orange-600 opacity-0 group-hover:opacity-100 transition-all">DOSYAYI AÇ →</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
            </div>
         )}

         {activeTab === 'profile' && selectedStaffId && (
            <div className="xl:col-span-12 h-full">
               <StaffProfileView staffId={selectedStaffId} onUpdate={fetchStaff} />
            </div>
         )}

         {activeTab === 'add_staff' && (
            <div className="xl:col-span-12 h-full flex items-start justify-center pt-10">
               <div className="max-w-3xl w-full animate-scale-in bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-12 text-center">Yeni Uzman Tanımla</h3>
                  <form onSubmit={handleCreateStaff} className="space-y-8">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Ad Soyad</label>
                           <input type="text" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">E-Posta</label>
                           <input type="email" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                        </div>
                     </div>
                     <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all">SİSTEME KAYDET VE MÜHÜRLE</button>
                  </form>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default ArmsDashboard;
