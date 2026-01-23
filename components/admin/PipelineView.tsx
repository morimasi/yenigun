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
  
  // Explicit types for filters state to prevent TypeScript inference errors when using computed property names in toggleFilter.
  const [filters, setFilters] = useState<{
    branches: string[];
    statuses: string[];
    genders: string[];
  }>({
    branches: [],
    statuses: [],
    genders: []
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

  // BRANŞ VE STATÜ FİLTRELEME MANTIĞI
  // Fix: Explicitly cast the returned object to the state type to ensure full compatibility with union keys.
  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      const next: string[] = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      return {
        ...prev,
        [category]: next
      } as typeof filters;
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

  const handleBulkExportSelected = async () => {
    const count = multiSelectIds.size;
    if (count === 0) return;
    
    const selectedCandidates = candidates.filter(c => multiSelectIds.has(c.id));
    const withReports = selectedCandidates.filter(c => !!c.report);

    if (withReports.length === 0) {
      alert("Seçilen adaylar arasında AI analizi tamamlanmış rapor bulunmuyor.");
      return;
    }

    setIsExportingSelected(true);
    setExportProgress(0);

    try {
      await exportService.exportAllCandidatesAsZip(withReports, (p) => setExportProgress(p));
    } catch (err) {
      alert("ZIP oluşturma hatası: " + err);
    } finally {
      setIsExportingSelected(false);
      setExportProgress(0);
      setMultiSelectIds(new Set());
    }
  };

  const handleUpdateReminder = (e: React.MouseEvent, candidate: Candidate) => {
    e.stopPropagation();
    const current = candidate.reminderNote || '';
    const note = prompt(`${candidate.name} için kısa takip notu giriniz:`, current);
    
    if (note !== null) {
      onUpdateCandidate({
        ...candidate,
        reminderNote: note.trim(),
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-14rem)] min-h-[700px] relative">
      
      {/* EXPORT OVERLAY */}
      {isExportingSelected && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-8 no-print">
          <div className="bg-white rounded-[4rem] p-16 max-w-md w-full shadow-2xl text-center space-y-10 animate-scale-in border border-slate-100">
             <div className="w-24 h-24 bg-orange-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl animate-bounce">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </div>
             <div>
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">ÖZEL ARŞİV HAZIRLANIYOR</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Seçilen Raporlar Paketleniyor</p>
             </div>
             <div className="space-y-4">
               <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                  <div className="h-full bg-orange-600 transition-all duration-500 ease-out" style={{ width: `${exportProgress}%` }}></div>
               </div>
               <p className="text-3xl font-black text-orange-600 tracking-tighter">%{exportProgress}</p>
             </div>
          </div>
        </div>
      )}

      {/* MULTI SELECT BAR */}
      {multiSelectIds.size > 0 && (
        <div className="absolute top-[-3.5rem] left-0 right-0 bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between shadow-2xl z-[70] animate-slide-down no-print">
          <div className="flex items-center gap-4 ml-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{multiSelectIds.size} ADAY SEÇİLDİ</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMultiSelectIds(new Set())} className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Vazgeç</button>
            <button onClick={handleBulkExportSelected} className="px-6 py-2 bg-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2">
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               Raporları İndir (ZIP)
            </button>
            <button onClick={handleBulkDelete} className="px-6 py-2 bg-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg">Seçilenleri Sil</button>
          </div>
        </div>
      )}

      {/* SOL PANEL */}
      <div className="lg:w-[320px] flex flex-col gap-3 h-full shrink-0 overflow-hidden">
        <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Aday Ara..." 
              className="w-full bg-slate-50 rounded-xl p-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-orange-100 transition-all pl-10"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          <div className="flex flex-wrap gap-1.5">
            {Object.values(Branch).map(b => (
              <button
                key={b}
                onClick={() => toggleFilter('branches', b)}
                className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase border transition-all ${
                  filters.branches.includes(b) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                {b.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
          <div className="flex items-center justify-between px-3 mb-3">
             <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer" 
                  checked={filteredAndSortedCandidates.length > 0 && multiSelectIds.size === filteredAndSortedCandidates.length}
                  onChange={handleSelectAll}
                />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filteredAndSortedCandidates.length} LİYAKAT DOSYASI</span>
             </div>
             <div className="flex gap-3 text-[8px] font-black uppercase">
                <button onClick={() => setSortConfig([{ key: 'timestamp', order: 'desc' }])} className={sortConfig[0].key === 'timestamp' ? 'text-orange-600' : 'text-slate-400'}>YENİ</button>
                <button onClick={() => setSortConfig([{ key: 'score', order: 'desc' }])} className={sortConfig[0].key === 'score' ? 'text-orange-600' : 'text-slate-400'}>SKOR</button>
             </div>
          </div>

          {filteredAndSortedCandidates.length === 0 ? (
            <div className="py-20 text-center px-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase leading-relaxed">
                 Filtrelere Uygun Aday Yok
               </p>
               <button onClick={onRefresh} className="mt-8 px-10 py-4 bg-orange-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl">Bulutu Güncelle</button>
            </div>
          ) : (
            filteredAndSortedCandidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                  selectedId === c.id ? 'bg-white border-orange-600 shadow-xl translate-x-1' : 'bg-white border-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={multiSelectIds.has(c.id)}
                    onClick={e => handleToggleSelect(e, c.id)}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity cursor-pointer" 
                  />
                  <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black text-[11px] shadow-sm ${
                    c.report ? (c.report.score > 75 ? 'bg-emerald-600 text-white' : c.report.score > 40 ? 'bg-orange-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-400'
                  }`}>
                    {c.report ? c.report.score : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-[11px] truncate uppercase leading-none">{c.name || 'İsimsiz'}</h4>
                      <button 
                        onClick={(e) => handleUpdateReminder(e, c)}
                        className={`p-1.5 rounded-lg transition-all ${c.reminderNote ? 'bg-orange-100 text-orange-600' : 'text-slate-300 hover:text-orange-400 hover:bg-orange-50'}`}
                        title={c.reminderNote || 'Kısa not ekle'}
                      >
                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M14 17H4V15H14V17ZM14 13H4V11H14V13ZM14 9H4V7H14V9ZM20 20L18.15 18.15L19.55 16.75L18.15 15.35L19.55 13.95L21.65 16.05L20 17.7L21.4 19.1L20 20Z"/></svg>
                      </button>
                    </div>
                    {c.reminderNote && (
                      <p className="text-[7.5px] font-black text-orange-600 uppercase truncate mt-1 bg-orange-50 inline-block px-1.5 py-0.5 rounded leading-none">{c.reminderNote}</p>
                    )}
                    <p className="text-[8px] font-bold text-slate-400 uppercase truncate mt-1">{c.branch?.split(' ')[0] || 'Genel'} • {c.experienceYears || 0} Yıl</p>
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
          <div className="h-full bg-white border-2 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-24 opacity-30">
             <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-[11px]">Detaylı İnceleme İçin Dosya Seçiniz</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;