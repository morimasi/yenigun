
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import DecisionAdvisorChat from './DecisionAdvisorChat';
import SimulationEngine from './SimulationEngine';
import { generateNeuralProjection } from '../../geminiService';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'comparison' | 'simulation' | 'prediction'>('comparison');
  
  // Projeksiyon State
  const [isProjecting, setIsProjecting] = useState(false);
  const [projectionData, setProjectionData] = useState<any>(null);

  const selectedCandidates = useMemo(() => 
    candidates.filter(c => selectedIds.includes(c.id)), 
    [candidates, selectedIds]
  );

  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 3 ? [...prev, id] : prev)
    );
  };

  const runProjection = async () => {
    if (selectedCandidates.length === 0) return;
    setIsProjecting(true);
    setProjectionData(null);
    try {
      const result = await generateNeuralProjection(selectedCandidates[0]);
      setProjectionData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProjecting(false);
    }
  };

  const comparisonData = useMemo(() => {
    const dimensions = [
      { key: 'workEthics', label: 'ETİK BÜTÜNLÜK' },
      { key: 'technicalExpertise', label: 'KLİNİK DERİNLİK' },
      { key: 'pedagogicalAnalysis', label: 'PEDAGOJİK YETKİ' },
      { key: 'sustainability', label: 'DİRENÇ (BURNOUT)' },
      { key: 'formality', label: 'KURUMSAL RESMİYET' },
      { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' }
    ];

    return dimensions.map(d => ({
      subject: d.label,
      fullMark: 100,
      ...selectedCandidates.reduce((acc, c) => ({
        ...acc,
        [c.name]: c.report?.deepAnalysis?.[d.key]?.score || 0
      }), {})
    }));
  }, [selectedCandidates]);

  const analysisInsights = useMemo(() => {
    if (selectedCandidates.length < 2) return null;
    const c1 = selectedCandidates[0];
    const c2 = selectedCandidates[1];
    const diffs = [
      { label: 'Etik', val: (c1.report?.deepAnalysis?.workEthics?.score || 0) - (c2.report?.deepAnalysis?.workEthics?.score || 0) },
      { label: 'Klinik', val: (c1.report?.deepAnalysis?.technicalExpertise?.score || 0) - (c2.report?.deepAnalysis?.technicalExpertise?.score || 0) },
      { label: 'Veli', val: (c1.report?.deepAnalysis?.parentStudentRelations?.score || 0) - (c2.report?.deepAnalysis?.parentStudentRelations?.score || 0) }
    ];
    return diffs.sort((a, b) => Math.abs(b.val) - Math.abs(a.val));
  }, [selectedCandidates]);

  return (
    <div className="space-y-10 animate-fade-in relative pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">STRATEJİK KOMUTA MERKEZİ</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Liyakat Simülasyonu ve Bilişsel Karar Destek Katmanı</p>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
           {['comparison', 'simulation', 'prediction'].map((t) => (
             <button 
               key={t}
               onClick={() => setActiveSubTab(t as any)}
               className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === t ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {t === 'comparison' ? 'Karşılaştırma' : t === 'simulation' ? 'Veli Simülatörü' : 'Nöral Projeksiyon'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ANALİZ HAVUZU (SELECTION BAR) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl text-white relative overflow-hidden border border-slate-800">
             <div className="relative z-10">
                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8">Analiz Havuzu</h4>
                <div className="space-y-4">
                   {candidates.filter(c => !!c.report).map(c => (
                     <div 
                       key={c.id} 
                       onClick={() => toggleCandidate(c.id)}
                       className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col gap-4 relative group ${
                         selectedIds.includes(c.id) ? 'bg-orange-600 border-orange-500 text-white shadow-xl' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                       }`}
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-black text-[11px] group-hover:bg-white group-hover:text-slate-900 transition-all">{c.report?.score}</div>
                           <span className="text-[11px] font-black uppercase truncate flex-1 tracking-tighter">{c.name}</span>
                        </div>
                        {selectedIds.includes(c.id) && (
                          <div className="flex gap-2">
                             <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white" style={{ width: `${c.report?.score}%` }}></div>
                             </div>
                          </div>
                        )}
                     </div>
                   ))}
                </div>
                <button onClick={() => setIsAdvisorOpen(true)} className="w-full mt-10 py-6 bg-white text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95">STRATEJİK DANIŞMAN</button>
             </div>
             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
             <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">BOYUT SÖZLÜĞÜ</h5>
             <div className="space-y-6">
                {[
                  { t: 'Klinik Derinlik', d: 'Teoriyi seans anında pratiğe dökme çevikliği.' },
                  { t: 'Etik Bütünlük', d: 'Veli manipülasyonuna karşı dürüstlük direnci.' },
                  { t: 'Direnç (Burnout)', d: 'Ağır vakalar karşısındaki psikolojik sürdürülebilirlik.' }
                ].map(item => (
                  <div key={item.t} className="group cursor-help border-l-2 border-slate-100 pl-4 hover:border-orange-600 transition-all">
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.t}</p>
                     <p className="text-[9px] font-bold text-slate-400 leading-tight mt-1">{item.d}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* ANA EKRAN */}
        <div className="lg:col-span-9">
           {selectedIds.length === 0 ? (
             <div className="h-[800px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
                <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-10 shadow-inner">
                  <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.8em] text-[14px] leading-relaxed italic">KARAR DESTEK İÇİN<br/>ADAY SEÇİNİZ</p>
             </div>
           ) : (
             <div className="bg-white rounded-[5rem] shadow-2xl border border-slate-100 p-12 min-h-[800px] animate-slide-up space-y-16">
                
                {/* 1. SEKME: KARŞILAŞTIRMA MATRİSİ */}
                {activeSubTab === 'comparison' && (
                  <div className="space-y-16">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-8 border-orange-600 pl-8">ÇAPRAZ YETKİNLİK MATRİSİ</h4>
                        <div className="flex gap-6">
                           {selectedCandidates.map((c, i) => (
                              <div key={c.id} className="flex items-center gap-3">
                                 <div className="w-4 h-4 rounded-lg" style={{ backgroundColor: ['#ea580c', '#0f172a', '#64748b'][i] }}></div>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.name.split(' ')[0]}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 h-[500px] bg-slate-50/50 rounded-[5rem] p-12 relative border border-slate-100">
                           <ResponsiveContainer width="100%" height="100%">
                             <RadarChart data={comparisonData}>
                               <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
                               <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                               {selectedCandidates.map((c, i) => (
                                 <Radar 
                                   key={c.id} 
                                   name={c.name} 
                                   dataKey={c.name} 
                                   stroke={['#ea580c', '#0f172a', '#64748b'][i]} 
                                   fill={['#ea580c', '#0f172a', '#64748b'][i]} 
                                   fillOpacity={0.12} 
                                   strokeWidth={5} 
                                   dot={{ r: 5, fill: ['#ea580c', '#0f172a', '#64748b'][i], strokeWidth: 2, stroke: '#fff' }}
                                 />
                               ))}
                               <Tooltip contentStyle={{ borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                             </RadarChart>
                           </ResponsiveContainer>
                        </div>

                        <div className="lg:col-span-5 space-y-8">
                           <div className="bg-slate-900 p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden">
                              <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-10">LİYAKAT MUHAKEMESİ</h5>
                              <div className="space-y-10">
                                 {analysisInsights ? (
                                    analysisInsights.map((insight, idx) => (
                                       <div key={idx} className="group">
                                          <div className="flex justify-between items-center mb-4">
                                             <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{insight.label} Farkı</span>
                                             <span className={`text-[12px] font-black ${insight.val > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                %{Math.abs(insight.val)} {insight.val > 0 ? 'Üstünlük' : 'Açık'}
                                             </span>
                                          </div>
                                          <p className="text-[13px] font-bold text-slate-300 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                                             {insight.val > 0 
                                                ? `${selectedCandidates[0].name}, ${insight.label.toLowerCase()} boyutunda daha stabil bir nöral profil çiziyor.` 
                                                : `${selectedCandidates[1].name}, bu boyutta kurum ortalamasının üzerinde liyakat sergiliyor.`
                                             }
                                          </p>
                                       </div>
                                    ))
                                 ) : (
                                    <p className="text-[12px] font-bold text-slate-400">Karşılaştırmalı analiz için en az iki aday seçilmelidir.</p>
                                 )}
                              </div>
                              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/5 rounded-full blur-[80px]"></div>
                           </div>
                           
                           <div className="p-10 bg-orange-50 rounded-[3.5rem] border border-orange-100 relative overflow-hidden">
                              <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-4">KURUL TAVSİYESİ</p>
                              <p className="text-[14px] font-bold text-slate-700 leading-relaxed relative z-10">
                                 Adayların stres testleri ve klinik derinlikleri baz alındığında; 
                                 <span className="font-black text-slate-900 underline decoration-orange-500 underline-offset-4"> {selectedCandidates[0]?.name}</span> profilinin kurumun akademik takvimine adaptasyonu %14 daha hızlı öngörülmektedir.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* 2. SEKME: VELİ SİMÜLATÖRÜ */}
                {activeSubTab === 'simulation' && (
                  <SimulationEngine candidates={selectedCandidates} />
                )}

                {/* 3. SEKME: NÖRAL PROJEKSİYON (GELECEK DAVRANIŞ) */}
                {activeSubTab === 'prediction' && (
                  <div className="space-y-16 animate-fade-in">
                     <div className="flex justify-between items-end">
                        <div>
                           <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-4 border-l-8 border-orange-600 pl-8">GELECEK DAVRANIŞ PROJEKSİYONU</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-8">Adayın 12 aylık profesyonel gelişim simülasyonu</p>
                        </div>
                        <button 
                           onClick={runProjection}
                           disabled={isProjecting}
                           className="px-12 py-5 bg-slate-900 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all disabled:opacity-50"
                        >
                           {isProjecting ? 'MUHAKEME MOTORU ÇALIŞIYOR...' : '12 AYLIK PROJEKSİYON ÜRET'}
                        </button>
                     </div>

                     {!projectionData && !isProjecting ? (
                        <div className="h-[500px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[5rem] border-4 border-dashed border-slate-100 grayscale opacity-40">
                           <div className="w-32 h-32 bg-white rounded-[4rem] flex items-center justify-center mb-8 shadow-xl">
                              <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                           </div>
                           <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.8em]">Tahminleme İçin Butona Basınız</p>
                        </div>
                     ) : isProjecting ? (
                        <div className="h-[500px] flex flex-col items-center justify-center space-y-12">
                           <div className="relative">
                              <div className="w-48 h-48 border-[12px] border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-24 h-24 bg-slate-900 rounded-[3rem] animate-pulse"></div>
                              </div>
                           </div>
                           <div className="text-center">
                              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Gemini 3 Flash Projeksiyonu</h3>
                              <p className="text-[12px] font-black text-orange-600 uppercase tracking-[0.5em] animate-pulse">Adayın 12 Aylık Nöral Yörüngesi Çiziliyor</p>
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-12 animate-scale-in">
                           {/* 12 AYLIK CHART */}
                           <div className="bg-white p-12 rounded-[5rem] border border-slate-100 shadow-2xl h-[450px]">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={projectionData.quarters}>
                                    <defs>
                                       <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                                    <YAxis domain={[0, 100]} hide />
                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="performanceScore" name="Performans Skoru" stroke="#ea580c" strokeWidth={5} fillOpacity={1} fill="url(#colorPerf)" />
                                    <Area type="monotone" dataKey="clinicalStability" name="Klinik Stabilite" stroke="#0f172a" strokeWidth={3} fill="none" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>

                           {/* ÇEYREK DETAYLARI (BENTO) */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {projectionData.quarters.map((q: any, i: number) => (
                                 <div key={i} className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-xl relative overflow-hidden group">
                                    <div className="relative z-10 space-y-6">
                                       <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">{q.period}</span>
                                          <span className="text-3xl font-black">%{q.performanceScore}</span>
                                       </div>
                                       <p className="text-[13px] font-bold text-slate-300 leading-relaxed italic">"{q.insight}"</p>
                                       <div className="space-y-2">
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kritik Riskler</span>
                                          {q.risks.map((r: string, idx: number) => (
                                             <div key={idx} className="flex gap-3 items-center">
                                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{r}</p>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                                 </div>
                              ))}
                           </div>

                           {/* STRATEJİK SONUÇ */}
                           <div className="bg-orange-600 p-16 rounded-[5.5rem] text-white shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                              <div className="lg:col-span-4 flex flex-col items-center justify-center bg-white/10 p-12 rounded-[4.5rem] backdrop-blur-xl border border-white/20">
                                 <p className="text-[11px] font-black text-orange-200 uppercase tracking-widest mb-4">SADAKAT PROJEKSİYONU</p>
                                 <div className="text-8xl font-black tracking-tighter">%{projectionData.finalPrediction.retentionProbability}</div>
                                 <p className="text-[11px] font-bold text-orange-100 uppercase mt-4">12 Ay Tutunma Olasılığı</p>
                              </div>
                              <div className="lg:col-span-8 space-y-8">
                                 <div className="space-y-2">
                                    <span className="text-[11px] font-black text-orange-200 uppercase tracking-widest">KURUM MÜDÜRÜNE STRATEJİK NOT</span>
                                    <p className="text-2xl font-black tracking-tight leading-tight uppercase italic">"{projectionData.finalPrediction.strategicAdvice}"</p>
                                 </div>
                                 <div className="flex gap-10 border-t border-white/20 pt-8">
                                    <div>
                                       <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Tükenmişlik Riski</p>
                                       <p className="text-xl font-black uppercase">{projectionData.finalPrediction.burnoutRiskPoint}</p>
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Önerilen Kariyer Yolu</p>
                                       <p className="text-xl font-black uppercase">{projectionData.finalPrediction.suggestedRole}</p>
                                    </div>
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

      {isAdvisorOpen && (
        <DecisionAdvisorChat 
          candidates={selectedCandidates} 
          onClose={() => setIsAdvisorOpen(false)} 
        />
      )}
    </div>
  );
};

export default DecisionSupportView;
