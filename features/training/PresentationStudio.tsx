
import React, { useState, useRef } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement, Branch } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';
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

  const handleDownloadPDF = async () => {
    if (!slideRef.current) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        setActiveSlideIdx(i);
        await new Promise(r => setTimeout(r, 300));
        const canvas = await html2canvas(slideRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      }
      pdf.save(`YG_AKADEMI_${customPlan.title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      alert("PDF Aktarım Hatası.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Bu müfredat kurum kütüphanesine mühürlenecek. Onaylıyor musunuz?")) return;
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...customPlan, status: 'active' })
      });
      if (res.ok) alert("Müfredat Arşive Mühürlendi.");
    } catch (e) { alert("Arşivleme Hatası."); }
  };

  const renderMultimodalElement = (el: MultimodalElement) => {
    switch (el.type) {
      case 'symbol':
        return (
          <div className="flex items-center gap-6 p-8 bg-blue-50 rounded-[3rem] border border-blue-100 mb-6">
            <div className="text-6xl">{el.content.icon || '🧩'}</div>
            <div>
              <h5 className="text-blue-900 font-black text-2xl uppercase tracking-tighter">{el.content.label}</h5>
              <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mt-1">Pedagojik Sembol Protokolü</p>
            </div>
          </div>
        );
      case 'graph_logic':
        return (
          <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 mb-6 h-64">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{el.content.label || 'Veri Trendi'}</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(el.content.dataPoints || [40, 70, 55, 90]).map((v: number, i: number) => ({ n: i, v }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Bar dataKey="v" radius={[8, 8, 0, 0]} fill="#ea580c">
                   {(el.content.dataPoints || [40, 70, 55, 90]).map((_: any, i: number) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#ea580c' : '#0f172a'} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'image_prompt':
        return (
          <div className="bg-slate-900 rounded-[3rem] aspect-video mb-6 flex flex-col items-center justify-center p-12 text-center border border-white/10 group overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-6 relative z-10">🎨</div>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] relative z-10">AI Görsel Konsepti</p>
             <p className="text-xs text-slate-500 mt-4 italic max-w-md relative z-10">"{el.content.text}"</p>
          </div>
        );
      case 'interactive_case':
        return (
          <div className="bg-orange-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden mb-6">
             <h5 className="text-[10px] font-black text-orange-200 uppercase tracking-[0.4em] mb-4">Vaka Tartışması</h5>
             <p className="text-2xl font-black italic tracking-tighter">"{el.content.text || el.content.question}"</p>
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        );
      default:
        return <p className="text-xl font-medium text-slate-600 leading-relaxed mb-6 italic border-l-4 border-orange-500 pl-6">"{el.content.text || JSON.stringify(el.content)}"</p>;
    }
  };

  if (view === 'completed') {
     return (
        <div className="fixed inset-0 z-[5000] bg-slate-950 flex items-center justify-center p-10 animate-fade-in">
           <div className="max-w-md w-full bg-white rounded-[4rem] p-16 text-center space-y-10 shadow-3xl">
              <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl scale-in"><svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg></div>
              <div><h2 className="text-4xl font-black text-slate-900 uppercase">Eğitim Tamam</h2><p className="text-slate-400 font-bold uppercase text-[11px] mt-4">Akademik gelişim dosyası mühürlendi.</p></div>
              <button onClick={onClose} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase">AKADEMİ HUB'A DÖN</button>
           </div>
        </div>
     );
  }

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950 flex flex-col overflow-hidden animate-fade-in no-print">
       {showAssignmentModal && <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />}
       
       {/* CONTROL BAR */}
       <div className="h-24 bg-slate-900 border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-50">
          <div className="flex items-center gap-8">
             <button onClick={onClose} className="w-14 h-14 bg-white/5 hover:bg-rose-600 rounded-2xl text-white transition-all flex items-center justify-center"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
             <div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none truncate max-w-xl">{customPlan.title}</h3>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-3">MIA Multimodal Production • {activeSlideIdx + 1} / {slides.length}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mr-6">
                <button onClick={handleDownloadPDF} disabled={isExporting} className="px-6 py-3 text-[10px] font-black text-white uppercase hover:bg-white/10 rounded-xl transition-all">PDF</button>
                <button onClick={handleArchive} className="px-6 py-3 text-[10px] font-black text-white uppercase hover:bg-white/10 rounded-xl transition-all">ARŞİV</button>
                <button onClick={() => setShowAssignmentModal(true)} className="px-6 py-3 text-[10px] font-black text-orange-500 uppercase hover:bg-white/10 rounded-xl transition-all">ATA</button>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-orange-600 transition-all text-2xl font-black">←</button>
                <button onClick={() => activeSlideIdx < slides.length - 1 ? setActiveSlideIdx(p => p + 1) : setView('completed')} className="px-12 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all shadow-2xl">
                   {activeSlideIdx === slides.length - 1 ? 'MÜHÜRLE' : 'İLERLE →'}
                </button>
             </div>
          </div>
       </div>

       {/* THE STAGE */}
       <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden bg-slate-950">
          <div ref={slideRef} className="w-full max-w-[1400px] bg-white rounded-[4rem] aspect-video shadow-[0_60px_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative animate-scale-in">
             <div className="p-20 flex-1 overflow-y-auto custom-scrollbar">
                <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter border-l-[16px] border-orange-600 pl-12 leading-none mb-16 max-w-5xl">{activeSlide?.title}</h2>
                <div className="grid grid-cols-1 gap-4">
                   {activeSlide?.elements?.map((el, i) => <div key={i}>{renderMultimodalElement(el)}</div>)}
                   {!activeSlide?.elements && activeSlide?.content?.map((c, i) => (
                      <div key={i} className="flex gap-6 items-start p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="w-3 h-3 bg-orange-600 rounded-full mt-2.5"></div>
                         <p className="text-2xl font-bold text-slate-700">{c}</p>
                      </div>
                   ))}
                </div>
             </div>
             <div className="p-10 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">NÖRAL AKADEMİ EĞİTİM ÜNİTESİ</span>
                <span className="px-6 py-2 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase shadow-xl">{activeSlideIdx + 1}</span>
             </div>
          </div>
       </div>

       {/* SPEAKER NOTES */}
       <div className="h-40 bg-slate-900 border-t border-white/5 px-16 py-8 overflow-y-auto custom-scrollbar shrink-0 no-print flex gap-12">
          <div className="w-48 shrink-0">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-3">KLİNİK ANALİZ</span>
             <div className="h-1.5 w-full bg-orange-600 rounded-full"></div>
             <p className="text-[10px] font-bold text-slate-500 uppercase mt-4">Gemini 3 Pro Notes</p>
          </div>
          <p className="text-slate-300 font-medium text-lg leading-relaxed italic max-w-5xl">
             {activeSlide?.speakerNotes || 'Bu slayt için özel bir klinik not eklenmemiştir.'}
          </p>
       </div>
    </div>
  );
};

export default PresentationStudio;
