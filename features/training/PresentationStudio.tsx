
import React, { useState, useEffect, useCallback } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PresentationStudioProps {
  onClose?: () => void;
  initialSlides?: TrainingSlide[];
  customPlan?: CustomTrainingPlan;
  assignmentId?: string;
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose, initialSlides, customPlan, assignmentId }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [slides, setSlides] = useState<any[]>(customPlan?.slides || initialSlides || []);
  const [view, setView] = useState<'presentation' | 'quiz' | 'completed'>('presentation');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  const activeSlide = slides[activeSlideIdx];

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
    } catch (e) { console.error(e); }
  }, [assignmentId, activeSlideIdx, slides.length]);

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

  const handleDownloadPDF = async () => {
    const el = document.getElementById('slide-canvas');
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
    pdf.save(`YG_SUNU_${activeSlideIdx + 1}.pdf`);
  };

  const renderElement = (el: MultimodalElement) => {
    switch (el.type) {
      case 'text':
        return <p className="text-2xl font-medium text-slate-700 leading-relaxed mb-6">{el.content.toString()}</p>;
      case 'image_prompt':
        return (
          <div className="bg-slate-100 rounded-[2rem] aspect-video flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 mb-8 overflow-hidden group relative">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">🎨</span>
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center max-w-sm">{el.content.toString()}</p>
             <div className="absolute bottom-4 right-4 px-3 py-1 bg-slate-900/5 rounded-lg text-[8px] font-black text-slate-400 uppercase">AI Generated Visual Frame</div>
          </div>
        );
      case 'symbol':
        const symbolData = el.content as any;
        return (
          <div className="flex items-center gap-6 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 mb-8 hover:bg-blue-100 transition-colors">
             <div className="text-7xl drop-shadow-xl">{symbolData.icon || '🧩'}</div>
             <div>
                <h5 className="text-blue-900 font-black text-xl uppercase tracking-tight">{symbolData.label || 'Kavram Kartı'}</h5>
                <p className="text-blue-700 text-[10px] font-black uppercase opacity-60 tracking-widest mt-1">Pedagojik Görsel Mühür</p>
             </div>
          </div>
        );
      case 'interactive_case':
        const caseData = el.content as any;
        return (
          <div className="bg-orange-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group mb-8 border-4 border-orange-500/50">
             <div className="relative z-10">
                <span className="text-[11px] font-black text-orange-200 uppercase tracking-[0.4em] block mb-6">KLİNİK VAKA ANALİZİ</span>
                <p className="text-3xl font-black italic tracking-tighter leading-tight uppercase">"{caseData.question || el.content}"</p>
                <div className="mt-8 flex gap-4">
                   <div className="w-10 h-10 bg-white/20 rounded-full animate-ping"></div>
                   <p className="text-xs font-bold text-orange-100 opacity-80 uppercase tracking-widest pt-3">Tartışma Bekleniyor...</p>
                </div>
             </div>
             <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        );
      case 'graph_logic':
        return (
          <div className="p-10 bg-slate-900 rounded-[3rem] text-white mb-8 border border-white/10">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Veri Projeksiyonu</span>
             </div>
             <p className="text-lg font-bold italic text-slate-300">"{el.content.toString()}"</p>
          </div>
        );
      default: return null;
    }
  };

  if (view === 'completed') {
    return (
      <div className="fixed inset-0 z-[4000] bg-slate-950 flex flex-col items-center justify-center p-8 animate-fade-in">
         <div className="max-w-md w-full bg-white rounded-[4rem] p-12 text-center space-y-8 shadow-2xl scale-in border-b-[12px] border-emerald-500">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Mühürlendi</h2>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Akademik gelişim dosyanız güncellendi.</p>
            </div>
            <button onClick={onClose} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">HUB'A DÖN</button>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950 flex flex-col overflow-hidden animate-fade-in no-print">
       {/* TOP HUD */}
       <div className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative z-[4001]">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-2xl text-white transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
             <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight leading-none">{customPlan?.title || activeSlide?.title}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                   <span className="px-2 py-0.5 bg-orange-600 text-white text-[8px] font-black rounded uppercase">CANLI SUNUM</span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SLAYT {activeSlideIdx + 1} / {slides.length}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleDownloadPDF} className="px-5 py-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Slaytı PDF Yap</button>
             <div className="h-8 w-px bg-white/10 mx-2"></div>
             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-slate-800 transition-all text-2xl font-black">←</button>
                <button onClick={handleNext} className="px-10 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all shadow-xl active:scale-95">{activeSlideIdx === slides.length - 1 ? 'MÜHÜRLE' : 'DEVAM →'}</button>
             </div>
          </div>
       </div>

       {/* MAIN CANVAS */}
       <div className="flex-1 relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-slate-950">
          <div id="slide-canvas" className="w-full max-w-6xl bg-white rounded-[3.5rem] md:rounded-[5rem] aspect-video shadow-[0_80px_150px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col relative animate-scale-in border-b-[20px] border-slate-900">
             <div className="p-12 md:p-20 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-1.5 h-12 bg-orange-600 rounded-full"></div>
                   <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                      {activeSlide?.title}
                   </h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   {activeSlide?.elements ? (
                      activeSlide.elements.map((el: any) => <div key={el.id} className="animate-slide-up">{renderElement(el)}</div>)
                   ) : (
                      <div className="space-y-6">
                        {activeSlide?.content?.map((point: string, i: number) => (
                           <div key={i} className="flex gap-6 items-start group">
                              <div className="w-3 h-3 bg-slate-200 group-hover:bg-orange-600 rounded-full mt-4 shrink-0 transition-all"></div>
                              <p className="text-2xl md:text-3xl font-bold text-slate-600 leading-snug group-hover:text-slate-900 transition-colors">{point}</p>
                           </div>
                        ))}
                      </div>
                   )}
                </div>
             </div>
             
             {/* Slide Footer */}
             <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">YG</div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">NÖRAL MÜFREDAT FABRİKASI</span>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white"></div>
                   </div>
                   <span className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black shadow-lg">{activeSlideIdx + 1}</span>
                </div>
             </div>
          </div>
          
          {/* Background Decorative */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-600/5 via-transparent to-transparent -z-10 animate-pulse"></div>
       </div>

       {/* SPEAKER HUD (ADMIN ONLY) */}
       <div className="h-44 bg-slate-900 border-t border-white/5 p-8 overflow-y-auto custom-scrollbar shrink-0 flex gap-12 relative">
          <div className="w-48 shrink-0 border-r border-white/5">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">KLİNİK ODAK</span>
             <p className="text-[11px] font-bold text-white uppercase leading-relaxed">{customPlan?.category || 'Genel Gelişim'}</p>
          </div>
          <div className="flex-1 max-w-4xl">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">EĞİTMEN MASTER NOTLARI</span>
             <p className="text-base font-medium text-slate-300 leading-relaxed italic">
                {activeSlide?.speakerNotes || 'Bu slayt için nöral sentez notları henüz mühürlenmedi.'}
             </p>
          </div>
          <div className="absolute right-8 top-8 opacity-10">
             <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
