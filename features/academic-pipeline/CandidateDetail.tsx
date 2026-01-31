
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, Branch, CareerPhase } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { BRANCH_CATEGORY_MULTIPLIERS } from '../../constants/taxonomy';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ComposedChart, Line
} from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<CareerPhase | null>(null);
  
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
    const branchMultipliers = BRANCH_CATEGORY_MULTIPLIERS[candidate.branch as Branch] || {};
    return segments.map(s => {
      const multiplier = branchMultipliers[s.key === 'technicalExpertise' ? 'clinical' : s.key] || 1.0;
      return { 
        subject: s.label, 
        value: da[s.key]?.score || 0,
        ideal: Math.min(100, 75 * multiplier) 
      };
    });
  }, [candidate, segments]);

  // FAZ 5: Kesişim Skoru (Merit vs Burnout)
  const churnPoint = useMemo(() => {
    const trajectory = candidate.report?.predictiveMetrics?.trajectory;
    if (!trajectory) return null;
    return trajectory.find(t => t.burnoutRisk > t.meritScore);
  }, [candidate.report]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
      setActiveTab('predictions');
    } catch (e: any) { 
      alert("Hata: Projeksiyon motoru mühürlenemedi."); 
    } finally { 
      setIsAnalysing(false); 
    }
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* HEADER */}
      <div className="h-[70px] border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-5 overflow-hidden">
            <div className={`w-3 h-3 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500 animate-pulse' : 'bg-orange-500'}`}></div>
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tighter whitespace-nowrap leading-none">{candidate.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{candidate.branch}</span>
                 {candidate.algoReport?.branchComplianceScore && candidate.algoReport.branchComplianceScore > 80 && (
                   <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black tracking-tighter">ELİT UYUM</span>
                 )}
              </div>
            </div>
         </div>

         <div className="flex items-center gap-3 shrink-0">
            {candidate.report && (
               <div className="mr-4 text-right hidden lg:flex items-center gap-4 border-r border-slate-100 pr-4">
                  <div>
                    <span className="text-xs font-black text-slate-400 block leading-none uppercase tracking-widest mb-1">GÜNCEL LİYAKAT</span>
                    <span className="text-lg font-black text-slate-900">%{candidate.report.score}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-100"></div>
                  <div>
                    <span className="text-xs font-black text-orange-600 block leading-none uppercase tracking-widest mb-1">BRANŞ UYUM</span>
                    <span className="text-lg font-black text-orange-600">%{candidate.algoReport?.branchComplianceScore || '?'}</span>
                  </div>
               </div>
            )}
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                 isAnalysing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-orange-600 active:scale-95'
               }`}
            >
               {isAnalysing ? 'GELECEK SİMÜLE EDİLİYOR...' : 'DERİN ANALİZ VE PROJEKSİYON'}
            </button>
         </div>
      </div>

      {/* TABS */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
         {[
           { id: 'matrix', label: 'ANALİZ MATRİSİ', icon: 'M4 6h16M4 12h16M4 18h7' }, 
           { id: 'dna', label: 'MİZAÇ & DNA', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }, 
           { id: 'predictions', label: '24 AY PROJEKSİYONU', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
         ].map(t => (
            <button 
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl transition-all ${activeTab === t.id ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={t.icon} /></svg>
               {t.label}
            </button>
         ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA] custom-scrollbar">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-200 rounded-[2.5rem] mb-4 animate-pulse"></div>
               <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">MIA Analiz Bekleniyor</p>
            </div>
         ) : (
            <div className="space-y-10 max-w-6xl mx-auto animate-fade-in pb-32">
               
               {/* --- FAZ 5: 24 AY PROJEKSİYONU --- */}
               {activeTab === 'predictions' && (
                  <div className="space-y-8 animate-slide-up">
                     
                     {/* Trajectory Chart Row */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        <div className="lg:col-span-8 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                           <div className="flex justify-between items-start mb-10">
                              <div>
                                 <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-1">Akademik Yörünge (24 Ay)</h4>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Liyakat Artışı ve Tükenmişlik Dengesi</p>
                              </div>
                              <div className="flex gap-6">
                                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-600 rounded-sm"></div><span className="text-[9px] font-black text-slate-400 uppercase">LİYAKAT</span></div>
                                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-400 rounded-sm"></div><span className="text-[9px] font-black text-slate-400 uppercase">BURNOUT RİSKİ</span></div>
                              </div>
                           </div>
                           
                           <div className="flex-1 min-h-0">
                              <ResponsiveContainer width="100%" height="100%">
                                 <ComposedChart 
                                   data={candidate.report.predictiveMetrics.trajectory}
                                   onMouseMove={(state) => { if(state.activePayload) setHoveredMonth(state.activePayload[0].payload); }}
                                   onMouseLeave={() => setHoveredMonth(null)}
                                 >
                                    <defs>
                                       <linearGradient id="colorMerit" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" label={{ value: 'AY', position: 'insideBottomRight', offset: -5, fontSize: 8, fontWeight: 900 }} tick={{ fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip 
                                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }}
                                      itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                    />
                                    <Area type="monotone" dataKey="meritScore" name="Liyakat %" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorMerit)" />
                                    <Line type="monotone" dataKey="burnoutRisk" name="Burnout %" stroke="#fb7185" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#fb7185' }} />
                                 </ComposedChart>
                              </ResponsiveContainer>
                           </div>
                        </div>

                        {/* Strategic Insight Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                           <div className="bg-slate-900 p-8 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex-1">
                              <div className="relative z-10">
                                 <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6 block border-b border-white/10 pb-4">NÖRAL EVRİM TAHMİNİ</span>
                                 <div className="space-y-8">
                                    {hoveredMonth ? (
                                       <div className="animate-fade-in">
                                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{hoveredMonth.month}. AY DURUMU</p>
                                          <p className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{hoveredMonth.competencyLevel}</p>
                                          <div className="p-5 bg-white/5 rounded-3xl border border-white/10 italic text-sm text-slate-300 leading-relaxed">
                                             "{hoveredMonth.strategicAdvice}"
                                          </div>
                                       </div>
                                    ) : (
                                       <div className="space-y-6">
                                          <p className="text-xl font-black leading-tight uppercase italic tracking-tight">
                                             "{candidate.report.predictiveMetrics.evolutionPath}"
                                          </p>
                                          <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-lg">AI</div>
                                             <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">PROJEKSİYONU İNCELEMEK İÇİN GRAFİK ÜZERİNDE GEZİNİN.</p>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-[60px]"></div>
                           </div>

                           {churnPoint && (
                              <div className="bg-rose-600 p-8 rounded-[3.5rem] text-white shadow-xl animate-pulse">
                                 <h5 className="text-[10px] font-black text-rose-200 uppercase tracking-[0.3em] mb-4">KRİTİK KOPMA NOKTASI</h5>
                                 <p className="text-sm font-bold leading-tight">
                                    {churnPoint.month}. AYDA "BURNOUT" LİYAKATİN ÖNÜNE GEÇEBİLİR. 
                                 </p>
                                 <p className="text-[10px] font-medium mt-3 text-rose-100 italic">"Bu dönemde görev rotasyonu tavsiye edilir."</p>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Second Row: Core Predictive KPIs */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <PredictBar label="SADAKAT (12 AY)" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-600" description="Kurumsal Aidiyet" />
                        <PredictBar label="ÖĞRENME HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-600" description="Adaptasyon Hızı" />
                        <PredictBar label="LİDERLİK POT." value={candidate.report.predictiveMetrics.leadershipPotential} color="text-orange-600" description="Koordinatör Adaylığı" />
                        <PredictBar label="DİRENÇ SKORU" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-600" description="Stres Toleransı" />
                     </div>

                     {/* Strategy Card */}
                     <div className="bg-orange-50 border border-orange-100 p-10 rounded-[4rem] flex flex-col md:flex-row items-center gap-10">
                        <div className="shrink-0">
                           <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center">
                              <svg className="w-10 h-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                           </div>
                        </div>
                        <div className="flex-1 space-y-4">
                           <h4 className="text-[11px] font-black text-orange-800 uppercase tracking-[0.4em]">RİSK MİTİGASYON STRATEJİSİ</h4>
                           <p className="text-xl font-black text-orange-950 uppercase tracking-tighter leading-none italic">"En Büyük Risk: {candidate.report.predictiveMetrics.riskMitigation.primaryRisk}"</p>
                           <p className="text-sm font-bold text-orange-700 leading-relaxed italic opacity-80">
                              {candidate.report.predictiveMetrics.riskMitigation.preventionStrategy}
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* Matrix Tab (Faz 4 Legacy - Aynen Korunmuştur) */}
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
                                className={`w-full p-5 rounded-2xl border text-left transition-all ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-600'}`}
                             >
                                <div className="flex justify-between items-center">
                                   <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-orange-500' : 'text-slate-400'}`}>{s.label}</span>
                                   <span className="text-base font-black">%{segmentScore}</span>
                                </div>
                             </button>
                           );
                        })}
                     </div>
                     <div className="md:col-span-9">
                        {currentData && (
                           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
                              <p className="text-[15px] font-medium text-slate-700 leading-[1.8] italic">"{currentData.reasoning}"</p>
                           </div>
                        )}
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
