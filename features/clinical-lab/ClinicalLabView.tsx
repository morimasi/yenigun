
import React, { useState, useEffect, useCallback } from 'react';
import { Candidate, ClinicalTestType, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';
import ExportStudio from '../../components/shared/ExportStudio';
import { SmartBackButton } from '../../components/shared/SmartBackButton';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || '');
  const [selectedTest, setSelectedTest] = useState<ClinicalTestType>(ClinicalTestType.DMP_STRESS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [phase, setPhase] = useState('');
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeView, setActiveView] = useState<'current' | 'archive'>('current');

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  const fetchHistory = useCallback(async (cid: string) => {
    if (!cid) return;
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/clinical-lab?action=history&candidateId=${cid}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Laboratuvar Arşiv Hatası:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(activeCandidateId);
  }, [activeCandidateId, fetchHistory]);

  const handleBack = () => {
    if (activeView === 'archive') {
      setActiveView('current');
    } else if (currentResult) {
      setCurrentResult(null);
    }
  };

  const runTest = async () => {
    if (!activeCandidate) return;
    setIsSimulating(true);
    setCurrentResult(null);
    setActiveView('current');

    const phases = [
      'Nöral Profil Haritalanıyor...',
      'Klinik Senaryo Oluşturuluyor...',
      'Stres Vektörleri Enjekte Ediliyor...',
      'Bilişsel Çelişki Katsayıları Hesaplanıyor...',
      'Veri Paketi Mühürleniyor...'
    ];

    let pIdx = 0;
    const interval = setInterval(() => {
      setPhase(phases[pIdx % phases.length]);
      pIdx++;
    }, 1800);

    try {
      const data: SimulationResult = await runStresSimulation(activeCandidate, selectedTest);
      
      const saveRes = await fetch('/api/clinical-lab?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: activeCandidateId,
          testType: selectedTest,
          scenario: data.scenario,
          stressLevel: data.stressLevel,
          resultData: data
        })
      });

      if (saveRes.ok) {
        setCurrentResult(data);
        fetchHistory(activeCandidateId);
      }
    } catch (e) {
      alert("Laboratuvar Motoru Hatası.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
      setPhase('');
    }
  };

  const loadFromHistory = (sim: any) => {
    setCurrentResult(sim.result_data);
    setSelectedTest(sim.test_type as ClinicalTestType);
    setActiveView('current');
  };

  const MetricCard = ({ label, value, color, icon }: any) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
       <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors`}>
            {icon}
          </div>
          <span className={`text-3xl font-black ${color}`}>%{value}</span>
       </div>
       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">{label}</p>
       <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
          <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full relative pb-10">
      
      {isExportOpen && currentResult && activeCandidate && (
        <ExportStudio
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'CLINICAL_SIMULATION',
            entityName: activeCandidate.name,
            referenceId: `LAB-${activeCandidate.id.substring(0,6)}`,
            payload: { result: currentResult, candidate: activeCandidate }
          }}
        />
      )}

      {/* TOP HEADER */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between no-print">
         <div className="flex items-center gap-6">
            {(currentResult || activeView === 'archive') && <SmartBackButton onClick={handleBack} label="GERİ" />}
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-600 shadow-xl border border-slate-800 font-black text-sm">LAB</div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Nöral Test Sahnesi</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {isSimulating ? 'Simülasyon Aktif' : currentResult ? 'Analiz Tamamlandı' : 'Sistem Hazır'}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
               <button onClick={() => setActiveView('current')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeView === 'current' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Güncel Test</button>
               <button onClick={() => setActiveView('archive')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeView === 'archive' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Klinik Arşiv</button>
            </div>
            {currentResult && (
               <button onClick={() => setIsExportOpen(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">
                  RAPORU YAYINLA
               </button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-full no-print">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl flex flex-col gap-8 relative overflow-hidden border border-slate-800">
              <div className="space-y-6 relative z-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">ADAY SEÇİMİ</label>
                    <select 
                      className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-[12px] font-bold outline-none focus:border-orange-500 transition-all text-white appearance-none cursor-pointer"
                      value={activeCandidateId}
                      onChange={e => setActiveCandidateId(e.target.value)}
                      disabled={isSimulating}
                    >
                      {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">TEST PROTOKOLÜ</label>
                    <div className="flex flex-col gap-2">
                       {(Object.values(ClinicalTestType) as ClinicalTestType[]).map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTest(t)}
                            disabled={isSimulating}
                            className={`px-5 py-4 rounded-xl text-[10px] font-black uppercase text-left transition-all flex items-center justify-between border ${
                              selectedTest === t ? 'bg-orange-600 border-orange-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                             <span>{(t as string).replace('_', ' ')}</span>
                             <div className={`w-2 h-2 rounded-full ${selectedTest === t ? 'bg-white animate-pulse' : 'bg-slate-700'}`}></div>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
              <button 
                onClick={runTest}
                disabled={isSimulating || !activeCandidate}
                className="w-full py-6 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 hover:text-white transition-all active:scale-95 disabled:opacity-30 relative z-10"
              >
                {isSimulating ? 'İŞLENİYOR...' : 'SİMÜLASYONU BAŞLAT'}
              </button>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                 <span>GEÇMİŞ ANALİZLER</span>
                 {isLoadingHistory && <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>}
              </h5>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                 {history.map((sim, i) => (
                    <button key={i} onClick={() => loadFromHistory(sim)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-orange-300 hover:bg-white transition-all text-left">
                       <span className="text-[10px] font-black text-slate-900 uppercase block mb-1">{sim.test_type}</span>
                       <p className="text-[9px] font-medium text-slate-500 line-clamp-1 italic">"{sim.scenario}"</p>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-9 h-full overflow-y-auto custom-scrollbar pr-2">
           {activeView === 'archive' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
                 {history.map((sim, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => loadFromHistory(sim)}>
                       <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest mb-4 inline-block">{sim.test_type}</span>
                       <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-snug mb-6 line-clamp-3 italic">"{sim.scenario}"</h4>
                       <span className="text-[24px] font-black text-orange-600 block mb-4">%{sim.result_data.stressLevel} STRES</span>
                       <button className="w-full py-3 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">DOSYAYI İNCELE</button>
                    </div>
                 ))}
              </div>
           ) : isSimulating ? (
              <div className="h-full bg-slate-900 rounded-[5rem] flex flex-col items-center justify-center space-y-12 relative overflow-hidden shadow-2xl">
                 <div className="relative">
                    <div className="w-56 h-56 border-[16px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-28 h-28 bg-white/5 rounded-[3.5rem] animate-pulse flex items-center justify-center border border-white/10">
                          <div className="w-4 h-4 bg-orange-600 rounded-full shadow-[0_0_20px_#ea580c]"></div>
                       </div>
                    </div>
                 </div>
                 <div className="text-center relative z-10 space-y-4">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Nöral Faz Aktif</h3>
                    <p className="text-orange-500 font-black text-lg uppercase tracking-[0.5em] animate-pulse">{phase}</p>
                 </div>
              </div>
           ) : currentResult ? (
              <div className="space-y-8 animate-scale-in">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <MetricCard label="Etik Sınır Koruma" value={currentResult.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
                    <MetricCard label="Emosyonel Kalibrasyon" value={currentResult.aiEvaluation.empathyCalibration} color="text-blue-600" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                    <MetricCard label="Kriz Çözüm Hızı" value={currentResult.aiEvaluation.crisisResolutionEfficiency} color="text-orange-600" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                    <MetricCard label="Mesleki Mesafe" value={currentResult.aiEvaluation.professionalDistance} color="text-emerald-600" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                 </div>
                 <div className="bg-slate-900 p-16 rounded-[5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
                    <p className="text-4xl font-black leading-[1.1] uppercase italic mb-16 relative z-10">"{currentResult.scenario}"</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                       <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/5 backdrop-blur-xl">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-6">VELİ PSİKOPATOLOJİSİ</span>
                          <p className="text-lg font-medium text-slate-300 leading-relaxed italic opacity-80">"{currentResult.parentPersona}"</p>
                       </div>
                       <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/5 backdrop-blur-xl">
                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-6">PROJEKTE EDİLEN REFLEKS</span>
                          <p className="text-lg font-bold text-orange-100 leading-relaxed italic">"{currentResult.candidateResponse}"</p>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="h-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center opacity-30">
                 <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.8em]">Laboratuvar Hazır</h3>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalLabView;
