
import React, { useState } from 'react';
import { GLOBAL_CURRICULA, TrainingPlan, CurriculumModule, CurriculumUnit } from './curriculumData';

const CurriculumManager: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ORIENTATION' | 'CLINICAL' | 'ETHICS'>('ALL');

  const filteredPlans = GLOBAL_CURRICULA.filter(p => activeTab === 'ALL' || p.category === activeTab);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ORIENTATION': return 'bg-orange-500';
      case 'CLINICAL': return 'bg-blue-600';
      case 'ETHICS': return 'bg-emerald-600';
      default: return 'bg-slate-600';
    }
  };

  if (selectedPlan) {
    return (
      <div className="animate-scale-in flex flex-col h-full bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Detail Header */}
        <div className="bg-slate-950 p-12 text-white flex justify-between items-start relative">
           <div className="relative z-10">
              <button onClick={() => setSelectedPlan(null)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                 Kataloğa Dön
              </button>
              <div className="flex items-center gap-4 mb-4">
                 <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getCategoryColor(selectedPlan.category)}`}>{selectedPlan.category}</span>
                 <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{selectedPlan.level} SEVİYE</span>
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">{selectedPlan.title}</h2>
              <p className="max-w-2xl text-slate-400 font-medium text-lg leading-relaxed">{selectedPlan.description}</p>
           </div>
           <div className="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center text-4xl shadow-inner rotate-3">
              {selectedPlan.badge.substring(0, 3)}
           </div>
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Modules & Units List */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
           {selectedPlan.modules.map((mod, mIdx) => (
              <div key={mod.id} className="space-y-6">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">{mIdx + 1}</div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{mod.title}</h3>
                    <div className="h-px bg-slate-100 flex-1"></div>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mod.units.map(unit => (
                       <div key={unit.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-orange-600">
                                   {unit.type === 'video' ? '▶' : unit.type === 'reading' ? '📖' : '🛠️'}
                                </div>
                                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{unit.title}</h4>
                             </div>
                             <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">{unit.duration}</span>
                          </div>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 italic">"{unit.content}"</p>
                          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600">EĞİTİME BAŞLA</button>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      {/* Catalog Filter Header */}
      <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Akademik Müfredat Kataloğu</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kurumsal Liyakat Standartları v24.1</p>
         </div>
         <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {['ALL', 'ORIENTATION', 'CLINICAL', 'ETHICS'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveTab(cat as any)}
                 className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {cat === 'ALL' ? 'Tümü' : cat === 'ORIENTATION' ? 'Oryantasyon' : cat === 'CLINICAL' ? 'Klinik' : 'Etik'}
               </button>
            ))}
         </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredPlans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="bg-white rounded-[4rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group cursor-pointer overflow-hidden flex flex-col"
            >
               <div className={`h-3 ${getCategoryColor(plan.category)} w-full`}></div>
               <div className="p-10 flex-1 flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                           {plan.badge.substring(0, 3)}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.badge}</span>
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">{plan.title}</h4>
                     <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-wide line-clamp-3">{plan.description}</p>
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">HEDEF KİTLE</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase">
                           {Array.isArray(plan.targetBranches) ? `${plan.targetBranches.length} Branş` : 'Tüm Personel'}
                        </span>
                     </div>
                     <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-lg">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {filteredPlans.length === 0 && (
         <div className="py-40 text-center opacity-20 grayscale">
            <svg className="w-24 h-24 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <p className="text-xl font-black uppercase tracking-[0.5em]">Kategori Boş</p>
         </div>
      )}
    </div>
  );
};

export default CurriculumManager;
