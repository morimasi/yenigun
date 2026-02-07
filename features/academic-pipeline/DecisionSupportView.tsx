
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, UniversalExportData, IDP, TrainingSlide } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Legend } from 'recharts';
import DecisionAdvisorChat from '../../components/admin/DecisionAdvisorChat';
import ExportStudio from '../../components/shared/ExportStudio';
import { armsService } from '../../services/ai/armsService';
import { poolService } from '../../services/ai/poolService';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<'comparison' | 'team_fit' | 'onboarding'>('comparison');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportStudioOpen, setIsExportStudioOpen] = useState(false);
  const [isAnalysingDelta, setIsAnalysingDelta] = useState(false);
  const [deltaAnalysis, setDeltaAnalysis] = useState<any>(null);

  const analyzedCandidates = useMemo(() => candidates.filter(c => !!c.report), [candidates]);
  const selectedCandidates = useMemo(() => 
    analyzedCandidates.filter(c => selectedIds.includes(c.id)), 
    [analyzedCandidates, selectedIds]
  );

  const dimensions = [
    { key: 'technicalExpertise', label: 'KLİNİK DERİNLİK' },
    { id: 'workEthics', label: 'ETİK & SINIRLAR' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'developmentOpenness', label: 'GELİŞİM' }
  ];

  const comparisonData = useMemo(() => {
    return dimensions.map(d => ({
      subject: d.label,
      ...(selectedCandidates[0] ? { [selectedCandidates[0].name]: selectedCandidates[0].report?.deepAnalysis?.[d.key || (d as any).id]?.score || 0 } : {}),
      ...(selectedCandidates[1] ? { [selectedCandidates[1].name]: selectedCandidates[1].report?.deepAnalysis?.[d.key || (d as any).id]?.score || 0 } : {})
    }));
  }, [selectedCandidates]);

  const handleRunDeltaAnalysis = async () => {
    if (selectedCandidates.length < 2) return;
    setIsAnalysingDelta(true);
    try {
      const res = await poolService.compareTwoCandidates(selectedCandidates[0], selectedCandidates[1], config);
      setDeltaAnalysis(res);
    } catch (e) {
      alert("Nöral Delta Analizi Başarısız.");
    } finally {
      setIsAnalysingDelta(false);
    }
  };

  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 2 ? [...prev, id] : prev)
    );
    setDeltaAnalysis(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-fade-in no-print">
      
      {isExportStudioOpen && selectedCandidates.length > 0 && (
         <ExportStudio 
            onClose={() => setIsExportStudioOpen(false)}
            data={{
               type: 'STRATEGIC_COMPARISON',
               entityName: selectedCandidates.length > 1 ? `${selectedCandidates[0].name} VS ${selectedCandidates[1].name}` : selectedCandidates[0].name,
               referenceId: `DEC-${Date.now().toString().slice(-6)}`,
               payload: { candidates: selectedCandidates, comparison: comparisonData, delta: deltaAnalysis }
            }}
         >
            <div className="p-10 space-y-12 bg-white w-[210mm] min-h-[297mm]">
               <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-3xl">YG</div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase">Stratejik Karar Dosyası</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Akademik Kurul Gizli Raporu</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase">TARİH: {new Date().toLocaleDateString()}</p>
                     <p className="text-[10px] font-black text-orange-600 uppercase">REF: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-10">
                  {selectedCandidates.map(c => (
                     <div key={c.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-200">
                        <span className="text-[10px] font-black text-slate-400 uppercase mb-2 block">{c.branch}</span>
                        <h4 className="text-2xl font-black text-slate-900 uppercase mb-4">{c.name}</h4>
                        <div className="flex items-end gap-2">
                           <span className="text-5xl font-black text-slate-900">%{c.report?.score}</span>
                           <span className="text-[10px] font-bold text-orange-600 uppercase mb-2">LİYAKAT</span>
                        </div>
                     </div>
                  ))}
               </div>

               {deltaAnalysis && (
                  <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-8">
                     <h4 className="text-xl font-black uppercase tracking-widest border-l-4 border-orange-600 pl-6">Nöral Delta Analizi</h4>
                     <p className="text-lg font-medium italic opacity-90 leading-relaxed text-justify">"{deltaAnalysis.summary}"</p>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                           <h5 className="text-[10px] font-black text-orange-500 uppercase mb-4">KRİTİK AVANTAJ</h5>
                           <p className="text-sm font-bold">{deltaAnalysis.winnerAdvantage}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                           <h5 className="text-[10px] font-black text-rose-500 uppercase mb-4">GİZLİ RİSK ALANI</h5>
                           <p className="text-sm font-bold">{deltaAnalysis.criticalRisk}</p>
                        </div>
                     </div>
                  </div>
               )}

               <div className="pt-20 grid grid-cols-3 gap-8">
                  {['KLİNİK DİREKTÖR', 'AKADEMİK BAŞKAN', 'KURUCU TEMSİLCİSİ'].map(t => (
                     <div key={t} className="text-center">
                        <div className="h-16 border-b border-slate-300 mb-4"></div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">{t}</p>
                     </div>
                  ))}
               </div>
            </div>
         </ExportStudio>
      )}

      {isChatOpen && <DecisionAdvisorChat candidates={selectedCandidates} onClose={() => setIsChatOpen(false)} />}

      {/* TOP HEADER: STRATEGIC CONTROL BAR */}
      <div className="bg-slate-950 p-6 rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-between relative overflow-hidden shrink-0">
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Stratejik Karar Stüdyosu</h2>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">İkili Kıyaslama ve Organizasyonel Uyum Analizi</p>
            </div>
         </div>

         <div className="flex items-center gap-3 relative z-10">
            <button onClick={() => setIsChatOpen(true)} className="p-4 bg-white/5 hover:bg-orange-600 text-white rounded-2xl transition-all group">
               <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
            <button 
               onClick={() => setIsExportStudioOpen(true)}
               disabled={selectedCandidates.length === 0}
               className="px-10 py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl disabled:opacity-20"
            >
               DOSYAYI YAYINLA
            </button>
         </div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
         
         {/* SELECTION SIDEBAR */}
         <div className="col-span-12 lg:col-span-3 flex flex-col bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">DOSYA SEÇİMİ</h4>
               <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black">{selectedIds.length} / 2</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
               {analyzedCandidates.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => toggleCandidate(c.id)}
                    className={`w-full p-5 rounded-[2.5rem] border-2 transition-all flex items-center gap-4 text-left group ${
                      selectedIds.includes(c.id) 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' 
                      : 'bg-white border-transparent text-slate-500 hover:border-orange-300 hover:bg-slate-50'
                    }`}
                  >
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 transition-all ${selectedIds.includes(c.id) ? 'bg-orange-600' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100'}`}>
                        {c.name.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-black uppercase truncate leading-none mb-1.5">{c.name}</p>
                        <p className={`text-[9px] font-bold uppercase truncate opacity-60 ${selectedIds.includes(c.id) ? 'text-slate-400' : 'text-slate-500'}`}>{c.branch}</p>
                     </div>
                     <div className="text-right shrink-0">
                        <p className={`text-sm font-black ${selectedIds.includes(c.id) ? 'text-orange-500' : 'text-slate-900'}`}>%{c.report?.score}</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>

         {/* MAIN WORKSPACE: H2H COMPARISON */}
         <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 overflow-hidden">
            {selectedCandidates.length < 1 ? (
               <div className="flex-1 bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center opacity-30 p-20 text-center grayscale">
                  <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-8 shadow-inner">
                     <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 uppercase tracking-[0.4em] mb-4">Muhakeme Bekleniyor</h3>
                  <p className="text-[12px] font-bold uppercase text-slate-400 tracking-widest max-w-sm">Kıyaslamak istediğiniz en az bir (tercihen iki) aday dosyasını sol panelden aktive edin.</p>
               </div>
            ) : (
               <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                  
                  {/* CHART STAGE */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
                     <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm h-[450px] flex flex-col">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 border-l-4 border-orange-600 pl-6">LİYAKAT RADARI (H2H)</h4>
                        <div className="flex-1 w-full min-h-0">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={comparisonData}>
                                 <PolarGrid stroke="#f1f5f9" />
                                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                                 {selectedCandidates.map((c, i) => (
                                    <Radar 
                                      key={c.id} 
                                      name={c.name} 
                                      dataKey={c.name} 
                                      stroke={i === 0 ? '#ea580c' : '#0f172a'} 
                                      fill={i === 0 ? '#ea580c' : '#0f172a'} 
                                      fillOpacity={0.2} 
                                      strokeWidth={3} 
                                    />
                                 ))}
                                 <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                                 <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm h-[450px] flex flex-col">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 border-l-4 border-slate-900 pl-6">SKOR KARŞILAŞTIRMA</h4>
                        <div className="flex-1 w-full min-h-0">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={comparisonData} barGap={4}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                 <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 800 }} />
                                 <YAxis domain={[0, 100]} hide />
                                 <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                 {selectedCandidates.map((c, i) => (
                                    <Bar key={c.id} dataKey={c.name} fill={i === 0 ? '#ea580c' : '#0f172a'} radius={[6, 6, 0, 0]} barSize={24} />
                                 ))}
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>

                  {/* AI DELTA SENTEZİ */}
                  {selectedCandidates.length === 2 && (
                     <div className="bg-slate-900 p-12 rounded-[5rem] text-white relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                           <div className="flex-1 space-y-6">
                              <div className="flex items-center gap-4">
                                 <span className="w-4 h-4 bg-orange-600 rounded-full animate-ping"></span>
                                 <h4 className="text-xl font-black uppercase tracking-widest text-orange-500">Nöral Delta Sentezi</h4>
                              </div>
                              {deltaAnalysis ? (
                                 <div className="space-y-8 animate-fade-in">
                                    <p className="text-2xl font-bold text-slate-300 leading-relaxed italic text-justify">"{deltaAnalysis.summary}"</p>
                                    <div className="grid grid-cols-2 gap-8">
                                       <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                          <h6 className="text-[10px] font-black text-orange-500 uppercase mb-4 tracking-widest">HAKİMİYET ALANI</h6>
                                          <p className="text-sm font-bold">{deltaAnalysis.winnerAdvantage}</p>
                                       </div>
                                       <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                          <h6 className="text-[10px] font-black text-rose-500 uppercase mb-4 tracking-widest">KRİTİK RİSK NOKTASI</h6>
                                          <p className="text-sm font-bold">{deltaAnalysis.criticalRisk}</p>
                                       </div>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="space-y-4">
                                    <p className="text-lg text-slate-500 uppercase tracking-widest font-black">AI Muhakemesi Hazır</p>
                                    <button 
                                      onClick={handleRunDeltaAnalysis}
                                      disabled={isAnalysingDelta}
                                      className="px-12 py-5 bg-orange-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-95"
                                    >
                                       {isAnalysingDelta ? 'SENTEZLENİYOR...' : 'DELTA ANALİZİNİ BAŞLAT'}
                                    </button>
                                 </div>
                              )}
                           </div>
                           <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shrink-0">
                              <span className="text-6xl">⚖️</span>
                           </div>
                        </div>
                        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]"></div>
                     </div>
                  )}

                  {/* KADRO UYUM PROJEKSİYONU */}
                  <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-sm space-y-10">
                     <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Organizasyonel Uyum (Team DNA)</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predictive Analytics</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {selectedCandidates.map(c => (
                           <div key={c.id} className="p-8 bg-slate-50 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between hover:border-orange-500 transition-all group">
                              <div className="space-y-4">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.name}</p>
                                 <h5 className="text-4xl font-black text-slate-900">%{c.report?.predictiveMetrics?.learningVelocity || 0}</h5>
                                 <p className="text-[9px] font-bold text-orange-600 uppercase">TAKIM ADAPTASYON HIZI</p>
                              </div>
                              <div className="mt-8 pt-6 border-t border-slate-200">
                                 <p className="text-[11px] font-bold text-slate-600 italic leading-relaxed line-clamp-3">"{c.report?.recommendation || 'Analiz verisi bekleniyor.'}"</p>
                              </div>
                           </div>
                        ))}
                        <div className="p-10 bg-slate-950 rounded-[4rem] text-white flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden">
                           <div className="relative z-10">
                              <div className="text-4xl mb-4">🧩</div>
                              <p className="text-[11px] font-black uppercase tracking-widest text-orange-500 mb-2">EKİP BOŞLUĞU ANALİZİ</p>
                              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-tighter leading-tight">Mevcut kadrodaki "Klinik Denetçi" açığını bu adaylardan hangisi kapatır?</p>
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent opacity-50"></div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DecisionSupportView;
