
import React, { useState, useMemo, useEffect } from 'react';
import { BRANCH_QUESTIONS } from '../../constants';
import { MODULAR_BATTERIES } from '../../features/staff-mentor/assessmentData';
import { Question, AssessmentBattery, AssessmentQuestion } from '../../types';

type InventoryTarget = 'CANDIDATE' | 'STAFF';

// Aday Kategorileri için Dinamik Arayüz (Normalde sabit olan yapı artık dinamik)
interface CategoryMeta {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

// Başlangıç Aday Kategorileri (Varsayılan)
const INITIAL_CANDIDATE_CATS: CategoryMeta[] = [
  { id: 'technicalExpertise', label: 'Teknik Uzmanlık', description: 'Klinik bilgi ve uygulama derinliği.', icon: '🧠' },
  { id: 'workEthics', label: 'İş Etiği', description: 'Profesyonel sınırlar ve dürüstlük.', icon: '⚖️' },
  { id: 'pedagogicalAnalysis', label: 'Pedagojik Analiz', description: 'Öğretim stratejileri ve adaptasyon.', icon: '📚' },
  { id: 'sustainability', label: 'Sürdürülebilirlik', description: 'Psikolojik dayanıklılık ve stres yönetimi.', icon: '🔋' },
  { id: 'institutionalLoyalty', label: 'Kurumsal Aidiyet', description: 'Vizyon uyumu ve uzun vadeli hedefler.', icon: '🏛️' },
  { id: 'developmentOpenness', label: 'Gelişime Açıklık', description: 'Öğrenme çevikliği ve eleştiri toleransı.', icon: '🚀' }
];

const MethodologyInventoryView: React.FC = () => {
  // --- CORE DATA STATES ---
  const [targetType, setTargetType] = useState<InventoryTarget>('CANDIDATE');
  
  // ADAY VERİSİ (Kategoriler ve Sorular Ayrıştırıldı)
  const [candidateCats, setCandidateCats] = useState<CategoryMeta[]>(INITIAL_CANDIDATE_CATS);
  const [candidateQuestions, setCandidateQuestions] = useState<Question[]>(
    Object.values(BRANCH_QUESTIONS).flat().map(q => ({...q, uniqueKey: Math.random().toString(36)}))
  );
  
  // PERSONEL VERİSİ (Batarya yapısı hem kategori hem soru container'ıdır)
  const [staffBatteries, setStaffBatteries] = useState<AssessmentBattery[]>(MODULAR_BATTERIES);

  // --- UI STATES ---
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null); // Seçili Kategori ID
  const [search, setSearch] = useState('');
  
  // MODAL STATES
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [isCategoryEditorOpen, setIsCategoryEditorOpen] = useState(false);
  
  const [editingQuestion, setEditingQuestion] = useState<any>(null); 
  const [editingCategory, setEditingCategory] = useState<any>(null); // Kategori veya Batarya düzenleme

  // Seçili kategori değişince veya target değişince state sıfırla
  useEffect(() => {
    setActiveCategoryId(null);
  }, [targetType]);

  // --- FILTERING LOGIC ---
  const filteredQuestions = useMemo(() => {
    const term = search.toLowerCase();
    
    if (targetType === 'CANDIDATE') {
      let list = candidateQuestions;
      // Kategori Filtresi
      if (activeCategoryId) {
        list = list.filter(q => q.category === activeCategoryId);
      }
      // Arama Filtresi
      if (term) {
        list = list.filter(q => q.text.toLowerCase().includes(term));
      }
      return list;
    } else {
      // Staff tarafında sorular bataryaların içindedir.
      // Eğer bir batarya seçiliyse onun sorularını göster, yoksa boş veya tümü (Tümü karmaşık olur, boş bırakalım)
      if (activeCategoryId) {
        const battery = staffBatteries.find(b => b.id === activeCategoryId);
        if (!battery) return [];
        let list = battery.questions;
        if (term) list = list.filter(q => q.text.toLowerCase().includes(term));
        return list;
      }
      return [];
    }
  }, [targetType, candidateQuestions, staffBatteries, activeCategoryId, search]);

