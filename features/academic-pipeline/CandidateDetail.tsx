
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, Branch } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedMatrixId, setSelectedMatrixId] = useState<string>('technicalExpertise');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: candidate.name,
    branch: candidate.branch,
    experienceYears: candidate.experienceYears,
    university: candidate.university,
    department: candidate.department
  });

  const matrixSegments = useMemo(() => [
    { id: 'technicalExpertise', label: 'KLİNİK DERİNLİK', icon: '🧠', group: 'KLİNİK' },
    { id: 'pedagogicalAnalysis', label: 'PEDAGOJİK ÇEVİKLİK', icon: '🏃', group: 'KLİNİK' },
    { id: 'crisisResilience', label: 'KRİZ DİRENCİ', icon: '🔥', group: 'KLİNİK' },
    { id: 'parentStudentRelations', label: 'VELİ DİPLOMASİSİ', icon: '🤝', group: 'KLİNİK' },
    { id: 'workEthics', label: 'ETİK & SINIRLAR', icon: '⚖️', group: 'ETİK' },
    { id: 'metacognitiveAwareness', label: 'ÖZ-DENETİM', icon: '🔍', group: 'ETİK' },
    { id: 'developmentOpenness', label: 'BİLİŞSEL ADAPTASYON', icon: '🚀', group: 'KURUMSAL' },
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
    } catch (e: any) { alert("Nöral Analiz Hatası."); } 
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in h-full">
            <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar lg:h-[calc(100vh-20rem)]">
                {['KLİNİK', 'ETİK', 'KURUMSAL'].map(groupName => (
                    <div key={groupName} className="space-y-1 mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">{groupName} BOYUTU</span>
                        {matrixSegments.filter(s => s.group === groupName).map(s => (
                           <button key={s.id} onClick={() => setSelectedMatrixId(s.id)} className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${selectedMatrixId === s.id ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300 text-slate-600'}`}>
                              <div className="flex items-center gap-3">
                                 <span className="text-xl">{s.icon}</span>
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMatrixId === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                              </div>
                              <span className={`text-sm font-black ${selectedMatrixId === s.id ? 'text-orange-500' : 'text-slate-900'}`}>{da?.[s.id] ? `%${da[s.id].score}` : '-'}</span>
                           </button>
                        ))}
                    </div>
                ))}
            </div>
            <div className="lg:col-span-8 space-y-6 lg:overflow-y-auto custom-scrollbar lg:h-[calc(100vh-20rem)]">
                {!data ? (
                    <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Bu boyut için nöral sentez henüz tamamlanmadı.</p>
                    </div>
                ) : (
                    <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusColor(data.status)}`}></div>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-2">KLİNİK OTOPSİ RAPORU</h4>
                                <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{matrixSegments.find(s => s.id === selectedMatrixId)?.label}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest ${getStatusColor(data.status)}`}>{data.status}</span>
                        </div>
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                                <p className="text-lg font-bold text-slate-800 leading-relaxed italic">"{data.reasoning}"</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100">
                                   <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-4">DAVRANIŞSAL GÖSTERGELER</span>
                                   <ul className="space-y-2">
                                      {Array.isArray(data.behavioralIndicators) ? data.behavioralIndicators.map((item: string, i: number) => (
                                          <li key={i} className="text-[11px] font-bold text-blue-900 leading-tight flex gap-2"><span>•</span> {item}</li>
                                      )) : <li className="text-[10px] text-slate-400">Veri yok.</li>}
                                   </ul>
                                </div>
                                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100">
                                   <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-4">POZİTİF KANITLAR</span>
                                   <ul className="space-y-2">
                                      {Array.isArray(data.pros) ? data.pros.map((item: string, i: number) => (
                                          <li key={i} className="text-[11px] font-bold text-emerald-900 leading-tight flex gap-2"><span>+</span> {item}</li>
                                      )) : <li className="text-[10px] text-slate-400">Veri yok.</li>}
                                   </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative">
      <div className="bg-white border-b border-slate-200 flex items-center justify-between px-8 h-20 shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-6">
            <div className={`w-4 h-4 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse`}></div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{candidate.name}</h2>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">{candidate.branch}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
               {['matrix', 'dna', 'predictions', 'strategy'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400'}`}>
                   {tab === 'predictions' ? 'GELECEK' : tab === 'strategy' ? 'SORULAR' : tab === 'matrix' ? 'MATRİS' : 'MİZAÇ'}
                 </button>
               ))}
            </div>
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className="px-10 py-3 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] hover:bg-orange-600 transition-all"
            >
               {isAnalysing ? '...' : 'ANALİZ ET'}
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
               <div className="w-32 h-32 bg-slate-100 rounded-[4rem] flex items-center justify-center mb-10 border-4 border-dashed border-slate-200">
                  <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.5em]">Liyakat Bekleniyor</h3>
            </div>
         ) : (
            <div className="max-w-6xl mx-auto">
               {activeTab === 'matrix' && renderMatrix()}
               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-scale-in">
                     <div className="lg:col-span-5 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={400}>
                           <RadarChart data={radarData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={4} />
                              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                           <div className="flex justify-between items-end mb-8 relative z-10">
                              <div><p className="text-6xl font-black">%{candidate.report.integrityIndex}</p><p className="text-[11px] font-black text-orange-500 uppercase tracking-widest mt-4">Dürüstlük Endeksi</p></div>
                              <div className="text-right"><p className="text-6xl font-black">%{candidate.report.socialMaskingScore}</p><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-4">Sosyal Maskeleme</p></div>
                           </div>
                           <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 relative z-10"><div className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500" style={{ width: `${candidate.report.integrityIndex}%` }}></div></div>
                        </div>
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm"><p className="text-xl font-bold text-slate-700 leading-relaxed italic">"{candidate.report.detailedAnalysisNarrative}"</p></div>
                     </div>
                  </div>
               )}
               {activeTab === 'predictions' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <PredictBar label="SADAKAT" value={candidate.report?.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" />
                        <PredictBar label="ÖĞRENME" value={candidate.report?.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" />
                        <PredictBar label="DİRENÇ" value={100 - (candidate.report?.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" />
                        <PredictBar label="LİDERLİK" value={candidate.report?.predictiveMetrics?.leadershipPotential || 0} color="text-orange-600" />
                    </div>
                  </div>
               )}
               {activeTab === 'strategy' && (
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-md space-y-6">
                     {Array.isArray(candidate.report?.interviewGuidance?.strategicQuestions) ? candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                        <div key={i} className="flex gap-8 items-start p-8 hover:bg-slate-50 rounded-[2.5rem] transition-all border-b border-slate-50 last:border-0">
                           <div className="w-14 h-14 bg-slate-950 text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl shrink-0 shadow-lg">{i + 1}</div>
                           <p className="text-xl font-bold text-slate-800 leading-tight italic">"{q}"</p>
                        </div>
                     )) : <p className="text-center text-slate-400">Soru seti bulunamadı.</p>}
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};

export default CandidateDetail;
