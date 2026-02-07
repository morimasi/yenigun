
import React, { useState, useMemo } from 'react';
import { GLOBAL_CURRICULA, TrainingPlan } from './curriculumData';
import { armsService } from '../../services/ai/armsService';
import { TrainingSlide, CustomTrainingPlan } from '../../types';
import AssignmentModal from './AssignmentModal';

interface CurriculumManagerProps {
  onLaunchStudio: (slides: TrainingSlide[], plan: TrainingPlan) => void;
}

const CurriculumManager: React.FC<CurriculumManagerProps> = ({ onLaunchStudio }) => {
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT'>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredPlans = useMemo(() => {
    return GLOBAL_CURRICULA.filter(p => {
      const matchesTab = activeTab === 'ALL' || p.category === activeTab;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'ORIENTATION': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', accent: 'bg-orange-500' };
      case 'CLINICAL': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', accent: 'bg-blue-500' };
      case 'ETHICS': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', accent: 'bg-emerald-500' };
      case 'MANAGEMENT': return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', accent: 'bg-slate-500' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', accent: 'bg-slate-500' };
    }
  };

  const handleStartTraining = async (plan: TrainingPlan) => {
    setIsGenerating(true);
    try {
       const slides = await armsService.generateCurriculumTraining(plan);
       onLaunchStudio(slides, plan);
    } catch (e) {
       alert("AI Eğitim Fabrikası Hatası: Bağlantı koptu.");
    } finally {
       setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-[2500] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
          <div className="relative mb-12">
             <div className="w-48 h-48 border-[4px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center border border-white/10">
                   <span className="text-orange-500 font-black text-xl animate-pulse">MIA</span>
                </div>
             </div>
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Pedagojik İnşa Süreci</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Akademik Literatür ve Kurumsal Vizyon Sentezleniyor</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-fade-in overflow-hidden">
      {showAssignModal && selectedPlan && (
        <AssignmentModal 
          plan={{ ...selectedPlan, curriculum: [] } as any} 
          onClose={() => setShowAssignModal(false)} 
        />
      )}
      
      {/* 1. COMPACT CONTROL HEADER */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 z-20">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
               <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Müfredat Kataloğu</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{filteredPlans.length} Uzmanlık Rotası Mevcut</p>
            </div>
         </div>

         <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
               <input 
                  type="text" 
                  placeholder="Eğitim, branş veya anahtar kelime ara..." 
                  className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-orange-500 p-3 pl-10 rounded-xl text-xs font-bold outline-none transition-all shadow-inner"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
               />
               <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
         </div>

         <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {['ALL', 'ORIENTATION', 'CLINICAL', 'ETHICS', 'MANAGEMENT'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveTab(cat as any)}
                 className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {cat === 'ALL' ? 'Hepsi' : cat === 'ORIENTATION' ? 'Ory.' : cat === 'CLINICAL' ? 'Klinik' : cat === 'ETHICS' ? 'Etik' : 'Yön.'}
               </button>
            ))}
         </div>
      </div>

      {/* 2. MIKRO-TILE GRID AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredPlans.map(plan => {
               const theme = getCategoryTheme(plan.category);
               return (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-[220px] relative overflow-hidden"
                  >
                     {/* Badge & Level Indicator */}
                     <div className="flex justify-between items-start mb-4">
                        <div className={`px-2 py-1 ${theme.bg} ${theme.color} rounded-lg text-[8px] font-black uppercase tracking-tighter`}>
                           {plan.category}
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{plan.badge}</span>
                     </div>

                     <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {plan.title}
                     </h4>
                     
                     <p className="text-[10px] font-medium text-slate-400 leading-snug line-clamp-3 mb-auto">
                        {plan.description}
                     </p>

                     <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">ZORLUK</span>
                           <span className="text-[9px] font-black text-slate-600 uppercase">{plan.level}</span>
                        </div>
                        <div className="flex gap-1">
                           <button className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                           </button>
                        </div>
                     </div>

                     {/* HOVER OVERLAY ACTIONS */}
                     <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <button 
                           onClick={(e) => { e.stopPropagation(); handleStartTraining(plan); }}
                           className="w-full py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-white hover:text-slate-900 transition-all"
                        >
                           EĞİTİME BAŞLA
                        </button>
                        <button 
                           onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); setShowAssignModal(true); }}
                           className="w-full py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all"
                        >
                           PERSONELE ATA
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* 3. MODERN DETAIL SLIDE-OVER / MODAL */}
      {selectedPlan && !showAssignModal && (
         <div className="fixed inset-0 z-[1500] flex items-center justify-end p-4 animate-fade-in no-print">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setSelectedPlan(null)}></div>
            <div className="w-full max-w-2xl bg-white h-full rounded-[3rem] shadow-2xl border border-white/20 flex flex-col overflow-hidden relative animate-slide-right">
               
               <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-orange-500 text-2xl font-black shadow-xl">
                        {selectedPlan.badge.substring(0, 3)}
                     </div>
                     <div>
                        <span className={`px-3 py-1 ${getCategoryTheme(selectedPlan.category).bg} ${getCategoryTheme(selectedPlan.category).color} rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 inline-block`}>
                           {selectedPlan.category}
                        </span>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedPlan.title}</h3>
                     </div>
                  </div>
                  <button onClick={() => setSelectedPlan(null)} className="p-4 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                  <div className="space-y-4">
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Akademik Özet</h4>
                     <p className="text-xl font-bold text-slate-600 leading-relaxed text-justify">
                        {selectedPlan.description}
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Seviye</span>
                        <p className="text-2xl font-black text-slate-900">{selectedPlan.level}</p>
                     </div>
                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hedef Branş</span>
                        <p className="text-[13px] font-black text-slate-900 uppercase">{Array.isArray(selectedPlan.targetBranches) ? selectedPlan.targetBranches.join(', ') : 'TÜMÜ'}</p>
                     </div>
                  </div>

                  <div className="bg-orange-50 p-10 rounded-[4rem] border border-orange-100 relative overflow-hidden group">
                     <div className="relative z-10">
                        <h5 className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-6">MIA AI EĞİTİM ANALİZİ</h5>
                        <p className="text-sm font-bold text-orange-900 leading-relaxed italic">
                           "Bu modül, personelin klinik derinliğini artırmak amacıyla Gemini-3-Flash motoru tarafından optimize edilmiştir. Başlat butonuna tıklandığında kurum vizyonuna özel pedagojik sunum anlık üretilecektir."
                        </p>
                     </div>
                     <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl"></div>
                  </div>
               </div>

               <div className="p-10 bg-white border-t border-slate-50 flex gap-4">
                  <button 
                     onClick={() => handleStartTraining(selectedPlan)}
                     className="flex-1 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95"
                  >
                     AI SUNUMU BAŞLAT
                  </button>
                  <button 
                     onClick={() => setShowAssignModal(true)}
                     className="px-10 py-6 bg-slate-100 text-slate-600 rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                     PERSONELE ATA
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default CurriculumManager;