  // --- ACTIONS: EXPORT ---
  const handleExportJSON = () => {
    const data = {
      type: targetType,
      structure: targetType === 'CANDIDATE' ? candidateCats : 'Embedded in Batteries',
      content: targetType === 'CANDIDATE' ? candidateQuestions : staffBatteries,
      exportedAt: new Date().toISOString()
    };
    const fileName = `YG_Inventory_${targetType}_FullData.json`;
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

  // --- ACTIONS: CATEGORY MANAGEMENT ---
  const handleEditCategory = (cat: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory({ ...cat }); // Deep copy safety
    setIsCategoryEditorOpen(true);
  };

  const handleCreateCategory = () => {
    const newId = `cat_${Date.now()}`;
    const emptyCat = targetType === 'CANDIDATE' 
      ? { id: newId, label: '', description: '', icon: '📂' }
      : { id: newId, title: '', description: '', icon: '🔋', category: 'general', questions: [] }; // Staff Battery
    
    setEditingCategory(emptyCat);
    setIsCategoryEditorOpen(true);
  };

  const handleDeleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu kategoriyi ve içindeki TÜM yapılandırmayı silmek istediğinize emin misiniz?")) return;

    if (targetType === 'CANDIDATE') {
      // Önce bu kategoriye ait soruları temizle veya 'uncategorized' yap
      // Şimdilik siliyoruz
      setCandidateQuestions(prev => prev.filter(q => q.category !== id));
      setCandidateCats(prev => prev.filter(c => c.id !== id));
    } else {
      setStaffBatteries(prev => prev.filter(b => b.id !== id));
    }
    if (activeCategoryId === id) setActiveCategoryId(null);
  };

  const handleSaveCategory = () => {
    if (targetType === 'CANDIDATE') {
      if (!editingCategory.label) return alert("Kategori adı zorunludur.");
      setCandidateCats(prev => {
        const exists = prev.find(c => c.id === editingCategory.id);
        if (exists) return prev.map(c => c.id === editingCategory.id ? editingCategory : c);
        return [...prev, editingCategory];
      });
    } else {
      // Staff Battery Update
      if (!editingCategory.title) return alert("Batarya başlığı zorunludur.");
      setStaffBatteries(prev => {
        const exists = prev.find(b => b.id === editingCategory.id);
        if (exists) return prev.map(b => b.id === editingCategory.id ? editingCategory : b);
        return [...prev, editingCategory];
      });
    }
    setIsCategoryEditorOpen(false);
  };

  // --- ACTIONS: QUESTION MANAGEMENT ---
  const handleCreateQuestion = () => {
    if (!activeCategoryId) return alert("Lütfen önce sol menüden bir kategori/batarya seçiniz.");
    
    const newId = `${targetType === 'CANDIDATE' ? 'q_cand' : 'q_staff'}_${Date.now()}`;
    const emptyQ = targetType === 'CANDIDATE' 
      ? { id: newId, text: '', category: activeCategoryId, type: 'radio', weightedOptions: [] }
      : { id: newId, text: '', options: [] };
    
    setEditingQuestion(emptyQ);
    setIsQuestionEditorOpen(true);
  };

  const handleEditQuestion = (q: any) => {
    setEditingQuestion(JSON.parse(JSON.stringify(q)));
    setIsQuestionEditorOpen(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!confirm("Soru silinsin mi?")) return;
    if (targetType === 'CANDIDATE') {
      setCandidateQuestions(prev => prev.filter(q => q.id !== id));
    } else {
      setStaffBatteries(prev => prev.map(b => {
        if (b.id !== activeCategoryId) return b;
        return { ...b, questions: b.questions.filter(q => q.id !== id) };
      }));
    }
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion.text) return alert("Soru metni boş olamaz.");

