
import React, { useState } from 'react';
import { GLOBAL_CURRICULA, TrainingPlan, CurriculumModule, CurriculumUnit } from './curriculumData';
import { armsService } from '../../services/ai/armsService';
import { TrainingSlide } from '../../types';

interface CurriculumManagerProps {
  onLaunchStudio: (slides: TrainingSlide[], plan: TrainingPlan) => void;
}

const CurriculumManager: React.FC<CurriculumManagerProps> = ({ onLaunchStudio }) => {
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT'>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredPlans = GLOBAL_CURRICULA.filter(p => activeTab === 'ALL' || p.category === activeTab);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ORIENTATION': return 'bg-orange-500';
      case 'CLINICAL': return 'bg-blue-600';
      case 'ETHICS': return 'bg-emerald-600';
      case 'MANAGEMENT': return 'bg-slate-900';
      default: return 'bg-slate-600';
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
      <div className="fixed inset-0 z-[2000] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
          <div className="relative mb-12">
             <div className="w-56 h-56 border-[12px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-slate-900 rounded-[3rem] shadow-2xl flex items-center justify-center border border-white/10 animate-pulse">
                   <span className="text-white font-black text-2xl">AI</span>
                </div>
             </div>
          </div>
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Eğitim Materyali İnşa Ediliyor</h3>
          <p className="text-orange-500 font-black text-xl uppercase tracking-[0.5em] animate-pulse">Pedagojik Muhakeme Aktif</p>
          <p className="mt-8 text-slate-500 text-sm font-bold max-w-lg uppercase leading-relaxed tracking-widest">
            "{selectedPlan?.title}" konusu için nöral gerekçeler, vaka simülasyonları ve klinik literatür taranarak kurumsal sunum oluşturuluyor...
          </p>
      </div>
    );
  }

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
           
           <div className="relative z-10 flex flex-col items-end gap-6">
              <div className="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center text-4xl shadow-inner rotate-3">
                 {selectedPlan.badge.substring(0, 3)}
              </div>
              <button 
                onClick={() => handleStartTraining(selectedPlan)}
                className="px-12 py-6 bg-orange-600 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:bg-white hover:text-slate-900 transition-all active:scale-95"
              >
                EĞİTİME BAŞLA (AI)
              </button>
           </div>
           
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Info & Placeholder */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
           <div className="bg-slate-50 p-20 rounded-[5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40 grayscale">
              <svg className="w-32 h-32 text-slate-300 mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <h3 className="text-3xl font-black uppercase tracking-widest text-slate-400">Ünite Seçimi Bekleniyor</h3>
              <p className="max-w-md mt-4 text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-[0.2em]">Eğitimi başlatmak için sağ üstteki butonu kullanarak "Nöral Müfredat Jeneratörü"nü aktive edebilirsiniz.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-20 h-full overflow-y-auto custom-scrollbar pr-4">
      {/* Catalog Filter Header */}
      <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-50">
         <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Akademik Müfredat Kataloğu</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kurumsal Liyakat Standartları v24.1</p>
         </div>
         <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {['ALL', 'ORIENTATION', 'CLINICAL', 'ETHICS', 'MANAGEMENT'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveTab(cat as any)}
                 className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {cat === 'ALL' ? 'Tümü' : cat === 'ORIENTATION' ? 'Oryantasyon' : cat === 'CLINICAL' ? 'Klinik' : cat === 'ETHICS' ? 'Etik' : 'Yönetim'}
               </button>
            ))}
         </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         {filteredPlans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="bg-white rounded-[4rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group cursor-pointer overflow-hidden flex flex-col h-[400px]"
            >
               <div className={`h-3 ${getCategoryColor(plan.category)} w-full`}></div>
               <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                           {plan.badge.substring(0, 3)}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{plan.badge}</span>
                     </div>
                     <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4 group-hover:text-orange-600 transition-colors">{plan.title}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-wide line-clamp-3">{plan.description}</p>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">SEVİYE</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase">{plan.level}</span>
                     </div>
                     <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default CurriculumManager;
