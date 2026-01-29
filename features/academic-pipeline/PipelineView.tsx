
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import CandidateDetail from './CandidateDetail';
import { exportService } from '../../services/exportService';

interface PipelineViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({ candidates, config, onUpdateCandidate, onDeleteCandidate, onRefresh }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      (c.name || '').toLocaleLowerCase('tr-TR').includes(searchInput.toLocaleLowerCase('tr-TR'))
    );
  }, [candidates, searchInput]);

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  return (
    <div className="flex flex-col w-full relative h-full">
      {/* COMPACT TOOLBAR */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
             <input 
                type="text" 
                placeholder="Aday veritabanında sorgula..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-10 py-2 text-[13px] font-medium outline-none focus:ring-2 focus:ring-orange-500/10 focus:bg-white transition-all"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{filteredCandidates.length} DOSYA</span>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={() => exportService.exportCandidatesToCSV(filteredCandidates)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4 4m4 4V4" /></svg>
           </button>
           <button onClick={onRefresh} className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
           </button>
        </div>
      </div>

      {/* DENSE LIST HEADERS */}
      <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
        <div className="col-span-1">Seç</div>
        <div className="col-span-4">İsim & Akademik Branş</div>
        <div className="col-span-2">Kurum / Üniversite</div>
        <div className="col-span-1 text-center">Deneyim</div>
        <div className="col-span-2 text-center">Liyakat Skoru</div>
        <div className="col-span-2 text-right">Durum</div>
      </div>

      {/* MICRO-LIST ROWS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredCandidates.map(c => (
          <div 
            key={c.id} 
            onClick={() => setSelectedId(c.id)}
            className={`grid grid-cols-12 items-center px-4 py-3 border-b border-slate-50 hover:bg-slate-50/80 transition-all cursor-pointer group ${selectedId === c.id ? 'bg-orange-50/30' : ''}`}
          >
            <div className="col-span-1">
              <div 
                onClick={(e) => toggleCheck(c.id, e)}
                className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${checkedIds.has(c.id) ? 'bg-orange-600 border-orange-600' : 'border-slate-300 group-hover:border-slate-400'}`}
              >
                {checkedIds.has(c.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
              </div>
            </div>
            <div className="col-span-4 flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0">
                  {c.name.charAt(0)}
               </div>
               <div className="min-w-0">
                  <p className="text-[13px] font-black text-slate-900 truncate leading-none mb-1 uppercase">{c.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase truncate tracking-tight">{c.branch}</p>
               </div>
            </div>
            <div className="col-span-2">
               <p className="text-[11px] font-medium text-slate-500 truncate uppercase">{c.university || 'Belirtilmedi'}</p>
            </div>
            <div className="col-span-1 text-center text-[12px] font-black text-slate-600">{c.experienceYears}Y</div>
            <div className="col-span-2 flex justify-center">
               {c.report ? (
                 <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${c.report.score > 75 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : c.report.score > 40 ? 'bg-orange-500' : 'bg-rose-500'}`}></div>
                    <span className="text-[13px] font-black text-slate-900">%{c.report.score}</span>
                 </div>
               ) : <span className="text-[10px] font-bold text-slate-300 uppercase italic">Bekliyor</span>}
            </div>
            <div className="col-span-2 text-right">
               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${
                 c.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                 c.status === 'interview_scheduled' ? 'bg-emerald-50 text-emerald-600' :
                 c.status === 'archived' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
               }`}>
                 {c.status.replace('_', ' ')}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE DRAWER (DETAIL) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[110] pointer-events-none">
           <div 
             className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] pointer-events-auto animate-fade-in"
             onClick={() => setSelectedId(null)}
           ></div>
           <div className="absolute top-0 right-0 h-full w-full max-w-2xl bg-white shadow-[-40px_0_80px_rgba(0,0,0,0.1)] pointer-events-auto animate-slide-right flex flex-col border-l border-slate-100">
              <CandidateDetail 
                candidate={selectedCandidate}
                config={config}
                onUpdate={onUpdateCandidate}
                onDelete={() => { if(confirm('Silsin mi?')){ onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
                onClose={() => setSelectedId(null)}
              />
           </div>
        </div>
      )}
    </div>
  );
};

export default PipelineView;
