
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PresentationConfig, TrainingSlide, VisualStyle, SlideLayout, PresentationTheme, StaffMember } from '../../types';
import { armsService } from '../../services/ai/armsService';
import { storageService } from '../../services/storageService';
import { TRAINING_CATALOG, TrainingTemplate } from '../../constants/trainingPlans';
import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  const encoded = encodeURIComponent(`${prompt}, high resolution photography, cinematic lighting, professional studio shot, 4k`);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}`;
};

const PresentationStudio: React.FC<PresentationStudioProps> = ({ initialConfig, onClose }) => {
  const [mode, setMode] = useState<'catalog' | 'config' | 'editor' | 'live'>('catalog');
  const [selectedTemplate, setSelectedTemplate] = useState<TrainingTemplate | null>(null);
  const [slides, setSlides] = useState<TrainingSlide[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'assign' | 'ai'>('design');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  const [config, setConfig] = useState<PresentationConfig>(initialConfig || {
    topic: '', targetAudience: 'team', tone: 'academic', depth: 'intermediate',
    slideCount: 8, visualStyle: 'corporate', includeAnimations: true
  });

  const activeTheme = THEMES[config.visualStyle] || THEMES.corporate;
  const slide = slides[activeIdx];

  useEffect(() => {
    const loadStaff = async () => {
        const res = await fetch('/api/staff?action=list_all');
        if (res.ok) setStaffList(await res.json());
    };
    loadStaff();
  }, []);

  // --- ENGINE ACTIONS ---

  const handleSelectTemplate = (temp: TrainingTemplate) => {
    setSelectedTemplate(temp);
    setConfig({ ...config, topic: temp.title, slideCount: temp.suggestedSlides });
    setMode('config');
  };

  const handleGenerate = async () => {
    if (!config.topic) return;
    setIsGenerating(true);
    setLoadingMsg("Nöral Sentez Başlatıldı...");
    try {
      let result;
      if (selectedTemplate) {
        result = await armsService.generateFromCatalogTemplate(selectedTemplate, config);
      } else {
        result = await armsService.generateCustomPresentation(config);
      }
      
      const withImages = result.map(s => ({
          ...s,
          generatedImageUrl: s.generatedImageUrl || getNeuralImageUrl(s.visualPrompt || s.imageKeyword || config.topic)
      }));
      setSlides(withImages);
      setMode('editor');
    } catch (e) { alert("AI Bağlantı Hatası."); }
    finally { setIsGenerating(false); }
  };

  const updateSlide = (field: keyof TrainingSlide, value: any) => {
    const next = [...slides];
    next[activeIdx] = { ...next[activeIdx], [field]: value };
    setSlides(next);
  };

  const handleRefine = async (intent: string) => {
      setIsProcessing(true);
      try {
          const refined = await armsService.refineSlideContent(slides[activeIdx], intent);
          const next = [...slides];
          next[activeIdx] = { ...next[activeIdx], ...refined };
          setSlides(next);
      } finally { setIsProcessing(false); }
  };

  // --- OUTPUT ACTIONS ---

  const handleDownloadPPTX = () => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    slides.forEach(s => {
        const pS = pptx.addSlide();
        pS.background = { color: activeTheme.backgroundColor.replace('#', '') };
        pS.addText(s.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: activeTheme.primaryColor.replace('#', '') });
        if (s.content) pS.addText(s.content.join('\n\n'), { x: 0.5, y: 1.5, w: '90%', fontSize: 18, color: activeTheme.textColor.replace('#', '') });
    });
    pptx.writeFile({ fileName: `YG_Sunum_${config.topic.replace(/\s/g, '_')}.pptx` });
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('presentation-canvas');
    if (!element) return;
    setIsProcessing(true);
    try {
        const pdf = new jsPDF('l', 'mm', 'a4');
        for (let i = 0; i < slides.length; i++) {
            setActiveIdx(i);
            await new Promise(r => setTimeout(r, 800));
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
        }
        pdf.save(`YG_Akademik_Sunum_${config.topic.replace(/\s/g, '_')}.pdf`);
        setActiveIdx(0);
    } finally { setIsProcessing(false); }
  };

  const handleArchive = async () => {
      setIsProcessing(true);
      try {
          const archivePayload = {
              id: `PRES-${Date.now()}`,
              name: config.topic,
              branch: 'AKADEMİK SUNUM',
              email: `lib.${Date.now()}@yenigun.local`,
              status: 'archived',
              archiveCategory: 'PRESENTATION_LIBRARY',
              archiveNote: `${slides.length} Slaytlık Nöral Materyal. Şablon: ${selectedTemplate?.id || 'Custom'}`,
              report: { presentationSlides: slides, score: 100 }
          };
          await storageService.saveCandidate(archivePayload as any);
          alert("Sunum kütüphaneye mühürlendi.");
      } finally { setIsProcessing(false); }
  };

  const handleAssignToStaff = async (staffId: string) => {
      const target = staffList.find(s => s.id === staffId);
      if (!target || !confirm(`${target.name} personeli için eğitim müfredatı oluşturulsun mu?`)) return;
      setIsProcessing(true);
      try {
          const idp = await armsService.convertPresentationToIDP(target, slides, config.topic);
          await fetch('/api/staff?action=save_idp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ staffId, data: idp })
          });
          alert(`Bu sunum baz alınarak ${target.name} için gelişim rotası oluşturuldu.`);
      } finally { setIsProcessing(false); }
  };

  // --- VIEWS ---

  if (mode === 'catalog') {
    return (
      <div className="fixed inset-0 z-[3000] bg-slate-950 flex flex-col items-center p-12 overflow-y-auto no-scrollbar animate-fade-in">
        <div className="max-w-7xl w-full">
           <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
              <div>
                 <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1 bg-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">STUDIO v7.0</span>
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Hizmet İçi Eğitim Katalogu</span>
                 </div>
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Akademik Müfredat Kütüphanesi</h2>
              </div>
              <button onClick={onClose} className="px-10 py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">İptal</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TRAINING_CATALOG.map(temp => (
                <div 
                   key={temp.id} 
                   onClick={() => handleSelectTemplate(temp)}
                   className="bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] hover:border-orange-500 hover:shadow-[0_0_80px_rgba(234,88,12,0.1)] transition-all cursor-pointer group flex flex-col justify-between"
                >
                   <div>
                      <div className="flex justify-between items-start mb-10">
                         <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                            temp.category === 'clinical' ? 'bg-blue-600 text-white' :
                            temp.category === 'parent' ? 'bg-emerald-600 text-white' :
                            temp.category === 'ethics' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-white'
                         }`}>
                            {temp.category}
                         </span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">{temp.suggestedSlides} Slayt</span>
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-6 group-hover:text-orange-500 transition-colors">{temp.title}</h4>
                      <p className="text-[12px] font-medium text-slate-400 leading-relaxed mb-10 italic">"{temp.description}"</p>
                      
                      <div className="space-y-3">
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Temel Odak Noktaları:</span>
                         {temp.coreUnits.map((u, i) => (
                            <div key={i} className="flex gap-3 items-start">
                               <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5 shrink-0"></div>
                               <span className="text-[11px] font-bold text-slate-300">{u.title}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kitle: {temp.targetAudience}</span>
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                   </div>
                </div>
              ))}

              <div 
                 onClick={() => setMode('config')}
                 className="bg-transparent border-4 border-dashed border-white/5 p-10 rounded-[3.5rem] flex flex-col items-center justify-center text-center hover:border-orange-500/50 hover:bg-white/[0.02] transition-all cursor-pointer group"
              >
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 </div>
                 <h4 className="text-xl font-black text-slate-500 uppercase tracking-widest">Özel Konu Tanımla</h4>
                 <p className="text-[10px] font-bold text-slate-600 uppercase mt-4">Katalog dışı, kurumunuza özel bir eğitim başlığı oluşturun.</p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (mode === 'config') {
    return (
      <div className="fixed inset-0 z-[3000] bg-[#0f172a] flex items-center justify-center p-8 animate-fade-in">
        <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
          <div className="w-full md:w-1/3 bg-slate-900 p-16 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black mb-10 rotate-6 shadow-2xl">YG</div>
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.85]">Neural<br/>Presentation<br/>Studio</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-8 border-l-2 border-orange-600 pl-4">v7.0 AI Expansion</p>
             </div>
             {selectedTemplate && (
                <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                   <p className="text-[10px] font-black text-orange-500 uppercase mb-2">Seçili Şablon</p>
                   <p className="text-sm font-bold text-slate-300">{selectedTemplate.title}</p>
                </div>
             )}
             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="flex-1 p-20 flex flex-col justify-center bg-slate-50">
             <div className="max-w-md mx-auto w-full space-y-12">
                <div className="space-y-4">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">EĞİTİM BAŞLIĞI</label>
                   <input 
                     type="text" 
                     className="w-full p-8 bg-white rounded-[2.5rem] text-3xl font-black text-slate-900 border-4 border-transparent focus:border-orange-500 outline-none transition-all placeholder:text-slate-200 shadow-xl"
                     placeholder="Konu giriniz..."
                     value={config.topic}
                     onChange={e => setConfig({...config, topic: e.target.value})}
                   />
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">GÖRSEL STİL</label>
                      <select className="w-full p-5 bg-white rounded-2xl font-bold text-xs shadow-md" value={config.visualStyle} onChange={e => setConfig({...config, visualStyle: e.target.value as any})}>
                         {Object.entries(THEMES).map(([k, t]) => <option key={k} value={k}>{t.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">KİTLE TONU</label>
                      <select className="w-full p-5 bg-white rounded-2xl font-bold text-xs shadow-md" value={config.tone} onChange={e => setConfig({...config, tone: e.target.value as any})}>
                         <option value="academic">Akademik / Resmi</option>
                         <option value="motivational">Motivasyonel</option>
                         <option value="strict">Disiplin Odaklı</option>
                      </select>
                   </div>
                </div>

                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !config.topic}
                  className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                >
                   {isGenerating ? <span className="flex items-center justify-center gap-3 animate-pulse">{loadingMsg}</span> : 'MATERYALİ SENTEZLE'}
                </button>
                <button onClick={() => setMode('catalog')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600">Katalog Seçimine Dön</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'editor') {
    return (
      <div className="fixed inset-0 z-[3000] bg-[#f8fafc] flex flex-col overflow-hidden animate-fade-in font-sans">
        {/* TOP TOOLBAR */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50 shadow-sm">
           <div className="flex items-center gap-6">
              <button onClick={() => setMode('catalog')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <div className="flex flex-col">
                 <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 leading-none">{config.topic}</h3>
                 <span className="text-[10px] font-bold text-orange-600 mt-1 uppercase tracking-wide">{activeTheme.name} Tasarım Modu</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-xl mr-4 border border-slate-200 shadow-inner">
                 <button onClick={handleDownloadPPTX} className="px-5 py-2 hover:bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">PPTX</button>
                 <button onClick={handleDownloadPDF} className="px-5 py-2 hover:bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">PDF</button>
              </div>
              <button onClick={handleArchive} disabled={isProcessing} className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">ARŞİVE MÜHÜRLE</button>
              <button onClick={() => setMode('live')} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl flex items-center gap-2">
                 <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> SUNUMU OYNAT
              </button>
              <button onClick={() => setIsInspectorOpen(!isInspectorOpen)} className={`p-2.5 rounded-xl transition-all ${isInspectorOpen ? 'bg-orange-50 text-orange-600' : 'text-slate-300'}`}>
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </button>
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* SLIDE SORTER */}
           <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLAYTLAR ({slides.length})</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 bg-slate-50/30">
                 {slides.map((s, i) => (
                    <div 
                      key={s.id} 
                      onClick={() => setActiveIdx(i)}
                      className={`group relative aspect-video bg-white rounded-2xl border-4 cursor-pointer transition-all overflow-hidden ${activeIdx === i ? 'border-orange-500 shadow-2xl ring-4 ring-orange-100 scale-105 z-10' : 'border-white hover:border-slate-200 opacity-60 hover:opacity-100'}`}
                    >
                       <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-black z-20 ${activeIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{i+1}</div>
                       <div className="absolute inset-0 flex flex-col p-3 scale-[0.35] origin-top-left w-[285%] h-[285%] pointer-events-none select-none">
                          <h4 className="text-4xl font-black mb-4" style={{ color: activeTheme.primaryColor }}>{s.title}</h4>
                          <div className="h-6 bg-slate-100 rounded-full w-full mb-2"></div>
                          <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* MAIN CANVAS */}
           <div className="flex-1 bg-slate-200 flex items-center justify-center p-12 overflow-hidden relative">
              {isProcessing && (
                  <div className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-slate-900 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">İşlem Gerçekleştiriliyor...</p>
                  </div>
              )}
              <div 
                id="presentation-canvas"
                className="aspect-video w-full max-w-5xl bg-white shadow-[0_60px_120px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden relative group transition-all duration-500"
                style={{ fontFamily: activeTheme.fontFamily, backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}
              >
                 {slide?.generatedImageUrl && (
                    <div className={`absolute inset-0 z-0 ${slide.layout === 'split_left' ? 'left-1/2' : slide.layout === 'split_right' ? 'right-1/2' : ''}`}>
                       <img src={slide.generatedImageUrl} className="w-full h-full object-cover animate-fade-in" style={{ filter: activeTheme.backgroundImageStyle }} key={slide.generatedImageUrl} />
                       <div className={`absolute inset-0 ${slide.layout === 'cover' || slide.layout === 'full_visual' ? 'bg-black/40 backdrop-blur-[1px]' : ''}`}></div>
                    </div>
                 )}
                 
                 <div className={`relative z-10 h-full p-24 flex flex-col ${slide?.layout === 'cover' || slide?.layout === 'full_visual' ? 'text-white' : ''}`}>
                    {slide?.layout === 'cover' && (
                       <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12 animate-scale-in">
                          <span className="px-10 py-3 bg-orange-600 text-white text-[12px] font-black uppercase tracking-[0.5em] rounded-full shadow-2xl">YENİ GÜN AKADEMİ</span>
                          <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">{slide.title}</h1>
                          <p className="text-3xl font-medium italic opacity-90 border-t border-white/20 pt-8 max-w-4xl">{slide.subtitle}</p>
                       </div>
                    )}
                    {(slide?.layout === 'split_left' || slide?.layout === 'split_right') && (
                       <div className={`grid grid-cols-2 gap-16 h-full items-center ${slide.layout === 'split_right' ? 'direction-rtl text-right' : ''}`}>
                          <div className="space-y-12 animate-slide-up">
                             <h2 className="text-7xl font-black uppercase tracking-tight leading-[0.9] border-l-[24px] pl-10" style={{ borderColor: activeTheme.secondaryColor, color: activeTheme.primaryColor }}>{slide.title}</h2>
                             <div className="space-y-8 pl-12">
                                {slide.content?.map((c, i) => (
                                   <p key={i} className="text-3xl font-bold opacity-90 leading-snug flex items-start gap-6">
                                      <span className="mt-2" style={{ color: activeTheme.secondaryColor }}>▪</span> {c}
                                   </p>
                                ))}
                             </div>
                          </div>
                       </div>
                    )}
                    {slide?.layout === 'bullet_list' && (
                        <div className="h-full flex flex-col justify-center space-y-16 pl-16 border-l-[20px] animate-fade-in" style={{ borderColor: activeTheme.accentColor }}>
                            <h2 className="text-8xl font-black uppercase tracking-tighter" style={{ color: activeTheme.primaryColor }}>{slide.title}</h2>
                            <div className="space-y-10 pl-12">
                                {slide.content?.map((c, i) => (
                                    <div key={i} className="flex items-start gap-10 group/item">
                                        <div className="w-8 h-8 rounded-2xl mt-3 shrink-0 shadow-xl transition-transform group-hover/item:scale-125" style={{ backgroundColor: activeTheme.secondaryColor }}></div>
                                        <p className="text-4xl font-bold opacity-90 leading-tight">{c}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
              </div>
           </div>

           {/* ATOMIC INSPECTOR */}
           <div className={`w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 transition-all duration-500 ${isInspectorOpen ? '' : '-mr-96'}`}>
              <div className="flex border-b border-slate-100">
                 {['design', 'content', 'assign', 'ai'].map(t => (
                   <button 
                     key={t} 
                     onClick={() => setActiveTab(t as any)} 
                     className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === t ? 'border-orange-600 text-orange-600 bg-orange-50/30' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                   >
                      {t === 'ai' ? 'Nöral' : t === 'assign' ? 'Atama' : t === 'design' ? 'Dizayn' : 'İçerik'}
                   </button>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                 {activeTab === 'design' && (
                   <>
                      <div className="space-y-6">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SAHNE DÜZENİ</label>
                         <div className="grid grid-cols-2 gap-3">
                            {['cover', 'split_left', 'split_right', 'bullet_list', 'full_visual', 'quote_center', 'data_grid', 'process_flow'].map(l => (
                              <button key={l} onClick={() => updateSlide('layout', l as SlideLayout)} className={`p-4 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${slide?.layout === l ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-orange-300'}`}>
                                 {l.replace('_', ' ')}
                              </button>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-6">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NÖRAL GÖRSEL</label>
                         <div className="aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden relative group border-4 border-slate-200">
                            <img src={slide?.generatedImageUrl} className="w-full h-full object-cover" />
                            <button onClick={() => updateSlide('generatedImageUrl', getNeuralImageUrl(`${slide.visualPrompt || config.topic} ${Math.random()}`))} className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-4 backdrop-blur-sm">
                               <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
                               <span className="text-[10px] font-black uppercase tracking-widest">YENİDEN SENTEZLE</span>
                            </button>
                         </div>
                      </div>
                   </>
                 )}

                 {activeTab === 'content' && (
                   <div className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase">ANA BAŞLIK</label>
                         <input type="text" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase" value={slide?.title} onChange={e => updateSlide('title', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase">İÇERİK MADDELERİ</label>
                         <textarea className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-xs h-64 leading-relaxed" value={slide?.content?.join('\n')} onChange={e => updateSlide('content', e.target.value.split('\n'))} />
                      </div>
                   </div>
                 )}

                 {activeTab === 'assign' && (
                   <div className="space-y-8 animate-slide-up">
                      <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                         <h4 className="text-[11px] font-black uppercase tracking-widest mb-4">Müfredat Dönüşümü</h4>
                         <p className="text-xs font-bold leading-relaxed opacity-90">Bu sunumu bir eğitim planına dönüştürüp personelin paneline atayın. Personel bu konuyu tamamladığında liyakat skoru güncellenecektir.</p>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">PERSONEL SEÇİN</label>
                         <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {staffList.map(s => (
                               <button key={s.id} onClick={() => handleAssignToStaff(s.id)} className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-orange-500 hover:shadow-xl transition-all text-left group">
                                  <p className="text-[12px] font-black text-slate-900 group-hover:text-orange-600 uppercase transition-colors">{s.name}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{s.branch}</p>
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'ai' && (
                    <div className="space-y-6">
                        <div className="p-8 bg-indigo-50 rounded-[2.5rem] border-2 border-indigo-100 shadow-sm">
                            <h5 className="text-[11px] font-black text-indigo-700 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                                Nöral Dönüşüm
                            </h5>
                            <div className="space-y-2">
                                {['Daha Akademik Sentezle', 'Veli Dilinde Basitleştir', 'Maddeleri Vurucu Hale Getir', 'İstatistiksel Veri Ekle', 'Etkileşimli Soru Üret'].map(opt => (
                                    <button 
                                      key={opt} 
                                      onClick={() => handleRefine(opt)}
                                      disabled={isProcessing}
                                      className="w-full text-left p-4 bg-white border-2 border-indigo-100 rounded-xl text-[10px] font-black text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-widest"
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

  return null;
};

export default PresentationStudio;
