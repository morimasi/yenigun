import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, Branch } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ExportStudio from '../../components/shared/ExportStudio';
import CandidateReport from '../../components/CandidateReport';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isExportStudioOpen, setIsExportStudioOpen] = useState(false);
  
  const segments = useMemo(() => [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'technicalExpertise', label: 'KLİNİK BİLGİ' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'developmentOpenness', label: 'GELİŞİM' }
  ], []);

  useEffect(() => {
    if (candidate.report?.deepAnalysis && !selectedSegment) {
      setSelectedSegment('workEthics');
    }
  }, [candidate.report, selectedSegment]);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return segments.map(s => ({ 
      subject: s.label, 
      value: (da as any)?.[s.key]?.score || 0 
    }));
  }, [candidate, segments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
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

  const handleExportClick = () => {
    if (!candidate.report) return alert("Dosya analiz edilmeden yayınlanamaz.");
    setIsExportStudioOpen(true);
  };

  const currentData = selectedSegment ? (candidate.report?.deepAnalysis as any)?.[selectedSegment] : null;
  const strategicQuestions = candidate.report?.interviewGuidance?.phases?.flatMap(p => p.questions?.map(q => q.text) || []) || [];

  return (
    <div className="flex flex-col h-full bg-white relative text-xs">
      {isExportStudioOpen && candidate.report && (
        <ExportStudio 
          onClose={() => setIsExportStudioOpen(false)}
          data={{
            type: 'CANDIDATE_REPORT',
            entityName: candidate.name,
            referenceId: candidate.id.toUpperCase(),
            payload: candidate
          }}
        >
          <CandidateReport candidate={candidate} report={candidate.report} />
        </ExportStudio>
      )}

      {/* HEADER */}
      <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-2 h-2 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">REF: {candidate.id.toUpperCase().substring(0,8)}</span>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight whitespace-nowrap">{candidate.name}</h2>
            <div className="w-px h-3 bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">
               <span className="text-orange-700">{candidate.branch}</span>
               <span>•</span>
               <span>{candidate.experienceYears} Yıl</span>
            </div>
         </div>

         <div className="flex items-center gap-2 shrink-0">
            {candidate.report && (
               <button onClick={handleExportClick} className="px-3 py-1 border border-slate-900 text-slate-900 rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all mr-2">YAYINLA</button>
            )}
            <div className="flex bg-slate-100 p-0.5 rounded-md">
               <button onClick={() => handleDecision('hired')} className="px-2 py-1 text-[9px] font-black uppercase rounded-sm text-slate-600 hover:bg-white hover:text-emerald-600">ATA</button>
               <button onClick={() => handleDecision('rejected')} className="px-2 py-1 text-[9px] font-black uppercase rounded-sm text-slate-600 hover:bg-white hover:text-rose-600">RED</button>
            </div>
            <button onClick={handleRunAnalysis} disabled={isAnalysing} className="ml-2 px-3 py-1 bg-slate-900 text-white rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
               {isAnalysing ? '...' : 'ANALİZ'}
            </button>
         </div>
      </div>

      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
         {['matrix', 'dna', 'predictions', 'strategy'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`text-[9px] font-bold uppercase tracking-widest py-1 px-3 rounded transition-all ${activeTab === t ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>
               {t.toUpperCase()}
            </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC]">
         {!candidate.report ? (
            <div className="h-full flex items-center justify-center opacity-30 text-xs font-black uppercase tracking-widest text-slate-400">Veri Bekleniyor</div>
         ) : (
            <div className="space-y-4 max-w-5xl mx-auto">
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                     <div className="md:col-span-3 space-y-1">
                        {segments.map(s => (
                           <button key={s.key} onClick={() => setSelectedSegment(s.key)} className={`w-full p-3 rounded-lg border text-left transition-all ${selectedSegment === s.key ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 hover:border-orange-300'}`}>
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold uppercase">{s.label}</span>
                                 <span className={`text-sm font-black ${selectedSegment === s.key ? 'text-orange-500' : 'text-slate-900'}`}>%{ (candidate.report?.deepAnalysis as any)?.[s.key]?.score || 0 }</span>
                              </div>
                           </button>
                        ))}
                     </div>
                     <div className="md:col-span-9 space-y-4">
                        {currentData && (
                           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">KLİNİK GEREKÇE</h4>
                              <p className="text-[11px] font-medium text-slate-700 leading-relaxed italic">"{currentData.reasoning || "Analiz verisi bulunamadı."}"</p>
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                 <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <h5 className="text-[8px] font-black text-emerald-700 uppercase mb-1">PROS</h5>
                                    <ul className="text-[9px] text-emerald-800 list-disc pl-3">
                                       {(currentData.pros || []).map((p:string,i:number) => <li key={i}>{p}</li>)}
                                    </ul>
                                 </div>
                                 <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                                    <h5 className="text-[8px] font-black text-rose-700 uppercase mb-1">RISKS</h5>
                                    <ul className="text-[9px] text-rose-800 list-disc pl-3">
                                       {(currentData.risks || []).map((r:string,i:number) => <li key={i}>{r}</li>)}
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={radarData} outerRadius="70%">
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 700, fill: '#64748b' }} />
                              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.25} strokeWidth={2} />
                              <Tooltip />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-slate-900 p-6 rounded-xl text-white">
                           <div className="flex justify-between items-end mb-4">
                              <div>
                                 <p className="text-3xl font-black">%{candidate.report?.integrityIndex || 0}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DÜRÜSTLÜK ENDEKSİ</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-3xl font-black text-orange-500">%{candidate.report?.socialMaskingScore || 0}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SOSYAL MASKELEME</p>
                              </div>
                           </div>
                           <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-600" style={{ width: `${candidate.report?.integrityIndex || 0}%` }}></div>
                           </div>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                           <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-3">KARAKTER ANALİZİ</h4>
                           <p className="text-[11px] font-medium text-slate-600 leading-relaxed text-justify">{candidate.report?.detailedAnalysisNarrative || "Analiz sentezleniyor..."}</p>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'predictions' && candidate.report?.predictiveMetrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-600" />
                     <PredictBar label="ÖĞRENME" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-600" />
                     <PredictBar label="DİRENÇ" value={100 - (candidate.report.predictiveMetrics.burnoutRisk || 0)} color="text-rose-600" />
                     <PredictBar label="LİDERLİK" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-orange-600" />
                  </div>
               )}

               {activeTab === 'strategy' && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md space-y-4">
                     <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 border-l-2 border-orange-600 pl-3">STRATEJİK SORGULAMA KILAVUZU</h4>
                     <div className="space-y-3">
                        {(strategicQuestions || []).map((q, i) => (
                           <div key={i} className="flex gap-4 items-start p-2 hover:bg-slate-50 rounded">
                              <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-[9px] font-black shrink-0">{i+1}</span>
                              <p className="text-[11px] font-bold text-slate-800 italic leading-snug">"{q}"</p>
                           </div>
                        ))}
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