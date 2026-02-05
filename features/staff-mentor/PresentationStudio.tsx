
import React, { useState, useEffect, useRef } from 'react';
import { PresentationConfig, TrainingSlide, VisualStyle } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';

interface PresentationStudioProps {
  onClose?: () => void;
}

// Görsel Motoru: Unsplash Kaynaklı Yüksek Kaliteli Placeholders
const getBgImage = (keyword: string = 'abstract', style: VisualStyle) => {
  const mood = style === 'dark_mode' ? 'dark' : style === 'playful' ? 'colorful' : 'business';
  return `https://source.unsplash.com/1600x900/?${keyword},${mood}`;
};

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'config' | 'editor' | 'live'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  
  // Editor State
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [editingSlide, setEditingSlide] = useState<TrainingSlide | null>(null);

  // Live Mode States
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [isBlackout, setIsBlackout] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Config State
  const [config, setConfig] = useState<PresentationConfig>({
    topic: '',
    targetAudience: 'team',
    tone: 'academic',
    depth: 'intermediate',
    slideCount: 8,
    visualStyle: 'corporate',
    includeAnimations: true
  });

  // --- ACTIONS ---

  const handleGenerate = async () => {
    if (!config.topic) return alert("Lütfen bir konu başlığı giriniz.");
    setIsGenerating(true);
    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      setSlides(generatedSlides);
      setMode('editor');
      setActiveSlideIdx(0);
    } catch (e) {
      alert("Nöral Motor Hatası: Bağlantı kurulamadı.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToArchive = async () => {
    if (!slides.length) return;
    setIsSaving(true);
    try {
      const uniqueId = `PRES-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const syntheticEmail = `lib.${uniqueId}@system.yenigun.local`;

      const archivePayload = {
        id: uniqueId,
        name: config.topic || 'Adsız Sunum',
        branch: 'AKADEMİK MATERYAL',
        email: syntheticEmail,
        status: 'archived',
        archiveCategory: 'PRESENTATION_LIBRARY',
        archiveNote: `TÜR: ${config.targetAudience.toUpperCase()} | STİL: ${config.visualStyle.toUpperCase()}`,
        report: {
          score: 100,
          integrityIndex: 100,
          presentationSlides: slides,
          presentationConfig: config,
          summary: `Nöral Stüdyo Yayını: ${slides.length} Slayt`,
          deepAnalysis: {}, predictiveMetrics: {}, swot: {}, interviewGuidance: {}
        }
      };

      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(archivePayload)
      });

      if (!res.ok) throw new Error("Sunucu Kayıt Hatası");
      alert("Sunum, Akademik Kütüphane'ye mühürlendi.");
    } catch (e: any) {
      alert(`Hata: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPPTX = () => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = config.topic;
    pptx.author = 'Yeni Gün Akademi AI';

    slides.forEach((slide) => {
      const s = pptx.addSlide();
      
      // Background Logic
      if (config.visualStyle === 'dark_mode') s.background = { color: '0F172A' };
      else s.background = { color: 'FFFFFF' };

      const textColor = config.visualStyle === 'dark_mode' ? 'FFFFFF' : '000000';

      // Layout Logic
      switch(slide.layout) {
          case 'cover':
              s.addText(slide.title, { x: 0.5, y: 2, w: '90%', fontSize: 44, bold: true, color: 'EA580C', align: 'center' });
              if(slide.subtitle) s.addText(slide.subtitle, { x: 0.5, y: 3.5, w: '90%', fontSize: 24, color: '94A3B8', align: 'center', italic: true });
              break;
          case 'split_left':
              s.addText(slide.title, { x: 0.5, y: 0.5, w: '45%', fontSize: 32, bold: true, color: textColor });
              s.addText((slide.content || []).join('\n\n'), { x: 0.5, y: 1.5, w: '45%', fontSize: 18, color: '64748B', bullet: true });
              // Placeholder for image
              s.addShape(pptx.ShapeType.rect, { x: 5.5, y: 0.5, w: 4.5, h: 6, fill: { color: 'E2E8F0' } });
              s.addText(`Görsel: ${slide.imageKeyword}`, { x: 5.5, y: 3, w: 4.5, align: 'center', fontSize: 14, color: '94A3B8' });
              break;
          default:
              s.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: textColor });
              s.addText((slide.content || []).join('\n\n'), { x: 0.5, y: 1.5, w: '90%', fontSize: 18, color: '64748B', bullet: true });
      }

      if(slide.speakerNotes) s.addNotes(slide.speakerNotes);
    });

    pptx.writeFile({ fileName: `YG_Sunum_${Date.now()}.pptx` });
  };

  // --- SUB-COMPONENTS ---

  const SlideThumbnail = ({ slide, index, isActive, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`group relative aspect-video rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
        isActive 
        ? 'border-orange-500 shadow-lg ring-2 ring-orange-200' 
        : 'border-slate-200 hover:border-slate-300'
      }`}
    >
       <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-black uppercase z-10 ${isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
          {index + 1}
       </div>
       <div className="absolute inset-0 p-4 flex flex-col scale-[0.4] origin-top-left w-[250%] h-[250%] pointer-events-none bg-white">
          <h1 className="text-4xl font-black text-slate-900 mb-4">{slide.title}</h1>
          <div className="space-y-2">
             {(slide.content || []).slice(0,3).map((c: string, i: number) => (
                <div key={i} className="h-4 bg-slate-100 rounded w-3/4"></div>
             ))}
          </div>
       </div>
    </div>
  );

  const EditorPanel = () => {
      const slide = slides[activeSlideIdx];
      if(!slide) return null;

      const updateSlide = (field: keyof TrainingSlide, value: any) => {
          const newSlides = [...slides];
          newSlides[activeSlideIdx] = { ...newSlides[activeSlideIdx], [field]: value };
          setSlides(newSlides);
      };

      return (
          <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar shadow-xl z-20">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EDİTÖR KONTROLÜ</h4>
              
              <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Yerleşim (Layout)</label>
                  <select 
                    className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold border border-slate-200 outline-none"
                    value={slide.layout}
                    onChange={e => updateSlide('layout', e.target.value)}
                  >
                      {['cover', 'section_header', 'split_left', 'split_right', 'full_visual', 'bullet_list', 'quote_center'].map(l => (
                          <option key={l} value={l}>{l.replace('_', ' ').toUpperCase()}</option>
                      ))}
                  </select>
              </div>

              <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Görsel Anahtarı (Unsplash)</label>
                  <input 
                    type="text" 
                    className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold border border-slate-200 outline-none"
                    value={slide.imageKeyword}
                    onChange={e => updateSlide('imageKeyword', e.target.value)}
                  />
                  <img src={getBgImage(slide.imageKeyword, config.visualStyle)} className="w-full h-20 object-cover rounded-lg opacity-80" alt="Preview" />
              </div>

              <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Yönetici Notu</label>
                  <textarea 
                    className="w-full p-3 bg-yellow-50 text-yellow-900 rounded-lg text-xs border border-yellow-100 outline-none min-h-[100px]"
                    value={slide.speakerNotes}
                    onChange={e => updateSlide('speakerNotes', e.target.value)}
                  />
              </div>

              <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Animasyon</label>
                  <div className="grid grid-cols-3 gap-2">
                      {['fade', 'slide_up', 'zoom_in', 'pan_right', 'none'].map(a => (
                          <button 
                            key={a}
                            onClick={() => updateSlide('animation', a)}
                            className={`px-2 py-1 rounded text-[8px] font-black uppercase border ${slide.animation === a ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'}`}
                          >
                              {a.replace('_', ' ')}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  };

  // --- RENDER FLOW ---

  if (mode === 'config') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 animate-fade-in">
         <div className="max-w-6xl w-full bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col md:flex-row">
            
            {/* LEFT: VISUAL SELECTOR */}
            <div className="w-full md:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">Nöral<br/>Sunum<br/>Stüdyosu</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Gemini 3 Flash Multimodal Engine</p>
               </div>
               
               <div className="space-y-6 relative z-10">
                  <div>
                     <label className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-3">Görsel Stil</label>
                     <div className="grid grid-cols-2 gap-3">
                        {[
                          {id: 'corporate', label: 'Kurumsal'}, 
                          {id: 'minimalist', label: 'Minimal'}, 
                          {id: 'playful', label: 'Renkli'}, 
                          {id: 'dark_mode', label: 'Karanlık'}
                        ].map(s => (
                           <button 
                             key={s.id}
                             onClick={() => setConfig({...config, visualStyle: s.id as any})}
                             className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all text-left ${config.visualStyle === s.id ? 'border-orange-500 bg-white/10 text-white' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                           >
                              {s.label}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                     <p className="text-[10px] font-bold text-slate-300 italic leading-relaxed">
                        "Seçtiğiniz stil, slaytların renk paletini, tipografisini ve görsel arama algoritmasını (Unsplash Query) doğrudan etkileyecektir."
                     </p>
                  </div>
               </div>
               
               {/* Abstract Background Elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px]"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
            </div>

            {/* RIGHT: CONFIG FORM */}
            <div className="flex-1 p-16 bg-white relative">
               <div className="max-w-2xl mx-auto space-y-10">
                  
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konu Başlığı</label>
                     <input 
                       type="text" 
                       className="w-full p-6 bg-slate-50 rounded-[2rem] text-2xl font-black text-slate-900 border-2 border-transparent focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                       placeholder="Örn: Otizmde Kriz Yönetimi..."
                       value={config.topic}
                       onChange={e => setConfig({...config, topic: e.target.value})}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Kitle</label>
                        <select 
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-200"
                          value={config.targetAudience}
                          onChange={e => setConfig({...config, targetAudience: e.target.value as any})}
                        >
                           <option value="team">Akademik Kadro</option>
                           <option value="parents">Veli Grubu</option>
                           <option value="management">Yönetim Kurulu</option>
                           <option value="individual">Bireysel Personel</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Akademik Derinlik</label>
                        <select 
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-200"
                          value={config.depth}
                          onChange={e => setConfig({...config, depth: e.target.value as any})}
                        >
                           <option value="beginner">Başlangıç (101)</option>
                           <option value="intermediate">Orta Seviye</option>
                           <option value="expert">Uzman / Klinik</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slayt Sayısı</label>
                        <span className="text-xl font-black text-slate-900">{config.slideCount}</span>
                     </div>
                     <input 
                       type="range" min="3" max="15" step="1"
                       className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                       value={config.slideCount}
                       onChange={e => setConfig({...config, slideCount: parseInt(e.target.value)})}
                     />
                  </div>

                  <div className="pt-6">
                     <button 
                       onClick={handleGenerate}
                       disabled={isGenerating}
                       className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 relative overflow-hidden"
                     >
                        {isGenerating ? (
                           <span className="flex items-center justify-center gap-3 animate-pulse">
                              <span className="w-2 h-2 bg-white rounded-full"></span> NÖRAL İNŞA SÜRECİ...
                           </span>
                        ) : 'SUNUMU OLUŞTUR'}
                     </button>
                  </div>

               </div>
            </div>
         </div>
      </div>
    );
  }

  if (mode === 'editor') {
     const currentSlide = slides[activeSlideIdx];
     
     return (
       <div className="h-screen flex flex-col bg-slate-100 overflow-hidden animate-fade-in">
          
          {/* TOOLBAR */}
          <div className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
             <div className="flex items-center gap-4">
                <button onClick={() => setMode('config')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate max-w-md">{config.topic}</h3>
             </div>
             
             <div className="flex items-center gap-3">
                <button onClick={handleSaveToArchive} disabled={isSaving} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-600 transition-all">
                   {isSaving ? 'Mühürleniyor...' : 'Arşivle'}
                </button>
                <button onClick={handleExportPPTX} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all">
                   PPTX İndir
                </button>
                <button onClick={() => setMode('live')} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2">
                   <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> CANLI SUNUM
                </button>
             </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
             {/* LEFT: SLIDE STRIP */}
             <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                   {slides.map((s, i) => (
                      <SlideThumbnail 
                        key={s.id} 
                        slide={s} 
                        index={i} 
                        isActive={activeSlideIdx === i} 
                        onClick={() => setActiveSlideIdx(i)} 
                      />
                   ))}
                </div>
                <div className="p-4 border-t border-slate-200 bg-white">
                   <button onClick={handleGenerate} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase hover:bg-slate-200 transition-all">
                      + Slayt Ekle (AI)
                   </button>
                </div>
             </div>

             {/* CENTER: CANVAS */}
             <div className="flex-1 bg-slate-200/50 flex items-center justify-center p-12 overflow-hidden relative">
                <div className="aspect-video w-full max-w-5xl bg-white shadow-2xl rounded-xl overflow-hidden relative group">
                   {/* DYNAMIC SLIDE RENDERER */}
                   <div 
                     className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                     style={{ 
                        backgroundImage: config.visualStyle !== 'minimalist' ? `url(${getBgImage(currentSlide.imageKeyword, config.visualStyle)})` : 'none',
                        filter: config.visualStyle === 'dark_mode' ? 'brightness(0.4)' : 'brightness(0.9) contrast(0.9)'
                     }}
                   ></div>
                   
                   {/* CONTENT LAYER */}
                   <div className={`relative z-10 h-full p-16 flex flex-col ${config.visualStyle === 'dark_mode' ? 'text-white' : 'text-slate-900'}`}>
                      {currentSlide.layout === 'cover' && (
                         <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-scale-in">
                            <span className="px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full">YENİ GÜN AKADEMİ</span>
                            <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.9] drop-shadow-lg">{currentSlide.title}</h1>
                            <p className="text-2xl font-bold italic opacity-80">{currentSlide.subtitle}</p>
                         </div>
                      )}

                      {(currentSlide.layout === 'split_left' || currentSlide.layout === 'split_right') && (
                         <div className={`grid grid-cols-2 gap-12 h-full items-center ${currentSlide.layout === 'split_right' ? 'direction-rtl' : ''}`}>
                            <div className="space-y-8 animate-slide-up">
                               <h2 className="text-5xl font-black uppercase tracking-tight leading-none border-l-8 border-orange-600 pl-6">{currentSlide.title}</h2>
                               <ul className="space-y-4 pl-8">
                                  {(currentSlide.content || []).map((c, i) => (
                                     <li key={i} className="text-xl font-bold opacity-90 leading-snug list-disc marker:text-orange-500">{c}</li>
                                  ))}
                               </ul>
                            </div>
                            <div className="h-full bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center relative overflow-hidden">
                               <img src={getBgImage(currentSlide.imageKeyword, config.visualStyle)} className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-1000" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                  <p className="text-white text-sm font-bold italic">"{currentSlide.visualPrompt}"</p>
                               </div>
                            </div>
                         </div>
                      )}

                      {/* Default / Bullet List */}
                      {(currentSlide.layout === 'bullet_list' || currentSlide.layout === 'section_header') && (
                         <div className="h-full flex flex-col justify-center space-y-12 pl-12 border-l-2 border-white/10 animate-fade-in">
                            <h2 className="text-6xl font-black uppercase tracking-tight">{currentSlide.title}</h2>
                            <div className="space-y-6">
                               {(currentSlide.content || []).map((c, i) => (
                                  <div key={i} className="flex items-start gap-4">
                                     <div className="w-3 h-3 bg-orange-600 rounded-full mt-2 shrink-0"></div>
                                     <p className="text-2xl font-bold opacity-90 leading-relaxed">{c}</p>
                                  </div>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             </div>

             {/* RIGHT: EDITOR PANEL */}
             <EditorPanel />
          </div>
       </div>
     );
  }

  // --- LIVE MODE (FULL SCREEN PLAYER) ---
  if (mode === 'live') {
     const slide = slides[activeSlideIdx];
     
     const nextSlide = () => setActiveSlideIdx(prev => Math.min(prev + 1, slides.length - 1));
     const prevSlide = () => setActiveSlideIdx(prev => Math.max(prev - 1, 0));

     // Keyboard Listener for Live Mode
     useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
           if(e.key === 'ArrowRight' || e.key === ' ') nextSlide();
           if(e.key === 'ArrowLeft') prevSlide();
           if(e.key === 'l') setIsLaserActive(!isLaserActive);
           if(e.key === 'b') setIsBlackout(!isBlackout);
           if(e.key === 'n') setShowNotes(!showNotes);
           if(e.key === 'Escape') setMode('editor');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
     }, [activeSlideIdx, isLaserActive, isBlackout, showNotes]);

     return (
        <div 
          className={`fixed inset-0 z-[5000] bg-black cursor-none ${isLaserActive ? 'cursor-crosshair' : ''}`}
          onMouseMove={(e) => { setLaserPos({x: e.clientX, y: e.clientY}); document.body.style.cursor = 'none'; }}
        >
           {/* LASER POINTER */}
           {isLaserActive && (
              <div 
                className="fixed w-4 h-4 bg-red-600 rounded-full pointer-events-none z-[6000] shadow-[0_0_20px_rgba(255,0,0,0.8)]"
                style={{ left: laserPos.x - 8, top: laserPos.y - 8 }}
              />
           )}

           {/* BLACKOUT CURTAIN */}
           {isBlackout && (
              <div className="absolute inset-0 bg-black z-[5500] flex items-center justify-center">
                 <p className="text-white/20 font-black text-xs uppercase tracking-[0.5em]">GİZLİLİK MODU</p>
              </div>
           )}

           {/* SLIDE RENDERER (Clean Version) */}
           <div 
             className="w-full h-full relative"
             style={{ 
                backgroundImage: config.visualStyle !== 'minimalist' ? `url(${getBgImage(slide.imageKeyword, config.visualStyle)})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: config.visualStyle === 'dark_mode' ? 'brightness(0.5)' : 'brightness(0.95)'
             }}
           >
              <div className={`absolute inset-0 p-20 flex flex-col justify-center ${config.visualStyle === 'dark_mode' ? 'text-white' : 'text-slate-900'} ${slide.animation === 'zoom_in' ? 'animate-scale-in' : slide.animation === 'slide_up' ? 'animate-slide-up' : 'animate-fade-in'}`}>
                 
                 {slide.layout === 'cover' ? (
                    <div className="text-center space-y-12">
                       <h1 className="text-8xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{slide.title}</h1>
                       <p className="text-4xl font-bold italic opacity-90">{slide.subtitle}</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-12 gap-16 items-center">
                       <div className="col-span-7 space-y-12">
                          <h2 className="text-7xl font-black uppercase tracking-tight leading-none border-l-[16px] border-orange-600 pl-10">{slide.title}</h2>
                          <div className="space-y-8 pl-14">
                             {(slide.content || []).map((c, i) => (
                                <p key={i} className="text-4xl font-bold opacity-90 leading-snug flex items-start gap-6">
                                   <span className="text-orange-600 mt-2">▪</span> {c}
                                </p>
                             ))}
                          </div>
                       </div>
                       {slide.visualPrompt && (
                          <div className="col-span-5 bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
                             <p className="text-2xl font-bold italic opacity-80 text-white">"{slide.visualPrompt}"</p>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>

           {/* SPEAKER NOTES OVERLAY (HUD) */}
           {showNotes && (
              <div className="absolute top-10 right-10 w-96 bg-black/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-white z-[5600] animate-slide-left">
                 <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">YÖNETİCİ NOTLARI</h5>
                 <p className="text-lg font-medium leading-relaxed">{slide.speakerNotes || 'Not bulunmuyor.'}</p>
              </div>
           )}

           {/* PROGRESS BAR */}
           <div className="absolute bottom-0 left-0 h-2 bg-white/20 w-full z-[5600]">
              <div className="h-full bg-orange-600 transition-all duration-500" style={{ width: `${((activeSlideIdx + 1) / slides.length) * 100}%` }}></div>
           </div>
        </div>
     );
  }

  return null;
};

export default PresentationStudio;
