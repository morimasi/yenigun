
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
  const [editingUnit, setEditingUnit] = useState<{modIdx: number, unitIdx: number, data: TrainingUnit} | null>(null);
  
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
      setEditingUnit(null);
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
          contextData: `EĞİTİM İÇERİĞİ: ${unit.content} | AI GEREKÇESİ: ${unit.aiRationale}`,
          targetAudience: 'individual',
          tone: 'academic',
          depth: 'intermediate',
          slideCount: 6,
          visualStyle: 'corporate',
          includeAnimations: true
      });
      setIsStudioOpen(true);
  };

  if (isStudioOpen) return <PresentationStudio initialConfig={studioConfig} onClose={() => setIsStudioOpen(false)} />;

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
          {isGenerating ? 'ANALİZ & İNŞA SÜRECİ...' : 'YENİ MÜFREDAT OLUŞTUR'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up h-full">
      {/* TOOLBAR */}
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
                 <button onClick={() => setEditMode(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">DÜZENLE</button>
            ) : (
               <>
                 <button onClick={() => setEditMode(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-rose-500 transition-all">İPTAL</button>
                 <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2">
                    {isSaving ? 'MÜHÜRLENİYOR...' : 'KAYDET VE ÇIK'}
                 </button>
               </>
            )}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
         {/* MODULE LIST */}
         <div className="col-span-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">EĞİTİM MODÜLLERİ</h4>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
               {localIDP.curriculum?.map((mod, idx) => (
                  <div 
                    key={mod.id} 
                    onClick={() => setActiveModuleIdx(idx)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${activeModuleIdx === idx ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300 text-slate-600'}`}
                  >
                     <h5 className="text-sm font-black uppercase leading-tight mb-2">{mod.title}</h5>
                     <div className="flex items-center gap-2 text-[9px] font-bold opacity-60">
                        {mod.units.length} ÜNİTE • {mod.difficulty.toUpperCase()}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* UNIT DETAIL */}
         <div className="col-span-8 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm p-8 overflow-y-auto custom-scrollbar">
            {activeModuleIdx !== null && localIDP.curriculum?.[activeModuleIdx] ? (
               <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-slate-100 pb-6 mb-6">
                     <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 block">MODÜL DETAYI</span>
                     <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{localIDP.curriculum[activeModuleIdx].title}</h2>
                  </div>

                  <div className="space-y-4">
                     {localIDP.curriculum[activeModuleIdx].units.map((unit, uIdx) => (
                        <div key={unit.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-orange-200 transition-all group relative">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black ${unit.isCompleted ? 'bg-emerald-500' : 'bg-slate-900'}`}>{uIdx + 1}</div>
                                 <h5 className="text-sm font-bold uppercase text-slate-900">{unit.title}</h5>
                              </div>
                              <button onClick={() => openPresentationStudio(unit)} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2">
                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                                 AI SUNUM OLUŞTUR
                              </button>
                           </div>
                           <p className="text-[11px] font-medium text-slate-600 leading-relaxed pl-12 mb-4">{unit.content}</p>
                           {unit.aiRationale && (
                              <div className="pl-12">
                                 <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl inline-block">
                                    <span className="text-[8px] font-black text-orange-600 uppercase block mb-1">NÖRAL GEREKÇE</span>
                                    <p className="text-[10px] font-bold text-orange-800 italic">"{unit.aiRationale}"</p>
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">MODÜL SEÇİNİZ</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DevelopmentRouteView;
