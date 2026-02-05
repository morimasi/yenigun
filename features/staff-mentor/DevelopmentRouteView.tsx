
import React, { useState, useEffect } from 'react';
import { StaffMember, IDP, TrainingUnit, TrainingModule, PresentationConfig } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PresentationStudio from './PresentationStudio';

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
  
  // STUDIO STATE
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioConfig, setStudioConfig] = useState<PresentationConfig | undefined>(undefined);

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
      setEditMode(true);
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
      alert("Müfredat veritabanına mühürlendi.");
    } catch (e) {
      alert("Kayıt sırasında hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const openPresentationStudio = (unit: TrainingUnit) => {
      setStudioConfig({
          topic: unit.title,
          contextData: `AKADEMİK ODAK: ${unit.content} | HEDEF: ${unit.aiRationale}`,
          targetAudience: 'team',
          tone: 'academic',
          depth: 'intermediate',
          slideCount: 8,
          visualStyle: 'corporate',
          includeAnimations: true
      });
      setIsStudioOpen(true);
  };

  if (isStudioOpen) return <PresentationStudio initialConfig={studioConfig} onClose={() => setIsStudioOpen(false)} />;

  if (!localIDP) {
    return (
      <div className="flex flex-col items-center justify-center p-24 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 text-center animate-fade-in min-h-[500px] shadow-inner">
        <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-10 shadow-sm text-slate-300">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
        </div>
        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Müfredat Tanımlanmamış</h3>
        <p className="text-slate-400 font-bold text-sm mb-12 max-w-md uppercase tracking-widest leading-relaxed">Personelin bilişsel açıkları ve klinik performans verileri analiz edilerek bir "Tanısal Yol Haritası" oluşturulması gerekiyor.</p>
        <button 
          onClick={handleGenerateIDP} 
          disabled={isGenerating} 
          className="px-16 py-8 bg-slate-900 text-white rounded-[3rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-4 active:scale-95"
        >
          {isGenerating ? 'VERİLER SENTEZLENİYOR...' : 'NÖRAL MÜFREDAT MOTORUNU BAŞLAT'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up h-full">
      {/* TOOLBAR */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm print:hidden">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">IDP</div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Gelişim Stüdyosu</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Müfredat Revizyon Tarihi: {new Date(localIDP.updatedAt || Date.now()).toLocaleDateString()}</p>
            </div>
         </div>
         <div className="flex gap-4">
            {!editMode ? (
                 <button onClick={() => setEditMode(true)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">PLANI DÜZENLE</button>
            ) : (
               <>
                 <button onClick={() => setEditMode(false)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-rose-500 transition-all">İPTAL</button>
                 <button onClick={handleSaveChanges} disabled={isSaving} className="px-12 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-3">
                    {isSaving ? 'YAZILIYOR...' : 'MÜHÜRLE VE ÇIK'}
                 </button>
               </>
            )}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0 items-stretch">
         {/* MODULE LIST */}
         <div className="col-span-4 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">EĞİTİM MODÜLLERİ</h4>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
               {localIDP.curriculum?.map((mod, idx) => (
                  <div 
                    key={mod.id} 
                    onClick={() => setActiveModuleIdx(idx)}
                    className={`p-6 rounded-[2.5rem] border-4 cursor-pointer transition-all relative overflow-hidden group ${activeModuleIdx === idx ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' : 'bg-white border-slate-50 hover:border-orange-100 text-slate-600'}`}
                  >
                     <h5 className="text-base font-black uppercase leading-tight mb-3 pr-8">{mod.title}</h5>
                     <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeModuleIdx === idx ? 'bg-white/10 text-orange-400' : 'bg-slate-100 text-slate-400'}`}>{mod.difficulty}</span>
                        <span className="text-[9px] font-bold opacity-60 uppercase">{mod.units.length} ÜNİTE</span>
                     </div>
                     <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-500 ${activeModuleIdx === idx ? 'translate-x-0' : 'translate-x-12'}`}>
                        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* UNIT DETAIL STAGE */}
         <div className="col-span-8 bg-white rounded-[4.5rem] border border-slate-200 shadow-sm p-12 overflow-y-auto custom-scrollbar relative overflow-hidden">
            {activeModuleIdx !== null && localIDP.curriculum?.[activeModuleIdx] ? (
               <div className="space-y-12 animate-fade-in relative z-10">
                  <div className="border-b-4 border-slate-50 pb-10">
                     <span className="text-[11px] font-black text-orange-600 uppercase tracking-[0.5em] mb-4 block">AKTİF MODÜL ANALİZİ</span>
                     <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{localIDP.curriculum[activeModuleIdx].title}</h2>
                     <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-6 bg-slate-50 inline-block px-4 py-2 rounded-xl">Hedef: {localIDP.curriculum[activeModuleIdx].focusArea}</p>
                  </div>

                  <div className="space-y-6">
                     {localIDP.curriculum[activeModuleIdx].units.map((unit, uIdx) => (
                        <div key={unit.id} className="p-10 bg-slate-50/50 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:border-orange-500 hover:shadow-2xl transition-all group relative overflow-hidden">
                           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 relative z-10">
                              <div className="flex items-center gap-6">
                                 <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center text-white text-lg font-black shadow-xl ${unit.isCompleted ? 'bg-emerald-500' : 'bg-slate-900 group-hover:bg-orange-600 transition-colors'}`}>{uIdx + 1}</div>
                                 <div>
                                    <h5 className="text-lg font-black uppercase text-slate-900 tracking-tight leading-none mb-2">{unit.title}</h5>
                                    <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{unit.type}</span>
                                 </div>
                              </div>
                              <button 
                                 onClick={() => openPresentationStudio(unit)}
                                 className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xl flex items-center gap-3 active:scale-95"
                              >
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                                 NÖRAL SUNUM ÜRET
                              </button>
                           </div>
                           <div className="pl-18 space-y-6 relative z-10">
                              <p className="text-base font-medium text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-8">"{unit.content}"</p>
                              {unit.aiRationale && (
                                 <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group/rationale">
                                    <span className="text-[10px] font-black text-orange-200 uppercase block mb-4 tracking-[0.3em]">AI PEDAGOJİK GEREKÇE</span>
                                    <p className="text-sm font-bold leading-relaxed italic relative z-10">"{unit.aiRationale}"</p>
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover/rationale:scale-150 transition-transform duration-1000"></div>
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-10 select-none grayscale">
                  <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-8 border border-slate-200">
                     <svg className="w-24 h-24 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <p className="text-3xl font-black text-slate-900 uppercase tracking-[0.5em]">Müfredat Seçilmedi</p>
               </div>
            )}
            <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
         </div>
      </div>
    </div>
  );
};

export default DevelopmentRouteView;
