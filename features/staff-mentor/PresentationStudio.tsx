
import React, { useState, useEffect, useRef } from 'react';
import { PresentationConfig, TrainingSlide, VisualStyle, PresentationTheme } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PptxGenJS from 'pptxgenjs';

interface PresentationStudioProps {
  initialConfig?: PresentationConfig;
  onClose?: () => void;
}

const THEMES: Record<VisualStyle, PresentationTheme> = {
  corporate: { id: 'corp', name: 'Kurumsal', fontFamily: 'Plus Jakarta Sans', primaryColor: '#0f172a', secondaryColor: '#ea580c', backgroundColor: '#ffffff', textColor: '#1e293b', accentColor: '#cbd5e1' },
  dark_mode: { id: 'dark', name: 'Sinematik', fontFamily: 'Inter', primaryColor: '#ffffff', secondaryColor: '#f59e0b', backgroundColor: '#0f172a', textColor: '#f8fafc', accentColor: '#334155' },
  playful: { id: 'play', name: 'Canlı', fontFamily: 'Plus Jakarta Sans', primaryColor: '#4f46e5', secondaryColor: '#ec4899', backgroundColor: '#fff1f2', textColor: '#3730a3', accentColor: '#fbcfe8' },
  minimalist: { id: 'min', name: 'Minimal', fontFamily: 'Inter', primaryColor: '#18181b', secondaryColor: '#71717a', backgroundColor: '#fafafa', textColor: '#27272a', accentColor: '#e4e4e7' },
  academic: { id: 'acad', name: 'Akademik', fontFamily: 'Inter', primaryColor: '#1e3a8a', secondaryColor: '#1d4ed8', backgroundColor: '#f0f9ff', textColor: '#172554', accentColor: '#dbeafe' },
  warm_serenity: { id: 'warm', name: 'Sıcak', fontFamily: 'Plus Jakarta Sans', primaryColor: '#78350f', secondaryColor: '#d97706', backgroundColor: '#fffbeb', textColor: '#451a03', accentColor: '#fde68a' },
  neuro_divergent: { id: 'neuro', name: 'Nöro-Dostu', fontFamily: 'Open Dyslexic', primaryColor: '#000000', secondaryColor: '#005f73', backgroundColor: '#e9edc9', textColor: '#000000', accentColor: '#ccd5ae' }
};

const getImageUrl = (prompt: string) => {
  const encoded = encodeURIComponent(`${prompt}, high quality photography, professional lighting, 4k`);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
};

