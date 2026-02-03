
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
    { key: 'developmentOpenness', label: 'TEKNO-ADAPTASYON' }, // Yeni
    { key: 'institutionalLoyalty', label: 'KURUMSAL UYUM' },
    { key: 'sustainability', label: 'DAYANIKLILIK' },
    { key: 'teamLeadership', label: 'TAKIM & MENTORLUK' } // Yeni
  ], []);

  useEffect(() => {
    if (candidate.report?.deepAnalysis && !selectedSegment) {
      setSelectedSegment('workEthics');
    }
  }, [candidate.report, selectedSegment]);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    // Algoritmadaki normalize edilmiş isimlerle UI segmentlerini eşleştir
    return segments.map(s => {
       let score = da[s.key]?.score;
       // Fallback for team/leadership mapping
       if (!score && s.key === 'teamLeadership') score = da['leadership']?.score || da['team_player']?.score;
       return { subject: s.label, value: score || 0 };
    });
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

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;
  const strategicQuestions = candidate.report?.interviewGuidance?.phases?.flatMap(p => p.questions.map(q => q.text)) || [];

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
            <div className={`w-2.5 h-2.5 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
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
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-xs font-black uppercase tracking-widest text-slate-400 space-y-4">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               <span>Dosya Analizi Gerekiyor</span>
            </div>
         ) : (
            <div className="space-y-4 max-w-5xl mx-auto">
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                     <div className="md:col-span-4 space-y-1">
                        {segments.map(s => {
                           let score = candidate.report?.deepAnalysis?.[s.key]?.score;
                           if (!score && s.key === 'teamLeadership') score = candidate.report?.deepAnalysis?.['leadership']?.score || candidate.report?.deepAnalysis?.['team_player']?.score;
                           
                           return (
                             <button 
                                key={s.key} 
                                onClick={() => setSelectedSegment(s.key)} 
                                className={`w-full p-3 rounded-xl border text-left transition-all flex justify-between items-center ${selectedSegment === s.key ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 hover:border-orange-300'}`}
                             >
                                <span className="text-[10px] font-black uppercase tracking-tight">{s.label}</span>
                                <span className={`text-xs font-black ${selectedSegment === s.key ? 'text-orange-500' : 'text-slate-900'}`}>%{score || 0}</span>
                             </button>
                           );
                        })}
                     </div>
                     <div className="md:col-span-8 space-y-4">
                        {currentData && (
                           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                 <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Klinik Gerekçe & Veri Kanıtı</h4>
                              </div>
                              <p className="text-[12px] font-medium text-slate-600 leading-relaxed italic text-justify">
                                 "{currentData.reasoning}"
                              </p>
                              <div className="mt-6 grid grid-cols-2 gap-4">
                                 <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <h5 className="text-[9px] font-black text-emerald-700 uppercase mb-2">KLİNİK AVANTAJLAR</h5>
                                    <ul className="space-y-1">
                                       {currentData.pros.slice(0,3).map((p,i) => <li key={i} className="text-[10px] text-emerald-800 flex gap-2"><span>•</span> {p}</li>)}
                                    </ul>
                                 </div>
                                 <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                    <h5 className="text-[9px] font-black text-rose-700 uppercase mb-2">KRİTİK RİSKLER</h5>
                                    <ul className="space-y-1">
                                       {currentData.risks.slice(0,3).map((r,i) => <li key={i} className="text-[10px] text-rose-800 flex gap-2"><span>•</span> {r}</li>)}
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
                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">360 Derece Yetkinlik Radarı</h5>
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={radarData} outerRadius="75%">
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.15} strokeWidth={3} />
                              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '10px' }} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl">
                           <div className="flex justify-between items-end mb-6">
                              <div>
                                 <p className="text-4xl font-black">%{candidate.report.integrityIndex}</p>
                                 <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">DÜRÜSTLÜK ENDEKSİ</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-4xl font-black">%{candidate.report.socialMaskingScore}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SOSYAL MASKELEME</p>
                              </div>
                           </div>
                           <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-orange-500" style={{ width: `${candidate.report.integrityIndex}%` }}></div>
                           </div>
                        </div>
                        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Karakter ve Uyumluluk Analizi</h4>
                           <p className="text-[12px] font-medium text-slate-600 leading-relaxed text-justify italic">"{candidate.report.detailedAnalysisNarrative}"</p>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'predictions' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                     <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-600" />
                     <PredictBar label="ADAPTASYON" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-600" />
                     <PredictBar label="STRES DİRENCİ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-600" />
                     <PredictBar label="LİDERLİK" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-orange-600" />
                  </div>
               )}

               {activeTab === 'strategy' && (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
                     <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black">S</div>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Stratejik Mülakat Protokolü</h4>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                        {strategicQuestions.slice(0, 8).map((q, i) => (
                           <div key={i} className="flex gap-5 items-start p-4 bg-slate-50 rounded-xl border border-transparent hover:border-orange-200 transition-all group">
                              <span className="w-8 h-8 bg-white text-slate-900 rounded-lg flex items-center justify-center text-xs font-black shrink-0 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">{i+1}</span>
                              <p className="text-[13px] font-bold text-slate-700 italic leading-snug pt-1">"{q}"</p>
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
