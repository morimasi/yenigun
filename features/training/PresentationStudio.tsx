
import React, { useState, useRef, useEffect } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement, Branch, TrainingQuiz } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis } from 'recharts';
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

  // DEFENSIVE DATA ACCESS
  const slides = Array.isArray(customPlan?.slides) ? customPlan.slides : [];
  const activeSlide = slides[activeSlideIdx];
  const aiConfig = customPlan?.aiConfig;

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
    if (!slideRef.current || slides.length === 0) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        setActiveSlideIdx(i);
        await new Promise(r => setTimeout(r, 600)); // Render stability
        const canvas = await html2canvas(slideRef.current, { scale: 1.5, useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      }
      pdf.save(`YG_AKADEMI_${(customPlan?.title || 'EGITIM').replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } finally { setIsExporting(false); }
  };

  const renderMultimodalElement = (el: MultimodalElement) => {
    if (!el || !el.content) return null;

    switch (el.type) {
      case 'symbol':
        return (
          <div className={`flex items-center gap-8 p-10 rounded-[3.5rem] border ${theme.border} mb-6 bg-white/5 backdrop-blur-sm`}>
            <div className="text-7xl drop-shadow-2xl">{el.content.icon || '🧩'}</div>
            <div>
              <h5 className={`${theme.text} font-black text-3xl uppercase tracking-tighter`}>{el.content.label || 'Klinik Sembol'}</h5>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em] mt-2">MIA Pedagojik Protokolü</p>
            </div>
          </div>
        );
      case 'graph_logic':
        const rawPoints = Array.isArray(el.content.dataPoints) ? el.content.dataPoints : [40, 70, 55, 90, 60];
        const chartData = rawPoints.map((v: number, i: number) => ({ n: i, v }));
        return (
          <div className={`p-10 rounded-[4rem] border ${theme.border} mb-6 h-80 bg-white/5`}>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">{el.content.label || 'Klinik Veri Trendi'}</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="v" radius={[12, 12, 0, 0]}>
                    {chartData.map((_: any, i: number) => <Cell key={i} fill={i % 2 === 0 ? '#ea580c' : '#D4AF37'} /> )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'interactive_case':
        return (
          <div className={`${theme.accent} p-16 rounded-[5rem] text-white shadow-3xl relative overflow-hidden mb-6 group`}>
             <div className="relative z-10">
                <h5 className="text-[11px] font-black opacity-60 uppercase tracking-[0.6em] mb-6">KLİNİK VAKA ANALİZİ</h5>
                <p className="text-3xl font-black italic tracking-tighter leading-tight uppercase">"{el.content.text || el.content.question || 'Vaka sorusu yüklenemedi.'}"</p>
             </div>
             <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          </div>
        );
      default:
        return <p className={`text-2xl font-bold ${theme.text} leading-relaxed mb-8 italic border-l-[12px] border-orange-600 pl-10 opacity-90`}>"{el.content.text || 'İçerik Bulunamadı'}"</p>;
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

  if (view === 'quiz' && customPlan?.finalQuiz) {
      const questions = Array.isArray(customPlan.finalQuiz.questions) ? customPlan.finalQuiz.questions : [];
      return (
          <div className="fixed inset-0 z-[4500] bg-slate-50 flex items-center justify-center p-8 overflow-y-auto">
              <div className="max-w-3xl w-full bg-white rounded-[4rem] shadow-2xl p-16 space-y-12">
                  <div className="text-center">
                      <span className="px-4 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">DEĞERLENDİRME</span>
                      <h3 className="text-4xl font-black text-slate-900 uppercase mt-4">Öğrenme Doğrulaması</h3>
                  </div>
                  <div className="space-y-12">
                      {questions.map((q, idx) => (
                          <div key={q.id || idx} className="space-y-6">
                              <p className="text-xl font-black text-slate-800 uppercase leading-snug">{idx + 1}. {q.text}</p>
                              <div className="grid grid-cols-1 gap-3">
                                  {Array.isArray(q.options) && q.options.map((opt, oIdx) => (
                                      <button key={oIdx} onClick={() => setQuizAnswers({...quizAnswers, [q.id]: oIdx})} className={`p-6 rounded-3xl border-2 text-left transition-all font-bold ${quizAnswers[q.id] === oIdx ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-600 hover:border-orange-500'}`}>{opt.label}</button>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
                  <button onClick={() => setView('completed')} className="w-full py-8 bg-orange-600 text-white rounded-[2.5rem] font-black uppercase shadow-3xl hover:bg-slate-900 transition-all">DEĞERLENDİRMEYİ MÜHÜRLE</button>
              </div>
          </div>
      );
  }

  if (!activeSlide) return <div className="fixed inset-0 bg-slate-950 flex items-center justify-center text-white">Slayt verisi ayrıştırılamadı.</div>;

  return (
    <div className={`fixed inset-0 z-[4000] ${theme.bg} flex flex-col overflow-hidden animate-fade-in no-print`}>
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       <div className="h-20 bg-slate-900 border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-50">
          <div className="flex items-center gap-8">
             <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-rose-600 rounded-2xl text-white transition-all flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="h-8 w-px bg-white/10"></div>
             <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter truncate max-w-xl">{customPlan?.title || 'İçerik'}</h3>
                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-2">MIA Engine • {aiConfig?.cognitiveLoad || 'Başlangıç'}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-white/5 p-1 rounded-xl mr-6">
                <button onClick={handleDownloadPDF} disabled={isExporting} className="px-6 py-2.5 text-[9px] font-black text-white uppercase hover:bg-white/10 rounded-lg transition-all">PDF</button>
                <button onClick={() => setShowAssignmentModal(true)} className="px-6 py-2.5 text-[9px] font-black text-orange-500 uppercase hover:bg-white/10 rounded-lg transition-all">ATAMA</button>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all text-xl font-black">←</button>
                <button onClick={() => activeSlideIdx < slides.length - 1 ? setActiveSlideIdx(p => p + 1) : aiConfig?.hasEvaluation ? setView('quiz') : setView('completed')} className={`px-12 h-14 rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.2em] shadow-3xl transition-all ${activeSlideIdx === slides.length - 1 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 hover:bg-orange-600 hover:text-white'}`}>
                   {activeSlideIdx === slides.length - 1 ? (aiConfig?.hasEvaluation ? 'SINAV' : 'MÜHÜRLE') : 'İLERLE →'}
                </button>
             </div>
          </div>
       </div>

       <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden bg-black/10">
          <div ref={slideRef} className={`w-full max-w-[1400px] ${theme.bg} rounded-[4.5rem] aspect-video shadow-[0_80px_200px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative animate-scale-in border ${theme.border}`}>
             
             {aiConfig?.academicConfig?.headerAntet && (
               <div className={`h-24 border-b ${theme.border} flex items-center justify-between px-20 shrink-0 relative z-20`}>
                  <div className="flex items-center gap-6">
                    <div className={`${theme.accent} w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-2xl`}>YG</div>
                    <div className="h-10 w-px bg-slate-700/30"></div>
                    <div>
                      <h4 className={`text-sm ${theme.title} uppercase tracking-widest ${theme.text}`}>{aiConfig.academicConfig.institutionName}</h4>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-0.5">Klinik Araştırma Birimi</p>
                    </div>
                  </div>
               </div>
             )}

             {aiConfig?.academicConfig?.showWatermark && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] rotate-[-25deg] select-none">
                 <p className="text-[12rem] font-black uppercase whitespace-nowrap">{aiConfig.academicConfig.institutionName.split(' ')[0]}</p>
               </div>
             )}

             <div className="p-20 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <h2 className={`text-6xl ${theme.title} ${theme.text} uppercase tracking-tighter border-l-[16px] border-orange-600 pl-12 leading-[0.9] mb-16 max-w-5xl`}>{activeSlide.title}</h2>
                <div className="grid grid-cols-1 gap-6">
                   {Array.isArray(activeSlide.elements) && activeSlide.elements.map((el, i) => <div key={i}>{renderMultimodalElement(el)}</div>)}
                   {(!activeSlide.elements || activeSlide.elements.length === 0) && Array.isArray(activeSlide.content) && activeSlide.content.map((c, i) => (
                      <div key={i} className="flex gap-6 items-start p-6 bg-white/5 rounded-[2.5rem] border border-white/5">
                         <div className="w-3 h-3 bg-orange-600 rounded-full mt-2 shadow-[0_0_10px_#ea580c] shrink-0"></div>
                         <p className="text-2xl font-bold text-slate-300 leading-tight italic">"{c}"</p>
                      </div>
                   ))}
                </div>
             </div>

             {activeSlideIdx === slides.length - 1 && aiConfig?.academicConfig?.signatureTitles && (
               <div className="absolute bottom-12 left-0 w-full px-20 grid grid-cols-3 gap-8 z-20">
                  {Array.isArray(aiConfig.academicConfig.signatureTitles) && aiConfig.academicConfig.signatureTitles.map(title => (
                    <div key={title} className="text-center group">
                       <div className={`h-12 border-b ${theme.border} mb-3 relative overflow-hidden`}></div>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>{title}</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Islak İmza</p>
                    </div>
                  ))}
               </div>
             )}

             <div className={`p-8 ${theme.bg} border-t ${theme.border} flex justify-between items-center shrink-0 relative z-20`}>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">{aiConfig?.pedagogicalBias || 'PEDAGOJIK PROTOKOL'}</span>
                <div className="flex items-center gap-4">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">REF: {customPlan?.id?.substring(0,8)}</span>
                   <span className={`px-6 py-2 ${theme.accent} text-white rounded-xl text-[10px] font-black uppercase`}>{activeSlideIdx + 1} / {slides.length}</span>
                </div>
             </div>
          </div>
       </div>

       <div className="h-40 bg-[#0F172A] border-t border-white/5 px-16 py-8 overflow-y-auto custom-scrollbar shrink-0 no-print flex gap-16">
          <div className="w-56 shrink-0">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-4">KLİNİK DİREKTİF</span>
             <div className="h-1.5 w-full bg-orange-600 rounded-full"></div>
             <p className="text-[9px] font-bold text-slate-500 uppercase mt-4 tracking-widest">Reasoning Active</p>
          </div>
          <p className="text-slate-300 font-medium text-xl leading-relaxed italic max-w-5xl opacity-80 border-l border-white/10 pl-12">
             {activeSlide.speakerNotes || 'Süpervizör notu mühürlenmemiştir.'}
          </p>
       </div>
    </div>
  );
};

export default PresentationStudio;
