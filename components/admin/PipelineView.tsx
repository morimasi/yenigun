
import React, { useState, useMemo } from 'react';
import { Candidate, Branch, Gender } from '../../types';
import CandidateDetail from './CandidateDetail';
import StatusBadge from './StatusBadge';

interface PipelineViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

type SortKey = 'score' | 'age' | 'experience' | 'timestamp' | 'name';
type SortOrder = 'asc' | 'desc';

const PipelineView: React.FC<PipelineViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState(''); // Fiziksel 'Ara' butonu için state
  
  const [filters, setFilters] = useState({
    branches: [] as string[],
    statuses: [] as string[],
    genders: [] as Gender[]
  });

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }[]>([
    { key: 'timestamp', order: 'desc' }
  ]);

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput('');
    setAppliedSearch('');
    setFilters({
      branches: [],
      statuses: [],
      genders: []
    });
  };

  const filteredAndSortedCandidates = useMemo(() => {
    // Veri güvenliği kontrolü
    if (!candidates || !Array.isArray(candidates)) return [];

    let result = candidates.filter(c => {
      if (!c || typeof c !== 'object') return false;

      // 1. İsim Araması (Normalleştirilmiş ve toleranslı)
      const name = (c.name || '').toLocaleLowerCase('tr-TR').trim();
      const term = (appliedSearch || '').toLocaleLowerCase('tr-TR').trim();
      const matchesSearch = term === '' || name.includes(term);

      // 2. Branş Filtresi (Branş verisi yoksa ama filtre varsa gizle, filtre yoksa göster)
      const matchesBranch = filters.branches.length === 0 || 
                            (c.branch && filters.branches.includes(c.branch));

      // 3. Statü Filtresi
      const matchesStatus = filters.statuses.length === 0 || 
                            (c.status && filters.statuses.includes(c.status));

      // 4. Cinsiyet Filtresi
      const matchesGender = filters.genders.length === 0 || 
                            (c.gender && filters.genders.includes(c.gender));
      
      return matchesSearch && matchesBranch && matchesStatus && matchesGender;
    });

    // Sıralama Motoru
    return [...result].sort((a, b) => {
      for (const { key, order } of sortConfig) {
        let valA: any, valB: any;
        
        switch (key) {
          case 'score': valA = a.report?.score ?? -1; valB = b.report?.score ?? -1; break;
          case 'age': valA = a.age ?? 0; valB = b.age ?? 0; break;
          case 'experience': valA = a.experienceYears ?? 0; valB = b.experienceYears ?? 0; break;
          case 'name': valA = (a.name || '').toLocaleLowerCase('tr-TR'); valB = (b.name || '').toLocaleLowerCase('tr-TR'); break;
          default: valA = a.timestamp ?? 0; valB = b.timestamp ?? 0; break;
        }

        if (valA !== valB) {
          if (order === 'asc') return valA > valB ? 1 : -1;
          return valA < valB ? 1 : -1;
        }
      }
      return 0;
    });
  }, [candidates, appliedSearch, filters, sortConfig]);

  const toggleFilter = (category: 'branches' | 'statuses' | 'genders', value: string) => {
    setFilters(prev => {
      const current = (prev as any)[category] as any[];
      return {
        ...prev,
        [category]: current.includes(value) 
          ? current.filter(v => v !== value) 
          : [...current, value]
      };
    });
  };

  const handleSort = (key: SortKey) => {
    setSortConfig([{ key, order: sortConfig[0]?.order === 'desc' ? 'asc' : 'desc' }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)] min-h-[700px]">
      {/* Sol Panel: Kontrol ve Liste */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
        
        {/* Kontrol Paneli */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col gap-5">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Aday ara..." 
                className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-100 transition-all pl-12"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              type="submit"
              className="px-6 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            >
              ARA
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5">
            {Object.values(Branch).map(b => (
              <button
                key={b}
                onClick={() => toggleFilter('branches', b)}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border-2 transition-all ${
                  filters.branches.includes(b) ? 'bg-orange-600 border-orange-600 text-white shadow-md' : 'bg-white border-slate-50 text-slate-400 hover:border-orange-100'
                }`}
              >
                {b.split(' ')[0]}
              </button>
            ))}
          </div>

          {(searchInput || filters.branches.length > 0) && (
            <button 
              onClick={clearFilters}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md"
            >
              Filtreleri Sıfırla
            </button>
          )}
        </div>

        {/* Aday Listesi */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-20">
          <div className="flex items-center justify-between px-2 mb-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               {filteredAndSortedCandidates.length} Aday Listeleniyor
             </span>
             <div className="flex gap-3">
                <button onClick={() => handleSort('timestamp')} className={`text-[9px] font-black uppercase ${sortConfig[0].key === 'timestamp' ? 'text-orange-600 underline' : 'text-slate-400'}`}>Tarih</button>
                <button onClick={() => handleSort('score')} className={`text-[9px] font-black uppercase ${sortConfig[0].key === 'score' ? 'text-orange-600 underline' : 'text-slate-400'}`}>Skor</button>
             </div>
          </div>

          {filteredAndSortedCandidates.length > 0 ? (
            filteredAndSortedCandidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                className={`group p-5 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${
                  selectedId === c.id 
                  ? 'bg-white border-orange-600 shadow-2xl scale-[1.02]' 
                  : 'bg-white border-slate-50 hover:border-orange-200'
                }`}
              >
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex gap-4 items-center flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-md ${
                      c.report ? (c.report.score > 75 ? 'bg-emerald-600 text-white' : c.report.score > 40 ? 'bg-orange-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-400'
                    }`}>
                      {c.report ? `${c.report.score}` : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 text-sm leading-tight truncate uppercase group-hover:text-orange-600 transition-colors">
                        {c.name || 'İsimsiz Aday'}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 truncate">
                        {c.branch} • {c.experienceYears} Yıl
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-white/50 px-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Liste Boş Görünüyor</p>
              <p className="text-slate-300 font-bold text-[9px] mt-4 uppercase leading-relaxed">
                Toplam {candidates.length} aday var ancak filtrelerinizle eşleşmiyorlar.
              </p>
              <button 
                onClick={clearFilters} 
                className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
              >
                TÜM FİLTRELERİ SIFIRLA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sağ Panel: Aday Detay */}
      <div className="lg:col-span-8 h-full overflow-hidden">
        {selectedCandidate ? (
          <CandidateDetail 
            candidate={selectedCandidate}
            onUpdate={onUpdateCandidate}
            onDelete={() => {
              if (confirm('Aday kaydını silmek istediğinize emin misiniz?')) {
                onDeleteCandidate(selectedCandidate.id);
                setSelectedId(null);
              }
            }}
          />
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20">
             <div className="w-24 h-24 bg-orange-50 rounded-[3rem] flex items-center justify-center mb-8 rotate-12 shadow-inner">
                <svg className="w-10 h-10 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Aday Havuzu Beklemede</p>
             <p className="text-slate-300 font-bold text-[10px] mt-6 uppercase leading-relaxed max-w-xs">
                Yönetim paneline hoş geldiniz. Detaylı analiz ve mülakat planlaması için soldan bir aday seçin.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
