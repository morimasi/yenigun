
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
  const [appliedSearch, setAppliedSearch] = useState('');
  
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
    setFilters({ branches: [], statuses: [], genders: [] });
  };

  const filteredAndSortedCandidates = useMemo(() => {
    if (!candidates || !Array.isArray(candidates)) return [];

    let result = candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR').trim();
      const term = (appliedSearch || '').toLocaleLowerCase('tr-TR').trim();
      const matchesSearch = term === '' || name.includes(term);
      const matchesBranch = filters.branches.length === 0 || (c.branch && filters.branches.includes(c.branch));
      const matchesStatus = filters.statuses.length === 0 || (c.status && filters.statuses.includes(c.status));
      const matchesGender = filters.genders.length === 0 || (c.gender && filters.genders.includes(c.gender));
      return matchesSearch && matchesBranch && matchesStatus && matchesGender;
    });

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
        if (valA !== valB) return order === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      }
      return 0;
    });
  }, [candidates, appliedSearch, filters, sortConfig]);

  const toggleFilter = (category: 'branches' | 'statuses' | 'genders', value: string) => {
    setFilters(prev => {
      const current = (prev as any)[category] as any[];
      return { ...prev, [category]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-14rem)] min-h-[700px]">
      
      {/* SOL PANEL: Daraltılmış Kompakt Liste (Fixed Width lg:340px) */}
      <div className="lg:w-[340px] flex flex-col gap-4 h-full shrink-0 overflow-hidden">
        
        {/* Minimal Kontrol Paneli */}
        <div className="bg-white p-4 rounded-[2rem] shadow-lg border border-slate-100 flex flex-col gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Aday ara..." 
              className="w-full bg-slate-50 rounded-xl p-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-orange-100 transition-all pl-10"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          <div className="flex flex-wrap gap-1">
            {Object.values(Branch).map(b => (
              <button
                key={b}
                onClick={() => toggleFilter('branches', b)}
                className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase border-2 transition-all ${
                  filters.branches.includes(b) ? 'bg-orange-600 border-orange-600 text-white shadow-sm' : 'bg-white border-slate-50 text-slate-400 hover:border-orange-100'
                }`}
              >
                {b.split(' ')[0]}
              </button>
            ))}
          </div>
          
          {(searchInput || filters.branches.length > 0) && (
            <button onClick={clearFilters} className="py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Sıfırla</button>
          )}
        </div>

        {/* Kompakt Aday Listesi */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
          <div className="flex items-center justify-between px-2">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filteredAndSortedCandidates.length} ADAY</span>
             <div className="flex gap-2">
                <button onClick={() => setSortConfig([{ key: 'timestamp', order: 'desc' }])} className={`text-[8px] font-black uppercase ${sortConfig[0].key === 'timestamp' ? 'text-orange-600' : 'text-slate-400'}`}>Yeni</button>
                <button onClick={() => setSortConfig([{ key: 'score', order: 'desc' }])} className={`text-[8px] font-black uppercase ${sortConfig[0].key === 'score' ? 'text-orange-600' : 'text-slate-400'}`}>Skor</button>
             </div>
          </div>

          {filteredAndSortedCandidates.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(c.id)}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedId === c.id ? 'bg-white border-orange-600 shadow-lg' : 'bg-white border-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-black text-[10px] ${
                  c.report ? (c.report.score > 75 ? 'bg-emerald-600 text-white' : c.report.score > 40 ? 'bg-orange-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-400'
                }`}>
                  {c.report ? c.report.score : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-[11px] truncate uppercase">{c.name || 'İsimsiz'}</h4>
                  <p className="text-[8px] font-bold text-slate-400 uppercase truncate">{c.branch.split(' ')[0]} • {c.experienceYears}y</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ PANEL: Genişletilmiş Detay (flex-1) */}
      <div className="flex-1 h-full overflow-hidden">
        {selectedCandidate ? (
          <CandidateDetail 
            candidate={selectedCandidate}
            onUpdate={onUpdateCandidate}
            onDelete={() => { if (confirm('Silmek istediğinize emin misiniz?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
          />
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-30">
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">ADAY SEÇİN</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
