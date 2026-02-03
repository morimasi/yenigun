
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, UniversalExportData, IDP, TrainingSlide } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import DecisionAdvisorChat from './DecisionAdvisorChat';
import ExportStudio from '../shared/ExportStudio';
import CandidateReport from '../CandidateReport';
import { armsService } from '../../services/ai/armsService';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config }) => {
  // --- STATE MANAGEMENT ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<'comparison' | 'team_fit' | 'onboarding' | 'presentation'>('comparison');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportStudioOpen, setIsExportStudioOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [customIDP, setCustomIDP] = useState<IDP | null>(null);
  const [customSlides, setCustomSlides] = useState<TrainingSlide[]>([]);

  // --- DATA COMPUTATION ---
  const analyzedCandidates = useMemo(() => candidates.filter(c => !!c.report), [candidates]);
  const selectedCandidates = useMemo(() => 
    analyzedCandidates.filter(c => selectedIds.includes(c.id)), 
    [analyzedCandidates, selectedIds]
  );

  const dimensions = [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'technicalExpertise', label: 'KLİNİK DERİNLİK' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'academicPedagogy', label: 'AKADEMİK GÜÇ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' }
  ];

  const comparisonData = useMemo(() => {
    return dimensions.map(d => ({
      subject: d.label,
      ...selectedCandidates.reduce((acc, c) => ({
        ...acc,
        [c.name]: c.report?.deepAnalysis?.[d.key]?.score || 0
      }), {})
    }));
  }, [selectedCandidates]);

  // --- ACTIONS ---
  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 2 ? [...prev, id] : prev)
    );
  };

  const handleGenerateOnboarding = async () => {
    if (selectedCandidates.length === 0) return;
    setIsGeneratingPlan(true);
    try {
      const primaryCandidate = selectedCandidates[0];
      const idp = await armsService.generateIDP(primaryCandidate);
      const slides = await armsService.generateTrainingSlides(idp, primaryCandidate.branch);
      setCustomIDP(idp);
      setCustomSlides(slides);
      setActiveWorkspace('onboarding');
    } catch (e) {
      alert("Nöral Planlama Hatası.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleArchiveDecision = async () => {
    if (selectedCandidates.length < 2) return;
    const scenarioName = `KIYAS-${selectedCandidates[0].name.split(' ')[0]}-VS-${selectedCandidates[1].name.split(' ')[0]}`;
    
    const archivePayload = {
      id: `DEC-${Date.now()}`,
      name: scenarioName,
      branch: 'STRATEJİK KARAR',
      email: `decision.${Date.now()}@yenigun.local`,
      status: 'archived',
      archiveCategory: 'TALENT_POOL_ANALYTICS',
      archiveNote: `İki aday arasında yapılan derin kıyaslama sonucu. 1. Aday: ${selectedCandidates[0].name} (%${selectedCandidates[0].report?.score}), 2. Aday: ${selectedCandidates[1].name} (%${selectedCandidates[1].report?.score})`,
      report: { 
         score: 100, 
         summary: "Stratejik Kurul Karar Dosyası",
         comparisonSnapshot: comparisonData 
      }
    };

    try {
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(archivePayload)
      });
      alert("Karar senaryosu 'Dijital Arşiv' modülüne mühürlendi.");
    } catch (e) {
      alert("Arşivleme hatası.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-fade-in no-print">
      
      {/* EXPORT OVERLAY */}
      {isExportStudioOpen && selectedCandidates.length > 0 && (
         <ExportStudio 
            onClose={() => setIsExportStudioOpen(false)}
            data={{
               type: 'TALENT_POOL_ANALYTICS',
               entityName: selectedCandidates.length > 1 ? 'İkili Kıyas Analizi' : selectedCandidates[0].name,
               referenceId: `DEC-${Date.now().toString().slice(-6)}`,
               payload: { candidates: selectedCandidates, comparison: comparisonData, idp: customIDP }
            }}
         >
            <div className="p-10 space-y-12">
               <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
                  <h3 className="text-3xl font-black uppercase tracking-widest mb-6">Stratejik Karar Özeti</h3>
                  <div className="grid grid-cols-2 gap-10">
                     {selectedCandidates.map(c => (
                        <div key={c.id} className="p-8 bg-white/5 rounded-3xl border border-white/10">
                           <p className="text-[10px] font-black text-orange-500 mb-2 uppercase">{c.branch}</p>
                           <p className="text-2xl font-black">{c.name}</p>
                           <p className="text-5xl font-black mt-4 text-white">%{c.report?.score}</p>
                        </div>
                     ))}
                  </div>
               </div>
               {/* PDF Sayfalama logic'i ExportStudio tarafından id="publishing-canvas" içinde yönetilir */}
            </div>
         </ExportStudio>
      )}

      {/* TOP HEADER: STRATEGIC CONTROL BAR */}
      <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-between relative overflow-hidden shrink-0">
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">KOMUTA MERKEZİ</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mt-1">Akademik Karar Destek</h2>
            </div>
         </div>

         <div className="flex items-center gap-3 relative z-10">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 mr-4">
               {[
                 { id: 'comparison', label: 'H2H KIYAS' },
                 { id: 'team_fit', label: 'EKİP UYUMU' },
                 { id: 'onboarding', label: 'ADAPTASYON' }
               ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveWorkspace(t.id as any)}
                    className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeWorkspace === t.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                  >
                     {t.label}
                  </button>
               ))}
            </div>
            <button 
               onClick={() => setIsChatOpen(true)}
               disabled={selectedCandidates.length < 1}
               className="p-3 bg-white/10 hover:bg-orange-600 text-white rounded-xl transition-all disabled:opacity-20"
               title="AI Muhakeme"
            >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
            <button 
               onClick={() => setIsExportStudioOpen(true)}
               disabled={selectedCandidates.length === 0}
               className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-20"
            >
               DOSYAYI YAYINLA
            </button>
         </div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
         
         {/* SIDEBAR: SELECTION LIST */}
         <div className="col-span-12 lg:col-span-3 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ADAY SEÇİMİ</h4>
               <span className="px-2 py-1 bg-slate-900 text-white rounded text-[9px] font-bold">{selectedIds.length} / 2</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
               {analyzedCandidates.length === 0 ? (
                  <div className="py-20 text-center opacity-20 grayscale scale-75">
                     <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                     <p className="text-[10px] font-black uppercase tracking-widest">Analiz Verisi Yok</p>
                  </div>
               ) : (
                  analyzedCandidates.map(c => (
                     <button 
                       key={c.id} 
                       onClick={() => toggleCandidate(c.id)}
                       className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                         selectedIds.includes(c.id) 
                         ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-x-1' 
                         : 'bg-white border-slate-100 text-slate-500 hover:border-orange-300'
                       }`}
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${selectedIds.includes(c.id) ? 'bg-orange-600' : 'bg-slate-50 text-slate-400 group-hover:bg-orange-100'}`}>
                           {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[11px] font-black uppercase truncate leading-tight mb-1">{c.name}</p>
                           <p className={`text-[8px] font-bold uppercase truncate opacity-60 ${selectedIds.includes(c.id) ? 'text-slate-400' : 'text-slate-400'}`}>{c.branch}</p>
                        </div>
                        <div className="text-right shrink-0">
                           <p className={`text-[12px] font-black ${selectedIds.includes(c.id) ? 'text-orange-500' : 'text-slate-900'}`}>%{c.report?.score}</p>
                        </div>
                     </button>
                  ))
               )}
            </div>
            
            {selectedCandidates.length > 1 && (
               <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button onClick={handleArchiveDecision} className="w-full py-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                     SENARYOYU ARŞİVLE
                  </button>
               </div>
            )}
         </div>

         {/* MAIN WORKSPACE: THE COMMAND STAGE */}
         <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 overflow-hidden">
            
            {selectedCandidates.length === 0 ? (
               <div className="flex-1 bg-white border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center opacity-30 grayscale p-20 text-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-[4rem] border border-slate-100 flex items-center justify-center mb-10 shadow-inner">
                     <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <h3 className="text-4xl font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Muhakeme Sahnesi</h3>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 max-w-sm">Kıyaslamak veya planlamak istediğiniz aday dosyalarını sol panelden aktive edin.</p>
               </div>
            ) : (
               <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                  
                  {/* WORKSPACE 1: COMPARISON (HEAD TO HEAD) */}
                  {activeWorkspace === 'comparison' && (
                     <div className="space-y-4 animate-scale-in">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                           {/* Radar Matrisi */}
                           <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-[500px] relative overflow-hidden">
                              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4 mb-8">Klinik Spektrum Analizi (H2H)</h4>
                              <ResponsiveContainer width="100%" height="100%">
                                 <RadarChart data={comparisonData}>
                                    <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                                    {selectedCandidates.map((c, i) => (
                                       <Radar 
                                          key={c.id} 
                                          name={c.name} 
                                          dataKey={c.name} 
                                          stroke={i === 0 ? '#ea580c' : '#0f172a'} 
                                          fill={i === 0 ? '#ea580c' : '#0f172a'} 
                                          fillOpacity={i === 0 ? 0.1 : 0.05} 
                                          strokeWidth={i === 0 ? 4 : 2}
                                          dot={{ r: 4, fill: i === 0 ? '#ea580c' : '#0f172a' }}
                                       />
                                    ))}
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }} />
                                 </RadarChart>
                              </ResponsiveContainer>
                           </div>
                           
                           {/* Quick Insight & Verdict */}
                           <div className="lg:col-span-4 flex flex-col gap-4">
                              <div className="flex-1 bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group border border-white/5">
                                 <div className="relative z-10">
                                    <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8 border-b border-white/10 pb-4">ÜST KURUL ÖZETİ</h5>
                                    <p className="text-[14px] font-medium text-slate-300 leading-relaxed italic">
                                       {selectedCandidates.length > 1 ? (
                                          <>En keskin ayrışma <strong>{comparisonData.sort((a:any, b:any) => Math.abs(Object.values(b)[1] as number - (Object.values(b)[2] as number)) - Math.abs(Object.values(a)[1] as number - (Object.values(a)[2] as number)))[0]?.subject}</strong> alanında saptanmıştır. {selectedCandidates[0].name.split(' ')[0]} klinik derinlikte, {selectedCandidates[1].name.split(' ')[0]} ise kurumsal uyumda daha stabildir.</>
                                       ) : (
                                          <>{selectedCandidates[0].name} için hazırlanan klinik profil %{selectedCandidates[0].report?.score} liyakat puanıyla standardın üzerindedir.</>
                                       )}
                                    </p>
                                 </div>
                                 <div className="mt-8 relative z-10">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">STRATEJİK TAVSİYE:</span>
                                    <div className="px-6 py-3 bg-orange-600 rounded-xl inline-block text-[11px] font-black uppercase tracking-widest shadow-xl">
                                       {selectedCandidates[0].report!.score >= (selectedCandidates[1]?.report?.score || 0) ? selectedCandidates[0].name : selectedCandidates[1].name} ÖNCELİKLİ
                                    </div>
                                 </div>
                                 <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]"></div>
                              </div>
                              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col justify-center text-center shadow-sm">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">DOĞRULUK ÇARPANLARI</span>
                                 <div className="flex items-center justify-center gap-6">
                                    {selectedCandidates.map((c, i) => (
                                       <div key={c.id} className="space-y-1">
                                          <p className={`text-2xl font-black ${i === 0 ? 'text-slate-900' : 'text-slate-400'}`}>%{c.report?.integrityIndex}</p>
                                          <p className="text-[8px] font-bold text-slate-400 uppercase">DÜRÜSTLÜK</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Delta Bar Chart: Gaps */}
                        {selectedCandidates.length > 1 && (
                           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
                              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-slate-900 pl-4">Metodolojik Sapma (Delta Analysis)</h4>
                              <div className="h-64">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={comparisonData}>
                                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                       <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} domain={[0, 100]} />
                                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', fontSize: '10px' }} />
                                       <Bar dataKey={selectedCandidates[0].name} fill="#ea580c" barSize={30} radius={[6, 6, 0, 0]} />
                                       <Bar dataKey={selectedCandidates[1].name} fill="#0f172a" barSize={30} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* WORKSPACE 2: TEAM FIT (PREDICTIVE ALIGNMENT) */}
                  {activeWorkspace === 'team_fit' && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                              <div>
                                 <h3 className="text-4xl font-black tracking-tighter uppercase leading-tight mb-8">Ekip Uyum Projeksiyonu</h3>
                                 <p className="text-lg font-medium text-slate-300 leading-relaxed italic opacity-80">
                                    Adayın nöral profili, mevcut akademik kadronun "Klinik Direnç" ve "Pedagojik Derinlik" ortalamalarıyla simüle edilmiştir.
                                 </p>
                              </div>
                              <div className="flex justify-center">
                                 <div className="w-64 h-64 rounded-full border-[16px] border-white/5 border-t-orange-600 flex items-center justify-center relative">
                                    <div className="text-center">
                                       <p className="text-6xl font-black leading-none">%{selectedCandidates[0].report?.score}</p>
                                       <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-2">SİNERJİ SKORU</p>
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                                       <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="absolute -left-20 -top-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px]"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {[
                              { l: 'KÜLTÜREL ADAPTASYON', v: 88, c: 'text-blue-500' },
                              { l: 'BİLİŞSEL TAMAMLAYICILIK', v: 72, c: 'text-emerald-500' },
                              { l: 'METODOLOJİK REZONANS', v: 94, c: 'text-orange-500' }
                           ].map(m => (
                              <div key={m.l} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{m.l}</p>
                                 <p className={`text-4xl font-black ${m.c}`}>%{m.v}</p>
                                 <div className="mt-4 h-1 bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full ${m.c.replace('text-', 'bg-')}`} style={{ width: `${m.v}%` }}></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* WORKSPACE 3: ONBOARDING & ADAPTATION PLAN */}
                  {activeWorkspace === 'onboarding' && (
                     <div className="space-y-6 animate-slide-up">
                        {!customIDP ? (
                           <div className="bg-white p-20 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                              <button 
                                onClick={handleGenerateOnboarding}
                                disabled={isGeneratingPlan}
                                className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-30"
                              >
                                 {isGeneratingPlan ? 'NÖRAL PLAN ÜRETİLİYOR...' : 'KİŞİYE ÖZEL ADAPTASYON PLANI ÜRET'}
                              </button>
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-8 max-w-xs">Adayın zayıf yönlerini kapatacak 90 günlük gelişim rotası AI tarafından çizilecektir.</p>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                              <div className="lg:col-span-4 space-y-4">
                                 <div className="bg-orange-600 p-10 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden">
                                    <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-6">KRİTİK ODAK ALANI</h4>
                                    <p className="text-2xl font-black leading-tight italic">"{customIDP.focusArea}"</p>
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                                 </div>
                                 <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">90 GÜNLÜK MILESTONES</h5>
                                    <div className="space-y-6">
                                       <div className="border-l-2 border-slate-100 pl-6 relative">
                                          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-orange-600 rounded-full"></div>
                                          <p className="text-[11px] font-bold text-slate-900 uppercase">30 GÜN: Oryantasyon</p>
                                          <p className="text-[10px] text-slate-500 italic mt-1 leading-relaxed">{customIDP.roadmap.shortTerm}</p>
                                       </div>
                                       <div className="border-l-2 border-slate-100 pl-6 relative">
                                          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-slate-900 rounded-full"></div>
                                          <p className="text-[11px] font-bold text-slate-900 uppercase">60 GÜN: Klinik Uygulama</p>
                                          <p className="text-[10px] text-slate-500 italic mt-1 leading-relaxed">{customIDP.roadmap.midTerm}</p>
                                       </div>
                                       <div className="border-l-2 border-slate-100 pl-6 relative">
                                          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-slate-400 rounded-full"></div>
                                          <p className="text-[11px] font-bold text-slate-900 uppercase">90 GÜN: Tam Yetkinlik</p>
                                          <p className="text-[10px] text-slate-500 italic mt-1 leading-relaxed">{customIDP.roadmap.longTerm}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="lg:col-span-8 space-y-6">
                                 <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-10">
                                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Kişiye Özel Eğitim Müfredatı</h4>
                                       <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">AI GENERATED DECK</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       {customSlides.slice(0, 4).map((s, i) => (
                                          <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-slate-900 hover:border-slate-900 transition-all cursor-default">
                                             <div className="flex items-center gap-4 mb-4">
                                                <span className="w-8 h-8 bg-white text-slate-900 rounded-xl flex items-center justify-center font-black text-xs shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">{i+1}</span>
                                                <p className="text-[10px] font-black uppercase tracking-tight text-slate-700 group-hover:text-white">{s.title}</p>
                                             </div>
                                             <p className="text-[9px] font-medium text-slate-400 line-clamp-2 italic leading-relaxed group-hover:text-slate-500">"{s.visualPrompt}"</p>
                                          </div>
                                       ))}
                                    </div>
                                    <div className="mt-10 pt-10 border-t border-slate-50 flex gap-4">
                                       <button onClick={() => alert("Sunum Kütüphanesine mühürlendi.")} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">SUNUMU KÜTÜPHANEYE EKLE</button>
                                       <button onClick={() => setActiveWorkspace('presentation')} className="px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">SUNUMU OYNAT</button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* WORKSPACE 4: PERSONALIZED PRESENTATION PLAYER (MINIMAL) */}
                  {activeWorkspace === 'presentation' && customSlides.length > 0 && (
                     <div className="flex-1 bg-slate-950 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col p-16 animate-fade-in">
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                           <span className="px-4 py-1.5 bg-orange-600/20 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12">YENİ GÜN AKADEMİ SUNUM MODU</span>
                           <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8">{customSlides[0].title}</h1>
                           <p className="text-2xl text-slate-400 italic max-w-3xl leading-relaxed">"{customSlides[0].subtitle || 'Adaptasyon ve Oryantasyon Programı'}"</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-12">
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ayrıntılı sunum için Sunum Stüdyosu modülünü kullanın.</p>
                           <button onClick={() => setActiveWorkspace('onboarding')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">ÇIKTI AL / GERİ DÖN</button>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none"></div>
                     </div>
                  )}

               </div>
            )}
         </div>
      </div>

      {/* MUHAKEME CHAT OVERLAY */}
      {isChatOpen && (
        <DecisionAdvisorChat 
          candidates={selectedCandidates} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default DecisionSupportView;
