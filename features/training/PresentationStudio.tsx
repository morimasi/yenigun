
import React, { useState, useRef, useEffect } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement, TrainingQuiz } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import AssignmentModal from './AssignmentModal';

interface PresentationStudioProps {
  onClose: () => void;
  customPlan: CustomTrainingPlan;
  assignmentId?: string; 
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose, customPlan, assignmentId }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [view, setView] = useState<'presentation' | 'quiz' | 'completed'>('presentation');
  const slideRef = useRef<HTMLDivElement>(null);

  // KRİTİK GÜVENLİK: slides dizisi her zaman dizi olmalı
  const slides = Array.isArray(customPlan?.slides) ? customPlan.slides : [];
  const activeSlide = slides.length > 0 ? slides[activeSlideIdx] : null;
  const aiConfig = customPlan?.aiConfig;

  const themeStyles = {
    ACADEMIC_COLD: { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-slate-900', border: 'border-slate-200' },
    GOLDEN_ACADEMY: { bg: 'bg-[#0A0F1C]', text: 'text-white', accent: 'bg-orange-600', border: 'border-white/10' },
    CREATIVE_WARM: { bg: 'bg-orange-50', text: 'text-orange-950', accent: 'bg-orange-600', border: 'border-orange-200' },
    MINIMAL_TECH: { bg: 'bg-slate-950', text: 'text-white', accent: 'bg-blue-600', border: 'border-white/10' },
    OFFICIAL_MEB: { bg: 'bg-white', text: 'text-rose-950', accent: 'bg-rose-700', border: 'border-rose-100' }
  };

  const theme = themeStyles[aiConfig?.theme as keyof typeof themeStyles] || themeStyles.ACADEMIC_COLD;

  const handleDownloadPDF = async () => {
    if (!slideRef.current || slides.length === 0) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        setActiveSlideIdx(i);
        await new Promise(r => setTimeout(r, 600)); 
        const canvas = await html2canvas(slideRef.current, { scale: 1.5, useCORS: true, logging: false });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      }
      pdf.save(`YG_AKADEMI_${(customPlan?.title || 'EGITIM').replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } finally { setIsExporting(false); }
  };

  const renderMultimodalElement = (el: MultimodalElement) => {
    if (!el || !el.content) return null;
    switch (el.type) {
      case 'symbol':
        return (
          <div key={el.id} className={`flex items-center gap-6 p-8 rounded-[2.5rem] border ${theme.border} mb-6 bg-white/5`}>
            <div className="text-6xl">{el.content.icon || '🧩'}</div>
            <div>
              <h5 className={`${theme.text} font-black text-2xl uppercase tracking-tighter`}>{el.content.label}</h5>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Nöral Protokol</p>
            </div>
          </div>
        );
      case 'graph_logic':
        const rawPoints = Array.isArray(el.content.dataPoints) ? el.content.dataPoints : [40, 70, 50, 90, 60];
        const chartData = rawPoints.map((v: number, i: number) => ({ n: i, v }));
        return (
          <div key={el.id} className={`p-8 rounded-[3rem] border ${theme.border} mb-6 h-64 bg-white/5`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}><Bar dataKey="v" radius={[8, 8, 0, 0]} fill="#ea580c" /></BarChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return <p key={el.id} className={`text-xl font-bold ${theme.text} italic border-l-8 border-orange-600 pl-8 mb-6 opacity-90`}>"{el.content.text || '...'}"</p>;
    }
  };

  if (slides.length === 0 || !activeSlide) {
    return (
      <div className="fixed inset-0 bg-[#0A0F1C] flex flex-col items-center justify-center p-12 text-center">
         <div className="w-24 h-24 border-4 border-white/5 border-t-orange-600 rounded-full animate-spin mb-8"></div>
         <h3 className="text-white font-black uppercase tracking-widest">Nöral Veri Bekleniyor</h3>
         <button onClick={onClose} className="mt-8 px-8 py-3 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all">Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[4000] bg-[#0A0F1C] flex flex-col overflow-hidden animate-fade-in no-print">
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       <div className="h-20 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-50">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-rose-600 rounded-xl text-white transition-all flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="h-6 w-px bg-white/10"></div>
             <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight truncate max-w-md">{customPlan?.title}</h3>
                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-1">Akademik Yayın Kurulu</p>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="flex bg-black/40 p-1 rounded-xl mr-4 border border-white/5">
                <button onClick={handleDownloadPDF} disabled={isExporting} className="px-5 py-2 text-[9px] font-black text-slate-300 uppercase hover:bg-white/10 rounded-lg transition-all flex items-center gap-2">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                   {isExporting ? 'İŞLENİYOR' : 'PDF İNDİR'}
                </button>
                <button onClick={() => setShowAssignmentModal(true)} className="px-5 py-2 text-[9px] font-black text-orange-500 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2">
                   PAYLAŞ / ATA
                </button>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all font-black">←</button>
                <button 
                    onClick={() => activeSlideIdx < slides.length - 1 ? setActiveSlideIdx(p => p + 1) : setView('completed')} 
                    className={`px-10 h-12 rounded-xl flex items-center justify-center font-black uppercase tracking-widest shadow-xl transition-all ${activeSlideIdx === slides.length - 1 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 hover:bg-orange-600 hover:text-white'}`}
                >
                   {activeSlideIdx === slides.length - 1 ? 'BİTİR' : 'İLERLE →'}
                </button>
             </div>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-slate-900/50 border-r border-white/5 flex flex-col shrink-0">
             <div className="p-6 border-b border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">SLAYT GEZGİNİ</h4>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {slides.map((s, idx) => (
                   <button 
                     key={s.id || idx} 
                     onClick={() => setActiveSlideIdx(idx)}
                     className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${activeSlideIdx === idx ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-[1.05]' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'}`}
                   >
                      <span className="text-[9px] font-black uppercase block mb-1 opacity-60">Slayt {idx + 1}</span>
                      <p className="text-[11px] font-bold truncate uppercase tracking-tight">{s.title}</p>
                   </button>
                ))}
             </div>
          </div>

          <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-black/20 overflow-hidden">
             <div className="w-full h-2 bg-white/5 absolute top-0 left-0">
                <div className="h-full bg-orange-600 transition-all duration-500 shadow-[0_0_15px_#ea580c]" style={{ width: `${((activeSlideIdx + 1) / slides.length) * 100}%` }}></div>
             </div>

             <div ref={slideRef} className={`w-full max-w-[1200px] ${theme.bg} rounded-[4rem] aspect-video shadow-[0_50px_150px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative animate-scale-in border ${theme.border}`}>
                {aiConfig?.academicConfig?.headerAntet && (
                  <div className={`h-24 border-b ${theme.border} flex items-center justify-between px-16 shrink-0 relative z-20`}>
                     <div className="flex items-center gap-6">
                       <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black">YG</div>
                       <div>
                         <h4 className={`text-sm font-black uppercase tracking-widest ${theme.text}`}>{aiConfig.academicConfig.institutionName}</h4>
                         <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Akademik Yayın Kurulu</p>
                       </div>
                     </div>
                  </div>
                )}

                <div className="p-16 flex-1 overflow-y-auto custom-scrollbar relative z-10 flex flex-col justify-center">
                   <h2 className={`text-6xl font-black ${theme.text} uppercase tracking-tighter border-l-[16px] border-orange-600 pl-12 leading-[0.9] mb-12`}>{activeSlide.title}</h2>
                   <div className="space-y-4">
                      {Array.isArray(activeSlide.elements) && activeSlide.elements.map((el, i) => renderMultimodalElement(el))}
                      {(!Array.isArray(activeSlide.elements) || activeSlide.elements.length === 0) && Array.isArray(activeSlide.content) && activeSlide.content.map((c, i) => (
                         <div key={i} className="flex gap-4 items-start p-6 bg-white/5 rounded-[2rem] border border-white/5">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 shadow-[0_0_10px_#ea580c] shrink-0"></div>
                            <p className="text-2xl font-bold text-slate-300 leading-tight italic">"{c}"</p>
                         </div>
                      ))}
                   </div>
                </div>

                <div className={`p-8 ${theme.bg} border-t ${theme.border} flex justify-between items-center shrink-0`}>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{aiConfig?.pedagogicalBias?.toUpperCase() || 'KLİNİK AKADEMİ'}</span>
                   <span className={`px-6 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase`}>{activeSlideIdx + 1} / {slides.length}</span>
                </div>
             </div>

             <div className="w-full max-w-[1200px] mt-8 bg-slate-900/80 p-8 rounded-[3rem] border border-white/5 flex gap-12">
                <div className="w-48 shrink-0">
                   <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">KLİNİK DİREKTİF</span>
                   <div className="h-1 w-full bg-orange-600 rounded-full"></div>
                </div>
                <p className="text-slate-300 font-medium text-lg leading-relaxed italic opacity-80 border-l border-white/10 pl-10">
                   {activeSlide.speakerNotes || 'Akademik mühür doğrulanmıştır.'}
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
