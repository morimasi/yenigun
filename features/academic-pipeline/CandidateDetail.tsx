
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, ArchiveCategory } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis, verifyCandidateIntegrity } from '../../analysisUtils';
import { exportService } from '../../services/exportService';
import { PredictBar } from '../../shared/ui/PredictBar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
  const segments = useMemo(() => [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'technicalExpertise', label: 'KLİNİK' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'parentStudentRelations', label: 'VELİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' }
  ], []);

  useEffect(() => {
    if (candidate.report?.deepAnalysis && !selectedSegment) {
      setSelectedSegment('workEthics');
    }
  }, [candidate.report]);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return segments.map(s => ({ subject: s.label, value: da[s.key]?.score || 0 }));
  }, [candidate, segments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e: any) { alert("Analiz Hatası."); } 
    finally { setIsAnalysing(false); }
  };

  const handleDecision = async (decision: 'hired' | 'rejected') => {
    if (!confirm(decision === 'hired' ? "Personel olarak atanacak?" : "Arşive kaldırılacak?")) return;
    await onUpdate({
      ...candidate,
      status: 'archived',
      archiveCategory: decision === 'hired' ? 'HIRED_CONTRACTED' : 'DISQUALIFIED',
      archiveNote: `Hızlı Karar: ${decision.toUpperCase()}`,
      timestamp: Date.now()
    });
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* 1. ULTRA-COMPACT HEADER (60px Fixed) */}
      <div className="h-[60px] border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4 overflow-hidden">
            {/* Durum Dot */}
            <div className={`w-2.5 h-2.5 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`} title={candidate.status}></div>
            
            {/* Ref Code */}
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
               REF: {candidate.id.toUpperCase().substring(0,8)}
            </span>

            {/* İsim */}
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight whitespace-nowrap">{candidate.name}</h2>

            <div className="w-px h-4 bg-slate-200 mx-1"></div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">
               <span className="text-orange-700">{candidate.branch}</span>
               <span>•</span>
               <span>{candidate.experienceYears} Yıl</span>
            </div>
         </div>

         <div className="flex items-center gap-2 shrink-0">
            {candidate.report && (
               <div className="mr-3 text-right hidden md:block">
                  <span className="text-[10px] font-black text-emerald-600 block leading-none">%{candidate.report.score}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">SKOR</span>
               </div>
            )}
            
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
               <button onClick={() => handleDecision('hired')} className="px-3 py-1.5 text-[9px] font-black uppercase rounded-md text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all">ATA</button>
               <button onClick={() => handleDecision('rejected')} className="px-3 py-1.5 text-[9px] font-black uppercase rounded-md text-slate-600 hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all">RED</button>
            </div>

            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className="ml-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-sm"
            >
               {isAnalysing ? '...' : 'ANALİZ'}
            </button>
         </div>
      </div>

      {/* 2. STATIC TABS (NO STICKY) */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
         {[
           { id: 'matrix', label: 'MATRİS' }, 
           { id: 'dna', label: 'SPEKTRUM' }, 
           { id: 'predictions', label: 'PROJEKSİYON' }, 
           { id: 'strategy', label: 'STRATEJİ' }
         ].map(t => (
            <button 
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded transition-all ${activeTab === t.id ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
               {t.label}
            </button>
         ))}
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
         {!candidate.report ? (
            <div className="h-full flex items-center justify-center opacity-30 text-xs font-black uppercase tracking-widest text-slate-400">Veri Bekleniyor</div>
         ) : (
            <div className="space-y-8 max-w-5xl mx-auto">
               
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                     {/* Sol Menu: Kategoriler */}
                     <div className="md:col-span-4 space-y-1">
                        {segments.map(s => (
                           <button 
                              key={s.key} 
                              onClick={() => setSelectedSegment(s.key)}
                              className={`w-full p-3 rounded-lg border text-left flex justify-between items-center transition-all ${selectedSegment === s.key ? 'bg-slate-800 border-slate-800 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300'}`}
                           >
                              <span className="text-[10px] font-black uppercase tracking-tight">{s.label}</span>
                              <span className={`text-[11px] font-bold ${selectedSegment === s.key ? 'text-orange-400' : 'text-slate-900'}`}>%{candidate.report?.deepAnalysis?.[s.key]?.score}</span>
                           </button>
                        ))}
                     </div>
                     {/* Sağ Detay */}
                     <div className="md:col-span-8">
                        {currentData && (
                           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                              <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4 border-b border-orange-100 pb-2">KLİNİK MUHAKEME</h4>
                              <p className="text-[12px] font-bold text-slate-700 leading-relaxed text-justify mb-6">"{currentData.reasoning}"</p>
                              
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="p-4 bg-slate-50 rounded-lg">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">Somut Kanıtlar</span>
                                    <ul className="space-y-1">
                                       {currentData.behavioralIndicators.slice(0,3).map((b: string, i: number) => (
                                          <li key={i} className="text-[10px] text-slate-600 leading-tight">• {b}</li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div className="p-4 bg-slate-50 rounded-lg">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">Kurumsal Etki</span>
                                    <p className="text-[10px] text-slate-600 leading-tight italic">{currentData.institutionalImpact}</p>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={radarData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={2} />
                              <Tooltip contentStyle={{ fontSize: '10px' }} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-4">
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">DÜRÜSTLÜK ENDEKSİ</span>
                           <div className="flex items-end gap-2">
                              <span className="text-4xl font-black text-slate-900">%{candidate.report.integrityIndex}</span>
                              <div className="h-2 flex-1 bg-slate-100 rounded-full mb-1.5"><div className="h-full bg-slate-900" style={{width: `${candidate.report.integrityIndex}%`}}></div></div>
                           </div>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">SOSYAL MASKELEME</span>
                           <div className="flex items-end gap-2">
                              <span className="text-4xl font-black text-slate-900">%{candidate.report.socialMaskingScore}</span>
                              <div className="h-2 flex-1 bg-slate-100 rounded-full mb-1.5"><div className="h-full bg-orange-500" style={{width: `${candidate.report.socialMaskingScore}%`}}></div></div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'predictions' && (
                  <div className="space-y-6">
                     <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg">
                        <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">24 AY PROJEKSİYONU</h4>
                        <p className="text-sm font-bold leading-relaxed italic">"{candidate.report.predictiveMetrics.evolutionPath}"</p>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-600" />
                        <PredictBar label="ÖĞRENME HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-600" />
                        <PredictBar label="TÜKENMİŞLİK DİRENCİ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-600" />
                        <PredictBar label="LİDERLİK" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-orange-600" />
                     </div>
                  </div>
               )}

               {activeTab === 'strategy' && (
                  <div className="space-y-6">
                     <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">STRATEJİK SORU SETİ</h4>
                        <ul className="space-y-4">
                           {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                              <li key={i} className="flex gap-4 items-start">
                                 <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{i+1}</span>
                                 <p className="text-[11px] font-bold text-slate-700 italic">"{q}"</p>
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className="p-6 bg-rose-50 rounded-xl border border-rose-100">
                        <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-4">KRİTİK GÖZLEM NOKTALARI</h4>
                        <div className="flex flex-wrap gap-2">
                           {candidate.report.interviewGuidance.criticalObservations.map((obs, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-rose-100 rounded text-[10px] font-bold text-rose-600 uppercase shadow-sm">! {obs}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

            </div>
         )}
      </div>
    </div>
  );
};

export default CandidateDetail;
