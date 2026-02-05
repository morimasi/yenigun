
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PresentationConfig, TrainingSlide, VisualStyle, SlideLayout, PresentationTheme } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PptxGenJS from 'pptxgenjs';

interface PresentationStudioProps {
  initialConfig?: PresentationConfig;
  onClose?: () => void;
}

// THEME DEFINITIONS
const THEMES: Record<VisualStyle, PresentationTheme> = {
  corporate: { id: 'corp', name: 'Kurumsal', fontFamily: 'Plus Jakarta Sans', primaryColor: '#0f172a', secondaryColor: '#ea580c', backgroundColor: '#ffffff', textColor: '#1e293b', accentColor: '#cbd5e1' },
  dark_mode: { id: 'dark', name: 'Sinematik', fontFamily: 'Inter', primaryColor: '#ffffff', secondaryColor: '#f59e0b', backgroundColor: '#0f172a', textColor: '#f8fafc', accentColor: '#334155' },
  playful: { id: 'play', name: 'Canlı', fontFamily: 'Comic Neue', primaryColor: '#4f46e5', secondaryColor: '#ec4899', backgroundColor: '#fff1f2', textColor: '#3730a3', accentColor: '#fbcfe8' },
  minimalist: { id: 'min', name: 'Minimal', fontFamily: 'Lato', primaryColor: '#18181b', secondaryColor: '#71717a', backgroundColor: '#fafafa', textColor: '#27272a', accentColor: '#e4e4e7' },
  academic: { id: 'acad', name: 'Akademik', fontFamily: 'Merriweather', primaryColor: '#1e3a8a', secondaryColor: '#1d4ed8', backgroundColor: '#f0f9ff', textColor: '#172554', accentColor: '#dbeafe' },
  warm_serenity: { id: 'warm', name: 'Sıcak', fontFamily: 'Nunito', primaryColor: '#78350f', secondaryColor: '#d97706', backgroundColor: '#fffbeb', textColor: '#451a03', accentColor: '#fde68a' },
  neuro_divergent: { id: 'neuro', name: 'Nöro-Dostu', fontFamily: 'Open Dyslexic', primaryColor: '#000000', secondaryColor: '#005f73', backgroundColor: '#e9edc9', textColor: '#000000', accentColor: '#ccd5ae' }
};

