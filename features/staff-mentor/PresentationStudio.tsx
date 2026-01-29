
import React, { useState, useEffect } from 'react';
import { PresentationConfig, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';

interface PresentationStudioProps {
  onClose?: () => void;
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'config' | 'preview' | 'live'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  // Configuration State
  const [config, setConfig] = useState<PresentationConfig>({
    topic: '',
    targetAudience: 'team',
    tone: 'academic',
    depth: 'intermediate',
    slideCount: 8
  });

  const handleGenerate = async () => {
    if (!config.topic) {
      alert("Lütfen bir sunum konusu giriniz.");
      return;
    }
    setIsGenerating(true);
    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      setSlides(generatedSlides);
      setMode('preview');
      setActiveSlideIdx(0);
    } catch (e) {
      alert("Sunum motoru hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (mode === 'live') {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setActiveSlideIdx(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveSlideIdx(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setMode('preview');
      } else if (e.key === 'n') {
        setShowNotes(prev => !prev);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, slides]);

  // --- CONFIG MODE RENDER ---
  if (mode === 'config') {
    return (
      <div className="min-h-screen bg-slate-50 p-8 md:p-16 flex items-center justify-center animate-fade-in">
        <div className="max-w-5xl w-full bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-600 via-slate-900 to-orange-600"></div>
           
           <div className="p-16">
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Nöral Akademik Stüdyo</h2>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">AI Destekli Eğitim Tasarım Motoru</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sunum Konusu</label>
                       <textarea 
                         className="w-full h-40 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-orange-500 outline-none font-bold text-lg text-slate-800 resize-none transition-all"
                         placeholder="Örn: Otizmli Çocuklarda Kriz Yönetimi ve Veli İletişimi..."
                         value={config.topic}
                         onChange={e => setConfig({...config, topic: e.target.value})}
                       />
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hedef Kitle</label>
                       <div className="grid grid-cols-2 gap-3">
                          {['individual', 'team', 'parents', 'management'].map(aud => (
                             <button
                               key={aud}
                               onClick={() => setConfig({...config, targetAudience: aud as any})}
                               className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                 config.targetAudience === aud ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                               }`}
                             >
                                {aud === 'individual' ? 'Tekil Personel' : aud === 'team' ? 'Akademik Kadro' : aud === 'parents' ? 'Veli Grubu' : 'Yönetim Kurulu'}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sunum Tonu</label>
                       <div className="grid grid-cols-2 gap-3">
                          {[
                            {id: 'academic', label: 'Akademik / Didaktik'},
                            {id: 'motivational', label: 'Motivasyonel'},
                            {id: 'strict', label: 'Sert / Kurumsal'},
                            {id: 'workshop', label: 'İnteraktif / Atölye'}
                          ].map(tone => (
                             <button
                               key={tone.id}
                               onClick={() => setConfig({...config, tone: tone.id as any})}
                               className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                 config.tone === tone.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-50 bg-white text-slate-400'
                               }`}
                             >
                                {tone.label}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Derinlik</label>
                          <select 
                            className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer"
                            value={config.depth}
                            onChange={e => setConfig({...config, depth: e.target.value as any})}
                          >
                             <option value="beginner">Başlangıç (101)</option>
                             <option value="intermediate">Orta Seviye</option>
                             <option value="expert">Uzman / Klinik</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Slayt Sayısı</label>
                          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                             <input 
                               type="range" min="3" max="20" 
                               className="flex-1 accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer ml-2"
                               value={config.slideCount}
                               onChange={e => setConfig({...config, slideCount: parseInt(e.target.value)})}
                             />
                             <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-900 shadow-sm">{config.slideCount}</span>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full py-6 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 mt-4"
                    >
                       {isGenerating ? 'SUNUM İNŞA EDİLİYOR...' : 'STÜDYOYU BAŞLAT'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- LIVE MODE (FULLSCREEN) ---
  if (mode === 'live') {
    const slide = slides[activeSlideIdx];
    return (
      <div className="fixed inset-0 z-[1000] bg-slate-950 text-white flex flex-col overflow-hidden animate-fade-in cursor-none selection:bg-orange-500/30">
         {/* PROGRESS BAR */}
         <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
            <div className="h-full bg-orange-600 transition-all duration-500 ease-out" style={{ width: `${((activeSlideIdx + 1) / slides.length) * 100}%` }}></div>
         </div>

         {/* CONTENT LAYER */}
         <div className="flex-1 flex flex-col p-16 md:p-32 relative z-10 justify-center">
            {slide.type === 'title' ? (
               <div className="text-center space-y-10 animate-scale-in">
                  <span className="inline-block px-6 py-2 border border-orange-500/30 text-orange-500 rounded-full text-[12px] font-black uppercase tracking-[0.6em]">YENİ GÜN AKADEMİ</span>
                  <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9]">{slide.title}</h1>
                  <p className="text-2xl md:text-4xl font-bold text-slate-400 italic max-w-4xl mx-auto">{slide.subtitle}</p>
               </div>
            ) : (
               <div className="grid grid-cols-12 gap-16 h-full items-center">
                  <div className="col-span-12 lg:col-span-7 space-y-12">
                     <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none border-l-[16px] border-orange-600 pl-10">{slide.title}</h2>
                     <div className="space-y-8 pl-14">
                        {slide.content.map((point, i) => (
                           <p key={i} className="text-2xl md:text-3xl font-bold text-slate-300 leading-snug tracking-tight opacity-0 animate-slide-up" style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'forwards' }}>
                              • {point}
                           </p>
                        ))}
                     </div>
                  </div>
                  <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                     {slide.interactiveElement && (
                        <div className="bg-orange-600 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(234,88,12,0.3)] animate-pulse-slow">
                           <span className="text-[10px] font-black text-orange-900 uppercase tracking-widest block mb-4">TARTIŞMA NOKTASI</span>
                           <p className="text-2xl font-black uppercase leading-tight italic">"{slide.interactiveElement.question}"</p>
                        </div>
                     )}
                     <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">VAKA ÖRNEĞİ</span>
                        <p className="text-lg font-bold text-slate-400 italic">"{slide.visualPrompt}"</p>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* SPEAKER NOTES OVERLAY (TOGGLE WITH 'N') */}
         {showNotes && (
            <div className="fixed bottom-10 right-10 w-96 bg-black/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl z-50 animate-slide-up">
               <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-3">YÖNETİCİ NOTU (GİZLİ)</span>
               <p className="text-sm font-bold text-slate-300 leading-relaxed">{slide.speakerNotes}</p>
            </div>
         )}

         {/* CONTROLS HINT */}
         <div className="fixed bottom-8 left-8 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pointer-events-none">
            NAVIGASYON: ← / → | NOTLAR: N | ÇIKIŞ: ESC
         </div>
      </div>
    );
  }

  // --- PREVIEW MODE ---
  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col gap-8 animate-fade-in">
       <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
             <button onClick={() => setMode('config')} className="px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all">← Konfigürasyon</button>
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight ml-4">{config.topic}</h3>
          </div>
          <button onClick={() => setMode('live')} className="px-8 py-4 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-3">
             <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
             CANLI SUNUM MODU
          </button>
       </div>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
             {slides.map((s, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveSlideIdx(i)}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${activeSlideIdx === i ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-transparent hover:border-slate-300 text-slate-500'}`}
                >
                   <span className="text-[9px] font-black uppercase opacity-50 mb-1 block">SLAYT {i + 1}</span>
                   <p className="text-[11px] font-bold leading-tight line-clamp-2">{s.title}</p>
                </div>
             ))}
          </div>

          <div className="lg:col-span-9 bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden aspect-video relative group">
             {/* Slide Preview */}
             <div className="absolute inset-0 p-16 flex flex-col">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{slides[activeSlideIdx].title}</h2>
                   <div className="px-4 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">{slides[activeSlideIdx].type}</div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-12">
                   <div className="space-y-4">
                      {slides[activeSlideIdx].content.map((c, i) => (
                         <div key={i} className="flex gap-4 items-start">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 shrink-0"></div>
                            <p className="text-lg font-bold text-slate-600 leading-snug">{c}</p>
                         </div>
                      ))}
                   </div>
                   <div className="space-y-6">
                      {slides[activeSlideIdx].interactiveElement && (
                         <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mb-2">ETKİLEŞİM</span>
                            <p className="text-sm font-bold text-slate-800 italic">"{slides[activeSlideIdx].interactiveElement!.question}"</p>
                         </div>
                      )}
                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">GİZLİ NOT</span>
                         <p className="text-xs font-medium text-slate-500">{slides[activeSlideIdx].speakerNotes}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PresentationStudio;
