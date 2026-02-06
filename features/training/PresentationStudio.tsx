
import React, { useState, useRef } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement, Branch } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
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
  const [view, setView] = useState<'presentation' | 'completed'>('presentation');
  const slideRef = useRef<HTMLDivElement>(null);

  const slides = customPlan.slides || [];
  const activeSlide = slides[activeSlideIdx];
  const aiConfig = customPlan.aiConfig;

  // TEMA MAPPING
  const getThemeStyles = () => {
    switch(aiConfig?.theme) {
      case 'ACADEMIC_COLD': return { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-slate-900', border: 'border-slate-200' };
      case 'CREATIVE_WARM': return { bg: 'bg-orange-50', text: 'text-orange-950', accent: 'bg-orange-600', border: 'border-orange-200' };
      case 'MINIMAL_TECH': return { bg: 'bg-slate-950', text: 'text-white', accent: 'bg-blue-600', border: 'border-white/10' };
      case 'OFFICIAL_MEB': return { bg: 'bg-white', text: 'text-rose-950', accent: 'bg-rose-700', border: 'border-rose-100' };
      default: return { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-orange-600', border: 'border-slate-200' };
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
        await new Promise(r => setTimeout(r, 400));
        const canvas = await html2canvas(slideRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      }
      pdf.save(`YG_AKADEMI_${customPlan.title.replace(/\s+/g, '_')}.pdf`);
    } finally { setIsExporting(false); }
  };

  const renderMultimodalElement = (el: MultimodalElement) => {
    switch (el.type) {
      case 'symbol':
        return (
          <div className={`flex items-center gap-6 p-8 rounded-[3rem] border ${theme.border} mb-6`}>
            <div className="text-6xl">{el.content.icon || '🧩'}</div>
            <div>
              <h5 className={`${theme.text} font-black text-2xl uppercase tracking-tighter`}>{el.content.label}</h5>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Ekoloji: {aiConfig?.pedagogicalBias}</p>
            </div>
          </div>
        );
      case 'graph_logic':
        return (
          <div className={`${theme.bg} p-8 rounded-[3rem] border ${theme.border} mb-6 h-64`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{el.content.label || 'Veri Trendi'}</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(el.content.dataPoints || [40, 70, 55, 90]).map((v: number, i: number) => ({ n: i, v }))}>
                <Bar dataKey="v" radius={[8, 8, 0, 0]} fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'interactive_case':
        return (
          <div className={`${theme.accent} p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden mb-6`}>
             <h5 className="text-[10px] font-black opacity-60 uppercase tracking-[0.4em] mb-4">Vaka Tartışması (Deep Thinking)</h5>
             <p className="text-2xl font-black italic tracking-tighter">"{el.content.text || el.content.question}"</p>
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        );
      default:
        return <p className={`text-xl font-medium ${theme.text} leading-relaxed mb-6 italic border-l-4 border-orange-50 pl-6 opacity-80`}>"{el.content.text || JSON.stringify(el.content)}"</p>;
    }
  };

  if (view === 'completed') {
    return (
      <div className="fixed inset-0 z-[5000] bg-slate-950 flex items-center justify-center p-10 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-[4rem] p-16 text-center space-y-10 shadow-3xl">
          <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl scale-in">✓</div>
          <div><h2 className="text-4xl font-black text-slate-900 uppercase">Eğitim Mühürlendi</h2></div>
          <button onClick={onClose} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase">Hub'a Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[4000] ${theme.bg} flex flex-col overflow-hidden animate-fade-in no-print`}>
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       {/* CONTROL BAR */}
       <div className="h-20 bg-slate-950 border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-50">
          <div className="flex items-center gap-8">
             <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-rose-600 rounded-2xl text-white transition-all flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter truncate max-w-xl">{customPlan.title}</h3>
                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-2">MIA Multimodal Engine • Seviye: {aiConfig?.cognitiveLoad}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleDownloadPDF} disabled={isExporting} className="px-8 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">PDF İndir</button>
             <button onClick={() => setShowAssignmentModal(true)} className="px-8 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-white hover:text-slate-900 transition-all">Personele Ata</button>
             <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white">←</button>
             <button onClick={() => activeSlideIdx < slides.length - 1 ? setActiveSlideIdx(p => p + 1) : setView('completed')} className="px-10 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center font-black uppercase tracking-widest">{activeSlideIdx === slides.length - 1 ? 'Mühürle' : 'İlerle →'}</button>
          </div>
       </div>

       {/* THE STAGE */}
       <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden bg-black/5">
          <div ref={slideRef} className={`w-full max-w-[1400px] ${theme.bg} rounded-[4rem] aspect-video shadow-3xl overflow-hidden flex flex-col relative animate-scale-in border ${theme.border}`}>
             
             {/* ACADEMIC HEADER (ANTET) */}
             {aiConfig?.academicConfig.headerAntet && (
               <div className={`h-24 border-b ${theme.border} flex items-center justify-between px-20 shrink-0`}>
                  <div className="flex items-center gap-6">
                    <div className={`${theme.accent} w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm`}>YG</div>
                    <div className="h-10 w-px bg-slate-200"></div>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-widest ${theme.text}`}>{aiConfig.academicConfig.institutionName}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Akademik Kurul Eğitim Materyali</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">RESMİ MÜHÜR</span>
                  </div>
               </div>
             )}

             {/* WATERMARK */}
             {aiConfig?.academicConfig.showWatermark && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-25deg]">
                 <p className="text-[15rem] font-black uppercase whitespace-nowrap">{aiConfig.academicConfig.institutionName.split(' ')[0]}</p>
               </div>
             )}

             <div className="p-20 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <h2 className={`text-6xl font-black ${theme.text} uppercase tracking-tighter border-l-[16px] border-orange-600 pl-12 leading-none mb-16 max-w-5xl`}>{activeSlide?.title}</h2>
                <div className="grid grid-cols-1 gap-6">
                   {activeSlide?.elements?.map((el, i) => <div key={i}>{renderMultimodalElement(el)}</div>)}
                </div>
             </div>

             {/* SIGNATURE SECTION (LAST SLIDE ONLY) */}
             {activeSlideIdx === slides.length - 1 && (
               <div className="absolute bottom-10 left-0 w-full px-20 grid grid-cols-3 gap-10">
                  {aiConfig?.academicConfig.signatureTitles.map(title => (
                    <div key={title} className="text-center">
                       <div className={`h-12 border-b-2 ${theme.border} mb-3`}></div>
                       <p className={`text-[10px] font-black uppercase ${theme.text}`}>{title}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">İmza & Onay</p>
                    </div>
                  ))}
               </div>
             )}

             <div className={`p-10 ${theme.bg} border-t ${theme.border} flex justify-between items-center shrink-0 relative z-20`}>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">{aiConfig?.pedagogicalBias} PRO PROTOCOL</span>
                <span className={`px-6 py-2 ${theme.accent} text-white rounded-xl text-[11px] font-black uppercase shadow-xl`}>{activeSlideIdx + 1} / {slides.length}</span>
             </div>
          </div>
       </div>

       {/* SPEAKER NOTES */}
       <div className="h-44 bg-slate-900 border-t border-white/5 px-20 py-10 overflow-y-auto custom-scrollbar shrink-0 no-print flex gap-20">
          <div className="w-64 shrink-0">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-4">KLİNİK DİREKTİF</span>
             <div className="h-1.5 w-full bg-orange-600 rounded-full"></div>
             <p className="text-[10px] font-bold text-slate-500 uppercase mt-4">Gemini-3 Pro Muhakemesi</p>
          </div>
          <p className="text-slate-300 font-medium text-xl leading-relaxed italic max-w-6xl">
             {activeSlide?.speakerNotes || 'Bu slayt için özel direktif bulunmamaktadır.'}
          </p>
       </div>
    </div>
  );
};

export default PresentationStudio;
