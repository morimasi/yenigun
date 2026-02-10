
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Candidate, ClinicalTestType, SimulationResult, UniversalExportData } from '../../types';
import { runStresSimulation } from '../../geminiService';
import ExportStudio from '../../components/shared/ExportStudio';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  // --- CORE STATE ---
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || '');
  const [selectedTest, setSelectedTest] = useState<ClinicalTestType>(ClinicalTestType.DMP_STRESS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [phase, setPhase] = useState('');
  
  // --- UI STATE ---
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTraceExpanded, setIsTraceExpanded] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeView, setActiveView] = useState<'current' | 'archive'>('current');

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  // --- DATA ACTIONS ---
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
      
      // Otomatik Kayıt Protokolü
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
      alert("Laboratuvar Motoru Hatası: Nöral veri hattında kopukluk oluştu.");
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

  const resetLab = () => {
     setCurrentResult(null);
     setActiveView('current');
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- UI COMPONENTS ---
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
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-6rem)] relative pb-10">
      
      {/* EXPORT OVERLAY */}
      {isExportOpen && currentResult && activeCandidate && (
        <ExportStudio
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'CLINICAL_SIMULATION',
            entityName: activeCandidate.name,
            referenceId: `LAB-${activeCandidate.id.substring(0,6)}`,
            payload: { result: currentResult, candidate: activeCandidate }
          }}
        >
          <div className="space-y-12 p-10">
            <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
              <h3 className="text-3xl font-black uppercase italic mb-8">"{currentResult.scenario}"</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <span className="text-[10px] font-black text-orange-500 uppercase block mb-4">Veli Karakteri</span>
                  <p className="text-sm font-medium italic opacity-80">"{currentResult.parentPersona}"</p>
                </div>
                <div className="p-8 bg-orange-600 rounded-3xl">
                  <span className="text-[10px] font-black text-white/80 uppercase block mb-4">Aday Refleksi</span>
                  <p className="text-sm font-bold italic">"{currentResult.candidateResponse}"</p>
                </div>
              </div>
            </div>
          </div>
        </ExportStudio>
      )}

      {/* TOP HEADER: LABORATUVAR DURUM BARI */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between no-print">
         <div className="flex items-center gap-6">
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
               <div className="flex gap-2">
                 <button onClick={resetLab} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                    YENİ TEST BAŞLAT
                 </button>
                 <button onClick={() => setIsExportOpen(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">
                    RAPORU YAYINLA
                 </button>
               </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* PANEL 1: KONTROL ÜNİTESİ (LEFT) */}
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
                 {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale text-center py-10">
                       <svg className="w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <p className="text-[9px] font-black uppercase tracking-widest">Arşiv Temiz</p>
                    </div>
                 ) : (
                    history.map((sim, i) => (
                       <button 
                         key={i} 
                         onClick={() => loadFromHistory(sim)}
                         className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-orange-300 hover:bg-white transition-all text-left group"
                       >
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-black text-slate-900 uppercase truncate pr-2">{sim.test_type}</span>
                             <span className="text-[8px] font-bold text-slate-400">{new Date(sim.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[9px] font-medium text-slate-500 line-clamp-2 italic opacity-80 group-hover:opacity-100">"{sim.scenario}"</p>
                       </button>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* PANEL 2: ANA SAHNE (MIDDLE/RIGHT) */}
        <div className="col-span-12 lg:col-span-9 h-full overflow-y-auto custom-scrollbar pr-2 pb-20">
           
           {activeView === 'archive' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
                 {history.map((sim, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                       <div className="flex justify-between items-center mb-6">
                          <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">{sim.test_type}</span>
                          <span className="text-[24px] font-black text-orange-600">%{sim.result_data.stressLevel}</span>
                       </div>
                       <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-snug mb-6 line-clamp-3 italic">"{sim.scenario}"</h4>
                       <button 
                         onClick={() => loadFromHistory(sim)}
                         className="w-full py-3 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                       >
                          DOSYAYI İNCELE
                       </button>
                    </div>
                 ))}
              </div>
           ) : !currentResult && !isSimulating ? (
              <div className="h-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 opacity-30">
                 <div className="w-32 h-32 bg-white rounded-[4rem] shadow-xl flex items-center justify-center mb-10 border border-slate-100">
                    <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 </div>
                 <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.8em] mb-4">Laboratuvar Hazır</h3>
                 <p className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Analiz başlatmak için bir protokol ve aday seçin.</p>
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
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-600 via-transparent to-transparent animate-pulse"></div>
              </div>
           ) : currentResult && (
              <div className="space-y-8 animate-scale-in">
                 
                 {/* METRICS ROW */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <MetricCard label="Etik Sınır Koruma" value={currentResult.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
                    <MetricCard label="Emosyonel Kalibrasyon" value={currentResult.aiEvaluation.empathyCalibration} color="text-blue-600" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                    <MetricCard label="Kriz Çözüm Hızı" value={currentResult.aiEvaluation.crisisResolutionEfficiency} color="text-orange-600" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                    <MetricCard label="Mesleki Mesafe" value={currentResult.aiEvaluation.professionalDistance} color="text-emerald-600" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                 </div>

                 {/* MAIN CONTENT BENTO */}
                 <div className="grid grid-cols-12 gap-8 items-stretch">
                    
                    {/* SCENARIO & PROJECTION */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                       <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                          <div className="relative z-10">
                             <div className="flex items-center gap-5 mb-12">
                                <span className="px-4 py-1.5 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">KRİTİK TEST</span>
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">STRES ŞİDDETİ: %{currentResult.stressLevel}</span>
                             </div>
                             <p className="text-4xl font-black leading-[1.1] uppercase italic mb-16 group-hover:text-orange-50 transition-colors">
                                "{currentResult.scenario}"
                             </p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/5 backdrop-blur-xl group/card hover:bg-white/10 transition-all">
                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-6">VELİ PSİKOPATOLOJİSİ</span>
                                   <p className="text-lg font-medium text-slate-300 leading-relaxed italic opacity-80">"{currentResult.parentPersona}"</p>
                                </div>
                                <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/5 backdrop-blur-xl group/card hover:bg-white/10 transition-all">
                                   <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-6">PROJEKTE EDİLEN REFLEKS</span>
                                   <p className="text-lg font-bold text-orange-100 leading-relaxed italic">"{currentResult.candidateResponse}"</p>
                                </div>
                             </div>
                          </div>
                          <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]"></div>
                       </div>

                       {/* TRUTHS & ERRORS */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-emerald-50/50 p-10 rounded-[3.5rem] border border-emerald-100 relative overflow-hidden group">
                             <h5 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                Klinik Doğrular
                             </h5>
                             <div className="space-y-6 relative z-10">
                                {currentResult.aiEvaluation.clinicalTruths.map((t, i) => (
                                   <div key={i} className="flex gap-6 items-start p-6 bg-white/60 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all">
                                      <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-[14px] shrink-0 shadow-lg">✓</div>
                                      <p className="text-[13px] font-bold text-slate-700 leading-tight uppercase tracking-tight">{t}</p>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className="bg-rose-50/50 p-10 rounded-[3.5rem] border border-rose-100 relative overflow-hidden group">
                             <h5 className="text-[11px] font-black text-rose-700 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                                Kritik Sapmalar
                             </h5>
                             <div className="space-y-6 relative z-10">
                                {currentResult.aiEvaluation.criticalMistakes.map((m, i) => (
                                   <div key={i} className="flex gap-6 items-start p-6 bg-white/60 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all">
                                      <div className="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black text-[14px] shrink-0 shadow-lg">!</div>
                                      <p className="text-[13px] font-bold text-slate-700 leading-tight uppercase tracking-tight">{m}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* NEURAL STATS & DEEP TRACE (RIGHT) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                       <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
                          <div className="relative z-10">
                             <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-4">BİLİŞSEL ÇELİŞKİ</h5>
                             <div className="flex items-end gap-6 mb-8">
                                <span className="text-8xl font-black text-white leading-none tracking-tighter">%{currentResult.aiEvaluation.neuralDivergence.contradictionIndex}</span>
                                <div className="space-y-1 mb-2">
                                   <span className="text-[10px] font-black text-slate-500 uppercase block">INDEX</span>
                                   <div className="w-8 h-1.5 bg-orange-600 rounded-full"></div>
                                </div>
                             </div>
                             <p className="text-[12px] font-medium text-slate-400 italic leading-relaxed uppercase tracking-wide">
                                "Adayın mülakat dürüstlüğü ile kriz anındaki nöral refleksleri arasındaki sapma."
                             </p>
                          </div>
                          
                          <div className="mt-12 space-y-4 relative z-10">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-1">BİRİNCİL DUYGU</span>
                             <p className="text-4xl font-black text-orange-100 uppercase tracking-tighter italic">"{currentResult.aiEvaluation.neuralDivergence.dominantEmotion}"</p>
                          </div>
                          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
                       </div>

                       <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col gap-8">
                          <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-orange-600 pl-6">MİKRO-DAVRANIŞ TAHMİNİ</h5>
                          <div className="space-y-10">
                             {[
                                { t: 'Ses Tonu Modülasyonu', v: currentResult.aiEvaluation.microBehaviors.toneAnalysis, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
                                { t: 'Non-Verbal Projeksiyon', v: currentResult.aiEvaluation.microBehaviors.nonVerbalPrediction, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                { t: 'Sessizlik Toleransı', v: currentResult.aiEvaluation.microBehaviors.silenceTolerance, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                             ].map((m, i) => (
                                <div key={i} className="flex gap-6 items-start group/micro">
                                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover/micro:text-orange-600 transition-all shadow-inner shrink-0">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="Mm.icon} /></svg>
                                   </div>
                                   <div>
                                      <h6 className="text-[10px] font-black uppercase text-slate-900 mb-1">{m.t}</h6>
                                      <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed">"{m.v}"</p>
                                   </div>
                                </div>
                             ))}
                          </div>
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

export default ClinicalLabView;
