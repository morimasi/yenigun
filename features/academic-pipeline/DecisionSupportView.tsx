
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, IDP, Branch } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell } from 'recharts';
import DecisionAdvisorChat from '../../components/admin/DecisionAdvisorChat';
import ExportStudio from '../../components/shared/ExportStudio';
import { poolService } from '../../services/ai/poolService';
import { armsService } from '../../services/ai/armsService';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onRefresh: () => void;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config, onRefresh }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'h2h' | 'team_fit' | 'adaptation'>('h2h');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  
  const [comparisonReport, setComparisonReport] = useState<any>(null);
  const [onboardingPlan, setOnboardingPlan] = useState<IDP | null>(null);
  const [teamFitReport, setTeamFitReport] = useState<any>(null);

  const analyzedCandidates = useMemo(() => 
    Array.isArray(candidates) ? candidates.filter(c => !!c.report) : [], 
    [candidates]
  );
  
  const selectedCandidates = useMemo(() => 
    analyzedCandidates.filter(c => selectedIds.includes(c.id)), 
    [analyzedCandidates, selectedIds]
  );

  const dimensions = [
    { key: 'technicalExpertise', label: 'KLİNİK DERİNLİK' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİK ÇEVİKLİK' },
    { key: 'workEthics', label: 'ETİK BÜTÜNLÜK' },
    { key: 'sustainability', label: 'PSİKOLOJİK DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'developmentOpenness', label: 'GELİŞİM HIZI' }
  ];

  const chartData = useMemo(() => {
    return dimensions.map(d => ({
      subject: d.label,
      ...(selectedCandidates[0] ? { [selectedCandidates[0].name]: selectedCandidates[0].report?.deepAnalysis?.[d.key]?.score || 0 } : {}),
      ...(selectedCandidates[1] ? { [selectedCandidates[1].name]: selectedCandidates[1].report?.deepAnalysis?.[d.key]?.score || 0 } : {})
    }));
  }, [selectedCandidates, dimensions]);

  const handleRunAnalysis = async () => {
    if (selectedCandidates.length < 1) return;
    setIsAnalysing(true);
    setComparisonReport(null);
    setTeamFitReport(null);
    setOnboardingPlan(null);

    try {
      if (activeTab === 'h2h' && selectedCandidates.length === 2) {
        const res = await poolService.compareTwoCandidates(selectedCandidates[0], selectedCandidates[1], config);
        setComparisonReport(res);
      } else if (activeTab === 'team_fit' && selectedCandidates.length > 0) {
        const res = await poolService.analyzeTalentPool(selectedCandidates, config);
        setTeamFitReport(res);
      } else if (activeTab === 'adaptation' && selectedCandidates.length > 0) {
        const res = await armsService.generateIDP(selectedCandidates[0]);
        setOnboardingPlan(res);
      }
    } catch (e) {
      alert("Nöral Muhakeme Hatası: AI motoru yoğunluk yaşıyor.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
    setComparisonReport(null);
    setOnboardingPlan(null);
    setTeamFitReport(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-fade-in no-print bg-[#F8FAFC] overflow-hidden p-2">
      
      {/* EXPORT OVERLAY */}
      {isExportOpen && selectedCandidates.length > 0 && (
         <ExportStudio 
            onClose={() => setIsExportOpen(false)}
            data={{
               type: 'STRATEGIC_DECISION',
               entityName: selectedCandidates.length > 1 ? `${selectedCandidates[0].name} VS ${selectedCandidates[1].name}` : selectedCandidates[0].name,
               referenceId: `DEC-${Date.now().toString().slice(-6)}`,
               payload: { candidates: selectedCandidates, report: comparisonReport, onboarding: onboardingPlan, teamFit: teamFitReport },
               config: { title: 'STRATEJİK AKADEMİK KARAR DOSYASI' }
            }}
         />
      )}

      {isChatOpen && <DecisionAdvisorChat candidates={selectedCandidates} onClose={() => setIsChatOpen(false)} />}

      {/* TOP NAVIGATION: COMMAND BAR */}
      <div className="bg-slate-900 p-8 rounded-[4rem] border border-white/5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 shrink-0 relative overflow-hidden">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 bg-orange-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl rotate-3">
               <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">Stratejik Komuta</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mt-1">Muhakeme Merkezi</h2>
            </div>
         </div>

         <div className="flex items-center gap-4 relative z-10">
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
               {[
                 { id: 'h2h', label: 'H2H KIYAS', icon: '⚖️' },
                 { id: 'team_fit', label: 'EKİP UYUMU', icon: '🧩' },
                 { id: 'adaptation', label: 'ADAPTASYON', icon: '🚀' }
               ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-slate-900 shadow-2xl scale-105' : 'text-slate-500 hover:text-white'}`}
                  >
                     <span>{t.icon}</span>
                     <span>{t.label}</span>
                  </button>
               ))}
            </div>
            <button 
               onClick={() => setIsChatOpen(true)}
               disabled={selectedCandidates.length < 1}
               className="p-5 bg-white/10 hover:bg-orange-600 text-white rounded-[2rem] transition-all shadow-xl disabled:opacity-20 group"
            >
               <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
            <button 
               onClick={() => setIsExportOpen(true)}
               disabled={!comparisonReport && !onboardingPlan && !teamFitReport}
               className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-95 disabled:opacity-20"
            >
               DOSYAYI YAYINLA
            </button>
         </div>
         <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
         
         {/* SIDEBAR: CANDIDATE SELECTOR */}
         <div className="col-span-12 lg:col-span-3 flex flex-col bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
               <div>
                  <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">DOSYA SEÇİMİ</h4>
                  <p className="text-[10px] font-bold text-slate-300 mt-1">Maksimum 2 Aday</p>
               </div>
               <span className="px-4 py-2 bg-slate-950 text-white rounded-xl text-[12px] font-black shadow-lg">{selectedIds.length} / 2</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
               {analyzedCandidates.length === 0 ? (
                  <div className="py-20 text-center opacity-20 grayscale">
                     <p className="text-[11px] font-black uppercase tracking-widest italic">Analiz edilmiş aday bulunamadı</p>
                  </div>
               ) : (
                  analyzedCandidates.map(c => (
                     <button 
                       key={c.id} 
                       onClick={() => toggleCandidate(c.id)}
                       className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center gap-5 text-left group relative ${
                         selectedIds.includes(c.id) 
                         ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.03] translate-x-2' 
                         : 'bg-white border-slate-100 text-slate-500 hover:border-orange-300'
                       }`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${selectedIds.includes(c.id) ? 'bg-orange-600 shadow-xl' : 'bg-slate-100 text-slate-300 group-hover:bg-orange-100'}`}>
                           {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[14px] font-black uppercase truncate leading-tight mb-1">{c.name}</p>
                           <p className={`text-[9px] font-bold uppercase truncate opacity-60 ${selectedIds.includes(c.id) ? 'text-slate-400' : 'text-slate-400'}`}>{c.branch}</p>
                        </div>
                        <div className="text-right shrink-0">
                           <p className={`text-[15px] font-black ${selectedIds.includes(c.id) ? 'text-orange-500' : 'text-slate-900'}`}>%{c.report?.score}</p>
                        </div>
                     </button>
                  ))
               )}
            </div>
         </div>

         {/* MAIN WORKSPACE: BENTO INTERFACE */}
         <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 overflow-hidden">
            {selectedCandidates.length === 0 ? (
               <div className="flex-1 bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center opacity-30 grayscale p-24 text-center">
                  <div className="w-48 h-48 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 shadow-inner border border-slate-100 relative group transition-all hover:scale-110">
                     <svg className="w-24 h-24 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                     <div className="absolute inset-0 bg-orange-600/5 rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 uppercase tracking-[0.5em] mb-6">Muhakeme Alanı</h3>
                  <p className="text-[14px] font-bold uppercase tracking-widest text-slate-400 max-w-lg leading-relaxed">
                     Liyakat Delta Analizi veya Ekip DNA uyumu için soldan dosyaları aktive edin.
                  </p>
               </div>
            ) : (
               <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar pr-4 pb-24">
                  
                  {/* TAB 1: H2H DELTA ANALİZİ */}
                  {activeTab === 'h2h' && (
                     <div className="space-y-6 animate-slide-up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[480px]">
                           {/* RADAR KART */}
                           <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
                              <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 border-l-4 border-orange-600 pl-8">LİYAKAT SPEKTRUM KIYASI</h4>
                              <div className="flex-1 min-h-0">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={chartData} outerRadius="75%">
                                       <PolarGrid stroke="#f1f5f9" />
                                       {/* @fix: Changed 'fontWeights' to 'fontWeight' at line 229 to fix property error. */}
                                       <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                                       {selectedCandidates.map((c, i) => (
                                          <Radar key={c.id} name={c.name} dataKey={c.name} stroke={i === 0 ? '#ea580c' : '#0f172a'} fill={i === 0 ? '#ea580c' : '#0f172a'} fillOpacity={0.2} strokeWidth={4} />
                                       ))}
                                       <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                                       <Tooltip contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px' }} />
                                    </RadarChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>

                           {/* BAR KART */}
                           <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                              <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 border-l-4 border-slate-900 pl-8">BİLİMSEL SKOR DAĞILIMI</h4>
                              <div className="flex-1 min-h-0">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} barGap={6}>
                                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                       <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900 }} />
                                       <YAxis hide domain={[0, 100]} />
                                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                       {selectedCandidates.map((c, i) => (
                                          <Bar key={c.id} dataKey={c.name} fill={i === 0 ? '#ea580c' : '#0f172a'} radius={[10, 10, 0, 0]} barSize={28} />
                                       ))}
                                    </BarChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>
                        </div>

                        {/* ANALİZ BUTONU VE SONUÇ PANELİ */}
                        <div className="bg-slate-950 p-16 rounded-[5.5rem] text-white relative overflow-hidden group border border-white/5 shadow-3xl">
                           <div className="relative z-10 space-y-12">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(234,88,12,0.5)]">
                                       <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <div>
                                       <h4 className="text-2xl font-black uppercase tracking-widest text-orange-500">Nöral Delta Sentezi</h4>
                                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">İki Aday Arasındaki Görünmez Farkları Oku</p>
                                    </div>
                                 </div>
                                 <button 
                                   onClick={handleRunAnalysis}
                                   disabled={isAnalysing || selectedCandidates.length < 2}
                                   className="px-14 py-6 bg-white text-slate-950 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20"
                                 >
                                    {isAnalysing ? 'MUHAKEME MOTORU AKTİF...' : 'DERİN DELTA ANALİZİ'}
                                 </button>
                              </div>

                              {comparisonReport ? (
                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-scale-in">
                                    <div className="space-y-10">
                                       <div className="p-10 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-xl relative overflow-hidden">
                                          <h6 className="text-[11px] font-black text-orange-500 uppercase mb-6 tracking-[0.4em]">Yönetici Özeti</h6>
                                          <p className="text-2xl font-medium text-slate-200 leading-relaxed italic tracking-tight">"{comparisonReport.summary}"</p>
                                          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl"></div>
                                       </div>
                                       <div className="p-10 bg-emerald-500/10 rounded-[4rem] border border-emerald-500/20">
                                          <h6 className="text-[11px] font-black text-emerald-400 uppercase mb-6 tracking-[0.4em]">Stratejik Üstünlük</h6>
                                          <p className="text-lg font-bold text-emerald-50 leading-relaxed uppercase">{comparisonReport.winnerAdvantage}</p>
                                       </div>
                                    </div>
                                    <div className="space-y-6">
                                       <div className="p-10 bg-rose-500/10 rounded-[4rem] border border-rose-500/20">
                                          <h6 className="text-[11px] font-black text-rose-500 uppercase mb-6 tracking-[0.4em]">Kritik Risk Alanı</h6>
                                          <p className="text-base font-bold text-rose-100 italic">"{comparisonReport.criticalRisk}"</p>
                                       </div>
                                       <div className="p-10 bg-blue-500/10 rounded-[4rem] border border-blue-500/20">
                                          <h6 className="text-[11px] font-black text-blue-400 uppercase mb-6 tracking-[0.4em]">DNA Analizi (Klinik)</h6>
                                          <p className="text-base font-medium text-blue-50 leading-relaxed">{comparisonReport.clinicalDNAComparison}</p>
                                       </div>
                                       <div className="p-10 bg-orange-600/10 rounded-[4rem] border border-orange-600/20">
                                          <h6 className="text-[11px] font-black text-orange-400 uppercase mb-6 tracking-[0.4em]">Oryantasyon Tavsiyesi</h6>
                                          <p className="text-base font-bold text-orange-100">{comparisonReport.onboardingRecommendation}</p>
                                       </div>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="py-24 flex flex-col items-center justify-center opacity-30 grayscale space-y-6">
                                    <div className="w-20 h-20 border-2 border-dashed border-slate-500 rounded-full flex items-center justify-center text-4xl">?</div>
                                    <p className="text-[14px] font-black uppercase tracking-[0.6em]">Veri Sentezi Bekleniyor</p>
                                 </div>
                              )}
                           </div>
                           <div className="absolute -left-60 -top-60 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[200px]"></div>
                        </div>
                     </div>
                  )}

                  {/* TAB 2: EKİP UYUMU (DNA MATCHING) */}
                  {activeTab === 'team_fit' && (
                     <div className="space-y-8 animate-slide-up">
                        <div className="bg-white p-16 rounded-[5.5rem] border border-slate-200 shadow-xl space-y-16">
                           <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-12">
                              <div>
                                 <h4 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Ekip DNA Uyumu</h4>
                                 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-4">Organizasyonel Sağlık Analizi</p>
                              </div>
                              <button 
                                onClick={handleRunAnalysis}
                                disabled={isAnalysing}
                                className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl"
                              >
                                {isAnalysing ? 'TARANIYOR...' : 'DNA EŞLEŞTİR'}
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              {selectedCandidates.map(c => (
                                 <div key={c.id} className="p-12 bg-slate-50 rounded-[4.5rem] border-2 border-transparent hover:border-orange-500 hover:bg-white transition-all group flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="relative z-10 space-y-10">
                                       <div className="flex justify-between items-start">
                                          <div>
                                             <p className="text-[14px] font-black text-slate-900 uppercase tracking-widest">{c.name}</p>
                                             <p className="text-[10px] font-bold text-orange-600 uppercase mt-1">{c.branch}</p>
                                          </div>
                                          <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">🧩</span>
                                       </div>
                                       
                                       <div className="space-y-4">
                                          <div className="flex justify-between items-end">
                                             <p className="text-6xl font-black text-slate-950">%{c.report?.predictiveMetrics?.learningVelocity || 0}</p>
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">ADAPTASYON HIZI</p>
                                          </div>
                                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                             <div className="h-full bg-orange-600 shadow-[0_0_15px_#ea580c] transition-all duration-1000" style={{ width: `${c.report?.predictiveMetrics?.learningVelocity}%` }}></div>
                                          </div>
                                       </div>

                                       <div className="space-y-6 pt-6 border-t border-slate-200">
                                          <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">KLİNİK DNA İZİ</h6>
                                          <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic opacity-80 group-hover:opacity-100">"{c.report?.detailedAnalysisNarrative?.substring(0, 200)}..."</p>
                                       </div>
                                    </div>
                                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 </div>
                              ))}
                           </div>

                           {teamFitReport && (
                              <div className="p-12 bg-orange-600 rounded-[4.5rem] text-white shadow-2xl animate-scale-in">
                                 <h5 className="text-[14px] font-black uppercase tracking-[0.5em] mb-10 text-orange-200">Stratejik İK Tavsiyesi</h5>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    <div className="space-y-4">
                                       <span className="text-[10px] font-black uppercase tracking-widest opacity-60">EKİP ETKİSİ</span>
                                       <p className="text-lg font-bold leading-snug uppercase">"{teamFitReport.executiveSummary}"</p>
                                    </div>
                                    <div className="space-y-4">
                                       <span className="text-[10px] font-black uppercase tracking-widest opacity-60">KRİTİK RİSK</span>
                                       <p className="text-lg font-bold leading-snug text-slate-900">{teamFitReport.criticalRiskArea}</p>
                                    </div>
                                    <div className="space-y-4">
                                       <span className="text-[10px] font-black uppercase tracking-widest opacity-60">KARAR ÖNERİSİ</span>
                                       <p className="bg-white/10 p-6 rounded-3xl border border-white/20 font-bold italic">{teamFitReport.recommendedAction}</p>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* TAB 3: ADAPTASYON ROTASI */}
                  {activeTab === 'adaptation' && (
                     <div className="space-y-8 animate-slide-up">
                        <div className="bg-white p-20 rounded-[6rem] border border-slate-200 shadow-sm text-center">
                           {!onboardingPlan ? (
                              <div className="space-y-12">
                                 <div className="w-40 h-40 bg-slate-50 rounded-[5rem] border-4 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-10 shadow-inner relative group cursor-pointer" onClick={handleRunAnalysis}>
                                    <svg className="w-20 h-20 text-slate-300 group-hover:text-orange-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" /></svg>
                                    {isAnalysing && <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-[5rem] animate-spin"></div>}
                                 </div>
                                 <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">90 Günlük Nöral Oryantasyon</h3>
                                 <p className="text-slate-400 font-bold text-[14px] uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
                                    Adayın klinik liyakat zayıflıklarını mühürleyen ve onaran kişiye özel bir eğitim planı AI tarafından sentezlenir.
                                 </p>
                                 <button 
                                    onClick={handleRunAnalysis}
                                    disabled={isAnalysing || selectedCandidates.length < 1}
                                    className="px-20 py-7 bg-slate-950 text-white rounded-[3rem] font-black text-[14px] uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-20"
                                 >
                                    {isAnalysing ? 'MÜFREDAT DOKUNUYOR...' : 'ONBOARDING ROTASI ÜRET'}
                                 </button>
                              </div>
                           ) : (
                              <div className="space-y-16 animate-fade-in text-left">
                                 <div className="flex justify-between items-end border-b-2 border-slate-50 pb-12">
                                    <div>
                                       <h4 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Akademik Yol Haritası</h4>
                                       <div className="flex items-center gap-4 mt-6">
                                          <span className="px-5 py-2 bg-orange-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl">KRİTİK ODAK</span>
                                          <p className="text-2xl font-bold text-slate-700 italic">"{onboardingPlan.focusArea}"</p>
                                       </div>
                                    </div>
                                    <button onClick={() => setIsExportOpen(true)} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all">PLANI MÜHÜRLE & YAYINLA</button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    {[
                                      { phase: 'İlk 30 Gün: Temel Entegrasyon', color: 'orange', data: onboardingPlan.roadmap?.shortTerm, icon: '🌱' },
                                      { phase: '60. Gün: Klinik Derinleşme', color: 'slate', data: onboardingPlan.roadmap?.midTerm, icon: '🏛️' },
                                      { phase: '90. Gün: Bağımsız Uygulama', color: 'emerald', data: onboardingPlan.roadmap?.longTerm, icon: '💎' }
                                    ].map((step, idx) => (
                                       <div key={idx} className={`p-12 bg-white border-2 border-slate-50 rounded-[5rem] relative overflow-hidden group hover:border-${step.color === 'slate' ? 'slate-900' : step.color + '-600'} transition-all shadow-sm hover:shadow-2xl`}>
                                          <div className="flex justify-between items-start mb-10">
                                             <div className={`w-14 h-14 rounded-2xl bg-${step.color === 'slate' ? 'slate-900' : step.color + '-600'} text-white flex items-center justify-center font-black text-xl shadow-lg`}>{idx + 1}</div>
                                             <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{step.icon}</span>
                                          </div>
                                          <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">{step.phase}</h5>
                                          <p className="text-[14px] font-medium text-slate-500 leading-relaxed italic">"{step.data}"</p>
                                          <div className={`absolute bottom-0 left-0 w-full h-2 bg-${step.color === 'slate' ? 'slate-900' : step.color + '-600'}`}></div>
                                       </div>
                                    ))}
                                 </div>

                                 <div className="bg-slate-950 p-16 rounded-[6rem] border border-white/5 space-y-12 relative overflow-hidden">
                                    <h5 className="text-[14px] font-black text-orange-500 uppercase tracking-[0.5em] pl-10 border-l-8 border-orange-600">ATANAN AKADEMİK MODÜLLER</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                       {(onboardingPlan.curriculum || []).slice(0, 6).map((mod, i) => (
                                          <div key={i} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                                             <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500 font-black text-sm group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner">{i+1}</div>
                                                <div>
                                                   <p className="text-base font-bold text-white uppercase tracking-tight">{mod.title}</p>
                                                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Difficulty: {mod.difficulty}</p>
                                                </div>
                                             </div>
                                             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{(mod.units || []).length} ÜNİTE</span>
                                          </div>
                                       ))}
                                    </div>
                                    <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px]"></div>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DecisionSupportView;
