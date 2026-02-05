
import React, { useState, useEffect, useCallback } from 'react';
import { PresentationConfig, TrainingSlide, CustomTrainingPlan, MultimodalElement } from '../../types';
import { jsPDF } from 'jspdf';

interface PresentationStudioProps {
  onClose?: () => void;
  initialSlides?: TrainingSlide[];
  customPlan?: CustomTrainingPlan;
  assignmentId?: string; // Personel modu için
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose, initialSlides, customPlan, assignmentId }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [slides, setSlides] = useState<any[]>(customPlan ? customPlan.slides : (initialSlides || []));
  const [view, setView] = useState<'presentation' | 'quiz' | 'completed'>('presentation');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  const activeSlide = slides[activeSlideIdx];

  // İlerleme Kaydetme
  const updateProgress = useCallback(async (isFinal = false, score?: number) => {
    if (!assignmentId) return;
    try {
      const progress = Math.round(((activeSlideIdx + 1) / slides.length) * 100);
      await fetch('/api/training?action=update_progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          progress: isFinal ? 100 : progress,
          status: isFinal ? 'completed' : 'in_progress',
          score: score
        })
      });
    } catch (e) { console.error("Progress save fail", e); }
  }, [assignmentId, activeSlideIdx, slides.length]);

  useEffect(() => {
    if (assignmentId && view === 'presentation') {
      updateProgress();
    }
  }, [activeSlideIdx, assignmentId, view, updateProgress]);

  const handleNext = () => {
    if (activeSlideIdx < slides.length - 1) {
      setActiveSlideIdx(p => p + 1);
    } else {
      if (customPlan?.finalQuiz?.questions && customPlan.finalQuiz.questions.length > 0) {
        setView('quiz');
      } else {
        setView('completed');
        updateProgress(true);
      }
    }
  };

  const handleFinishQuiz = async () => {
    let correct = 0;
    const total = customPlan?.finalQuiz?.questions.length || 1;
    customPlan?.finalQuiz?.questions.forEach(q => {
      const selectedIdx = quizAnswers[q.id];
      if (selectedIdx !== undefined && q.options[selectedIdx].isCorrect) correct++;
    });
    const score = Math.round((correct / total) * 100);
    setIsSaving(true);
    await updateProgress(true, score);
    setIsSaving(false);
    setView('completed');
  };

  const renderElement = (el: MultimodalElement) => {
    switch (el.type) {
      case 'text':
        return <p className="text-2xl font-medium text-slate-700 leading-relaxed mb-6">{el.content}</p>;
      case 'image_prompt':
        return (
          <div className="bg-slate-100 rounded-[2rem] aspect-video flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 mb-8 overflow-hidden group">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                <span className="text-3xl">🖼️</span>
             </div>
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">{el.content}</p>
             <div className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase">AI REKONSTRÜKSİYON AKTİF</div>
          </div>
        );
      case 'symbol':
        return (
          <div className="flex items-center gap-6 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 mb-8">
             <div className="text-6xl">{el.content.icon || '🧩'}</div>
             <div>
                <h5 className="text-blue-900 font-black text-lg uppercase">{el.content.label}</h5>
                <p className="text-blue-700 text-sm font-bold opacity-70">Görsel Destekli Pedagoji Sembolü</p>
             </div>
          </div>
        );
      case 'interactive_case':
        return (
          <div className="bg-orange-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group mb-8">
             <div className="relative z-10">
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest block mb-4">KLİNİK VAKA TARTIŞMASI</span>
                <p className="text-3xl font-black italic tracking-tight leading-tight">"{el.content.question}"</p>
             </div>
          </div>
        );
      default: return null;
    }
  };

  if (view === 'completed') {
    return (
      <div className="fixed inset-0 z-[4000] bg-slate-950 flex flex-col items-center justify-center p-8 animate-fade-in">
         <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl scale-in">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Eğitim Tamamlandı</h2>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Akademik gelişim dosyanız başarıyla mühürlendi.</p>
            <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all">PANELA DÖN</button>
         </div>
      </div>
    );
  }

  if (view === 'quiz') {
    return (
      <div className="fixed inset-0 z-[4000] bg-slate-50 overflow-y-auto custom-scrollbar flex flex-col items-center py-20 px-8">
         <div className="max-w-3xl w-full space-y-12">
            <div className="text-center space-y-4">
               <span className="px-4 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">LİYAKAT MÜHRÜ SINAVI</span>
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Kazanım Ölçümü</h2>
            </div>
            
            {(customPlan?.finalQuiz?.questions || []).map((q, qIdx) => (
               <div key={q.id} className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8">
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-snug">{qIdx + 1}. {q.text}</h4>
                  <div className="space-y-3">
                     {q.options.map((opt, oIdx) => (
                        <button 
                          key={oIdx}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                          className={`w-full p-6 rounded-2xl border-2 text-left transition-all font-bold text-sm ${quizAnswers[q.id] === oIdx ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 hover:border-orange-300 text-slate-600'}`}
                        >
                           {opt.label}
                        </button>
                     ))}
                  </div>
               </div>
            ))}

            <button 
              onClick={handleFinishQuiz}
              disabled={isSaving || (customPlan?.finalQuiz?.questions.length !== Object.keys(quizAnswers).length)}
              className="w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-30"
            >
               {isSaving ? 'İŞLENİYOR...' : 'SINAVI BİTİR VE MÜHÜRLE'}
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950 flex flex-col overflow-hidden animate-fade-in no-print">
       {/* TOP CONTROL BAR */}
       <div className="h-20 bg-slate-900 border-b border-white/10 flex items-center justify-between px-8 shrink-0 relative z-[4001]">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
             <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight leading-none">{customPlan?.title || activeSlide?.title}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Slayt {activeSlideIdx + 1} / {slides.length}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-orange-600 transition-all text-xl font-black">←</button>
                <button onClick={handleNext} className="px-8 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl">{activeSlideIdx === slides.length - 1 ? 'BİTİR VE SINAVA GEÇ' : 'SONRAKİ →'}</button>
             </div>
          </div>
       </div>

       {/* MAIN STAGE */}
       <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
          <div className="w-full max-w-7xl bg-white rounded-[4rem] aspect-video shadow-[0_100px_150px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative animate-scale-in">
             <div className="p-20 flex-1 overflow-y-auto custom-scrollbar">
                <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-[16px] border-orange-600 pl-10 leading-none">{activeSlide?.title}</h2>
                <div className="space-y-6">
                   {activeSlide?.elements ? (
                      activeSlide.elements.map((el: any) => <div key={el.id}>{renderElement(el)}</div>)
                   ) : (
                      activeSlide?.content?.map((point: string, i: number) => (
                         <div key={i} className="flex gap-6 items-start">
                            <div className="w-3 h-3 bg-orange-600 rounded-full mt-4 shrink-0 shadow-lg"></div>
                            <p className="text-3xl font-bold text-slate-600 leading-snug">{point}</p>
                         </div>
                      ))
                   )}
                </div>
             </div>
             <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">NÖRAL AKADEMİ MÜHÜRLÜ İÇERİK</span>
                <span className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{activeSlideIdx + 1}</span>
             </div>
          </div>
       </div>

       {/* SPEAKER NOTES */}
       <div className="h-40 bg-slate-900 border-t border-white/5 p-8 overflow-y-auto custom-scrollbar shrink-0 no-print">
          <div className="max-w-5xl mx-auto text-slate-300 font-medium text-sm leading-relaxed italic">
             {activeSlide?.speakerNotes || 'Bu slayt için özel bir not bulunmamaktadır.'}
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
