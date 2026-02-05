
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PresentationConfig, TrainingSlide, VisualStyle, SlideLayout, PresentationTheme, StaffMember, HistoryState, PersonaType, SlideConnection } from '../../types';
import { armsService } from '../../services/ai/armsService';
import { TRAINING_CATALOG, TrainingTemplate } from '../../constants/trainingPlans';

interface PresentationStudioProps {
  initialConfig?: PresentationConfig;
  onClose?: () => void;
}

const THEMES: Record<VisualStyle, PresentationTheme> = {
  corporate: { id: 'corp', name: 'Kurumsal', fontFamily: 'Plus Jakarta Sans', primaryColor: '#0f172a', secondaryColor: '#ea580c', backgroundColor: '#ffffff', textColor: '#1e293b', accentColor: '#cbd5e1', backgroundImageStyle: 'brightness(0.9)' },
  dark_mode: { id: 'dark', name: 'Nöral Karanlık', fontFamily: 'Inter', primaryColor: '#ffffff', secondaryColor: '#f59e0b', backgroundColor: '#0f172a', textColor: '#f8fafc', accentColor: '#334155', backgroundImageStyle: 'brightness(0.4) contrast(1.2)' },
  playful: { id: 'play', name: 'Canlı/Motivasyon', fontFamily: 'Plus Jakarta Sans', primaryColor: '#4f46e5', secondaryColor: '#ec4899', backgroundColor: '#fff1f2', textColor: '#3730a3', accentColor: '#fbcfe8', backgroundImageStyle: 'saturate(1.5)' },
  minimalist: { id: 'min', name: 'Sade Akademik', fontFamily: 'Inter', primaryColor: '#18181b', secondaryColor: '#71717a', backgroundColor: '#fafafa', textColor: '#27272a', accentColor: '#e4e4e7', backgroundImageStyle: 'grayscale(1) opacity(0.5)' },
  academic: { id: 'acad', name: 'Klasik Akademi', fontFamily: 'Inter', primaryColor: '#1e3a8a', secondaryColor: '#1d4ed8', backgroundColor: '#f8fbff', textColor: '#172554', accentColor: '#dbeafe', backgroundImageStyle: 'sepia(0.1)' },
  warm_serenity: { id: 'warm', name: 'Pedagojik Sıcaklık', fontFamily: 'Plus Jakarta Sans', primaryColor: '#78350f', secondaryColor: '#d97706', backgroundColor: '#fffbeb', textColor: '#451a03', accentColor: '#fde68a', backgroundImageStyle: 'hue-rotate(20deg)' },
  neuro_divergent: { id: 'neuro', name: 'Nöro-Çeşitli', fontFamily: 'Inter', primaryColor: '#000000', secondaryColor: '#005f73', backgroundColor: '#e9edc9', textColor: '#000000', accentColor: '#ccd5ae', backgroundImageStyle: 'contrast(0.8)' }
};

