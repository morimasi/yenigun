
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, Branch, GlobalConfig } from '../types';
import CandidateReport from './CandidateReport';
import { generateCandidateAnalysis } from '../geminiService';
import { calculateAlgorithmicAnalysis } from '../analysisUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

interface DashboardProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, config, onUpdateCandidate, onUpdateConfig, onDeleteCandidate }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'calendar' | 'analytics' | 'settings'>('pipeline');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [filter, setFilter] = useState({ search: '', branch: 'All', status: 'All' });
  const [analysisMode, setAnalysisMode] = useState<'ai' | 'algo' | 'hybrid'>('hybrid');

  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedId), [candidates, selectedId]);

  const handleManualAnalysis = async () => {
    if (!selectedCandidate) return;

    setIsAnalysing(true);
    
    const algoReport = calculateAlgorithmicAnalysis(selectedCandidate);
    
    let aiReport = selectedCandidate.report;
    try {
      if (typeof window.aistudio !== 'undefined' && await window.aistudio.hasSelectedApiKey()) {
        aiReport = await generateCandidateAnalysis(selectedCandidate);
      }
    } catch (e) {
      console.warn("AI Analizi başarısız, sadece algoritmik veriler kullanılacak.");
    }

    onUpdateCandidate({ ...selectedCandidate, report: aiReport, algoReport });
    setIsAnalysing(false);
  };

  const filteredList = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(filter.search.toLowerCase());
      const matchesBranch = filter.branch === 'All' || c.branch === filter.branch;
      const matchesStatus = filter.status === 'All' || c.status === filter.status;
      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [candidates, filter]);

  return (
    <div className="flex flex-col xl:flex-row gap-10 animate-fade-in pb-20 max-w-[1600px] mx-auto">
      <aside className="xl:w-80 space-y-6">
        <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-3 opacity-80">Yeni Gün Akademi AI</h2>
            <p className="text-3xl font-black tracking-tighter leading-none">{config.institutionName}</p>
            <p className="text-[9px] mt-4 font-bold text-slate-500 tracking-widest uppercase">Powered by Gemini 3 Flash</p>
          </div>
        </div>

        <nav className="p-3 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-sm space-y-2">
          {['pipeline', 'calendar', 'analytics', 'settings'].map(tabId => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId as any)}
              className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[2.2rem] transition-all duration-500 font-black text-[11px] uppercase tracking-widest group ${
                activeTab === tabId ? 'bg-orange-600 text-white shadow-2xl translate-x-3' : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span>{tabId.toUpperCase()}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-4">
                  <input 
                    type="text" 
                    placeholder="Aday Ara..." 
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-600/10"
                    onChange={e => setFilter({...filter, search: e.target.value})}
                  />
               </div>
               
               <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredList.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedId(c.id)}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer ${selectedId === c.id ? 'bg-white border-orange-600 shadow-xl' : 'bg-white border-slate-50'}`}
                    >
                      <h4 className="font-black text-slate-900">{c.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.branch}</p>
                      {(c.report || c.algoReport) && (
                        <div className="mt-4 flex gap-2">
                           {c.report && <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-black rounded-lg">FLASH: %{c.report.score}</span>}
                           {c.algoReport && <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg">ALGO: %{c.algoReport.overallScore}</span>}
                        </div>
                      )}
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-8">
              {selectedCandidate ? (
                <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[80vh] flex flex-col">
                   <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h3>
                        <div className="flex gap-4 mt-2">
                           <button 
                            onClick={() => setAnalysisMode('ai')}
                            className={`text-[9px] font-black px-4 py-1.5 rounded-full transition-all ${analysisMode === 'ai' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                           >FLASH AI GÖRÜNÜMÜ</button>
                           <button 
                            onClick={() => setAnalysisMode('algo')}
                            className={`text-[9px] font-black px-4 py-1.5 rounded-full transition-all ${analysisMode === 'algo' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}
                           >ALGORİTMİK GÖRÜNÜM</button>
                           <button 
                            onClick={() => setAnalysisMode('hybrid')}
                            className={`text-[9px] font-black px-4 py-1.5 rounded-full transition-all ${analysisMode === 'hybrid' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                           >HİBRİT KARŞILAŞTIRMA</button>
                        </div>
                      </div>
                      <button 
                        onClick={handleManualAnalysis}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl"
                      >
                        Gemini 3 Flash İle Analiz
                      </button>
                   </div>
                   
                   <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                      {isAnalysing ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6">
                           <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                           <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Gemini 3 Flash Multimodal Analiz Yürütülüyor...</p>
                        </div>
                      ) : (
                        <CandidateReport 
                          report={selectedCandidate.report} 
                          algoReport={selectedCandidate.algoReport} 
                          name={selectedCandidate.name}
                          viewMode={analysisMode}
                        />
                      )}
                   </div>
                </div>
              ) : (
                <div className="h-full border-4 border-dashed border-slate-100 rounded-[4rem] flex items-center justify-center">
                   <p className="text-slate-300 font-black uppercase tracking-[0.4em]">Aday Seçiniz</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
