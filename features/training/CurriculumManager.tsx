
import React, { useState, useMemo } from 'react';
import { GLOBAL_CURRICULA, TrainingPlan } from './curriculumData';
import { armsService } from '../../services/ai/armsService';
import { TrainingSlide, CustomTrainingPlan } from '../../types';
import AssignmentModal from './AssignmentModal';
import PresentationStudio from './PresentationStudio';

interface CurriculumManagerProps {
  onLaunchStudio: (slides: TrainingSlide[], plan: TrainingPlan) => void;
}

const CurriculumManager: React.FC<CurriculumManagerProps> = ({ onLaunchStudio }) => {
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT'>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeStudioPlan, setActiveStudioPlan] = useState<CustomTrainingPlan | null>(null);

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
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', accent: 'bg-slate-500' };
    }
  };

  const handleStartTraining = async (plan: TrainingPlan) => {
    setIsGenerating(true);
    try {
       const slides = await armsService.generateCurriculumTraining(plan);
       const studioPlan: CustomTrainingPlan = {
          id: plan.id,
          title: plan.title,
          category: plan.category,
          level: plan.level === 'Beginner' ? 'Beginner' : plan.level === 'Intermediate' ? 'Intermediate' : 'Advanced',
          description: plan.description,
          targetBranches: plan.targetBranches as any,
          curriculum: [],
          slides: slides,
          createdBy: 'Sistem',
          createdAt: Date.now(),
          status: 'published',
          aiConfig: {
             theme: 'ACADEMIC_COLD',
             slideCount: slides.length,
             tone: 'academic',
             academicConfig: { institutionName: 'Yeni Gün Akademi', headerAntet: true, officialSeal: true, signatureTitles: ['Kurul'], footerNote: '', showWatermark: true }
          } as any
       };
       setActiveStudioPlan(studioPlan);
    } catch (e) {
       alert("AI Sentez Hatası.");
    } finally {
       setIsGenerating(false);
    }
  };

  if (activeStudioPlan) {
     return <PresentationStudio customPlan={activeStudioPlan} onClose={() => setActiveStudioPlan(null)} />;
  }

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
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Akademik İnşa Süreci</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Katalog verisi nöral sunuma dönüştürülüyor...</p>
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
      
      {/* CONTROL BAR */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 z-20">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
               <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253" /></svg>
            </div>
            <div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Müfredat Kataloğu</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{filteredPlans.length} Rota Mevcut</p>
            </div>
         </div>

         <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
               <input 
                  type="text" 
                  placeholder="Eğitim veya branş ara..." 
                  className="w-full bg-slate-100 focus:bg-white focus:border-orange-500 p-3 pl-10 rounded-xl text-xs font-bold outline-none transition-all shadow-inner border border-transparent"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
               />
               <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
         </div>

         <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {['ALL', 'ORIENTATION', 'CLINICAL', 'ETHICS', 'MANAGEMENT'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveTab(cat as any)}
                 className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}
               >
                  {cat === 'ALL' ? 'Hepsi' : cat.substring(0,4)}
               </button>
            ))}
         </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredPlans.map(plan => {
               const theme = getCategoryTheme(plan.category);
               return (
                  <div 
                    key={plan.id}
                    onClick={() => handleStartTraining(plan)}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-[220px] relative overflow-hidden"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className={`px-2 py-1 ${theme.bg} ${theme.color} rounded-lg text-[8px] font-black uppercase tracking-tighter`}>{plan.category}</div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{plan.badge}</span>
                     </div>
                     <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">{plan.title}</h4>
                     <p className="text-[10px] font-medium text-slate-400 leading-snug line-clamp-3 mb-auto">{plan.description}</p>
                     
                     <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <button className="w-full py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">EĞİTİME BAŞLA</button>
                        <button 
                           onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); setShowAssignModal(true); }}
                           className="w-full py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20"
                        >PERSONELE ATA</button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default CurriculumManager;
