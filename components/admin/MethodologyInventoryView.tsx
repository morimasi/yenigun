
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

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [draftTarget, setDraftTarget] = useState<InventoryTarget>('CANDIDATE');
  const [activeBatteryId, setActiveBatteryId] = useState<string | null>(null);
  
  const [draftCandQ, setDraftCandQ] = useState<Partial<Question>>({
    id: '', text: '', category: 'technicalExpertise', type: 'radio', weightedOptions: []
  });

  const [draftStaffQ, setDraftStaffQ] = useState<Partial<AssessmentQuestion>>({
    id: '', text: '', options: []
  });

  const [optLabel, setOptLabel] = useState('');
  const [optWeight, setOptWeight] = useState(0);
  const [optAiTag, setOptAiTag] = useState('');

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
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Akademik Envanter</h3>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dosya Bazlı Geliştirme Modu</p>
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
                     <button onClick={() => handleDelete(b.id, true)} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{b.questions.length} SORU MÜHÜRLÜ</p>
               </div>
             ))
           )}
        </div>
      </div>

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
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AKADEMİK MİMARİ v15.3</span>
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
                                <span key={k} className="text-[8px] font-black bg-white/10 text-slate-400 px-2 py-0.5 rounded border border-white/5 uppercase">{k.substring(0,3)}: {v as any}</span>
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
