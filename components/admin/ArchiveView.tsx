
import React, { useState, useMemo } from 'react';
import { Candidate, ArchiveCategory } from '../../types';

interface ArchiveViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

const VAULT_CATEGORIES: Record<ArchiveCategory, { label: string, color: string, icon: string }> = {
  CANDIDATE_POOL: { label: 'Yetenek Havuzu', color: 'emerald', icon: '💎' },
  HIRED_CONTRACTED: { label: 'Kadroya Alınanlar', color: 'blue', icon: '✅' },
  DISQUALIFIED: { label: 'Disfalifiye', color: 'slate', icon: '📁' },
  BLACK_LIST: { label: 'Yasaklılar', color: 'rose', icon: '🚫' },
  STAFF_HISTORY: { label: 'Eski Kadro', color: 'indigo', icon: '🏛️' },
  TALENT_POOL_ANALYTICS: { label: 'Karar Analitiği', color: 'orange', icon: '⚖️' },
  TRAINING_LIBRARY: { label: 'Eğitim Deposu', color: 'purple', icon: '📚' },
  PERFORMANCE_SNAPSHOT: { label: 'Performans İzi', color: 'pink', icon: '📊' },
  STRATEGIC_PLAN: { label: 'Strateji Odası', color: 'cyan', icon: '🛰️' },
  CLINICAL_CASE_STUDY: { label: 'Vaka Analizi', color: 'amber', icon: '🔬' }
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [activeTab, setActiveTab] = useState<ArchiveCategory>('CANDIDATE_POOL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const archivedItems = useMemo(() => {
    return candidates.filter(c => c.status === 'archived');
  }, [candidates]);

  const filteredItems = useMemo(() => {
    return archivedItems.filter(item => {
      const matchesCat = item.archiveCategory === activeTab;
      const matchesSearch = item.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'));
      return matchesCat && matchesSearch;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [archivedItems, activeTab, searchTerm]);

  const selectedItem = archivedItems.find(i => i.id === selectedId);

  const handleRestore = async (item: Candidate) => {
    if (!confirm("Bu dosya aktif sisteme geri taşınacak. Onaylıyor musunuz?")) return;
    setIsProcessing(true);
    try {
      await onUpdateCandidate({ ...item, status: 'pending', timestamp: Date.now() });
      setSelectedId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentDelete = (id: string) => {
    if (!confirm("DİKKAT: Bu kayıt veritabanından kalıcı olarak İMHA EDİLECEK. Geri alınamaz. Onaylıyor musunuz?")) return;
    onDeleteCandidate(id);
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-50 animate-fade-in overflow-hidden">
      
      {/* 1. COMPACT VAULT HEADER */}
      <div className="bg-slate-900 p-6 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <div>
               <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Kurumsal Arşiv Kasası</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sertifikalı Veri ve Akademik Hafıza</p>
            </div>
         </div>
         <div className="relative">
            <input 
               type="text" placeholder="Kayıt Ara..." 
               className="bg-white/10 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-white outline-none focus:bg-white/20 focus:border-orange-500 transition-all w-64"
               value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 text-white/30 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* 2. COMPACT SIDEBAR SELECTOR */}
         <div className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto no-scrollbar py-4 px-2 md:px-4 gap-1.5">
            {(Object.entries(VAULT_CATEGORIES) as [ArchiveCategory, any][]).map(([key, cfg]) => {
               const count = archivedItems.filter(i => i.archiveCategory === key).length;
               const isActive = activeTab === key;
               return (
                  <button 
                     key={key} 
                     onClick={() => { setActiveTab(key); setSelectedId(null); }}
                     className={`flex items-center gap-3 p-3 rounded-xl transition-all group relative ${isActive ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-500'}`}
                  >
                     <span className="text-xl shrink-0">{cfg.icon}</span>
                     <div className="hidden md:block text-left min-w-0 flex-1">
                        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-700'}`}>{cfg.label}</p>
                        <p className="text-[8px] font-bold opacity-50 uppercase">{count} Kayıt</p>
                     </div>
                     {isActive && <div className="absolute right-2 hidden md:block w-1 h-4 bg-orange-600 rounded-full"></div>}
                  </button>
               );
            })}
         </div>

         {/* 3. MAIN LIST & DETAIL GRID */}
         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* List Panel */}
            <div className={`lg:col-span-4 border-r border-slate-100 bg-white flex flex-col overflow-hidden ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {filteredItems.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale p-10 text-center">
                        <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4" /></svg>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Seçili kategoride mühürlü dosya bulunmuyor.</p>
                     </div>
                  ) : (
                     filteredItems.map(item => (
                        <div 
                           key={item.id} 
                           onClick={() => setSelectedId(item.id)}
                           className={`p-5 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 relative ${selectedId === item.id ? 'bg-orange-50/50 border-l-4 border-l-orange-600 shadow-sm' : 'border-l-4 border-l-transparent'}`}
                        >
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="text-[12px] font-black text-slate-900 uppercase truncate pr-4">{item.name}</h4>
                              <span className="text-[8px] font-mono font-bold text-slate-400 shrink-0">{new Date(item.timestamp).toLocaleDateString('tr-TR')}</span>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{item.branch}</p>
                           {item.report && <div className="mt-3 flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div><span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">ANALİZ MÜHÜRLÜ</span></div>}
                        </div>
                     ))
                  )}
               </div>
            </div>

            {/* Detail Panel */}
            <div className={`lg:col-span-8 bg-[#FDFDFD] flex flex-col overflow-hidden relative ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
               {selectedItem ? (
                  <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
                     <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                        <div className="flex items-center gap-5">
                           <button onClick={() => setSelectedId(null)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                           </button>
                           <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">{selectedItem.name.charAt(0)}</div>
                           <div>
                              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedItem.name}</h3>
                              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{selectedItem.branch} • REF: {selectedItem.id.substring(0,8)}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleRestore(selectedItem)} disabled={isProcessing} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md">RESTORASYON</button>
                           <button onClick={() => handlePermanentDelete(selectedItem.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">ARŞİV GEREKÇESİ</span>
                              <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{selectedItem.archiveNote || 'Kurumsal standartlar gereği mühürlendi.'}"</p>
                           </div>
                           <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center text-center relative overflow-hidden">
                              <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-2 z-10">MÜHÜRLÜ LİYAKAT SKORU</span>
                              <p className="text-5xl font-black text-white z-10">%{selectedItem.report?.score || '-'}</p>
                              <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                           </div>
                        </div>

                        {selectedItem.report && (
                           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                              <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 border-l-4 border-orange-600 pl-4">DERİN ANALİZ ÖZETİ</h5>
                              <p className="text-sm font-medium text-slate-600 leading-relaxed text-justify indent-8">
                                 {selectedItem.report.detailedAnalysisNarrative || selectedItem.report.summary}
                              </p>
                           </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {[
                              { l: 'E-Posta', v: selectedItem.email, i: '✉️' },
                              { l: 'Deneyim', v: `${selectedItem.experienceYears} Yıl`, i: '⏳' },
                              { l: 'Üniversite', v: selectedItem.university, i: '🎓' },
                              { l: 'Kategori', v: VAULT_CATEGORIES[activeTab].label, i: '🏷️' }
                           ].map((stat, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                 <span className="text-xl mb-1 block">{stat.i}</span>
                                 <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">{stat.l}</span>
                                 <span className="text-[10px] font-bold text-slate-800 uppercase truncate block">{stat.v}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale text-center p-20 select-none">
                     <div className="w-32 h-32 bg-slate-900 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl">
                        <svg className="w-16 h-16 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                     </div>
                     <h3 className="text-4xl font-black text-slate-900 uppercase tracking-[0.5em] mb-4">MÜHÜRLÜ</h3>
                     <p className="text-[12px] font-bold uppercase tracking-widest max-w-sm">İncelemek istediğiniz dosyayı sol listeden seçerek nöral mührü doğrulayın.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </div>
  );
};

export default ArchiveView;
