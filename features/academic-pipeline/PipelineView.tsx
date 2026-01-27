
import React, { useState, useMemo } from 'react';
import { Candidate, Branch, GlobalConfig } from '../../types';
import CandidateDetail from './CandidateDetail';
import { StatusBadge } from '../../shared/ui/StatusBadge';

interface PipelineViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
}

type SortKey = 'score' | 'age' | 'experience' | 'timestamp' | 'name';
type SortOrder = 'asc' | 'desc';

const PipelineView: React.FC<PipelineViewProps> = ({ candidates, config, onUpdateCandidate, onDeleteCandidate, onRefresh }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    branches: [] as string[],
    statuses: [] as string[],
    genders: [] as string[],
    ageRange: [18, 65] as [number, number],
    expRange: [0, 50] as [number, number],
    scoreRange: [0, 100] as [number, number],
    deptSearch: '',
    dateSince: ''
  });

  const [sortConfig] = useState<{ key: SortKey; order: SortOrder }[]>([
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

  const filteredAndSortedCandidates = useMemo(() => {
    if (!candidates || !Array.isArray(candidates)) return [];

    return candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR').trim();
      const term = (appliedSearch || '').toLocaleLowerCase('tr-TR').trim();
      const matchesSearch = term === '' || name.includes(term);
      const matchesBranch = filters.branches.length === 0 || (c.branch && filters.branches.includes(c.branch));
      const matchesStatus = filters.statuses.length === 0 || (c.status && filters.statuses.includes(c.status));
      const matchesAge = c.age >= filters.ageRange[0] && c.age <= filters.ageRange[1];
      const matchesExp = (c.experienceYears || 0) >= filters.expRange[0] && (c.experienceYears || 0) <= filters.expRange[1];
      const score = c.report?.score ?? -1;
      const matchesScore = score === -1 ? filters.scoreRange[0] === 0 : (score >= filters.scoreRange[0] && score <= filters.scoreRange[1]);

      return matchesSearch && matchesBranch && matchesStatus && matchesAge && matchesExp && matchesScore;
    }).sort((a, b) => {
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
    const current = filters[category];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters(prev => ({ ...prev, [category]: next }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen relative items-start">
      <div className="lg:w-[320px] flex flex-col gap-5 shrink-0 no-print sticky top-32 max-h-[calc(100vh-10rem)]">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="İsim ile Dosya Ara..." 
              className="w-full bg-slate-50 rounded-2xl p-5 text-[12px] font-bold outline-none border border-slate-100 shadow-inner"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </form>

          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-lg"
          >
            {isFilterPanelOpen ? 'FİLTRELERİ GİZLE' : `GELİŞMİŞ FİLTRE (${filteredAndSortedCandidates.length})`}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {isFilterPanelOpen ? (
            <div className="space-y-5 animate-slide-down">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">KLİNİK BRANŞLAR</h4>
                 <div className="flex flex-wrap gap-2">
                    {Object.values(Branch).map(b => (
                      <button
                        key={b}
                        onClick={() => toggleFilter('branches', b)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${
                          filters.branches.includes(b) ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200'
                        }`}
                      >
                        {b.split(' ')[0]}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-slide-up">
              {filteredAndSortedCandidates.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => { setSelectedId(c.id); window.scrollTo({ top: 112, behavior: 'smooth' }); }}
                  className={`p-5 rounded-[2.2rem] border transition-all cursor-pointer relative group ${
                    selectedId === c.id ? 'bg-white border-orange-600 shadow-2xl translate-x-2 ring-8 ring-orange-50' : 'bg-white border-slate-50 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center font-black text-[16px] shadow-sm ${
                      c.report ? (c.report.score > 75 ? 'bg-emerald-600 text-white' : c.report.score > 40 ? 'bg-orange-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-400'
                    }`}>
                      {c.report ? c.report.score : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 text-[13px] truncate uppercase leading-none">{c.name || 'İsimsiz'}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase truncate mt-2 tracking-widest">{c.branch?.split(' ')[0]} • {c.experienceYears}Y</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {selectedCandidate ? (
          <CandidateDetail 
            candidate={selectedCandidate}
            config={config}
            onUpdate={onUpdateCandidate}
            onDelete={() => { if (confirm('Kayıt silinecek. Emin misiniz?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
          />
        ) : (
          <div className="h-[800px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-24 opacity-40 sticky top-32">
             <p className="text-slate-400 font-black uppercase tracking-[1em] text-[14px]">Liyakat Dosyası Bekleniyor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
