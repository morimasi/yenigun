
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
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
                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">Analiz Havuzu</h4>
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
                <button onClick={() => setIsAdvisorOpen(true)} className="w-full mt-8 py-4 bg-white text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">AI DANIŞMANA SOR</button>
             </div>
             <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* MAIN DISPLAY - RIGHT */}
        <div className="lg:col-span-9">
           {selectedIds.length === 0 ? (
             <div className="h-[650px] bg-white border-2 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                  <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs leading-relaxed">Operasyonel Derinlik İçin<br/>En Az Bir Aday Seçiniz</p>
             </div>
           ) : (
             <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-12 min-h-[650px] animate-slide-up">
                
                {activeSubTab === 'comparison' && (
                  <div className="space-y-12">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">ÇAPRAZ YETKİNLİK MATRİSİ</h4>
                     <div className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={
                            ['ETİK', 'KLİNİK', 'PEDAGOJİ', 'DİRENÇ', 'RESMİYET', 'UYUM'].map(metric => ({
                              subject: metric,
                              ...selectedCandidates.reduce((acc, c) => ({
                                ...acc,
                                [c.name]: c.report?.score // Örnek skor, gerçek veriyle map edilmeli
                              }), {})
                            }))
                          }>
                            <PolarGrid stroke="#f1f5f9" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontBold: 900, fill: '#94a3b8' }} />
                            {selectedCandidates.map((c, i) => (
                              <Radar key={c.id} name={c.name} dataKey={c.name} stroke={['#ea580c', '#0f172a', '#64748b'][i]} fill={['#ea580c', '#0f172a', '#64748b'][i]} fillOpacity={0.2} strokeWidth={3} />
                            ))}
                            <Legend wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 'bold' }} />
                          </RadarChart>
                        </ResponsiveContainer>
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
                          <div key={c.id} className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 shadow-inner">
                             <div className="flex justify-between items-center mb-8">
                                <h5 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{c.name}</h5>
                                <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black tracking-widest">12 AY TAHMİNİ</div>
                             </div>
                             <div className="space-y-6">
                                <div className="p-6 bg-white rounded-3xl shadow-sm">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Muhtemel Kariyer Yolu</p>
                                   <p className="text-sm font-black text-orange-600 uppercase">Yüksek Performans / Liderlik Potansiyeli</p>
                                </div>
                                <div className="p-6 bg-white rounded-3xl shadow-sm">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kritik Uyarı</p>
                                   <p className="text-[11px] font-bold text-slate-600 italic leading-relaxed">"İlk 6 ay içinde veli sınırları konusunda mentörlük almazsa tükenmişlik riski %40 artabilir."</p>
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
