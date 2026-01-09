
import React, { useState, useMemo } from 'react';
import { Candidate, Branch } from '../../types';
import CandidateReport from '../CandidateReport';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';

interface PipelineViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'ai' | 'algo' | 'hybrid'>('hybrid');
  const [search, setSearch] = useState('');

  const selectedCandidate = candidates.find(c => c.id === selectedId);
  const filtered = candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleRunAnalysis = async () => {
    if (!selectedCandidate) return;
    setIsAnalysing(true);
    const algoReport = calculateAlgorithmicAnalysis(selectedCandidate);
    try {
      const report = await generateCandidateAnalysis(selectedCandidate);
      onUpdateCandidate({ ...selectedCandidate, report, algoReport });
    } catch (e) {
      onUpdateCandidate({ ...selectedCandidate, algoReport });
    }
    setIsAnalysing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <input 
            type="text" placeholder="Aday Ara..." 
            className="w-full bg-slate-50 rounded-2xl p-5 text-sm font-bold outline-none border-none"
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(c.id)}
              className={`p-7 rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                selectedId === c.id ? 'bg-white border-orange-600 shadow-2xl' : 'bg-white border-slate-50'
              }`}
            >
              <h4 className="font-black text-slate-900">{c.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.branch}</p>
              {c.report && <span className="inline-block mt-3 px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-black rounded-lg">ANALİZ HAZIR</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8">
        {selectedCandidate ? (
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 min-h-[80vh] flex flex-col overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h3>
                <button 
                  onClick={handleRunAnalysis}
                  className="px-10 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all"
                >Motoru Çalıştır</button>
             </div>
             <div className="p-10 flex-1 overflow-y-auto">
                {isAnalysing ? <div className="animate-pulse py-20 text-center font-black">ANALİZ YÜRÜTÜLÜYOR...</div> : 
                <CandidateReport 
                  report={selectedCandidate.report} 
                  algoReport={selectedCandidate.algoReport} 
                  name={selectedCandidate.name}
                  viewMode={analysisMode}
                />}
             </div>
          </div>
        ) : (
          <div className="h-[80vh] border-4 border-dashed border-slate-100 rounded-[4rem] flex items-center justify-center text-slate-300 font-black uppercase tracking-[0.5em]">Aday Seçiniz</div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
