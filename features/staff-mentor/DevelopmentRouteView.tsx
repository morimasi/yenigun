
import React, { useState, useEffect } from 'react';
import { StaffMember, IDP, TrainingUnit } from '../../types';
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

  // Parent'tan gelen veri değişirse (örn: refresh sonrası) local state'i güncelle
  useEffect(() => {
    if (currentIDP) {
      setLocalIDP(JSON.parse(JSON.stringify(currentIDP))); // Deep copy to prevent mutation
    } else {
      setLocalIDP(null);
    }
  }, [currentIDP]);

  const handleGenerateIDP = async () => {
    setIsGenerating(true);
    try {
      const newIDP = await armsService.generateIDP(staff, assessmentHistory);
      setLocalIDP(newIDP);
      // Otomatik kaydetme opsiyonel, burada kullanıcı onayı bekliyoruz (Kaydet butonu ile)
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
      await onSave(localIDP);
      setEditMode(false);
      alert("Müfredat ve stratejik hedefler sisteme mühürlendi.");
    } catch (e) {
      alert("Kayıt sırasında hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- MÜFREDAT EDİTÖR FONKSİYONLARI ---

  const updateModuleTitle = (modIdx: number, val: string) => {
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    newC[modIdx].title = val;
    setLocalIDP({ ...localIDP, curriculum: newC });
  };

  const toggleUnitCompletion = (modIdx: number, unitIdx: number) => {
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    newC[modIdx].units[unitIdx].isCompleted = !newC[modIdx].units[unitIdx].isCompleted;
    
    // Anlık etkileşim için local update
    const updatedIDP = { ...localIDP, curriculum: newC };
    setLocalIDP(updatedIDP);
    
    // UX Kararı: Tamamlama durumunu (checkbox) anında kaydetmek kullanıcı için daha akıcıdır
    onSave(updatedIDP).catch(console.error);
  };

  const addUnit = (modIdx: number) => {
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    const newUnit: TrainingUnit = {
      id: `U-${Date.now()}`,
      title: 'Yeni Eğitim Ünitesi',
      type: 'reading',
      content: 'İçerik detayı giriniz...',
      durationMinutes: 30,
      isCompleted: false,
      aiRationale: 'Manuel olarak eklendi.'
    };
    newC[modIdx].units.push(newUnit);
    setLocalIDP({ ...localIDP, curriculum: newC });
  };

  const deleteUnit = (modIdx: number, unitIdx: number) => {
    if (!localIDP?.curriculum) return;
    const newC = [...localIDP.curriculum];
    newC[modIdx].units.splice(unitIdx, 1);
    setLocalIDP({ ...localIDP, curriculum: newC });
  };

  // --- RENDER ---

  if (!localIDP) {
    return (
      <div className="flex flex-col items-center justify-center p-24 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 text-center animate-fade-in">
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
    <div className="grid grid-cols-12 gap-8 animate-slide-up">
                     
      {/* LEFT COLUMN: STRATEGY & INFO */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        
        {/* STRATEGIC CARD */}
        <div className="bg-orange-600 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-4">GELİŞİM HEDEFİ (STRATEJİK ODAK)</h4>
              <p className="text-2xl font-black leading-tight italic tracking-tight mb-8">"{localIDP.focusArea}"</p>
              <div className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <span className="text-[9px] font-black text-orange-200 uppercase block mb-2">AI ANALİZ NOTU</span>
                  <p className="text-[11px] font-medium text-white/90 leading-relaxed italic">{localIDP.aiAnalysisSummary}</p>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000"></div>
        </div>

        {/* IDENTIFIED GAPS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">TESPİT EDİLEN EKSİKLİKLER</h5>
            <div className="space-y-3">
              {localIDP.identifiedGaps?.map((gap, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="text-rose-500 font-bold text-xs mt-0.5">!</span>
                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{gap}</p>
                  </div>
              ))}
            </div>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-3">
            <button 
              onClick={() => setEditMode(!editMode)} 
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${editMode ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'}`}
            >
              {editMode ? 'DÜZENLEMEYİ BİTİR' : 'MÜFREDATI DÜZENLE'}
            </button>
            {(editMode || !currentIDP) && (
              <button 
                onClick={handleSaveChanges} 
                disabled={isSaving}
                className="px-6 py-4 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center disabled:opacity-50"
              >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
              </button>
            )}
            
            {/* Yeniden Oluştur (Sadece Edit Modunda) */}
            {editMode && (
               <button 
                 onClick={handleGenerateIDP}
                 disabled={isGenerating}
                 className="px-6 py-4 bg-orange-100 text-orange-600 rounded-2xl hover:bg-orange-200 transition-all"
                 title="AI ile Yeniden Üret"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
               </button>
            )}
        </div>
      </div>

      {/* RIGHT COLUMN: CURRICULUM MODULES */}
      <div className="col-span-12 xl:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">HİZMET İÇİ EĞİTİM MODÜLLERİ</h4>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-bold text-slate-500">{localIDP.curriculum?.length || 0} MODÜL</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-bold text-slate-500">
                   {localIDP.curriculum?.reduce((acc, m) => acc + m.units.filter(u => u.isCompleted).length, 0)} TAMAMLANDI
                </span>
            </div>
        </div>

        <div className="space-y-6">
            {(localIDP.curriculum || []).map((module, modIdx) => (
              <div key={module.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  {/* Module Header */}
                  <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${module.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-900 text-white'}`}>
                          {modIdx + 1}
                        </div>
                        <div>
                          {editMode ? (
                              <input 
                                type="text" 
                                className="bg-transparent border-b border-slate-300 font-black text-slate-900 text-sm outline-none w-full"
                                value={module.title}
                                onChange={(e) => updateModuleTitle(modIdx, e.target.value)}
                              />
                          ) : (
                              <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">{module.title}</h5>
                          )}
                          <div className="flex gap-2 mt-1">
                              <span className="text-[9px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">{module.difficulty.toUpperCase()}</span>
                              <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">{module.focusArea}</span>
                          </div>
                        </div>
                    </div>
                    {editMode && (
                        <button onClick={() => addUnit(modIdx)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-[9px] font-bold text-slate-600 transition-all">
                          + ÜNİTE EKLE
                        </button>
                    )}
                  </div>

                  {/* Units List */}
                  <div className="p-2 space-y-1">
                    {module.units.map((unit, unitIdx) => (
                        <div key={unit.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group/unit">
                          <button 
                              onClick={() => toggleUnitCompletion(modIdx, unitIdx)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${unit.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-orange-500'}`}
                          >
                              {unit.isCompleted && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className={`text-[11px] font-bold uppercase ${unit.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                    {unit.title}
                                </p>
                                {editMode && (
                                    <button onClick={() => deleteUnit(modIdx, unitIdx)} className="text-rose-400 hover:text-rose-600 px-2">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                              </div>
                              <p className="text-[10px] font-medium text-slate-500 mt-1 leading-relaxed">{unit.content}</p>
                              
                              {/* AI Rationale Tooltip */}
                              <div className="mt-2 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase">{unit.type}</span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold">{unit.durationMinutes} DK</span>
                                {unit.aiRationale && (
                                    <div className="group/tooltip relative">
                                      <span className="text-[9px] text-orange-600 italic opacity-80 cursor-help flex items-center gap-1">
                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                          Nedensellik
                                      </span>
                                      <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-900 text-white p-3 rounded-xl text-[9px] opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
                                          <span className="font-bold block mb-1 text-orange-500 uppercase">AI ANALİZİ:</span>
                                          {unit.aiRationale}
                                          <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                                      </div>
                                    </div>
                                )}
                              </div>
                          </div>
                        </div>
                    ))}
                    {module.units.length === 0 && (
                        <div className="p-4 text-center text-[10px] font-bold text-slate-300 uppercase">Bu modülde henüz görev yok.</div>
                    )}
                  </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DevelopmentRouteView;
