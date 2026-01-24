
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

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    const current = filters[category] as string[];
    const next: string[] = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];

    setFilters((prev) => ({
      ...prev,
      [category]: next
    }));
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
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[800px] relative">
      
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
        <div className="absolute top-[-4rem] left-0 right-0 bg-slate-900 text-white p-4 rounded-3xl flex items-center justify-between shadow-2xl z-[70] animate-slide-down no-print border border-white/10">
          <div className="flex items-center gap-6 ml-6">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500">{multiSelectIds.size} DOSYA SEÇİLDİ</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setMultiSelectIds(new Set())} className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Vazgeç</button>
            <button onClick={handleBulkExportSelected} className="px-8 py-2.5 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               Toplu Arşiv (ZIP)
            </button>
            <button onClick={handleBulkDelete} className="px-8 py-2.5 bg-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg">Kalıcı Olarak Sil</button>
          </div>
        </div>
      )}

      {/* SOL PANEL (SOLARIS SIDEBAR) */}
      <div className="lg:w-[280px] flex flex-col gap-4 h-full shrink-0 overflow-hidden no-print">
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Dosya Ara..." 
              className="w-full bg-slate-50 rounded-2xl p-4 text-[12px] font-bold outline-none focus:ring-2 focus:ring-orange-100 transition-all pl-12 border border-transparent"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          <div className="flex flex-wrap gap-2">
            {Object.values(Branch).map(b => (
              <button
                key={b}
                onClick={() => toggleFilter('branches', b)}
                className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border transition-all ${
                  filters.branches.includes(b) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                {b.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          <div className="flex items-center justify-between px-4 mb-2">
             <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-slate-200 text-orange-600 focus:ring-orange-500 cursor-pointer" 
                  checked={filteredAndSortedCandidates.length > 0 && multiSelectIds.size === filteredAndSortedCandidates.length}
                  onChange={handleSelectAll}
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{filteredAndSortedCandidates.length} ADAY</span>
             </div>
          </div>

          {filteredAndSortedCandidates.length === 0 ? (
            <div className="py-20 text-center px-8 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
               <p className="text-[11px] font-black text-slate-400 uppercase leading-relaxed">Uygun Kayıt Bulunamadı</p>
            </div>
          ) : (
            filteredAndSortedCandidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                className={`p-4 rounded-[1.75rem] border transition-all cursor-pointer relative group ${
                  selectedId === c.id ? 'bg-white border-orange-600 shadow-2xl translate-x-1 ring-4 ring-orange-50' : 'bg-white border-slate-50 hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center font-black text-[13px] shadow-sm ${
                    c.report ? (c.report.score > 75 ? 'bg-emerald-600 text-white' : c.report.score > 40 ? 'bg-orange-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-400'
                  }`}>
                    {c.report ? c.report.score : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-black text-slate-900 text-[12px] truncate uppercase leading-none">{c.name || 'İsimsiz'}</h4>
                      <div className={`w-2 h-2 rounded-full ${c.reminderNote ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase truncate mt-1.5">{c.branch?.split(' ')[0]} • {c.experienceYears}Y</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SAĞ PANEL (DEEP-DIVE CANVAS) */}
      <div className="flex-1 h-full min-w-0">
        {selectedCandidate ? (
          <CandidateDetail 
            candidate={selectedCandidate}
            config={config}
            onUpdate={onUpdateCandidate}
            onDelete={() => { if (confirm('Kayıt silinecek. Emin misiniz?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
          />
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-100 rounded-[4.5rem] flex flex-col items-center justify-center text-center p-24 opacity-40">
             <div className="w-32 h-32 bg-slate-50 rounded-[3.5rem] flex items-center justify-center mb-10 shadow-inner">
                <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.8em] text-[12px]">Liyakat Dosyası Bekleniyor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