// AI IMAGE GENERATOR URL (POLLINATIONS.AI)
const generateImageUrl = (prompt: string) => {
  const encodedPrompt = encodeURIComponent(prompt + ", high quality, 4k, photorealistic");
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true`;
};

const PresentationStudio: React.FC<PresentationStudioProps> = ({ initialConfig, onClose }) => {
  // --- STATE ---
  const [mode, setMode] = useState<'config' | 'editor' | 'live'>('config');
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [activeTheme, setActiveTheme] = useState<PresentationTheme>(THEMES.corporate);
  
  // Editor State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<'design' | 'content' | 'ai'>('design');
  
  // AI Process
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [refineIntent, setRefineIntent] = useState('');

  // Live Mode
  const [laserPointer, setLaserPointer] = useState<{x:number, y:number} | null>(null);
  const [isBlackout, setIsBlackout] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Config
  const [config, setConfig] = useState<PresentationConfig>(initialConfig || {
    topic: '',
    targetAudience: 'team',
    tone: 'academic',
    depth: 'intermediate',
    slideCount: 8,
    visualStyle: 'corporate',
    includeAnimations: true
  });

  // --- EFFECTS ---
  useEffect(() => {
    setActiveTheme(THEMES[config.visualStyle] || THEMES.corporate);
  }, [config.visualStyle]);

  // Global Keyboard Listener (Moved to top level)
  useEffect(() => {
    if (mode !== 'live') return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') setActiveSlideIdx(prev => Math.min(prev + 1, slides.length - 1));
        if (e.key === 'ArrowLeft') setActiveSlideIdx(prev => Math.max(0, prev - 1));
        if (e.key === 'l') setLaserPointer(prev => prev ? null : {x: window.innerWidth/2, y: window.innerHeight/2});
        if (e.key === 'b') setIsBlackout(prev => !prev);
        if (e.key === 'n') setShowNotes(prev => !prev);
        if (e.key === 'd') setDrawingMode(prev => !prev);
        if (e.key === 'Escape') setMode('editor');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, slides.length]);

  // --- ACTIONS ---

  const handleGenerate = async () => {
    if (!config.topic) return alert("Konu başlığı zorunludur.");
    setIsGenerating(true);
    setLoadingMsg("Nöral Ağ Bağlanıyor...");
    
    const steps = ["Pedagojik Kurgu Tasarlanıyor...", "Görsel Semantik Analiz Ediliyor...", "Sahne Düzeni Oluşturuluyor...", "Final Render Alınıyor..."];
    let stepIdx = 0;
    const interval = setInterval(() => { setLoadingMsg(steps[stepIdx % steps.length]); stepIdx++; }, 1500);

    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      // Pre-generate image URLs based on AI prompts
      const slidesWithImages = generatedSlides.map(s => ({
          ...s,
          generatedImageUrl: generateImageUrl(s.imageKeyword || config.topic)
      }));
      setSlides(slidesWithImages);
      setMode('editor');
      setActiveSlideIdx(0);
    } catch (e) {
      alert("AI Servis Hatası: Lütfen tekrar deneyiniz.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handleRefineSlide = async () => {
      if (!refineIntent) return;
      setIsRefining(true);
      try {
          const refinedSlide = await armsService.refineSlideContent(slides[activeSlideIdx], refineIntent);
          const newSlides = [...slides];
          newSlides[activeSlideIdx] = { ...refinedSlide, generatedImageUrl: slides[activeSlideIdx].generatedImageUrl }; // Keep image unless explicitly changed
          setSlides(newSlides);
          setRefineIntent('');
          alert("Slayt içeriği güncellendi.");
      } catch (e) {
          alert("İyileştirme hatası.");
      } finally {
          setIsRefining(false);
      }
  };

  const handleRegenerateImage = () => {
      const slide = slides[activeSlideIdx];
      const newUrl = generateImageUrl(slide.imageKeyword + " " + Math.random().toString(36).substring(7));
      updateSlide('generatedImageUrl', newUrl);
  };

  const updateSlide = (field: keyof TrainingSlide, value: any) => {
      const newSlides = [...slides];
      newSlides[activeSlideIdx] = { ...newSlides[activeSlideIdx], [field]: value };
      setSlides(newSlides);
  };

  const handleExportPPTX = () => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = config.topic;
    
    slides.forEach((slide) => {
        const s = pptx.addSlide();
        s.background = { color: activeTheme.backgroundColor.replace('#', '') };
        s.color = activeTheme.textColor.replace('#', '');
        
        s.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: activeTheme.primaryColor.replace('#', '') });
        if (slide.content) {
            s.addText(slide.content.join('\n'), { x: 0.5, y: 1.5, w: '90%', fontSize: 14, bullet: true });
        }
        if (slide.speakerNotes) s.addNotes(slide.speakerNotes);
    });
    
    pptx.writeFile({ fileName: `YG_Akademi_${config.topic.replace(/\s/g, '_')}.pptx` });
  };

  // --- RENDER HELPERS ---
  const slideStyle = {
      fontFamily: activeTheme.fontFamily,
      backgroundColor: activeTheme.backgroundColor,
      color: activeTheme.textColor
  };

  // --- VIEWS ---

  // 1. CONFIGURATION
  if (mode === 'config') {
    return (
      <div className="fixed inset-0 z-[3000] bg-slate-50 flex items-center justify-center p-8 animate-fade-in">
         <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] shadow-2xl border border-slate-200 flex overflow-hidden relative">
            {/* BRANDING LEFT */}
            <div className="w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg">S</div>
                  <h2 className="text-5xl font-black uppercase tracking-tight leading-[0.9]">Nöral<br/>Sunum<br/>Stüdyosu</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-6 border-l-2 border-orange-600 pl-4">v4.0 Cognitive Canvas</p>
               </div>
               <div className="space-y-6 relative z-10">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                     <p className="text-sm font-medium text-slate-300 italic leading-relaxed">
                        "Gemini 3 Flash motoru ile saniyeler içinde akademik kalitede, görsel olarak zenginleştirilmiş ve pedagojik derinliği olan eğitim materyalleri üretin."
                     </p>
                  </div>
                  <div className="flex gap-2">
                     {['AI Görsel', 'Pedagojik Akış', 'Canlı Sahne'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-wide">{tag}</span>
                     ))}
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
            </div>

            {/* FORM RIGHT */}
            <div className="flex-1 p-16 flex flex-col justify-center relative bg-slate-50/50">
               <button onClick={onClose} className="absolute top-8 right-8 p-4 hover:bg-slate-200 rounded-full transition-all text-slate-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>

               <div className="max-w-xl mx-auto w-full space-y-10">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Eğitim Konusu</label>
                     <input 
                       type="text" 
                       className="w-full p-6 bg-white rounded-[2rem] text-2xl font-black text-slate-900 border-2 border-transparent focus:border-orange-500 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                       placeholder="Örn: Otizmde Kriz Yönetimi..."
                       value={config.topic}
                       onChange={e => setConfig({...config, topic: e.target.value})}
                       autoFocus
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Kitle</label>
                        <select className="w-full p-5 bg-white rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-300 shadow-sm appearance-none" value={config.targetAudience} onChange={e => setConfig({...config, targetAudience: e.target.value as any})}>
                           <option value="team">Akademik Kadro</option>
                           <option value="parents">Veli Grubu</option>
                           <option value="management">Yönetim Kurulu</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Görsel Stil</label>
                        <select className="w-full p-5 bg-white rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-300 shadow-sm appearance-none" value={config.visualStyle} onChange={e => setConfig({...config, visualStyle: e.target.value as any})}>
                           {Object.entries(THEMES).map(([key, theme]) => (
                              <option key={key} value={key}>{theme.name}</option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ton</label>
                        <select className="w-full p-5 bg-white rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-300 shadow-sm appearance-none" value={config.tone} onChange={e => setConfig({...config, tone: e.target.value as any})}>
                           <option value="academic">Akademik & Resmi</option>
                           <option value="motivational">Motivasyonel & Canlı</option>
                           <option value="empathetic">Empatik & Yumuşak</option>
                           <option value="workshop">Atölye & Pratik</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Derinlik</label>
                        <select className="w-full p-5 bg-white rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-300 shadow-sm appearance-none" value={config.depth} onChange={e => setConfig({...config, depth: e.target.value as any})}>
                           <option value="beginner">Giriş Seviyesi</option>
                           <option value="intermediate">Orta Seviye</option>
                           <option value="expert">İleri Uzmanlık</option>
                        </select>
                     </div>
                  </div>

                  <div className="pt-6">
                     <button 
                       onClick={handleGenerate}
                       disabled={isGenerating}
                       className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 relative overflow-hidden"
                     >
                        {isGenerating ? (
                           <span className="flex items-center justify-center gap-4 animate-pulse">
                              <span className="w-3 h-3 bg-white rounded-full"></span>
                              {loadingMsg}
                           </span>
                        ) : 'CANVAS OLUŞTUR'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // 2. EDITOR MODE
  if (mode === 'editor') {
     const slide = slides[activeSlideIdx];
     
     return (
        <div className="fixed inset-0 z-[3000] bg-[#f8fafc] flex flex-col overflow-hidden animate-fade-in font-sans text-slate-900">
           
           {/* TOP TOOLBAR */}
           <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-4">
                 <button onClick={() => setMode('config')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
                 <div className="h-6 w-px bg-slate-200"></div>
                 <h3 className="font-black text-sm uppercase tracking-tight text-slate-800">{config.topic}</h3>
                 <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">{activeTheme.name} Tema</span>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={handleExportPPTX} className="px-5 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all text-slate-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                    PPTX İndir
                 </button>
                 <button onClick={() => setMode('live')} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                    CANLI SAHNE
                 </button>
                 <button onClick={() => setIsInspectorOpen(!isInspectorOpen)} className={`p-2.5 rounded-xl border transition-all ${isInspectorOpen ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white border-transparent text-slate-400'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                 </button>
              </div>
           </div>

           <div className="flex-1 flex overflow-hidden">
              
              {/* LEFT: SLIDE STRIP */}
              <div className={`w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ${isSidebarOpen ? '' : '-ml-64'}`}>
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slaytlar ({slides.length})</span>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50">
                    {slides.map((s, i) => (
                       <div 
                         key={s.id}
                         onClick={() => setActiveSlideIdx(i)}
                         className={`group relative aspect-video bg-white rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${activeSlideIdx === i ? 'border-orange-500 shadow-md ring-2 ring-orange-100' : 'border-slate-200 hover:border-slate-300'}`}
                       >
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-black z-10 ${activeSlideIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</div>
                          <div className="absolute inset-0 p-3 flex flex-col scale-[0.35] origin-top-left w-[285%] h-[285%] pointer-events-none select-none">
                             <h1 className="text-4xl font-black mb-4" style={{ color: activeTheme.primaryColor }}>{s.title}</h1>
                             <div className="space-y-2">
                                {(s.content || []).slice(0,2).map((c, idx) => (
                                   <div key={idx} className="h-4 bg-slate-100 rounded w-3/4"></div>
                                ))}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* CENTER: CANVAS */}
              <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-hidden relative">
                 <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-slate-400 hover:text-slate-900 z-10"
                 >
                    <svg className={`w-4 h-4 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </button>

                 <div className="aspect-video w-full max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden relative group transition-all" style={slideStyle}>
                    
                    {/* BACKGROUND IMAGE LAYER */}
                    {(slide.layout === 'cover' || slide.layout === 'full_visual' || slide.layout === 'split_left' || slide.layout === 'split_right') && slide.generatedImageUrl && (
                        <div className={`absolute inset-0 z-0 ${slide.layout === 'split_left' ? 'left-1/2' : slide.layout === 'split_right' ? 'right-1/2' : ''}`}>
                            <img src={slide.generatedImageUrl} alt="AI Generated" className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'bg-black/40' : ''}`}></div>
                        </div>
                    )}

                    {/* CONTENT LAYER */}
                    <div className={`relative z-10 h-full p-20 flex flex-col ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'text-white' : ''}`}>
                       
                       {/* LAYOUT: COVER */}
                       {slide.layout === 'cover' && (
                          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-scale-in">
                             <span className="px-6 py-2 bg-orange-600 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-lg">YENİ GÜN AKADEMİ</span>
                             <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">{slide.title}</h1>
                             <p className="text-3xl font-medium italic opacity-90 max-w-4xl">{slide.subtitle}</p>
                          </div>
                       )}

                       {/* LAYOUT: SPLIT LEFT (Image Right) */}
                       {slide.layout === 'split_left' && (
                          <div className="grid grid-cols-2 gap-16 h-full items-center">
                             <div className="space-y-10 animate-slide-up pr-10">
                                <h2 className="text-6xl font-black uppercase tracking-tight leading-none border-l-8 pl-8" style={{ borderColor: activeTheme.secondaryColor, color: activeTheme.primaryColor }}>{slide.title}</h2>
                                <div className="space-y-6">
                                   {(slide.content || []).map((c, i) => (
                                      <p key={i} className="text-2xl font-medium opacity-90 leading-relaxed flex gap-4">
                                         <span style={{ color: activeTheme.secondaryColor }} className="font-bold">•</span> {c}
                                      </p>
                                   ))}
                                </div>
                             </div>
                             {/* Image is handled by bg layer */}
                          </div>
                       )}

                       {/* LAYOUT: SPLIT RIGHT (Image Left) */}
                       {slide.layout === 'split_right' && (
                          <div className="grid grid-cols-2 gap-16 h-full items-center">
                             {/* Image handled by bg layer */}
                             <div className="col-start-2 space-y-10 animate-slide-up pl-10">
                                <h2 className="text-6xl font-black uppercase tracking-tight leading-none border-l-8 pl-8" style={{ borderColor: activeTheme.secondaryColor, color: activeTheme.primaryColor }}>{slide.title}</h2>
                                <div className="space-y-6">
                                   {(slide.content || []).map((c, i) => (
                                      <p key={i} className="text-2xl font-medium opacity-90 leading-relaxed flex gap-4">
                                         <span style={{ color: activeTheme.secondaryColor }} className="font-bold">•</span> {c}
                                      </p>
                                   ))}
                                </div>
                             </div>
                          </div>
                       )}

                       {/* LAYOUT: DEFAULT BULLET */}
                       {(slide.layout === 'bullet_list' || slide.layout === 'section_header') && (
                          <div className="h-full flex flex-col justify-center space-y-12 pl-12 border-l-2 border-slate-200 animate-fade-in">
                             <h2 className="text-7xl font-black uppercase tracking-tight" style={{ color: activeTheme.primaryColor }}>{slide.title}</h2>
                             <div className="space-y-6">
                                {(slide.content || []).map((c, i) => (
                                   <div key={i} className="flex items-start gap-6">
                                      <div className="w-4 h-4 rounded-full mt-3 shrink-0" style={{ backgroundColor: activeTheme.secondaryColor }}></div>
                                      <p className="text-3xl font-medium opacity-90 leading-relaxed">{c}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}

                       {/* LAYOUT: QUOTE */}
                       {slide.layout === 'quote_center' && (
                          <div className="h-full flex flex-col justify-center items-center text-center p-20">
                             <span className="text-9xl opacity-20 font-serif" style={{ color: activeTheme.secondaryColor }}>“</span>
                             <h2 className="text-5xl font-black italic leading-tight -mt-10 mb-10" style={{ color: activeTheme.primaryColor }}>{slide.content?.[0] || slide.title}</h2>
                             <p className="text-xl font-bold uppercase tracking-widest" style={{ color: activeTheme.secondaryColor }}>— {slide.subtitle || 'Uzman Görüşü'}</p>
                          </div>
                       )}

                    </div>
                 </div>
              </div>

              {/* RIGHT: INSPECTOR PANEL */}
              <div className={`w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20 transition-all duration-300 ${isInspectorOpen ? '' : '-mr-96'}`}>
                 <div className="flex border-b border-slate-100">
                    {['design', 'content', 'ai'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setInspectorTab(t as any)}
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${inspectorTab === t ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                        >
                            {t === 'ai' ? 'AI Sentez' : t === 'design' ? 'Tasarım' : 'İçerik'}
                        </button>
                    ))}
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    
                    {/* --- DESIGN TAB --- */}
                    {inspectorTab === 'design' && (
                        <>
                            <div className="space-y-4">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sahne Düzeni</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['cover', 'split_left', 'split_right', 'bullet_list', 'full_visual', 'quote_center'].map(l => (
                                        <button 
                                            key={l} 
                                            onClick={() => updateSlide('layout', l)}
                                            className={`p-3 rounded-xl text-[9px] font-black uppercase border transition-all ${slide.layout === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400'}`}
                                        >
                                            {l.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Görsel Yönetimi</label>
                                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative group border border-slate-200">
                                    <img src={slide.generatedImageUrl} className="w-full h-full object-cover" />
                                    <button onClick={handleRegenerateImage} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white gap-2">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
                                        <span className="text-[9px] font-black uppercase">Yeniden Üret (AI)</span>
                                    </button>
                                </div>
                                <div>
                                    <label className="text-[8px] font-bold text-slate-400 uppercase mb-1 block">AI Prompt</label>
                                    <textarea 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-orange-500 h-20"
                                        value={slide.imageKeyword}
                                        onChange={e => updateSlide('imageKeyword', e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- CONTENT TAB --- */}
                    {inspectorTab === 'content' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Başlık</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-orange-500"
                                    value={slide.title}
                                    onChange={e => updateSlide('title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Alt Başlık / Alıntı</label>
                                <textarea 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-orange-500 h-20"
                                    value={slide.subtitle}
                                    onChange={e => updateSlide('subtitle', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">İçerik Maddeleri</label>
                                <textarea 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-orange-500 h-40"
                                    value={slide.content?.join('\n')}
                                    onChange={e => updateSlide('content', e.target.value.split('\n'))}
                                    placeholder="Her satır bir madde..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Yönetici Notları</label>
                                <textarea 
                                    className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs font-medium outline-none h-24 text-yellow-900"
                                    value={slide.speakerNotes}
                                    onChange={e => updateSlide('speakerNotes', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- AI TAB --- */}
                    {inspectorTab === 'ai' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
                                <h5 className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Nöral İyileştirme
                                </h5>
                                <p className="text-[10px] text-purple-900/70 mb-4">Bu slaytın içeriğini değiştirmek için bir niyet belirtin (Örn: "Daha samimi yap", "Madde sayısını azalt", "Veli diline çevir").</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 p-2 bg-white border border-purple-200 rounded-lg text-xs outline-none"
                                        placeholder="Niyetiniz..."
                                        value={refineIntent}
                                        onChange={e => setRefineIntent(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleRefineSlide} 
                                        disabled={isRefining}
                                        className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                                    >
                                        {isRefining ? '...' : 'Yap'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Önerilen İyileştirmeler</label>
                                <div className="space-y-2">
                                    {['Daha Akademik Hale Getir', 'Basitleştir (Veli Odaklı)', 'Daha Vurgulu Yap', 'İngilizceye Çevir'].map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => { setRefineIntent(opt); handleRefineSlide(); }}
                                            className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-[10px] font-bold text-slate-600 transition-all"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                 </div>
              </div>
           </div>
        </div>
     );
  }

  // 3. LIVE MODE
  if (mode === 'live') {
     const slide = slides[activeSlideIdx];
     
     const nextSlide = () => setActiveSlideIdx(prev => Math.min(prev + 1, slides.length - 1));
     const prevSlide = () => setActiveSlideIdx(prev => Math.max(prev - 1, 0));

     // Drawing Logic
     const startDraw = (e: React.MouseEvent) => {
         if (!drawingMode || !canvasRef.current) return;
         const ctx = canvasRef.current.getContext('2d');
         if (!ctx) return;
         ctx.beginPath();
         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
         ctx.strokeStyle = '#ef4444';
         ctx.lineWidth = 4;
         ctx.lineCap = 'round';
         const draw = (moveE: MouseEvent) => {
             ctx.lineTo(moveE.offsetX, moveE.offsetY);
             ctx.stroke();
         };
         const stopDraw = () => {
             window.removeEventListener('mousemove', draw);
             window.removeEventListener('mouseup', stopDraw);
         };
         window.addEventListener('mousemove', draw);
         window.addEventListener('mouseup', stopDraw);
     };

     const clearCanvas = () => {
         if(canvasRef.current) {
             const ctx = canvasRef.current.getContext('2d');
             ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
         }
     }

     return (
        <div 
          className={`fixed inset-0 z-[5000] bg-black ${laserPointer ? 'cursor-none' : ''} focus:outline-none`}
          tabIndex={0}
          onMouseMove={(e) => {
              if (laserPointer) setLaserPointer({x: e.clientX, y: e.clientY});
          }}
          autoFocus
        >
           {/* LASER POINTER */}
           {laserPointer && (
              <div 
                className="fixed w-4 h-4 bg-red-600 rounded-full pointer-events-none z-[6000] shadow-[0_0_20px_rgba(255,0,0,0.8)]"
                style={{ left: laserPointer.x - 8, top: laserPointer.y - 8 }}
              />
           )}

           {/* BLACKOUT CURTAIN */}
           {isBlackout && (
              <div className="absolute inset-0 bg-black z-[5500] flex items-center justify-center">
                 <p className="text-white/20 font-black text-xs uppercase tracking-[0.5em]">ODAK MODU</p>
              </div>
           )}

           {/* CANVAS (For Drawing) */}
           {drawingMode && (
               <canvas 
                   ref={canvasRef}
                   width={window.innerWidth}
                   height={window.innerHeight}
                   className="absolute inset-0 z-[5400] cursor-crosshair"
                   onMouseDown={(e: any) => startDraw(e)}
               />
           )}

           {/* CONTROLS HUD */}
           <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[5600] flex gap-2 p-2 bg-black/50 backdrop-blur-md rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
               <button onClick={prevSlide} className="p-3 text-white hover:bg-white/20 rounded-xl"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
               <div className="flex items-center px-4 text-white font-black text-sm">{activeSlideIdx + 1} / {slides.length}</div>
               <button onClick={nextSlide} className="p-3 text-white hover:bg-white/20 rounded-xl"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
               <div className="w-px h-6 bg-white/20 mx-2 self-center"></div>
               <button onClick={() => setLaserPointer(p => p ? null : {x:0,y:0})} className={`p-3 rounded-xl transition-all ${laserPointer ? 'bg-red-600 text-white' : 'text-white hover:bg-white/20'}`} title="Lazer (L)"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></button>
               <button onClick={() => setDrawingMode(p => !p)} className={`p-3 rounded-xl transition-all ${drawingMode ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`} title="Çizim (D)"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
               {drawingMode && <button onClick={clearCanvas} className="p-3 text-white hover:bg-rose-600 rounded-xl"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
               <div className="w-px h-6 bg-white/20 mx-2 self-center"></div>
               <button onClick={() => setShowNotes(!showNotes)} className={`p-3 rounded-xl transition-all ${showNotes ? 'bg-yellow-500 text-white' : 'text-white hover:bg-white/20'}`} title="Notlar (N)"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></button>
               <button onClick={() => setMode('editor')} className="p-3 text-white hover:bg-white/20 rounded-xl" title="Çıkış (Esc)"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
           </div>

           {/* NOTES OVERLAY */}
           {showNotes && (
              <div className="absolute top-8 right-8 w-80 bg-black/80 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-white z-[5600] animate-slide-left">
                 <h5 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-4">YÖNETİCİ NOTLARI</h5>
                 <p className="text-base font-medium leading-relaxed font-sans">{slide.speakerNotes || 'Bu slayt için not bulunmuyor.'}</p>
              </div>
           )}

           {/* SLIDE RENDERER */}
           <div 
             className="w-full h-full relative flex items-center justify-center transition-all duration-500"
             style={{ 
                fontFamily: activeTheme.fontFamily,
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.textColor
             }}
           >
              {/* Bg Image if exists */}
              {(slide.layout === 'cover' || slide.layout === 'full_visual' || slide.layout === 'split_left' || slide.layout === 'split_right') && slide.generatedImageUrl && (
                  <div className={`absolute inset-0 z-0 ${slide.layout === 'split_left' ? 'left-[50%]' : slide.layout === 'split_right' ? 'right-[50%]' : ''}`}>
                      <img src={slide.generatedImageUrl} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'bg-black/50' : ''}`}></div>
                  </div>
              )}

              <div className={`w-full max-w-[90%] p-20 flex flex-col justify-center relative z-10 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'text-white' : ''}`}>
                 {slide.layout === 'cover' ? (
                    <div className="text-center space-y-12">
                       <h1 className="text-9xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{slide.title}</h1>
                       <p className="text-4xl font-bold italic opacity-90">{slide.subtitle}</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-12 gap-20 items-center">
                       <div className={`col-span-8 space-y-12 ${slide.layout === 'split_right' ? 'col-start-5' : ''}`}>
                          <h2 className="text-7xl font-black uppercase tracking-tight leading-none border-l-[16px] pl-10" style={{ borderColor: activeTheme.secondaryColor }}>{slide.title}</h2>
                          <div className="space-y-8 pl-14">
                             {(slide.content || []).map((c, i) => (
                                <p key={i} className="text-4xl font-bold opacity-90 leading-snug flex items-start gap-6">
                                   <span className="mt-2" style={{ color: activeTheme.secondaryColor }}>▪</span> {c}
                                </p>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
     );
  }

  return null;
};

export default PresentationStudio;
