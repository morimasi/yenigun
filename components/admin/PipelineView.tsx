
import React, { useState, useMemo } from 'react';
import { Candidate, Branch } from '../../types';
import CandidateDetail from './CandidateDetail';
import StatusBadge from './StatusBadge';

interface PipelineViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    branch: 'All',
    status: 'All'
  });

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesBranch = filters.branch === 'All' || c.branch === filters.branch;
      const matchesStatus = filters.status === 'All' || c.status === filters.status;
      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [candidates, filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)]">
      {/* Sol Panel: Liste */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-[500px]">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Aday ara..." 
              className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-100 transition-all pl-12"
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex gap-2">
            <select 
              className="flex-1 bg-slate-50 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest outline-none border-none"
              value={filters.branch}
              onChange={e => setFilters({...filters, branch: e.target.value})}
            >
              <option value="All">Branşlar</option>
              {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select 
              className="flex-1 bg-slate-50 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest outline-none border-none"
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
            >
              <option value="All">Durumlar</option>
              <option value="pending">Bekleyen</option>
              <option value="interview_scheduled">Mülakat</option>
              <option value="rejected">Red</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {filteredCandidates.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(c.id)}
              className={`p-6 rounded-[2.2rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                selectedId === c.id 
                ? 'bg-white border-orange-600 shadow-2xl scale-[1.02]' 
                : 'bg-white border-slate-50 hover:border-orange-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="max-w-[180px]">
                  <h4 className="font-black text-slate-900 text-base leading-tight group-hover:text-orange-600 transition-colors truncate">{c.name}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.branch}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              
              <div className="flex items-center gap-2">
                {c.report ? (
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-black rounded-lg border border-orange-100">SKOR: %{c.report.score}</span>
                ) : (
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black rounded-lg animate-pulse">ANALİZ BEKLİYOR</span>
                )}
                {c.algoReport && c.algoReport.riskFlags.length > 0 && (
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                )}
              </div>
            </div>
          ))}
          {filteredCandidates.length === 0 && (
            <div className="py-20 text-center text-slate-300 font-black uppercase text-xs tracking-[0.3em]">Sonuç Yok</div>
          )}
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
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Masa Boş</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
