
import React, { useState, useEffect } from 'react';
import { CustomTrainingPlan, CustomTrainingSlide, MultimodalElement, Branch } from '../../types';
import { armsService } from '../../services/ai/armsService';

interface MultimodalStudioProps {
  onClose: () => void;
  initialPlan?: CustomTrainingPlan | null;
}

const MultimodalStudio: React.FC<MultimodalStudioProps> = ({ onClose, initialPlan }) => {
  const [plan, setPlan] = useState<CustomTrainingPlan>(initialPlan || {
    id: `CUR-${Date.now()}`,
    title: 'Yeni Klinik Uzmanlık Eğitimi',
    category: 'CLINICAL',
    level: 'Intermediate',
    description: 'Eğitim vizyonu ve metodolojik derinlik özeti.',
    targetBranches: 'ALL',
    slides: [{ id: 's1', title: 'Giriş ve Kavramsal Çerçeve', elements: [], speakerNotes: '' }],
    createdBy: 'Sistem Yöneticisi',
    createdAt: Date.now()
  });

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  const activeSlide = plan.slides[activeSlideIdx];

  const addSlide = () => {
    const newSlide: CustomTrainingSlide = {
      id: `s-${Date.now()}`,
      title: 'Yeni Slayt',
      elements: [],
      speakerNotes: ''
    };
    setPlan({ ...plan, slides: [...plan.slides, newSlide] });
    setActiveSlideIdx(plan.slides.length);
  };

  const addElement = (type: MultimodalElement['type']) => {
    const newEl: MultimodalElement = {
      id: `el-${Date.now()}`,
      type,
      content: type === 'interactive_case' ? { question: '', options: [] } : '',
      metadata: { layout: 'full', importance: 'normal' }
    };
    const newSlides = [...plan.slides];
    newSlides[activeSlideIdx].elements.push(newEl);
    setPlan({ ...plan, slides: newSlides });
  };

  const updateElement = (elId: string, content: any) => {
    const newSlides = [...plan.slides];
    const el = newSlides[activeSlideIdx].elements.find(e => e.id === elId);
    if (el) el.content = content;
    setPlan({ ...plan, slides: newSlides });
  };

  const handleAiRefine = async () => {
    setIsAiSuggesting(true);
    try {
      // AI'ya mevcut slaydı verip daha profesyonel elementler veya metinler önermesini istiyoruz
      const prompt = `Mevcut slayt içeriğini geliştir: ${JSON.stringify(activeSlide)}`;
      const suggestion = await armsService.generateCustomPresentation({
          topic: activeSlide.title,
          targetAudience: 'team',
          tone: 'academic',
          depth: 'expert',
          slideCount: 1
      });
      // Gelen ilk slaytı mevcut slayt ile merge et (basit örnek)
      if (suggestion && suggestion[0]) {
         const newSlides = [...plan.slides];
         newSlides[activeSlideIdx].speakerNotes += "\nAI TAVSİYESİ: " + suggestion[0].speakerNotes;
         setPlan({ ...plan, slides: newSlides });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const savePlan = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      if (res.ok) alert("Müfredat Veritabanına Mühürlendi.");
    } catch (e) {
      alert("Bağlantı Hatası.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950 flex flex-col animate-fade-in overflow-hidden">
      
      {/* 1. TOP NAVIGATION BAR */}
      <div className="h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
         <div className="flex items-center gap-6">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-all">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <input 
              type="text" 
              className="bg-transparent text-white font-black text-lg uppercase tracking-tight outline-none focus:text-orange-500 transition-colors w-96"
              value={plan.title}
              onChange={e => setPlan({...plan, title: e.target.value})}
            />
         </div>

         <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TASLAK OTOMATİK KAYDEDİLDİ</span>
            <button 
               onClick={savePlan}
               disabled={isSaving}
               className="px-8 py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-white hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50"
            >
               {isSaving ? 'MÜHÜRLENİYOR...' : 'YAYINLA VE KAYDET'}
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* 2. LEFT: SLIDE PREVIEW STRIP */}
         <div className="w-64 bg-slate-900/50 border-r border-white/5 flex flex-col shrink-0">
            <div className="p-4 flex justify-between items-center border-b border-white/5">
               <span className="text-[9px] font-black text-slate-500 uppercase">Slayt Akışı</span>
               <button onClick={addSlide} className="w-6 h-6 bg-white/10 text-white rounded flex items-center justify-center hover:bg-orange-600 transition-all">+</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
               {plan.slides.map((s, idx) => (
                  <div 
                    key={s.id} 
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`aspect-video rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex items-center justify-center p-2 group ${activeSlideIdx === idx ? 'border-orange-500 bg-slate-800' : 'border-transparent bg-slate-900 hover:border-white/20'}`}
                  >
                     <span className="text-[8px] font-black text-slate-600 absolute top-2 left-2">{idx + 1}</span>
                     <p className="text-[8px] font-bold text-slate-400 text-center uppercase leading-tight line-clamp-2">{s.title}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* 3. CENTER: CANVAS AREA */}
         <div className="flex-1 bg-slate-950 p-12 overflow-y-auto custom-scrollbar flex flex-col items-center">
            
            <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] aspect-video flex flex-col overflow-hidden relative group">
               {/* Slide Title Input */}
               <div className="p-10 pb-0">
                  <input 
                    type="text"
                    className="w-full text-4xl font-black text-slate-900 uppercase tracking-tighter outline-none border-l-8 border-orange-600 pl-8 focus:border-slate-900 transition-all"
                    value={activeSlide.title}
                    onChange={e => {
                       const newSlides = [...plan.slides];
                       newSlides[activeSlideIdx].title = e.target.value;
                       setPlan({...plan, slides: newSlides});
                    }}
                    placeholder="Slayt Başlığı..."
                  />
               </div>

               {/* Dynamic Elements Canvas */}
               <div className="flex-1 p-10 space-y-6">
                  {activeSlide.elements.map((el) => (
                     <div key={el.id} className="relative group/el">
                        {el.type === 'text' && (
                           <textarea 
                             className="w-full bg-slate-50 p-6 rounded-2xl font-medium text-lg text-slate-700 outline-none border-2 border-transparent focus:border-blue-500 transition-all min-h-[100px]"
                             value={el.content}
                             onChange={e => updateElement(el.id, e.target.value)}
                             placeholder="Multimodal metin girişi..."
                           />
                        )}
                        {el.type === 'image_prompt' && (
                           <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 text-white flex items-center gap-6">
                              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🖼️</div>
                              <div className="flex-1">
                                 <span className="text-[9px] font-black text-orange-500 uppercase block mb-1">AI Görsel Üretim Komutu</span>
                                 <input 
                                   type="text" 
                                   className="w-full bg-transparent border-b border-white/20 outline-none text-sm font-bold pb-1 focus:border-orange-500"
                                   placeholder="Örn: Otizmli bir çocuğun duyu bütünleme odasındaki odaklanmış hali, 4k cinematic..."
                                   value={el.content}
                                   onChange={e => updateElement(el.id, e.target.value)}
                                 />
                              </div>
                           </div>
                        )}
                        {el.type === 'interactive_case' && (
                           <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                              <span className="text-[9px] font-black text-orange-600 uppercase block mb-4">Vaka Analizi & Soru</span>
                              <input 
                                type="text"
                                className="w-full bg-white p-4 rounded-xl font-bold text-sm outline-none border border-orange-200 mb-4"
                                placeholder="Soru metni..."
                                value={el.content.question}
                                onChange={e => updateElement(el.id, {...el.content, question: e.target.value})}
                              />
                           </div>
                        )}
                        <button 
                           onClick={() => {
                              const newSlides = [...plan.slides];
                              newSlides[activeSlideIdx].elements = newSlides[activeSlideIdx].elements.filter(e => e.id !== el.id);
                              setPlan({...plan, slides: newSlides});
                           }}
                           className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover/el:opacity-100 transition-opacity"
                        >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                     </div>
                  ))}

                  {activeSlide.elements.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] opacity-30">
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Bu slayda sağ panelden multimodal element ekleyin.</p>
                     </div>
                  )}
               </div>

               {/* Watermark */}
               <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none select-none">
                  <span className="text-4xl font-black italic tracking-tighter text-slate-900">NÖRAL AKADEMİ</span>
               </div>
            </div>

            {/* Speaker Notes */}
            <div className="w-full max-w-5xl mt-8">
               <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Eğitmen Notları & Nöro-Pedagojik Gerekçe</span>
                     <button 
                       onClick={handleAiRefine}
                       disabled={isAiSuggesting}
                       className="flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all"
                     >
                        <svg className={`w-3 h-3 ${isAiSuggesting ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI İLE GELİŞTİR
                     </button>
                  </div>
                  <textarea 
                    className="w-full bg-white/5 p-4 rounded-xl text-slate-300 font-medium text-xs outline-none focus:bg-white/10 transition-all min-h-[80px] resize-none"
                    placeholder="Sunum sırasında okunacak notlar veya vaka bazlı klinik nüanslar..."
                    value={activeSlide.speakerNotes}
                    onChange={e => {
                       const newSlides = [...plan.slides];
                       newSlides[activeSlideIdx].speakerNotes = e.target.value;
                       setPlan({...plan, slides: newSlides});
                    }}
                  />
               </div>
            </div>
         </div>

         {/* 4. RIGHT: ASSETS & ELEMENTS DRAWER */}
         <div className="w-80 bg-slate-900 border-l border-white/5 flex flex-col shrink-0 no-print">
            <div className="p-6 border-b border-white/5">
               <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-widest">ELEMENT ATÖLYESİ</h4>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
               <div className="space-y-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">İÇERİK ELEMENTLERİ</span>
                  <div className="grid grid-cols-2 gap-3">
                     {[
                        { id: 'text', l: 'Zengin Metin', i: '📝' },
                        { id: 'image_prompt', l: 'AI Görsel', i: '🖼️' },
                        { id: 'symbol', l: 'AAC Sembol', i: '🧩' },
                        { id: 'interactive_case', l: 'Vaka Sorusu', i: '❓' }
                     ].map(item => (
                        <button 
                           key={item.id}
                           onClick={() => addElement(item.id as any)}
                           className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-orange-600 hover:border-orange-500 transition-all group"
                        >
                           <span className="text-xl group-hover:scale-125 transition-transform">{item.i}</span>
                           <span className="text-[9px] font-black text-slate-400 group-hover:text-white uppercase">{item.l}</span>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">EĞİTİM PARAMETRELERİ</span>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[8px] font-bold text-slate-600 uppercase mb-2 block">Zorluk Seviyesi</label>
                        <select className="w-full bg-slate-800 p-2 rounded-lg text-white text-[10px] outline-none" value={plan.level} onChange={e => setPlan({...plan, level: e.target.value as any})}>
                           <option value="Beginner">Beginner</option>
                           <option value="Intermediate">Intermediate</option>
                           <option value="Advanced">Advanced</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[8px] font-bold text-slate-600 uppercase mb-2 block">Branş Odağı</label>
                        <div className="grid grid-cols-1 gap-1">
                           {Object.values(Branch).slice(0, 5).map(b => (
                              <label key={b} className="flex items-center gap-2 text-[10px] text-slate-400 cursor-pointer hover:text-white">
                                 <input type="checkbox" className="rounded-sm border-white/10 bg-slate-800" />
                                 {b}
                              </label>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default MultimodalStudio;
