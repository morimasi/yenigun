
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, ArchiveCategory, StaffMember, CustomTrainingPlan } from '../../types';

interface ArchiveViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

// @fix: Added 'HIRED_CONTRACTED' to CATEGORY_CONFIG to maintain exhaustiveness after expanding the ArchiveCategory type.
const CATEGORY_CONFIG: Record<ArchiveCategory, { label: string, color: string, icon: string, desc: string }> = {
  CANDIDATE_POOL: { label: 'Yetenek Havuzu', color: 'emerald', icon: '💎', desc: 'Liyakati onaylanmış potansiyel uzmanlar.' },
  DISQUALIFIED: { label: 'Disfalifiye', color: 'slate', icon: '📁', desc: 'Mevcut kriterlere uyum sağlamayanlar.' },
  BLACK_LIST: { label: 'Bloklanmış', color: 'rose', icon: '🚫', desc: 'Etik ihlal veya kurumsal risk taşıyanlar.' },
  STAFF_HISTORY: { label: 'Eski Kadro', color: 'blue', icon: '🏛️', desc: 'Kurumdan ayrılmış uzmanların geçmişi.' },
  TRAINING_LIBRARY: { label: 'Eğitim Deposu', color: 'orange', icon: '📚', desc: 'Arşivlenmiş hizmet içi eğitim planları.' },
  PERFORMANCE_SNAPSHOT: { label: 'Performans İzi', color: 'purple', icon: '📊', desc: 'Geçmişe dönük başarı raporları.' },
  STRATEGIC_PLAN: { label: 'Strateji Odası', color: 'indigo', icon: '🛰️', desc: 'Kurumsal gelişim ve vizyon planları.' },
  CLINICAL_CASE_STUDY: { label: 'Vaka Analizi', color: 'amber', icon: '🔬', desc: 'Eğitim amaçlı dökümante edilmiş vakalar.' },
  HIRED_CONTRACTED: { label: 'Kadroya Alınanlar', color: 'emerald', icon: '✅', desc: 'Mülakatı başarıyla geçip kadroya dahil edilen uzmanlar.' }
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ArchiveCategory>('CANDIDATE_POOL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSealing, setIsSealing] = useState(false);

  // Arşivlenen verileri kategorize et (Sadece adaylar değil, tüm sistem öğeleri burada birleşecek)
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

  const selectedItem = useMemo(() => 
    archivedItems.find(i => i.id === selectedId), 
    [archivedItems, selectedId]
  );

  const handleRestore = async (item: Candidate) => {
    if (confirm("GÜVENLİK PROTOKOLÜ: Bu dosya üzerindeki 'Arşiv Mührü' kaldırılacak ve aktif operasyona taşınacaktır. Onaylıyor musunuz?")) {
      setIsSealing(true);
      await onUpdateCandidate({ ...item, status: 'pending', timestamp: Date.now() });
      setSelectedId(null);
      setIsSealing(false);
    }
  };

  const handlePermanentDelete = (id: string) => {
    if (confirm("KRİTİK İŞLEM: Bu kayıt veritabanından kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam edilsin mi?")) {
      onDeleteCandidate(id);
      setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-[#F8FAFC] animate-fade-in relative overflow-hidden">
      
      {/* 1. VAULT HEADER */}
      <div className="bg-slate-950 p-10 rounded-b-[4rem] text-white shadow-3xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shrink-0">
         <div className="relative z-10 flex items-center gap-8">
            <div className="w-20 h-20 bg-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-xl rotate-3">
               <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <div>
               <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Kurumsal Bellek Kasası</h2>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">Tescilli Arşiv ve Akademik Miras Yönetimi</p>
            </div>
         </div>
         <div className="relative z-10 flex items-center gap-6">
            <div className="text-right">
               <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">TOPLAM ARŞİV</p>
               <p className="text-4xl font-black">{archivedItems.length}</p>
            </div>
            <div className="h-12 w-px bg-white/10"></div>
            <div className="relative">
               <input 
                  type="text" placeholder="Arşivde Ara..." 
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-orange-500 transition-all w-64"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
               />
               <svg className="w-5 h-5 text-white/30 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
         </div>
         <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 2. CATEGORY SELECTOR */}
      <div className="flex gap-3 p-6 overflow-x-auto no-scrollbar shrink-0 px-8">
        {(Object.entries(CATEGORY_CONFIG) as [ArchiveCategory, any][]).map(([key, cfg]) => {
           const count = archivedItems.filter(i => i.archiveCategory === key).length;
           const isActive = activeTab === key;
           return (
             <button 
               key={key}
               onClick={() => { setActiveTab(key); setSelectedId(null); }}
               className={`flex items-center gap-4 px-8 py-5 rounded-[2.5rem] border-2 transition-all whitespace-nowrap group ${
                 isActive 
                 ? `bg-white border-${cfg.color}-500 shadow-xl scale-105` 
                 : 'bg-white border-transparent text-slate-400 hover:border-slate-200'
               }`}
             >
                <span className="text-2xl group-hover:scale-125 transition-transform">{cfg.icon}</span>
                <div className="text-left">
                   <p className={`text-[11px] font-black uppercase tracking-widest ${isActive ? `text-${cfg.color}-600` : 'text-slate-500'}`}>{cfg.label}</p>
                   <p className="text-[9px] font-bold text-slate-300 uppercase">{count} KAYIT</p>
                </div>
             </button>
           );
        })}
      </div>

      {/* 3. VAULT GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 pt-0 min-h-0">
         
         {/* LEFT: ITEM LIST */}
         <div className="lg:col-span-4 flex flex-col bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{CATEGORY_CONFIG[activeTab].label} Dökümü</h4>
               <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{CATEGORY_CONFIG[activeTab].desc}</p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
               {filteredItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale text-center p-10">
                     <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                     <p className="text-[10px] font-black uppercase tracking-widest">Seçili kategoride arşiv kaydı bulunmuyor.</p>
                  </div>
               ) : (
                  filteredItems.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedId(item.id)}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                        selectedId === item.id 
                        ? `bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]` 
                        : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/50'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-2 relative z-10">
                          <h5 className="text-[13px] font-black uppercase truncate pr-4">{item.name}</h5>
                          <span className="text-[9px] font-mono opacity-40">{new Date(item.timestamp).toLocaleDateString('tr-TR')}</span>
                       </div>
                       <p className={`text-[10px] font-bold uppercase tracking-tight relative z-10 ${selectedId === item.id ? 'text-orange-400' : 'text-slate-400'}`}>{item.branch}</p>
                       <div className="mt-4 flex gap-2 relative z-10">
                          {item.report && <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black ${selectedId === item.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>ANALİZ MÜHÜRLÜ</span>}
                          {item.cvData && <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black ${selectedId === item.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>DOSYA EKLİ</span>}
                       </div>
                    </div>
                  ))
               )}
            </div>
         </div>

         {/* RIGHT: DETAIL VAULT */}
         <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col relative group">
            {selectedItem ? (
               <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
                  {/* DETAIL HEADER */}
                  <div className="p-12 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center shrink-0">
                     <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-3xl font-black shadow-2xl">
                           {selectedItem.name.charAt(0)}
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{selectedItem.name}</h3>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                           </div>
                           <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.4em] mt-3">SİSTEM REFERANS: {selectedItem.id}</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button 
                           onClick={() => handleRestore(selectedItem)}
                           disabled={isSealing}
                           className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50"
                        >
                           {isSealing ? 'İŞLENİYOR...' : 'KASADAN ÇIKAR'}
                        </button>
                        <button 
                           onClick={() => handlePermanentDelete(selectedItem.id)}
                           className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                     </div>
                  </div>

                  {/* DETAIL CONTENT */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden group/card">
                           <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">ARŞİV GEREKÇESİ</h5>
                           <p className="text-base font-bold text-slate-700 leading-relaxed italic relative z-10">"{selectedItem.archiveNote || 'Bu kayıt kurumsal standartlar gereği arşiv mührü altına alınmıştır.'}"</p>
                           <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-slate-200/30 rounded-full group-hover/card:scale-150 transition-transform duration-700"></div>
                        </div>
                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                           <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6">SON LİYAKAT SKORU</h5>
                           <div className="flex items-end gap-5 mb-6">
                              <span className="text-7xl font-black leading-none">%{selectedItem.report?.score || '0'}</span>
                              <div className="h-12 w-1 bg-orange-600 rounded-full"></div>
                           </div>
                           <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                              Vakanın arşivlendiği andaki bilişsel ve klinik yetkinlik endeksi.
                           </p>
                           <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl"></div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-8 border-orange-600 pl-8">MÜHÜRLÜ ANALİZ RAPORU</h4>
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-inner relative overflow-hidden">
                           <div className="absolute inset-0 opacity-[0.03] pointer-events-none rotate-12">
                              <p className="text-9xl font-black text-slate-900 whitespace-nowrap">YENİ GÜN ARŞİV</p>
                           </div>
                           <p className="text-lg font-medium text-slate-600 leading-relaxed text-justify indent-12 relative z-10">
                              {selectedItem.report?.detailedAnalysisNarrative || 'Detaylı analiz verisi arşivlenirken şifrelenmiştir.'}
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { l: 'İşe Alım Statüsü', v: selectedItem.archiveCategory === 'CANDIDATE_POOL' ? 'UYGUN' : 'ELENDİ', i: '💼' },
                          { l: 'Sertifikasyon', v: `${selectedItem.allTrainings?.length || 0} Adet`, i: '📜' },
                          { l: 'Saha Deneyimi', v: `${selectedItem.experienceYears} Yıl`, i: '⏳' }
                        ].map((box, i) => (
                           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                              <span className="text-3xl mb-4">{box.i}</span>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{box.l}</p>
                              <p className="text-lg font-black text-slate-900 uppercase">{box.v}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale text-center p-20 select-none">
                  <div className="w-48 h-48 bg-slate-900 rounded-[5rem] flex items-center justify-center mb-10 shadow-2xl">
                     <svg className="w-24 h-24 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 uppercase tracking-[1em] mb-4">MÜHÜRLÜ</h3>
                  <p className="text-[14px] font-bold uppercase tracking-[0.4em] max-w-lg">Görüntülemek istediğiniz dosyayı sol listeden seçerek nöral mührü doğrulayın.</p>
               </div>
            )}
         </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </div>
  );
};

export default ArchiveView;
