
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PresentationConfig, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';

interface PresentationStudioProps {
  onClose?: () => void;
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'config' | 'preview' | 'live'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  
  // Live Mode States
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [showNotes, setShowNotes] = useState(false); // Görsel notlar
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [isBlackout, setIsBlackout] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  
  const timerRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Configuration State
  const [config, setConfig] = useState<PresentationConfig>({
    topic: '',
    targetAudience: 'team',
    tone: 'academic',
    depth: 'intermediate',
    slideCount: 8
  });

  // --- AUDIO ENGINE ---
  const stopAudio = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const speakSlideNotes = useCallback((text: string) => {
    stopAudio();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9; // Biraz daha yavaş ve anlaşılır
    utterance.pitch = 1.0;
    
    // Varsa Türkçe ses seç
    const voices = synthRef.current.getVoices();
    const trVoice = voices.find(v => v.lang.includes('tr'));
    if (trVoice) utterance.voice = trVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, []);

  useEffect(() => {
    if (mode === 'live' && autoPlayAudio) {
      // Slayt değişiminde otomatik oku
      const notes = slides[activeSlideIdx]?.speakerNotes;
      if (notes) {
        // Kısa bir gecikme ile başla
        setTimeout(() => speakSlideNotes(notes), 500);
      }
    } else {
      stopAudio();
    }
  }, [activeSlideIdx, mode, autoPlayAudio, speakSlideNotes, slides]);

  // --- CONTROLS ---
  const handleGenerate = async () => {
    if (!config.topic) {
      alert("Lütfen bir sunum konusu giriniz.");
      return;
    }
    setIsGenerating(true);
    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      if (generatedSlides && generatedSlides.length > 0) {
        setSlides(generatedSlides);
        setMode('preview');
        setActiveSlideIdx(0);
      } else {
        alert("Sunum oluşturulamadı. Lütfen tekrar deneyin.");
      }
    } catch (e) {
      alert("Sunum motoru hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsGenerating(false);
    }
  };

  const changeSlide = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveSlideIdx(prev => Math.min(slides.length - 1, prev + 1));
    } else {
      setActiveSlideIdx(prev => Math.max(0, prev - 1));
    }
  };

  const toggleLaser = () => setIsLaserActive(prev => !prev);
  const toggleBlackout = () => setIsBlackout(prev => !prev);
  const toggleAudio = () => {
    if (isSpeaking) {
      stopAudio();
      setAutoPlayAudio(false);
    } else {
      setAutoPlayAudio(true);
      const notes = slides[activeSlideIdx]?.speakerNotes;
      if(notes) speakSlideNotes(notes);
    }
  };

  // --- KEYBOARD LISTENERS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'live') {
        if (e.key === 'ArrowRight' || e.key === 'Space') changeSlide('next');
        if (e.key === 'ArrowLeft') changeSlide('prev');
        if (e.key === 'Escape') { stopAudio(); setMode('preview'); }
        if (e.key === 'n') setShowNotes(prev => !prev);
        if (e.key === 'l') toggleLaser();
        if (e.key === 'b') toggleBlackout();
        if (e.key === 's') toggleAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, slides, activeSlideIdx, isSpeaking]);

  // --- TIMER ---
  useEffect(() => {
    if (mode === 'live') {
      timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setElapsedTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [mode]);

  // --- MOUSE TRACKING FOR LASER ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLaserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDER CONFIG ---
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

  // --- LIVE MODE (FULLSCREEN PROFESSIONAL) ---
  if (mode === 'live') {
    const slide = slides[activeSlideIdx];
    if (!slide) return <div className="text-white text-center p-20">Slayt Verisi Yüklenemedi</div>;

    return (
      <div 
        className={`fixed inset-0 z-[1000] bg-slate-950 text-white flex flex-col overflow-hidden transition-colors duration-700 ${isLaserActive ? 'cursor-none' : 'cursor-default'}`}
        onMouseMove={handleMouseMove}
      >
         {/* LASER POINTER EFFECT */}
         {isLaserActive && (
           <div 
             className="fixed w-6 h-6 bg-red-600 rounded-full blur-[2px] shadow-[0_0_15px_red] pointer-events-none z-[2000] mix-blend-screen"
             style={{ left: laserPos.x - 12, top: laserPos.y - 12 }}
           ></div>
         )}

         {/* BLACKOUT CURTAIN */}
         {isBlackout && (
           <div className="absolute inset-0 bg-black z-[1500] flex items-center justify-center">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] animate-pulse">ODAK MODU AKTİF</p>
           </div>
         )}

         {/* PROGRESS & STATUS BAR */}
         <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-50">
            <div className="h-full bg-orange-600 transition-all duration-700 ease-in-out shadow-[0_0_20px_#ea580c]" style={{ width: `${((activeSlideIdx + 1) / slides.length) * 100}%` }}></div>
         </div>

         {/* MAIN STAGE CONTENT */}
         <div className="flex-1 flex flex-col p-16 md:p-32 relative z-10 justify-center h-screen">
            {slide.type === 'title' ? (
               <div className="text-center space-y-12 animate-scale-in origin-center">
                  <div className="inline-flex items-center gap-4 px-8 py-3 border border-orange-500/30 bg-orange-500/10 rounded-full backdrop-blur-md">
                     <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                     <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em]">YENİ GÜN AKADEMİ</span>
                  </div>
                  <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-4xl font-bold text-slate-400 italic max-w-5xl mx-auto leading-relaxed">{slide.subtitle}</p>
               </div>
            ) : (
               <div className="grid grid-cols-12 gap-20 h-full items-center">
                  <div className="col-span-12 lg:col-span-7 space-y-16">
                     <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none border-l-[20px] border-orange-600 pl-12 text-white">
                       {slide.title}
                     </h2>
                     <div className="space-y-10 pl-16">
                        {(slide.content || []).map((point, i) => (
                           <div key={i} className="flex gap-6 items-start opacity-0 animate-slide-up" style={{ animationDelay: `${i * 300}ms`, animationFillMode: 'forwards' }}>
                              <div className="w-4 h-4 mt-3 bg-orange-600 rotate-45 shrink-0 shadow-[0_0_20px_#ea580c]"></div>
                              <p className="text-3xl md:text-4xl font-bold text-slate-300 leading-snug tracking-tight">{point}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="col-span-12 lg:col-span-5 flex flex-col gap-10 justify-center">
                     {slide.interactiveElement && (
                        <div className="bg-gradient-to-br from-orange-600 to-red-600 p-12 rounded-[4rem] shadow-[0_0_100px_rgba(234,88,12,0.4)] animate-pulse-slow relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                           <span className="text-[12px] font-black text-white/80 uppercase tracking-widest block mb-6 relative z-10">TARTIŞMA NOKTASI</span>
                           <p className="text-3xl font-black uppercase leading-tight italic relative z-10 text-white">"{slide.interactiveElement.question}"</p>
                        </div>
                     )}
                     <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 backdrop-blur-sm relative overflow-hidden">
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-6">VAKA ÖRNEĞİ</span>
                        <p className="text-2xl font-bold text-slate-400 italic leading-relaxed">"{slide.visualPrompt}"</p>
                        <div className="absolute bottom-0 right-0 p-8 opacity-10">
                           <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* SPEAKER NOTES OVERLAY */}
         {showNotes && (
            <div className="fixed bottom-32 right-12 w-[500px] bg-black/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl z-50 animate-slide-up">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  YÖNETİCİ NOTU (GİZLİ)
               </span>
               <p className="text-xl font-bold text-slate-300 leading-relaxed font-mono">{slide.speakerNotes}</p>
            </div>
         )}

         {/* PROFESSIONAL HUD (Head-Up Display) - Bottom Bar */}
         <div className="fixed bottom-0 left-0 w-full p-6 z-[100] flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-8 shadow-3xl transform translate-y-2 hover:translate-y-0 transition-transform">
               {/* Timer */}
               <div className="text-center border-r border-white/10 pr-8">
                  <p className="text-2xl font-black font-mono text-white">{formatTime(elapsedTime)}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">SÜRE</p>
               </div>

               {/* Navigation */}
               <div className="flex gap-2">
                  <button onClick={() => changeSlide('prev')} disabled={activeSlideIdx === 0} className="p-4 rounded-full bg-white/5 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-30">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="px-4 flex flex-col justify-center text-center w-24">
                     <span className="text-xl font-black text-white">{activeSlideIdx + 1} / {slides.length}</span>
                     <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">SLAYT</span>
                  </div>
                  <button onClick={() => changeSlide('next')} disabled={activeSlideIdx === slides.length - 1} className="p-4 rounded-full bg-white/5 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-30">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
               </div>

               <div className="w-px h-10 bg-white/10"></div>

               {/* Tools */}
               <div className="flex gap-3">
                  <button 
                    onClick={toggleAudio} 
                    className={`p-4 rounded-full transition-all ${autoPlayAudio || isSpeaking ? 'bg-emerald-600 text-white shadow-[0_0_15px_#10b981]' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    title="Nöral Seslendirme (S)"
                  >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </button>
                  <button 
                    onClick={toggleLaser} 
                    className={`p-4 rounded-full transition-all ${isLaserActive ? 'bg-red-600 text-white shadow-[0_0_15px_red]' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    title="Lazer İşaretleyici (L)"
                  >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  </button>
                  <button 
                    onClick={toggleBlackout} 
                    className={`p-4 rounded-full transition-all ${isBlackout ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    title="Odak Modu / Karart (B)"
                  >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  </button>
                  <button 
                    onClick={() => setShowNotes(prev => !prev)} 
                    className={`p-4 rounded-full transition-all ${showNotes ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    title="Yönetici Notları (N)"
                  >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </button>
               </div>

               <div className="w-px h-10 bg-white/10"></div>

               <button 
                 onClick={() => { stopAudio(); setMode('preview'); }}
                 className="p-4 rounded-full bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all"
                 title="Çıkış (ESC)"
               >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
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
                   <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{slides[activeSlideIdx]?.title}</h2>
                   <div className="px-4 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">{slides[activeSlideIdx]?.type}</div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-12">
                   <div className="space-y-4">
                      {(slides[activeSlideIdx]?.content || []).map((c, i) => (
                         <div key={i} className="flex gap-4 items-start">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 shrink-0"></div>
                            <p className="text-lg font-bold text-slate-600 leading-snug">{c}</p>
                         </div>
                      ))}
                   </div>
                   <div className="space-y-6">
                      {slides[activeSlideIdx]?.interactiveElement && (
                         <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mb-2">ETKİLEŞİM</span>
                            <p className="text-sm font-bold text-slate-800 italic">"{slides[activeSlideIdx].interactiveElement!.question}"</p>
                         </div>
                      )}
                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">GİZLİ NOT</span>
                         <p className="text-xs font-medium text-slate-500">{slides[activeSlideIdx]?.speakerNotes}</p>
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
