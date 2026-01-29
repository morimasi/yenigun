
import React, { useState, useMemo } from 'react';
import { Candidate, ArchiveCategory } from '../../types';

interface ArchiveViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

const CATEGORY_MAP: Record<ArchiveCategory, { label: string, color: string, indicator: string }> = {
  TALENT_POOL: { label: 'YETENEK HAVUZU', color: 'text-emerald-600', indicator: 'bg-emerald-500' },
  FUTURE_REFERENCE: { label: 'GELECEK BAŞVURU', color: 'text-blue-600', indicator: 'bg-blue-500' },
  DISQUALIFIED: { label: 'DİSKALİFİYE', color: 'text-slate-500', indicator: 'bg-slate-400' },
  BLACK_LIST: { label: 'KARA LİSTE', color: 'text-rose-600', indicator: 'bg-rose-600' },
  HIRED_CONTRACTED: { label: 'KADROLU PERSONEL', color: 'text-slate-900', indicator: 'bg-slate-900' }
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState({ category: 'ALL', search: '' });

  const archivedCandidates = useMemo(() => 
    candidates.filter(c => c.status === 'archived').sort((a, b) => b.timestamp - a.timestamp), 
    [candidates]
  );

  const filteredList = useMemo(() => {
    return archivedCandidates.filter(c => {
      const matchesCat = filter.category === 'ALL' || c.archiveCategory === filter.category;
      const matchesSearch = c.name.toLocaleLowerCase('tr-TR').includes(filter.search.toLocaleLowerCase('tr-TR')) || 
                            c.branch.toLocaleLowerCase('tr-TR').includes(filter.search.toLocaleLowerCase('tr-TR'));
      return matchesCat && matchesSearch;
    });
  }, [archivedCandidates, filter]);

  const selectedCandidate = useMemo(() => 
    archivedCandidates.find(c => c.id === selectedId), 
    [archivedCandidates, selectedId]
  );

  const stats = useMemo(() => {
    return archivedCandidates.reduce((acc, c) => {
      acc.total++;
      if (c.archiveCategory) acc[c.archiveCategory] = (acc[c.archiveCategory] || 0) + 1;
      return acc;
    }, { total: 0 } as Record<string, number>);
  }, [archivedCandidates]);

  const handleRestore = (candidate: Candidate) => {
    if (confirm("GÜVENLİK PROTOKOLÜ: Bu dosya üzerindeki 'Mühür' kaldırılacak ve aday aktif havuza taşınacaktır. Onaylıyor musunuz?")) {
      onUpdateCandidate({ ...candidate, status: 'pending', timestamp: Date.now() });
      setSelectedId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("KRİTİK İŞLEM: Bu kayıt veritabanından kalıcı olarak silinecek. Geri alınamaz. Devam edilsin mi?")) {
      onDeleteCandidate(id);
      setSelectedId(null);
    }
  };

  return (
    <div className="flex h-full bg-white rounded-lg border border-slate-200 overflow-hidden">
      
      {/* SOL: VERİ LİSTESİ (MASTER) */}
      <div className="w-[400px] flex flex-col border-r border-slate-200 bg-white shrink-0">
        {/* Filtre Alanı */}
        <div className="p-3 border-b border-slate-200 space-y-3 bg-slate-50/50">
           <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                 ARŞİV KAYITLARI ({filteredList.length})
              </h3>
           </div>
           
           <div className="flex gap-2">
              <select 
                className="flex-1 bg-white border border-slate-200 text-[10px] font-bold rounded-md py-1.5 px-2 outline-none focus:border-orange-500 uppercase"
                value={filter.category}
                onChange={e => setFilter({...filter, category: e.target.value})}
              >
                 <option value="ALL">TÜM KATEGORİLER</option>
                 {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                 ))}
              </select>
           </div>
           
           <div className="relative">
              <input 
                 type="text" 
                 placeholder="İsim veya Ref No..." 
                 className="w-full bg-white border border-slate-200 rounded-md py-1.5 pl-8 pr-2 text-[10px] font-bold outline-none focus:border-orange-500 transition-all uppercase"
                 value={filter.search}
                 onChange={e => setFilter({...filter, search: e.target.value})}
              />
              <svg className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {filteredList.map(c => {
              const cat = CATEGORY_MAP[c.archiveCategory || 'FUTURE_REFERENCE'];
              const isSelected = selectedId === c.id;
              
              return (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedId(c.id)}
                  className={`px-4 py-3 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 group ${isSelected ? 'bg-slate-50 border-l-4 border-l-slate-900' : 'border-l-4 border-l-transparent'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <span className={`text-[11px] font-black uppercase truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{c.name}</span>
                      <span className="text-[9px] font-mono text-slate-400">{new Date(c.timestamp).toLocaleDateString('tr-TR')}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{c.branch}</span>
                         <span className={`text-[8px] font-black uppercase mt-1 ${cat.color} flex items-center gap-1.5`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${cat.indicator}`}></div>
                            {cat.label}
                         </span>
                      </div>
                      {c.report && <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-900 transition-colors">SKOR: %{c.report.score}</span>}
                   </div>
                </div>
              );
           })}
        </div>
      </div>

      {/* SAĞ: DOSYA DETAYI (DETAIL) */}
      <div className="flex-1 bg-slate-50/30 flex flex-col overflow-hidden relative">
         {selectedCandidate ? (
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               
               {/* DOSYA HEADER */}
               <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-2xl font-black text-slate-300 shadow-sm">
                        {selectedCandidate.name.charAt(0)}
                     </div>
                     <div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">{selectedCandidate.name}</h1>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <span>{selectedCandidate.branch}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span>REF: {selectedCandidate.id}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className={`inline-block px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${
                        CATEGORY_MAP[selectedCandidate.archiveCategory || 'FUTURE_REFERENCE'].color
                     } border-current opacity-80`}>
                        {CATEGORY_MAP[selectedCandidate.archiveCategory || 'FUTURE_REFERENCE'].label}
                     </span>
                     <p className="text-[9px] font-mono text-slate-400 mt-2">ARŞİV TARİHİ: {new Date(selectedCandidate.timestamp).toLocaleString('tr-TR')}</p>
                  </div>
               </div>

               {/* KARAR METNİ */}
               <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">ARŞİVLEME GEREKÇESİ (KARAR NOTU)</h4>
                  <p className="text-[12px] font-medium text-slate-700 leading-relaxed font-mono">
                     "{selectedCandidate.archiveNote || 'Sistem tarafından otomatik arşivlenmiştir. Özel bir not bulunmamaktadır.'}"
                  </p>
               </div>

               {/* VERİ ÖZETİ */}
               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                     <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">AKADEMİK PROFİL</h5>
                     <ul className="space-y-2">
                        <li className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-1">
                           <span className="text-slate-500">DENEYİM</span>
                           <span className="text-slate-900">{selectedCandidate.experienceYears} YIL</span>
                        </li>
                        <li className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-1">
                           <span className="text-slate-500">ÜNİVERSİTE</span>
                           <span className="text-slate-900 truncate max-w-[150px]">{selectedCandidate.university}</span>
                        </li>
                        <li className="flex justify-between text-[10px] font-bold pb-1">
                           <span className="text-slate-500">E-POSTA</span>
                           <span className="text-slate-900 truncate max-w-[150px]">{selectedCandidate.email}</span>
                        </li>
                     </ul>
                  </div>
                  
                  {selectedCandidate.report && (
                     <div className="bg-slate-900 p-5 rounded-xl text-white">
                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">LİYAKAT SNAPSHOT</h5>
                        <div className="flex items-end gap-4 mb-4">
                           <span className="text-4xl font-black text-white">%{selectedCandidate.report.score}</span>
                           <span className="text-[9px] font-bold text-slate-400 mb-1">GENEL SKOR</span>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>DÜRÜSTLÜK ENDEKSİ</span>
                              <span className="text-emerald-400">%{selectedCandidate.report.integrityIndex}</span>
                           </div>
                           <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${selectedCandidate.report.integrityIndex}%` }}></div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               {/* ACTIONS */}
               <div className="flex gap-4 pt-4 border-t border-slate-200">
                  <button 
                     onClick={() => handleRestore(selectedCandidate)}
                     className="flex-1 py-3 bg-white border border-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                  >
                     HAVUZA GERİ YÜKLE
                  </button>
                  <button 
                     onClick={() => handleDelete(selectedCandidate.id)}
                     className="px-6 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                  >
                     SİL
                  </button>
               </div>

            </div>
         ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">DOSYA SEÇİLMEDİ</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default ArchiveView;
