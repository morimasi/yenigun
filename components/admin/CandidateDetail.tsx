
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, ArchiveCategory } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { exportService } from '../../services/exportService';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'matrix' | 'interview'>('overview');
  
  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e) {
      alert("Analiz hatası.");
    } finally { 
      setIsAnalysing(false); 
    }
  };

  const handleDecision = async (status: 'hired' | 'rejected') => {
    if (!confirm(status === 'hired' ? "Adayı kadroya ata?" : "Adayı reddet?")) return;
    onUpdate({
        ...candidate,
        status: 'archived',
        archiveCategory: status === 'hired' ? 'HIRED_CONTRACTED' : 'DISQUALIFIED',
        archiveNote: `Hızlı Karar: ${status.toUpperCase()}`,
        timestamp: Date.now()
    });
  };

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if(!da) return [];
    return [
        { s: 'ETİK', v: da.workEthics?.score },
        { s: 'KLİNİK', v: da.technicalExpertise?.score },
        { s: 'PEDAGOJİ', v: da.pedagogicalAnalysis?.score },
        { s: 'DİRENÇ', v: da.sustainability?.score },
        { s: 'SADAKAT', v: da.institutionalLoyalty?.score },
    ];
  }, [candidate.report]);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800">
      
      {/* 1. COMPACT HEADER (64px Height Fixed) */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-5 bg-slate-50/50 shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-md flex items-center justify-center text-white font-black text-sm">
               {candidate.name.charAt(0)}
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{candidate.name}</h2>
                  <span className="px-2 py-0.5 bg-slate-200 rounded text-[9px] font-bold text-slate-600 uppercase">{candidate.branch}</span>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                  <span>{candidate.experienceYears} Yıl Deneyim</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{candidate.university}</span>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-4">
            {candidate.report && (
               <div className="flex flex-col items-end mr-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LİYAKAT</span>
                  <span className={`text-lg font-black leading-none ${candidate.report.score > 70 ? 'text-emerald-600' : 'text-orange-600'}`}>%{candidate.report.score}</span>
               </div>
            )}
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
               {!candidate.report ? (
                  <button onClick={handleRunAnalysis} disabled={isAnalysing} className="px-4 py-1.5 bg-slate-900 text-white rounded text-[10px] font-black uppercase hover:bg-orange-600 transition-colors">
                     {isAnalysing ? '...' : 'ANALİZ BAŞLAT'}
                  </button>
               ) : (
                  <>
                     <button onClick={() => handleDecision('rejected')} className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded text-[10px] font-black uppercase">RED</button>
                     <div className="w-px bg-slate-200 mx-1"></div>
                     <button onClick={() => handleDecision('hired')} className="px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded text-[10px] font-black uppercase">KABUL</button>
                  </>
               )}
            </div>
         </div>
      </div>

      {/* 2. DENSE CONTENT GRID */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
         
         {/* LEFT COLUMN: METRICS & RADAR (Fixed Width) */}
         <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/30 flex flex-col overflow-y-auto custom-scrollbar">
            
            {/* RADAR CHART (Compact) */}
            <div className="h-60 w-full border-b border-slate-200 relative bg-white p-4">
               {candidate.report ? (
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="s" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                        <Radar dataKey="v" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} />
                        <Tooltip contentStyle={{ fontSize: '10px', padding: '5px', borderRadius: '4px' }} />
                     </RadarChart>
                  </ResponsiveContainer>
               ) : (
                  <div className="h-full flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">Veri Yok</div>
               )}
            </div>

            {/* KEY METRICS LIST */}
            <div className="flex-1 p-4 space-y-4">
               <div>
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">TEMEL GÖSTERGELER</h4>
                  <div className="space-y-2">
                     {[
                        { l: 'Dürüstlük Endeksi', v: candidate.report?.integrityIndex, c: 'bg-blue-500' },
                        { l: 'Sosyal Maskeleme', v: candidate.report?.socialMaskingScore, c: 'bg-rose-500' },
                        { l: 'Liderlik Potansiyeli', v: candidate.report?.predictiveMetrics?.leadershipPotential, c: 'bg-orange-500' },
                        { l: 'Tükenmişlik Riski', v: candidate.report?.predictiveMetrics?.burnoutRisk, c: 'bg-slate-500' }
                     ].map((m, i) => (
                        <div key={i} className="flex flex-col gap-1">
                           <div className="flex justify-between text-[10px] font-bold text-slate-600">
                              <span>{m.l}</span>
                              <span>%{m.v || 0}</span>
                           </div>
                           <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full ${m.c}`} style={{ width: `${m.v || 0}%` }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div>
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-t border-slate-200 pt-4">SWOT ÖZETİ</h4>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                        <span className="text-[8px] font-black text-emerald-600 block mb-1">GÜÇLÜ</span>
                        <ul className="list-disc list-inside">
                           {candidate.report?.swot.strengths.slice(0, 2).map((s,i) => <li key={i} className="text-[9px] text-emerald-800 truncate">{s}</li>)}
                        </ul>
                     </div>
                     <div className="p-2 bg-rose-50 rounded border border-rose-100">
                        <span className="text-[8px] font-black text-rose-600 block mb-1">RİSK</span>
                        <ul className="list-disc list-inside">
                           {candidate.report?.swot.weaknesses.slice(0, 2).map((s,i) => <li key={i} className="text-[9px] text-rose-800 truncate">{s}</li>)}
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: TABS & DETAILS (Scrollable) */}
         <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* COMPACT TABS */}
            <div className="flex border-b border-slate-200 px-4 gap-4 bg-slate-50/50 shrink-0 h-10 items-end">
               {['overview', 'matrix', 'interview'].map(t => (
                  <button 
                     key={t}
                     onClick={() => setActiveTab(t as any)}
                     className={`pb-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === t ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                     {t === 'overview' ? 'YÖNETİCİ ÖZETİ' : t === 'matrix' ? 'DETAYLI ANALİZ' : 'MÜLAKAT SORULARI'}
                  </button>
               ))}
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
               {!candidate.report ? (
                  <div className="h-full flex items-center justify-center opacity-20">
                     <p className="text-4xl font-black text-slate-300 uppercase tracking-[0.2em]">Veri Yok</p>
                  </div>
               ) : (
                  <>
                     {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in">
                           <div>
                              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">KLİNİK KARAR RAPORU</h4>
                              <p className="text-[12px] leading-relaxed text-slate-600 font-medium text-justify columns-1 md:columns-2 gap-6">
                                 {candidate.report.detailedAnalysisNarrative}
                              </p>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                 <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">KARİYER PROJEKSİYONU</span>
                                 <p className="text-[11px] font-bold text-slate-700 leading-snug">"{candidate.report.predictiveMetrics.evolutionPath}"</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                 <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">ÖNERİLEN AKSİYON</span>
                                 <p className="text-[11px] font-bold text-slate-700 leading-snug">"{candidate.report.recommendation}"</p>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'matrix' && (
                        <div className="grid grid-cols-1 gap-1 animate-fade-in">
                           <div className="grid grid-cols-12 border-b border-slate-100 pb-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              <div className="col-span-3">PARAMETRE</div>
                              <div className="col-span-2 text-center">SKOR</div>
                              <div className="col-span-7">KLİNİK NEDENSELLİK (REASONING)</div>
                           </div>
                           {Object.entries(candidate.report.deepAnalysis).map(([k, v]: any) => (
                              <div key={k} className="grid grid-cols-12 items-start py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                 <div className="col-span-3 pr-2">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase block">{k.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className={`text-[8px] font-black uppercase ${v.score > 70 ? 'text-emerald-500' : 'text-orange-500'}`}>{v.status}</span>
                                 </div>
                                 <div className="col-span-2 px-2 flex items-center">
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                       <div className="h-full bg-slate-900" style={{ width: `${v.score}%` }}></div>
                                    </div>
                                    <span className="ml-2 text-[10px] font-black text-slate-900">%{v.score}</span>
                                 </div>
                                 <div className="col-span-7 pl-2">
                                    <p className="text-[10px] text-slate-500 leading-tight">{v.reasoning}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {activeTab === 'interview' && (
                        <div className="space-y-4 animate-fade-in">
                           <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">STRATEJİK SORU HAVUZU</h4>
                           <div className="grid grid-cols-1 gap-3">
                              {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                                 <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-orange-200 transition-colors">
                                    <span className="w-5 h-5 bg-white text-orange-600 rounded flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-100 shadow-sm">{i+1}</span>
                                    <p className="text-[11px] font-bold text-slate-700 italic">"{q}"</p>
                                 </div>
                              ))}
                           </div>
                           
                           <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 pt-4">GÖZLEM NOKTALARI</h4>
                           <div className="flex flex-wrap gap-2">
                              {candidate.report.interviewGuidance.criticalObservations.map((obs, i) => (
                                 <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[9px] font-bold uppercase">
                                    ! {obs}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
