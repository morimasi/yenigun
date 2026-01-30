
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
               
               {/* --- MATRİS (DERİN OKUMA) MODÜLÜ --- */}
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                     {/* SOL PANEL: Segment Seçici */}
                     <div className="md:col-span-3 space-y-1 sticky top-0">
                        {segments.map(s => {
                           const isSelected = selectedSegment === s.key;
                           const segmentScore = candidate.report?.deepAnalysis?.[s.key]?.score || 0;
                           return (
                             <button 
                                key={s.key} 
                                onClick={() => setSelectedSegment(s.key)}
                                className={`w-full p-4 rounded-xl border text-left transition-all relative group ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-x-1' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'}`}
                             >
                                <div className="flex justify-between items-center">
                                   <span className={`text-[10px] font-black uppercase block tracking-tight ${isSelected ? 'text-orange-500' : 'text-slate-400'}`}>{s.label}</span>
                                   <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>%{segmentScore}</span>
                                </div>
                                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                                   <div className={`h-full transition-all duration-700 ${isSelected ? 'bg-orange-600' : 'bg-slate-300'}`} style={{ width: `${segmentScore}%` }}></div>
                                </div>
                             </button>
                           );
                        })}
                     </div>

                     {/* SAĞ PANEL: Derin İçerik */}
                     <div className="md:col-span-9 space-y-6">
                        {currentData && (
                           <div className="space-y-6 animate-slide-up">
                              
                              {/* 1. Klinik Nedensellik (Zengin İçerik) */}
                              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                                 <div className="absolute top-0 left-0 w-2 h-full bg-slate-900 group-hover:bg-orange-600 transition-colors"></div>
                                 <div className="flex items-center gap-3 mb-6">
                                    <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">KLİNİK NEDENSELLİK (ROOT CAUSE ANALYSIS)</h4>
                                 </div>
                                 <div className="prose prose-slate max-w-none">
                                    <p className="text-[14px] font-medium text-slate-700 leading-[1.8] text-justify whitespace-pre-wrap">
                                       {currentData.reasoning}
                                    </p>
                                 </div>
                                 <div className="mt-8 flex gap-4">
                                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                       * Adayın mülakat yanıtları ve CV verileriyle çaprazlanmıştır.
                                    </div>
                                 </div>
                              </div>

                              {/* 2. Kurumsal Etki & Mikro-Davranışlar (Bento Grid) */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="bg-orange-600 p-8 rounded-[3rem] text-white shadow-lg relative overflow-hidden group">
                                    <div className="relative z-10">
                                       <h5 className="text-[11px] font-black text-orange-200 uppercase tracking-[0.3em] mb-6 border-b border-orange-500/50 pb-3">24 AY PROJEKSİYONU: KURUMSAL ETKİ</h5>
                                       <p className="text-[13px] font-bold leading-relaxed text-orange-50 italic">
                                          "{currentData.institutionalImpact}"
                                       </p>
                                       <div className="mt-6 space-y-3">
                                          <div className="flex items-center gap-3">
                                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                             <span className="text-[10px] font-black uppercase opacity-80">Veli Güven Endeksi Etkisi: %{Math.round((currentData.score || 0) * 0.4)} Gelişim</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-75"></div>
                                             <span className="text-[10px] font-black uppercase opacity-80">Klinik Standart Katkısı: Yüksek</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                                 </div>

                                 <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 border-b border-slate-50 pb-3">NÖRAL İPUÇLARI (MİKRO-DAVRANIŞLAR)</h5>
                                    <ul className="space-y-4">
                                       {(currentData.behavioralIndicators || []).map((b, i) => (
                                          <li key={i} className="flex gap-4 items-start group/item">
                                             <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-300 group-hover/item:bg-orange-100 group-hover/item:text-orange-600 transition-all shrink-0">
                                                {i + 1}
                                             </div>
                                             <p className="text-[11px] font-bold text-slate-700 leading-tight uppercase tracking-tight">
                                                {b}
                                             </p>
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>

                              {/* 3. Avantajlar & Riskler */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="p-8 bg-emerald-50 rounded-[3rem] border border-emerald-100">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] block mb-4">SİSTEMİK AVANTAJLAR</span>
                                    <div className="space-y-3">
                                       {currentData.pros.map((p, i) => (
                                          <div key={i} className="flex gap-3 items-center">
                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                             <p className="text-[11px] font-black text-emerald-900 uppercase tracking-tight leading-none">{p}</p>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="p-8 bg-rose-50 rounded-[3rem] border border-rose-100">
                                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] block mb-4">KRİTİK RİSK NOKTALARI</span>
                                    <div className="space-y-3">
                                       {currentData.risks.map((r, i) => (
                                          <div key={i} className="flex gap-3 items-center">
                                             <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                             <p className="text-[11px] font-black text-rose-900 uppercase tracking-tight leading-none">{r}</p>
                                          </div>
                                       ))}
                                    </div>
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

               {activeTab === 'predictions' && (
                  <div className="space-y-8 animate-fade-in pb-10">
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                           <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" description="Kurumsal Bağlılık" />
                           <PredictBar label="HIZ" value={candidate.report.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" description="Öğrenme Çevikliği" />
                           <PredictBar label="DİRENÇ" value={100 - (candidate.report.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" description="Tükenmişlik Koruması" />
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'strategy' && (
                  <div className="space-y-8 animate-fade-in pb-10">
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
                     {candidate.report.interviewGuidance?.phases?.[activePhaseIdx] && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
                           <div className="lg:col-span-4 space-y-6">
                              <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 shadow-sm">
                                 <h5 className="text-[11px] font-black text-rose-900 uppercase tracking-widest leading-none mb-6">RED FLAGS (KRİTİK UYARI)</h5>
                                 <div className="space-y-3">
                                    {candidate.report.interviewGuidance.phases[activePhaseIdx].redFlags.map((flag, fidx) => (
                                       <div key={fidx} className="flex gap-3 items-start">
                                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                          <p className="text-[11px] font-black text-rose-800 uppercase tracking-tight leading-tight">{flag}</p>
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
         )}
      </div>
    </div>
  );
};

export default CandidateDetail;
