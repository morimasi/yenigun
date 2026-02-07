
import React, { useState, useRef } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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

  const handleDownloadPDF = async () => {
    if (!slideRef.current || slides.length === 0) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        setActiveSlideIdx(i);
        await new Promise(r => setTimeout(r, 600)); 
        const canvas = await html2canvas(slideRef.current, { scale: 2, useCORS: true, logging: false });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      }
      pdf.save(`YG_AKADEMI_${(customPlan?.title || 'EGITIM').replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } finally { setIsExporting(false); }
  };

  const renderMultimodalElement = (el: MultimodalElement) => {
    if (!el || !el.content) return null;
    switch (el.type) {
      case 'symbol':
        return (
          <div key={el.id} className={`flex items-center gap-6 p-8 rounded-[3rem] border ${theme.border} bg-white/5 shadow-inner`}>
            <div className="text-7xl drop-shadow-xl">{el.content.icon || '🧠'}</div>
            <div className="space-y-1">
              <h5 className={`${theme.text} font-black text-2xl uppercase tracking-tighter`}>{el.content.label}</h5>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">AKADEMİK REFERANS NOKTASI</p>
            </div>
          </div>
        );
      case 'graph_logic':
        const chartData = (el.content.dataPoints || [50, 80, 40, 90, 60]).map((v: number, i: number) => ({ n: `Param ${i+1}`, v }));
        return (
          <div key={el.id} className={`p-8 rounded-[4rem] border ${theme.border} h-[320px] bg-black/20 shadow-2xl overflow-hidden`}>
            <div className="mb-4 flex justify-between items-center">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{el.content.title || 'KLİNİK VERİ PROJEKSİYONU'}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Bar dataKey="v" radius={[12, 12, 0, 0]} fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'interactive_case':
        return (
          <div key={el.id} className="p-10 bg-orange-600 rounded-[4rem] shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest block mb-4">VAKA ÇALIŞMASI / ANALİZ</span>
                <p className="text-2xl font-black text-white leading-tight italic">"{el.content.scenario}"</p>
                <div className="mt-8 pt-6 border-t border-white/20">
                   <p className="text-sm font-bold text-orange-100 uppercase tracking-widest">Çözüm Parametresi: {el.content.resolution}</p>
                </div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        );
      default:
        return null;
    }
  };

  if (slides.length === 0 || !activeSlide) {
    return (
      <div className="fixed inset-0 bg-[#0A0F1C] flex flex-col items-center justify-center p-12 text-center">
         <div className="w-24 h-24 border-8 border-white/5 border-t-orange-600 rounded-full animate-spin mb-8"></div>
         <h3 className="text-white font-black text-2xl uppercase tracking-[0.4em]">Nöral Veri Paketleniyor</h3>
         <p className="text-slate-500 font-bold uppercase tracking-widest mt-4">Akademik içerik sentezleniyor, lütfen bekleyiniz...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[4000] bg-[#0A0F1C] flex flex-col overflow-hidden animate-fade-in no-print">
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       {/* HEADER BAR */}
       <div className="h-20 bg-slate-900 border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-50 shadow-2xl">
          <div className="flex items-center gap-8">
             <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-rose-600 rounded-2xl text-white transition-all flex items-center justify-center shadow-lg group">
                <svg className="w-6 h-6 group-hover:scale-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="h-8 w-px bg-white/10"></div>
             <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter truncate max-w-xl leading-none">{customPlan?.title}</h3>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-2">AKADEMİK YAYIN KURULU • SÜRÜM 4.5</p>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                <button onClick={handleDownloadPDF} disabled={isExporting} className="px-6 py-2.5 text-[10px] font-black text-slate-300 uppercase hover:bg-white/10 rounded-xl transition-all flex items-center gap-3">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                   {isExporting ? 'İŞLENİYOR' : 'PDF ARŞİVLE'}
                </button>
                <button onClick={() => setShowAssignmentModal(true)} className="px-6 py-2.5 text-[10px] font-black text-orange-500 hover:bg-white/10 rounded-xl transition-all flex items-center gap-3">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                   PERSONELE ATA
                </button>
             </div>
             <div className="flex gap-2 ml-4">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all font-black text-xl">←</button>
                <button 
                    onClick={() => setActiveSlideIdx(p => Math.min(slides.length - 1, p + 1))} 
                    className={`px-12 h-14 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest shadow-2xl transition-all ${activeSlideIdx === slides.length - 1 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 hover:bg-orange-600 hover:text-white'}`}
                >
                   {activeSlideIdx === slides.length - 1 ? 'TAMAMLA' : 'İLERİ →'}
                </button>
             </div>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          {/* SLIDE NAVIGATOR (SIDEBAR) */}
          <div className="w-72 bg-slate-950 border-r border-white/5 flex flex-col shrink-0 no-print shadow-2xl">
             <div className="p-8 border-b border-white/5 bg-slate-900/50">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">SLAYT ENDEKSİ</h4>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {slides.map((s, idx) => (
                   <button 
                     key={s.id || idx} 
                     onClick={() => setActiveSlideIdx(idx)}
                     className={`w-full p-5 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${activeSlideIdx === idx ? 'bg-orange-600 border-orange-600 text-white shadow-[0_10px_30px_rgba(234,88,12,0.4)] scale-[1.02]' : 'bg-white/5 border-transparent text-slate-500 hover:border-white/10 hover:bg-white/5'}`}
                   >
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black uppercase opacity-60">SAYFA {idx + 1}</span>
                         {activeSlideIdx === idx && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
                      </div>
                      <p className="text-[11px] font-bold truncate uppercase tracking-tight">{s.title}</p>
                   </button>
                ))}
             </div>
          </div>

          {/* MAIN RENDER STAGE */}
          <div className="flex-1 relative flex flex-col items-center justify-start p-10 bg-black/40 overflow-y-auto custom-scrollbar">
             {/* PROGRESS LINE */}
             <div className="w-full max-w-[1200px] h-2 bg-white/5 rounded-full overflow-hidden mb-10 shrink-0">
                <div className="h-full bg-orange-600 transition-all duration-700 ease-out shadow-[0_0_20px_#ea580c]" style={{ width: `${((activeSlideIdx + 1) / slides.length) * 100}%` }}></div>
             </div>

             <div ref={slideRef} className={`w-full max-w-[1200px] ${theme.bg} rounded-[5rem] aspect-video shadow-[0_60px_150px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative animate-scale-in border ${theme.border} shrink-0`}>
                {/* ACADEMIC ANTET */}
                <div className={`h-28 border-b ${theme.border} flex items-center justify-between px-20 shrink-0 relative z-20 bg-black/5`}>
                   <div className="flex items-center gap-8">
                     <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">YG</div>
                     <div>
                       <h4 className={`text-lg font-black uppercase tracking-[0.2em] ${theme.text}`}>{aiConfig?.academicConfig?.institutionName || 'YENİ GÜN AKADEMİ'}</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">RESMİ HİZMET İÇİ EĞİTİM MODÜLÜ</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <span className={`px-5 py-2 ${theme.accent} text-white rounded-xl text-[10px] font-black uppercase tracking-widest`}>SLAYT {activeSlideIdx + 1} / {slides.length}</span>
                   </div>
                </div>

                <div className="p-20 flex-1 overflow-y-auto custom-scrollbar relative z-10 flex flex-col justify-center">
                   <h2 className={`text-6xl font-black ${theme.text} uppercase tracking-tighter border-l-[24px] border-orange-600 pl-16 leading-[0.85] mb-16 drop-shadow-sm`}>
                      {activeSlide.title}
                   </h2>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                      {/* SOL: YOĞUN AKADEMİK İÇERİK */}
                      <div className={`${activeSlide.elements?.length ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8`}>
                         {activeSlide.content.map((c, i) => (
                            <div key={i} className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                               <div className={`w-3 h-3 ${theme.point} rounded-full mt-3 shadow-lg shrink-0`}></div>
                               <p className={`text-2xl font-bold ${theme.text} leading-[1.3] opacity-90 hover:opacity-100 transition-opacity italic`}>
                                  "{c}"
                                </p>
                            </div>
                         ))}
                      </div>

                      {/* SAĞ: MULTIMODAL ELEMENTLER */}
                      {activeSlide.elements && activeSlide.elements.length > 0 && (
                        <div className="lg:col-span-5 flex flex-col gap-8 animate-slide-up">
                           {activeSlide.elements.map(el => renderMultimodalElement(el))}
                        </div>
                      )}
                   </div>
                </div>

                {/* SLIDE FOOTER */}
                <div className={`p-10 ${theme.bg} border-t ${theme.border} flex justify-between items-center shrink-0 bg-black/5`}>
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">GİZLİDİR • AKADEMİK KULLANIM İÇİNDİR</span>
                   <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NÖRAL MÜHÜR DOĞRULANDI</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* INSTRUCTOR NOTES (NO-PRINT) */}
             <div className="w-full max-w-[1200px] mt-12 bg-slate-900/90 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 flex gap-16 shadow-3xl mb-20 relative overflow-hidden group">
                <div className="w-64 shrink-0 relative z-10">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                      </div>
                      <h5 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em]">EĞİTMEN REHBERİ</h5>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600 w-1/3"></div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-6 leading-relaxed">
                      Bu notlar sadece eğitmen ekranında görüntülenir. PDF çıktısına dahil edilmez.
                   </p>
                </div>
                <div className="flex-1 border-l border-white/5 pl-16 relative z-10">
                   <p className="text-slate-300 font-medium text-xl leading-relaxed italic opacity-90 group-hover:opacity-100 transition-opacity">
                      {activeSlide.speakerNotes || 'Bu slayt için eğitmen direktifi mühürlenmemiştir.'}
                   </p>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px]"></div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
