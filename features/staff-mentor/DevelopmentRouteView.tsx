
import React, { useState, useEffect, useMemo } from 'react';
import { StaffMember, IDP, TrainingUnit, TrainingModule } from '../../types';
import { armsService } from '../../services/ai/armsService';
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
    if (!confirm("AI MOTORU TETİKLENİYOR: Personelin tüm sınav geçmişi analiz edilerek yeni bir nöral müfredat oluşturulacak. Onaylıyor musunuz?")) return;
    setIsGenerating(true);
    try {
      const newIDP = await armsService.generateIDP(staff, assessmentHistory);
      if (newIDP) {
          setLocalIDP(newIDP);
          setEditMode(true);
          setActiveModuleIdx(0);
      }
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

  const addModule = () => {
    if(!localIDP) return;
    const currentCurriculum = Array.isArray(localIDP.curriculum) ? localIDP.curriculum : [];
    const newMod: TrainingModule = {
      id: `MOD-${Date.now()}`,
      title: 'Yeni Eğitim Modülü',
      focusArea: 'Klinik Yetkinlik',
      difficulty: 'intermediate',
      status: 'active',
      units: []
    };
    setLocalIDP({ ...localIDP, curriculum: [...currentCurriculum, newMod] });
    setActiveModuleIdx(currentCurriculum.length);
  };

  const addUnit = (modIdx: number) => {
    if (!localIDP?.curriculum || !localIDP.curriculum[modIdx]) return;
    const newC = [...localIDP.curriculum];
    const currentUnits = Array.isArray(newC[modIdx].units) ? newC[modIdx].units : [];
    
    const newUnit: TrainingUnit = {
      id: `U-${Date.now()}`,
      title: 'Yeni Eğitim Ünitesi',
      type: 'reading',
      content: 'İçerik...',
      durationMinutes: 45,
      isCompleted: false,
      status: 'pending',
      aiRationale: 'Manuel eklendi.'
    };
    
    newC[modIdx].units = [...currentUnits, newUnit];
    setLocalIDP({ ...localIDP, curriculum: newC });
    setEditingUnit({ modIdx, unitIdx: newC[modIdx].units.length - 1, data: newUnit });
  };

  if (!localIDP && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 text-center animate-fade-in">
        <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-10 shadow-inner">
           <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Gelişim Planı Bekleniyor</h3>
        <button onClick={handleGenerateIDP} className="px-16 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95">MÜFREDAT SENTEZİNİ BAŞLAT</button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-10 animate-fade-in text-center">
         <div className="w-56 h-56 border-[12px] border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
         <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Nöral Planlama Aktif</h3>
      </div>
    );
  }

  const currentCurriculum = Array.isArray(localIDP?.curriculum) ? localIDP!.curriculum : [];
  const activeModule = activeModuleIdx !== null ? currentCurriculum[activeModuleIdx] : null;

  return (
    <div className="flex flex-col gap-6 animate-slide-up h-full pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[3rem] border border-slate-200 shadow-sm gap-6 no-print">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
               <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Müfredat Stüdyosu</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{localIDP?.focusArea || 'Genel Rota'}</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {!editMode ? (
               <button onClick={() => setEditMode(true)} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">DÜZENLE</button>
            ) : (
               <button onClick={handleSaveChanges} disabled={isSaving} className="px-10 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {isSaving ? 'KAYDEDİLİYOR...' : 'MÜHÜRLE VE ÇIK'}
               </button>
            )}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0 overflow-hidden">
         <div className="col-span-12 lg:col-span-4 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden no-print">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">EĞİTİM ROTASI</h4>
               {editMode && <button onClick={addModule} className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">+</button>}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
               {currentCurriculum.map((mod, idx) => (
                  <div 
                    key={mod.id || idx} 
                    onClick={() => setActiveModuleIdx(idx)}
                    className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all ${activeModuleIdx === idx ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 hover:border-orange-200'}`}
                  >
                     <h5 className="text-sm font-black uppercase leading-tight mb-4">{mod.title}</h5>
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold opacity-60 uppercase">{mod.units?.length || 0} Ünite</span>
                        <span className="text-[9px] font-black uppercase opacity-40">{mod.difficulty}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full">
            <div className="flex-1 bg-white rounded-[4rem] border border-slate-200 shadow-xl p-12 overflow-y-auto custom-scrollbar relative">
               {activeModule ? (
                  <div className="space-y-12 animate-fade-in pb-20">
                     <div className="border-b border-slate-100 pb-10 flex justify-between items-end">
                        <div>
                           <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{activeModule.title}</h2>
                        </div>
                        {editMode && <button onClick={() => addUnit(activeModuleIdx!)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">+ ÜNİTE EKLE</button>}
                     </div>

                     <div className="grid grid-cols-1 gap-6">
                        {(activeModule.units ?? []).map((unit, uIdx) => (
                           <div key={unit.id || uIdx} className="p-10 bg-[#FAFAFA] rounded-[3.5rem] border-2 border-transparent hover:border-orange-500 transition-all duration-500">
                              <div className="flex justify-between items-start mb-8">
                                 <h5 className="text-xl font-black uppercase text-slate-800">{unit.title}</h5>
                                 <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{unit.type}</span>
                              </div>
                              <p className="text-base font-medium text-slate-600 leading-relaxed italic">"{unit.content}"</p>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                     <h3 className="text-4xl font-black text-slate-400 uppercase tracking-[0.6em]">Modül Seçin</h3>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default DevelopmentRouteView;
