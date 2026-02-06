
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrainingSlide, CustomTrainingPlan, MultimodalElement, Branch } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';
import AssignmentModal from './AssignmentModal';
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PresentationStudioProps {
  onClose: () => void;
  customPlan: CustomTrainingPlan;
  assignmentId?: string; 
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose, customPlan, assignmentId }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [view, setView] = useState<'presentation' | 'quiz' | 'completed'>('presentation');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  // GÜVENLİ VERİ ÇEKİMİ: Slides her zaman dizi olmalı
  const slides = Array.isArray(customPlan?.slides) ? customPlan.slides : [];
  const activeSlide = slides.length > 0 ? slides[activeSlideIdx] : null;

  // --- PDF EXPORT (v6.1 GHOST ENGINE) ---
  const handleDownloadPDF = async () => {
    if (!slideRef.current || slides.length === 0) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(slideRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      pdf.save(`YG_Egitim_${customPlan.title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error("PDF Motoru Hatası:", e);
    } finally {
      setIsExporting(false);
    }
  };

  // --- PPTX EXPORT ---
  const handleDownloadPPTX = () => {
    if (slides.length === 0) return;
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    slides.forEach((s) => {
      const slide = pptx.addSlide();
      slide.background = { fill: '0F172A' };
      slide.addText(s.title || 'Başlıksız Slayt', { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: 'EA580C', align: 'left' });
      
      let yPos = 1.5;
      const contentArray = Array.isArray(s.content) ? s.content : [];
      contentArray.forEach((line) => {
        slide.addText(`• ${line}`, { x: 0.7, y: yPos, w: '85%', fontSize: 18, color: 'CBD5E1' });
        yPos += 0.6;
      });

      slide.addText("YENİ GÜN AKADEMİ - AKADEMİK MÜHÜR", { x: 0.5, y: 5.2, w: '90%', fontSize: 10, color: '475569', italic: true });
    });

    pptx.writeFile({ fileName: `YG_Sunum_${customPlan.title}.pptx` });
  };

  // --- ARŞİVE MÜHÜRLE ---
  const handleArchive = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...customPlan, status: 'archived', updatedAt: Date.now() })
      });
      if (res.ok) alert("Eğitim kurumsal arşive başarıyla mühürlendi.");
    } catch (e) {
      alert("Arşivleme hatası.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- MULTIMODAL ELEMENT RENDERER ---
  const renderElement = (el: MultimodalElement) => {
    if (!el || !el.content) return null;
    switch (el.type) {
      case 'text':
        return <p className="text-2xl font-medium text-slate-700 leading-relaxed mb-6 border-l-8 border-orange-600 pl-8">{el.content.text || el.content}</p>;
      case 'image_prompt':
        return (
          <div className="bg-slate-100 rounded-[3rem] aspect-video flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 mb-8 relative overflow-hidden group">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 relative z-10 text-4xl">🖼️</div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-center relative z-10 max-w-md">{el.content.label || "AI Görsel Üretim Alanı"}</p>
          </div>
        );
      case 'symbol':
        return (
          <div className="flex items-center gap-8 p-10 bg-blue-50 rounded-[3.5rem] border border-blue-100 mb-8 shadow-inner">
             <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center text-6xl shadow-xl rotate-3">{el.content.icon || '🧩'}</div>
             <div>
                <h5 className="text-blue-900 font-black text-3xl uppercase tracking-tighter">{el.content.label || 'Kavramsal Sembol'}</h5>
                <p className="text-blue-700 text-[11px] font-bold opacity-60 uppercase tracking-[0.3em] mt-2">Görsel Destekli Pedagoji</p>
             </div>
          </div>
        );
      case 'graph_logic':
        const mockData = [ { n: 'A', v: 40 }, { n: 'B', v: 70 }, { n: 'C', v: 55 }, { n: 'D', v: 90 } ];
        return (
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mb-8 h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <Bar dataKey="v" radius={[10, 10, 0, 0]} fill="#ea580c">
                      {mockData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#ea580c' : '#0f172a'} />)}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        );
      case 'interactive_case':
        return (
          <div className="bg-orange-600 p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden mb-8">
             <div className="relative z-10">
                <span className="text-[11px] font-black text-orange-200 uppercase tracking-[0.4em] mb-6 block">Kritik Vaka Tartışması</span>
                <p className="text-4xl font-black italic tracking-tighter leading-tight">"{el.content.question || el.content.text}"</p>
             </div>
          </div>
        );
      default: return null;
    }
  };

  if (view === 'completed') {
    return (
      <div className="fixed inset-0 z-[5000] bg-slate-950 flex flex-col items-center justify-center p-8 animate-fade-in">
         <div className="max-w-md w-full bg-white rounded-[4rem] p-16 text-center space-y-10 shadow-3xl scale-in">
            <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-6">
               <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Eğitim Mühürlendi</h2>
               <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-4">Akademik gelişim dosyanız başarıyla tamamlandı.</p>
            </div>
            <button onClick={onClose} className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95">AKADEMİ HUB'A DÖN</button>
         </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 z-[4000] bg-slate-950 flex flex-col items-center justify-center text-white">
        <p className="text-xs font-black uppercase tracking-widest opacity-40">Müfredat Verisi Alınamadı</p>
        <button onClick={onClose} className="mt-8 px-8 py-3 bg-white/10 rounded-xl">Hub'a Dön</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950 flex flex-col overflow-hidden animate-fade-in no-print">
       {showAssignmentModal && (
           <AssignmentModal plan={customPlan} onClose={() => setShowAssignmentModal(false)} />
       )}

       <div className="h-24 bg-slate-900 border-b border-white/5 flex items-center justify-between px-10 shrink-0 relative z-[4001]">
          <div className="flex items-center gap-8">
             <button onClick={onClose} className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none max-w-xl truncate">{customPlan.title}</h3>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-3">MIA Multimodal Engine • {activeSlideIdx + 1} / {slides.length}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mr-6">
                <button onClick={handleDownloadPDF} disabled={isExporting} className="px-6 py-3 text-[10px] font-black text-white uppercase hover:bg-white/10 rounded-xl transition-all">PDF</button>
                <button onClick={handleDownloadPPTX} className="px-6 py-3 text-[10px] font-black text-white uppercase hover:bg-white/10 rounded-xl transition-all">PPTX</button>
                <button onClick={() => setShowAssignmentModal(true)} className="px-6 py-3 text-[10px] font-black text-orange-500 uppercase hover:bg-white/10 rounded-xl transition-all">ATA</button>
                <button onClick={handleArchive} disabled={isSaving} className="px-6 py-3 text-[10px] font-black text-emerald-500 uppercase hover:bg-white/10 rounded-xl transition-all">ARŞİV</button>
             </div>

             <div className="flex gap-2">
                <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-orange-600 transition-all text-2xl font-black">←</button>
                <button 
                  onClick={() => activeSlideIdx < slides.length - 1 ? setActiveSlideIdx(p => p + 1) : setView('completed')} 
                  className="px-12 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all shadow-2xl"
                >
                   {activeSlideIdx === slides.length - 1 ? 'MÜHÜRLE' : 'İLERLE →'}
                </button>
             </div>
          </div>
       </div>

       <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden bg-slate-950">
          <div ref={slideRef} className="w-full max-w-[1400px] bg-white rounded-[4rem] aspect-video shadow-3xl overflow-hidden flex flex-col relative animate-scale-in">
             <div className="p-20 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-16 border-b border-slate-100 pb-10">
                    <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter border-l-[16px] border-orange-600 pl-10 leading-none max-w-5xl">
                        {activeSlide?.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-10">
                   {Array.isArray(activeSlide?.elements) ? (
                      activeSlide.elements.map((el: any, i: number) => <div key={i}>{renderElement(el)}</div>)
                   ) : Array.isArray(activeSlide?.content) ? (
                      activeSlide.content.map((point: string, i: number) => (
                         <div key={i} className="flex gap-8 items-start p-8 rounded-[3rem] hover:bg-slate-50 transition-colors group">
                            <div className="w-5 h-5 bg-orange-600 rounded-full mt-3.5 shrink-0 shadow-xl ring-8 ring-orange-50"></div>
                            <p className="text-3xl font-bold text-slate-700 leading-snug">{point}</p>
                         </div>
                      ))
                   ) : (
                      <p className="text-slate-400 italic">Slayt içeriği bulunamadı.</p>
                   )}
                </div>
             </div>
             
             <div className="p-10 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">NÖRAL AKADEMİ EĞİTİM STANDARDI</span>
                <span className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em]">{activeSlideIdx + 1}</span>
             </div>
          </div>
       </div>

       <div className="h-40 bg-slate-900 border-t border-white/5 px-16 py-8 overflow-y-auto custom-scrollbar shrink-0 no-print flex gap-12 text-slate-300 italic font-medium">
          {activeSlide?.speakerNotes || 'Bu slayt için nöral derinlik notu eklenmemiştir.'}
       </div>
    </div>
  );
};

export default PresentationStudio;
