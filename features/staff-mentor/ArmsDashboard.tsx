
import React, { useState, useMemo, useEffect } from 'react';
import { StaffMember, Branch } from '../../types';
import StaffProfileView from './StaffProfileView';
import PresentationStudio from './PresentationStudio';

interface ArmsDashboardProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const ArmsDashboard: React.FC<ArmsDashboardProps> = ({ refreshTrigger, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio'>('dashboard');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '', email: '', password: 'yenigun2024', branch: Branch.OzelEgitim, experienceYears: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  const getLocalStaff = () => {
    const local = localStorage.getItem('yeni_gun_staff');
    return local ? JSON.parse(local) : [];
  };

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=list_all&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setStaffList(data);
          localStorage.setItem('yeni_gun_staff', JSON.stringify(data));
          return;
        }
      }
      throw new Error("API_FAIL");
    } catch (e) {
      console.warn("Staff API failure, using local storage.");
      setStaffList(getLocalStaff());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [refreshTrigger]);

  const handleAddStaff = async () => {
    if(!newStaffForm.name || !newStaffForm.email) {
      alert("İsim ve E-posta zorunludur.");
      return;
    }
    setIsAdding(true);
    const staffId = `STF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    try {
      const res = await fetch('/api/staff?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaffForm)
      });
      const result = res.ok ? await res.json() : { success: false };
      if (!result.success) throw new Error("API_FAIL");
    } catch (e) {
      const currentStaff = getLocalStaff();
      const newStaffMember = {
        id: staffId,
        ...newStaffForm,
        created_at: new Date().toISOString(),
        status: 'active',
        last_score: 0
      };
      localStorage.setItem('yeni_gun_staff', JSON.stringify([newStaffMember, ...currentStaff]));
    } finally {
      alert(`Personel başarıyla eklendi. (ID: ${staffId})`);
      setIsAddStaffOpen(false);
      setNewStaffForm({ name: '', email: '', password: 'yenigun2024', branch: Branch.OzelEgitim, experienceYears: 0 });
      if (onRefresh) onRefresh(); else fetchStaff();
      setIsAdding(false);
    }
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => 
      s.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
    );
  }, [staffList, searchTerm]);

  const stats = useMemo(() => {
    if (staffList.length === 0) return { avgScore: 0, growth: 0 };
    const validScores = staffList.filter(s => s.last_score !== null).map(s => s.last_score || 0);
    const avg = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
    return { avgScore: avg, growth: Math.round(avg * 0.4) };
  }, [staffList]);

  if (activeTab === 'studio') {
    return (
      <div className="relative">
        <button onClick={() => setActiveTab('dashboard')} className="absolute top-4 left-4 z-50 px-4 py-2 bg-white rounded-xl shadow-md text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-200">
          ← Geri
        </button>
        <PresentationStudio />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-10 relative h-full">
      {/* COMPACT HEADER */}
      <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden border border-white/5 shrink-0 flex items-center justify-between">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">ARMS</div>
          <div>
             <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Kadrolu Klinik Zeka</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Real-Time Academic Database v3.0</p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-4">
             <div className="flex gap-4 mr-4">
                <div className="text-right">
                   <p className="text-xl font-black text-orange-500 leading-none">%{stats.avgScore}</p>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">VERİM</p>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-emerald-500 leading-none">%{stats.growth}</p>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">BÜYÜME</p>
                </div>
             </div>
             <button onClick={() => setIsAddStaffOpen(true)} className="px-5 py-2.5 bg-white/10 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                + PERSONEL
             </button>
             <button onClick={() => setActiveTab('studio')} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 hover:text-white transition-all">
                 SUNUM STÜDYOSU
             </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
        {/* LIST PANEL */}
        <div className="xl:col-span-3 flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
             <input type="text" placeholder="Personel Ara..." className="w-full bg-white rounded-xl p-2.5 text-[10px] font-bold outline-none border border-slate-200 focus:border-orange-500 transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
             {isLoading && staffList.length === 0 ? (
               [1,2,3].map(i => <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse"></div>)
             ) : filteredStaff.length === 0 ? (
               <p className="text-[9px] font-bold text-slate-300 uppercase text-center py-6">Kayıt Yok</p>
             ) : (
               filteredStaff.map(s => (
                 <button key={s.id} onClick={() => setSelectedStaffId(s.id)} className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 text-left group ${selectedStaffId === s.id ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 hover:border-orange-200'}`}>
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-all ${selectedStaffId === s.id ? 'bg-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                     {s.name.charAt(0)}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-[10px] font-black uppercase truncate leading-tight">{s.name}</p>
                     <p className={`text-[8px] font-bold uppercase truncate ${selectedStaffId === s.id ? 'text-slate-400' : 'text-slate-400'}`}>{s.branch}</p>
                   </div>
                   {s.last_score !== undefined && (
                     <span className={`text-[9px] font-black ${s.last_score > 70 ? 'text-emerald-500' : 'text-orange-500'}`}>%{s.last_score}</span>
                   )}
                 </button>
               ))
             )}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className="xl:col-span-9 h-full min-h-0 overflow-y-auto custom-scrollbar">
          {selectedStaffId ? (
            <StaffProfileView staffId={selectedStaffId} />
          ) : (
            <div className="h-full bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center opacity-30 p-10">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Klinik Dosya Seçin</p>
            </div>
          )}
        </div>
      </div>

      {isAddStaffOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in no-print">
           <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-scale-in">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Hızlı Kadro Ekle</h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Ad Soyad</label>
                    <input className="w-full bg-slate-50 rounded-xl p-3 text-xs font-bold outline-none border border-slate-100 focus:border-orange-500" value={newStaffForm.name} onChange={e => setNewStaffForm({...newStaffForm, name: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">E-Posta</label>
                    <input type="email" className="w-full bg-slate-50 rounded-xl p-3 text-xs font-bold outline-none border border-slate-100 focus:border-orange-500" value={newStaffForm.email} onChange={e => setNewStaffForm({...newStaffForm, email: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Branş</label>
                    <select className="w-full bg-slate-50 rounded-xl p-3 text-xs font-bold outline-none border border-slate-100" value={newStaffForm.branch} onChange={e => setNewStaffForm({...newStaffForm, branch: e.target.value as Branch})}>
                       {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                 </div>
                 
                 <div className="flex gap-3 pt-4">
                    <button onClick={() => setIsAddStaffOpen(false)} className="flex-1 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-xl hover:bg-slate-100">İptal</button>
                    <button onClick={handleAddStaff} disabled={isAdding} className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-black transition-all">
                       {isAdding ? '...' : 'Ekle'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ArmsDashboard;
