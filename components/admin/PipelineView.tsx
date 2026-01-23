import React, { useState, useMemo } from 'react';
import { Candidate, Branch, Gender, GlobalConfig } from '../../types';
import CandidateDetail from './CandidateDetail';
import StatusBadge from './StatusBadge';
import { storageService } from '../../services/storageService';

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

  const filteredAndSortedCandidates = useMemo(() => {
    if (!candidates || !Array.isArray(candidates)) return [];

    let result = candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR').trim();
      const term = (appliedSearch || '').toLocaleLowerCase('tr-TR').trim();
      const matchesSearch = term === '' || name.includes(term);
      const matchesBranch = filters.branches.length === 0 || (c.branch && filters.branches.includes(c.branch));
      const matchesStatus = filters.statuses.length === 0 || (c.status && filters.statuses.includes(c.status));
      // Cast filters.genders to string[] to ensure includes works correctly with Gender union types
      const matchesGender = filters.genders.length === 0 || (c.gender && (filters.genders as string[]).includes(c.gender));
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

  // Fix: Improved toggleFilter typing to resolve 'unknown[]' and 'string[]' assignment errors in the state update.
  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev: any) => {
      // Use any[] and any return to bypass complex union mapping with dynamic property access in React state
      const current = (prev[category] as any[]) || [];
      const next = current.includes(value) 
        ? current.filter((v: any) => v !== value) 
        : [...current, value];
      return { 
        ...prev, 
        [category]: next 
      };
    });
  };

  const handleToggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSet = new Set(multiSelectIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setMultiSelectIds(newSet);
  };

  const handleSelectAll = () => {
    if (multiSelectIds.size === filteredAndSortedCandidates.length) {
      setMultiSelectIds(new Set());
    } else {
      setMultiSelectIds(new Set(filteredAndSortedCandidates.map(c => c.id)));
    }
  };

  const handleBulkDelete = async () => {
    const count = multiSelectIds.size;
    if (count === 0) return;
    if (!confirm(`${count} adet aday kalıcı olarak silinecektir. Devam edilsin mi?`)) return;

    const idsToDelete = Array.from(multiSelectIds);
    await storageService.deleteMultipleCandidates(idsToDelete);
    
    idsToDelete.forEach(id => onDeleteCandidate(id));
    setMultiSelectIds(new Set());
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-14rem)] min-h-[700px] relative">
      
      {multiSelectIds.size > 0 && (
        <div className="absolute top-[-3.5rem] left-0 right-0 bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between shadow-2xl z-[70] animate-slide-down no-print">
          <div className="flex items-center gap-4 ml-4">
            <span className="text-[10px] font-black uppercase tracking-widest">{multiSelectIds.size} Aday Seçildi</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMultiSelectIds(new Set())} className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Vazgeç</button>
            <button onClick={handleBulkDelete} className="px-8 py-2 bg-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg">Seçilenleri Sil</button>
          </div>
        </div>
      )}

      {/* SOL PANEL */}
      <div className="lg:w-[280px] flex flex-col gap-3 h-full shrink-0 overflow-hidden">
        <div className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Ara..." 
              className="w-full bg-slate-50 rounded-lg p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-orange-100 transition-all pl-8"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          <div className="flex flex-wrap gap-1">
            {Object.values(Branch).map(b => (
              <button
                key={b}
                onClick={() => toggleFilter('branches', b)}
                className={`px-1.5 py-0.5 rounded-md text-[6.5px] font-black uppercase border transition-all ${
                  filters.branches.includes(b) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                {b.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1.5">
          <div className="flex items-center justify-between px-2 mb-2">
             <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500" 
                  checked={filteredAndSortedCandidates.length > 0 && multiSelectIds.size === filteredAndSortedCandidates.length}
                  onChange={handleSelectAll}
                />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{filteredAndSortedCandidates.length} ADAY</span>
             </div>
             <div className="flex gap-2 text-[7px] font-black uppercase">
                <button onClick={() => setSortConfig([{ key: 'timestamp', order: 'desc' }])} className={sortConfig[0].key === 'timestamp' ? 'text-orange-600' : 'text-slate-400'}>YENİ</button>
                <button onClick={() => setSortConfig([{ key: 'score', order: 'desc' }])} className={sortConfig[0].key === 'score' ? 'text-orange-600' : 'text-slate-400'}>SKOR</button>
             </div>
          </div>

          {filteredAndSortedCandidates.length === 0 ? (
            <div className="py-10 text-center px-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase leading-relaxed">
                 {candidates.length > 0 ? "Filtrelere Uygun Aday Yok" : "Veri Tabanı Boş veya Senkronizasyon Gerekli"}
               </p>
               <button 
                onClick={onRefresh} 
                className="mt-6 px-8 py-3 bg-orange-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg active:scale-95"
               >
                 BULUTU ŞİMDİ SENKRONİZE ET
               </button>
               <p className="text-[7px] font-bold text-slate-400 mt-4 uppercase italic">
                 * Eğer verileriniz diğer PC'de ise, o PC'de de bu butona bir kez basın.
               </p>
            </div>
          ) : (
            filteredAndSortedCandidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer relative group ${
                  selectedId === c.id ? 'bg-white border-orange-600 shadow-md translate-x-1' : 'bg-white border-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={multiSelectIds.has(c.id)}
                    onClick={e => handleToggleSelect(e, c.id)}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity" 
                  />
                  <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black text-[9px] ${
                    c.report ? (c.report.score > 75 ? 'bg-emerald-600 text-white' : c.report.score > 40 ? 'bg-orange-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-400'
                  }`}>
                    {c.report ? c.report.score : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-[10px] truncate uppercase leading-tight">{c.name || 'İsimsiz'}</h4>
                    <p className="text-[7px] font-bold text-slate-400 uppercase truncate mt-0.5">{c.branch?.split(' ')[0] || 'Genel'} • {c.experienceYears || 0}y</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SAĞ PANEL */}
      <div className="flex-1 h-full overflow-hidden">
        {selectedCandidate ? (
          <CandidateDetail 
            candidate={selectedCandidate}
            config={config}
            onUpdate={onUpdateCandidate}
            onDelete={() => { if (confirm('Silmek istediğinize emin misiniz?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
          />
        ) : (
          <div className="h-full bg-white border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-20 opacity-30">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px]">İncelemek İçin Aday Seçiniz</p>
             <button onClick={onRefresh} className="mt-8 text-[7px] font-black text-orange-600 border-b border-orange-600 uppercase">Sayfayı ve Bulutu Tazele</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
