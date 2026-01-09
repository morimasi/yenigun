
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
  const [filters, setFilters] = useState({
    search: '',
    branches: [] as string[],
    statuses: [] as string[],
    genders: [] as Gender[]
  });

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }[]>([
    { key: 'score', order: 'desc' }
  ]);

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  const filteredAndSortedCandidates = useMemo(() => {
    let result = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesBranch = filters.branches.length === 0 || filters.branches.includes(c.branch);
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(c.status);
      const matchesGender = filters.genders.length === 0 || filters.genders.includes(c.gender);
      return matchesSearch && matchesBranch && matchesStatus && matchesGender;
    });

    // Multi-sort logic
    return result.sort((a, b) => {
      for (const { key, order } of sortConfig) {
        let valA: any, valB: any;
        
        switch (key) {
          case 'score': valA = a.report?.score || 0; valB = b.report?.score || 0; break;
          case 'age': valA = a.age; valB = b.age; break;
          case 'experience': valA = a.experienceYears; valB = b.experienceYears; break;
          case 'name': valA = a.name; valB = b.name; break;
          default: valA = a.timestamp; valB = b.timestamp; break;
        }

        if (valA !== valB) {
          if (order === 'asc') return valA > valB ? 1 : -1;
          return valA < valB ? 1 : -1;
        }
      }
      return 0;
    });
  }, [candidates, filters, sortConfig]);

  const toggleFilter = (category: 'branches' | 'statuses' | 'genders', value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      return {
        ...prev,
        [category]: current.includes(value) 
          ? current.filter(v => v !== value) 
          : [...current, value]
      };
    });
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => {
      const existing = prev.find(s => s.key === key);
      if (existing) {
        return [{ key, order: existing.order === 'asc' ? 'desc' : 'asc' }];
      }
      return [{ key, order: 'desc' }];
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)]">
      {/* Sol Panel: Filtreleme Kontrolleri */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-8 flex flex-col max-h-full">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Aday isminde ara..." 
              className="w-full bg-slate-50 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-100 transition-all pl-14"
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
            />
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
            {/* Branş Filtresi */}
            <div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Branşlar</h5>
              <div className="flex flex-wrap gap-2">
                {Object.values(Branch).map(b => (
                  <button
                    key={b}
                    onClick={() => toggleFilter('branches', b)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      filters.branches.includes(b) ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-500 hover:border-orange-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Cinsiyet Filtresi */}
            <div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Cinsiyet</h5>
              <div className="flex gap-2">
                {['Kadın', 'Erkek', 'Belirtilmemiş'].map(g => (
                  <button
                    key={g}
                    onClick={() => toggleFilter('genders', g)}
                    className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      filters.genders.includes(g as Gender) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-500 hover:border-orange-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Sıralama Seçenekleri */}
            <div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Akıllı Sıralama</h5>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'score', label: 'Analiz Puanı' },
                  { id: 'experience', label: 'Deneyim (Yıl)' },
                  { id: 'age', label: 'Yaş' },
                  { id: 'timestamp', label: 'Başvuru Tarihi' }
                ].map(sort => (
                  <button
                    key={sort.id}
                    onClick={() => handleSort(sort.id as SortKey)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                      sortConfig[0]?.key === sort.id ? 'bg-orange-50 border-orange-600 text-orange-900' : 'bg-white border-slate-50 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{sort.label}</span>
                    {sortConfig[0]?.key === sort.id && (
                      <svg className={`w-4 h-4 transform transition-transform ${sortConfig[0].order === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Liste Alanı */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-20">
          <div className="flex items-center justify-between px-4 mb-2">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filteredAndSortedCandidates.length} Aday Bulundu</span>
          </div>
          {filteredAndSortedCandidates.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(c.id)}
              className={`group p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden ${
                selectedId === c.id 
                ? 'bg-white border-orange-600 shadow-2xl scale-[1.02]' 
                : 'bg-white border-slate-50 hover:border-orange-100 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center relative z-10">
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${
                    c.report ? (c.report.score > 75 ? 'bg-emerald-600 text-white' : c.report.score > 40 ? 'bg-orange-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-400'
                  }`}>
                    {c.report ? `${c.report.score}` : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-base leading-tight group-hover:text-orange-600 transition-colors truncate uppercase">{c.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.branch}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.experienceYears} Yıl</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.gender.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <StatusBadge status={c.status} />
                   {c.algoReport && c.algoReport.reliabilityIndex < 70 && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black rounded border border-rose-100">DÜRÜSTLÜK RİSKİ</span>
                   )}
                </div>
              </div>
              {/* Background Score Indicator */}
              {c.report && (
                <div className="absolute left-0 bottom-0 h-1 bg-slate-100 w-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${c.report.score > 75 ? 'bg-emerald-500' : c.report.score > 40 ? 'bg-orange-500' : 'bg-rose-500'}`}
                    style={{ width: `${c.report.score}%` }}
                   ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sağ Panel: Detay */}
      <div className="lg:col-span-8 h-full">
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
          <div className="h-full bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Aday Havuzu Beklemede</p>
             <p className="text-slate-300 font-bold text-[10px] mt-4 uppercase">Stratejik analiz için soldan bir aday seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
