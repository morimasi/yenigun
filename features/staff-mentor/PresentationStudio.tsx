
import React, { useState, useEffect, useRef } from 'react';
import { PresentationConfig, TrainingSlide, VisualStyle, SlideLayout } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PptxGenJS from 'pptxgenjs';

interface PresentationStudioProps {
  initialConfig?: PresentationConfig; // Opsiyonel başlangıç ayarları (Müfredattan gelirse)
  onClose?: () => void;
}

// GÖRSEL MOTORU: Unsplash Source API (Yüksek Kalite & Semantik)
const getVisualUrl = (keyword: string, style: VisualStyle) => {
  const cleanKeyword = keyword?.split(' ')[0] || 'abstract';
  const mood = style === 'dark_mode' ? 'dark,moody' : style === 'playful' ? 'colorful,fun' : 'minimal,clean';
  // Cache busting için random ekle
  return `https://source.unsplash.com/1600x900/?${cleanKeyword},${mood}&sig=${Math.random()}`;
};

const PresentationStudio: React.FC<PresentationStudioProps> = ({ initialConfig, onClose }) => {
  // STATE MACHINE
  const [mode, setMode] = useState<'config' | 'editor' | 'live'>('config');
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  
  // PROCESS STATES
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  // CONFIGURATION
  const [config, setConfig] = useState<PresentationConfig>(initialConfig || {
    topic: '',
    targetAudience: 'team',
    tone: 'academic',
    depth: 'intermediate',
    slideCount: 8,
    visualStyle: 'corporate',
    includeAnimations: true
  });

  // LIVE PLAYER STATES
  const [showNotes, setShowNotes] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [laserPointer, setLaserPointer] = useState<{x:number, y:number} | null>(null);

  // --- GLOBAL KEYBOARD LISTENER (MOVED TO TOP LEVEL) ---
  useEffect(() => {
    if (mode !== 'live') return;

    const handleKeyDown = (e: KeyboardEvent) => {
        // Navigation
        if (e.key === 'ArrowRight' || e.key === ' ') {
            setActiveSlideIdx(prev => Math.min(prev + 1, slides.length - 1));
        }
        if (e.key === 'ArrowLeft') {
            setActiveSlideIdx(prev => Math.max(0, prev - 1));
        }
        
        // Tools
        if (e.key === 'l') {
            setLaserPointer(prev => prev ? null : {x: window.innerWidth/2, y: window.innerHeight/2});
        }
        if (e.key === 'b') {
            setIsBlackout(prev => !prev);
        }
        if (e.key === 'n') {
            setShowNotes(prev => !prev);
        }
        
        // Exit
        if (e.key === 'Escape') {
            setMode('editor');
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, slides.length]); // Dependencies ensure fresh state access

  // --- ACTIONS ---

  const handleGenerate = async () => {
    if (!config.topic) return alert("Konu başlığı zorunludur.");
    
    setIsGenerating(true);
    setLoadingMsg("Nöral Ağ Bağlanıyor...");
    
    const steps = ["Pedagojik Kurgu Tasarlanıyor...", "Görsel Semantik Analiz Ediliyor...", "Sahne Düzeni Oluşturuluyor...", "Final Render Alınıyor..."];
    let stepIdx = 0;
    const interval = setInterval(() => {
        setLoadingMsg(steps[stepIdx % steps.length]);
        stepIdx++;
    }, 1500);

    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      setSlides(generatedSlides);
      setMode('editor');
      setActiveSlideIdx(0);
    } catch (e) {
      alert("AI Servis Hatası: Lütfen tekrar deneyiniz.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handleExportPPTX = () => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = config.topic;
    
    slides.forEach((slide) => {
        const s = pptx.addSlide();
        const color = config.visualStyle === 'dark_mode' ? 'FFFFFF' : '000000';
        const bg = config.visualStyle === 'dark_mode' ? '1e293b' : 'ffffff';
        
        s.background = { color: bg };
        s.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 24, color: color, bold: true });
        
        if (slide.content) {
            s.addText(slide.content.join('\n'), { x: 0.5, y: 1.5, w: '90%', fontSize: 14, color: '64748b', bullet: true });
        }
        
        if (slide.speakerNotes) s.addNotes(slide.speakerNotes);
    });
    
    pptx.writeFile({ fileName: `YG_Akademi_${config.topic.replace(/\s/g, '_')}.pptx` });
  };

  const updateSlide = (field: keyof TrainingSlide, value: any) => {
      const newSlides = [...slides];
      newSlides[activeSlideIdx] = { ...newSlides[activeSlideIdx], [field]: value };
      setSlides(newSlides);
  };

  // --- RENDERERS ---

  // 1. CONFIG PANEL (GİRİŞ)
  if (mode === 'config') {
    return (
      <div className="fixed inset-0 z-[3000] bg-slate-50 flex items-center justify-center p-8 animate-fade-in">
         <div className="bg-white w-full max-w-5xl h-[80vh] rounded-[3rem] shadow-2xl border border-slate-200 flex overflow-hidden relative">
            {/* SOL: BRANDING */}
            <div className="w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black mb-6">S</div>
                  <h2 className="text-4xl font-black uppercase tracking-tight leading-none">Nöral<br/>Sunum<br/>Stüdyosu</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">v3.0 Director's Cut</p>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                     <p className="text-xs font-medium text-slate-300 italic">"Gemini 3 Flash motoru ile saniyeler içinde akademik kalitede, görsel olarak zenginleştirilmiş eğitim materyalleri üretin."</p>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px]"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
            </div>

            {/* SAĞ: FORM */}
            <div className="flex-1 p-16 flex flex-col justify-center relative">
               <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>

               <div className="space-y-8 max-w-lg mx-auto w-full">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Eğitim Konusu</label>
                     <input 
                       type="text" 
                       className="w-full p-5 bg-slate-50 rounded-2xl text-xl font-black text-slate-900 border-2 border-transparent focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                       placeholder="Örn: Kriz Yönetimi..."
                       value={config.topic}
                       onChange={e => setConfig({...config, topic: e.target.value})}
                       autoFocus
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Kitle</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-200" value={config.targetAudience} onChange={e => setConfig({...config, targetAudience: e.target.value as any})}>
                           <option value="team">Akademik Kadro</option>
                           <option value="parents">Veli Grubu</option>
                           <option value="management">Yönetim Kurulu</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Görsel Stil</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-slate-200" value={config.visualStyle} onChange={e => setConfig({...config, visualStyle: e.target.value as any})}>
                           <option value="corporate">Kurumsal (Mavi/Gri)</option>
                           <option value="dark_mode">Dark Mode (Sinematik)</option>
                           <option value="playful">Renkli & Canlı</option>
                           <option value="minimalist">Minimalist (Beyaz)</option>
                        </select>
                     </div>
                  </div>

                  <div className="pt-4">
                     <button 
                       onClick={handleGenerate}
                       disabled={isGenerating}
                       className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 relative overflow-hidden"
                     >
                        {isGenerating ? (
                           <span className="flex items-center justify-center gap-3 animate-pulse">
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                              {loadingMsg}
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

  // 2. EDITOR MODE
  if (mode === 'editor') {
     const slide = slides[activeSlideIdx];
     
     return (
        <div className="fixed inset-0 z-[3000] bg-slate-100 flex flex-col overflow-hidden animate-fade-in">
           
           {/* TOP BAR */}
           <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
              <div className="flex items-center gap-4">
                 <button onClick={() => setMode('config')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
                 <div className="h-6 w-px bg-slate-200"></div>
                 <h3 className="font-black text-sm uppercase tracking-tight">{config.topic}</h3>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={handleExportPPTX} className="px-5 py-2 border border-slate-200 rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition-all text-slate-600">PPTX İndir</button>
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
                       <div 
                         key={s.id}
                         onClick={() => setActiveSlideIdx(i)}
                         className={`group relative aspect-video bg-white rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${activeSlideIdx === i ? 'border-orange-500 shadow-lg ring-2 ring-orange-100' : 'border-slate-200 hover:border-slate-300'}`}
                       >
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-black z-10 ${activeSlideIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</div>
                          <div className="absolute inset-0 p-3 flex flex-col scale-[0.4] origin-top-left w-[250%] h-[250%] pointer-events-none">
                             <h1 className="text-3xl font-black text-slate-900 mb-2">{s.title}</h1>
                             <div className="h-2 bg-slate-100 w-1/2 rounded"></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* CENTER: CANVAS */}
              <div className="flex-1 bg-slate-200/50 flex items-center justify-center p-12 overflow-hidden relative">
                 <div className="aspect-video w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden relative group">
                    
                    {/* BACKGROUND LAYER */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                      style={{ 
                         backgroundImage: config.visualStyle !== 'minimalist' ? `url(${getVisualUrl(slide.imageKeyword || 'abstract', config.visualStyle)})` : 'none',
                         filter: config.visualStyle === 'dark_mode' ? 'brightness(0.3)' : 'brightness(0.9) contrast(0.95)'
                      }}
                    ></div>

                    {/* CONTENT LAYER */}
                    <div className={`relative z-10 h-full p-20 flex flex-col ${config.visualStyle === 'dark_mode' ? 'text-white' : 'text-slate-900'}`}>
                       
                       {/* LAYOUT: COVER */}
                       {slide.layout === 'cover' && (
                          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-scale-in">
                             <span className="px-6 py-2 bg-orange-600 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-lg">YENİ GÜN AKADEMİ</span>
                             <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">{slide.title}</h1>
                             <p className="text-3xl font-medium italic opacity-80 max-w-4xl">{slide.subtitle}</p>
                          </div>
                       )}

                       {/* LAYOUT: SPLIT LEFT */}
                       {slide.layout === 'split_left' && (
                          <div className="grid grid-cols-2 gap-16 h-full items-center">
                             <div className="space-y-10 animate-slide-up">
                                <h2 className="text-6xl font-black uppercase tracking-tight leading-none border-l-8 border-orange-600 pl-8">{slide.title}</h2>
                                <div className="space-y-6">
                                   {(slide.content || []).map((c, i) => (
                                      <p key={i} className="text-2xl font-medium opacity-90 leading-relaxed flex gap-4">
                                         <span className="text-orange-500 font-bold">•</span> {c}
                                      </p>
                                   ))}
                                </div>
                             </div>
                             <div className="h-full bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/20 flex items-center justify-center relative overflow-hidden shadow-2xl">
                                <img src={getVisualUrl(slide.imageKeyword || 'abstract', config.visualStyle)} className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-10">
                                   <p className="text-white text-sm font-bold italic">"{slide.visualPrompt}"</p>
                                </div>
                             </div>
                          </div>
                       )}

                       {/* LAYOUT: DEFAULT */}
                       {(slide.layout === 'bullet_list' || slide.layout === 'section_header') && (
                          <div className="h-full flex flex-col justify-center space-y-12 pl-12 border-l-2 border-white/10 animate-fade-in">
                             <h2 className="text-7xl font-black uppercase tracking-tight">{slide.title}</h2>
                             <div className="space-y-6">
                                {(slide.content || []).map((c, i) => (
                                   <div key={i} className="flex items-start gap-6">
                                      <div className="w-4 h-4 bg-orange-600 rounded-full mt-2.5 shrink-0"></div>
                                      <p className="text-3xl font-medium opacity-90 leading-relaxed">{c}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}

                    </div>
                 </div>
              </div>

              {/* RIGHT: PROPERTY PANEL */}
              <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar shadow-xl z-20">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLAYT AYARLARI</h4>
                 
                 <div className="space-y-3">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Yerleşim</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['cover', 'split_left', 'bullet_list', 'full_visual'].map(l => (
                          <button 
                            key={l} 
                            onClick={() => updateSlide('layout', l)}
                            className={`p-2 rounded-lg text-[9px] font-black uppercase border ${slide.layout === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}
                          >
                             {l.replace('_', ' ')}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Görsel Anahtarı</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-200 outline-none focus:border-orange-500"
                         value={slide.imageKeyword}
                         onChange={e => updateSlide('imageKeyword', e.target.value)}
                       />
                       <button className="absolute right-2 top-2 p-1 bg-white rounded shadow-sm hover:text-orange-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg></button>
                    </div>
                    <div className="aspect-video rounded-xl overflow-hidden relative group cursor-pointer">
                       <img src={getVisualUrl(slide.imageKeyword || 'abstract', config.visualStyle)} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[9px] font-black uppercase">YENİLE</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Notlar</label>
                    <textarea 
                       className="w-full p-4 bg-yellow-50 text-yellow-900 rounded-xl text-xs border border-yellow-100 outline-none min-h-[150px] font-medium"
                       value={slide.speakerNotes}
                       onChange={e => updateSlide('speakerNotes', e.target.value)}
                       placeholder="Konuşmacı notları..."
                    />
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // 3. LIVE MODE
  if (mode === 'live') {
     const slide = slides[activeSlideIdx];
     
     return (
        <div 
          className={`fixed inset-0 z-[5000] bg-black cursor-none ${laserPointer ? 'cursor-crosshair' : ''}`}
          tabIndex={0}
          onMouseMove={(e) => laserPointer && setLaserPointer({x: e.clientX, y: e.clientY})}
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
                 <p className="text-white/20 font-black text-xs uppercase tracking-[0.5em]">GİZLİLİK MODU</p>
              </div>
           )}

           {/* CANVAS (CLEAN) */}
           <div 
             className="w-full h-full relative flex items-center justify-center"
             style={{ 
                backgroundImage: config.visualStyle !== 'minimalist' ? `url(${getVisualUrl(slide.imageKeyword || 'abstract', config.visualStyle)})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: config.visualStyle === 'dark_mode' ? 'brightness(0.5)' : 'brightness(0.95)'
             }}
           >
              <div className={`w-full max-w-[90%] p-20 flex flex-col justify-center relative z-10 ${config.visualStyle === 'dark_mode' ? 'text-white' : 'text-slate-900'} animate-fade-in`}>
                 {slide.layout === 'cover' ? (
                    <div className="text-center space-y-12">
                       <h1 className="text-9xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{slide.title}</h1>
                       <p className="text-4xl font-bold italic opacity-90">{slide.subtitle}</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-12 gap-20 items-center">
                       <div className="col-span-8 space-y-12">
                          <h2 className="text-7xl font-black uppercase tracking-tight leading-none border-l-[16px] border-orange-600 pl-10">{slide.title}</h2>
                          <div className="space-y-8 pl-14">
                             {(slide.content || []).map((c, i) => (
                                <p key={i} className="text-4xl font-bold opacity-90 leading-snug flex items-start gap-6">
                                   <span className="text-orange-600 mt-2">▪</span> {c}
                                </p>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* NOTES HUD */}
           {showNotes && (
              <div className="absolute top-10 right-10 w-96 bg-black/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-white z-[5600] animate-slide-left">
                 <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">YÖNETİCİ NOTLARI</h5>
                 <p className="text-xl font-medium leading-relaxed">{slide.speakerNotes || 'Not bulunmuyor.'}</p>
              </div>
           )}

           {/* PROGRESS LINE */}
           <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full z-[5600]">
              <div className="h-full bg-orange-600 transition-all duration-500" style={{ width: `${((activeSlideIdx + 1) / slides.length) * 100}%` }}></div>
           </div>
        </div>
     );
  }

  return null;
};

export default PresentationStudio;
