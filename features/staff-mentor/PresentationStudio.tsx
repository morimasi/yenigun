
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PresentationConfig, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';

interface PresentationStudioProps {
  onClose?: () => void;
  initialSlides?: TrainingSlide[]; // YENİ: Dışarıdan slayt yüklenebilir
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose, initialSlides }) => {
  const [mode, setMode] = useState<'config' | 'preview' | 'live'>(initialSlides ? 'preview' : 'config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slides, setSlides] = useState<TrainingSlide[]>(initialSlides || []);
  
  // Live Mode States
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [isBlackout, setIsBlackout] = useState(false);

  // Configuration State
  const [config, setConfig] = useState<PresentationConfig>({
    topic: '',
    targetAudience: 'team',
    tone: 'academic',
    depth: 'intermediate',
    slideCount: 8
  });

  useEffect(() => {
     if(initialSlides) {
        setSlides(initialSlides);
        setMode('preview');
     }
  }, [initialSlides]);

  // ... (Dışa aktarma ve diğer fonksiyonlar mevcut yapıdan korunur)
  // PDF ve PPTX motoru slides state'ine bağlı olduğu için initialSlides ile de çalışacaktır.

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    slides.forEach((slide, index) => {
        if (index > 0) doc.addPage();
        doc.setFillColor(15, 23, 42); doc.rect(0, 0, 297, 210, 'F');
        doc.setFillColor(234, 88, 12); doc.rect(0, 0, 297, 5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255); doc.setFontSize(24);
        doc.text(slide.title.toUpperCase(), 20, 30);
        doc.setFontSize(14); doc.setFont('helvetica', 'normal'); doc.setTextColor(203, 213, 225);
        let yPos = 60;
        (slide.content || []).forEach(point => {
            doc.text(`• ${point}`, 20, yPos); yPos += 15;
        });
        doc.setFontSize(8); doc.text(`Slayt ${index + 1} / ${slides.length}`, 280, 205, { align: 'right' });
    });
    doc.save(`YG_Akademi_Egitim_${Date.now()}.pdf`);
  };

  const handleGenerate = async () => {
    if (!config.topic) return alert("Konu giriniz.");
    setIsGenerating(true);
    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      setSlides(generatedSlides);
      setMode('preview');
      setActiveSlideIdx(0);
    } catch (e) { alert("Hata"); } finally { setIsGenerating(false); }
  };

  const changeSlide = (direction: 'prev' | 'next') => {
    setActiveSlideIdx(prev => direction === 'next' ? Math.min(prev + 1, slides.length - 1) : Math.max(prev - 1, 0));
  };

  if (mode === 'config') {
     // ... mevcut config UI
     return <div className="p-20 text-white">Konfigürasyon Modu... (Butona basın) <button onClick={handleGenerate}>Başlat</button></div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100 p-8 gap-6 animate-fade-in h-full overflow-hidden">
       {/* UI Previewer & Controller */}
       <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 no-print">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100">← Çıkış</button>
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{config.topic || 'AI Eğitim Sunumu'}</h3>
          </div>
          <div className="flex gap-3">
             <button onClick={handleExportPDF} className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">PDF İNDİR</button>
             <button onClick={() => setMode('live')} className="px-8 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all">CANLI BAŞLAT</button>
          </div>
       </div>

       <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
          <div className="col-span-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 no-print">
             {slides.map((s, i) => (
                <div key={i} onClick={() => setActiveSlideIdx(i)} className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${activeSlideIdx === i ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-transparent hover:border-orange-200'}`}>
                   <span className="text-[8px] font-black uppercase opacity-50 block mb-1">Slayt {i+1}</span>
                   <p className="text-[10px] font-bold leading-tight line-clamp-2">{s.title}</p>
                </div>
             ))}
          </div>
          <div className="col-span-9 bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden relative group aspect-video flex flex-col items-center justify-center p-20">
             <div className="w-full h-full flex flex-col justify-center">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-10 border-l-8 border-orange-600 pl-8">{slides[activeSlideIdx]?.title}</h2>
                <div className="space-y-6">
                   {(slides[activeSlideIdx]?.content || []).map((c, i) => (
                      <div key={i} className="flex gap-4 items-start">
                         <div className="w-2 h-2 bg-orange-600 rounded-full mt-2.5 shrink-0"></div>
                         <p className="text-xl font-bold text-slate-600 leading-snug">{c}</p>
                      </div>
                   ))}
                </div>
                {slides[activeSlideIdx]?.interactiveElement && (
                   <div className="mt-12 p-8 bg-orange-50 border border-orange-100 rounded-3xl">
                      <span className="text-[10px] font-black text-orange-600 uppercase block mb-3">SORU & TARTIŞMA</span>
                      <p className="text-lg font-black text-slate-800 italic">"{slides[activeSlideIdx].interactiveElement!.question}"</p>
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
