
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PresentationConfig, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';

interface PresentationStudioProps {
  onClose?: () => void;
}

const PresentationStudio: React.FC<PresentationStudioProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'config' | 'preview' | 'live'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  
  // Live Mode States (Internal Player)
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [showNotes, setShowNotes] = useState(false); 
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

  // --- EXPORT ENGINES ---

  const handleExportPPTX = () => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Yeni Gün Akademi - MIA AI';
    pptx.company = 'Yeni Gün Akademi';
    pptx.title = config.topic;

    // Master Slide Definition
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: '0F172A' },
      objects: [
        { rect: { x: 0, y: 0, w: '100%', h: 0.15, fill: { color: 'EA580C' } } }, // Top Orange Bar
        { text: { text: 'YENİ GÜN AKADEMİ | AKADEMİK KURUL', options: { x: 0.5, y: 0.05, w: '90%', fontSize: 10, color: 'FFFFFF', bold: true } } }
      ]
    });

    slides.forEach((slide, index) => {
      const s = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
      
      // Title
      s.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 32, bold: true, color: 'FFFFFF', fontFace: 'Arial' });
      
      // Subtitle or Content
      if (slide.type === 'title') {
         if (slide.subtitle) s.addText(slide.subtitle, { x: 0.5, y: 1.5, w: '90%', fontSize: 24, color: '94A3B8', italic: true });
      } else {
         const items = (slide.content || []).map(p => ({ text: p, options: { bullet: true, color: 'E2E8F0', fontSize: 18, breakLine: true } }));
         s.addText(items, { x: 0.5, y: 1.8, w: '60%', h: 4, valign: 'top' });
         
         // Visual Prompt Box
         if(slide.visualPrompt) {
             s.addShape(pptx.ShapeType.rect, { x: 7.5, y: 1.8, w: 5, h: 3, fill: { color: '1E293B' }, line: { color: 'EA580C', width: 1 } });
             s.addText("GÖRSEL TASVİRİ:", { x: 7.6, y: 1.9, fontSize: 10, color: 'EA580C', bold: true });
             s.addText(slide.visualPrompt, { x: 7.6, y: 2.2, w: 4.8, fontSize: 12, color: '94A3B8', italic: true });
         }
      }

      // Speaker Notes
      if(slide.speakerNotes) s.addNotes(slide.speakerNotes);
    });

    pptx.writeFile({ fileName: `YG_Sunum_${Date.now()}.pptx` });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    slides.forEach((slide, index) => {
        if (index > 0) doc.addPage();
        
        // Background
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(0, 0, 297, 210, 'F');
        
        // Header Bar
        doc.setFillColor(234, 88, 12); // Orange-600
        doc.rect(0, 0, 297, 5, 'F');

        // Content
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        const titleLines = doc.splitTextToSize(slide.title.toUpperCase(), 250);
        doc.text(titleLines, 20, 30);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(203, 213, 225); // Slate-300
        
        let yPos = 60;
        if (slide.subtitle) {
            doc.text(slide.subtitle, 20, 50);
            yPos = 70;
        }

        (slide.content || []).forEach(point => {
            const lines = doc.splitTextToSize(`• ${point}`, 250);
            doc.text(lines, 20, yPos);
            yPos += (lines.length * 8) + 5;
        });

        // Notes Footer
        if(slide.speakerNotes) {
            doc.setFillColor(30, 41, 59); // Slate-800
            doc.rect(0, 180, 297, 30, 'F');
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184); // Slate-400
            doc.text("YÖNETİCİ NOTU:", 20, 190);
            doc.setTextColor(255, 255, 255);
            const noteLines = doc.splitTextToSize(slide.speakerNotes, 260);
            doc.text(noteLines, 20, 196);
        }
        
        // Page Number
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Slayt ${index + 1} / ${slides.length}`, 280, 205, { align: 'right' });
    });

    doc.save(`YG_Sunum_${Date.now()}.pdf`);
  };

  const handleSaveToArchive = async () => {
    if (!slides || slides.length === 0) return;
    setIsSaving(true);

    try {
      // 1. BENZERSİZ KİMLİK OLUŞTURMA (Primary Key Constraint Çözümü)
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const uniqueId = `PRES-${timestamp}-${randomSuffix}`;
      
      // 2. SENTETİK E-POSTA OLUŞTURMA (Unique Constraint Çözümü)
      // candidates tablosunda email unique olduğu için, her sunum için benzersiz bir "sistem maili" uyduruyoruz.
      const syntheticEmail = `lib.${uniqueId}@system.yenigun.local`;

      const archivePayload = {
        id: uniqueId, // DB'nin Primary Key beklediği alan
        name: config.topic || 'İsimsiz Akademik Sunum',
        branch: 'AKADEMİK MATERYAL',
        email: syntheticEmail, 
        phone: '0000000000',
        status: 'archived',
        archiveCategory: 'PRESENTATION_LIBRARY',
        archiveNote: `TÜR: ${config.targetAudience.toUpperCase()} | TON: ${config.tone.toUpperCase()} | TARİH: ${new Date().toLocaleDateString('tr-TR')}`,
        // Rapor objesini DB'nin beklediği formata uygun hale getiriyoruz
        report: {
          score: 100, 
          integrityIndex: 100,
          presentationSlides: slides,
          presentationConfig: config,
          summary: `Nöral Stüdyo tarafından üretilen ${slides.length} slaytlık akademik materyal.`,
          // Frontend'in hata vermemesi için boş şemalar
          deepAnalysis: {},
          predictiveMetrics: {},
          swot: {},
          interviewGuidance: {}
        }
      };

      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(archivePayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.message || "Sunucu hatası");
      }
      
      alert("Sunum başarıyla Akademik Kütüphane'ye mühürlendi. Arşiv modülünden erişebilirsiniz.");
    } catch (e: any) {
      console.error("Archive Error:", e);
      alert(`Kayıt Başarısız: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLaunchSeparateWindow = () => {
    // Standalone Player HTML Generator
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.topic} - Canlı Sunum</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0f172a; color: white; overflow: hidden; user-select: none; }
          .slide-enter { animation: fadeIn 0.8s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .laser { width: 20px; height: 20px; background: red; border-radius: 50%; position: absolute; pointer-events: none; box-shadow: 0 0 15px red; z-index: 9999; display: none; }
        </style>
      </head>
      <body>
        <div id="laser" class="laser"></div>
        
        <!-- Start Screen -->
        <div id="start-screen" class="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 z-50">
           <h1 class="text-4xl font-black text-white mb-8">SUNUM HAZIR</h1>
           <button onclick="startPresentation()" class="px-10 py-5 bg-orange-600 hover:bg-white hover:text-orange-600 text-white rounded-full font-black uppercase tracking-[0.2em] transition-all shadow-2xl">
             TAM EKRAN BAŞLAT
           </button>
        </div>

        <!-- Main Stage -->
        <div id="stage" class="fixed inset-0 hidden flex flex-col p-16">
           <div class="flex-1 flex flex-col justify-center" id="slide-container">
              <!-- Dynamic Content -->
           </div>
           
           <!-- Controls -->
           <div class="fixed bottom-0 left-0 w-full p-6 flex justify-between items-end opacity-0 hover:opacity-100 transition-opacity duration-500">
              <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest" id="progress-text"></div>
              <div class="flex gap-4">
                 <button onclick="prevSlide()" class="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all">←</button>
                 <button onclick="nextSlide()" class="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all">→</button>
              </div>
           </div>
        </div>

        <script>
          const slides = ${JSON.stringify(slides)};
          let currentIdx = 0;
          let isLaser = false;

          function renderSlide() {
            const s = slides[currentIdx];
            const container = document.getElementById('slide-container');
            const progress = document.getElementById('progress-text');
            
            progress.innerText = \`SLAYT \${currentIdx + 1} / \${slides.length}\`;

            let html = '';
            if(s.type === 'title') {
               html = \`
                 <div class="text-center slide-enter space-y-8">
                    <span class="px-4 py-2 bg-orange-600/20 text-orange-500 rounded-full text-xs font-black uppercase tracking-[0.4em]">YENİ GÜN AKADEMİ</span>
                    <h1 class="text-7xl md:text-8xl font-black uppercase leading-tight">\${s.title}</h1>
                    <p class="text-3xl text-slate-400 italic">\${s.subtitle || ''}</p>
                 </div>
               \`;
            } else {
               html = \`
                 <div class="grid grid-cols-12 gap-12 items-center slide-enter h-full">
                    <div class="col-span-7 space-y-12">
                       <h2 class="text-6xl font-black uppercase leading-none border-l-8 border-orange-600 pl-8">\${s.title}</h2>
                       <div class="space-y-6 pl-10">
                          \${(s.content || []).map(p => \`<p class="text-3xl font-bold text-slate-300 leading-snug flex gap-4"><span class="text-orange-600">▪</span> \${p}</p>\`).join('')}
                       </div>
                    </div>
                    <div class="col-span-5 flex flex-col gap-8 justify-center">
                       \${s.visualPrompt ? \`<div class="p-8 bg-white/5 rounded-[3rem] border border-white/10 italic text-slate-400 text-xl">\${s.visualPrompt}</div>\` : ''}
                       \${s.interactiveElement ? \`<div class="p-10 bg-orange-600 rounded-[3rem] text-white shadow-2xl"><span class="text-xs font-black uppercase tracking-widest block mb-4 text-orange-200">TARTIŞMA</span><p class="text-2xl font-black uppercase italic">"\${s.interactiveElement.question}"</p></div>\` : ''}
                    </div>
                 </div>
               \`;
            }
            container.innerHTML = html;
          }

          function nextSlide() {
            if(currentIdx < slides.length - 1) { currentIdx++; renderSlide(); }
          }
          function prevSlide() {
            if(currentIdx > 0) { currentIdx--; renderSlide(); }
          }

          function startPresentation() {
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('stage').style.display = 'flex';
            document.documentElement.requestFullscreen().catch(e => console.log(e));
            renderSlide();
          }

          // Keyboard & Laser
          document.addEventListener('keydown', (e) => {
             if(e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
             if(e.key === 'ArrowLeft') prevSlide();
             if(e.key === 'l') { isLaser = !isLaser; document.getElementById('laser').style.display = isLaser ? 'block' : 'none'; document.body.style.cursor = isLaser ? 'none' : 'default'; }
          });

          document.addEventListener('mousemove', (e) => {
             if(isLaser) {
                const l = document.getElementById('laser');
                l.style.left = (e.clientX - 10) + 'px';
                l.style.top = (e.clientY - 10) + 'px';
             }
          });
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1280,height=720');
  };

  const handleGenerate = async () => {
    if (!config.topic) return alert("Lütfen bir konu başlığı giriniz.");
    setIsGenerating(true);
    try {
      const generatedSlides = await armsService.generateCustomPresentation(config);
      setSlides(generatedSlides);
      setMode('preview');
      setActiveSlideIdx(0);
    } catch (e) {
      alert("AI Sunum Hatası: Lütfen tekrar deneyiniz.");
    } finally {
      setIsGenerating(false);
    }
  };

  const changeSlide = (direction: 'prev' | 'next') => {
    setActiveSlideIdx(prev => {
      if (direction === 'next') return Math.min(prev + 1, slides.length - 1);
      return Math.max(prev - 1, 0);
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLaserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Keyboard Listeners for Live Mode
  useEffect(() => {
    if (mode !== 'live') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') changeSlide('next');
      if (e.key === 'ArrowLeft') changeSlide('prev');
      if (e.key === 'l') setIsLaserActive(prev => !prev);
      if (e.key === 'b') setIsBlackout(prev => !prev);
      if (e.key === 'Escape') setMode('preview');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, slides.length]); // Added slides.length for safety
  
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

  // --- LIVE MODE ---
  if (mode === 'live') {
      const slide = slides[activeSlideIdx];
      if (!slide) return <div className="text-white text-center p-20">Slayt Verisi Yüklenemedi</div>;
      
      return (
        <div 
            className={`fixed inset-0 z-[1000] bg-slate-950 text-white flex flex-col overflow-hidden transition-colors duration-700 ${isLaserActive ? 'cursor-none' : 'cursor-default'}`}
            onMouseMove={handleMouseMove}
        >
             {isLaserActive && (
               <div 
                 className="fixed w-4 h-4 bg-red-500 rounded-full pointer-events-none z-[2000] shadow-[0_0_15px_rgba(255,0,0,0.8)]"
                 style={{ left: laserPos.x - 8, top: laserPos.y - 8 }}
               />
             )}

             {/* BLACKOUT CURTAIN */}
             {isBlackout && (
               <div className="absolute inset-0 bg-black z-[1500] flex items-center justify-center">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] animate-pulse">ODAK MODU AKTİF</p>
               </div>
             )}
             
             <div className="flex-1 flex flex-col p-16 md:p-32 relative z-10 justify-center h-screen">
                {slide.type === 'title' ? (
                   <div className="text-center space-y-12 animate-scale-in origin-center">
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
                               <p key={i} className="text-3xl md:text-4xl font-bold text-slate-300 leading-snug tracking-tight flex gap-6"><span className="text-orange-600">▪</span> {point}</p>
                            ))}
                         </div>
                      </div>
                      <div className="col-span-12 lg:col-span-5 flex flex-col gap-10 justify-center">
                         <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 backdrop-blur-sm">
                            <p className="text-2xl font-bold text-slate-400 italic leading-relaxed">"{slide.visualPrompt}"</p>
                         </div>
                      </div>
                   </div>
                )}
             </div>

             {/* HUD */}
             <div className="fixed bottom-0 left-0 w-full p-6 z-[100] flex justify-center">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-8 shadow-3xl">
                   <button onClick={() => changeSlide('prev')} className="p-4 rounded-full bg-white/5 hover:bg-white hover:text-slate-900">←</button>
                   <span className="text-xl font-black text-white">{activeSlideIdx + 1} / {slides.length}</span>
                   <button onClick={() => changeSlide('next')} className="p-4 rounded-full bg-white/5 hover:bg-white hover:text-slate-900">→</button>
                   <button onClick={() => setMode('preview')} className="p-4 rounded-full bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white">ÇIKIŞ</button>
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
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight ml-4 truncate max-w-xl">{config.topic}</h3>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={handleSaveToArchive} disabled={isSaving} className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-md flex items-center gap-2">
                {isSaving ? 'MÜHÜRLENİYOR...' : 'KÜTÜPHANEYE MÜHÜRLE'}
             </button>

             <div className="w-px h-8 bg-slate-200 mx-2"></div>

             <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={handleExportPDF} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-all">PDF İNDİR</button>
               <div className="w-px bg-slate-200 my-1"></div>
               <button onClick={handleExportPPTX} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-all">PPTX İNDİR</button>
             </div>
             
             <button onClick={handleLaunchSeparateWindow} className="px-6 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                AYRI PENCEREDE AÇ
             </button>

             <button onClick={() => setMode('live')} className="px-8 py-4 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                CANLI SUNUM MODU
             </button>
          </div>
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
