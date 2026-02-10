
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

  const slides = Array.isArray(customPlan?.slides) ? customPlan.slides : [];
  const activeSlide = slides.length > 0 ? slides[activeSlideIdx] : null;

  if (!activeSlide) return null;

  return (
    <div className="fixed inset-0 z-[4000] bg-[#0A0F1C] flex flex-col overflow-hidden animate-fade-in">
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       {isExportOpen && (
         <ExportStudio 
            onClose={() => setIsExportOpen(false)}
            data={{
              type: 'TRAINING_MODULE',
              entityName: customPlan.title,
              referenceId: customPlan.id,
              payload: customPlan,
              config: { title: 'KURUMSAL AKADEMİ EĞİTİM YAYINI' }
            }}
         />
       )}

       {/* ÜST KOMUTA BARI */}
       <div className="h-24 bg-slate-950 border-b border-white/5 flex items-center justify-between px-12 shrink-0 z-50 no-print">
          <div className="flex items-center gap-10">
             <button onClick={onClose} className="w-14 h-14 bg-white/5 hover:bg-rose-600 rounded-2xl text-white transition-all flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6" /></svg>
             </button>
             <div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter truncate max-w-xl leading-none">{customPlan?.title}</h3>
                <p className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.5em] mt-3">Multimodal Akademi Studio</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button onClick={() => setIsExportOpen(true)} className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                YAYINLA & İNDİR
             </button>
             
             <div className="flex gap-3 ml-4">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 font-black text-xl">←</button>
                <button onClick={() => setActiveSlideIdx(p => Math.min(slides.length - 1, p + 1))} className="px-12 h-14 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest shadow-2xl transition-all bg-white text-slate-950 hover:bg-orange-600 hover:text-white">
                   {activeSlideIdx === slides.length - 1 ? 'SON SAYFA' : 'SIRADAKİ →'}
                </button>
             </div>
          </div>
       </div>

       {/* SLAYT KANVASI */}
       <div className="flex-1 relative flex flex-col items-center justify-start p-12 bg-black/50 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-[1100px] bg-white rounded-[5rem] aspect-video shadow-3xl overflow-hidden flex flex-col relative shrink-0">
             <div className="p-24 flex-1 flex flex-col justify-center">
                <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter border-l-[24px] border-orange-600 pl-16 leading-[0.85] mb-16">
                   {activeSlide.title}
                </h2>
                <div className="space-y-10 pl-16">
                   {(activeSlide.content || []).map((c, i) => (
                      <div key={i} className="flex gap-8 items-start">
                         <div className="w-3 h-3 bg-orange-500 rounded-full mt-3 shrink-0"></div>
                         <p className="text-3xl font-bold text-slate-700 leading-snug tracking-tight italic">"{c}"</p>
                      </div>
                   ))}
                </div>
             </div>
             <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">YENİ GÜN AKADEMİ EĞİTİM SERİSİ</span>
                <span className="text-2xl font-black text-slate-200">#{activeSlideIdx + 1}</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
