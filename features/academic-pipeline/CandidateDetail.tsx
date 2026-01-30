
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
    { key: 'technicalExpertise', label: 'KLİNİK BİLGİ' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'developmentOpenness', label: 'GELİŞİME AÇIKLIK' }
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
            <div className={`w-2.5 h-2.5 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`} title={candidate.status}></div>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">REF: {candidate.id.toUpperCase().substring(0,8)}</span>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight whitespace-nowrap">{candidate.name}</h2>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
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

      {/* 2. STATIC TABS */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
         {[
           { id: 'matrix', label: 'MATRİS (DERİN OKUMA)' }, 
           { id: 'dna', label: 'SPEKTRUM & MİZAÇ' }, 
           { id: 'predictions', label: 'PROJEKSİYON (GELECEK)' }, 
           { id: 'strategy', label: 'STRATEJİK SORGULAMA' }
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
            <div className="space-y-8 max-w-6xl mx-auto">
               
               {/* --- MATRİS (DERİN OKUMA) --- */}
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start h-full">
                     {/* Sol: Kategoriler */}
                     <div className="md:col-span-3 space-y-1 overflow-y-auto max-h-[600px] custom-scrollbar">
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
                                className={`w-full p-4 rounded-xl border text-left transition-all group relative ${selectedSegment === s.key ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-orange-300'}`}
                             >
                                <div className="flex justify-between items-start">
                                   <div>
                                      <span className={`text-[10px] font-black uppercase tracking-tight block ${selectedSegment === s.key ? 'text-white' : 'text-slate-700'}`}>{s.label}</span>
                                      <span className={`text-[9px] font-bold uppercase mt-1 ${selectedSegment === s.key ? 'text-slate-400' : statusColor}`}>{status}</span>
                                   </div>
                                   <span className={`text-xl font-black ${selectedSegment === s.key ? 'text-orange-500' : 'text-slate-900'}`}>%{score}</span>
                                </div>
                                {selectedSegment === s.key && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-l-full"></div>}
                             </button>
                           );
                        })}
                     </div>
                     
                     {/* Sağ: Detaylı Analiz Paneli */}
                     <div className="md:col-span-9 space-y-6">
                        {currentData && (
                           <div className="space-y-6 animate-fade-in">
                              
                              {/* Ana Gerekçe */}
                              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-2 h-full bg-slate-900"></div>
                                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4">KLİNİK NEDENSELLİK (ROOT CAUSE)</h4>
                                 <p className="text-[13px] font-medium text-slate-700 leading-relaxed text-justify relative z-10">
                                    "{currentData.reasoning}"
                                 </p>
                                 <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                 </div>
                              </div>

                              {/* Etki Analizi */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">KURUMSAL ETKİ ANALİZİ</h5>
                                    <p className="text-[12px] font-bold text-slate-600 leading-relaxed">
                                       {currentData.institutionalImpact}
                                    </p>
                                 </div>
                                 <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                                    <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">TESPİT EDİLEN MİKRO-DAVRANIŞLAR</h5>
                                    <ul className="space-y-2">
                                       {currentData.behavioralIndicators.map((b: string, i: number) => (
                                          <li key={i} className="flex gap-3 items-start">
                                             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                                             <span className="text-[11px] font-bold text-slate-700 leading-tight">{b}</span>
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>

                              {/* Riskler ve Fırsatlar */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="p-6 border border-emerald-100 bg-white rounded-2xl">
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-3">AVANTAJLAR (PROS)</span>
                                    <ul className="space-y-2">
                                       {currentData.pros.map((p: string, i: number) => (
                                          <li key={i} className="text-[11px] font-medium text-slate-600 flex gap-2"><span className="text-emerald-500 font-black">+</span> {p}</li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div className="p-6 border border-rose-100 bg-white rounded-2xl">
                                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest block mb-3">RİSKLER (CONS)</span>
                                    <ul className="space-y-2">
                                       {currentData.risks.map((r: string, i: number) => (
                                          <li key={i} className="text-[11px] font-medium text-slate-600 flex gap-2"><span className="text-rose-500 font-black">!</span> {r}</li>
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
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 w-full text-left">YETKİNLİK RADARI</h4>
                        <div className="w-full h-full min-h-[300px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={radarData} outerRadius="80%">
                                 <PolarGrid stroke="#e2e8f0" />
                                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                                 <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.25} strokeWidth={3} />
                                 <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                           <div className="flex justify-between items-end mb-6">
                              <div>
                                 <p className="text-5xl font-black">%{candidate.report.integrityIndex}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">DÜRÜSTLÜK ENDEKSİ</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-5xl font-black text-orange-500">%{candidate.report.socialMaskingScore}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">SOSYAL MASKELEME</p>
                              </div>
                           </div>
                           <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-orange-500" style={{ width: `${candidate.report.integrityIndex}%` }}></div>
                           </div>
                           <p className="mt-6 text-[11px] font-bold text-slate-300 leading-relaxed italic opacity-80">
                              * Dürüstlük Endeksi, adayın CV'si ile mülakat yanıtları arasındaki tutarlılığı ölçer. %70 altı 'Şüpheli Beyan' anlamına gelir.
                           </p>
                        </div>
                        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                           <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">KARAKTER ANALİZİ (ÖZET)</h4>
                           <p className="text-[13px] font-medium text-slate-600 leading-relaxed text-justify">
                              {candidate.report.detailedAnalysisNarrative}
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- PROJEKSİYON (GELECEK) --- */}
               {activeTab === 'predictions' && (
                  <div className="space-y-8 animate-fade-in">
                     <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                           <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">24 AYLIK EVRİM YOLU</h4>
                           <p className="text-xl md:text-2xl font-black leading-snug italic tracking-tight">"{candidate.report.predictiveMetrics?.evolutionPath || 'Analiz Verisi Bekleniyor...'}"</p>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]"></div>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <PredictBar 
                           label="SADAKAT İHTİMALİ" 
                           value={candidate.report.predictiveMetrics?.retentionProbability || 0} 
                           color="text-emerald-600" 
                           description="1 yıl içinde istifa riski."
                        />
                        <PredictBar 
                           label="ÖĞRENME HIZI" 
                           value={candidate.report.predictiveMetrics?.learningVelocity || 0} 
                           color="text-blue-600" 
                           description="Yeni metot adaptasyonu."
                        />
                        <PredictBar 
                           label="TÜKENMİŞLİK DİRENCİ" 
                           value={100 - (candidate.report.predictiveMetrics?.burnoutRisk || 0)} 
                           color="text-rose-600" 
                           description="Stres altında dayanıklılık."
                        />
                        <PredictBar 
                           label="LİDERLİK POTANSİYELİ" 
                           value={candidate.report.predictiveMetrics?.leadershipPotential || 0} 
                           color="text-orange-600" 
                           description="Ekip yönetimi yetkinliği."
                        />
                     </div>

                     <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 flex items-start gap-6">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm shrink-0 font-black text-2xl">!</div>
                        <div>
                           <h5 className="text-[11px] font-black text-orange-800 uppercase tracking-widest mb-2">YÖNETİCİ ÖZETİ & TAVSİYE</h5>
                           <p className="text-[13px] font-bold text-orange-900 leading-relaxed">
                              {candidate.report.recommendation}
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- STRATEJİ (SORU HAVUZU) --- */}
               {activeTab === 'strategy' && (
                  <div className="space-y-8 animate-fade-in">
                     <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-orange-600 pl-4">STRATEJİK SORGULAMA KILAVUZU</h4>
                        <div className="space-y-6">
                           {candidate.report.interviewGuidance?.strategicQuestions?.map((q, i) => (
                              <div key={i} className="flex gap-6 items-start group">
                                 <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 shadow-lg group-hover:bg-orange-600 transition-colors">{i+1}</span>
                                 <div className="space-y-2">
                                    <p className="text-[14px] font-bold text-slate-800 italic leading-snug">"{q}"</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-orange-600 transition-colors">
                                       * Bu soru, adayın {i < 5 ? 'zayıf olduğu' : 'güçlü olduğu'} alandaki yetkinliğini {i < 5 ? 'sınamak' : 'onaylamak'} için tasarlanmıştır.
                                    </p>
                                 </div>
                              </div>
                           ))}
                           {(!candidate.report.interviewGuidance?.strategicQuestions || candidate.report.interviewGuidance.strategicQuestions.length === 0) && (
                             <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Soru seti oluşturulamadı veya analiz eksik.</div>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100">
                           <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                              KRİTİK GÖZLEM NOKTALARI
                           </h4>
                           <div className="space-y-3">
                              {candidate.report.interviewGuidance?.criticalObservations?.map((obs, i) => (
                                 <div key={i} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-rose-50 shadow-sm">
                                    <span className="text-rose-500 font-black">!</span>
                                    <p className="text-[11px] font-bold text-slate-700 leading-tight uppercase">{obs}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">SİMÜLASYON GÖREVLERİ</h4>
                           <div className="space-y-3">
                              {candidate.report.interviewGuidance?.simulationTasks?.map((task, i) => (
                                 <div key={i} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-slate-900 font-black">►</span>
                                    <p className="text-[11px] font-bold text-slate-700 leading-tight">{task}</p>
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
