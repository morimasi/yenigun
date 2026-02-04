
import React, { useState, useEffect, useRef } from 'react';
import { StaffMember, IDP, TrainingUnit, TrainingModule } from '../../types';
import { armsService } from '../../services/ai/armsService';

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
  
  // EDITOR STATES
  const [activeModuleIdx, setActiveModuleIdx] = useState<number | null>(null);
  const [editingUnit, setEditingUnit] = useState<{modIdx: number, unitIdx: number, data: TrainingUnit} | null>(null);

  useEffect(() => {
    if (currentIDP) {
      setLocalIDP(JSON.parse(JSON.stringify(currentIDP))); 
    } else {
      setLocalIDP(null);
    }
  }, [currentIDP]);

  const handleGenerateIDP = async () => {
    setIsGenerating(true);
    try {
      const newIDP = await armsService.generateIDP(staff, assessmentHistory);
      setLocalIDP(newIDP);
      setEditMode(true); // Auto enter edit mode to review
    } catch (e) {
      alert("Nöral Müfredat Motoru Hatası: Lütfen tekrar deneyiniz.");
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
      alert("Müfredat veritabanına mühürlendi.");
    } catch (e) {
      alert("Kayıt sırasında hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintCurriculum = () => {
    window.print();
  };

  // --- MODULE ACTIONS ---
  const addModule = () => {
      if(!localIDP) return;
      const newMod: TrainingModule = {
          id: `MOD-${Date.now()}`,
          title: 'Yeni Eğitim Modülü',
          focusArea: 'Genel Yetkinlik',
          difficulty: 'intermediate',
          status: 'active',
          units: []
      };
      setLocalIDP({ ...localIDP, curriculum: [...(localIDP.curriculum || []), newMod] });
  };

  const deleteModule = (idx: number) => {
      if(!localIDP?.curriculum) return;
      const newC = [...localIDP.curriculum];
      newC.splice(idx, 1);
      setLocalIDP({ ...localIDP, curriculum: newC });
      if(activeModuleIdx === idx) setActiveModuleIdx(null);
  };

  // --- UNIT ACTIONS ---
  const addUnit = (modIdx: number) => {
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    const newUnit: TrainingUnit = {
      id: `U-${Date.now()}`,
      title: 'Yeni Eğitim Ünitesi',
      type: 'reading',
      content: '',
      durationMinutes: 30,
      isCompleted: false,
      status: 'pending',
      aiRationale: 'Manuel eklendi.',
      successCriteria: 'Tamamlama ve Özet.'
    };
    newC[modIdx].units.push(newUnit);
    setLocalIDP({ ...localIDP, curriculum: newC });
    setEditingUnit({ modIdx, unitIdx: newC[modIdx].units.length - 1, data: newUnit });
  };

  const toggleUnitCompletion = (modIdx: number, unitIdx: number) => {
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    const unit = newC[modIdx].units[unitIdx];
    unit.isCompleted = !unit.isCompleted;
    setLocalIDP({ ...localIDP, curriculum: newC });
  };

  const saveEditingUnit = () => {
      if(!localIDP?.curriculum || !editingUnit) return;
      const newC = [...localIDP.curriculum];
      newC[editingUnit.modIdx].units[editingUnit.unitIdx] = editingUnit.data;
      setLocalIDP({ ...localIDP, curriculum: newC });
      setEditingUnit(null);
  };

  const deleteUnit = (modIdx: number, unitIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    newC[modIdx].units.splice(unitIdx, 1);
    setLocalIDP({ ...localIDP, curriculum: newC });
    if(editingUnit?.modIdx === modIdx && editingUnit?.unitIdx === unitIdx) setEditingUnit(null);
  };

  // --- RENDER ---

  if (!localIDP) {
    return (
      <div className="flex flex-col items-center justify-center p-24 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 text-center animate-fade-in min-h-[500px]">
        <div className="w-24 h-24 bg-white rounded-[3rem] flex items-center justify-center mb-8 shadow-sm text-slate-300">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tight mb-4">Müfredat Tanımlanmamış</h3>
        <p className="text-slate-400 font-bold text-sm mb-8 max-w-md">Personelin test hatalarına ve eksik yetkinliklerine dayalı "Tanısal Müfredat" oluşturmak için nöral motoru başlatın.</p>
        <button 
          onClick={handleGenerateIDP} 
          disabled={isGenerating} 
          className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-3"
        >
          {isGenerating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
          {isGenerating ? 'ANALİZ & İNŞA SÜRECİ...' : 'YENİ MÜFREDAT OLUŞTUR'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up h-full">
      
      {/* 1. TOP TOOLBAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">IDP</div>
            <div>
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Hizmet İçi Eğitim Stüdyosu</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Son Güncelleme: {new Date(localIDP.updatedAt || Date.now()).toLocaleDateString()}</p>
            </div>
         </div>
         <div className="flex gap-2">
            {!editMode ? (
               <>
                 <button onClick={handlePrintCurriculum} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">YAZDIR / PDF</button>
                 <button onClick={() => setEditMode(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">DÜZENLE</button>
               </>
            ) : (
               <>
                 <button onClick={() => { if(confirm('Kaydetmeden çıkılsın mı?')) { setEditMode(false); setLocalIDP(currentIDP); } }} className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-rose-500 transition-all">İPTAL</button>
                 <button onClick={handleGenerateIDP} disabled={isGenerating} className="px-6 py-3 bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-200 transition-all">AI REJENERASYON</button>
                 <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2">
                    {isSaving ? 'MÜHÜRLENİYOR...' : 'KAYDET VE ÇIK'}
                 </button>
               </>
            )}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
         
         {/* 2. LEFT: MODULE NAVIGATION & TIMELINE */}
         <div className="col-span-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden print:w-full print:col-span-12">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">EĞİTİM MODÜLLERİ</h4>
               {editMode && <button onClick={addModule} className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all text-lg font-bold">+</button>}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
               {localIDP.curriculum?.map((mod, idx) => (
                  <div 
                    key={mod.id} 
                    onClick={() => setActiveModuleIdx(idx)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all relative group ${activeModuleIdx === idx ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300 text-slate-600'}`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${activeModuleIdx === idx ? 'text-slate-400' : 'text-orange-600'}`}>{mod.focusArea}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${activeModuleIdx === idx ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>{mod.difficulty}</span>
                     </div>
                     <h5 className="text-sm font-black uppercase leading-tight mb-2 pr-6">{mod.title}</h5>
                     <div className="flex items-center gap-2 text-[9px] font-bold opacity-60">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        {mod.units.length} ÜNİTE
                     </div>
                     {editMode && (
                        <button onClick={(e) => { e.stopPropagation(); deleteModule(idx); }} className="absolute top-4 right-4 text-rose-500 hover:text-white hover:bg-rose-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* 3. RIGHT: UNIT EDITOR & DETAILS */}
         <div className="col-span-8 flex flex-col gap-6 h-full print:col-span-12">
            
            {/* EDITING MODAL / PANEL */}
            {editMode && editingUnit ? (
               <div className="bg-white rounded-[2.5rem] border border-orange-200 shadow-2xl p-8 animate-scale-in flex-1 flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Ünite Düzenle</h3>
                     <button onClick={() => setEditingUnit(null)} className="text-slate-400 hover:text-slate-900 text-[10px] font-bold uppercase">Kapat</button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ünite Başlığı</label>
                        <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-orange-500 outline-none" value={editingUnit.data.title} onChange={e => setEditingUnit({...editingUnit, data: {...editingUnit.data, title: e.target.value}})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tip</label>
                           <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-xs border-2 border-transparent outline-none" value={editingUnit.data.type} onChange={e => setEditingUnit({...editingUnit, data: {...editingUnit.data, type: e.target.value as any}})}>
                              {['video', 'reading', 'simulation', 'assignment', 'supervision', 'workshop'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Süre (Dk)</label>
                           <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-xs border-2 border-transparent focus:border-orange-500 outline-none" value={editingUnit.data.durationMinutes} onChange={e => setEditingUnit({...editingUnit, data: {...editingUnit.data, durationMinutes: parseInt(e.target.value)}})} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">İçerik Detayı / Talimatlar</label>
                        <textarea className="w-full p-4 bg-slate-50 rounded-2xl font-medium text-xs border-2 border-transparent focus:border-orange-500 outline-none min-h-[100px]" value={editingUnit.data.content} onChange={e => setEditingUnit({...editingUnit, data: {...editingUnit.data, content: e.target.value}})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Başarı Kriteri</label>
                        <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-xs border-2 border-transparent focus:border-orange-500 outline-none" value={editingUnit.data.successCriteria || ''} onChange={e => setEditingUnit({...editingUnit, data: {...editingUnit.data, successCriteria: e.target.value}})} placeholder="Örn: %80 Quiz Başarısı" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">AI Gerekçesi (Rationale)</label>
                        <textarea className="w-full p-4 bg-orange-50 text-orange-900 rounded-2xl font-bold text-xs border border-orange-100 outline-none min-h-[60px]" value={editingUnit.data.aiRationale} onChange={e => setEditingUnit({...editingUnit, data: {...editingUnit.data, aiRationale: e.target.value}})} />
                     </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100">
                     <button onClick={saveEditingUnit} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Değişiklikleri Uygula</button>
                  </div>
               </div>
            ) : (
               // VIEW MODE
               <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm p-8 overflow-y-auto custom-scrollbar relative">
                  {activeModuleIdx !== null && localIDP.curriculum?.[activeModuleIdx] ? (
                     <div className="space-y-8 animate-fade-in">
                        <div className="border-b border-slate-100 pb-6 mb-6">
                           <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 block">MODÜL DETAYI</span>
                           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{localIDP.curriculum[activeModuleIdx].title}</h2>
                           <div className="flex gap-4 mt-4">
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">{localIDP.curriculum[activeModuleIdx].focusArea}</span>
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">{localIDP.curriculum[activeModuleIdx].difficulty}</span>
                           </div>
                        </div>

                        <div className="space-y-4">
                           {localIDP.curriculum[activeModuleIdx].units.map((unit, uIdx) => (
                              <div key={unit.id} className="group relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all">
                                 <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black ${unit.isCompleted ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                                          {uIdx + 1}
                                       </div>
                                       <div>
                                          <h5 className={`text-sm font-bold uppercase ${unit.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{unit.title}</h5>
                                          <span className="text-[9px] font-bold text-slate-400 uppercase">{unit.type} • {unit.durationMinutes} Dk</span>
                                       </div>
                                    </div>
                                    <div className="flex gap-2 print:hidden">
                                       <button onClick={() => toggleUnitCompletion(activeModuleIdx, uIdx)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${unit.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-orange-500'}`}>
                                          {unit.isCompleted && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                                       </button>
                                       {editMode && (
                                          <>
                                             <button onClick={() => setEditingUnit({modIdx: activeModuleIdx, unitIdx: uIdx, data: unit})} className="p-1 text-slate-400 hover:text-blue-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                             <button onClick={(e) => deleteUnit(activeModuleIdx, uIdx, e)} className="p-1 text-slate-400 hover:text-rose-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                          </>
                                       )}
                                    </div>
                                 </div>
                                 
                                 <p className="text-[11px] font-medium text-slate-600 leading-relaxed pl-11 mb-4">{unit.content}</p>
                                 
                                 {unit.aiRationale && (
                                    <div className="pl-11">
                                       <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl inline-block">
                                          <span className="text-[8px] font-black text-orange-600 uppercase block mb-1">NÖRAL GEREKÇE</span>
                                          <p className="text-[10px] font-bold text-orange-800 italic">"{unit.aiRationale}"</p>
                                       </div>
                                    </div>
                                 )}

                                 {unit.resources && unit.resources.length > 0 && (
                                     <div className="pl-11 mt-4 space-y-2">
                                         {unit.resources.map((res, i) => (
                                             <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">
                                                 <span>🔗</span>
                                                 <span>{res.title} ({res.type.toUpperCase()})</span>
                                             </div>
                                         ))}
                                     </div>
                                 )}
                              </div>
                           ))}
                           
                           {editMode && (
                              <button onClick={() => addUnit(activeModuleIdx)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-[2rem] text-[10px] font-black uppercase border-2 border-dashed border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-all">
                                 + YENİ ÜNİTE EKLE
                              </button>
                           )}
                        </div>
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                           <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">MODÜL SEÇİNİZ</p>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DevelopmentRouteView;
