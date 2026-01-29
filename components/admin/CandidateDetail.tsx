
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
    <div className="flex flex-col min-h-full">
      {/* HEADER: COMPACT PROFILE */}
      <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white text-2xl font-black">
               {candidate.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{candidate.name}</h2>
               <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wide">{candidate.branch}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{candidate.experienceYears} YIL DENEYİM</span>
               </div>
            </div>
         </div>
         <div className="flex gap-2">
            {!candidate.report ? (
               <button onClick={handleRunAnalysis} disabled={isAnalysing} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
                  {isAnalysing ? 'ANALİZ...' : 'AI ANALİZ'}
               </button>
            ) : (
               <div className="text-right">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">SKOR</span>
                  <span className={`text-2xl font-black ${candidate.report.score > 70 ? 'text-emerald-600' : 'text-orange-600'}`}>%{candidate.report.score}</span>
               </div>
            )}
         </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6 shrink-0">
         {['overview', 'matrix', 'interview'].map(t => (
            <button 
               key={t}
               onClick={() => setActiveTab(t as any)}
               className={`py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === t ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
               {t === 'overview' ? 'GENEL BAKIŞ' : t === 'matrix' ? 'DETAYLI MATRİS' : 'MÜLAKAT REHBERİ'}
            </button>
         ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 bg-white p-6 overflow-y-auto custom-scrollbar">
         {!candidate.report ? (
            <div className="py-20 text-center opacity-40">
               <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Veri seti bekleniyor. Analizi başlatın.</p>
            </div>
         ) : (
            <div className="space-y-8">
               {activeTab === 'overview' && (
                  <>
                     <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">YÖNETİCİ ÖZETİ</h4>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed text-justify">
                           {candidate.report.detailedAnalysisNarrative}
                        </p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-xl">
                           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-2">GÜÇLÜ YÖNLER</span>
                           <ul className="list-disc list-inside space-y-1">
                              {candidate.report.swot.strengths.slice(0,3).map((s,i) => <li key={i} className="text-[10px] font-bold text-slate-600 uppercase">{s}</li>)}
                           </ul>
                        </div>
                        <div className="p-4 border border-rose-100 bg-rose-50/50 rounded-xl">
                           <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest block mb-2">RİSKLER</span>
                           <ul className="list-disc list-inside space-y-1">
                              {candidate.report.swot.weaknesses.slice(0,3).map((s,i) => <li key={i} className="text-[10px] font-bold text-slate-600 uppercase">{s}</li>)}
                           </ul>
                        </div>
                     </div>
                  </>
               )}

               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 gap-6">
                     <div className="h-64 w-full border border-slate-100 rounded-xl bg-slate-50 relative">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={radarData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="s" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                              <Radar dataKey="v" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} />
                              <Tooltip />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-4">
                        {Object.entries(candidate.report.deepAnalysis).map(([k, v]: any) => (
                           <div key={k} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider w-1/3">{k.replace(/([A-Z])/g, ' $1')}</span>
                              <div className="flex-1 mx-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-slate-900" style={{ width: `${v.score}%` }}></div>
                              </div>
                              <span className="text-xs font-black text-slate-900 w-8 text-right">%{v.score}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'interview' && (
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">STRATEJİK SORU SETİ</h4>
                     {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                           <div className="w-6 h-6 bg-slate-100 text-slate-500 rounded flex items-center justify-center font-black text-[10px] shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">{i+1}</div>
                           <p className="text-xs font-bold text-slate-700 leading-snug italic">"{q}"</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>

      {/* ACTION FOOTER */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-3 shrink-0">
         <button onClick={() => handleDecision('rejected')} className="py-3 border border-slate-200 bg-white text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors">REDDET</button>
         <button onClick={() => handleDecision('hired')} className="py-3 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">İŞE AL</button>
      </div>
    </div>
  );
};

export default CandidateDetail;
