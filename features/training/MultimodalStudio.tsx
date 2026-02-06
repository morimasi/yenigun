
import React, { useState, useEffect, useMemo } from 'react';
import { CustomTrainingPlan, TrainingModule, TrainingUnit, MultimodalElement, Branch } from '../../types';
import { armsService } from '../../services/ai/armsService';

interface MultimodalStudioProps {
  onClose: () => void;
  initialPlan?: CustomTrainingPlan | null;
}

const MultimodalStudio: React.FC<MultimodalStudioProps> = ({ onClose, initialPlan }) => {
  // --- STATE ---
  const [plan, setPlan] = useState<CustomTrainingPlan>(initialPlan || {
    id: `CUR-${Date.now()}`,
    title: 'Yeni Akademik Müfredat',
    category: 'CLINICAL',
    level: 'Intermediate',
    description: 'Eğitim vizyonu ve metodolojik derinlik özeti.',
    targetBranches: 'ALL',
    curriculum: [],
    createdBy: 'Sistem Yöneticisi',
    createdAt: Date.now()
  });

  const [activeTab, setActiveTab] = useState<'plan' | 'structure' | 'editor'>('plan');
  const [activeModuleIdx, setActiveModuleIdx] = useState<number | null>(null);
  const [activeUnitIdx, setActiveUnitIdx] = useState<number | null>(null);
  
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- DERIVED DATA ---
  const activeModule = activeModuleIdx !== null ? plan.curriculum[activeModuleIdx] : null;
  const activeUnit = (activeModuleIdx !== null && activeUnitIdx !== null) ? plan.curriculum[activeModuleIdx].units[activeUnitIdx] : null;

  // --- HANDLERS: STRUCTURE ---
  const addModule = () => {
    const newMod: TrainingModule = {
      id: `MOD-${Date.now()}`,
      title: 'Yeni Eğitim Modülü',
      focusArea: 'Genel Yetkinlik',
      difficulty: 'intermediate',
      status: 'active',
      units: []
    };
    setPlan({ ...plan, curriculum: [...plan.curriculum, newMod] });
    setActiveModuleIdx(plan.curriculum.length);
    setActiveUnitIdx(null);
  };

  const addUnit = (mIdx: number) => {
    const newUnit: TrainingUnit = {
      id: `UNT-${Date.now()}`,
      title: 'Yeni Eğitim Ünitesi',
      type: 'reading',
      content: 'İçerik buraya gelecek...',
      durationMinutes: 45,
      isCompleted: false,
      status: 'pending',
      multimodalElements: []
    };
    const newC = [...plan.curriculum];
    newC[mIdx].units.push(newUnit);
    setPlan({ ...plan, curriculum: newC });
    setActiveUnitIdx(newC[mIdx].units.length - 1);
    setActiveTab('editor');
  };

  const deleteModule = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Modül silinsin mi?")) return;
    const newC = [...plan.curriculum];
    newC.splice(idx, 1);
    setPlan({ ...plan, curriculum: newC });
    setActiveModuleIdx(null);
    setActiveUnitIdx(null);
  };

  const handleAiFillUnit = async () => {
    if (!activeUnit) return;
    setIsAiProcessing(true);
    try {
      const suggested = await armsService.generateUnitContent(activeUnit.title, activeModule?.focusArea || '');
      const newC = [...plan.curriculum];
      newC[activeModuleIdx!].units[activeUnitIdx!] = { ...activeUnit, ...suggested };
      setPlan({ ...plan, curriculum: newC });
    } catch (e) {
      alert("AI Sentez Hatası.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, updatedAt: Date.now() })
      });
      if (res.ok) alert("Müfredat Başarıyla Mühürlendi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-50 flex flex-col animate-fade-in overflow-hidden font-sans">
      
      {/* 1. TOP COMMAND BAR */}
      <div className="h-16 bg-slate-900 flex items-center justify-between px-8 shrink-0 shadow-2xl relative z-50">
         <div className="flex items-center gap-6">
            <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <div className="h-6 w-px bg-white/10"></div>
            <div>
               <h2 className="text-white font-black text-sm uppercase tracking-widest leading-none">{plan.title}</h2>
               <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] mt-1.5">Müfredat Üretim Stüdyosu v3.0</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-4">
               {[
                 { id: 'plan', l: 'PLAN' },
                 { id: 'structure', l: 'HIYERARŞİ' },
                 { id: 'editor', l: 'EDİTÖR' }
               ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                  >
                     {t.l}
                  </button>
               ))}
            </div>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-10 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
            >
               {isSaving ? 'MÜHÜRLENİYOR...' : 'YAYINLA VE KAYDET'}
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* 2. LEFT SIDEBAR: CURRICULUM TREE */}
         <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 no-scrollbar">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">MÜFREDAT HARİTASI</h4>
               <button onClick={addModule} className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition-all font-black text-xl">+</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {plan.curriculum.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-1">
                     <div 
                        onClick={() => { setActiveModuleIdx(mIdx); setActiveUnitIdx(null); setActiveTab('structure'); }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group relative ${activeModuleIdx === mIdx ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-50 text-slate-600 hover:border-orange-200'}`}
                     >
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[11px] font-black uppercase truncate pr-4">{mod.title}</span>
                           <button onClick={(e) => deleteModule(mIdx, e)} className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
                           </button>
                        </div>
                        <p className={`text-[8px] font-bold uppercase ${activeModuleIdx === mIdx ? 'text-slate-400' : 'text-slate-300'}`}>{mod.units.length} Ünite • {mod.focusArea}</p>
                     </div>
                     
                     <div className="pl-6 space-y-1 mt-1 border-l-2 border-slate-100 ml-4">
                        {mod.units.map((unit, uIdx) => (
                           <div 
                              key={unit.id}
                              onClick={() => { setActiveModuleIdx(mIdx); setActiveUnitIdx(uIdx); setActiveTab('editor'); }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer text-[10px] font-bold uppercase truncate ${activeModuleIdx === mIdx && activeUnitIdx === uIdx ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-white border-transparent text-slate-400 hover:text-slate-700'}`}
                           >
                              {uIdx + 1}. {unit.title}
                           </div>
                        ))}
                        <button 
                           onClick={() => addUnit(mIdx)}
                           className="w-full p-2 rounded-xl border border-dashed border-slate-200 text-[9px] font-black text-slate-300 hover:text-orange-500 hover:border-orange-200 transition-all uppercase"
                        >
                           + Ünite Ekle
                        </button>
                     </div>
                  </div>
               ))}
               {plan.curriculum.length === 0 && (
                  <div className="py-20 text-center opacity-20 grayscale scale-75">
                     <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                     <p className="text-[10px] font-black uppercase tracking-widest">Henüz Modül Yok</p>
                  </div>
               )}
            </div>
         </div>

         {/* 3. CENTER CONTENT AREA: DYNAMIC WORKSPACE */}
         <div className="flex-1 bg-slate-50 p-10 overflow-y-auto custom-scrollbar flex flex-col items-center">
            
            {/* STAGE A: PLAN DETAILS */}
            {activeTab === 'plan' && (
               <div className="w-full max-w-4xl space-y-8 animate-scale-in">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-8 border-orange-600 pl-8">Müfredat Temelleri</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Müfredat Başlığı</label>
                           <input type="text" className="w-full p-6 bg-slate-50 rounded-3xl font-black text-xl border-2 border-transparent focus:border-orange-500 outline-none transition-all shadow-inner" value={plan.title} onChange={e => setPlan({...plan, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Kategori</label>
                           <select className="w-full p-6 bg-slate-50 rounded-3xl font-black text-base border-2 border-transparent outline-none appearance-none shadow-inner" value={plan.category} onChange={e => setPlan({...plan, category: e.target.value as any})}>
                              {['ORIENTATION', 'CLINICAL', 'ETHICS', 'MANAGEMENT'].map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                     </div>
                     <div className="mt-8 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Müfredat Vizyonu & Açıklama</label>
                        <textarea className="w-full p-8 bg-slate-50 rounded-[3rem] font-medium text-lg text-slate-600 outline-none border-2 border-transparent focus:border-orange-500 transition-all shadow-inner min-h-[200px]" value={plan.description} onChange={e => setPlan({...plan, description: e.target.value})} />
                     </div>
                  </div>
               </div>
            )}

            {/* STAGE B: MODULE CONFIGURATION */}
            {activeTab === 'structure' && activeModule && (
               <div className="w-full max-w-4xl animate-slide-up space-y-6">
                  <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                     <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-12">MODÜL YAPILANDIRMA</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Modül Başlığı</label>
                           <input type="text" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black text-lg outline-none focus:border-orange-500 transition-all" value={activeModule.title} onChange={e => { const newC = [...plan.curriculum]; newC[activeModuleIdx!].title = e.target.value; setPlan({...plan, curriculum: newC}); }} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Odak Alanı</label>
                           <input type="text" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black text-lg outline-none focus:border-orange-500 transition-all" value={activeModule.focusArea} onChange={e => { const newC = [...plan.curriculum]; newC[activeModuleIdx!].focusArea = e.target.value; setPlan({...plan, curriculum: newC}); }} />
                        </div>
                     </div>
                     <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
                  </div>
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-200 flex flex-col items-center justify-center text-center py-24 opacity-40">
                     <svg className="w-16 h-16 text-slate-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                     <p className="text-[11px] font-black uppercase tracking-widest">Modüle ait üniteleri düzenlemek için sol listeden bir ünite seçin.</p>
                  </div>
               </div>
            )}

            {/* STAGE C: UNIT EDITOR (THE CORE) */}
            {activeTab === 'editor' && activeUnit && (
               <div className="w-full max-w-5xl space-y-8 animate-scale-in">
                  
                  {/* Unit Meta Card */}
                  <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-orange-600 text-2xl font-black shadow-xl shrink-0">
                           {activeUnitIdx! + 1}
                        </div>
                        <div>
                           <input type="text" className="bg-transparent border-none text-3xl font-black text-slate-900 uppercase tracking-tighter outline-none focus:text-orange-600 transition-all w-full" value={activeUnit.title} onChange={e => { const newC = [...plan.curriculum]; newC[activeModuleIdx!].units[activeUnitIdx!].title = e.target.value; setPlan({...plan, curriculum: newC}); }} />
                           <div className="flex gap-4 mt-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeUnit.type} • {activeUnit.durationMinutes} DK</span>
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={handleAiFillUnit}
                        disabled={isAiProcessing}
                        className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                     >
                        {isAiProcessing ? (
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        AI İÇERİK SENTEZİ
                     </button>
                  </div>

                  {/* Main Content Workspace */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
                     <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl min-h-[500px] relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-600"></div>
                           <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">AKADEMİK İÇERİK KATMANI</h5>
                           <textarea 
                              className="w-full bg-transparent border-none outline-none font-medium text-xl text-slate-700 leading-relaxed text-justify min-h-[400px] resize-none"
                              value={activeUnit.content}
                              onChange={e => { const newC = [...plan.curriculum]; newC[activeModuleIdx!].units[activeUnitIdx!].content = e.target.value; setPlan({...plan, curriculum: newC}); }}
                              placeholder="Klinik yönergeler, teorik temel ve uygulama protokollerini buraya giriniz..."
                           />
                           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-6">
                        <div className="bg-orange-50 p-8 rounded-[3rem] border border-orange-100 shadow-sm">
                           <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">MIA NÖRAL GEREKÇE</h6>
                           <textarea 
                              className="w-full bg-transparent border-none outline-none font-bold text-[11px] text-orange-900 italic leading-relaxed min-h-[120px] resize-none"
                              value={activeUnit.aiRationale || ''}
                              onChange={e => { const newC = [...plan.curriculum]; newC[activeModuleIdx!].units[activeUnitIdx!].aiRationale = e.target.value; setPlan({...plan, curriculum: newC}); }}
                              placeholder="Bu eğitimin neden verildiğine dair AI gerekçesi..."
                           />
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                           <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">BAŞARI KRİTERİ</h6>
                           <textarea 
                              className="w-full bg-transparent border-none outline-none font-bold text-[11px] text-slate-800 uppercase tracking-tighter leading-snug min-h-[100px] resize-none"
                              value={activeUnit.successCriteria || ''}
                              onChange={e => { const newC = [...plan.curriculum]; newC[activeModuleIdx!].units[activeUnitIdx!].successCriteria = e.target.value; setPlan({...plan, curriculum: newC}); }}
                              placeholder="Eğitimin tamamlanmış sayılması için gereken somut çıktı..."
                           />
                        </div>

                        <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-xl flex flex-col gap-4">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ünite Tipi</label>
                           <div className="grid grid-cols-2 gap-2">
                              {['video', 'reading', 'simulation', 'workshop', 'quiz_v2'].map(t => (
                                 <button 
                                    key={t}
                                    onClick={() => { const newC = [...plan.curriculum]; newC[activeModuleIdx!].units[activeUnitIdx!].type = t as any; setPlan({...plan, curriculum: newC}); }}
                                    className={`py-2 px-3 rounded-lg text-[8px] font-black uppercase transition-all ${activeUnit.type === t ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                 >
                                    {t}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {!activeModule && activeTab !== 'plan' && (
               <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale text-center select-none">
                  <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-12 shadow-inner border-4 border-dashed border-slate-200">
                     <svg className="w-24 h-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 uppercase tracking-[0.5em]">Müfredat Boş</h3>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mt-4">Sol panelden bir modül ekleyerek veya seçerek akademik inşayı başlatın.</p>
               </div>
            )}
         </div>
      </div>
      
      {/* PERSISTENT STATUS BAR */}
      <div className="h-8 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0 relative z-50">
         <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <span>MODÜLLER: {plan.curriculum.length}</span>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <span>ÜNİTELER: {plan.curriculum.reduce((acc, curr) => acc + curr.units.length, 0)}</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BULUT SENKRONİZASYONU AKTİF</span>
         </div>
      </div>
    </div>
  );
};

export default MultimodalStudio;