    if (targetType === 'CANDIDATE') {
      // Kategori değişmiş olabilir, onu güncelle
      setCandidateQuestions(prev => {
        const exists = prev.find(q => q.id === editingQuestion.id);
        if (exists) return prev.map(q => q.id === editingQuestion.id ? editingQuestion : q);
        return [editingQuestion, ...prev]; // Yeni soru başa
      });
    } else {
      // Staff: Batarya içine göm
      setStaffBatteries(prev => prev.map(b => {
        if (b.id !== activeCategoryId) return b; // Sadece aktif bataryayı güncelle
        const exists = b.questions.find(q => q.id === editingQuestion.id);
        const newQs = exists 
          ? b.questions.map(q => q.id === editingQuestion.id ? editingQuestion : q)
          : [editingQuestion, ...b.questions];
        return { ...b, questions: newQs };
      }));
    }
    setIsQuestionEditorOpen(false);
  };

  // --- SUB-COMPONENT: OPTION EDITOR (Reusable) ---
  const OptionEditor = () => {
    if (!editingQuestion) return null;

    const addOption = () => {
      if (targetType === 'CANDIDATE') {
        const newOpt = { label: 'Yeni Seçenek', weights: { clinical: 0.5 }, analysisInsight: '...' };
        setEditingQuestion({ ...editingQuestion, weightedOptions: [...(editingQuestion.weightedOptions || []), newOpt] });
      } else {
        const newOpt = { label: 'Yeni Seçenek', clinicalValue: 50, aiTag: 'neutral' };
        setEditingQuestion({ ...editingQuestion, options: [...(editingQuestion.options || []), newOpt] });
      }
    };

    const removeOption = (idx: number) => {
      const field = targetType === 'CANDIDATE' ? 'weightedOptions' : 'options';
      const next = [...editingQuestion[field]];
      next.splice(idx, 1);
      setEditingQuestion({ ...editingQuestion, [field]: next });
    };

    const updateOption = (idx: number, key: string, val: any) => {
      const field = targetType === 'CANDIDATE' ? 'weightedOptions' : 'options';
      const next = [...editingQuestion[field]];
      if (key.includes('weights.')) {
         const wKey = key.split('.')[1];
         next[idx].weights = { ...next[idx].weights, [wKey]: val };
      } else {
         next[idx] = { ...next[idx], [key]: val };
      }
      setEditingQuestion({ ...editingQuestion, [field]: next });
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CEVAP SEÇENEKLERİ</label>
           <button onClick={addOption} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold hover:bg-blue-100">+ EKLE</button>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {(targetType === 'CANDIDATE' ? editingQuestion.weightedOptions : editingQuestion.options)?.map((opt: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
               <button onClick={() => removeOption(idx)} className="absolute top-2 right-2 text-rose-400 hover:text-rose-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
               <input type="text" className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold mb-2" value={opt.label} onChange={e => updateOption(idx, 'label', e.target.value)} placeholder="Cevap..." />
               
               {targetType === 'CANDIDATE' ? (
                 <div className="flex gap-2 flex-wrap">
                    <input type="text" className="flex-1 bg-white border rounded p-1 text-[10px]" value={opt.analysisInsight} onChange={e => updateOption(idx, 'analysisInsight', e.target.value)} placeholder="Insight..." />
                    {['clinical', 'ethics', 'pedagogicalAnalysis'].map(k => (
                       <div key={k} className="flex items-center gap-1 bg-white px-2 rounded border">
                          <span className="text-[8px] uppercase font-bold text-slate-400">{k.substring(0,3)}</span>
                          <input type="number" step="0.1" className="w-8 text-[10px] font-bold outline-none" value={opt.weights?.[k] || 0} onChange={e => updateOption(idx, `weights.${k}`, parseFloat(e.target.value))} />
                       </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-white px-2 rounded border flex-1">
                       <span className="text-[8px] font-bold text-slate-400">PUAN</span>
                       <input type="number" className="w-full text-[10px] font-bold outline-none" value={opt.clinicalValue} onChange={e => updateOption(idx, 'clinicalValue', parseInt(e.target.value))} />
                    </div>
                    <div className="flex items-center gap-1 bg-white px-2 rounded border flex-[2]">
                       <span className="text-[8px] font-bold text-slate-400">TAG</span>
                       <input type="text" className="w-full text-[10px] font-bold outline-none uppercase" value={opt.aiTag} onChange={e => updateOption(idx, 'aiTag', e.target.value)} />
                    </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden relative">
      
      {/* -------------------- KATEGORİ EDİTÖRÜ MODALI -------------------- */}
      {isCategoryEditorOpen && editingCategory && (
        <div className="fixed inset-0 z-[2100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-scale-in">
              <h3 className="text-lg font-black text-slate-900 uppercase mb-6">
                 {targetType === 'CANDIDATE' ? 'Kategori Düzenle' : 'Batarya Düzenle'}
              </h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">BAŞLIK / ETİKET</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                      value={targetType === 'CANDIDATE' ? editingCategory.label : editingCategory.title}
                      onChange={e => setEditingCategory({ ...editingCategory, [targetType === 'CANDIDATE' ? 'label' : 'title']: e.target.value })}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">AÇIKLAMA</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                      value={editingCategory.description}
                      onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    />
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">İKON</label>
                       <input 
                         type="text" 
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-xl"
                         value={editingCategory.icon}
                         onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                       />
                    </div>
                    {targetType === 'STAFF' && (
                       <div className="flex-[2]">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">KOD (ID)</label>
                          <input 
                            type="text" 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                            value={editingCategory.category}
                            onChange={e => setEditingCategory({ ...editingCategory, category: e.target.value })}
                          />
                       </div>
                    )}
                 </div>
                 <div className="flex gap-2 pt-4">
                    <button onClick={() => setIsCategoryEditorOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase">İptal</button>
                    <button onClick={handleSaveCategory} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-600">Kaydet</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* -------------------- SORU EDİTÖRÜ MODALI -------------------- */}
      {isQuestionEditorOpen && editingQuestion && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Soru Konfigürasyonu</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {editingQuestion.id}</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setIsQuestionEditorOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase">Vazgeç</button>
                    <button onClick={handleSaveQuestion} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-600">Değişiklikleri İşle</button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SORU METNİ</label>
                    <textarea 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-orange-500 transition-all min-h-[100px]"
                      value={editingQuestion.text}
                      onChange={e => setEditingQuestion({...editingQuestion, text: e.target.value})}
                    />
                 </div>

                 {targetType === 'CANDIDATE' && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">KATEGORİ (TAŞIMA)</label>
                       <select 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                         value={editingQuestion.category}
                         onChange={e => setEditingQuestion({...editingQuestion, category: e.target.value})}
                       >
                          {candidateCats.map(c => (
                             <option key={c.id} value={c.id}>{c.label}</option>
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

      {/* -------------------- SOL SIDEBAR: YAPISAL EDİTÖR -------------------- */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 no-print">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <div className="flex items-center gap-2 mb-6 opacity-50">
              <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AKADEMİK ENVANTER DOSYA BAZLI GELİŞTİRME MODU</span>
           </div>
           
           <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-6">
              <button 
                onClick={() => setTargetType('CANDIDATE')}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'CANDIDATE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >ADAYLAR</button>
              <button 
                onClick={() => setTargetType('STAFF')}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'STAFF' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >PERSONEL</button>
           </div>

           <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                 {targetType === 'CANDIDATE' ? 'Kategoriler' : 'Bataryalar'}
              </h3>
              <button onClick={handleCreateCategory} className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all font-bold text-lg">+</button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
           {(targetType === 'CANDIDATE' ? candidateCats : staffBatteries).map((cat: any) => {
              const isActive = activeCategoryId === cat.id;
              const count = targetType === 'CANDIDATE' 
                 ? candidateQuestions.filter(q => q.category === cat.id).length
                 : cat.questions.length;

              return (
                 <div 
                   key={cat.id} 
                   onClick={() => setActiveCategoryId(cat.id)}
                   className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                     isActive 
                     ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                     : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200'
                   }`}
                 >
                    <div className="flex items-start gap-3 relative z-10">
                       <span className="text-2xl">{cat.icon}</span>
                       <div className="flex-1 min-w-0">
                          <h5 className={`text-[11px] font-black uppercase truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{cat.label || cat.title}</h5>
                          <p className={`text-[9px] truncate ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>{cat.description}</p>
                       </div>
                       <span className={`text-[9px] font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className={`absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 ${isActive ? '' : 'bg-white/80 backdrop-blur-sm rounded-lg p-1'}`}>
                       <button onClick={(e) => handleEditCategory(cat, e)} className="p-1.5 hover:bg-blue-500 hover:text-white rounded-md text-blue-500"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                       <button onClick={(e) => handleDeleteCategory(cat.id, e)} className="p-1.5 hover:bg-rose-500 hover:text-white rounded-md text-rose-500"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                 </div>
              );
           })}
        </div>
      </div>

      {/* -------------------- MAIN CONTENT: SORU LİSTESİ -------------------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-4">
              <div className="relative w-80">
                 <input 
                   type="text" placeholder="Aktif kategoride soru ara..." 
                   className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                   value={search} onChange={e => setSearch(e.target.value)}
                 />
                 <svg className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              {!activeCategoryId && <span className="text-[10px] font-bold text-orange-500 animate-pulse">← Soldan Kategori Seçiniz</span>}
           </div>
           
           <div className="flex items-center gap-3">
              <button onClick={handleExportJSON} className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                 JSON PAKETİ İNDİR
              </button>
              <button 
                onClick={handleCreateQuestion} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${activeCategoryId ? 'bg-slate-900 text-white hover:bg-orange-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                disabled={!activeCategoryId}
              >
                 <span>+ YENİ SORU</span>
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-50">
           {activeCategoryId && filteredQuestions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                 <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bu kategoride henüz soru yok.</p>
              </div>
           ) : !activeCategoryId ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                 <svg className="w-32 h-32 text-slate-900 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                 <p className="text-xl font-black text-slate-900 uppercase tracking-[0.5em]">YAPILANDIRMA MODU</p>
              </div>
           ) : (
             filteredQuestions.map((q: any, idx: number) => (
               <div key={q.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all relative">
                  <div className="flex gap-4">
                     <span className="text-2xl font-black text-slate-200">{idx + 1}</span>
                     <div className="flex-1">
                        <h5 className="text-sm font-black text-slate-800 mb-4 uppercase leading-snug">"{q.text}"</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                           {(q.weightedOptions || q.options)?.map((o: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-600 font-bold">
                                 <span className="truncate pr-2">{o.label}</span>
                                 {o.clinicalValue && <span className="bg-white px-2 rounded text-[9px] border text-slate-400">{o.clinicalValue}P</span>}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  
                  {/* Question Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleEditQuestion(q)} className="p-2 bg-slate-50 text-blue-600 rounded-xl hover:bg-blue-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                     <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 bg-slate-50 text-rose-600 rounded-xl hover:bg-rose-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
