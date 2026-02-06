
import React, { useState, useEffect, useMemo } from 'react';
import { StaffMember, IDP, TrainingUnit, TrainingModule, UniversalExportData } from '../../types';
import { armsService } from '../../services/ai/armsService';
import ExportStudio from '../../components/shared/ExportStudio';
import { PredictBar } from '../../shared/ui/PredictBar';

interface DevelopmentRouteViewProps {
  staff: StaffMember;
  currentIDP: IDP | null;
  assessmentHistory: any[];
  onSave: (idp: IDP) => Promise<void>;
}

const DevelopmentRouteView: React.FC<DevelopmentRouteViewProps> = ({ staff, currentIDP, assessmentHistory, onSave }) => {
  const [localIDP, setLocalIDP] = useState<IDP | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const [activeModuleIdx, setActiveModuleIdx] = useState<number | null>(0);
  const [editingUnit, setEditingUnit] = useState<{modIdx: number, unitIdx: number, data: TrainingUnit} | null>(null);

  useEffect(() => {
    if (currentIDP) {
      setLocalIDP(JSON.parse(JSON.stringify(currentIDP))); 
    } else {
      setLocalIDP(null);
    }
  }, [currentIDP]);

  const handleGenerateIDP = async () => {
    if (!confirm("AI MOTORU TETİKLENİYOR: Personelin tüm sınav geçmişi analiz edilerek yeni bir nöral müfredat oluşturulacak. Mevcut (kaydedilmemiş) değişiklikler silinebilir. Onaylıyor musunuz?")) return;
    setIsGenerating(true);
    try {
      const newIDP = await armsService.generateIDP(staff, assessmentHistory);
      setLocalIDP(newIDP);
      setEditMode(true);
      setActiveModuleIdx(0);
    } catch (e) {
      alert("AI Müfredat Üretim Hatası.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!localIDP) return;
    setIsSaving(true);
    try {
      await onSave({ ...localIDP, updatedAt: Date.now() });
      setEditMode(false);
      setEditingUnit(null);
    } finally {
      setIsSaving(false);
    }
  };

  // --- EDITOR ACTIONS ---
  const addModule = () => {
    if(!localIDP) return;
    const newMod: TrainingModule = {
      id: `MOD-${Date.now()}`,
      title: 'Yeni Eğitim Modülü',
      focusArea: 'Klinik Yetkinlik',
      difficulty: 'intermediate',
      status: 'active',
      units: []
    };
    setLocalIDP({ ...localIDP, curriculum: [...(localIDP.curriculum || []), newMod] });
    setActiveModuleIdx(localIDP.curriculum.length);
  };

  const addUnit = (modIdx: number) => {
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    const newUnit: TrainingUnit = {
      id: `U-${Date.now()}`,
      title: 'Yeni Eğitim Ünitesi',
      type: 'reading',
      content: 'Eğitim içeriği buraya gelecek...',
      durationMinutes: 45,
      isCompleted: false,
      status: 'pending',
      aiRationale: 'Manuel olarak müfredata eklendi.'
    };
    newC[modIdx].units.push(newUnit);
    setLocalIDP({ ...localIDP, curriculum: newC });
    setEditingUnit({ modIdx, unitIdx: newC[modIdx].units.length - 1, data: newUnit });
  };

  const deleteModule = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if(!localIDP || !confirm("Modül ve tüm üniteleri silinecek. Onaylıyor musunuz?")) return;
    const newC = [...localIDP.curriculum];
    newC.splice(idx, 1);
    setLocalIDP({ ...localIDP, curriculum: newC });
    setActiveModuleIdx(null);
  };

  const updateUnitField = (field: keyof TrainingUnit, value: any) => {
    if (!editingUnit) return;
    setEditingUnit({
      ...editingUnit,
      data: { ...editingUnit.data, [field]: value }
    });
  };

  const applyUnitChanges = () => {
    if (!editingUnit || !localIDP) return;
    const newC = [...localIDP.curriculum];
    newC[editingUnit.modIdx].units[editingUnit.unitIdx] = editingUnit.data;
    setLocalIDP({ ...localIDP, curriculum: newC });
    setEditingUnit(null);
  };

  if (!localIDP && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 text-center animate-fade-in">
        <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-10 shadow-inner">
           <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Gelişim Planı Bekleniyor</h3>
        <p className="text-slate-400 font-bold text-sm max-w-sm mb-12 uppercase tracking-widest leading-relaxed">Personelin test sonuçlarına göre kişiselleştirilmiş bir müfredat oluşturmak için nöral motoru başlatın.</p>
        <button onClick={handleGenerateIDP} className="px-16 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95">MÜFREDAT SENTEZİNİ BAŞLAT</button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-10 animate-fade-in text-center">
         <div className="relative">
            <div className="w-56 h-56 border-[12px] border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] shadow-2xl flex items-center justify-center border border-white/10">
                  <span className="text-orange-500 font-black text-xl animate-pulse">MIA</span>
               </div>
            </div>
         </div>
         <div className="space-y-4">
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Nöral Planlama Aktif</h3>
            <p className="text-orange-600 font-black text-sm uppercase tracking-[0.5em] animate-pulse">Hata Desenleri Analiz Ediliyor...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up h-full pb-10">
      
      {/* 1. STUDIO HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[3rem] border border-slate-200 shadow-sm gap-6 no-print">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
               <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
               <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Müfredat Stüdyosu</h3>
                  {editMode && <span className="px-2 py-0.5 bg-orange-600 text-white rounded text-[8px] font-black uppercase">Düzenleme Modu</span>}
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{localIDP?.focusArea || 'Genel Yetkinlik Rotaları'}</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {!editMode ? (
               <>
                 <button onClick={() => setIsExportOpen(true)} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                    YAYINLA
                 </button>
                 <button onClick={() => setEditMode(true)} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">DÜZENLE</button>
               </>
            ) : (
               <>
                 <button onClick={handleGenerateIDP} className="px-6 py-3 bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">AI RE-PLAN</button>
                 <button onClick={handleSaveChanges} disabled={isSaving} className="px-10 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-3">
                    {isSaving ? 'MÜHÜRLENİYOR...' : 'KAYDET VE MÜHÜRLE'}
                 </button>
               </>
            )}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0 overflow-hidden">
         
         {/* 2. SIDEBAR: NAVIGATION */}
         <div className="col-span-12 lg:col-span-4 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden no-print">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">EĞİTİM ROTASI</h4>
               {editMode && (
                  <button onClick={addModule} className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg font-black">+</button>
               )}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
               {localIDP?.curriculum?.map((mod, idx) => (
                  <div 
                    key={mod.id} 
                    onClick={() => setActiveModuleIdx(idx)}
                    className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all relative group overflow-hidden ${activeModuleIdx === idx ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-orange-200 text-slate-600'}`}
                  >
                     <div className="flex justify-between items-start mb-3 relative z-10">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${activeModuleIdx === idx ? 'bg-white/10 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>{mod.focusArea}</span>
                        {editMode && (
                           <button onClick={(e) => deleteModule(idx, e)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        )}
                     </div>
                     <h5 className="text-sm font-black uppercase leading-tight mb-4 relative z-10">{mod.title}</h5>
                     <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2 text-[9px] font-bold opacity-60 uppercase">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                           {mod.units.length} Ünite
                        </div>
                        <span className="text-[9px] font-black uppercase opacity-40">{mod.difficulty}</span>
                     </div>
                     {activeModuleIdx === idx && <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-orange-600/10 rounded-full blur-2xl"></div>}
                  </div>
               ))}
            </div>
         </div>

         {/* 3. MAIN WORKSPACE */}
         <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full">
            
            {/* UNIT EDITOR / MODAL OVERLAY */}
            {editMode && editingUnit ? (
               <div className="bg-white rounded-[4rem] border-2 border-orange-500 shadow-3xl p-10 animate-scale-in flex-1 flex flex-col overflow-hidden relative">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Ünite Konfigürasyonu</h4>
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">Nöral İz Düzenleme</p>
                     </div>
                     <button onClick={() => setEditingUnit(null)} className="p-4 hover:bg-slate-50 rounded-2xl text-slate-400">KAPAT</button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Başlık</label>
                        <input type="text" className="w-full p-5 bg-slate-50 rounded-2xl font-black text-base border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={editingUnit.data.title} onChange={e => updateUnitField('title', e.target.value)} />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Ünite Tipi</label>
                           <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-sm border-2 border-transparent outline-none" value={editingUnit.data.type} onChange={e => updateUnitField('type', e.target.value)}>
                              {['video', 'reading', 'simulation', 'assignment', 'supervision', 'workshop'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Süre (Dk)</label>
                           <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-sm border-2 border-transparent outline-none" value={editingUnit.data.durationMinutes} onChange={e => updateUnitField('durationMinutes', parseInt(e.target.value))} />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Pedagojik İçerik / Yönerge</label>
                        <textarea className="w-full p-8 bg-slate-50 rounded-[2.5rem] font-medium text-sm text-slate-700 leading-relaxed border-2 border-transparent focus:border-orange-500 outline-none min-h-[150px] shadow-inner" value={editingUnit.data.content} onChange={e => updateUnitField('content', e.target.value)} />
                     </div>

                     <div className="p-8 bg-orange-50 rounded-[3rem] border border-orange-100">
                        <label className="text-[10px] font-black text-orange-600 uppercase mb-4 block">AI NÖRAL GEREKÇE (RATIONALE)</label>
                        <textarea className="w-full bg-transparent border-none outline-none font-bold text-xs text-orange-900 italic leading-relaxed" value={editingUnit.data.aiRationale} onChange={e => updateUnitField('aiRationale', e.target.value)} />
                     </div>
                  </div>

                  <div className="pt-8 mt-4 border-t border-slate-50">
                     <button onClick={applyUnitChanges} className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-600 transition-all">DEĞİŞİKLİKLERİ UYGULA</button>
                  </div>
               </div>
            ) : (
               // VIEW MODE
               <div className="flex-1 bg-white rounded-[4rem] border border-slate-200 shadow-xl p-12 overflow-y-auto custom-scrollbar relative">
                  {activeModuleIdx !== null && localIDP?.curriculum?.[activeModuleIdx] ? (
                     <div className="space-y-12 animate-fade-in pb-20">
                        
                        <div className="border-b border-slate-100 pb-10 flex justify-between items-end">
                           <div className="space-y-4">
                              <span className="px-4 py-1.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">AKTİF MODÜL</span>
                              <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{localIDP.curriculum[activeModuleIdx].title}</h2>
                              <div className="flex gap-4">
                                 <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase">{localIDP.curriculum[activeModuleIdx].focusArea}</span>
                                 </div>
                                 <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase">{localIDP.curriculum[activeModuleIdx].difficulty}</span>
                                 </div>
                              </div>
                           </div>
                           {editMode && (
                              <button onClick={() => addUnit(activeModuleIdx)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all">+ ÜNİTE EKLE</button>
                           )}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                           {localIDP.curriculum[activeModuleIdx].units.map((unit, uIdx) => (
                              <div 
                                key={unit.id} 
                                className="group relative p-10 bg-[#FAFAFA] rounded-[3.5rem] border-2 border-transparent hover:border-orange-500 hover:bg-white hover:shadow-2xl transition-all duration-500"
                              >
                                 <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-6">
                                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl ${unit.isCompleted ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                                          {uIdx + 1}
                                       </div>
                                       <div>
                                          <h5 className={`text-xl font-black uppercase tracking-tight ${unit.isCompleted ? 'text-slate-300 line-through' : 'text-slate-800'}`}>{unit.title}</h5>
                                          <div className="flex items-center gap-3 mt-2">
                                             <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{unit.type}</span>
                                             <span className="text-slate-300">•</span>
                                             <span className="text-[10px] font-bold text-slate-400 uppercase">{unit.durationMinutes} DAKİKA</span>
                                          </div>
                                       </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                       {editMode ? (
                                          <>
                                             <button onClick={() => setEditingUnit({modIdx: activeModuleIdx, unitIdx: uIdx, data: unit})} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                             </button>
                                             <button onClick={(e) => { e.stopPropagation(); if(confirm('Soru silinsin mi?')) { const newC = [...localIDP.curriculum]; newC[activeModuleIdx].units.splice(uIdx, 1); setLocalIDP({...localIDP, curriculum: newC}); } }} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg>
                                             </button>
                                          </>
                                       ) : (
                                          <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${unit.isCompleted ? 'bg-emerald-500 border-emerald-100 text-white' : 'bg-slate-50 border-slate-100 text-slate-200'}`}>
                                             {unit.isCompleted && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                                 
                                 <div className="pl-20 space-y-6">
                                    <p className="text-base font-medium text-slate-600 leading-relaxed text-justify italic opacity-90 group-hover:opacity-100 transition-opacity">"{unit.content}"</p>
                                    
                                    {unit.aiRationale && (
                                       <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100 inline-block relative overflow-hidden">
                                          <span className="text-[9px] font-black text-orange-600 uppercase block mb-2 relative z-10">MIA NÖRAL GEREKÇE</span>
                                          <p className="text-[11px] font-bold text-orange-900 italic relative z-10">"{unit.aiRationale}"</p>
                                          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-600/5 rounded-full blur-xl"></div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale text-center select-none">
                        <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-12 shadow-inner border-4 border-dashed border-slate-200">
                           <svg className="w-24 h-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
                        </div>
                        <h3 className="text-4xl font-black text-slate-400 uppercase tracking-[0.6em]">Modül Seçin</h3>
                        <p className="text-xs font-bold uppercase text-slate-300 mt-4 tracking-widest">İncelemek veya düzenlemek istediğiniz etabı sol listeden aktif edin.</p>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>

      {/* EXPORT STUDIO OVERLAY */}
      {isExportOpen && localIDP && (
        <ExportStudio 
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'DEVELOPMENT_PLAN_SEAL',
            entityName: staff.name,
            referenceId: localIDP.id,
            payload: { staff, idp: localIDP }
          }}
        >
          <div className="p-16 space-y-16 print:p-8">
             <div className="text-center space-y-4">
                <span className="px-6 py-2 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest">AKADEMİK GELİŞİM MÜHÜRÜ</span>
                <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">{staff.name}</h1>
                <p className="text-xl font-bold text-orange-600 uppercase tracking-[0.4em]">{staff.branch}</p>
             </div>

             <div className="grid grid-cols-2 gap-12">
                <div className="bg-slate-50 p-12 rounded-[4rem] space-y-6">
                   <h3 className="text-[14px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-200 pb-4">STRATEJİK ODAK</h3>
                   <p className="text-3xl font-black text-slate-900 italic leading-tight">"{localIDP.focusArea}"</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                   <PredictBar label="GELİŞİM İVMESİ" value={85} color="text-emerald-600" />
                   <PredictBar label="ADAPTASYON" value={92} color="text-blue-600" />
                </div>
             </div>

             <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest border-l-8 border-orange-600 pl-8">MÜFREDAT BİLEŞENLERİ</h3>
                <div className="grid grid-cols-1 gap-4">
                   {localIDP.curriculum.map((m, i) => (
                      <div key={i} className="p-8 bg-white border-2 border-slate-100 rounded-[3rem] flex justify-between items-center">
                         <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">MODÜL {i+1}</span>
                            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{m.title}</h4>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-black text-orange-500 uppercase block mb-1">{m.units.length} ÜNİTE</span>
                            <span className="px-3 py-1 bg-slate-100 rounded text-[9px] font-bold uppercase">{m.difficulty}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </ExportStudio>
      )}
    </div>
  );
};

export default DevelopmentRouteView;
