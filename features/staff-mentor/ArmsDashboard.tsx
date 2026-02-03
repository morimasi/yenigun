
import React, { useState, useMemo, useEffect } from 'react';
import { StaffMember, Branch } from '../../types';
import StaffProfileView from './StaffProfileView';
import PresentationStudio from './PresentationStudio';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ArmsDashboardProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const ArmsDashboard: React.FC<ArmsDashboardProps> = ({ refreshTrigger, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio'>('dashboard');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=list_all&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (e) { console.error(e); } 
    finally { setIsLoading.bind(null, false); setIsLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, [refreshTrigger]);

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => 
      s.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR')) ||
      s.branch.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
    );
  }, [staffList, searchTerm]);

  const branchStats = useMemo(() => {
    const map: any = {};
    staffList.forEach(s => {
      if (!map[s.branch]) map[s.branch] = { name: s.branch, score: 0, count: 0 };
      map[s.branch].score += (s.last_score || 0);
      map[s.branch].count++;
    });
    return Object.values(map).map((b: any) => ({ name: b.name, avg: Math.round(b.score / b.count) }));
  }, [staffList]);

  if (activeTab === 'studio') return <PresentationStudio onClose={() => setActiveTab('dashboard')} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-6rem)]">
      
      {/* 1. COMPACT KPI HEADER */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 shrink-0">
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-16 h-16 bg-orange-600 rounded-[2rem] flex items-center justify-center font-black text-2xl shadow-xl rotate-3">YG</div>
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Kadrolu Klinik Zeka</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">ARMS Academic Resource Management System v5.0</p>
           </div>
        </div>
        <div className="relative z-10 flex items-center gap-6">
           <div className="flex gap-10 mr-6 border-r border-white/10 pr-10">
              <div className="text-center">
                 <p className="text-3xl font-black text-orange-500 leading-none">{staffList.length}</p>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">AKTİF KADRO</p>
              </div>
              <div className="text-center">
                 <p className="text-3xl font-black text-emerald-500 leading-none">%{Math.round(staffList.reduce((a,b)=>a+(b.last_score||0),0)/staffList.length || 0)}</p>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">VERİMLİLİK</p>
              </div>
           </div>
           <div className="flex gap-3">
              <button onClick={() => setActiveTab('studio')} className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl">SUNUM STÜDYOSU</button>
              <button onClick={() => setIsAddStaffOpen(true)} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </button>
           </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
         
         {/* 2. NAVIGATION & LIST PANEL (LEFT) */}
         <div className="xl:col-span-3 flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 space-y-4">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">AKADEMİK KADRO</h4>
               <input 
                 type="text" 
                 placeholder="İsim veya Branş Ara..." 
                 className="w-full bg-white rounded-2xl p-4 text-[11px] font-bold outline-none border border-slate-100 focus:border-orange-500 transition-all shadow-inner"
                 value={searchTerm} 
                 onChange={e => setSearchTerm(e.target.value)} 
               />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
               {filteredStaff.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setSelectedStaffId(s.id)} 
                    className={`w-full p-5 rounded-[2rem] border-2 transition-all flex items-center gap-4 text-left group ${selectedStaffId === s.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-transparent hover:border-orange-300 hover:bg-slate-50'}`}
                  >
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${selectedStaffId === s.id ? 'bg-orange-600' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100'}`}>
                        {s.name.charAt(0)}
                     </div>
                     <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black uppercase truncate leading-none mb-1.5">{s.name}</p>
                        <p className={`text-[9px] font-bold uppercase truncate opacity-60 ${selectedStaffId === s.id ? 'text-slate-400' : 'text-slate-500'}`}>{s.branch}</p>
                     </div>
                     {s.last_score !== undefined && (
                        <div className="text-right">
                           <span className={`text-[12px] font-black ${s.last_score > 75 ? 'text-emerald-500' : 'text-orange-500'}`}>%{s.last_score}</span>
                        </div>
                     )}
                  </button>
               ))}
            </div>
         </div>

         {/* 3. MAIN WORKSPACE (CENTER/RIGHT) */}
         <div className="xl:col-span-9 h-full min-h-0 overflow-y-auto custom-scrollbar pr-2">
            {selectedStaffId ? (
               <StaffProfileView staffId={selectedStaffId} onUpdate={fetchStaff} />
            ) : (
               <div className="space-y-8 animate-fade-in">
                  {/* Global Analytics Overview */}
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
                     <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-10 border-l-4 border-orange-600 pl-6">Branş Bazlı Liyakat Dağılımı</h4>
                     <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={branchStats}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                              <Bar dataKey="avg" fill="#0f172a" barSize={40} radius={[8, 8, 0, 0]}>
                                 {branchStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.avg > 75 ? '#10b981' : '#f97316'} />
                                 ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                        <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6">Sistem Notu</h5>
                        <p className="text-xl font-bold italic leading-relaxed text-slate-300">
                           "ARMS motoru, her personelin test sonuçlarını <strong>Deep Thinking</strong> protokolü ile süzerek gerçek klinik derinliğini ölçer. Personel gelişimlerini izlemek için sol panelden bir dosya seçin."
                        </p>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px]"></div>
                     </div>
                     <div className="bg-white border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center p-12 text-center opacity-40">
                        <svg className="w-16 h-16 text-slate-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Kütüphane Verisi Hazırlanıyor</p>
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
