
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PresentationConfig, TrainingSlide, VisualStyle, SlideLayout, PresentationTheme } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PptxGenJS from 'pptxgenjs';

interface PresentationStudioProps {
  initialConfig?: PresentationConfig;
  onClose?: () => void;
}

// ULTRA-PRO THEME DEFINITIONS
const THEMES: Record<VisualStyle, PresentationTheme> = {
  corporate: { id: 'corp', name: 'Kurumsal', fontFamily: 'Plus Jakarta Sans', primaryColor: '#0f172a', secondaryColor: '#ea580c', backgroundColor: '#ffffff', textColor: '#1e293b', accentColor: '#cbd5e1' },
  dark_mode: { id: 'dark', name: 'Sinematik', fontFamily: 'Inter', primaryColor: '#ffffff', secondaryColor: '#f59e0b', backgroundColor: '#0f172a', textColor: '#f8fafc', accentColor: '#334155' },
  playful: { id: 'play', name: 'Canlı', fontFamily: 'Plus Jakarta Sans', primaryColor: '#4f46e5', secondaryColor: '#ec4899', backgroundColor: '#fff1f2', textColor: '#3730a3', accentColor: '#fbcfe8' },
  minimalist: { id: 'min', name: 'Minimal', fontFamily: 'Inter', primaryColor: '#18181b', secondaryColor: '#71717a', backgroundColor: '#fafafa', textColor: '#27272a', accentColor: '#e4e4e7' },
  academic: { id: 'acad', name: 'Akademik', fontFamily: 'Inter', primaryColor: '#1e3a8a', secondaryColor: '#1d4ed8', backgroundColor: '#f0f9ff', textColor: '#172554', accentColor: '#dbeafe' },
  warm_serenity: { id: 'warm', name: 'Sıcak', fontFamily: 'Plus Jakarta Sans', primaryColor: '#78350f', secondaryColor: '#d97706', backgroundColor: '#fffbeb', textColor: '#451a03', accentColor: '#fde68a' },
  neuro_divergent: { id: 'neuro', name: 'Nöro-Dostu', fontFamily: 'Inter', primaryColor: '#000000', secondaryColor: '#005f73', backgroundColor: '#e9edc9', textColor: '#000000', accentColor: '#ccd5ae' }
};

// AI IMAGE GENERATOR PROTOCOL
const generateImageUrl = (prompt: string) => {
  const encodedPrompt = encodeURIComponent(`${prompt}, academic educational style, clear, high detail, 4k`);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
};

