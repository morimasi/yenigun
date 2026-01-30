
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, InterviewPhase } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  
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
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
      setSelectedSegment('workEthics');
    } catch (e: any) { 
      alert("Hata: Analiz motoru mühürlenemedi."); 
    } finally { 
      setIsAnalysing(false); 
    }
  };

  const handleDecision = async (decision: 'hired' | 'rejected') => {
    if (!confirm(decision === 'hired' ? "Personel olarak atanacak?" : "Arşive kaldırılacak?")) return;
    onUpdate({ ...candidate, status: decision === 'hired' ? 'hired' : 'rejected', timestamp: Date.now() });
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* 1. HEADER (ULTRA DENSE) */}
      <div className="h-[60px] border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-5 overflow-hidden">
            <div className={`w-3 h-3 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500 animate-pulse' : 'bg-orange-500'}`}></div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tighter whitespace-nowrap">{candidate.name}</h2>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
               <span className="text-orange-600 font-black">{candidate.branch}</span>
               <span>•</span>
               <span>{candidate.experienceYears} YIL SAHA DENEYİMİ</span>
            </div>
         </div>

         <div className="flex items-center gap-3 shrink-0">
            {candidate.report && (
               <div className="mr-4 text-right hidden lg:block">
                  <span className="text-sm font-black text-emerald-600 block leading-none">%{candidate.report.score} LİYAKAT</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">SİSTEMİK MÜHÜR</span>
               </div>
            )}
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                 isAnalysing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-orange-600 active:scale-95'
               }`}
            >
               {isAnalysing ? 'MUHAKEME...' : 'DERİN ANALİZ'}
            </button>
            <div className="flex bg-slate-100 p-1 rounded-xl ml-2">
               <button onClick={() => handleDecision('hired')} className="px-4 py-2 text-[10px] font-black uppercase rounded-lg text-slate-600 hover:bg-white hover:text-emerald-600 transition-all">ATA</button>
               <button onClick={() => handleDecision('rejected')} className="px-4 py-2 text-[10px] font-black uppercase rounded-lg text-slate-600 hover:bg-white hover:text-rose-600 transition-all">RED</button>
            </div>
         </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
         {[
           { id: 'matrix', label: 'MATRİS (DERİN OKUMA)', icon: 'M4 6h16M4 12h16M4 18h7' }, 
           { id: 'dna', label: 'DNA & MİZAÇ SPEKTRUMU', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }, 
           { id: 'predictions', label: 'PROJEKSİYON (24 AY)', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }, 
           { id: 'strategy', label: 'STRATEJİ (PLAYBOOK)', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
         ].map(t => (
            <button 
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl transition-all ${activeTab === t.id ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
            >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={t.icon} /></svg>
               {t.label}
            </button>
         ))}
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA] custom-scrollbar">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-200 rounded-[2.5rem] mb-4 animate-pulse border-4 border-dashed border-slate-300"></div>
               <div>
                  <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">MIA Ünitesi Hazır</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Analiz başlatmak için sağ üstteki butonu kullanın.</p>
               </div>
            </div>
         ) : (
            <div className="space-y-10 max-w-6xl mx-auto animate-fade-in pb-32">
               
               {/* --- MATRİS (DERİN OKUMA) MODÜLÜ --- */}
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                     <div className="md:col-span-3 space-y-2 sticky top-0">
                        {segments.map(s => {
                           const isSelected = selectedSegment === s.key;
                           const segmentScore = candidate.report?.deepAnalysis?.[s.key]?.score || 0;
                           return (
                             <button 
                                key={s.key} 
                                onClick={() => setSelectedSegment(s.key)}
                                className={`w-full p-5 rounded-2xl border text-left transition-all relative group ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-2xl translate-x-2' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:shadow-lg'}`}
                             >
                                <div className="flex justify-between items-center mb-2">
                                   <span className={`text-[10px] font-black uppercase block tracking-tight ${isSelected ? 'text-orange-500' : 'text-slate-400'}`}>{s.label}</span>
                                   <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>%{segmentScore}</span>
                                </div>
                                <div className="h-1.5 bg-slate-100/10 rounded-full overflow-hidden">
                                   <div className={`h-full transition-all duration-1000 ${isSelected ? 'bg-orange-600' : 'bg-slate-200'}`} style={{ width: `${segmentScore}%` }}></div>
                                </div>
                             </button>
                           );
                        })}
                     </div>

                     <div className="md:col-span-9 space-y-8 animate-slide-up">
                        {currentData && (
                           <>
                              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                                 <div className="absolute top-0 left-0 w-2 h-full bg-slate-900 group-hover:bg-orange-600 transition-colors"></div>
                                 <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 border-b border-slate-50 pb-4">KLİNİK NEDENSELLİK (ROOT CAUSE ANALYSIS)</h4>
                                 <p className="text-[15px] font-medium text-slate-700 leading-[1.8] text-justify whitespace-pre-wrap italic">
                                    {currentData.reasoning}
                                 </p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="bg-orange-600 p-10 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden group">
                                    <div className="relative z-10">
                                       <h5 className="text-[11px] font-black text-orange-200 uppercase tracking-[0.3em] mb-8 border-b border-orange-500/50 pb-4">24 AY PROJEKSİYONU: KURUMSAL ETKİ</h5>
                                       <p className="text-[14px] font-bold leading-relaxed text-orange-50 italic">
                                          "{currentData.institutionalImpact}"
                                       </p>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-[60px]"></div>
                                 </div>
                                 <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-4">NÖRAL İPUÇLARI (MİKRO-DAVRANIŞLAR)</h5>
                                    <ul className="space-y-5">
                                       {(currentData.behavioralIndicators || []).map((b, i) => (
                                          <li key={i} className="flex gap-5 items-start group/item">
                                             <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[11px] font-black text-slate-300 group-hover/item:bg-orange-100 group-hover/item:text-orange-600 transition-all shrink-0">
                                                {i + 1}
                                             </div>
                                             <p className="text-[12px] font-bold text-slate-700 leading-tight uppercase tracking-tight pt-1">
                                                {b}
                                             </p>
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           </>
                        )}
                     </div>
                  </div>
               )}

               {/* --- SPEKTRUM & DNA MODÜLÜ --- */}
               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-5 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm min-h-[450px] flex flex-col items-center justify-center">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 w-full text-left">ONLUK YETKİNLİK SPEKTRUMU</h4>
                        <div className="w-full h-full flex-1">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={radarData} outerRadius="75%">
                                 <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
                                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                                 <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.25} strokeWidth={4} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="lg:col-span-7 space-y-8">
                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                           <div className="flex justify-between items-end mb-10 relative z-10">
                              <div>
                                 <p className="text-6xl font-black tracking-tighter">%{candidate.report.integrityIndex || 0}</p>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">DÜRÜSTLÜK ENDEKSİ</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-6xl font-black text-orange-500 tracking-tighter">%{candidate.report.socialMaskingScore || 0}</p>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">SOSYAL MASKELEME</p>
                              </div>
                           </div>
                           <div className="h-2.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                              <div className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-1000" style={{ width: `${candidate.report.integrityIndex || 0}%` }}></div>
                           </div>
                           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
                        </div>
                        <div className="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 border-l-4 border-orange-600 pl-5">AKADEMİK PORTRE ÖZETİ</h4>
                           <p className="text-[14px] font-medium text-slate-600 leading-[1.8] text-justify italic">
                              "{candidate.report.detailedAnalysisNarrative}"
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- PROJEKSİYON (24 AY) MODÜLÜ --- */}
               {activeTab === 'predictions' && (
                  <div className="space-y-10 animate-fade-in">
                     {/* 1. LAYER: GROWTH CURVE */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col h-[450px]">
                           <div className="flex justify-between items-center mb-10">
                              <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-6 leading-none py-1">Nöral Olgunlaşma Tahmini (24 Ay)</h4>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">AI GELECEK SİMÜLASYONU</span>
                           </div>
                           <div className="flex-1 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={candidate.report.predictiveMetrics?.growthForecast || []}>
                                    <defs>
                                       <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontStyle: 'bold', fill: '#94a3b8' }} unit=". AY" />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontStyle: 'bold', fill: '#94a3b8' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="score" stroke="#ea580c" strokeWidth={5} fillOpacity={1} fill="url(#colorGrowth)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                           <PredictBar label="KURUMSAL SADAKAT" value={candidate.report.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" description="24 Ay Bağlılık Beklentisi" />
                           <PredictBar label="ÖĞRENME HIZI" value={candidate.report.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" description="Klinik Adaptasyon Çevikliği" />
                           <PredictBar label="TÜKENMİŞLİK DİRENCİ" value={100 - (candidate.report.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" description="Psikolojik Dayanıklılık Kapasitesi" />
                        </div>
                     </div>

                     {/* 2. LAYER: EVOLUTION TIMELINE */}
                     <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-3xl relative overflow-hidden border border-white/5">
                        <div className="relative z-10 flex flex-col md:flex-row gap-12">
                           <div className="md:w-80 space-y-4">
                              <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em] mb-10">EVRİM DURAKLARI</h5>
                              {(candidate.report.predictiveMetrics?.evolutionTimeline || []).map((step, idx) => (
                                 <button 
                                   key={idx}
                                   onClick={() => setActiveTimelineIdx(idx)}
                                   className={`w-full p-6 rounded-[2rem] text-left transition-all border-2 flex flex-col gap-2 ${activeTimelineIdx === idx ? 'bg-white text-slate-900 border-white shadow-2xl scale-[1.05]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                                 >
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${activeTimelineIdx === idx ? 'text-orange-600' : 'text-slate-500'}`}>FAZ 0{idx + 1}</p>
                                    <p className="text-[13px] font-black uppercase tracking-tight leading-none">{step.phase}</p>
                                    <p className="text-[10px] font-bold opacity-60 uppercase">{step.timeframe}</p>
                                 </button>
                              ))}
                           </div>

                           {candidate.report.predictiveMetrics?.evolutionTimeline?.[activeTimelineIdx] && (
                              <div className="flex-1 bg-white/5 rounded-[3rem] border border-white/10 p-12 animate-fade-in">
                                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                       <div>
                                          <h6 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6">BEKLENEN KLİNİK REFLEKSLER</h6>
                                          <div className="space-y-4">
                                             {candidate.report.predictiveMetrics.evolutionTimeline[activeTimelineIdx].expectedBehaviors.map((b, i) => (
                                                <div key={i} className="flex gap-5 items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                                   <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                                                   <p className="text-[13px] font-bold text-slate-200 uppercase tracking-tight leading-tight">{b}</p>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="space-y-10">
                                       <div className="p-10 bg-slate-950 rounded-[2.5rem] border border-white/10 shadow-inner relative overflow-hidden group">
                                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-4 relative z-10">GELİŞİM PROJEKSİYONU</span>
                                          <p className="text-[15px] font-medium text-slate-300 leading-relaxed italic relative z-10">
                                             "{candidate.report.predictiveMetrics.evolutionTimeline[activeTimelineIdx].clinicalGrowth}"
                                          </p>
                                          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                                       </div>
                                       <div className="p-10 bg-orange-600/10 rounded-[2.5rem] border border-orange-600/20">
                                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">YÖNETİCİYE KRİTİK NOT</span>
                                          <p className="text-[15px] font-black text-orange-100 leading-relaxed uppercase tracking-tight">
                                             "{candidate.report.predictiveMetrics.evolutionTimeline[activeTimelineIdx].managementAdvice}"
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]"></div>
                     </div>

                     {/* 3. LAYER: RISK MITIGATION */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-rose-50 p-12 rounded-[4rem] border border-rose-100 shadow-sm relative overflow-hidden group">
                           <div className="relative z-10">
                              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-rose-600 shadow-md mb-8 font-black text-2xl">!</div>
                              <h5 className="text-[11px] font-black text-rose-900 uppercase tracking-[0.4em] mb-3">KRİTİK TÜKENMİŞLİK RİSKİ</h5>
                              <p className="text-2xl font-black text-rose-950 leading-[1.1] uppercase tracking-tighter">
                                 "{candidate.report.predictiveMetrics?.riskMitigation?.primaryRisk}"
                              </p>
                           </div>
                           <div className="absolute right-0 bottom-0 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                              <svg className="w-48 h-48 text-rose-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                           </div>
                        </div>

                        <div className="bg-emerald-50 p-12 rounded-[4rem] border border-emerald-100 shadow-sm relative overflow-hidden">
                           <div className="relative z-10">
                              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-md mb-8 font-black text-2xl">✓</div>
                              <h5 className="text-[11px] font-black text-emerald-900 uppercase tracking-[0.4em] mb-3">ÖNLEYİCİ KORUMA STRATEJİSİ</h5>
                              <p className="text-[16px] font-bold text-emerald-950 leading-relaxed italic">
                                 "{candidate.report.predictiveMetrics?.riskMitigation?.preventionStrategy}"
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- STRATEJİ (PLAYBOOK) MODÜLÜ --- */}
               {activeTab === 'strategy' && (
                  <div className="space-y-10 animate-fade-in pb-20">
                     
                     {/* PHASE NAVIGATOR */}
                     <div className="bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-lg flex gap-3">
                        {(candidate.report.interviewGuidance?.phases || []).map((phase, idx) => (
                           <button 
                             key={idx}
                             onClick={() => setActivePhaseIdx(idx)}
                             className={`flex-1 py-6 rounded-2xl transition-all flex flex-col items-center justify-center gap-2 ${activePhaseIdx === idx ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'hover:bg-slate-50 text-slate-400'}`}
                           >
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">SAFHA 0{idx + 1}</span>
                              <span className="text-[13px] font-black uppercase tracking-tight">{phase.title}</span>
                           </button>
                        ))}
                     </div>

                     {/* PHASE DETAIL */}
                     {candidate.report.interviewGuidance?.phases?.[activePhaseIdx] && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                           
                           {/* LEFT: STRATEGIC QUESTIONS */}
                           <div className="lg:col-span-8 space-y-8">
                              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                                 <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
                                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">ANA STRATEJİK HEDEF</h4>
                                 <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight italic">
                                    "{candidate.report.interviewGuidance.phases[activePhaseIdx].goal}"
                                 </p>
                              </div>

                              <div className="space-y-6">
                                 {candidate.report.interviewGuidance.phases[activePhaseIdx].questions.map((q, qidx) => (
                                    <div key={qidx} className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm group hover:border-orange-300 hover:shadow-2xl transition-all relative overflow-hidden">
                                       <div className="flex gap-8">
                                          <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center font-black shrink-0 text-xl group-hover:bg-orange-600 transition-colors shadow-xl">?</div>
                                          <div className="space-y-6 flex-1">
                                             <h5 className="text-xl font-black text-slate-800 leading-tight uppercase tracking-tight">"{q.text}"</h5>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group/info">
                                                   <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">SORU ANALİZİ (WHY)</span>
                                                   <p className="text-[13px] font-bold text-slate-500 leading-relaxed italic opacity-80 group-hover/info:opacity-100 transition-opacity uppercase">{q.why}</p>
                                                </div>
                                                <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 relative group/info">
                                                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-3">KLİNİK EMARE (LOOK-FOR)</span>
                                                   <p className="text-[13px] font-bold text-slate-600 leading-relaxed italic uppercase">{q.lookFor}</p>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* RIGHT: RISK & INTEL */}
                           <div className="lg:col-span-4 space-y-8">
                              
                              <div className="bg-rose-50 p-10 rounded-[3.5rem] border border-rose-100 shadow-sm relative overflow-hidden">
                                 <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-black text-lg shadow-lg animate-pulse">!</div>
                                    <h5 className="text-[12px] font-black text-rose-900 uppercase tracking-widest leading-none">RED FLAGS</h5>
                                 </div>
                                 <div className="space-y-4">
                                    {candidate.report.interviewGuidance.phases[activePhaseIdx].redFlags.map((flag, fidx) => (
                                       <div key={fidx} className="flex gap-4 items-start p-4 bg-white/50 rounded-2xl border border-rose-100">
                                          <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0"></div>
                                          <p className="text-[12px] font-black text-rose-800 uppercase tracking-tight leading-tight italic">{flag}</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden">
                                 <div className="flex items-center gap-4 mb-8 relative z-10">
                                    <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-lg">
                                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-widest leading-none">NÖRAL İPUÇLARI</h5>
                                 </div>
                                 <div className="space-y-5 relative z-10">
                                    {candidate.report.interviewGuidance.phases[activePhaseIdx].subliminalCues.map((cue, cidx) => (
                                       <div key={cidx} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                          <p className="text-[12px] font-medium text-slate-300 italic uppercase">"{cue}"</p>
                                       </div>
                                    ))}
                                 </div>
                                 <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl"></div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* FINAL ACTION ITEMS BENTO */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all">
                           <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 border-b border-slate-50 pb-6">SAHA SİMÜLASYONLARI (ACTION ITEMS)</h5>
                           <div className="space-y-6">
                              {(candidate.report.interviewGuidance?.simulationTasks || []).map((task, i) => (
                                 <div key={i} className="flex gap-6 items-center p-6 bg-slate-50 rounded-3xl hover:bg-slate-900 hover:text-white transition-all group/task">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-black text-sm shadow-sm group-hover/task:text-orange-500 transition-colors">►</div>
                                    <p className="text-[14px] font-black uppercase tracking-tight leading-tight">{task}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="p-12 bg-slate-900 text-white rounded-[4rem] shadow-3xl relative overflow-hidden">
                           <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10 border-b border-white/10 pb-6">KRİTİK GÖZLEM NOKTALARI</h5>
                           <div className="space-y-6 relative z-10">
                              {(candidate.report.interviewGuidance?.criticalObservations || []).map((obs, i) => (
                                 <div key={i} className="flex gap-6 items-start">
                                    <div className="w-8 h-[3px] bg-orange-600 mt-4 shrink-0 rounded-full"></div>
                                    <p className="text-[15px] font-bold text-slate-200 uppercase tracking-tight leading-relaxed italic">{obs}</p>
                                 </div>
                              ))}
                           </div>
                           <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
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
