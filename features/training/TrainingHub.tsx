
import React, { useState, useEffect } from 'react';
import PresentationStudio from '../staff-mentor/PresentationStudio';
import { StaffMember, IDP } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type TrainingView = 'dashboard' | 'curriculum' | 'studio' | 'analytics';

const TrainingHub: React.FC = () => {
  const [activeView, setActiveView] = useState<TrainingView>('dashboard');
  const [staffStats, setStaffStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/staff?action=list_all');
        if (res.ok) {
          const data = await res.json();
          setStaffStats(data);
        }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchStats();
  }, []);

  const MenuCard = ({ id, title, desc, icon, color }: any) => (
    <button 
      onClick={() => setActiveView(id)}
      className={`p-10 rounded-[3rem] bg-white border border-slate-200 text-left transition-all group hover:border-${color}-500 hover:shadow-2xl relative overflow-hidden h-full flex flex-col justify-between`}
    >
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-[1.5rem] bg-${color}-50 text-${color}-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform`}>
           {icon}
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-wide">{desc}</p>
      </div>
      <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-${color}-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl`}></div>
    </button>
  );

  if (activeView === 'studio') return <PresentationStudio onClose={() => setActiveView('dashboard')} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-6rem)] relative pb-10">
      
      {/* HEADER: ACADEMY CONTROL */}
      <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 shrink-0">
         <div className="relative z-10 flex items-center gap-8">
            <div className="w-24 h-24 bg-orange-600 rounded-[3rem] flex items-center justify-center font-black text-4xl shadow-[0_0_50px_rgba(234,88,12,0.3)] rotate-3">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
               <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em]">KOMUTA MERKEZİ</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mt-2">Nöral Akademi Hub</h2>
               <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Kurumsal Liyakat ve Gelişim Yönetimi</p>
            </div>
         </div>
         
         <div className="relative z-10 flex gap-4">
            <div className="bg-white/5 border border-white/10 p-1 rounded-2xl flex">
               <button onClick={() => setActiveView('dashboard')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'dashboard' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Kontrol</button>
               <button onClick={() => setActiveView('curriculum')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'curriculum' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Programlar</button>
               <button onClick={() => setActiveView('analytics')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'analytics' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Metrikler</button>
            </div>
         </div>
         <div className="absolute -right-20 -bottom-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
         
         {/* DASHBOARD VIEW */}
         {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
               <MenuCard 
                  id="curriculum" 
                  title="Müfredat Stüdyosu" 
                  desc="Kurumsal eğitim rotaları, oryantasyon planları ve branş bazlı akademik müfredatlar." 
                  icon="📚" color="blue" 
               />
               <MenuCard 
                  id="studio" 
                  title="AI Sunum Atölyesi" 
                  desc="Tek tıkla akademik kalitede eğitim slaytları, vaka analizleri ve interaktif sunumlar üretin." 
                  icon="🚀" color="orange" 
               />
               <MenuCard 
                  id="analytics" 
                  title="Liyakat İzleme" 
                  desc="Personelin sınav başarıları, gelişim deltalari ve kurumsal yetkinlik ısı haritası." 
                  icon="📊" color="emerald" 
               />
            </div>
         )}

         {/* CURRICULUM VIEW (MOCKUP) */}
         {activeView === 'curriculum' && (
            <div className="space-y-8 animate-scale-in">
               <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl">
                  <div className="flex justify-between items-center mb-12">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Akademik Program Yönetimi</h3>
                     <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all">+ YENİ PROGRAM</button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {[
                       { t: 'Yeni Uzman Oryantasyonu', b: 'Tüm Branşlar', s: 'AKTİF', c: 'orange' },
                       { t: 'ABA Uygulama Sadakati', b: 'Özel Eğitim', s: 'AKTİF', c: 'blue' },
                       { t: 'Klinik Etik ve Sınırlar', b: 'Tüm Branşlar', s: 'ZORUNLU', c: 'emerald' },
                       { t: 'İleri Floortime Stratejileri', b: 'Psikoloji / Ergoterapi', s: 'TASLAK', c: 'slate' }
                     ].map((p, i) => (
                        <div key={i} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all">
                           <div>
                              <span className={`px-3 py-1 bg-${p.c}-100 text-${p.c}-700 rounded-lg text-[9px] font-black uppercase mb-3 inline-block`}>{p.s}</span>
                              <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{p.t}</h4>
                              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{p.b}</p>
                           </div>
                           <button className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* ANALYTICS VIEW */}
         {activeView === 'analytics' && (
            <div className="space-y-8 animate-slide-up">
               <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-2xl overflow-hidden relative group">
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-8 border-orange-600 pl-8">Kurumsal Yetkinlik Matrisi</h4>
                  <div className="h-[500px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={staffStats.slice(0, 10)}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                           <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', fontSize: '12px', fontWeight: 'bold' }} />
                           <Bar dataKey="last_score" radius={[15, 15, 0, 0]} barSize={40}>
                              {staffStats.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.last_score > 85 ? '#10b981' : entry.last_score > 65 ? '#ea580c' : '#ef4444'} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[120px] -z-0 opacity-50 group-hover:bg-orange-50 transition-colors"></div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default TrainingHub;
