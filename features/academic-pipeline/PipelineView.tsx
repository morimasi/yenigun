
import React, { useState, useMemo } from 'react';
import { Candidate, Branch, GlobalConfig } from '../../types';
import CandidateDetail from './CandidateDetail';

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
  
  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR');
      return name.includes(searchInput.toLocaleLowerCase('tr-TR'));
    });
  }, [candidates, searchInput]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[85vh] w-full relative items-stretch">
      
      {/* SOL: KOMPAKT ADAY LİSTESİ */}
      <div className="lg:w-[260px] shrink-0 no-print flex flex-col gap-4">
        <div className="bg-slate-50/80 p-3 rounded-[2rem] border border-slate-100 shadow-inner">
           <input 
              type="text" 
              placeholder="Hızlı Bul..." 
              className="w-full bg-white rounded-xl p-3 text-[11px] font-bold outline-none border border-slate-100 focus:border-orange-500 transition-all shadow-sm"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1 custom-scrollbar space-y-2">
           {filteredCandidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                className={`p-3 rounded-[1.5rem] border transition-all cursor-pointer group ${
                  selectedId === c.id 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' 
                  : 'bg-white border-slate-50 hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-black text-[10px] ${
                    selectedId === c.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {c.report ? c.report.score : '?'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-[10px] truncate uppercase leading-none">{c.name}</h4>
                    <p className="text-[7px] font-bold opacity-60 uppercase mt-1 truncate">{c.branch.split(' ')[0]}</p>
                  </div>
                </div>
              </div>
           ))}
        </div>
      </div>

      {/* SAĞ: PANORAMİK DETAYLI ANALİZ KANVASI */}
      <div className="flex-1 min-w-0 w-full flex flex-col">
        {selectedCandidate ? (
          <div className="animate-scale-in flex-1 flex flex-col">
            <CandidateDetail 
              candidate={selectedCandidate}
              config={config}
              onUpdate={onUpdateCandidate}
              onDelete={() => { if (confirm('Aday sistemden silinsin mi?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-[600px] bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center opacity-30 text-center p-12">
             <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-xl">
                <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-[12px]">BİR ADAY DOSYASI SEÇEREK ANALİZE BAŞLAYIN</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
