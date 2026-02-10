
import React, { useState, useRef } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import AssignmentModal from './AssignmentModal';

interface PresentationStudioProps {
  onClose: () => void;
  customPlan: CustomTrainingPlan;
  assignmentId?: string; 
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose, customPlan, assignmentId }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  const slides = Array.isArray(customPlan?.slides) ? customPlan.slides : [];
  const activeSlide = slides.length > 0 ? slides[activeSlideIdx] : null;
  const aiConfig = customPlan?.aiConfig;

  const themeStyles = {
    ACADEMIC_COLD: { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-slate-900', border: 'border-slate-200', point: 'bg-slate-900' },
    GOLDEN_ACADEMY: { bg: 'bg-[#0A0F1C]', text: 'text-white', accent: 'bg-orange-600', border: 'border-white/10', point: 'bg-orange-500' },
    CREATIVE_WARM: { bg: 'bg-orange-50', text: 'text-orange-950', accent: 'bg-orange-600', border: 'border-orange-200', point: 'bg-orange-600' },
    MINIMAL_TECH: { bg: 'bg-slate-950', text: 'text-white', accent: 'bg-blue-600', border: 'border-white/10', point: 'bg-blue-500' },
    OFFICIAL_MEB: { bg: 'bg-white', text: 'text-rose-950', accent: 'bg-rose-700', border: 'border-rose-100', point: 'bg-rose-700' }
  };

  const theme = themeStyles[aiConfig?.theme as keyof typeof themeStyles] || themeStyles.ACADEMIC_COLD;

  const renderMultimodalElement = (el: MultimodalElement) => {
    if (!el || !el.content) return null;
    switch (el.type) {
      case 'symbol':
        return (
          <div key={el.id} className={`flex items-center gap-6 p-8 rounded-[3rem] border ${theme.border} bg-white/5 shadow-inner`}>
            <div className="text-7xl drop-shadow-2xl">{el.content.icon || '🧠'}</div>
            <div className="space-y-1">
              <h5 className={`${theme.text} font-black text-2xl uppercase tracking-tighter`}>{el.content.label}</h5>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">AKADEMİK REFERANS</p>
            </div>
          </div>
        );
      case 'interactive_case':
        return (
          <div key={el.id} className="p-10 bg-orange-600 rounded-[4rem] shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest block mb-4">KLİNİK VAKA ANALİZİ</span>
                <p className="text-xl font-black text-white leading-tight italic">"{el.content.scenario}"</p>
                <div className="mt-8 pt-6 border-t border-white/20">
                   <p className="text-xs font-bold text-orange-100 uppercase tracking-[0.2em] leading-relaxed">Çözüm: {el.content.resolution}</p>
                </div>
             </div>
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        );
      default: return null;
    }
  };

  if (!activeSlide) return null;

  return (
    <div className="fixed inset-0 z-[4000] bg-[#0A0F1C] flex flex-col overflow-hidden animate-fade-in">
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       {/* 🚀 MERKEZİ YAYIN MODÜLÜ (EXPORT STUDIO) */}
       {isExportOpen && (
         <ExportStudio 
            onClose={() => setIsExportOpen(false)}
            data={{
              type: 'TRAINING_LIBRARY',
              entityName: customPlan.title,
              referenceId: customPlan.id,
              payload: customPlan,
              config: { title: 'HİZMET İÇİ EĞİTİM YAYINI' }
            }}
         />
       )}

       {/* ÜST KOMUTA BARI */}
       <div className="h-24 bg-slate-950 border-b border-white/5 flex items-center justify-between px-12 shrink-0 z-50 shadow-2xl no-print">
          <div className="flex items-center gap-10">
             <button onClick={onClose} className="w-14 h-14 bg-white/5 hover:bg-rose-600 rounded-2xl text-white transition-all flex items-center justify-center shadow-lg active:scale-90">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="hidden md:block">
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter truncate max-w-xl leading-none">{customPlan?.title}</h3>
                <p className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.5em] mt-3">AKADEMİK YAYIN PANELİ</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button 
                onClick={() => setIsExportOpen(true)}
                className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl active:scale-95 flex items-center gap-3"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                YAYINLA & İNDİR
             </button>
             
             <div className="flex gap-3 ml-4">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all font-black text-xl active:scale-90">←</button>
                <button 
                    onClick={() => setActiveSlideIdx(p => Math.min(slides.length - 1, p + 1))} 
                    className="px-12 h-14 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest shadow-2xl transition-all bg-white text-slate-950 hover:bg-orange-600 hover:text-white active:scale-95"
                >
                   {activeSlideIdx === slides.length - 1 ? 'SON SAYFA' : 'SIRADAKİ →'}
                </button>
             </div>
          </div>
       </div>

       {/* SLAYT KANVASI */}
       <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-slate-950 border-r border-white/5 flex flex-col shrink-0 no-print shadow-2xl">
             <div className="p-8 border-b border-white/5 bg-slate-900/50">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">SLAYT ENDEKSİ</h4>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                {slides.map((s, idx) => (
                   <button 
                     key={s.id || idx} 
                     onClick={() => setActiveSlideIdx(idx)}
                     className={`w-full p-5 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${activeSlideIdx === idx ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-[1.02]' : 'bg-white/5 border-transparent text-slate-600 hover:border-white/10'}`}
                   >
                      <span className="text-[9px] font-black uppercase opacity-60 block mb-1.5">SAYFA {idx + 1}</span>
                      <p className="text-[11px] font-bold truncate uppercase tracking-tight">{s.title}</p>
                   </button>
                ))}
             </div>
          </div>

          <div className="flex-1 relative flex flex-col items-center justify-start p-12 bg-black/50 overflow-y-auto custom-scrollbar">
             <div className="w-full max-w-[1200px] h-2 bg-white/5 rounded-full overflow-hidden mb-10 shrink-0 no-print">
                <div className="h-full bg-orange-600 transition-all duration-700 ease-out shadow-[0_0_30px_#ea580c]" style={{ width: `${((activeSlideIdx + 1) / (slides.length || 1)) * 100}%` }}></div>
             </div>

             <div className={`w-full max-w-[1200px] ${theme.bg} rounded-[5rem] aspect-video shadow-3xl overflow-hidden flex flex-col relative border ${theme.border} shrink-0`}>
                <div className={`h-28 border-b ${theme.border} flex items-center justify-between px-20 shrink-0 relative z-20 bg-black/5`}>
                   <div className="flex items-center gap-8">
                     <div className="w-16 h-16 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl">YG</div>
                     <div>
                       <h4 className={`text-xl font-black uppercase tracking-[0.2em] ${theme.text}`}>{aiConfig?.academicConfig?.institutionName || 'YENİ GÜN AKADEMİ'}</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1.5">RESMİ AKADEMİK YAYIN</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <span className={`px-6 py-2.5 ${theme.accent} text-white rounded-xl text-[10px] font-black uppercase tracking-widest`}>SAYFA {activeSlideIdx + 1} / {slides.length}</span>
                   </div>
                </div>

                <div className="p-20 flex-1 overflow-y-auto custom-scrollbar relative z-10 flex flex-col justify-start">
                   <h2 className={`text-6xl font-black ${theme.text} uppercase tracking-tighter border-l-[24px] border-orange-600 pl-16 leading-[0.85] mb-16`}>
                      {activeSlide.title}
                   </h2>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                      <div className={`${activeSlide.elements?.length ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-10`}>
                         {(activeSlide.content || []).map((c, i) => (
                            <div key={i} className="flex gap-8 items-start">
                               <div className={`w-3.5 h-3.5 ${theme.point} rounded-full mt-3 shrink-0`}></div>
                               <p className={`text-2xl font-bold ${theme.text} leading-[1.3] opacity-95 italic tracking-tight`}>"{c}"</p>
                            </div>
                         ))}
                      </div>
                      {activeSlide.elements && activeSlide.elements.length > 0 && (
                        <div className="lg:col-span-5 flex flex-col gap-10">
                           {activeSlide.elements.map(el => renderMultimodalElement(el))}
                        </div>
                      )}
                   </div>
                </div>

                <div className={`p-10 ${theme.bg} border-t ${theme.border} flex justify-between items-center shrink-0 bg-black/5`}>
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">KOPYALANAMAZ • MÜHÜRLÜ DÖKÜMAN</span>
                </div>
             </div>

             <div className="w-full max-w-[1200px] mt-12 bg-slate-900/95 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/10 flex gap-16 shadow-3xl mb-32 no-print">
                <div className="w-64 shrink-0">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">🚀</div>
                      <h5 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em]">EĞİTMEN NOTU</h5>
                   </div>
                </div>
                <div className="flex-1 border-l border-white/5 pl-16">
                   <p className="text-slate-200 font-medium text-xl leading-relaxed italic opacity-95">
                      {activeSlide.speakerNotes || 'Klinik direktif bulunmamaktadır.'}
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