const PresentationStudio: React.FC<PresentationStudioProps> = ({ initialConfig, onClose }) => {
  const [mode, setMode] = useState<'config' | 'editor' | 'live'>('config');
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  // UI Panels
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'ai'>('design');

  // Live Stage Tools
  const [laser, setLaser] = useState<{x:number, y:number} | null>(null);
  const [isBlackout, setIsBlackout] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const [config, setConfig] = useState<PresentationConfig>(initialConfig || {
    topic: '', targetAudience: 'team', tone: 'academic', depth: 'intermediate',
    slideCount: 6, visualStyle: 'corporate', includeAnimations: true
  });

  const theme = THEMES[config.visualStyle];

  // --- ACTIONS ---

  const handleGenerate = async () => {
    if (!config.topic) return;
    setIsGenerating(true);
    setLoadingMsg("Nöral Müfredat Haritalanıyor...");
    try {
      const result = await armsService.generateCustomPresentation(config);
      const withImages = result.map(s => ({ ...s, generatedImageUrl: getImageUrl(s.imageKeyword!) }));
      setSlides(withImages);
      setMode('editor');
    } catch (e) { alert("AI Hatası."); } 
    finally { setIsGenerating(false); }
  };

  const updateSlide = (field: keyof TrainingSlide, value: any) => {
    const next = [...slides];
    next[activeIdx] = { ...next[activeIdx], [field]: value };
    setSlides(next);
  };

  const handleRefine = async (intent: string) => {
    setIsGenerating(true);
    setLoadingMsg("İçerik Optimize Ediliyor...");
    try {
      const refined = await armsService.refineSlideContent(slides[activeIdx], intent);
      updateSlide('content', refined.content);
      updateSlide('title', refined.title);
    } finally { setIsGenerating(false); }
  };

  // Keyboard Navigation
  useEffect(() => {
    if (mode !== 'live') return;
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') setActiveIdx(p => Math.min(slides.length - 1, p + 1));
        if (e.key === 'ArrowLeft') setActiveIdx(p => Math.max(0, p - 1));
        if (e.key === 'Escape') setMode('editor');
        if (e.key === 'b') setIsBlackout(prev => !prev);
        if (e.key === 'n') setShowNotes(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, slides.length]);

  // --- VIEWS ---

  if (mode === 'config') {
    return (
      <div className="fixed inset-0 z-[3000] bg-[#0f172a] flex items-center justify-center p-8 animate-fade-in">
         <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
            <div className="w-full md:w-2/5 bg-slate-900 p-16 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black mb-8 rotate-3 shadow-xl">YG</div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">Neural<br/>Director<br/>Studio</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em] mt-8 border-l-2 border-orange-600 pl-4">v4.0 Cognitive Engine</p>
               </div>
               <div className="relative z-10 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                  <p className="text-sm font-medium italic text-slate-300">"Tasarımı AI'ya devredin, pedagojiye odaklanın. Saniyeler içinde akademik kalitede görsel sunumlar."</p>
               </div>
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="flex-1 p-16 flex flex-col justify-center bg-slate-50">
               <div className="max-w-md mx-auto w-full space-y-10">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">EĞİTİM KONUSU</label>
                     <input 
                        type="text" 
                        className="w-full p-6 bg-white rounded-2xl text-2xl font-black border-2 border-transparent focus:border-orange-500 outline-none shadow-sm placeholder:text-slate-200"
                        placeholder="Örn: ABA'da Etik Sınırlar..."
                        value={config.topic}
                        onChange={e => setConfig({...config, topic: e.target.value})}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">GÖRSEL STİL</label>
                        <select className="w-full p-4 bg-white rounded-xl font-bold text-xs" value={config.visualStyle} onChange={e => setConfig({...config, visualStyle: e.target.value as any})}>
                           {Object.entries(THEMES).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">HEDEF KİTLE</label>
                        <select className="w-full p-4 bg-white rounded-xl font-bold text-xs" value={config.targetAudience} onChange={e => setConfig({...config, targetAudience: e.target.value as any})}>
                           <option value="team">Akademik Kadro</option>
                           <option value="parents">Veliler</option>
                           <option value="management">Yönetim</option>
                        </select>
                     </div>
                  </div>

                  <button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                     {isGenerating ? 'ANALİZ EDİLİYOR...' : 'SENTEZİ BAŞLAT'}
                  </button>
                  <button onClick={onClose} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">İPTAL ET</button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (mode === 'editor') {
    const slide = slides[activeIdx];
    return (
      <div className="fixed inset-0 z-[3000] bg-[#f1f5f9] flex flex-col overflow-hidden animate-fade-in font-sans">
         {/* TOP TOOLBAR */}
         <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
            <div className="flex items-center gap-6">
               <button onClick={() => setMode('config')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               </button>
               <h3 className="font-black text-[12px] uppercase tracking-widest text-slate-800">{config.topic}</h3>
               <div className="h-4 w-px bg-slate-200"></div>
               <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">{theme.name} Tema</span>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setMode('live')} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  SUNUMU BAŞLAT
               </button>
               <button onClick={() => setIsInspectorOpen(!isInspectorOpen)} className={`p-2 rounded-lg transition-all ${isInspectorOpen ? 'bg-slate-100' : 'text-slate-300'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               </button>
            </div>
         </div>

         <div className="flex-1 flex overflow-hidden">
            {/* SLIDE SORTER */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLAYTLAR ({slides.length})</span>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50/30">
                  {slides.map((s, i) => (
                    <div 
                      key={s.id} 
                      onClick={() => setActiveIdx(i)}
                      className={`group relative aspect-video bg-white rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${activeIdx === i ? 'border-orange-500 shadow-xl ring-4 ring-orange-100 scale-105 z-10' : 'border-white hover:border-slate-200 opacity-60 hover:opacity-100'}`}
                    >
                       <div className={`absolute top-1 left-1 px-2 py-0.5 rounded text-[8px] font-black z-10 ${activeIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{i+1}</div>
                       <div className="absolute inset-0 p-2 flex flex-col scale-[0.3] origin-top-left w-[333%] h-[333%] pointer-events-none">
                          <h4 className="text-xl font-black mb-2" style={{ color: theme.primaryColor }}>{s.title}</h4>
                          <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                          <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* MAIN CANVAS */}
            <div className="flex-1 bg-slate-100 flex items-center justify-center p-12 overflow-hidden relative">
               <div 
                 className="aspect-video w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden relative group transition-all duration-500"
                 style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}
               >
                  {/* Visual Layer */}
                  {slide.generatedImageUrl && (
                     <div className={`absolute inset-0 z-0 ${slide.layout === 'split_left' ? 'left-1/2' : slide.layout === 'split_right' ? 'right-1/2' : ''}`}>
                        <img src={slide.generatedImageUrl} className="w-full h-full object-cover animate-fade-in" />
                        <div className={`absolute inset-0 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'bg-black/40 backdrop-blur-[2px]' : ''}`}></div>
                     </div>
                  )}
                  
                  {/* Content Layer */}
                  <div className={`relative z-10 h-full p-20 flex flex-col ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'text-white items-center justify-center text-center' : ''}`}>
                     {slide.layout === 'cover' ? (
                        <div className="space-y-8 animate-scale-in">
                           <span className="px-6 py-2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-xl">YENİ GÜN AKADEMİ</span>
                           <h1 className="text-7xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{slide.title}</h1>
                           <p className="text-2xl font-bold italic opacity-90">{slide.subtitle}</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-12 gap-12 h-full items-center">
                           <div className={`col-span-8 space-y-10 ${slide.layout === 'split_right' ? 'col-start-5' : ''}`}>
                              <h2 className="text-6xl font-black uppercase tracking-tight leading-none border-l-[16px] pl-10 animate-slide-right" style={{ borderColor: theme.secondaryColor }}>{slide.title}</h2>
                              <div className="space-y-6 pl-14">
                                 {slide.content?.map((c, i) => (
                                    <p key={i} className="text-2xl font-bold opacity-90 leading-snug flex items-start gap-4">
                                       <span className="mt-2" style={{ color: theme.secondaryColor }}>▪</span> {c}
                                    </p>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* ATOMIC INSPECTOR */}
            <div className={`w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl transition-all duration-300 ${isInspectorOpen ? '' : '-mr-96'}`}>
               <div className="flex border-b border-slate-100">
                  {['design', 'content', 'ai'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === t ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-400'}`}>
                       {t === 'ai' ? 'Nöral Sentez' : t === 'design' ? 'Dizayn' : 'İçerik'}
                    </button>
                  ))}
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                  {activeTab === 'design' && (
                    <>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SAHNE DÜZENİ</label>
                          <div className="grid grid-cols-2 gap-2">
                             {['cover', 'bullet_list', 'split_left', 'split_right', 'full_visual', 'quote_center'].map(l => (
                               <button 
                                 key={l} 
                                 onClick={() => updateSlide('layout', l)}
                                 className={`p-3 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${slide.layout === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 hover:border-slate-300'}`}
                               >
                                  {l.replace('_', ' ')}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NÖRAL GÖRSEL</label>
                          <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative group border-2 border-slate-200 shadow-inner">
                             <img src={slide.generatedImageUrl} className="w-full h-full object-cover" />
                             <button 
                                onClick={() => updateSlide('generatedImageUrl', getImageUrl(`${slide.imageKeyword} ${Math.random()}`))}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm"
                             >
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
                                <span className="text-[9px] font-black uppercase tracking-widest">Yeniden Üret</span>
                             </button>
                          </div>
                          <textarea 
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none h-20 shadow-inner"
                             value={slide.imageKeyword}
                             onChange={e => updateSlide('imageKeyword', e.target.value)}
                          />
                       </div>
                    </>
                  )}

                  {activeTab === 'content' && (
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase">ANA BAŞLIK</label>
                          <input type="text" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" value={slide.title} onChange={e => updateSlide('title', e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase">İÇERİK MADDELERİ</label>
                          <textarea className="w-full p-4 bg-slate-50 rounded-xl font-bold text-xs h-48" value={slide.content?.join('\n')} onChange={e => updateSlide('content', e.target.value.split('\n'))} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase">YÖNETİCİ NOTLARI</label>
                          <textarea className="w-full p-4 bg-yellow-50/50 rounded-xl font-medium text-xs h-32 italic text-yellow-900 border border-yellow-100 shadow-inner" value={slide.speakerNotes} onChange={e => updateSlide('speakerNotes', e.target.value)} />
                       </div>
                    </div>
                  )}

                  {activeTab === 'ai' && (
                    <div className="space-y-6 animate-slide-up">
                       <div className="p-6 bg-indigo-50 rounded-3xl border-2 border-indigo-100 shadow-sm">
                          <h5 className="text-[11px] font-black text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                             NÖRAL DÖNÜŞÜM
                          </h5>
                          <div className="space-y-2">
                             {[
                                { t: 'Veli Diline Çevir', i: 'Ebeveynlerin anlayacağı daha empatik ve sade bir dil kullan.' },
                                { t: 'Akademik Derinlik Ekle', i: 'Klinik terimler ve literatür referanslarıyla içeriği ağırlaştır.' },
                                { t: 'Soru/Tartışma Ekle', i: 'Slayt sonuna etkileşimi artıracak kognitif bir soru ekle.' },
                                { t: 'İngilizce Sentezle', i: 'Tüm içeriği profesyonel akademik İngilizceye çevir.' }
                             ].map(opt => (
                               <button 
                                 key={opt.t} 
                                 onClick={() => handleRefine(opt.i)}
                                 disabled={isGenerating}
                                 className="w-full text-left p-4 bg-white border border-indigo-100 rounded-xl text-[10px] font-black text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                               >
                                  {opt.t}
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

  if (mode === 'live') {
    const slide = slides[activeIdx];
    return (
      <div 
        className={`fixed inset-0 z-[5000] bg-black text-white flex flex-col focus:outline-none ${isBlackout ? 'cursor-none' : ''}`}
        onMouseMove={(e) => setLaser({x: e.clientX, y: e.clientY})}
        tabIndex={0}
      >
         {/* Laser Pointer */}
         {laser && !isBlackout && (
           <div className="fixed w-6 h-6 bg-red-600 rounded-full pointer-events-none z-[6000] shadow-[0_0_20px_#ef4444] opacity-80" style={{ left: laser.x - 12, top: laser.y - 12 }}></div>
         )}

         {/* Blackout curtain */}
         {isBlackout && (
           <div className="absolute inset-0 bg-black z-[5500] flex items-center justify-center">
              <p className="text-white/5 font-black text-xs uppercase tracking-[2em]">GİZLİLİK MODU</p>
           </div>
         )}

         {/* Progress Bar */}
         <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-[5600]">
            <div className="h-full bg-orange-600 transition-all duration-1000 shadow-[0_0_10px_#ea580c]" style={{ width: `${((activeIdx + 1) / slides.length) * 100}%` }}></div>
         </div>

         {/* Controls HUD */}
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[5600] flex gap-4 p-4 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={() => setActiveIdx(p => Math.max(0, p - 1))} className="p-4 text-white hover:bg-white/10 rounded-2xl">←</button>
            <div className="flex items-center px-4 font-black text-xs tracking-widest">{activeIdx + 1} / {slides.length}</div>
            <button onClick={() => setActiveIdx(p => Math.min(slides.length - 1, p + 1))} className="p-4 text-white hover:bg-white/10 rounded-2xl">→</button>
            <div className="w-px h-8 bg-white/10 mx-2"></div>
            <button onClick={() => setIsBlackout(!isBlackout)} className="px-6 text-[10px] font-black uppercase tracking-widest hover:text-orange-500">B: ODAK</button>
            <button onClick={() => setShowNotes(!showNotes)} className="px-6 text-[10px] font-black uppercase tracking-widest hover:text-blue-500">N: NOTLAR</button>
            <button onClick={() => setMode('editor')} className="px-6 text-[10px] font-black uppercase tracking-widest text-rose-500">ESC: ÇIKIŞ</button>
         </div>

         {/* Speaker Notes Overlay */}
         {showNotes && (
           <div className="absolute top-10 right-10 w-96 bg-black/80 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] text-white z-[5600] animate-slide-left shadow-2xl">
              <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">MÜDAHALE REHBERİ</h5>
              <p className="text-xl font-medium leading-relaxed italic opacity-90">{slide.speakerNotes || 'Bu slayt için özel direktif bulunmuyor.'}</p>
           </div>
         )}

         {/* Slide Renderer */}
         <div className="w-full h-full relative flex items-center justify-center p-24" style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}>
            {slide.generatedImageUrl && (
              <div className={`absolute inset-0 z-0 ${slide.layout === 'split_left' ? 'left-1/2' : slide.layout === 'split_right' ? 'right-1/2' : ''}`}>
                 <img src={slide.generatedImageUrl} className="w-full h-full object-cover animate-fade-in" />
                 <div className={`absolute inset-0 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'bg-black/50' : ''}`}></div>
              </div>
            )}
            
            <div className={`w-full max-w-7xl relative z-10 animate-fade-in ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'text-white text-center items-center flex flex-col justify-center' : ''}`}>
               {slide.layout === 'cover' ? (
                 <div className="space-y-16">
                    <h1 className="text-[10rem] font-black uppercase tracking-tighter leading-none drop-shadow-3xl">{slide.title}</h1>
                    <p className="text-5xl font-bold italic opacity-80 border-t-2 border-white/20 pt-10">{slide.subtitle}</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-12 gap-24 items-center">
                    <div className={`col-span-8 space-y-16 ${slide.layout === 'split_right' ? 'col-start-5' : ''}`}>
                       <h2 className="text-9xl font-black uppercase tracking-tighter leading-none border-l-[32px] pl-20" style={{ borderColor: theme.secondaryColor }}>{slide.title}</h2>
                       <div className="space-y-10 pl-32">
                          {slide.content?.map((c, i) => (
                             <p key={i} className="text-5xl font-bold opacity-90 leading-snug flex items-start gap-10">
                                <span className="mt-4" style={{ color: theme.secondaryColor }}>▪</span> {c}
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
