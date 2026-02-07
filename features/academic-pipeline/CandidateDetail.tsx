
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedMatrixId, setSelectedMatrixId] = useState<string>('technicalExpertise');

  const matrixSegments = useMemo(() => [
    { id: 'technicalExpertise', label: 'KLİNİK DERİNLİK', icon: '🧠', group: 'KLİNİK' },
    { id: 'pedagogicalAnalysis', label: 'PEDAGOJİK ÇEVİKLİK', icon: '🏃', group: 'KLİNİK' },
    { id: 'crisisResilience', label: 'KRİZ DİRENCİ', icon: '🔥', group: 'KLİNİK' },
    { id: 'workEthics', label: 'ETİK & SINIRLAR', icon: '⚖️', group: 'ETİK' },
    { id: 'institutionalLoyalty', label: 'SADAKAT & UYUM', icon: '🏛️', group: 'KURUMSAL' },
    { id: 'sustainability', label: 'TÜKENMİŞLİK EŞİĞİ', icon: '🔋', group: 'KURUMSAL' }
  ], []);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return matrixSegments.map(s => ({ subject: s.label, value: (da as any)?.[s.id]?.score || 0 }));
  }, [candidate.report, matrixSegments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e: any) { alert("Nöral Analiz Hatası: Bağlantı koptu."); } 
    finally { setIsAnalysing(false); }
  };

  const renderMatrix = () => {
    const da = candidate.report?.deepAnalysis;
    const data = (da as any)?.[selectedMatrixId];
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'OPTIMAL': return 'bg-emerald-500';
            case 'EXCEPTIONAL': return 'bg-blue-600';
            case 'RISK': return 'bg-rose-600';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-in h-full">
            <div className="lg:col-span-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar pr-2 h-full min-h-[400px]">
                {matrixSegments.map(s => (
                   <button key={s.id} onClick={() => setSelectedMatrixId(s.id)} className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${selectedMatrixId === s.id ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300 text-slate-600'}`}>
                      <div className="flex items-center gap-3">
                         <span className="text-xl">{s.icon}</span>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMatrixId === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                      </div>
                      <span className={`text-sm font-black ${selectedMatrixId === s.id ? 'text-orange-500' : 'text-slate-900'}`}>{da?.[s.id] ? `%${da[s.id].score}` : '-'}</span>
                   </button>
                ))}
            </div>
            <div className="lg:col-span-8">
                {!data ? (
                    <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Veri bekleniyor...</p>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden h-full">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusColor(data.status)}`}></div>
                        <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">{selectedMatrixId} ANALİZİ</h4>
                        <p className="text-lg font-bold text-slate-800 leading-relaxed italic mb-8">"{data.reasoning}"</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                               <span className="text-[9px] font-black text-blue-400 uppercase block mb-3">DAVRANIŞSAL İZLER</span>
                               <ul className="space-y-1.5">
                                  {Array.isArray(data.behavioralIndicators) ? data.behavioralIndicators.map((item: string, i: number) => (
                                      <li key={i} className="text-[10px] font-bold text-blue-900 leading-tight flex gap-2"><span>•</span> {item}</li>
                                  )) : <li className="text-[10px] text-slate-400 italic">Veri sağlanmadı.</li>}
                               </ul>
                            </div>
                            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                               <span className="text-[9px] font-black text-emerald-400 uppercase block mb-3">GÜÇLÜ KANITLAR</span>
                               <ul className="space-y-1.5">
                                  {Array.isArray(data.pros) ? data.pros.map((item: string, i: number) => (
                                      <li key={i} className="text-[10px] font-bold text-emerald-900 leading-tight flex gap-2"><span>+</span> {item}</li>
                                  )) : <li className="text-[10px] text-slate-400 italic">Veri sağlanmadı.</li>}
                               </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white border-b border-slate-200 flex items-center justify-between px-6 h-16 shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{candidate.name}</h2>
            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase">{candidate.branch}</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
               {['matrix', 'dna', 'predictions', 'strategy'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400'}`}>
                   {tab === 'matrix' ? 'MATRİS' : tab === 'dna' ? 'MİZAÇ' : tab === 'predictions' ? 'GELECEK' : 'SORULAR'}
                 </button>
               ))}
            </div>
            <button onClick={handleRunAnalysis} disabled={isAnalysing} className="px-6 py-2 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 transition-all">
               {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZ ET'}
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-slate-200">
                  <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.4em]">Analiz Bekleniyor</h3>
            </div>
         ) : (
            <div className="max-w-6xl mx-auto space-y-6">
               {activeTab === 'matrix' && renderMatrix()}
               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-scale-in">
                     <div className="lg:col-span-5 bg-white p-8 rounded-[3.5rem] border border-slate-200 flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={300}>
                           <RadarChart data={radarData}>
                              <PolarGrid stroke="#f1f5f9" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} />
                              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={3} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="lg:col-span-7 space-y-4">
                        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                           <div className="flex justify-between items-end mb-6 relative z-10">
                              <div><p className="text-5xl font-black">%{candidate.report.integrityIndex}</p><p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-2">Dürüstlük Endeksi</p></div>
                              <div className="text-right"><p className="text-5xl font-black text-slate-500">%{candidate.report.socialMaskingScore}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Sosyal Maskeleme</p></div>
                           </div>
                           <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10"><div className="h-full bg-orange-600" style={{ width: `${candidate.report.integrityIndex}%` }}></div></div>
                        </div>
                        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                           <p className="text-lg font-bold text-slate-700 leading-relaxed italic">"{candidate.report.detailedAnalysisNarrative}"</p>
                        </div>
                     </div>
                  </div>
               )}
               {activeTab === 'strategy' && (
                  <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 space-y-4">
                     {Array.isArray(candidate.report?.interviewGuidance?.strategicQuestions) ? candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                        <div key={i} className="flex gap-6 items-start p-6 hover:bg-slate-50 rounded-3xl transition-all border border-slate-50">
                           <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm shrink-0">{i + 1}</div>
                           <p className="text-lg font-bold text-slate-800 leading-snug italic">"{q}"</p>
                        </div>
                     )) : <p className="text-center text-slate-400 py-20 font-black">Sorgu seti oluşturulamadı.</p>}
                  </div>
               )}
               {activeTab === 'predictions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <PredictBar label="SADAKAT" value={candidate.report?.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" />
                     <PredictBar label="ÖĞRENME" value={candidate.report?.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" />
                     <PredictBar label="DİRENÇ" value={100 - (candidate.report?.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" />
                     <PredictBar label="LİDERLİK" value={candidate.report?.predictiveMetrics?.leadershipPotential || 0} color="text-orange-600" />
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};

export default CandidateDetail;
