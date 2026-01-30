
import React, { useState, useMemo } from 'react';
import { BRANCH_QUESTIONS, CERTIFICATIONS } from '../../constants';
import { Question } from '../../types';

// Envanter Kategorileri ve Renk Kodları
const CATEGORIES = [
  { id: 'all', label: 'TÜM ENVANTER', color: 'bg-slate-800' },
  { id: 'technicalExpertise', label: 'KLİNİK YETERLİLİK', color: 'bg-orange-600' },
  { id: 'workEthics', label: 'İŞ ETİĞİ & SINIR', color: 'bg-emerald-600' },
  { id: 'pedagogicalAnalysis', label: 'PEDAGOJİK ALTYAPI', color: 'bg-blue-600' },
  { id: 'sustainability', label: 'RESİLİANS (DİRENÇ)', color: 'bg-rose-600' },
  { id: 'institutionalLoyalty', label: 'KURUMSAL SADAKAT', color: 'bg-indigo-600' },
  { id: 'developmentOpenness', label: 'GELİŞİME AÇIKLIK', color: 'bg-purple-600' }
];

const MethodologyInventoryView: React.FC = () => {
  // Başlangıç verisini constants'dan alıp state'e yüklüyoruz (Mutable olması için)
  const [questions, setQuestions] = useState<Question[]>([
    ...Object.values(BRANCH_QUESTIONS).flat(),
    ...CERTIFICATIONS.flatMap(c => c.verificationQuestions)
  ]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  
  // --- EDITOR STATES ---
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // True: Düzenleme, False: Yeni Ekleme

  const [draftQuestion, setDraftQuestion] = useState<Partial<Question>>({
    id: '',
    text: '',
    category: 'technicalExpertise',
    type: 'radio',
    options: [],
    weightedOptions: []
  });

  // --- OPTION BUILDER STATE ---
  const [draftOption, setDraftOption] = useState({
    label: '',
    weights: { clinical: 0, ethics: 0, resilience: 0, fit: 0 }
  });

  // Filtreleme Mantığı
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesCat = activeCategory === 'all' || q.category === activeCategory;
      const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [questions, activeCategory, search]);

  // --- ACTIONS ---

  const openNewQuestionEditor = () => {
    setDraftQuestion({
      id: '',
      text: '',
      category: 'technicalExpertise',
      type: 'radio',
      options: [],
      weightedOptions: []
    });
    setEditMode(false);
    setIsEditorOpen(true);
  };

  const handleEditQuestion = (q: Question) => {
    // Deep copy to avoid mutating state directly during edit
    setDraftQuestion(JSON.parse(JSON.stringify(q)));
    setEditMode(true);
    setIsEditorOpen(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm("KRİTİK UYARI: Bu soru envanterden kalıcı olarak silinecek. Analiz raporlarında bu soru artık görünmeyecek. Devam edilsin mi?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      setIsEditorOpen(false);
    }
  };

  const handleAddOptionToDraft = () => {
    if (!draftOption.label) return;
    
    const cleanWeights: Record<string, number> = {};
    Object.entries(draftOption.weights).forEach(([k, value]) => {
        const v = value as number;
        if (v !== 0) cleanWeights[k === 'clinical' ? 'technicalExpertise' : k === 'fit' ? 'institutionalLoyalty' : k] = v;
    });

    const newOption = {
      label: draftOption.label,
      weights: cleanWeights,
      analysisInsight: 'Kullanıcı tanımlı parametre.'
    };

    setDraftQuestion(prev => ({
      ...prev,
      weightedOptions: [...(prev.weightedOptions || []), newOption]
    }));

    setDraftOption({ label: '', weights: { clinical: 0, ethics: 0, resilience: 0, fit: 0 } });
  };

  const handleRemoveOptionFromDraft = (idx: number) => {
    setDraftQuestion(prev => ({
      ...prev,
      weightedOptions: prev.weightedOptions?.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveQuestion = () => {
    if (!draftQuestion.text || !draftQuestion.category) {
      alert("Soru metni ve kategori zorunludur.");
      return;
    }
    if ((draftQuestion.weightedOptions?.length || 0) < 2) {
      alert("En az 2 seçenek eklemelisiniz.");
      return;
    }

    if (editMode && draftQuestion.id) {
      // UPDATE EXISTING
      setQuestions(prev => prev.map(q => q.id === draftQuestion.id ? (draftQuestion as Question) : q));
      alert("Soru başarıyla güncellendi.");
    } else {
      // CREATE NEW
      const newQ: Question = {
        ...(draftQuestion as Question),
        id: `custom_${Date.now()}`,
        type: 'radio',
        requiredBranch: []
      };
      setQuestions(prev => [newQ, ...prev]);
      alert("Soru envantere eklendi.");
    }

    setIsEditorOpen(false);
  };

  return (
    <div className="flex h-full bg-[#F1F5F9] relative overflow-hidden">
      
      {/* SOL: NAVİGASYON & FİLTRE */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Envanter Mimarı</h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Soru Bankası & Ağırlık Yönetimi</p>
        </div>
        
        <div className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
           {CATEGORIES.map(cat => {
             const count = cat.id === 'all' ? questions.length : questions.filter(q => q.category === cat.id).length;
             return (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id)}
                 className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                   activeCategory === cat.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                 }`}
               >
                  <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${cat.color} ${activeCategory === cat.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${activeCategory === cat.id ? 'text-white' : 'text-slate-400'}`}>{count}</span>
               </button>
             );
           })}
        </div>

        <div className="p-6 border-t border-slate-100">
           <button 
             onClick={openNewQuestionEditor}
             className="w-full py-4 bg-orange-600 hover:bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
           >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              YENİ SORU EKLE
           </button>
        </div>
      </div>

      {/* ORTA: SORU LİSTESİ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         {/* Search Bar */}
         <div className="bg-white/80 backdrop-blur-md p-6 border-b border-slate-200 sticky top-0 z-20 flex justify-between items-center">
            <div className="relative w-full max-w-xl">
               <input 
                 type="text" 
                 placeholder="Soru metni veya etiket ara..." 
                 className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
               <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredQuestions.length} KAYIT LİSTELENDİ</span>
         </div>

         {/* Content Grid */}
         <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 pb-32">
            {filteredQuestions.map((q, i) => (
               <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black text-white uppercase tracking-widest ${CATEGORIES.find(c => c.id === q.category)?.color || 'bg-slate-400'}`}>
                           {CATEGORIES.find(c => c.id === q.category)?.label || q.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">ID: {q.id.substring(0, 12)}...</span>
                     </div>
                     <button 
                        onClick={() => handleEditQuestion(q)}
                        className="p-2 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-400 transition-all shadow-sm"
                        title="Düzenle"
                     >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                     </button>
                  </div>
                  
                  <p className="text-lg font-black text-slate-800 leading-tight mb-8">"{q.text}"</p>

                  {q.weightedOptions && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {q.weightedOptions.map((opt, idx) => (
                           <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between group/opt hover:bg-slate-900 hover:text-white transition-all">
                              <p className="text-[11px] font-bold text-slate-600 mb-2 group-hover/opt:text-white transition-colors leading-tight">"{opt.label}"</p>
                              <div className="flex gap-2 flex-wrap">
                                 {Object.entries(opt.weights).map(([k, v]) => (
                                    <span key={k} className="text-[9px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 group-hover/opt:bg-slate-800 group-hover/opt:border-slate-700 group-hover/opt:text-slate-300">
                                       {k.substring(0,4).toUpperCase()}: {v}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>

      {/* SAĞ: SLIDE-OVER EDİTÖR (YENİ / DÜZENLE) */}
      {isEditorOpen && (
         <div className="absolute inset-y-0 right-0 w-[600px] bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-slide-left">
            <div className={`p-8 border-b border-slate-100 flex justify-between items-center ${editMode ? 'bg-indigo-50' : 'bg-orange-50'}`}>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className={`w-2 h-2 rounded-full ${editMode ? 'bg-indigo-600 animate-pulse' : 'bg-orange-600'}`}></span>
                     <p className={`text-[10px] font-bold uppercase tracking-widest ${editMode ? 'text-indigo-600' : 'text-orange-600'}`}>{editMode ? 'UPDATE MODE' : 'CREATE MODE'}</p>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{editMode ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}</h3>
               </div>
               <button onClick={() => setIsEditorOpen(false)} className="p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all border border-slate-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
               {/* 1. KATEGORİ SEÇİMİ */}
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Analiz Kategorisi</label>
                  <div className="grid grid-cols-2 gap-2">
                     {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <button 
                           key={cat.id}
                           onClick={() => setDraftQuestion({...draftQuestion, category: cat.id})}
                           className={`p-3 rounded-xl border text-left text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
                              draftQuestion.category === cat.id 
                              ? `bg-slate-900 text-white border-slate-900` 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                           }`}
                        >
                           <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                           {cat.label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* 2. SORU METNİ */}
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Soru Metni</label>
                  <textarea 
                     className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-sm text-slate-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all h-32 resize-none shadow-inner"
                     placeholder="Klinik veya etik bir senaryo yazınız..."
                     value={draftQuestion.text}
                     onChange={e => setDraftQuestion({...draftQuestion, text: e.target.value})}
                  />
               </div>

               {/* 3. SEÇENEK OLUŞTURUCU */}
               <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cevap Seçenekleri</label>
                     <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">{draftQuestion.weightedOptions?.length || 0} SEÇENEK</span>
                  </div>

                  <div className="space-y-3">
                     <input 
                        type="text" 
                        placeholder="Seçenek metni (Örn: Kabul ederim çünkü...)" 
                        className="w-full p-4 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 outline-none transition-all"
                        value={draftOption.label}
                        onChange={e => setDraftOption({...draftOption, label: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddOptionToDraft()}
                     />
                     
                     <div className="grid grid-cols-4 gap-2">
                        {[
                           { k: 'clinical', l: 'KLİNİK', bg: 'bg-orange-100 text-orange-700' },
                           { k: 'ethics', l: 'ETİK', bg: 'bg-emerald-100 text-emerald-700' },
                           { k: 'resilience', l: 'DİRENÇ', bg: 'bg-rose-100 text-rose-700' },
                           { k: 'fit', l: 'UYUM', bg: 'bg-blue-100 text-blue-700' }
                        ].map(w => (
                           <div key={w.k} className="space-y-1">
                              <label className="text-[8px] font-black text-slate-400 uppercase block text-center">{w.l}</label>
                              <input 
                                 type="number" step="0.1" min="-1" max="1"
                                 className={`w-full p-2 text-center rounded-lg text-xs font-black outline-none border border-slate-200 focus:border-slate-400 ${w.bg}`}
                                 placeholder="0.0"
                                 value={(draftOption.weights as any)[w.k] || ''}
                                 onChange={e => setDraftOption(prev => ({ ...prev, weights: { ...prev.weights, [w.k]: parseFloat(e.target.value) } }))}
                              />
                           </div>
                        ))}
                     </div>

                     <button 
                        onClick={handleAddOptionToDraft}
                        disabled={!draftOption.label}
                        className="w-full py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
                     >
                        + Listeye Ekle
                     </button>
                  </div>

                  {/* EKLENEN SEÇENEKLER ÖNİZLEME */}
                  <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {draftQuestion.weightedOptions?.map((opt, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm group">
                           <div className="flex-1 min-w-0 pr-3">
                              <p className="text-[10px] font-bold text-slate-600 truncate">{opt.label}</p>
                              <div className="flex gap-1 mt-1 flex-wrap">
                                 {Object.entries(opt.weights).map(([k, v]) => (
                                    <span key={k} className="text-[8px] px-1 bg-slate-100 rounded text-slate-500 font-mono">
                                       {k.substring(0,3).toUpperCase()}: {v}
                                    </span>
                                 ))}
                              </div>
                           </div>
                           <button onClick={() => handleRemoveOptionFromDraft(idx)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-all">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-200 bg-slate-50 flex gap-4">
               {editMode && draftQuestion.id && (
                 <button 
                    onClick={() => handleDeleteQuestion(draftQuestion.id!)}
                    className="px-6 py-5 bg-white border-2 border-rose-100 text-rose-500 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                 >
                    SİL
                 </button>
               )}
               <button 
                  onClick={handleSaveQuestion}
                  className={`flex-1 py-5 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${editMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-orange-600'}`}
               >
                  {editMode ? 'GÜNCELLEMEYİ KAYDET' : 'SORUYU YAYINLA'}
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default MethodologyInventoryView;
