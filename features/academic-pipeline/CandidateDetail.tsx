
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
  }, [candidate.report, selectedSegment]);

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
      
      {/* HEADER (ULTRA COMPACT) */}
      <div className="h-[60px] border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4 overflow-hidden">
            <div className={`w-2.5 h-2.5 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight whitespace-nowrap">{candidate.name}</h2>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
               <span className="text-orange-700">{candidate.branch}</span>
               <span>•</span>
               <span>{candidate.experienceYears} Yıl</span>
            </div>
         </div>

         <div className="flex items-center gap-2 shrink-0">
            {candidate.report && (
               <div className="mr-3 text-right hidden md:block">
                  <span className="text-[10px] font-black text-emerald-600 block leading-none">%{candidate.report.score}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">LİYAKAT</span>
               </div>
            )}
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                 isAnalysing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-orange-600'
               }`}
            >
               {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZİ BAŞLAT'}
            </button>
            <div className="flex bg-slate-100 p-0.5 rounded-lg ml-2">
               <button onClick={() => handleDecision('hired')} className="px-3 py-1.5 text-[9px] font-black uppercase rounded-md text-slate-600 hover:bg-white hover:text-emerald-600 transition-all">ATA</button>
               <button onClick={() => handleDecision('rejected')} className="px-3 py-1.5 text-[9px] font-black uppercase rounded-md text-slate-600 hover:bg-white hover:text-rose-600 transition-all">RED</button>
            </div>
         </div>
      </div>

      {/* TABS */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
         {[
           { id: 'matrix', label: 'MATRİS (DERİN OKUMA)' }, 
           { id: 'dna', label: 'DNA & SPEKTRUM' }, 
           { id: 'predictions', label: 'PROJEKSİYON (24 AY)' }, 
           { id: 'strategy', label: 'STRATEJİ (PLAYBOOK)' }
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

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
         {!candidate.report || !candidate.report.deepAnalysis ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
               <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-4 animate-pulse"></div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400">Analiz Verisi Bekleniyor...</p>
            </div>
         ) : (
            <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-20">
               
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                     <div className="md:col-span-3 space-y-1">
                        {segments.map(s => {
                           const isSelected = selectedSegment === s.key;
                           return (
                             <button 
                                key={s.key} 
                                onClick={() => setSelectedSegment(s.key)}
                                className={`w-full p-4 rounded-xl border text-left transition-all relative ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'}`}
                             >
                                <span className={`text-[10px] font-black uppercase block ${isSelected ? 'text-orange-500' : 'text-slate-400'}`}>{s.label}</span>
                                <span className="text-lg font-black mt-1">%{candidate.report?.deepAnalysis?.[s.key]?.score || 0}</span>
                             </button>
                           );
                        })}
                     </div>
                     <div className="md:col-span-9 space-y-6">
                        {currentData && (
                           <div className="space-y-6 animate-slide-up">
                              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-2 h-full bg-slate-900"></div>
                                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4">KLİNİK NEDENSELLİK (ROOT CAUSE)</h4>
                                 <p className="text-[13px] font-medium text-slate-700 leading-relaxed text-justify">"{currentData.reasoning}"</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                                    <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">MİKRO-DAVRANIŞLAR</h5>
                                    <ul className="space-y-2">
                                       {(currentData.behavioralIndicators || []).map((b, i) => (
                                          <li key={i} className="flex gap-3 items-start text-[11px] font-bold text-slate-700 leading-tight">
                                             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                                             {b}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                                    <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">KURUMSAL ETKİ</h5>
                                    <p className="text-[12px] font-medium text-slate-300 leading-relaxed">{currentData.institutionalImpact}</p>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={radarData} outerRadius="80%">
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.25} strokeWidth={3} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                           <div className="flex justify-between items-end mb-6">
                              <div>
                                 <p className="text-5xl font-black">%{candidate.report.integrityIndex || 0}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">DÜRÜSTLÜK ENDEKSİ</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-5xl font-black text-orange-500">%{candidate.report.socialMaskingScore || 0}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">SOSYAL MASKELEME</p>
                              </div>
                           </div>
                           <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-600" style={{ width: `${candidate.report.integrityIndex || 0}%` }}></div>
                           </div>
                        </div>
                        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200">
                           <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">ÖZET KARAKTER ANALİZİ</h4>
                           <p className="text-[13px] font-medium text-slate-600 leading-relaxed text-justify">{candidate.report.detailedAnalysisNarrative}</p>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- PROJEKSİYON (24 AY) MODÜLÜ --- */}
               {activeTab === 'predictions' && (
                  <div className="space-y-8 animate-fade-in pb-10">
                     
                     {/* 1. LAYER: GROWTH CURVE & CORE KPI */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Klinik Olgunlaşma Grafiği */}
                        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col h-[400px]">
                           <div className="flex justify-between items-center mb-8">
                              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4 leading-none py-1">Klinik Olgunlaşma Tahmini (24 Ay)</h4>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">AI SİMÜLASYONU</span>
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
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} unit=". Ay" />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="score" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>

                        {/* Bento Metrics */}
                        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                           <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" description="Kurumsal Bağlılık" />
                           <PredictBar label="HIZ" value={candidate.report.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" description="Öğrenme Çevikliği" />
                           <PredictBar label="DİRENÇ" value={100 - (candidate.report.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" description="Tükenmişlik Koruması" />
                        </div>
                     </div>

                     {/* 2. LAYER: INTERACTIVE EVOLUTION TIMELINE */}
                     <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row gap-10">
                           {/* Timeline Left Rail */}
                           <div className="md:w-72 space-y-3">
                              <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">EVRİM DURAKLARI</h5>
                              {(candidate.report.predictiveMetrics?.evolutionTimeline || []).map((step, idx) => (
                                 <button 
                                   key={idx}
                                   onClick={() => setActiveTimelineIdx(idx)}
                                   className={`w-full p-5 rounded-2xl text-left transition-all border-2 ${activeTimelineIdx === idx ? 'bg-white text-slate-900 border-white shadow-xl scale-[1.03]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                                 >
                                    <p className={`text-[8px] font-black uppercase mb-1 ${activeTimelineIdx === idx ? 'text-orange-600' : 'text-slate-500'}`}>ETAP 0{idx + 1}</p>
                                    <p className="text-[11px] font-black uppercase tracking-tight">{step.phase}</p>
                                    <p className="text-[9px] font-bold opacity-60 mt-1">{step.timeframe}</p>
                                 </button>
                              ))}
                           </div>

                           {/* Timeline Detail View */}
                           {candidate.report.predictiveMetrics?.evolutionTimeline?.[activeTimelineIdx] && (
                              <div className="flex-1 bg-white/5 rounded-[2.5rem] border border-white/10 p-10 animate-fade-in">
                                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                       <div>
                                          <h6 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">BEKLENEN KLİNİK DAVRANIŞLAR</h6>
                                          <div className="space-y-3">
                                             {candidate.report.predictiveMetrics.evolutionTimeline[activeTimelineIdx].expectedBehaviors.map((b, i) => (
                                                <div key={i} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                                   <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
                                                   <p className="text-[12px] font-bold text-slate-200 uppercase tracking-tight">{b}</p>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="space-y-8">
                                       <div className="p-8 bg-slate-950 rounded-[2rem] border border-white/10 shadow-inner">
                                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-3">GELİŞİM PROJEKSİYONU</span>
                                          <p className="text-[13px] font-medium text-slate-300 leading-relaxed italic">
                                             "{candidate.report.predictiveMetrics.evolutionTimeline[activeTimelineIdx].clinicalGrowth}"
                                          </p>
                                       </div>
                                       <div className="p-8 bg-orange-600/10 rounded-[2rem] border border-orange-600/20">
                                          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-3">YÖNETİCİYE TAVSİYE</span>
                                          <p className="text-[13px] font-black text-orange-100 leading-relaxed">
                                             "{candidate.report.predictiveMetrics.evolutionTimeline[activeTimelineIdx].managementAdvice}"
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                        <div className="absolute -right-40 -top-40 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]"></div>
                     </div>

                     {/* 3. LAYER: RISK MITIGATION BENTO */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 shadow-sm relative overflow-hidden group">
                           <div className="relative z-10">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm mb-6 font-black text-xl">!</div>
                              <h5 className="text-[10px] font-black text-rose-900 uppercase tracking-[0.3em] mb-2">BİRİNCİL TÜKENMİŞLİK RİSKİ</h5>
                              <p className="text-xl font-black text-rose-950 leading-tight uppercase tracking-tight">
                                 "{candidate.report.predictiveMetrics?.riskMitigation?.primaryRisk}"
                              </p>
                           </div>
                           <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
                              <svg className="w-32 h-32 text-rose-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                           </div>
                        </div>

                        <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 shadow-sm relative overflow-hidden">
                           <div className="relative z-10">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-6 font-black text-xl">✓</div>
                              <h5 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.3em] mb-2">ÖNLEYİCİ KORUMA STRATEJİSİ</h5>
                              <p className="text-sm font-bold text-emerald-950 leading-relaxed italic">
                                 "{candidate.report.predictiveMetrics?.riskMitigation?.preventionStrategy}"
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- STRATEJİ (PLAYBOOK) MODÜLÜ --- */}
               {activeTab === 'strategy' && (
                  <div className="space-y-8 animate-fade-in pb-10">
                     
                     {/* PLAYBOOK NAVIGATION */}
                     <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm gap-2">
                        {(candidate.report.interviewGuidance?.phases || []).map((phase, idx) => (
                           <button 
                             key={idx}
                             onClick={() => setActivePhaseIdx(idx)}
                             className={`flex-1 py-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-1 ${activePhaseIdx === idx ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'hover:bg-slate-50 text-slate-400'}`}
                           >
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">SAFHA 0{idx + 1}</span>
                              <span className="text-[11px] font-black uppercase tracking-tight">{phase.title}</span>
                           </button>
                        ))}
                     </div>

                     {/* ACTIVE PHASE CONTENT */}
                     {candidate.report.interviewGuidance?.phases?.[activePhaseIdx] && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                           
                           {/* LEFT: STRATEGIC GOAL & QUESTIONS */}
                           <div className="lg:col-span-8 space-y-6">
                              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
                                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">TEMEL STRATEJİK HEDEF</h4>
                                 <p className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                                    "{candidate.report.interviewGuidance.phases[activePhaseIdx].goal}"
                                 </p>
                              </div>

                              <div className="space-y-4">
                                 {candidate.report.interviewGuidance.phases[activePhaseIdx].questions.map((q, qidx) => (
                                    <div key={qidx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-orange-300 transition-all">
                                       <div className="flex gap-6">
                                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0 text-sm group-hover:bg-orange-600 transition-colors">?</div>
                                          <div className="space-y-4">
                                             <h5 className="text-lg font-black text-slate-800 leading-tight uppercase">"{q.text}"</h5>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                   <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mb-2">ANALİZ NEDENİ (WHY)</span>
                                                   <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{q.why}</p>
                                                </div>
                                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-2">İDEAL CEVAP KRİTERİ (LOOK-FOR)</span>
                                                   <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">{q.lookFor}</p>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* RIGHT: RISK & INTEL PANEL */}
                           <div className="lg:col-span-4 space-y-6">
                              
                              {/* RED FLAGS */}
                              <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 shadow-sm">
                                 <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-xs">!</div>
                                    <h5 className="text-[11px] font-black text-rose-900 uppercase tracking-widest leading-none">RED FLAGS (KRİTİK UYARI)</h5>
                                 </div>
                                 <div className="space-y-3">
                                    {candidate.report.interviewGuidance.phases[activePhaseIdx].redFlags.map((flag, fidx) => (
                                       <div key={fidx} className="flex gap-3 items-start">
                                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                          <p className="text-[11px] font-black text-rose-800 uppercase tracking-tight leading-tight">{flag}</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              {/* SUBLIMINAL CUES */}
                              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                                 <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xs">
                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest leading-none">NÖRAL İPUÇLARI</h5>
                                 </div>
                                 <div className="space-y-4 relative z-10">
                                    {candidate.report.interviewGuidance.phases[activePhaseIdx].subliminalCues.map((cue, cidx) => (
                                       <div key={cidx} className="p-3 bg-white/5 rounded-xl border border-white/10">
                                          <p className="text-[11px] font-medium text-slate-300 italic">"{cue}"</p>
                                       </div>
                                    ))}
                                 </div>
                                 <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl"></div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* SIMULATION & OBSERVATION BENTO */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm group">
                           <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 border-b border-slate-50 pb-4">SAHA SİMÜLASYONLARI (ACTION ITEMS)</h5>
                           <div className="space-y-4">
                              {(candidate.report.interviewGuidance?.simulationTasks || []).map((task, i) => (
                                 <div key={i} className="flex gap-5 items-center p-5 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group/task">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-xs shadow-sm group-hover/task:text-orange-500 transition-colors">►</div>
                                    <p className="text-[12px] font-black uppercase tracking-tight">{task}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden">
                           <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-4">KRİTİK GÖZLEM NOKTALARI</h5>
                           <div className="space-y-4">
                              {(candidate.report.interviewGuidance?.criticalObservations || []).map((obs, i) => (
                                 <div key={i} className="flex gap-4 items-start">
                                    <div className="w-6 h-[2px] bg-orange-600 mt-3 shrink-0"></div>
                                    <p className="text-[13px] font-bold text-slate-300 uppercase tracking-tight leading-relaxed">{obs}</p>
                                 </div>
                              ))}
                           </div>
                           <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-600/5 rounded-full blur-[80px]"></div>
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
