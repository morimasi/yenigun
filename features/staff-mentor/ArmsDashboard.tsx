
import React, { useState, useMemo, useEffect } from 'react';
import { StaffMember, Branch, StaffRole, Candidate } from '../../types';
import StaffProfileView from './StaffProfileView';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { exportService } from '../../services/exportService';

interface ArmsDashboardProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const ArmsDashboard: React.FC<ArmsDashboardProps> = ({ refreshTrigger, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add_staff'>('dashboard');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection & Bulk Actions State
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Edit State
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Create Staff State
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
        setNewStaff({
            name: '', email: '', role: StaffRole.Staff, branch: Branch.OzelEgitim, 
            experience_years: 0, password: 'yg' + Math.floor(1000 + Math.random() * 9000)
        });
        setActiveTab('dashboard');
        await fetchStaff();
      } else {
        alert(`Kayıt Başarısız: ${data.message || data.error || 'Bilinmeyen Hata'}`);
      }
    } catch (e) { 
      alert("Sunucu bağlantı hatası."); 
    }
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
        alert("Personel profili güncellendi.");
        setIsEditModalOpen(false);
        setEditingStaff(null);
        fetchStaff();
      }
    } catch (e) { alert("Güncelleme hatası."); }
  };

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const toggleAll = () => {
    if (checkedIds.size === filteredStaff.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filteredStaff.map(s => s.id)));
    }
  };

  const handleBulkArchive = async () => {
    if (!confirm(`${checkedIds.size} adet personel kaydı ARŞİVE taşınacak. Onaylıyor musunuz?`)) return;
    try {
      const ids = Array.from(checkedIds);
      const res = await fetch('/api/staff?action=bulk_archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (res.ok) {
        setCheckedIds(new Set());
        fetchStaff();
        alert("Seçili kayıtlar arşive taşındı.");
      }
    } catch (e) { alert("Toplu işlem hatası."); }
  };

  const handleBulkDownload = async () => {
    const targets = staffList.filter(s => checkedIds.has(s.id) && s.report);
    if (targets.length === 0) return alert("Seçili personellerde AI raporu bulunamadı.");
    setIsExporting(true);
    setExportProgress(10);
    try {
      const mappedCandidates = targets.map(s => ({
        id: s.id,
        name: s.name,
        branch: s.branch,
        email: s.email,
        phone: s.phone || '',
        experienceYears: s.experience_years,
        university: s.university || '',
        department: s.department || '',
        status: 'hired',
        report: s.report,
        timestamp: Date.now(),
        answers: {}
      } as Candidate));
      await exportService.exportAllCandidatesAsZip(mappedCandidates, setExportProgress);
    } catch (e) {
      alert("ZIP oluşturma hatası.");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const openEditModal = (staff: StaffMember, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStaff(staff);
    setIsEditModalOpen(true);
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => 
      s.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR')) ||
      s.branch.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
    );
  }, [staffList, searchTerm]);

  const stats = useMemo(() => {
    if (staffList.length === 0) return { avgScore: 0, highPerformers: 0, distribution: [] };
    const avg = Math.round(staffList.reduce((a, b) => a + (b.last_score || 0), 0) / staffList.length);
    const hipo = staffList.filter(s => (s.last_score || 0) > 85).length;
    const branchMap: any = {};
    staffList.forEach(s => {
       if (!branchMap[s.branch]) branchMap[s.branch] = { name: s.branch, value: 0, count: 0 };
       branchMap[s.branch].value += (s.last_score || 0);
       branchMap[s.branch].count++;
    });
    const distribution = Object.values(branchMap).map((b: any) => ({
      name: b.name,
      score: Math.round(b.value / b.count)
    }));
    return { avgScore: avg, highPerformers: hipo, distribution };
  }, [staffList]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-6rem)] relative">
      
      {/* BULK ACTION BAR */}
      {checkedIds.size > 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-slide-up border border-white/10 backdrop-blur-xl">
           <div className="flex items-center gap-3 pl-2">
              <span className="w-6 h-6 bg-orange-600 rounded-lg flex items-center justify-center font-black text-xs">{checkedIds.size}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">PERSONEL SEÇİLDİ</span>
           </div>
           <div className="h-8 w-px bg-white/10"></div>
           <div className="flex gap-2">
              <button onClick={handleBulkDownload} disabled={isExporting} className="px-5 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
                 {isExporting ? `PAKETLENİYOR %${exportProgress}` : 'ZIP İNDİR'}
              </button>
              <button onClick={handleBulkArchive} className="px-5 py-2 bg-rose-600/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                 ARŞİVE KALDIR
              </button>
           </div>
           <button onClick={() => setCheckedIds(new Set())} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 animate-scale-in shadow-2xl">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8">Personel Düzenle</h3>
              <form onSubmit={handleUpdateStaff} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Ad Soyad</label>
                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={editingStaff.name} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">E-Posta</label>
                    <input type="email" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={editingStaff.email} onChange={e => setEditingStaff({...editingStaff, email: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Branş</label>
                       <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={editingStaff.branch} onChange={e => setEditingStaff({...editingStaff, branch: e.target.value as Branch})}>
                          {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Deneyim (Yıl)</label>
                       <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={editingStaff.experience_years} onChange={e => setEditingStaff({...editingStaff, experience_years: parseInt(e.target.value)})} />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">İPTAL</button>
                    <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">GÜNCELLE</button>
                 </div>
              </form>
           </div>
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              YENİ PERSONEL
           </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
         <div className="xl:col-span-3 flex flex-col bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 space-y-4">
               <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">KADRO LİSTESİ</h4>
                  <button onClick={toggleAll} className="text-[9px] font-bold text-orange-600 uppercase hover:underline">
                     {checkedIds.size === filteredStaff.length ? 'SEÇİMİ KALDIR' : 'TÜMÜNÜ SEÇ'}
                  </button>
               </div>
               <div className="relative group">
                  <input type="text" placeholder="İsim veya Branş Ara..." className="w-full bg-white rounded-2xl p-5 text-[11px] font-bold outline-none border border-slate-200 focus:border-orange-500 transition-all shadow-inner pl-12" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <svg className="w-4 h-4 text-slate-400 absolute left-5 top-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
               {filteredStaff.map(s => {
                  const isChecked = checkedIds.has(s.id);
                  const isSelected = selectedStaffId === s.id;
                  return (
                    <div key={s.id} onClick={() => setSelectedStaffId(s.id)} className={`w-full p-4 rounded-[2.5rem] border-2 transition-all flex items-center gap-4 text-left group cursor-pointer relative ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-transparent hover:border-orange-300 hover:bg-slate-50'}`}>
                       <div onClick={(e) => toggleCheck(s.id, e)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-orange-600 border-orange-600' : 'border-slate-200 hover:border-orange-400'}`}>
                          {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                       </div>
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${isSelected ? 'bg-orange-600' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100'}`}>
                          {s.name.charAt(0)}
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-black uppercase truncate leading-none mb-1.5">{s.name}</p>
                          <p className={`text-[8px] font-bold uppercase truncate opacity-60 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{s.branch}</p>
                       </div>
                       <button onClick={(e) => openEditModal(s, e)} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-400'}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                       </button>
                    </div>
                  );
               })}
            </div>
         </div>

         <div className="xl:col-span-9 h-full min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-10">
            {activeTab === 'add_staff' ? (
               <div className="max-w-3xl mx-auto animate-scale-in bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl">
                  <div className="flex justify-between items-center mb-12">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Yeni Uzman Tanımla</h3>
                     <button onClick={() => setActiveTab('dashboard')} className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
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
                     <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all">SİSTEME KAYDET</button>
                  </form>
               </div>
            ) : selectedStaffId ? (
               <StaffProfileView staffId={selectedStaffId} onUpdate={fetchStaff} />
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-30 text-center grayscale">
                  <div className="w-32 h-32 bg-slate-100 rounded-[4rem] flex items-center justify-center mb-8 border-4 border-dashed border-slate-200"><svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                  <h3 className="text-2xl font-black uppercase tracking-[0.5em] text-slate-400">Dosya Seçiniz</h3>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ArmsDashboard;
