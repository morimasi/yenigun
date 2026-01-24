
import React, { useState } from 'react';
import { Candidate, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';

interface SimulationEngineProps {
  candidates: Candidate[];
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationResult | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setHasError(false);
    const candidate = candidates.find(c => c.id === activeCandidateId);
    if (!candidate) return;

    try {
      const result = await runStresSimulation(candidate);
      setSimulationData(result);
    } catch (e: any) {
      console.error("Simulation catch:", e);
      setHasError(true);
    } finally {
      setIsSimulating(false);
    }
  };

  const MetricPill = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col gap-2">
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
                onClick={() => { setActiveCandidateId(c.id); setSimulationData(null); setHasError(false); }}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCandidateId === c.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {c.name}
              </button>
            ))}
         </div>
         <button 
           onClick={handleStartSimulation} 
           disabled={isSimulating}
           className="group relative px-12 py-5 overflow-hidden bg-orange-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-900 transition-all disabled:opacity-50"
         >
           <span className="relative z-10 flex items-center gap-3">
             <svg className={`w-5 h-5 ${isSimulating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             {isSimulating ? 'MUHAKEME MOTORU AKTİF...' : 'KRİZ SİMÜLASYONU BAŞLAT'}
           </span>
         </button>
      </div>

      {hasError ? (
        <div className="py-32 flex flex-col items-center justify-center bg-rose-50 rounded-[4rem] border-2 border-dashed border-rose-200 animate-fade-in">
           <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl text-rose-500">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
           <h3 className="text-2xl font-black text-rose-900 uppercase tracking-tighter mb-4">NÖRAL VERİ BOZULMASI</h3>
           <p className="max-w-md text-center text-[11px] font-bold text-rose-400 uppercase leading-relaxed mb-8">
              Model çok yoğun bir muhakeme sürecine girdi ve JSON yapısı bozuldu. Liyakat matrisini yeniden hesaplamak için lütfen tekrar deneyin.
           </p>
           <button onClick={handleStartSimulation} className="px-10 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-rose-700 transition-all">SİSTEMİ YENİDEN KALİBRE ET</button>
        </div>
      ) : !simulationData && !isSimulating ? (
        <div className="py-48 text-center bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100 relative group overflow-hidden">
           <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl mx-auto mb-10 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                 <svg className="w-16 h-16 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <p className="text-[14px] font-black text-slate-900 uppercase tracking-[0.8em] mb-4">NÖRAL KRİZ LABORATUVARI</p>
              <p className="max-w-md mx-auto text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-[0.2em]">Adayın Digital Twin modeli üzerinde yüksek stresli klinik vaka simülasyonu uygulayın.</p>
           </div>
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
        </div>
      ) : isSimulating ? (
        <div className="py-48 flex flex-col items-center justify-center space-y-12">
           <div className="relative">
              <div className="w-40 h-40 border-8 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] animate-pulse shadow-2xl"></div>
              </div>
           </div>
           <div className="text-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Gemini 3 Pro Analiz Ediyor</h3>
              <p className="text-[12px] font-black text-orange-600 uppercase tracking-[0.4em] animate-bounce">Adayın Zayıf Etik Sınırları Tespit Ediliyor</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-scale-in">
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                 <div className="relative z-10">
                    <div className="flex justify-between items-center mb-12">
                       <div className="flex items-center gap-4">
                          <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
                          <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em]">KRİTİK KRİZ SENARYOSU</h5>
                       </div>
                       <div className="px-5 py-2 bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest">STRES: %{simulationData.stressLevel}</div>
                    </div>
                    <p className="text-3xl font-black leading-tight italic mb-12 tracking-tight">"{simulationData.scenario}"</p>
                    <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 backdrop-blur-xl">
                       <span className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest">Veli Profil Analizi (Manipülatör)</span>
                       <p className="text-base font-bold text-slate-300 leading-relaxed italic">"{simulationData.parentPersona}"</p>
                    </div>
                 </div>
                 <div className="absolute -right-40 -top-40 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]"></div>
              </div>

              <div className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl border border-slate-100">?</div>
                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">ÖNGÖRÜLEN ADAY REFLEKSİ</h5>
                 </div>
                 <p className="text-xl font-bold text-slate-700 leading-relaxed italic opacity-90 group-hover:opacity-100 transition-opacity">
                    "{simulationData.candidateResponse}"
                 </p>
              </div>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-2xl relative">
                 <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 border-l-4 border-orange-600 pl-6">NÖRAL ANALİZ METRİKLERİ</h5>
                 <div className="space-y-12">
                    <MetricPill label="ETİK SINIR KORUMA" value={simulationData.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" />
                    <MetricPill label="EMPATİ KALİBRASYONU" value={simulationData.aiEvaluation.empathyCalibration} color="text-orange-600" />
                    <MetricPill label="PROFESYONEL MESAFE" value={simulationData.aiEvaluation.professionalDistance} color="text-blue-600" />
                    <MetricPill label="KRİZ ÇÖZÜM VERİMİ" value={simulationData.aiEvaluation.crisisResolutionEfficiency} color="text-emerald-600" />
                 </div>
              </div>

              <div className="bg-rose-600 p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                 <h5 className="text-[11px] font-black text-rose-200 uppercase tracking-widest mb-10">TESPİT EDİLEN RİSKLER</h5>
                 <div className="space-y-6 relative z-10">
                    {simulationData.aiEvaluation.criticalMistakes.map((err, i) => (
                      <div key={i} className="flex gap-6 items-start">
                         <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center font-black text-[12px] shrink-0">!</div>
                         <p className="text-[12px] font-black uppercase tracking-widest leading-tight">{err}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SimulationEngine;
