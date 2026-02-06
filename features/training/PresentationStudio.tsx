
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PresentationConfig, TrainingSlide, CustomTrainingPlan, MultimodalElement } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import AssignmentModal from './AssignmentModal';

interface PresentationStudioProps {
  onClose?: () => void;
  initialSlides?: TrainingSlide[];
  customPlan?: CustomTrainingPlan;
  assignmentId?: string; // Personel modu için
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose, initialSlides, customPlan, assignmentId }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [slides, setSlides] = useState<any[]>(customPlan?.slides || initialSlides || []);
  const [view, setView] = useState<'presentation' | 'quiz' | 'completed'>('presentation');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  
  const slideRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides[activeSlideIdx];

  // İlerleme Kaydetme (Personel Modu)
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
    const total = customPlan?.finalQuiz?.questions?.length || 1;
    customPlan?.finalQuiz?.questions?.forEach(q => {
      const selectedIdx = quizAnswers[q.id];
      if (selectedIdx !== undefined && q.options[selectedIdx].isCorrect) correct++;
    });
    const score = Math.round((correct / total) * 100);
    setIsSaving(true);
    await updateProgress(true, score);
    setIsSaving(false);
    setView('completed');
  };

  const handleDownloadPDF = async () => {
    if(!slideRef.current) return;
    setIsExporting(true);
    try {
        const canvas = await html2canvas(slideRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const width = 297;
        const height = 210;
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
        pdf.save(`${customPlan?.title || 'Egitim_Sunumu'}_Slayt_${activeSlideIdx+1}.pdf`);
    } catch(e) {
        console.error(e);
        alert("PDF oluşturulamadı.");
    } finally {
        setIsExporting(false);
    }
  };

  const handleArchive = async () => {
      if(!customPlan || !slides) return;
      setIsSaving(true);
      try {
          const res = await fetch('/api/training?action=save', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({...customPlan, archive_category: 'TRAINING_LIBRARY', status: 'archived'})
          });
          if(res.ok) alert("Eğitim kütüphaneye mühürlendi.");
      } finally {
          setIsSaving(false);
      }
  };

  const renderElement = (el: any) => {
    // Normalization logic for older schema vs new multimodal schema
    const type = el.type; 
    const content = el.content;

    switch (type) {
      case 'text':
        return <p className="text-2xl font-medium text-slate-700 leading-relaxed mb-6 border-l-4 border-slate-200 pl-6">{content.text || content}</p>;
      case 'image_prompt':
        return (
          <div className="bg-slate-100 rounded-[2rem] aspect-video flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 mb-8 overflow-hidden group relative">
             <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://source.unsplash.com/random/800x600/?abstract,education)' }}></div>
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 relative z-10">
                <span className="text-3xl">🖼️</span>
             </div>
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center relative z-10 max-w-lg">{content.label || "AI Görsel Üretim Alanı"}</p>
             <div className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase relative z-10">AI REKONSTRÜKSİYON AKTİF</div>
          </div>
        );
      case 'symbol':
        return (
          <div className="flex items-center gap-6 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 mb-8 shadow-sm">
             <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl shadow-md border border-blue-50">
                {content.icon || '🧩'}
             </div>
             <div>
                <h5 className="text-blue-900 font-black text-2xl uppercase tracking-tight">{content.label || 'Kavramsal Sembol'}</h5>
                <p className="text-blue-700 text-xs font-bold opacity-70 uppercase tracking-widest mt-1">Görsel Destekli Pedagoji</p>
             </div>
          </div>
        );
      case 'interactive_case':
        return (
          <div className="bg-orange-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group mb-8">
             <div className="relative z-10">
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest block mb-4">KLİNİK VAKA TARTIŞMASI</span>
                <p className="text-3xl font-black italic tracking-tight leading-tight">"{content.question || content.text}"</p>
             </div>
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
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
               <div key={q.id} className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-slate-100">
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
              disabled={isSaving || (customPlan?.finalQuiz?.questions?.length !== Object.keys(quizAnswers).length)}
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
       {showAssignmentModal && customPlan && (
           <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />
       )}

       {/* TOP CONTROL BAR */}
       <div className="h-24 bg-slate-900 border-b border-white/10 flex items-center justify-between px-8 shrink-0 relative z-[4001]">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
             <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tight leading-none max-w-lg truncate">{customPlan?.title || activeSlide?.title}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Slayt {activeSlideIdx + 1} / {slides.length}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Admin / Creator Tools */}
             {!assignmentId && customPlan && (
                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-4">
                     <button onClick={handleDownloadPDF} disabled={isExporting} className="px-4 py-2 text-[9px] font-black text-white uppercase hover:bg-white/10 rounded-lg transition-all">
                        {isExporting ? '...' : 'PDF İNDİR'}
                     </button>
                     <button onClick={() => setShowAssignmentModal(true)} className="px-4 py-2 text-[9px] font-black text-white uppercase hover:bg-white/10 rounded-lg transition-all">ATAMA YAP</button>
                     <button onClick={handleArchive} disabled={isSaving} className="px-4 py-2 text-[9px] font-black text-orange-500 uppercase hover:bg-white/10 rounded-lg transition-all">KÜTÜPHANEYE KAYDET</button>
                 </div>
             )}

             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-orange-600 transition-all text-xl font-black">←</button>
                <button onClick={handleNext} className="px-8 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl">{activeSlideIdx === slides.length - 1 ? 'BİTİR VE SINAVA GEÇ' : 'SONRAKİ →'}</button>
             </div>
          </div>
       </div>

       {/* MAIN STAGE */}
       <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden bg-slate-950">
          <div ref={slideRef} className="w-full max-w-[1400px] bg-white rounded-[3rem] aspect-video shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative animate-scale-in">
             <div className="p-16 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                    <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter border-l-[12px] border-orange-600 pl-8 leading-none max-w-4xl">
                        {activeSlide?.title}
                    </h2>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">MIA VISUAL ENGINE</span>
                        <div className="flex justify-end gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                   {/* Multimodal Elements Render */}
                   {activeSlide?.elements ? (
                      activeSlide.elements.map((el: any, i: number) => <div key={i}>{renderElement(el)}</div>)
                   ) : (
                      // Fallback for legacy text-only slides
                      activeSlide?.content?.map((point: string, i: number) => (
                         <div key={i} className="flex gap-6 items-start p-6 rounded-[2rem] hover:bg-slate-50 transition-colors">
                            <div className="w-4 h-4 bg-orange-600 rounded-full mt-3 shrink-0 shadow-lg ring-4 ring-orange-100"></div>
                            <p className="text-2xl font-bold text-slate-600 leading-snug">{point}</p>
                         </div>
                      ))
                   )}
                </div>
             </div>
             
             {/* Slide Footer */}
             <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">NÖRAL AKADEMİ EĞİTİM MATERYALİ</span>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{activeSlide?.type || 'STANDARD SLIDE'}</span>
                    <span className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">{activeSlideIdx + 1}</span>
                </div>
             </div>
          </div>
       </div>

       {/* SPEAKER NOTES */}
       <div className="h-32 bg-slate-900 border-t border-white/5 px-12 py-6 overflow-y-auto custom-scrollbar shrink-0 no-print flex gap-8">
          <div className="w-32 shrink-0">
             <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-2">EĞİTMEN NOTU</span>
             <div className="h-1 w-full bg-orange-600 rounded-full"></div>
          </div>
          <p className="text-slate-300 font-medium text-sm leading-relaxed italic max-w-4xl">
             {activeSlide?.speakerNotes || 'Bu slayt için özel bir not bulunmamaktadır.'}
          </p>
       </div>
    </div>
  );
};

export default PresentationStudio;
