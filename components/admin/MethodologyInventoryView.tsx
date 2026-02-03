
import React, { useState, useMemo } from 'react';
import { BRANCH_QUESTIONS } from '../../constants';
import { MODULAR_BATTERIES } from '../../features/staff-mentor/assessmentData';
import { Question, AssessmentBattery, AssessmentQuestion, Branch } from '../../types';

type InventoryTarget = 'CANDIDATE' | 'STAFF';

const MethodologyInventoryView: React.FC = () => {
  // --- CORE DATA STATES ---
  const [targetType, setTargetType] = useState<InventoryTarget>('CANDIDATE');
  const [candidateQuestions, setCandidateQuestions] = useState<Question[]>(
    Object.values(BRANCH_QUESTIONS).flat()
  );
  const [staffBatteries, setStaffBatteries] = useState<AssessmentBattery[]>(MODULAR_BATTERIES);

  // --- UI STATES ---
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // --- DRAFT STATES ---
  const [draftTarget, setDraftTarget] = useState<InventoryTarget>('CANDIDATE');
  const [activeBatteryId, setActiveBatteryId] = useState<string | null>(null);
  
  // Aday Soru Taslağı
  const [draftCandQ, setDraftCandQ] = useState<Partial<Question>>({
    id: '', text: '', category: 'technicalExpertise', type: 'radio', weightedOptions: []
  });

  // Personel Soru Taslağı
  const [draftStaffQ, setDraftStaffQ] = useState<Partial<AssessmentQuestion>>({
    id: '', text: '', options: []
  });

  // Seçenek Oluşturucu
  const [optLabel, setOptLabel] = useState('');
  const [optWeight, setOptWeight] = useState(0); // clinicalValue veya merit
  const [optAiTag, setOptAiTag] = useState('');

  // --- COMPUTED DATA ---
  const filteredList = useMemo(() => {
    if (targetType === 'CANDIDATE') {
      return candidateQuestions.filter(q => {
        const mCat = activeCategory === 'all' || q.category === activeCategory;
        const mSearch = q.text.toLowerCase().includes(search.toLowerCase());
        return mCat && mSearch;
      });
    } else {
      return staffBatteries.filter(b => {
        const mSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                       b.description.toLowerCase().includes(search.toLowerCase());
        return mSearch;
      });
    }
  }, [targetType, candidateQuestions, staffBatteries, activeCategory, search]);

  // --- ACTIONS ---
  const openEditor = (type: InventoryTarget, existing?: any, batteryId?: string) => {
    setDraftTarget(type);
    setEditMode(!!existing);
    setActiveBatteryId(batteryId || null);
    
    if (type === 'CANDIDATE') {
      setDraftCandQ(existing ? JSON.parse(JSON.stringify(existing)) : {
        id: `cand_${Date.now()}`, text: '', category: 'technicalExpertise', type: 'radio', weightedOptions: []
      });
    } else {
      setDraftStaffQ(existing ? JSON.parse(JSON.stringify(existing)) : {
        id: `staff_${Date.now()}`, text: '', options: []
      });
    }
    setIsEditorOpen(true);
  };

  const handleAddOption = () => {
    if (!optLabel) return;
    if (draftTarget === 'CANDIDATE') {
      const newOpt = { label: optLabel, weights: { [draftCandQ.category || 'clinical']: optWeight / 100 } };
      setDraftCandQ(prev => ({ ...prev, weightedOptions: [...(prev.weightedOptions || []), newOpt] }));
    } else {
      const newOpt = { label: optLabel, clinicalValue: optWeight, aiTag: optAiTag || 'manual_entry' };
      setDraftStaffQ(prev => ({ ...prev, options: [...(prev.options || []), newOpt] }));
    }
    setOptLabel(''); setOptWeight(0); setOptAiTag('');
  };

  const handleSave = () => {
    if (draftTarget === 'CANDIDATE') {
      const q = draftCandQ as Question;
      setCandidateQuestions(prev => editMode ? prev.map(x => x.id === q.id ? q : x) : [q, ...prev]);
    } else {
      const q = draftStaffQ as AssessmentQuestion;
      if (!activeBatteryId) return;
      setStaffBatteries(prev => prev.map(b => {
        if (b.id !== activeBatteryId) return b;
        const newQs = editMode ? b.questions.map(x => x.id === q.id ? q : x) : [q, ...b.questions];
        return { ...b, questions: newQs };
      }));
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (id: string, isBattery: boolean = false) => {
    if (!confirm("Bu veriyi silmek liyakat algoritmasını etkileyebilir. Emin misiniz?")) return;
    if (targetType === 'CANDIDATE') {
      setCandidateQuestions(prev => prev.filter(x => x.id !== id));
    } else {
      if (isBattery) {
        setStaffBatteries(prev => prev.filter(x => x.id !== id));
      } else {
        setStaffBatteries(prev => prev.map(b => ({ ...b, questions: b.questions.filter(q => q.id !== id) })));
      }
    }
  };

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden">
      
      {/* SOL: KOMUTA MERKEZİ */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-100">
           <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button 
                onClick={() => { setTargetType('CANDIDATE'); setActiveCategory('all'); }}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'CANDIDATE' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
              >ADAYLAR</button>
              <button 
                onClick={() => { setTargetType('STAFF'); setActiveCategory('all'); }}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'STAFF' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >PERSONEL</button>
           </div>
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Bilişsel Envanter</h3>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Metodoloji & Analiz Filtresi</p>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
           {targetType === 'CANDIDATE' ? (
              ['all', 'technicalExpertise', 'workEthics', 'pedagogicalAnalysis', 'sustainability', 'institutionalLoyalty'].map(cat => (
                <button 
                  key={cat} onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  <span className="text-[10px] font-black uppercase">{cat.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-[10px] font-bold opacity-50">{candidateQuestions.filter(x => cat === 'all' || x.category === cat).length}</span>
                </button>
              ))
           ) : (
             staffBatteries.map(b => (
               <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[11px] font-black text-slate-900 uppercase truncate pr-2">{b.title}</span>
                     <button onClick={() => handleDelete(b.id, true)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:scale-110 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{b.questions.length} SORU MÜHÜRLÜ</p>
               </div>
             ))
           )}
        </div>

        <div className="p-6 border-t border-slate-100">
           <button 
             onClick={() => targetType === 'CANDIDATE' ? openEditor('CANDIDATE') : alert("Lütfen aşağıdan bir batarya seçip 'Soru Ekle' deyin.")}
             className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${targetType === 'CANDIDATE' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
           >
             + YENİ SORU ÜRET
           </button>
        </div>
      </div>

      {/* ANA PANEL: LİSTELEME */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
           <div className="relative w-96">
              <input 
                type="text" placeholder="Envanterde ara..." 
                className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-slate-200"
                value={search} onChange={e => setSearch(e.target.value)}
              />
              <svg className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem v12.5 Stable</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
           {targetType === 'CANDIDATE' ? (
             filteredList.map((q: any) => (
               <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{q.category}</span>
                     <div className="flex gap-2">
                        <button onClick={() => openEditor('CANDIDATE', q)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                     </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 leading-tight mb-8 uppercase tracking-tighter">"{q.text}"</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {q.weightedOptions?.map((o: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between hover:bg-slate-900 group/opt transition-all">
                           <p className="text-[11px] font-bold text-slate-600 group-hover/opt:text-white leading-snug mb-3">"{o.label}"</p>
                           <div className="flex gap-2">
                              {Object.entries(o.weights).map(([k,v]) => (
                                <span key={k} className="text-[8px] font-black bg-white/10 text-slate-400 px-2 py-0.5 rounded border border-white/5 uppercase">{k.substring(0,3)}: {v}</span>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             ))
           ) : (
             staffBatteries.map(battery => (
               <div key={battery.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                     <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{battery.title}</h2>
                     <button 
                        onClick={() => openEditor('STAFF', null, battery.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
                     >+ SORU EKLE</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     {battery.questions.map((q, qidx) => (
                        <div key={q.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row gap-6 relative group/sq">
                           <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shrink-0">{qidx + 1}</div>
                           <div className="flex-1">
                              <h5 className="text-base font-black text-slate-800 mb-4 uppercase tracking-tight">"{q.text}"</h5>
                              <div className="space-y-2">
                                 {q.options.map((o, oidx) => (
                                    <div key={oidx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600">
                                       <span className="flex-1 italic pr-4">"{o.label}"</span>
                                       <div className="flex gap-3 shrink-0">
                                          <span className="text-blue-600 font-black">VAL: %{o.clinicalValue}</span>
                                          <span className="text-slate-400 font-black uppercase">TAG: {o.aiTag}</span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover/sq:opacity-100 transition-all">
                              <button onClick={() => openEditor('STAFF', q, battery.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button onClick={() => handleDelete(q.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-lg">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      {/* EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
              <div className={`p-10 border-b flex justify-between items-center ${draftTarget === 'CANDIDATE' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{editMode ? 'Kayıt Güncelle' : 'Sisteme Enjekte Et'}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hedef: {draftTarget} | Modül: {activeBatteryId || 'Genel'}</p>
                 </div>
                 <button onClick={() => setIsEditorOpen(false)} className="p-4 hover:bg-rose-100 text-rose-500 rounded-2xl transition-all">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Soru Metni (Akademik Parametre)</label>
                    <textarea 
                       className="w-full p-8 bg-slate-50 rounded-[2.5rem] font-bold text-lg text-slate-900 border-2 border-transparent focus:border-slate-900 outline-none transition-all h-32 resize-none"
                       value={draftTarget === 'CANDIDATE' ? draftCandQ.text : draftStaffQ.text}
                       onChange={e => draftTarget === 'CANDIDATE' ? setDraftCandQ({...draftCandQ, text: e.target.value}) : setDraftStaffQ({...draftStaffQ, text: e.target.value})}
                    />
                 </div>

                 {/* OPSİYON OLUŞTURUCU */}
                 <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 space-y-6">
                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Seçenek & Ağırlık Katmanı</h5>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                       <div className="md:col-span-6">
                          <input 
                            placeholder="Seçenek metni..." className="w-full p-4 rounded-xl border border-slate-200 text-xs font-bold outline-none" 
                            value={optLabel} onChange={e => setOptLabel(e.target.value)}
                          />
                       </div>
                       <div className="md:col-span-2">
                          <input 
                            type="number" placeholder="Değer %" className="w-full p-4 rounded-xl border border-slate-200 text-xs font-bold text-center outline-none"
                            value={optWeight} onChange={e => setOptWeight(parseInt(e.target.value))}
                          />
                       </div>
                       <div className="md:col-span-3">
                          <input 
                            placeholder="AI Etiketi (Ops)..." className="w-full p-4 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                            value={optAiTag} onChange={e => setOptAiTag(e.target.value)}
                          />
                       </div>
                       <div className="md:col-span-1">
                          <button onClick={handleAddOption} className="w-full h-full bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                       {(draftTarget === 'CANDIDATE' ? draftCandQ.weightedOptions : draftStaffQ.options)?.map((opt: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm group">
                             <span className="text-[10px] font-bold text-slate-600 truncate flex-1 pr-4">"{opt.label}"</span>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-900">%{draftTarget === 'CANDIDATE' ? (Object.values(opt.weights)[0] as number * 100) : opt.clinicalValue}</span>
                                <button 
                                  onClick={() => {
                                    if(draftTarget === 'CANDIDATE') setDraftCandQ({...draftCandQ, weightedOptions: draftCandQ.weightedOptions?.filter((_, i) => i !== idx)});
                                    else setDraftStaffQ({...draftStaffQ, options: draftStaffQ.options?.filter((_, i) => i !== idx)});
                                  }}
                                  className="p-1 hover:text-rose-500 transition-colors"
                                ><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-200 flex gap-4">
                 <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100">İptal</button>
                 <button onClick={handleSave} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all">SİSTEMİ GÜNCELLE VE MÜHÜRLE</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MethodologyInventoryView;
