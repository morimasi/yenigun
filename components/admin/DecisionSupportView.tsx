
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
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
      { key: 'sustainability', label: 'DİRENÇ' },
      { key: 'formality', label: 'RESMİYET' },
      { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' }
    ];

    return dimensions.map(d => ({
      subject: d.label,
      ...selectedCandidates.reduce((acc, c) => ({
        ...acc,
        [c.name]: c.report?.deepAnalysis?.[d.key]?.score || 0
      }), {})
    }));
  }, [selectedCandidates]);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">STRATEJİK KOMUTA MERKEZİ</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Bilişsel Karar Destek Katmanı</p>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-[2rem] border border-slate-200">
           {['comparison', 'simulation', 'prediction'].map((t) => (
             <button 
               key={t}
               onClick={() => setActiveSubTab(t as any)}
               className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === t ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400'}`}
             >
               {t === 'comparison' ? 'Karşılaştırma' : t === 'simulation' ? 'Veli Simülatörü' : 'Nöral Projeksiyon'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl border border-slate-800">
             <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8">Analiz Havuzu</h4>
             <div className="space-y-4">
                {candidates.filter(c => !!c.report).map(c => (
                  <div key={c.id} onClick={() => toggleCandidate(c.id)} className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer ${selectedIds.includes(c.id) ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-transparent text-slate-400'}`}>
                     <span className="text-[11px] font-black uppercase tracking-tighter">{c.name}</span>
                  </div>
                ))}
             </div>
             <button onClick={() => setIsAdvisorOpen(true)} className="w-full mt-10 py-6 bg-white text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all">STRATEJİK DANIŞMAN</button>
          </div>
        </div>

        <div className="lg:col-span-9">
           {selectedIds.length === 0 ? (
             <div className="h-[700px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex items-center justify-center opacity-40">
                <p className="text-slate-400 font-black uppercase tracking-[1em] text-[14px]">ADAY SEÇİNİZ</p>
             </div>
           ) : (
             <div className="bg-white rounded-[5rem] shadow-2xl border border-slate-100 p-12 min-h-[700px] space-y-16">
                {activeSubTab === 'comparison' && (
                  <div className="h-[600px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={comparisonData}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900 }} />
                        {selectedCandidates.map((c, i) => (
                          <Radar key={c.id} name={c.name} dataKey={c.name} stroke={['#ea580c', '#0f172a', '#64748b'][i]} fill={['#ea580c', '#0f172a', '#64748b'][i]} fillOpacity={0.1} strokeWidth={4} />
                        ))}
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {activeSubTab === 'simulation' && <SimulationEngine candidates={selectedCandidates} />}
             </div>
           )}
        </div>
      </div>

      {isAdvisorOpen && <DecisionAdvisorChat candidates={selectedCandidates} onClose={() => setIsAdvisorOpen(false)} />}
    </div>
  );
};

export default DecisionSupportView;
