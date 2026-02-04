
import React, { useState, useMemo } from 'react';
import { BRANCH_QUESTIONS } from '../../constants';
import { MODULAR_BATTERIES } from '../../features/staff-mentor/assessmentData';
import { Question, AssessmentBattery, AssessmentQuestion } from '../../types';

type InventoryTarget = 'CANDIDATE' | 'STAFF';

const MethodologyInventoryView: React.FC = () => {
  // --- CORE DATA STATES (Local State for Session Persistence) ---
  const [targetType, setTargetType] = useState<InventoryTarget>('CANDIDATE');
  
  // Aday Sorularını Flat Listeye Çevirip State'e Alıyoruz
  const [candidateQuestions, setCandidateQuestions] = useState<Question[]>(
    Object.values(BRANCH_QUESTIONS).flat().map(q => ({...q, uniqueKey: Math.random().toString(36)}))
  );
  
  // Personel Bataryalarını State'e Alıyoruz
  const [staffBatteries, setStaffBatteries] = useState<AssessmentBattery[]>(MODULAR_BATTERIES);

  // --- UI STATES ---
  const [search, setSearch] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // Aktif düzenlenen soru objesi
  const [editingBatteryId, setEditingBatteryId] = useState<string | null>(null); // Sadece personel için

  // --- FILTERING ---
  const filteredList = useMemo(() => {
    const term = search.toLowerCase();
    if (targetType === 'CANDIDATE') {
      return candidateQuestions.filter(q => q.text.toLowerCase().includes(term) || q.category.toLowerCase().includes(term));
    } else {
      // Bataryaların içindeki soruları da arayabiliriz ama şimdilik batarya başlığına göre filtreliyoruz
      return staffBatteries; 
    }
  }, [targetType, candidateQuestions, staffBatteries, search]);

  // --- ACTIONS ---

  const handleExportJSON = () => {
    const data = targetType === 'CANDIDATE' ? candidateQuestions : staffBatteries;
    const fileName = `YG_Inventory_${targetType}_${new Date().toISOString().split('T')[0]}.json`;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string, batteryId?: string) => {
    if (!confirm("Bu soruyu envanterden kalıcı olarak silmek istediğinize emin misiniz?")) return;

    if (targetType === 'CANDIDATE') {
      setCandidateQuestions(prev => prev.filter(q => q.id !== id));
    } else {
      if (batteryId) {
        setStaffBatteries(prev => prev.map(b => {
          if (b.id !== batteryId) return b;
          return { ...b, questions: b.questions.filter(q => q.id !== id) };
        }));
      }
    }
  };

  const handleEditOpen = (question: any, batteryId?: string) => {
    setEditingItem(JSON.parse(JSON.stringify(question))); // Deep copy to prevent direct mutation
    setEditingBatteryId(batteryId || null);
    setIsEditorOpen(true);
  };

  const handleCreateNew = (batteryId?: string) => {
    const newId = `${targetType === 'CANDIDATE' ? 'cand' : 'stf'}_new_${Date.now()}`;
    const emptyQ = targetType === 'CANDIDATE' 
      ? { id: newId, text: '', category: 'technicalExpertise', type: 'radio', weightedOptions: [] }
      : { id: newId, text: '', options: [] };
    
    setEditingItem(emptyQ);
    setEditingBatteryId(batteryId || null);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!editingItem.text) return alert("Soru metni boş olamaz.");

    if (targetType === 'CANDIDATE') {
      const q = editingItem as Question;
      setCandidateQuestions(prev => {
        const exists = prev.find(x => x.id === q.id);
        if (exists) return prev.map(x => x.id === q.id ? q : x);
        return [q, ...prev];
      });
    } else {
      const q = editingItem as AssessmentQuestion;
      if (!editingBatteryId) return;
      setStaffBatteries(prev => prev.map(b => {
        if (b.id !== editingBatteryId) return b;
        const exists = b.questions.find(x => x.id === q.id);
        const newQuestions = exists 
          ? b.questions.map(x => x.id === q.id ? q : x)
          : [q, ...b.questions];
        return { ...b, questions: newQuestions };
      }));
    }
    setIsEditorOpen(false);
  };

  // --- SUB-COMPONENTS FOR EDITOR ---

  const OptionEditor = () => {
    if (!editingItem) return null;

    const addOption = () => {
      if (targetType === 'CANDIDATE') {
        const newOpt = { label: 'Yeni Seçenek', weights: { clinical: 0.5 }, analysisInsight: 'Analiz...' };
        setEditingItem({ ...editingItem, weightedOptions: [...(editingItem.weightedOptions || []), newOpt] });
      } else {
        const newOpt = { label: 'Yeni Seçenek', clinicalValue: 50, aiTag: 'neutral' };
        setEditingItem({ ...editingItem, options: [...(editingItem.options || []), newOpt] });
      }
    };

    const removeOption = (idx: number) => {
      if (targetType === 'CANDIDATE') {
        const next = [...editingItem.weightedOptions];
        next.splice(idx, 1);
        setEditingItem({ ...editingItem, weightedOptions: next });
      } else {
        const next = [...editingItem.options];
        next.splice(idx, 1);
        setEditingItem({ ...editingItem, options: next });
      }
    };

    const updateOption = (idx: number, field: string, value: any) => {
      if (targetType === 'CANDIDATE') {
        const next = [...editingItem.weightedOptions];
        if (field === 'weights') {
           // handled separately
        } else {
           next[idx] = { ...next[idx], [field]: value };
        }
        setEditingItem({ ...editingItem, weightedOptions: next });
      } else {
        const next = [...editingItem.options];
        next[idx] = { ...next[idx], [field]: value };
        setEditingItem({ ...editingItem, options: next });
      }
    };

    // Helper to update nested weights for candidates
    const updateWeight = (optIdx: number, weightKey: string, val: number) => {
       const next = [...editingItem.weightedOptions];
       next[optIdx].weights = { ...next[optIdx].weights, [weightKey]: val };
       setEditingItem({ ...editingItem, weightedOptions: next });
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CEVAP SEÇENEKLERİ</label>
           <button onClick={addOption} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold hover:bg-blue-100 transition-colors">+ SEÇENEK EKLE</button>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {targetType === 'CANDIDATE' ? (
            editingItem.weightedOptions?.map((opt: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group">
                 <button onClick={() => removeOption(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                 
                 <input 
                   type="text" 
                   className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                   value={opt.label}
                   onChange={e => updateOption(idx, 'label', e.target.value)}
                   placeholder="Cevap metni..."
                 />
                 <input 
                   type="text" 
                   className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[10px]"
                   value={opt.analysisInsight}
                   onChange={e => updateOption(idx, 'analysisInsight', e.target.value)}
                   placeholder="AI Analiz Notu (Insight)"
                 />
                 
                 {/* Weight Editors */}
                 <div className="flex gap-2 flex-wrap">
                    {['clinical', 'ethics', 'pedagogicalAnalysis', 'institutionalLoyalty'].map(k => (
                       <div key={k} className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-100">
                          <span className="text-[8px] font-bold uppercase text-slate-400">{k.substring(0,3)}</span>
                          <input 
                            type="number" step="0.1" max="1" min="-1"
                            className="w-10 text-[10px] font-black outline-none text-right"
                            value={opt.weights[k] || 0}
                            onChange={e => updateWeight(idx, k, parseFloat(e.target.value))}
                          />
                       </div>
                    ))}
                 </div>
              </div>
            ))
          ) : (
            editingItem.options?.map((opt: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3 items-center relative">
                 <button onClick={() => removeOption(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                 
                 <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      value={opt.label}
                      onChange={e => updateOption(idx, 'label', e.target.value)}
                      placeholder="Cevap metni..."
                    />
                    <div className="flex gap-2">
                       <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-100 flex-1">
                          <span className="text-[9px] font-black text-slate-400">PUAN</span>
                          <input 
                            type="number" 
                            className="w-full outline-none text-[10px] font-bold"
                            value={opt.clinicalValue}
                            onChange={e => updateOption(idx, 'clinicalValue', parseInt(e.target.value))}
                          />
                       </div>
                       <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-100 flex-[2]">
                          <span className="text-[9px] font-black text-slate-400">TAG</span>
                          <input 
                            type="text" 
                            className="w-full outline-none text-[10px] font-bold uppercase"
                            value={opt.aiTag}
                            onChange={e => updateOption(idx, 'aiTag', e.target.value)}
                          />
                       </div>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden relative">
      
      {/* --- EDITOR MODAL --- */}
      {isEditorOpen && editingItem && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Soru Düzenleyici</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {editingItem.id}</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setIsEditorOpen(false)} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50">İptal</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-600 transition-colors">Değişiklikleri Kaydet</button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SORU METNİ</label>
                    <textarea 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-orange-500 transition-all min-h-[100px]"
                      value={editingItem.text}
                      onChange={e => setEditingItem({...editingItem, text: e.target.value})}
                    />
                 </div>

                 {targetType === 'CANDIDATE' && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">KATEGORİ</label>
                       <select 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                         value={editingItem.category}
                         onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                       >
                          {['technicalExpertise', 'workEthics', 'pedagogicalAnalysis', 'sustainability', 'institutionalLoyalty', 'developmentOpenness'].map(c => (
                             <option key={c} value={c}>{c}</option>
                          ))}
                       </select>
                    </div>
                 )}

                 <div className="h-px bg-slate-100 my-4"></div>
                 <OptionEditor />
              </div>
           </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 no-print">
        <div className="p-8 border-b border-slate-100">
           <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button 
                onClick={() => setTargetType('CANDIDATE')}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'CANDIDATE' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
              >ADAYLAR</button>
              <button 
                onClick={() => setTargetType('STAFF')}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'STAFF' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >PERSONEL</button>
           </div>
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Envanter</h3>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {targetType === 'CANDIDATE' ? `${candidateQuestions.length} Soru` : `${staffBatteries.length} Batarya`}
           </p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
           {targetType === 'STAFF' && (
              <div className="space-y-4">
                 {staffBatteries.map(b => (
                    <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                       <h5 className="text-[11px] font-black text-slate-900 uppercase mb-1">{b.title}</h5>
                       <p className="text-[9px] text-slate-400 font-bold">{b.questions.length} SORU</p>
                    </div>
                 ))}
              </div>
           )}
           {targetType === 'CANDIDATE' && (
              <div className="p-4 text-center opacity-50">
                 <p className="text-[10px] font-bold text-slate-400">Aday soruları kategori bazlı filtrelenir.</p>
              </div>
           )}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
           <div className="relative w-96">
              <input 
                type="text" placeholder="Soru metni ara..." 
                className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                value={search} onChange={e => setSearch(e.target.value)}
              />
              <svg className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <div className="flex items-center gap-3">
              <button onClick={handleExportJSON} className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                 JSON DIŞA AKTAR
              </button>
              <button onClick={() => handleCreateNew(targetType === 'STAFF' ? staffBatteries[0].id : undefined)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">
                 + YENİ SORU
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
           {targetType === 'CANDIDATE' ? (
             filteredList.map((q: any) => (
               <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all relative">
                  <div className="flex justify-between items-start mb-6">
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{q.category}</span>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditOpen(q)} className="p-2 bg-slate-50 text-blue-600 rounded-xl hover:bg-blue-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={() => handleDelete(q.id)} className="p-2 bg-slate-50 text-rose-600 rounded-xl hover:bg-rose-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                     </div>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 leading-snug mb-6 uppercase">"{q.text}"</h4>
                  <div className="space-y-2">
                     {q.weightedOptions?.map((o: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                           <span>{o.label}</span>
                        </div>
                     ))}
                  </div>
               </div>
             ))
           ) : (
             staffBatteries.map(battery => (
               <div key={battery.id} className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl">{battery.icon}</div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{battery.title}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{battery.questions.length} SORU</p>
                     </div>
                     <button onClick={() => handleCreateNew(battery.id)} className="ml-auto px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase hover:bg-slate-200">+ SORU EKLE</button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                     {battery.questions.map((q, qidx) => (
                        <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 relative group hover:shadow-lg transition-all">
                           <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditOpen(q, battery.id)} className="p-2 bg-slate-50 text-blue-600 rounded-xl hover:bg-blue-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                              <button onClick={() => handleDelete(q.id, battery.id)} className="p-2 bg-slate-50 text-rose-600 rounded-xl hover:bg-rose-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                           </div>
                           <div className="flex gap-4">
                              <span className="text-3xl font-black text-slate-100">{qidx + 1}</span>
                              <div className="flex-1">
                                 <h5 className="text-sm font-black text-slate-800 mb-4 uppercase leading-snug">"{q.text}"</h5>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((o, oidx) => (
                                       <div key={oidx} className="p-3 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 flex justify-between items-center border border-slate-100">
                                          <span className="truncate pr-2">{o.label}</span>
                                          <span className="bg-white px-2 py-0.5 rounded text-[8px] border border-slate-100 text-slate-400">{o.clinicalValue} Puan</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default MethodologyInventoryView;
