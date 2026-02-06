
import React, { useState, useRef, useEffect } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement, Branch, TrainingQuiz } from '../../types';
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
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const slideRef = useRef<HTMLDivElement>(null);

  const slides = customPlan.slides || [];
  const activeSlide = slides[activeSlideIdx];
  const aiConfig = customPlan.aiConfig;

  // TEMA MOTORU
  const getThemeStyles = () => {
    switch(aiConfig?.theme) {
      case 'ACADEMIC_COLD': return { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-slate-900', border: 'border-slate-200', title: 'font-black' };
      case 'GOLDEN_ACADEMY': return { bg: 'bg-[#0F1419]', text: 'text-white', accent: 'bg-[#D4AF37]', border: 'border-white/10', title: 'font-black tracking-tighter' };
      case 'CREATIVE_WARM': return { bg: 'bg-orange-50', text: 'text-orange-950', accent: 'bg-orange-600', border: 'border-orange-200', title: 'font-extrabold italic' };
      case 'MINIMAL_TECH': return { bg: 'bg-slate-950', text: 'text-white', accent: 'bg-blue-600', border: 'border-white/10', title: 'font-light' };
      case 'OFFICIAL_MEB': return { bg: 'bg-white', text: 'text-rose-950', accent: 'bg-rose-700', border: 'border-rose-100', title: 'font-bold uppercase' };
      default: return { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-orange-600', border: 'border-slate-200', title: 'font-black' };
    }
  };

  const theme = getThemeStyles();

  const handleDownloadPDF = async () => {
    if (!slideRef.current) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        setActiveSlideIdx(i);
        await new Promise(r => setTimeout(r, 450));
        const canvas = await html2canvas(slideRef.current, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      }
      pdf.save(`YG_AKADEMI_${customPlan.title.replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } finally { setIsExporting(false); }
  };

  const handleFinishQuiz = () => {
     setView('completed');
     // Veritabanı güncellemesi buraya tetiklenebilir
  };

  const renderMultimodalElement = (el: MultimodalElement) => {
    switch (el.type) {
      case 'symbol':
        return (
          <div className={`flex items-center gap-8 p-10 rounded-[3.5rem] border ${theme.border} mb-6 bg-white/5 backdrop-blur-sm`}>
            <div className="text-7xl drop-shadow-2xl">{el.content.icon || '🧩'}</div>
            <div>
              <h5 className={`${theme.text} font-black text-3xl uppercase tracking-tighter`}>{el.content.label}</h5>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em] mt-2">MIA Pedagojik Protokolü</p>
            </div>
          </div>
        );
      case 'graph_logic':
        return (
          <div className={`p-10 rounded-[4rem] border ${theme.border} mb-6 h-80 bg-white/5`}>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">{el.content.label || 'Klinik Veri Trendi'}</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(el.content.dataPoints || [40, 70, 55, 90, 60]).map((v: number, i: number) => ({ n: i, v }))}>
                <Bar dataKey="v" radius={[12, 12, 0, 0]} fill="#ea580c">
                    { (el.content.dataPoints || []).map((_:any, i:number) => <Cell key={i} fill={i % 2 === 0 ? '#ea580c' : theme.accent.replace('bg-', '')} /> ) }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'interactive_case':
        return (
          <div className={`${theme.accent} p-16 rounded-[5rem] text-white shadow-3xl relative overflow-hidden mb-6 group`}>
             <div className="relative z-10">
                <h5 className="text-[11px] font-black opacity-60 uppercase tracking-[0.6em] mb-6">KLİNİK VAKA ANALİZİ (DEEP THINKING)</h5>
                <p className="text-3xl font-black italic tracking-tighter leading-tight uppercase group-hover:scale-[1.02] transition-transform duration-500">"{el.content.text || el.content.question}"</p>
             </div>
             <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          </div>
        );
      default:
        return <p className={`text-2xl font-bold ${theme.text} leading-relaxed mb-8 italic border-l-[12px] border-orange-600 pl-10 opacity-90`}>"{el.content.text || JSON.stringify(el.content)}"</p>;
    }
  };

  if (view === 'completed') {
    return (
      <div className="fixed inset-0 z-[5000] bg-[#0A0F1C] flex items-center justify-center p-12 animate-fade-in">
        <div className="max-w-xl w-full bg-white rounded-[5rem] p-20 text-center space-y-12 shadow-3xl animate-scale-in">
          <div className="w-32 h-32 bg-emerald-500 text-white rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl scale-in ring-8 ring-emerald-500/20">
             <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
             <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Eğitim Mühürlendi</h2>
             <p className="text-slate-400 font-bold uppercase text-[12px] mt-6 tracking-widest">Akademik gelişim dosyası sisteme işlenmiştir.</p>
          </div>
          <button onClick={onClose} className="w-full py-8 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all">AKADEMİ HUB'A DÖN</button>
        </div>
      </div>
    );
  }

  if (view === 'quiz' && customPlan.finalQuiz) {
      return (
          <div className="fixed inset-0 z-[4500] bg-slate-50 flex items-center justify-center p-8 overflow-y-auto">
              <div className="max-w-3xl w-full bg-white rounded-[4rem] shadow-2xl p-16 space-y-12">
                  <div className="text-center">
                      <span className="px-4 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">DEĞERLENDİRME</span>
                      <h3 className="text-4xl font-black text-slate-900 uppercase mt-4">Öğrenme Doğrulaması</h3>
                  </div>
                  <div className="space-y-12">
                      {customPlan.finalQuiz.questions.map((q, idx) => (
                          <div key={q.id} className="space-y-6">
                              <p className="text-xl font-black text-slate-800 uppercase leading-snug">{idx + 1}. {q.text}</p>
                              <div className="grid grid-cols-1 gap-3">
                                  {q.options.map((opt, oIdx) => (
                                      <button key={oIdx} onClick={() => setQuizAnswers({...quizAnswers, [q.id]: oIdx})} className={`p-6 rounded-3xl border-2 text-left transition-all font-bold ${quizAnswers[q.id] === oIdx ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-600 hover:border-orange-500'}`}>{opt.label}</button>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
                  <button onClick={handleFinishQuiz} className="w-full py-8 bg-orange-600 text-white rounded-[2.5rem] font-black uppercase shadow-3xl hover:bg-slate-900 transition-all">DEĞERLENDİRMEYİ MÜHÜRLE</button>
              </div>
          </div>
      );
  }

  return (
    <div className={`fixed inset-0 z-[4000] ${theme.bg} flex flex-col overflow-hidden animate-fade-in no-print`}>
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       {/* COMMAND CONTROL BAR */}
       <div className="h-20 bg-slate-900 border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-50">
          <div className="flex items-center gap-8">
             <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-rose-600 rounded-2xl text-white transition-all flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="h-8 w-px bg-white/10"></div>
             <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter truncate max-w-xl">{customPlan.title}</h3>
                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-2">MIA Engine • Kognitif Yük: {aiConfig?.cognitiveLoad.split(' ')[0]}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-white/5 p-1 rounded-xl mr-6">
                <button onClick={handleDownloadPDF} disabled={isExporting} className="px-6 py-2.5 text-[9px] font-black text-white uppercase hover:bg-white/10 rounded-lg transition-all">PDF</button>
                <button onClick={() => setShowAssignmentModal(true)} className="px-6 py-2.5 text-[9px] font-black text-orange-500 uppercase hover:bg-white/10 rounded-lg transition-all">ÖĞRETMENE ATA</button>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all text-xl font-black">←</button>
                <button onClick={() => activeSlideIdx < slides.length - 1 ? setActiveSlideIdx(p => p + 1) : aiConfig?.hasEvaluation ? setView('quiz') : setView('completed')} className={`px-12 h-14 rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.2em] shadow-3xl transition-all ${activeSlideIdx === slides.length - 1 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 hover:bg-orange-600 hover:text-white'}`}>
                   {activeSlideIdx === slides.length - 1 ? (aiConfig?.hasEvaluation ? 'SINAVA GEÇ' : 'MÜHÜRLE') : 'İLERLE →'}
                </button>
             </div>
          </div>
       </div>

       {/* STAGE & RENDER AREA */}
       <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden bg-black/10">
          <div ref={slideRef} className={`w-full max-w-[1400px] ${theme.bg} rounded-[4.5rem] aspect-video shadow-[0_80px_200px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative animate-scale-in border ${theme.border}`}>
             
             {/* OFFICIAL ACADEMIC HEADER (ANTET) */}
             {aiConfig?.academicConfig.headerAntet && (
               <div className={`h-28 border-b ${theme.border} flex items-center justify-between px-20 shrink-0 relative z-20`}>
                  <div className="flex items-center gap-8">
                    <div className={`${theme.accent} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-2xl`}>YG</div>
                    <div className="h-12 w-px bg-slate-700/30"></div>
                    <div>
                      <h4 className={`text-lg ${theme.title} uppercase tracking-widest ${theme.text}`}>{aiConfig.academicConfig.institutionName}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">Akademik Kurul & Klinik Araştırma Birimi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">RESMİ AKADEMİK BELGE</span>
                  </div>
               </div>
             )}

             {/* WATERMARK PROTOCOL */}
             {aiConfig?.academicConfig.showWatermark && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-25deg] select-none">
                 <p className="text-[18rem] font-black uppercase whitespace-nowrap">{aiConfig.academicConfig.institutionName.split(' ')[0]}</p>
               </div>
             )}

             <div className="p-20 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <h2 className={`text-7xl ${theme.title} ${theme.text} uppercase tracking-tighter border-l-[20px] border-orange-600 pl-16 leading-[0.9] mb-20 max-w-5xl`}>{activeSlide?.title}</h2>
                <div className="grid grid-cols-1 gap-8">
                   {activeSlide?.elements?.map((el, i) => <div key={i}>{renderMultimodalElement(el)}</div>)}
                   {!activeSlide?.elements && activeSlide?.content?.map((c, i) => (
                      <div key={i} className="flex gap-8 items-start p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                         <div className="w-4 h-4 bg-orange-600 rounded-full mt-3.5 shadow-[0_0_15px_#ea580c] shrink-0"></div>
                         <p className="text-3xl font-bold text-slate-300 leading-tight italic opacity-90">"{c}"</p>
                      </div>
                   ))}
                </div>
             </div>

             {/* SIGNATURE SECTION (FINAL PAGE) */}
             {activeSlideIdx === slides.length - 1 && (
               <div className="absolute bottom-16 left-0 w-full px-20 grid grid-cols-3 gap-12 z-20">
                  {aiConfig?.academicConfig.signatureTitles.map(title => (
                    <div key={title} className="text-center group">
                       <div className={`h-16 border-b-2 ${theme.border} mb-4 relative overflow-hidden`}>
                           {aiConfig.academicConfig.officialSeal && <div className="absolute right-0 bottom-0 w-12 h-12 bg-rose-600/10 rounded-full blur-xl animate-pulse"></div>}
                       </div>
                       <p className={`text-[11px] font-black uppercase tracking-widest ${theme.text}`}>{title}</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 tracking-widest">Islak İmza & Mühür</p>
                    </div>
                  ))}
                  {aiConfig?.academicConfig.officialSeal && (
                     <div className="flex flex-col items-center justify-end">
                        <div className="w-20 h-20 border-4 border-orange-600/30 rounded-full flex items-center justify-center opacity-40 grayscale group-hover:grayscale-0 transition-all rotate-12">
                           <span className="text-[10px] font-black text-orange-600 uppercase">ONAYLANDI</span>
                        </div>
                     </div>
                  )}
               </div>
             )}

             <div className={`p-12 ${theme.bg} border-t ${theme.border} flex justify-between items-center shrink-0 relative z-20 bg-opacity-90`}>
                <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.8em]">{aiConfig?.pedagogicalBias.toUpperCase()} PROTOKOLÜ</span>
                <div className="flex items-center gap-6">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BELGE REF: {customPlan.id.substring(0,8)}</span>
                   <span className={`px-8 py-3 ${theme.accent} text-white rounded-2xl text-[12px] font-black uppercase shadow-2xl`}>{activeSlideIdx + 1} / {slides.length}</span>
                </div>
          </div>
          </div>
       </div>

       {/* SPEAKER HUD (NO-PRINT) */}
       <div className="h-44 bg-[#0F172A] border-t border-white/5 px-20 py-10 overflow-y-auto custom-scrollbar shrink-0 no-print flex gap-20 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
          <div className="w-64 shrink-0">
             <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em] block mb-5">KLİNİK DİREKTİF</span>
             <div className="h-2 w-full bg-orange-600 rounded-full shadow-[0_0_15px_#ea580c]"></div>
             <p className="text-[10px] font-bold text-slate-500 uppercase mt-6 tracking-widest">Gemini-3 Pro Reasoning</p>
          </div>
          <p className="text-slate-200 font-medium text-2xl leading-relaxed italic max-w-6xl opacity-80 border-l border-white/10 pl-16">
             {activeSlide?.speakerNotes || 'Bu etap için özel klinik direktif mühürlenmemiştir.'}
          </p>
       </div>
    </div>
  );
};

export default PresentationStudio;