const PresentationStudio: React.FC<PresentationStudioProps> = ({ initialConfig, onClose }) => {
  // --- CORE STATE ---
  const [mode, setMode] = useState<'config' | 'editor' | 'live'>('config');
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [activeTheme, setActiveTheme] = useState<PresentationTheme>(THEMES.corporate);
  
  // UI Panels
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<'design' | 'content' | 'ai'>('design');
  
  // AI Engine States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [refineIntent, setRefineIntent] = useState('');

  // Live Stage Tools
  const [laserPointer, setLaserPointer] = useState<{x:number, y:number} | null>(null);
  const [isBlackout, setIsBlackout] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Keyboard Stage Control
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
    setLoadingMsg("Bilişsel Mimari Tasarlanıyor...");
    
    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      const slidesWithImages = generatedSlides.map(s => ({
          ...s,
          generatedImageUrl: generateImageUrl(s.imageKeyword || config.topic)
      }));
      setSlides(slidesWithImages);
      setMode('editor');
      setActiveSlideIdx(0);
    } catch (e) {
      alert("Nöral Motor Hatası.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefineSlide = async (intent?: string) => {
      const activeIntent = intent || refineIntent;
      if (!activeIntent) return;
      setIsRefining(true);
      try {
          const refinedSlide = await armsService.refineSlideContent(slides[activeSlideIdx], activeIntent);
          const newSlides = [...slides];
          newSlides[activeSlideIdx] = { ...refinedSlide, generatedImageUrl: slides[activeSlideIdx].generatedImageUrl };
          setSlides(newSlides);
          setRefineIntent('');
      } catch (e) {
          alert("Sentez Hatası.");
      } finally {
          setIsRefining(false);
      }
  };

  const handleRegenerateImage = () => {
      const slide = slides[activeSlideIdx];
      const newUrl = generateImageUrl(`${slide.imageKeyword} ${Math.random()}`);
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
        s.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: activeTheme.primaryColor.replace('#', '') });
        if (slide.content) s.addText(slide.content.join('\n'), { x: 0.5, y: 1.5, w: '90%', fontSize: 14, bullet: true, color: activeTheme.textColor.replace('#', '') });
    });
    pptx.writeFile({ fileName: `YG_Egitim_${config.topic.replace(/\s/g, '_')}.pptx` });
  };

  // --- DRAWING ENGINE ---
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

  // --- VIEWS ---

  if (mode === 'config') {
    return (
      <div className="fixed inset-0 z-[3000] bg-slate-50 flex items-center justify-center p-8 animate-fade-in">
         <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[4rem] shadow-2xl border border-slate-200 flex overflow-hidden relative">
            <div className="w-2/5 bg-slate-900 p-16 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-4xl font-black mb-10 shadow-2xl rotate-3">YG</div>
                  <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.85]">Cognitive<br/>Canvas<br/>Studio</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.5em] mt-8 border-l-4 border-orange-600 pl-6">v4.0 Ultra Pro Edition</p>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]"></div>
               <div className="relative z-10 bg-white/5 p-8 rounded-3xl backdrop-blur-xl border border-white/10">
                  <p className="text-sm font-medium text-slate-300 italic leading-relaxed">"Gemini 3 Flash motoru ve Pollinations Nöral Görüntü İşleyicisi ile akademik derinliği görsel mükemmeliyetle birleştirin."</p>
               </div>
            </div>

            <div className="flex-1 p-20 flex flex-col justify-center bg-slate-50/30">
               <button onClick={onClose} className="absolute top-10 right-10 p-4 hover:bg-slate-200 rounded-full transition-all text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>

               <div className="max-w-xl mx-auto w-full space-y-12">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">EĞİTİM ODAĞI / KONU</label>
                     <input 
                       type="text" 
                       className="w-full p-8 bg-white rounded-[2.5rem] text-3xl font-black text-slate-900 border-4 border-transparent focus:border-orange-500 outline-none transition-all placeholder:text-slate-200 shadow-xl"
                       placeholder="Örn: Otizmde Kriz Yönetimi..."
                       value={config.topic}
                       onChange={e => setConfig({...config, topic: e.target.value})}
                       autoFocus
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">HEDEF KİTLE</label>
                        <select className="w-full p-6 bg-white rounded-2xl font-bold text-sm outline-none shadow-md border-2 border-transparent focus:border-slate-300 appearance-none" value={config.targetAudience} onChange={e => setConfig({...config, targetAudience: e.target.value as any})}>
                           <option value="team">Akademik Kadro</option>
                           <option value="parents">Veli Grubu</option>
                           <option value="management">Yönetim</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">GÖRSEL KİMLİK</label>
                        <select className="w-full p-6 bg-white rounded-2xl font-bold text-sm outline-none shadow-md border-2 border-transparent focus:border-slate-300 appearance-none" value={config.visualStyle} onChange={e => setConfig({...config, visualStyle: e.target.value as any})}>
                           {Object.entries(THEMES).map(([k, t]) => <option key={k} value={k}>{t.name}</option>)}
                        </select>
                     </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 relative overflow-hidden"
                  >
                     {isGenerating ? (
                        <span className="flex items-center justify-center gap-4 animate-pulse">
                           <span className="w-3 h-3 bg-white rounded-full"></span>
                           {loadingMsg}
                        </span>
                     ) : 'SENTEZİ BAŞLAT'}
                  </button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (mode === 'editor') {
     const slide = slides[activeSlideIdx];
     return (
        <div className="fixed inset-0 z-[3000] bg-[#f8fafc] flex flex-col overflow-hidden animate-fade-in font-sans">
           <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-6">
                 <button onClick={() => setMode('config')} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
                 <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">{config.topic}</h3>
                 <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[9px] font-black uppercase">{activeTheme.name}</span>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={handleExportPPTX} className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">PPTX İNDİR</button>
                 <button onClick={() => setMode('live')} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> CANLI SAHNE
                 </button>
                 <button onClick={() => setIsInspectorOpen(!isInspectorOpen)} className={`p-2.5 rounded-xl transition-all ${isInspectorOpen ? 'bg-slate-100' : 'text-slate-300'}`}><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
              </div>
           </div>

           <div className="flex-1 flex overflow-hidden">
              <div className={`w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-500 ${isSidebarOpen ? '' : '-ml-72'}`}>
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLAYTLAR ({slides.length})</span>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 bg-slate-50/30">
                    {slides.map((s, i) => (
                       <div key={s.id} onClick={() => setActiveSlideIdx(i)} className={`group relative aspect-video bg-white rounded-2xl border-4 cursor-pointer transition-all overflow-hidden ${activeSlideIdx === i ? 'border-orange-500 shadow-2xl ring-4 ring-orange-100 scale-105' : 'border-white hover:border-slate-200 opacity-60 hover:opacity-100'}`}>
                          <div className={`absolute top-2 left-2 px-3 py-1 rounded-lg text-[10px] font-black z-10 ${activeSlideIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</div>
                          <div className="absolute inset-0 p-3 flex flex-col scale-[0.35] origin-top-left w-[285%] h-[285%] pointer-events-none select-none">
                             <h1 className="text-5xl font-black mb-4" style={{ color: activeTheme.primaryColor }}>{s.title}</h1>
                             <div className="space-y-4">
                                {(s.content || []).slice(0,2).map((c, idx) => <div key={idx} className="h-6 bg-slate-100 rounded-xl w-3/4"></div>)}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex-1 bg-slate-100 flex items-center justify-center p-12 overflow-hidden relative">
                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-2xl text-slate-400 hover:text-slate-900 z-10 transition-all"><svg className={`w-6 h-6 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>

                 <div className="aspect-video w-full max-w-6xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden relative group transition-all duration-700" style={{ fontFamily: activeTheme.fontFamily, backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}>
                    {slide.generatedImageUrl && (slide.layout === 'cover' || slide.layout === 'full_visual' || slide.layout.includes('split')) && (
                        <div className={`absolute inset-0 z-0 ${slide.layout === 'split_left' ? 'left-1/2' : slide.layout === 'split_right' ? 'right-1/2' : ''}`}>
                            <img src={slide.generatedImageUrl} className="w-full h-full object-cover animate-fade-in" key={slide.generatedImageUrl} />
                            <div className={`absolute inset-0 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'bg-black/40 backdrop-blur-[2px]' : ''}`}></div>
                        </div>
                    )}
                    <div className={`relative z-10 h-full p-24 flex flex-col ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'text-white' : ''}`}>
                       {slide.layout === 'cover' && (
                          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12 animate-scale-in">
                             <span className="px-10 py-3 bg-orange-600 text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full shadow-2xl">YENİ GÜN AKADEMİ</span>
                             <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">{slide.title}</h1>
                             <p className="text-3xl font-medium italic opacity-90 max-w-4xl border-t border-white/20 pt-8">{slide.subtitle}</p>
                          </div>
                       )}
                       {slide.layout === 'split_left' && (
                          <div className="grid grid-cols-2 gap-20 h-full items-center">
                             <div className="space-y-12 animate-slide-up pr-12">
                                <h2 className="text-7xl font-black uppercase tracking-tight leading-[0.9] border-l-[20px] pl-10" style={{ borderColor: activeTheme.secondaryColor, color: activeTheme.primaryColor }}>{slide.title}</h2>
                                <div className="space-y-8">
                                   {(slide.content || []).map((c, i) => (
                                      <p key={i} className="text-3xl font-medium opacity-90 leading-relaxed flex gap-6"><span style={{ color: activeTheme.secondaryColor }} className="font-bold">•</span> {c}</p>
                                   ))}
                                </div>
                             </div>
                          </div>
                       )}
                       {(slide.layout === 'bullet_list' || slide.layout === 'section_header') && (
                          <div className="h-full flex flex-col justify-center space-y-16 pl-16 border-l-[16px] border-slate-200 animate-fade-in">
                             <h2 className="text-8xl font-black uppercase tracking-tighter" style={{ color: activeTheme.primaryColor }}>{slide.title}</h2>
                             <div className="space-y-10">
                                {(slide.content || []).map((c, i) => (
                                   <div key={i} className="flex items-start gap-8">
                                      <div className="w-6 h-6 rounded-full mt-4 shrink-0 shadow-lg" style={{ backgroundColor: activeTheme.secondaryColor }}></div>
                                      <p className="text-4xl font-medium opacity-90 leading-snug">{c}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className={`w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 transition-all duration-500 ${isInspectorOpen ? '' : '-mr-96'}`}>
                 <div className="flex border-b border-slate-100">
                    {['design', 'content', 'ai'].map(t => (
                        <button key={t} onClick={() => setInspectorTab(t as any)} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all ${inspectorTab === t ? 'border-orange-600 text-orange-600 bg-orange-50/30' : 'border-transparent text-slate-400 hover:text-slate-900'}`}>{t === 'ai' ? 'Nöral Sentez' : t === 'design' ? 'Dizayn' : 'İçerik'}</button>
                    ))}
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                    {inspectorTab === 'design' && (
                        <>
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SAHNE DÜZENİ</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['cover', 'split_left', 'split_right', 'bullet_list', 'full_visual', 'quote_center'].map(l => (
                                        <button key={l} onClick={() => updateSlide('layout', l)} className={`p-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${slide.layout === l ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-400'}`}>{l.replace('_', ' ')}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NÖRAL GÖRSEL</label>
                                <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden relative group border-4 border-slate-200 shadow-inner">
                                    <img src={slide.generatedImageUrl} className="w-full h-full object-cover" />
                                    <button onClick={handleRegenerateImage} className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white gap-4 backdrop-blur-sm">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
                                        <span className="text-[10px] font-black uppercase tracking-widest">YENİDEN ÜRET</span>
                                    </button>
                                </div>
                                <textarea className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:border-orange-500 h-24 shadow-inner" value={slide.imageKeyword} onChange={e => updateSlide('imageKeyword', e.target.value)} />
                            </div>
                        </>
                    )}
                    {inspectorTab === 'ai' && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="p-6 bg-indigo-50 rounded-[2rem] border-2 border-indigo-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                                    <h5 className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Nöral Dönüşüm</h5>
                                </div>
                                <p className="text-[11px] font-bold text-indigo-900/60 leading-relaxed mb-6 uppercase tracking-tight">Slayt içeriğini Gemini 3 üzerinden hedef kitleye göre yeniden optimize edin.</p>
                                <div className="space-y-2">
                                    {['Daha Akademik Sentezle', 'Veli Dilinde Basitleştir', 'Maddeleri Çarpıcı Hale Getir', 'Psikolojik Derinlik Ekle'].map(opt => (
                                        <button key={opt} onClick={() => handleRefineSlide(opt)} disabled={isRefining} className="w-full text-left p-4 bg-white border-2 border-indigo-200 rounded-xl text-[10px] font-black text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-widest">{opt}</button>
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

  if (mode === 'live') {
     const slide = slides[activeSlideIdx];
     return (
        <div className={`fixed inset-0 z-[5000] bg-black ${laserPointer ? 'cursor-none' : ''} focus:outline-none`} tabIndex={0} onMouseMove={(e) => laserPointer && setLaserPointer({x: e.clientX, y: e.clientY})} autoFocus>
           {laserPointer && <div className="fixed w-6 h-6 bg-red-600 rounded-full pointer-events-none z-[6000] shadow-[0_0_30px_rgba(255,0,0,0.9)] opacity-80" style={{ left: laserPointer.x - 12, top: laserPointer.y - 12 }} />}
           {isBlackout && <div className="absolute inset-0 bg-black z-[5500] flex items-center justify-center"><p className="text-white/10 font-black text-xs uppercase tracking-[1em]">GİZLİLİK MODU</p></div>}
           {drawingMode && <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="absolute inset-0 z-[5400] cursor-crosshair" onMouseDown={(e: any) => startDraw(e)} />}

           <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[5600] flex gap-3 p-3 bg-black/60 backdrop-blur-3xl rounded-[2.5rem] opacity-0 hover:opacity-100 transition-opacity border border-white/10 shadow-3xl">
               <button onClick={() => setActiveSlideIdx(prev => Math.max(prev - 1, 0))} className="p-4 text-white hover:bg-white/20 rounded-2xl transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
               <div className="flex items-center px-6 text-white font-black text-sm tracking-widest">{activeSlideIdx + 1} / {slides.length}</div>
               <button onClick={() => setActiveSlideIdx(prev => Math.min(prev + 1, slides.length - 1))} className="p-4 text-white hover:bg-white/20 rounded-2xl transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
               <div className="w-px h-8 bg-white/20 mx-3 self-center"></div>
               <button onClick={() => setLaserPointer(p => p ? null : {x:0,y:0})} className={`p-4 rounded-2xl transition-all ${laserPointer ? 'bg-red-600 text-white' : 'text-white hover:bg-white/20'}`} title="Lazer (L)"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></button>
               <button onClick={() => setDrawingMode(p => !p)} className={`p-4 rounded-2xl transition-all ${drawingMode ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`} title="Çizim (D)"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
               <button onClick={() => setShowNotes(!showNotes)} className={`p-4 rounded-2xl transition-all ${showNotes ? 'bg-orange-500 text-white' : 'text-white hover:bg-white/20'}`} title="Notlar (N)"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></button>
               <button onClick={() => setMode('editor')} className="p-4 text-white hover:bg-rose-600 rounded-2xl transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
           </div>

           {showNotes && (
              <div className="absolute top-10 right-10 w-96 bg-black/80 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] text-white z-[5600] animate-slide-left shadow-3xl">
                 <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">YÖNETİCİ NOTLARI</h5>
                 <p className="text-xl font-medium leading-relaxed italic opacity-90">{slide.speakerNotes || 'Bu slayt için özel not bulunmuyor.'}</p>
              </div>
           )}

           <div className="w-full h-full relative flex items-center justify-center transition-all duration-1000" style={{ fontFamily: activeTheme.fontFamily, backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}>
              {slide.generatedImageUrl && (slide.layout === 'cover' || slide.layout === 'full_visual' || slide.layout.includes('split')) && (
                  <div className={`absolute inset-0 z-0 ${slide.layout === 'split_left' ? 'left-[50%]' : slide.layout === 'split_right' ? 'right-[50%]' : ''}`}>
                      <img src={slide.generatedImageUrl} className="w-full h-full object-cover animate-fade-in" />
                      <div className={`absolute inset-0 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'bg-black/50' : ''}`}></div>
                  </div>
              )}
              <div className={`w-full max-w-[90%] p-24 flex flex-col justify-center relative z-10 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'text-white' : ''} animate-fade-in`}>
                 {slide.layout === 'cover' ? (
                    <div className="text-center space-y-16">
                       <h1 className="text-9xl font-black uppercase tracking-tighter leading-none drop-shadow-3xl">{slide.title}</h1>
                       <p className="text-4xl font-bold italic opacity-90 border-t border-white/20 pt-10">{slide.subtitle}</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-12 gap-24 items-center">
                       <div className={`col-span-8 space-y-16 ${slide.layout === 'split_right' ? 'col-start-5' : ''}`}>
                          <h2 className="text-8xl font-black uppercase tracking-tight leading-none border-l-[30px] pl-16 animate-slide-right" style={{ borderColor: activeTheme.secondaryColor }}>{slide.title}</h2>
                          <div className="space-y-10 pl-24">
                             {(slide.content || []).map((c, i) => (
                                <p key={i} className="text-5xl font-bold opacity-90 leading-snug flex items-start gap-8 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                                   <span className="mt-4" style={{ color: activeTheme.secondaryColor }}>▪</span> {c}
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
