
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import DecisionAdvisorChat from './DecisionAdvisorChat';
import SimulationEngine from './SimulationEngine';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'comparison' | 'simulation' | 'prediction'>('comparison');

  const selectedCandidates = useMemo(() => 
    candidates.filter(c => selectedIds.includes(c.id)), 
    [candidates, selectedIds]
  );

  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 3 ? [...prev, id] : prev)
    );
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

  // Adaylar arasındaki en büyük farkları bulan mantık
  const analysisInsights = useMemo(() => {
    if (selectedCandidates.length < 2) return null;
    
    // Basit bir fark analizi örneği (İlk iki aday arasında)
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
        {/* SELECTION BAR - LEFT */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">Analiz Havuzu (Max 3)</h4>
                <div className="space-y-3">
                   {candidates.filter(c => !!c.report).map(c => (
                     <div 
                       key={c.id} 
                       onClick={() => toggleCandidate(c.id)}
                       className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                         selectedIds.includes(c.id) ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                       }`}
                     >
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-[10px]">{c.report?.score}</div>
                        <span className="text-[10px] font-black uppercase truncate flex-1">{c.name}</span>
                     </div>
                   ))}
                </div>
                <button onClick={() => setIsAdvisorOpen(true)} className="w-full mt-8 py-4 bg-white text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95">AI DANIŞMANA SOR</button>
             </div>
             <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
             <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">BOYUT TANIMLARI</h5>
             <div className="space-y-4">
                <div className="group cursor-help">
                   <p className="text-[10px] font-black text-slate-900 uppercase">Klinik Derinlik</p>
                   <p className="text-[9px] font-bold text-slate-400 leading-tight mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Literatür bilgisini vaka anında uygulama hızı.</p>
                </div>
                <div className="group cursor-help">
                   <p className="text-[10px] font-black text-slate-900 uppercase">Etik Bütünlük</p>
                   <p className="text-[9px] font-bold text-slate-400 leading-tight mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Mesleki sınırları ve dürüstlük ilkelerini koruma gücü.</p>
                </div>
             </div>
          </div>
        </div>

        {/* MAIN DISPLAY - RIGHT */}
        <div className="lg:col-span-9">
           {selectedIds.length === 0 ? (
             <div className="h-[750px] bg-white border-2 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                  <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs leading-relaxed">Operasyonel Derinlik İçin<br/>En Az Bir Aday Seçiniz</p>
             </div>
           ) : (
             <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-8 md:p-12 min-h-[750px] animate-slide-up space-y-12">
                
                {activeSubTab === 'comparison' && (
                  <div className="space-y-12">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">ÇAPRAZ YETKİNLİK MATRİSİ</h4>
                        <div className="flex gap-4">
                           {selectedCandidates.map((c, i) => (
                              <div key={c.id} className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#ea580c', '#0f172a', '#64748b'][i] }}></div>
                                 <span className="text-[9px] font-black text-slate-400 uppercase">{c.name.split(' ')[0]}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 h-[450px] bg-slate-50/50 rounded-[4rem] p-10 relative">
                           <ResponsiveContainer width="100%" height="100%">
                             <RadarChart data={comparisonData}>
                               <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
                               <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                               {selectedCandidates.map((c, i) => (
                                 <Radar 
                                   key={c.id} 
                                   name={c.name} 
                                   dataKey={c.name} 
                                   stroke={['#ea580c', '#0f172a', '#64748b'][i]} 
                                   fill={['#ea580c', '#0f172a', '#64748b'][i]} 
                                   fillOpacity={0.15} 
                                   strokeWidth={4} 
                                   dot={{ r: 4, fill: ['#ea580c', '#0f172a', '#64748b'][i] }}
                                 />
                               ))}
                               <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                             </RadarChart>
                           </ResponsiveContainer>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                           <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl">
                              <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-8">LİYAKAT MUHAKEMESİ</h5>
                              <div className="space-y-8">
                                 {analysisInsights ? (
                                    analysisInsights.map((insight, idx) => (
                                       <div key={idx} className="group">
                                          <div className="flex justify-between items-center mb-2">
                                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{insight.label} Farkı</span>
                                             <span className={`text-[10px] font-black ${insight.val > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                %{Math.abs(insight.val)} {insight.val > 0 ? 'Üstünlük' : 'Açık'}
                                             </span>
                                          </div>
                                          <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                                             {insight.val > 0 
                                                ? `${selectedCandidates[0].name}, ${insight.label.toLowerCase()} boyutunda daha domine edici bir profil sergiliyor.` 
                                                : `${selectedCandidates[1].name}, bu alanda daha yüksek bir liyakat puanına sahip.`
                                             }
                                          </p>
                                       </div>
                                    ))
                                 ) : (
                                    <p className="text-[11px] font-bold text-slate-400">Karşılaştırmalı analiz için en az iki aday seçilmelidir.</p>
                                 )}
                              </div>
                           </div>
                           
                           <div className="p-8 bg-orange-50 rounded-[3rem] border border-orange-100">
                              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">SİSTEM TAVSİYESİ</p>
                              <p className="text-[12px] font-bold text-slate-700 leading-relaxed">
                                 Kurumun mevcut kadro yapısı ve adayların stres testleri göz önüne alındığında; 
                                 <span className="font-black text-slate-900"> {selectedCandidates[0]?.name}</span> profilinin teknik adaptasyon hızı daha yüksek görünmektedir.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeSubTab === 'simulation' && (
                  <SimulationEngine candidates={selectedCandidates} />
                )}

                {activeSubTab === 'prediction' && (
                  <div className="space-y-12">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">GELECEK DAVRANIŞ PROJEKSİYONU</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {selectedCandidates.map(c => (
                          <div key={c.id} className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 shadow-inner group hover:bg-white hover:shadow-2xl transition-all duration-500">
                             <div className="flex justify-between items-center mb-8">
                                <h5 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{c.name}</h5>
                                <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black tracking-widest">12 AY TAHMİNİ</div>
                             </div>
                             <div className="space-y-6">
                                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-50">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Muhtemel Kariyer Yolu</p>
                                   <p className="text-sm font-black text-orange-600 uppercase">
                                      {c.report?.predictiveMetrics?.leadershipPotential! > 70 ? 'Yüksek Performans / Liderlik' : 'Operasyonel Stabilite'}
                                   </p>
                                </div>
                                <div className="p-6 bg-rose-50 rounded-3xl shadow-sm border border-rose-100">
                                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Kritik Risk Öngörüsü</p>
                                   <p className="text-[11px] font-bold text-slate-700 italic leading-relaxed">
                                      "{c.report?.predictiveMetrics?.burnoutRisk! > 40 ? 'Yoğun seans temposunda motivasyon kaybı yaşama ihtimali mevcut.' : 'Psikolojik direnci kurum ortalamasının üzerinde.'}"
                                   </p>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
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
