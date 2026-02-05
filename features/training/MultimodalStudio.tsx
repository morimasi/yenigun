
import React, { useState, useEffect } from 'react';
import { CustomTrainingPlan, CustomTrainingSlide, MultimodalElement, Branch, TrainingQuiz } from '../../types';
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
    createdAt: Date.now(),
    finalQuiz: { questions: [] }
  });

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [view, setView] = useState<'editor' | 'quiz'>('editor');

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
      content: type === 'interactive_case' ? { question: '', options: [] } : type === 'symbol' ? { icon: '🧩', label: '' } : '',
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

  const addQuizQuestion = () => {
     const newQ = { id: `q-${Date.now()}`, text: 'Soru metni...', options: [
       { label: 'Doğru Seçenek', isCorrect: true, feedback: 'Harika.' },
       { label: 'Yanlış Seçenek', isCorrect: false, feedback: 'Tekrar gözden geçir.' }
     ]};
     setPlan({ ...plan, finalQuiz: { questions: [...(plan.finalQuiz?.questions || []), newQ] } });
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
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
               <button onClick={() => setView('editor')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${view === 'editor' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Tasarım</button>
               <button onClick={() => setView('quiz')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${view === 'quiz' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Liyakat Sınavı</button>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button onClick={savePlan} disabled={isSaving} className="px-8 py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-white hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50">
               {isSaving ? 'MÜHÜRLENİYOR...' : 'YAYINLA VE KAYDET'}
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {view === 'editor' ? (
           <>
            {/* 2. LEFT: SLIDE PREVIEW STRIP */}
            <div className="w-64 bg-slate-900/50 border-r border-white/5 flex flex-col shrink-0">
               <div className="p-4 flex justify-between items-center border-b border-white/5">
                  <span className="text-[9px] font-black text-slate-500 uppercase">Slayt Akışı</span>
                  <button onClick={addSlide} className="w-6 h-6 bg-white/10 text-white rounded flex items-center justify-center hover:bg-orange-600 transition-all">+</button>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                  {plan.slides.map((s, idx) => (
                     <div key={s.id} onClick={() => setActiveSlideIdx(idx)} className={`aspect-video rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center p-2 ${activeSlideIdx === idx ? 'border-orange-500 bg-slate-800' : 'border-transparent bg-slate-900 hover:border-white/20'}`}>
                        <p className="text-[8px] font-bold text-slate-400 text-center uppercase leading-tight line-clamp-2">{s.title}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* 3. CENTER: CANVAS AREA */}
            <div className="flex-1 bg-slate-950 p-12 overflow-y-auto custom-scrollbar flex flex-col items-center">
               <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl aspect-video flex flex-col overflow-hidden relative">
                  <div className="p-10 pb-0">
                     <input type="text" className="w-full text-4xl font-black text-slate-900 uppercase tracking-tighter outline-none border-l-8 border-orange-600 pl-8 focus:border-slate-900 transition-all" value={activeSlide.title} onChange={e => { const newS = [...plan.slides]; newS[activeSlideIdx].title = e.target.value; setPlan({...plan, slides: newS}); }} placeholder="Slayt Başlığı..." />
                  </div>
                  <div className="flex-1 p-10 space-y-6">
                     {activeSlide.elements.map((el) => (
                        <div key={el.id} className="relative group/el">
                           {el.type === 'text' && <textarea className="w-full bg-slate-50 p-6 rounded-2xl font-medium text-lg text-slate-700 outline-none border-2 border-transparent focus:border-blue-500 transition-all min-h-[100px]" value={el.content} onChange={e => updateElement(el.id, e.target.value)} />}
                           {el.type === 'symbol' && <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-center">
                              <input type="text" className="text-3xl w-16 bg-white rounded-lg border-none text-center" value={el.content.icon} onChange={e => updateElement(el.id, {...el.content, icon: e.target.value})} />
                              <input type="text" className="flex-1 bg-white p-3 rounded-lg border-none font-bold" value={el.content.label} onChange={e => updateElement(el.id, {...el.content, label: e.target.value})} placeholder="Sembol Etiketi..." />
                           </div>}
                           <button onClick={() => { const newS = [...plan.slides]; newS[activeSlideIdx].elements = newS[activeSlideIdx].elements.filter(e => e.id !== el.id); setPlan({...plan, slides: newS}); }} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover/el:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* 4. RIGHT: TOOLS */}
            <div className="w-80 bg-slate-900 border-l border-white/5 flex flex-col shrink-0">
               <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                  <div className="space-y-3">
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">MULTIMODAL ELEMENTLER</span>
                     <div className="grid grid-cols-2 gap-3">
                        {[{id:'text', l:'Metin', i:'📝'}, {id:'image_prompt', l:'AI Görsel', i:'🖼️'}, {id:'symbol', l:'Sembol', i:'🧩'}, {id:'interactive_case', l:'Vaka', i:'❓'}].map(item => (
                           <button key={item.id} onClick={() => addElement(item.id as any)} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-orange-600 hover:border-orange-500 transition-all group">
                              <span className="text-xl">{item.i}</span>
                              <span className="text-[9px] font-black text-slate-400 group-hover:text-white uppercase">{item.l}</span>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
           </>
         ) : (
           /* QUIZ EDITOR VIEW */
           <div className="flex-1 bg-slate-950 p-20 overflow-y-auto custom-scrollbar flex flex-col items-center">
              <div className="w-full max-w-4xl space-y-8">
                 <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Liyakat Mührü Sınavı Tasarımı</h2>
                    <button onClick={addQuizQuestion} className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">+ SORU EKLE</button>
                 </div>
                 
                 {(plan.finalQuiz?.questions || []).map((q, qIdx) => (
                    <div key={q.id} className="bg-white p-10 rounded-[3rem] shadow-xl space-y-6">
                       <input type="text" className="w-full bg-slate-50 p-4 rounded-xl font-black text-lg border-none outline-none focus:ring-2 focus:ring-orange-500" value={q.text} onChange={e => {
                          const newQ = [...(plan.finalQuiz?.questions || [])];
                          newQ[qIdx].text = e.target.value;
                          setPlan({...plan, finalQuiz: { questions: newQ }});
                       }} />
                       <div className="space-y-3">
                          {q.options.map((opt, oIdx) => (
                             <div key={oIdx} className="flex gap-4 items-center">
                                <button 
                                  onClick={() => {
                                    const newQ = [...(plan.finalQuiz?.questions || [])];
                                    newQ[qIdx].options = newQ[qIdx].options.map((o, idx) => ({ ...o, isCorrect: idx === oIdx }));
                                    setPlan({...plan, finalQuiz: { questions: newQ }});
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}
                                />
                                <input className="flex-1 bg-slate-50 p-3 rounded-xl text-xs font-bold" value={opt.label} onChange={e => {
                                   const newQ = [...(plan.finalQuiz?.questions || [])];
                                   newQ[qIdx].options[oIdx].label = e.target.value;
                                   setPlan({...plan, finalQuiz: { questions: newQ }});
                                }} />
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default MultimodalStudio;
