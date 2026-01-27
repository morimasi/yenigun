
import React, { useState } from 'react';
import { Candidate, SimulationResult, ClinicalTestType } from '../../types';
import { runStresSimulation } from '../../geminiService';

interface SimulationEngineProps {
  candidates: Candidate[];
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationResult | null>(null);
  const [isTraceOpen, setIsTraceOpen] = useState(false);

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setIsTraceOpen(false);
    const candidate = candidates.find(c => c.id === activeCandidateId);
    if (!candidate) return;

    try {
      const result = await runStresSimulation(candidate, ClinicalTestType.DMP_STRESS);
      setSimulationData(result);
    } catch (e) {
      alert("Simülasyon Hatası: Muhakeme motoru yanıt vermedi.");
    } finally {
      setIsSimulating(false);
    }
  };

  const MetricPill = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col gap-3">
       <div className="flex justify-between items-end">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          <span className={`text-sm font-black ${color}`}>%{value}</span>
       </div>
       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
          <div className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in relative">
      <div className="flex justify-between items-center border-b border-slate-100 pb-8">
         <div className="flex gap-4">
            {candidates.map(c => (
              <button 
                key={c.id} 
                onClick={() => { setActiveCandidateId(c.id); setSimulationData(null); }}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCandidateId === c.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400'}`}
              >
                {c.name}
              </button>
            ))}
         </div>
         <button 
           onClick={handleStartSimulation} 
           disabled={isSimulating}
           className="px-12 py-5 bg-orange-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-900 transition-all disabled:opacity-50"
         >
           {isSimulating ? 'MUHAKEME AKTİF...' : 'KRİZ SİMÜLASYONU BAŞLAT'}
         </button>
      </div>

      {simulationData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-scale-in">
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                 <div className="relative z-10">
                    <div className="flex justify-between items-center mb-12">
                       <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em]">KRİTİK KRİZ SENARYOSU</h5>
                       <span className="px-4 py-1.5 bg-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest">STRES: %{simulationData.stressLevel}</span>
                    </div>
                    <p className="text-3xl font-black leading-tight italic mb-12 tracking-tight uppercase">"{simulationData.scenario}"</p>
                    <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 backdrop-blur-xl">
                       <span className="text-[10px] font-black text-slate-400 uppercase block mb-4">Manipülatif Veli Profili</span>
                       <p className="text-base font-bold text-slate-300 leading-relaxed italic">"{simulationData.parentPersona}"</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl relative group overflow-hidden">
                 <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                    Öngörülen Aday Refleksi
                 </h5>
                 <p className="text-xl font-bold text-slate-700 leading-relaxed italic group-hover:text-slate-900 transition-colors italic">
                    "{simulationData.candidateResponse}"
                 </p>
              </div>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                 <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 border-l-4 border-orange-600 pl-6">NÖRAL ANALİZ METRİKLERİ</h5>
                 <div className="space-y-10">
                    <MetricPill label="ETİK SINIR KORUMA" value={simulationData.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" />
                    <MetricPill label="EMPATİ KALİBRASYONU" value={simulationData.aiEvaluation.empathyCalibration} color="text-orange-600" />
                    <MetricPill label="PROFESYONEL MESAFE" value={simulationData.aiEvaluation.professionalDistance} color="text-blue-600" />
                    <MetricPill label="KRİZ ÇÖZÜM VERİMİ" value={simulationData.aiEvaluation.crisisResolutionEfficiency} color="text-emerald-600" />
                 </div>
                 <button onClick={() => setIsTraceOpen(!isTraceOpen)} className="w-full mt-12 py-5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all">
                    {isTraceOpen ? 'DERİN ANALİZİ GİZLE' : 'DEEP TRACE SORGULA'}
                 </button>
              </div>

              {isTraceOpen && (
                <div className="bg-orange-600 p-12 rounded-[4.5rem] text-white shadow-2xl animate-slide-up space-y-10">
                   <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">Dominant Duygu</span>
                      <p className="text-5xl font-black tracking-tighter uppercase">{simulationData.aiEvaluation.neuralDivergence.dominantEmotion}</p>
                   </div>
                   <div className="p-8 bg-white/10 rounded-3xl border border-white/10">
                      <span className="text-[9px] font-black uppercase tracking-widest mb-4 block opacity-60">Nöral Karar Yolu</span>
                      <p className="text-sm font-bold leading-relaxed italic">"{simulationData.aiEvaluation.neuralDivergence.decisionPath}"</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      ) : (
        <div className="py-48 text-center bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl text-slate-200">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
           </div>
           <p className="text-[14px] font-black text-slate-300 uppercase tracking-[0.8em]">LABORATUVAR HAZIR</p>
        </div>
      )}
    </div>
  );
};

export default SimulationEngine;
