
import React, { useState, useMemo, useEffect } from 'react';
import { StaffMember, Branch, StaffRole } from '../../types';
import StaffProfileView from './StaffProfileView';
import PresentationStudio from './PresentationStudio';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

interface ArmsDashboardProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const ArmsDashboard: React.FC<ArmsDashboardProps> = ({ refreshTrigger, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio' | 'add_staff'>('dashboard');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      if (res.ok) {
        alert("Personel kaydı mühürlendi.");
        setActiveTab('dashboard');
        fetchStaff();
      }
    } catch (e) { alert("Kayıt hatası."); }
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

  if (activeTab === 'studio') return <PresentationStudio onClose={() => setActiveTab('dashboard')} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-6rem)] relative">
      
      {/* 1. COMMAND HEADER */}
      <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 shrink-0">
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-20 h-20 bg-orange-600 rounded-[2.5rem] flex items-center justify-center font-black text-3xl shadow-xl rotate-3">YG</div>
           <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Akademik Kaynak Yönetimi</h2>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">ARMS Bilişsel İzleme & Mentorluk v6.2</p>
           </div>
        </div>
        <div className="relative z-10 flex items-center gap-6">
           <div className="flex gap-12 mr-8 border-r border-white/10 pr-12">
              <div className="text-center">
                 <p className="text-4xl font-black text-white leading-none">{staffList.length}</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">AKTİF PERSONEL</p>
              </div>
              <div className="text-center">
                 <p className="text-4xl font-black text-orange-500 leading-none">%{stats.avgScore}</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">LİYAKAT ORT.</p>
              </div>
              <div className="text-center hidden xl:block">
                 <p className="text-4xl font-black text-emerald-500 leading-none">{stats.highPerformers}</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">HIPO (LİDER)</p>
              </div>
           </div>
           <div className="flex gap-4">
              <button onClick={() => setActiveTab('studio')} className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl active:scale-95">SUNUM STÜDYOSU</button>
              <button onClick={() => setActiveTab('add_staff')} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10 shadow-lg">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </button>
           </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
         
         {/* 2. NAVIGATION & LIST (LEFT) */}
         <div className="xl:col-span-3 flex flex-col bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 space-y-4">
               <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">KADRO NAVİGASYON</h4>
                  <span className="px-2 py-1 bg-slate-900 text-white rounded text-[9px] font-bold">LIVE</span>
               </div>
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="İsim veya Branş Ara..." 
                    className="w-full bg-white rounded-2xl p-5 text-[11px] font-bold outline-none border border-slate-200 focus:border-orange-500 transition-all shadow-inner pl-12"
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-5 top-5 group-focus-within:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
               {filteredStaff.length === 0 ? (
                  <div className="py-20 text-center opacity-20 grayscale flex flex-col items-center">
                     <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     <p className="text-[10px] font-black uppercase tracking-widest">Kayıt Bulunamadı</p>
                  </div>
               ) : (
                  filteredStaff.map(s => (
                     <button 
                       key={s.id} 
                       onClick={() => { setSelectedStaffId(s.id); setActiveTab('dashboard'); }} 
                       className={`w-full p-5 rounded-[2.5rem] border-2 transition-all flex items-center gap-5 text-left group ${selectedStaffId === s.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-transparent hover:border-orange-300 hover:bg-slate-50'}`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 transition-all ${selectedStaffId === s.id ? 'bg-orange-600' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100'}`}>
                           {s.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-[13px] font-black uppercase truncate leading-none mb-2">{s.name}</p>
                           <p className={`text-[9px] font-bold uppercase truncate opacity-60 ${selectedStaffId === s.id ? 'text-slate-400' : 'text-slate-500'}`}>{s.branch}</p>
                        </div>
                        {s.last_score !== undefined && (
                           <div className="text-right">
                              <span className={`text-[13px] font-black ${s.last_score > 75 ? 'text-emerald-500' : 'text-orange-500'}`}>%{s.last_score}</span>
                           </div>
                        )}
                     </button>
                  ))
               )}
            </div>
         </div>

         {/* 3. WORKSPACE (CENTER/RIGHT) */}
         <div className="xl:col-span-9 h-full min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-10">
            {activeTab === 'add_staff' ? (
               <div className="max-w-3xl mx-auto animate-scale-in bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl">
                  <div className="flex justify-between items-center mb-12">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Yeni Uzman Tanımla</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Akademik kadroya yeni profil ekleme ünitesi</p>
                     </div>
                     <button onClick={() => setActiveTab('dashboard')} className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  </div>
                  
                  <form onSubmit={handleCreateStaff} className="space-y-8">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Ad Soyad</label>
                           <input type="text" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Kurumsal E-Posta</label>
                           <input type="email" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Branş</label>
                           <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none" value={newStaff.branch} onChange={e => setNewStaff({...newStaff, branch: e.target.value as Branch})}>
                              {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Deneyim (Yıl)</label>
                           <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={newStaff.experience_years} onChange={e => setNewStaff({...newStaff, experience_years: parseInt(e.target.value)})} />
                        </div>
                     </div>
                     <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100">
                        <p className="text-[11px] font-bold text-orange-900">SİSTEM NOTU: Personel ilk girişini "<strong>{newStaff.password}</strong>" şifresiyle yapacaktır. Girişten sonra profilini aktive etmesi istenecektir.</p>
                     </div>
                     <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all">KAYDI SİSTEME MÜHÜRLE</button>
                  </form>
               </div>
            ) : selectedStaffId ? (
               <StaffProfileView staffId={selectedStaffId} onUpdate={fetchStaff} />
            ) : (
               <div className="space-y-8 animate-fade-in">
                  
                  {/* Global Analytics Center */}
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className="relative z-10">
                        <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 border-l-4 border-orange-600 pl-8">Branş Bazlı Liyakat Isı Haritası</h4>
                        <div className="h-[400px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stats.distribution} barGap={12}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                                 <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', fontSize: '12px', fontWeight: 'bold' }} />
                                 <Bar dataKey="score" fill="#0f172a" barSize={50} radius={[12, 12, 0, 0]}>
                                    {stats.distribution.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.score > 75 ? '#10b981' : entry.score > 50 ? '#f97316' : '#ef4444'} />
                                    ))}
                                 </Bar>
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[120px] pointer-events-none group-hover:bg-orange-50 transition-colors duration-1000"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-10">MİA STRATEJİK ÖZET</h5>
                        <p className="text-2xl font-black italic leading-tight text-slate-300 group-hover:text-white transition-colors">
                           "Kurumsal kadronuzda en yüksek yetkinlik <strong>{stats.distribution.sort((a,b)=>b.score-a.score)[0]?.name || '...'}</strong> branşında saptanırken, klinik derinliğin artırılması gereken alan <strong>{stats.distribution.sort((a,b)=>a.score-b.score)[0]?.name || '...'}</strong> olarak projekte edilmiştir."
                        </p>
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
                     </div>
                     
                     <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-xl flex flex-col justify-center">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">SON 30 GÜNLÜK AKADEMİK IVME</h5>
                        <div className="h-40">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={[{v:40}, {v:60}, {v:55}, {v:80}, {v:75}, {v:92}]}>
                                 <Area type="monotone" dataKey="v" stroke="#ea580c" fill="#ea580c" fillOpacity={0.1} strokeWidth={4} />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase text-center mt-6 tracking-[0.3em]">PERSONEL GELİŞİMİ POZİTİF TRENDDE</p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ArmsDashboard;