const getNeuralImageUrl = (prompt: string) => {
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${seed}`;
};

const PresentationStudio: React.FC<PresentationStudioProps> = ({ initialConfig, onClose }) => {
  // --- CORE STATE ---
  const [mode, setMode] = useState<'catalog' | 'config' | 'editor' | 'flow'>('catalog');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [activePersona, setActivePersona] = useState<PersonaType>('academic');
  const [hoveredAtom, setHoveredAtom] = useState<{ field: string, index?: number } | null>(null);

  const [history, setHistory] = useState<HistoryState>({ past: [], present: [], future: [] });
  const slides = history.present;
  const slide = slides[activeIdx];

  const [config, setConfig] = useState<PresentationConfig>(initialConfig || {
    topic: '', targetAudience: 'team', tone: 'academic', depth: 'intermediate',
    slideCount: 8, visualStyle: 'corporate', includeAnimations: true, isSimulated: true
  });

  const activeTheme = THEMES[config.visualStyle] || THEMES.corporate;

  // --- FAZ 3: FLOW ACTIONS ---
  const handleGenerateBranched = async () => {
      setIsGenerating(true);
      setLoadingMsg("Nöral Akış Haritalanıyor...");
      try {
          const result = await armsService.generateBranchedSimulation(config);
          const withImages = result.map(s => ({
              ...s,
              generatedImageUrl: getNeuralImageUrl(s.visualPrompt || s.title || config.topic)
          }));
          setHistory({ past: [], present: withImages, future: [] });
          setMode('flow');
      } catch (e) { alert("Graph Engine Error."); }
      finally { setIsGenerating(false); }
  };

  // @fix: Added handleGenerate function to support linear presentation generation.
  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoadingMsg("Nöral İçerik Sentezleniyor...");
    try {
      const result = await armsService.generateCustomPresentation(config);
      const withImages = result.map(s => ({
        ...s,
        generatedImageUrl: getNeuralImageUrl(s.visualPrompt || s.title || config.topic)
      }));
      setHistory({ past: [], present: withImages, future: [] });
      setMode('editor');
      setActiveIdx(0);
    } catch (e) {
      alert("Sunum oluşturma hatası.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateConnection = (slideId: string, connIdx: number, updates: Partial<SlideConnection>) => {
      const next = [...slides];
      const sIdx = next.findIndex(s => s.id === slideId);
      if (sIdx === -1) return;
      const connections = [...(next[sIdx].connections || [])];
      connections[connIdx] = { ...connections[connIdx], ...updates };
      next[sIdx] = { ...next[sIdx], connections };
      pushToHistory(next);
  };

  const pushToHistory = useCallback((newSlides: TrainingSlide[]) => {
      setHistory(prev => ({ past: [...prev.past, prev.present], present: newSlides, future: [] }));
  }, []);

  const undo = () => {
      if (history.past.length === 0) return;
      setHistory({ past: history.past.slice(0, -1), present: history.past[history.past.length - 1], future: [history.present, ...history.future] });
  };

  const redo = () => {
      if (history.future.length === 0) return;
      setHistory({ past: [...history.past, history.present], present: history.future[0], future: history.future.slice(1) });
  };

  // --- ATOMIC ACTIONS (Faz 2'den miras) ---
  const handleAtomicRefine = async (field: 'title' | 'content' | 'subtitle', intent: string, index?: number) => {
    setIsProcessing(true);
    try {
        const updatedSlide = await armsService.refineAtomicContent(slide, field, intent, index);
        const next = [...slides];
        next[activeIdx] = updatedSlide;
        pushToHistory(next);
    } finally { setIsProcessing(false); setHoveredAtom(null); }
  };

  // --- UI COMPONENTS ---

  const SlideMiniCard = ({ s, idx }: { s: TrainingSlide, idx: number }) => (
      <div 
        onClick={() => { setActiveIdx(idx); setMode('editor'); }}
        className={`p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer hover:shadow-xl ${activeIdx === idx ? 'border-orange-500 ring-4 ring-orange-100' : 'border-slate-100 opacity-80'}`}
      >
          <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-400">#{idx + 1}</span>
              {s.layout === 'decision_node' && <span className="px-2 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded-lg">DECISION</span>}
          </div>
          <h5 className="text-[11px] font-bold text-slate-900 truncate uppercase">{s.title}</h5>
          {s.connections && s.connections.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-50 flex gap-1">
                  {s.connections.map((_, ci) => <div key={ci} className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>)}
              </div>
          )}
      </div>
  );

  if (mode === 'flow') {
      return (
          <div className="fixed inset-0 z-[3000] bg-[#f8fafc] flex flex-col animate-fade-in font-sans">
              <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                  <div className="flex items-center gap-6">
                      <button onClick={() => setMode('editor')} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      </button>
                      <div>
                          <h3 className="font-black text-lg uppercase tracking-widest text-slate-800 leading-none">Nöral Akış Haritası</h3>
                          <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-2">v3.0 Graph Controller</p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <button onClick={() => setMode('editor')} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Editöre Dön</button>
                  </div>
              </div>

              <div className="flex-1 overflow-auto p-12 bg-slate-50 relative">
                  {/* GRAPH CANVAS (Abstraction) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                      {slides.map((s, i) => (
                          <div key={s.id} className="space-y-4">
                              <SlideMiniCard s={s} idx={i} />
                              {s.connections?.map((conn, ci) => (
                                  <div key={ci} className="ml-8 p-4 bg-orange-50 border border-orange-100 rounded-xl relative">
                                      <div className="absolute -top-4 left-4 w-px h-4 bg-orange-300"></div>
                                      <p className="text-[9px] font-black text-orange-700 uppercase mb-1">Eğer: {conn.condition}</p>
                                      <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-bold text-slate-600">→ {slides.find(sx => sx.id === conn.targetId)?.title.substring(0, 15)}...</span>
                                          <button className="text-orange-500 hover:text-orange-700"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // Fallback to Editor/Catalog (Faz 2 logic)
  if (mode === 'catalog') {
    return (
      <div className="fixed inset-0 z-[3000] bg-slate-950 flex flex-col items-center p-12 overflow-y-auto custom-scrollbar animate-fade-in">
        <div className="max-w-7xl w-full">
           <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Akademik Müfredat</h2>
              <button onClick={onClose} className="px-10 py-4 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase transition-all">İptal</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TRAINING_CATALOG.map(temp => (
                <div key={temp.id} onClick={() => setMode('config')} className="bg-slate-900 border border-white/5 p-10 rounded-[3rem] hover:border-orange-500 transition-all cursor-pointer group">
                   <h4 className="text-2xl font-black text-white uppercase mb-6 group-hover:text-orange-500">{temp.title}</h4>
                   <p className="text-[12px] text-slate-400 italic mb-10">{temp.description}</p>
                   <div className="text-[10px] font-black text-orange-600 uppercase">Slayt: {temp.suggestedSlides}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  if (mode === 'config') {
    return (
      <div className="fixed inset-0 z-[3000] bg-white flex items-center justify-center p-8 animate-fade-in">
        <div className="max-w-md w-full space-y-8">
           <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Sentez Ayarları</h2>
           <input type="text" className="w-full p-6 bg-slate-50 border-2 rounded-3xl font-black text-xl outline-none focus:border-orange-500" placeholder="Konu Girin..." value={config.topic} onChange={e => setConfig({...config, topic: e.target.value})} />
           <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <input type="checkbox" checked={config.isSimulated} onChange={e => setConfig({...config, isSimulated: e.target.checked})} className="w-6 h-6 accent-orange-600" />
               <div>
                   <p className="text-xs font-black text-slate-900 uppercase">Dallanan Simülasyon (Faz 3)</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mt-1">AI dinamik karar ağaçları oluşturur.</p>
               </div>
           </div>
           <button onClick={config.isSimulated ? handleGenerateBranched : handleGenerate} disabled={isGenerating || !config.topic} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all disabled:opacity-50">
              {isGenerating ? <span className="animate-pulse">{loadingMsg}</span> : 'KANVASI OLUŞTUR'}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[3000] bg-[#f1f5f9] flex flex-col overflow-hidden animate-fade-in">
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-50 shadow-sm">
         <div className="flex items-center gap-6">
            <button onClick={() => setMode('catalog')} className="text-slate-400 hover:text-slate-900"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <div className="flex gap-2">
                <button onClick={undo} disabled={history.past.length === 0} className="p-2 text-slate-300 hover:text-slate-900 disabled:opacity-20"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg></button>
                <button onClick={redo} disabled={history.future.length === 0} className="p-2 text-slate-300 hover:text-slate-900 disabled:opacity-20"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg></button>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button onClick={() => setMode('flow')} className="px-6 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase border border-orange-200">FLOW MAP</button>
            <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['academic', 'operational', 'parent'] as PersonaType[]).map(p => (
                    <button key={p} onClick={() => setActivePersona(p)} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activePersona === p ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>{p}</button>
                ))}
            </div>
            <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Kapat</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-slate-100 p-4 space-y-4 overflow-y-auto custom-scrollbar">
           {slides.map((s, i) => (
              <div key={s.id} onClick={() => setActiveIdx(i)} className={`aspect-video rounded-2xl border-4 cursor-pointer transition-all overflow-hidden relative ${activeIdx === i ? 'border-orange-500 scale-105' : 'border-transparent opacity-50'}`}>
                 <img src={s.generatedImageUrl} className="w-full h-full object-cover" />
                 {s.connections && s.connections.length > 0 && <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></div>}
              </div>
           ))}
        </div>

        <div className="flex-1 flex items-center justify-center p-12 bg-slate-50 relative overflow-hidden">
           <div className="aspect-video w-full max-w-5xl bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden relative group" style={{ fontFamily: activeTheme.fontFamily, backgroundColor: activeTheme.backgroundColor }}>
              {slide?.generatedImageUrl && <img src={slide.generatedImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm scale-110" />}
              <div className="relative z-10 h-full p-20 flex flex-col justify-center">
                 <div className="relative mb-8 group/atom" onMouseEnter={() => setHoveredAtom({ field: 'title' })} onMouseLeave={() => setHoveredAtom(null)}>
                    <h2 contentEditable suppressContentEditableWarning className="text-6xl font-black uppercase tracking-tighter leading-none outline-none border-b-2 border-transparent hover:border-orange-200 focus:border-orange-500" style={{ color: activeTheme.primaryColor }}>{slide?.title}</h2>
                 </div>
                 <div className="space-y-6">
                    {slide?.content?.map((text, idx) => (
                        <div key={idx} className="relative group/atom flex items-start gap-4" onMouseEnter={() => setHoveredAtom({ field: 'content', index: idx })} onMouseLeave={() => setHoveredAtom(null)}>
                            <div className="w-3 h-3 rounded-full mt-2 shrink-0" style={{ backgroundColor: activeTheme.secondaryColor }}></div>
                            <p contentEditable suppressContentEditableWarning className="text-2xl font-bold text-slate-700 leading-tight outline-none border-b border-transparent hover:border-orange-200 focus:border-orange-500 w-full">{text}</p>
                        </div>
                    ))}
                 </div>
                 {slide?.connections && slide.connections.length > 0 && (
                     <div className="mt-12 flex gap-4 pt-10 border-t border-slate-100">
                         {slide.connections.map((conn, ci) => (
                             <button key={ci} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">
                                 {conn.label || "Yol Seçin"}
                             </button>
                         ))}
                     </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationStudio;
