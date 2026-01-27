
import React, { useState, useMemo } from 'react';
import { Candidate, Branch, Gender, GlobalConfig } from '../../types';
import CandidateDetail from './CandidateDetail';
import StatusBadge from './StatusBadge';
import { storageService } from '../../services/storageService';
import { exportService } from '../../services/exportService';

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
  const [multiSelectIds, setMultiSelectIds] = useState<Set<string>>(new Set());
  const [isExportingSelected, setIsExportingSelected] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const [filters, setFilters] = useState<{
    branches: string[];
    statuses: string[];
    genders: string[];
    ageRange: [number, number];
    expRange: [number, number];
    scoreRange: [number, number];
    deptSearch: string;
    dateSince: string;
  }>({
    branches: [],
    statuses: [],
    genders: [],
    ageRange: [18, 65],
    expRange: [0, 50],
    scoreRange: [0, 100],
    deptSearch: '',
    dateSince: ''
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

  const filteredAndSortedCandidates = useMemo(() => {
    if (!candidates || !Array.isArray(candidates)) return [];

    return candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR').trim();
      const term = (appliedSearch || '').toLocaleLowerCase('tr-TR').trim();
      const matchesSearch = term === '' || name.includes(term);
      const matchesBranch = filters.branches.length === 0 || (c.branch && filters.branches.includes(c.branch));
      const matchesStatus = filters.statuses.length === 0 || (c.status && filters.statuses.includes(c.status));
      const matchesGender = filters.genders.length === 0 || (c.gender && filters.genders.includes(c.gender));
      const matchesAge = c.age >= filters.ageRange[0] && c.age <= filters.ageRange[1];
      const matchesExp = (c.experienceYears || 0) >= filters.expRange[0] && (c.experienceYears || 0) <= filters.expRange[1];
      const score = c.report?.score ?? -1;
      const matchesScore = score === -1 ? filters.scoreRange[0] === 0 : (score >= filters.scoreRange[0] && score <= filters.scoreRange[1]);
      const matchesDept = filters.deptSearch === '' || (c.department || '').toLocaleLowerCase('tr-TR').includes(filters.deptSearch.toLocaleLowerCase('tr-TR'));
      const matchesDate = filters.dateSince === '' || new Date(c.timestamp) >= new Date(filters.dateSince);

      return matchesSearch && matchesBranch && matchesStatus && matchesGender && matchesAge && matchesExp && matchesScore && matchesDept && matchesDate;
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

  const getCountForFilter = (category: keyof typeof filters, value: any) => {
     return candidates.filter(c => {
        if (category === 'branches') return c.branch === value;
        if (category === 'statuses') return c.status === value;
        if (category === 'genders') return c.gender === value;
        return true;
     }).length;
  };

  const toggleFilter = (category: 'branches' | 'statuses' | 'genders', value: string) => {
    const current = filters[category];
    const next = current.includes(value)
      ? (current as string[]).filter(v => v !== value)
      : [...(current as string[]), value];
    setFilters(prev => ({ ...prev, [category]: next }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen relative items-start">
      
      {/* EXPORT OVERLAY */}
      {isExportingSelected && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-8 no-print">
          <div className="bg-white rounded-[4rem] p-16 max-w-md w-full shadow-2xl text-center space-y-10 animate-scale-in border border-slate-100">
             <div className="w-24 h-24 bg-orange-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl animate-bounce">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </div>
             <div>
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">ARŞİV PAKETLENİYOR</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Analiz Raporları Birleştiriliyor</p>
             </div>
             <div className="space-y-4">
               <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full bg-orange-600 transition-all duration-500" style={{ width: `${exportProgress}%` }}></div>
               </div>
               <p className="text-3xl font-black text-orange-600 tracking-tighter">%{exportProgress}</p>
             </div>
          </div>
        </div>
      )}

      {/* SOL PANEL (STICKY SIDEBAR) */}
      <div className="lg:w-[320px] flex flex-col gap-5 shrink-0 no-print sticky top-32 max-h-[calc(100vh-10rem)]">
        
        {/* Arama & Filtre Paneli Toggle */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="İsim ile Dosya Ara..." 
              className="w-full bg-slate-50 rounded-2xl p-5 text-[12px] font-bold outline-none focus:ring-2 focus:ring-orange-100 transition-all pl-14 border border-slate-100 shadow-inner"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            {isFilterPanelOpen ? 'FİLTRELERİ GİZLE' : `GELİŞMİŞ FİLTRE (${filteredAndSortedCandidates.length})`}
          </button>
        </div>

        {/* Dinamik Filtre & Aday Listesi */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {isFilterPanelOpen ? (
            <div className="space-y-5 animate-slide-down">
              {/* Branş Filtresi */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">KLİNİK BRANŞLAR</h4>
                 <div className="flex flex-wrap gap-2">
                    {Object.values(Branch).map(b => {
                       const count = getCountForFilter('branches', b);
                       if (count === 0) return null;
                       return (
                          <button
                            key={b}
                            onClick={() => toggleFilter('branches', b)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all flex items-center gap-2 ${
                              filters.branches.includes(b) ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200'
                            }`}
                          >
                            {b.split(' ')[0]}
                            <span className={`px-1.5 py-0.5 rounded-lg text-[8px] ${filters.branches.includes(b) ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
                          </button>
                       );
                    })}
                 </div>
              </div>

              {/* Sayısal Aralıklar */}
              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">DENEYİM YILI</h4>
                       <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{filters.expRange[0]} - {filters.expRange[1]} Yıl</span>
                    </div>
                    <input 
                      type="range" min="0" max="40" step="1"
                      className="w-full accent-orange-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      value={filters.expRange[1]}
                      onChange={e => setFilters(prev => ({ ...prev, expRange: [0, parseInt(e.target.value)] }))}
                    />
                 </div>
                 <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl text-white">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">LİYAKAT SKORU (%)</h4>
                       <span className="text-[10px] font-black text-white bg-orange-600 px-3 py-1 rounded-lg">%{filters.scoreRange[0]} +</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="5"
                      className="w-full accent-orange-600 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      value={filters.scoreRange[0]}
                      onChange={e => setFilters(prev => ({ ...prev, scoreRange: [parseInt(e.target.value), 100] }))}
                    />
                 </div>
              </div>

              <button 
                onClick={() => setIsFilterPanelOpen(false)}
                className="w-full py-4 text-slate-900 text-[10px] font-black uppercase tracking-widest bg-slate-100 rounded-2xl transition-all"
              >
                Sonuçları Listele
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-slide-up">
              {filteredAndSortedCandidates.length === 0 ? (
                <div className="py-20 text-center px-8 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                   <p className="text-[11px] font-black text-slate-400 uppercase leading-relaxed">Uygun Kayıt Yok</p>
                </div>
              ) : (
                filteredAndSortedCandidates.map((c: Candidate) => (
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
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-black text-slate-900 text-[13px] truncate uppercase leading-none">{c.name || 'İsimsiz'}</h4>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase truncate mt-2 tracking-widest">{(c.branch as string)?.split(' ')[0]} • {c.experienceYears}Y</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* SAĞ PANEL (Sonsuz Kanvas Modeli) */}
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
             <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 shadow-inner">
                <svg className="w-20 h-20 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[1em] text-[14px]">Liyakat Dosyası Bekleniyor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
