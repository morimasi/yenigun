
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, ArchiveCategory } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
// Removed non-existent export verifyCandidateIntegrity from the import below
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { exportService } from '../../services/exportService';
import { PredictBar } from '../../shared/ui/PredictBar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
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
  }, [candidate.report]);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return segments.map(s => ({ subject: s.label, value: da[s.key]?.score || 0 }));
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

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  // Derive flattened questions list from phases
  const strategicQuestions = candidate.report?.interviewGuidance?.phases?.flatMap(p => p.questions.map(q => q.text)) || [];

  return (
    <div className="flex flex-col h-full bg-white relative text-xs">
      
      {/* 1. ULTRA-COMPACT HEADER (48px Fixed) */}
      <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-2 h-2 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`} title={candidate.status}></div>
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
               <div className="mr-3 text-right hidden md:block">
                  <span className="text-[11px] font-black text-emerald-600 block leading-none">%{candidate.report.score}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">SKOR</span>
               </div>
            )}
            <div className="flex bg-slate-100 p-0.5 rounded-md">
               <button onClick={() => handleDecision('hired')} className="px-2 py-1 text-[9px] font-black uppercase rounded-sm text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all">ATA</button>
               <button onClick={() => handleDecision('rejected')} className="px-2 py-1 text-[9px] font-black uppercase rounded-sm text-slate-600 hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all">RED</button>
            </div>
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className="ml-2 px-3 py-1 bg-slate-900 text-white rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-sm"
            >
               {isAnalysing ? '...' : 'ANALİZ'}
            </button>
         </div>
      </div>

      {/* 2. STATIC TABS (Dense) */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
         {[
           { id: 'matrix', label: 'MATRİS' }, 
           { id: 'dna', label: 'MİZAÇ' }, 
           { id: 'predictions', label: 'GELECEK' }, 
           { id: 'strategy', label: 'STRATEJİ' }
         ].map(t => (
            <button 
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`text-[9px] font-bold uppercase tracking-widest py-1 px-3 rounded transition-all ${activeTab === t.id ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
               {t.label}
            </button>
         ))}
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC]">
         {!candidate.report ? (
            <div className="h-full flex items-center justify-center opacity-30 text-xs font-black uppercase tracking-widest text-slate-400">Veri Bekleniyor</div>
         ) : (
            <div className="space-y-4 max-w-5xl mx-auto">
               
               {/* --- MATRİS (DERİN OKUMA) --- */}
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start h-full">
                     {/* Sol: Kategoriler */}
                     <div className="md:col-span-3 space-y-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                        {segments.map(s => {
                           const score = candidate.report?.deepAnalysis?.[s.key]?.score || 0;
                           const status = candidate.report?.deepAnalysis?.[s.key]?.status || 'neutral';
                           let statusColor = 'text-slate-400';
                           if(score > 75) statusColor = 'text-emerald-500';
                           else if(score < 50) statusColor = 'text-rose-500';
                           
                           return (
                             <button 
                                key={s.key} 
                                onClick={() => setSelectedSegment(s.key)}
                                className={`w-full p-3 rounded-lg border text-left transition-all group relative ${selectedSegment === s.key ? 'bg-slate-900 border-slate-900 shadow-md' : 'bg-white border-slate-200 hover:border-orange-300'}`}
                             >
                                <div className="flex justify-between items-center">
                                   <div>
                                      <span className={`text-[10px] font-bold uppercase tracking-tight block ${selectedSegment === s.key ? 'text-white' : 'text-slate-700'}`}>{s.label}</span>
                                      <span className={`text-[8px] font-semibold uppercase ${selectedSegment === s.key ? 'text-slate-400' : statusColor}`}>{status}</span>
                                   </div>
                                   <span className={`text-sm font-black ${selectedSegment === s.key ? 'text-orange-500' : 'text-slate-900'}`}>%{score}</span>
                                </div>
                             </button>
                           );
                        })}
                     </div>
                     
                     {/* Sağ: Detaylı Analiz Paneli */}
                     <div className="md:col-span-9 space-y-4">
                        {currentData && (
                           <div className="space-y-4 animate-fade-in">
                              
                              {/* Ana Gerekçe */}
                              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
                                 <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] mb-2">KLİNİK NEDENSELLİK</h4>
                                 <p className="text-[11px] font-medium text-slate-700 leading-relaxed text-justify relative z-10">
                                    "{currentData.reasoning}"
                                 </p>
                              </div>

                              {/* Etki Analizi */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">KURUMSAL ETKİ</h5>
                                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                                       {currentData.institutionalImpact}
                                    </p>
                                 </div>
                                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <h5 className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-2">MİKRO-DAVRANIŞLAR</h5>
                                    <ul className="space-y-1">
                                       {currentData.behavioralIndicators.map((b: string, i: number) => (
                                          <li key={i} className="flex gap-2 items-start">
                                             <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                                             <span className="text-[10px] font-medium text-slate-700 leading-tight">{b}</span>
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>

                              {/* Riskler ve Fırsatlar */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="p-4 border border-emerald-100 bg-white rounded-xl">
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mb-2">AVANTAJLAR</span>
                                    <ul className="space-y-1">
                                       {currentData.pros.map((p: string, i: number) => (
                                          <li key={i} className="text-[10px] font-medium text-slate-600 flex gap-2"><span className="text-emerald-500 font-bold">+</span> {p}</li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div className="p-4 border border-rose-100 bg-white rounded-xl">
                                    <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest block mb-2">RİSKLER</span>
                                    <ul className="space-y-1">
                                       {currentData.risks.map((r: string, i: number) => (
                                          <li key={i} className="text-[10px] font-medium text-slate-600 flex gap-2"><span className="text-rose-500 font-bold">!</span> {r}</li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* --- SPEKTRUM (GRAFİK & MİZAÇ) --- */}
               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                     <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 w-full text-left">YETKİNLİK RADARI</h4>
                        <div className="w-full h-full min-h-[250px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={radarData} outerRadius="70%">
                                 <PolarGrid stroke="#e2e8f0" />
                                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 700, fill: '#64748b' }} />
                                 <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.25} strokeWidth={2} />
                                 <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', padding: '4px' }} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="lg:col-span-7 space-y-4">
                        <div className="bg-slate-900 p-6 rounded-xl text-white shadow-lg">
                           <div className="flex justify-between items-end mb-4">
                              <div>
                                 <p className="text-3xl font-black">%{candidate.report.integrityIndex}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">DÜRÜSTLÜK ENDEKSİ</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-3xl font-black text-orange-500">%{candidate.report.socialMaskingScore}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">SOSYAL MASKELEME</p>
                              </div>
                           </div>
                           <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-orange-500" style={{ width: `${candidate.report.integrityIndex}%` }}></div>
                           </div>
                           <p className="mt-4 text-[10px] font-medium text-slate-300 leading-relaxed italic opacity-80">
                              * Dürüstlük Endeksi, CV ile mülakat yanıtları arasındaki tutarlılığı ölçer.
                           </p>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                           <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-3">KARAKTER ANALİZİ (ÖZET)</h4>
                           <p className="text-[11px] font-medium text-slate-600 leading-relaxed text-justify">
                              {candidate.report.detailedAnalysisNarrative}
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- PROJEKSİYON (GELECEK) --- */}
               {activeTab === 'predictions' && (
                  <div className="space-y-4 animate-fade-in">
                     <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                           <h4 className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] mb-3">24 AYLIK EVRİM YOLU</h4>
                           <p className="text-sm font-bold leading-relaxed italic tracking-tight text-justify">"{candidate.report.predictiveMetrics?.evolutionPath || 'Analiz Ediliyor...'}"</p>
                        </div>
                        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-600/10 rounded-full blur-[40px]"></div>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <PredictBar 
                           label="SADAKAT" 
                           value={candidate.report.predictiveMetrics?.retentionProbability || 0} 
                           color="text-emerald-600" 
                           description="1 yıl"
                        />
                        <PredictBar 
                           label="ÖĞRENME" 
                           value={candidate.report.predictiveMetrics?.learningVelocity || 0} 
                           color="text-blue-600" 
                           description="Adaptasyon"
                        />
                        <PredictBar 
                           label="DİRENÇ" 
                           value={100 - (candidate.report.predictiveMetrics?.burnoutRisk || 0)} 
                           color="text-rose-600" 
                           description="Stres"
                        />
                        <PredictBar 
                           label="LİDERLİK" 
                           value={candidate.report.predictiveMetrics?.leadershipPotential || 0} 
                           color="text-orange-600" 
                           description="Potansiyel"
                        />
                     </div>

                     <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex items-start gap-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-orange-600 shadow-sm shrink-0 font-black text-lg">!</div>
                        <div>
                           <h5 className="text-[9px] font-black text-orange-800 uppercase tracking-widest mb-1">YÖNETİCİ ÖZETİ & TAVSİYE</h5>
                           <p className="text-[11px] font-bold text-orange-900 leading-relaxed">
                              {candidate.report.recommendation}
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- STRATEJİ (SORU HAVUZU) --- */}
               {activeTab === 'strategy' && (
                  <div className="space-y-4 animate-fade-in">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 border-l-2 border-orange-600 pl-3">STRATEJİK SORGULAMA KILAVUZU</h4>
                        <div className="space-y-3">
                           {strategicQuestions.map((q, i) => (
                              <div key={i} className="flex gap-4 items-start group p-2 hover:bg-slate-50 rounded">
                                 <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-[9px] font-black shrink-0 shadow-sm">{i+1}</span>
                                 <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-slate-800 italic leading-snug">"{q}"</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase group-hover:text-orange-600 transition-colors">
                                       * {i < 5 ? 'Zayıf yön testi' : 'Güçlü yön onayı'}
                                    </p>
                                 </div>
                              </div>
                           ))}
                           {(!strategicQuestions || strategicQuestions.length === 0) && (
                             <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Soru seti oluşturulamadı.</div>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                           <h4 className="text-[9px] font-black text-rose-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                              KRİTİK GÖZLEM NOKTALARI
                           </h4>
                           <div className="space-y-2">
                              {candidate.report.interviewGuidance?.criticalObservations?.map((obs, i) => (
                                 <div key={i} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-rose-50 shadow-sm">
                                    <span className="text-rose-500 font-black text-[10px]">!</span>
                                    <p className="text-[10px] font-bold text-slate-700 leading-tight uppercase">{obs}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                           <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">SİMÜLASYON GÖREVLERİ</h4>
                           <div className="space-y-2">
                              {candidate.report.interviewGuidance?.simulationTasks?.map((task, i) => (
                                 <div key={i} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                    <span className="text-slate-900 font-black text-[10px]">►</span>
                                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{task}</p>
                                 </div>
                              ))}
                           </div>
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
