
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Candidate, ClinicalTestType, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';
import ExportStudio from '../../components/shared/ExportStudio';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  // Core States
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || '');
  const [selectedTest, setSelectedTest] = useState<ClinicalTestType>(ClinicalTestType.DMP_STRESS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentResult, setCurrentResult] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [phase, setPhase] = useState('');
  
  // UI States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTraceExpanded, setIsTraceExpanded] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  // Veritabanından Geçmişi Çek
  const fetchHistory = useCallback(async (cid: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/clinical-lab?action=history&candidateId=${cid}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("History fetch error:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (activeCandidateId) fetchHistory(activeCandidateId);
  }, [activeCandidateId, fetchHistory]);

  // Yeni Simülasyon Başlat
  const runTest = async () => {
    if (!activeCandidate) return;
    setIsSimulating(true);
    setCurrentResult(null);

    const phases = [
      'Nöral Profil Hazırlanıyor...',
      'Klinik Senaryo Modelleniyor...',
      'Stres Vektörleri Enjekte Ediliyor...',
      'Bilişsel Çelişki Katsayısı Hesaplanıyor...',
      'Otopsi Raporu Mühürleniyor...'
    ];

    let pIdx = 0;
    const interval = setInterval(() => {
      setPhase(phases[pIdx % phases.length]);
      pIdx++;
    }, 1800);

    try {
      const data: SimulationResult = await runStresSimulation(activeCandidate, selectedTest);
      
      // Veritabanına Otomatik Kaydet
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
        setCurrentResult({ ...data, is_new: true });
        fetchHistory(activeCandidateId);
      }
    } catch (e) {
      alert("Laboratuvar Motoru Hatası: Nöral veri paketi çözümlenemedi.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
      setPhase('');
    }
  };

  const AnalysisMetric = ({ label, value, color, icon }: any) => (
    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 group hover:border-orange-500/50 transition-all">
       <div className="flex justify-between items-start mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
             {icon}
          </div>
          <span className={`text-2xl font-black ${color}`}>%{value}</span>
       </div>
       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
       <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in h-[calc(100vh-6rem)] overflow-hidden relative pb-10">
      
      {/* EXPORT OVERLAY */}
      {isExportOpen && currentResult && activeCandidate && (
        <ExportStudio
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'CLINICAL_SIMULATION',
            entityName: activeCandidate.name,
            referenceId: `SIM-${activeCandidate.id.substring(0,6)}`,
            payload: { result: currentResult, candidate: activeCandidate }
          }}
        >
           <div className="space-y-12">
              <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
                 <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 italic">"{currentResult.scenario}"</h3>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                       <span className="text-[10px] font-black text-orange-500 uppercase block mb-4">Veli Profil Analizi</span>
                       <p className="text-sm font-medium leading-relaxed italic">"{currentResult.parentPersona}"</p>
                    </div>
                    <div className="p-8 bg-orange-600 rounded-3xl">
                       <span className="text-[10px] font-black text-white/80 uppercase block mb-4">Öngörülen Refleks</span>
                       <p className="text-sm font-bold leading-relaxed italic">"{currentResult.candidateResponse}"</p>
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                 <div className="p-6 bg-slate-50 rounded-3xl text-center">
                    <p className="text-3xl font-black text-slate-900">%{currentResult.aiEvaluation.ethicalBoundaryScore}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase mt-2">Etik Sınır</p>
                 </div>
                 {/* ... Diğer Metrikler ... */}
              </div>
           </div>
        </ExportStudio>
      )}

      {/* PANEL 1: ARAŞTIRMA KOMUTASI (LEFT) */}
      <div className="col-span-12 lg:col-span-3 space-y-4 flex flex-col h-full">
        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl border border-white/5 flex flex-col">
          <div className="mb-8 border-b border-white/10 pb-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg">LAB</div>
                <div>
                   <h4 className="text-sm font-black uppercase tracking-tight">Klinik Kontrol</h4>
                   <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Research Module v5.0</p>
                </div>
             </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">İNCELENECEK UZMAN</label>
                <select 
                  className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-[11px] font-bold outline-none focus:border-orange-500 transition-all text-white appearance-none cursor-pointer"
                  value={activeCandidateId}
                  onChange={e => setActiveCandidateId(e.target.value)}
                >
                  {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">STRES PROTOKOLÜ</label>
                <div className="grid grid-cols-1 gap-2">
                   {Object.values(ClinicalTestType).map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTest(t)}
                        className={`px-4 py-3.5 rounded-xl text-[9px] font-black uppercase text-left transition-all flex items-center justify-between border ${
                          selectedTest === t ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{t.replace('_', ' ')}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedTest === t ? 'bg-white animate-pulse' : 'bg-slate-700'}`}></div>
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
             <button 
                onClick={runTest}
                disabled={isSimulating || !activeCandidate}
                className="w-full py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
             >
                {isSimulating ? 'İŞLENİYOR...' : 'TESTİ BAŞLAT'}
             </button>
          </div>
        </div>

        {/* GEÇMİŞ LİSTESİ */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              <span>KLİNİK ARŞİV</span>
              {isLoadingHistory && <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>}
           </h5>
           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {history.length === 0 ? (
                <div className="py-10 text-center opacity-20 grayscale">
                   <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <p className="text-[8px] font-black uppercase">Kayıt Bulunmuyor</p>
                </div>
              ) : (
                history.map((sim, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentResult(sim.result_data)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-300 transition-all text-left group"
                  >
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-black text-slate-900 uppercase truncate pr-2">{sim.test_type}</span>
                        <span className="text-[8px] font-bold text-slate-400">{new Date(sim.created_at).toLocaleDateString()}</span>
                     </div>
                     <p className="text-[8px] font-medium text-slate-500 line-clamp-1 italic">"{sim.scenario}"</p>
                  </button>
                ))
              )}
           </div>
        </div>
      </div>

      {/* PANEL 2: SİMÜLASYON SAHNESİ (MIDDLE) */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
        {!currentResult && !isSimulating ? (
          <div className="h-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-30 relative overflow-hidden">
             <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl flex items-center justify-center mb-10 border border-slate-100">
                <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.8em] mb-4">Laboratuvar Hazır</h3>
             <p className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Analiz başlatmak için bir protokol ve aday seçin.</p>
          </div>
        ) : isSimulating ? (
          <div className="h-full bg-slate-900 rounded-[4rem] flex flex-col items-center justify-center space-y-10 relative overflow-hidden shadow-2xl">
             <div className="relative">
                <div className="w-48 h-48 border-[12px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 bg-white/5 rounded-[3rem] animate-pulse flex items-center justify-center">
                      <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                   </div>
                </div>
             </div>
             <div className="text-center relative z-10 space-y-3">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Nöral Faz Aktif</h3>
                <p className="text-orange-500 font-black text-sm uppercase tracking-[0.6em] animate-pulse">{phase}</p>
             </div>
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent animate-pulse"></div>
          </div>
        ) : currentResult && (
          <div className="space-y-6 animate-scale-in pb-10">
             
             {/* HEADER STRIP */}
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-5">
                   <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                      SONUÇ DOSYASI
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DOĞRULANDI: {new Date().toLocaleTimeString()}</span>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setIsTraceExpanded(!isTraceExpanded)} className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">
                      {isTraceExpanded ? 'İZİ GİZLE' : 'NÖRAL İZİ AÇ'}
                   </button>
                   <button onClick={() => setIsExportOpen(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all">
                      RAPORU YAYINLA
                   </button>
                </div>
             </div>

             {/* MAIN CONTENT BENTO */}
             <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* 1. SCENARIO & RESPONSE */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                   <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="relative z-10">
                         <div className="flex items-center gap-4 mb-10">
                            <span className="px-3 py-1 bg-orange-600 rounded-lg text-[9px] font-black uppercase tracking-widest italic shadow-lg">KRİTİK VAKA</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">STRES SEVİYESİ: %{currentResult.stressLevel}</span>
                         </div>
                         <p className="text-4xl font-black leading-tight tracking-tighter uppercase italic mb-12 group-hover:text-orange-50 transition-colors">
                            "{currentResult.scenario}"
                         </p>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">VELİ PSİKOPATOLOJİSİ</span>
                               <p className="text-sm font-medium text-slate-300 leading-relaxed italic opacity-80">"{currentResult.parentPersona}"</p>
                            </div>
                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">ADAY REFLEKSİ (MODERN)</span>
                               <p className="text-sm font-bold text-orange-100 leading-relaxed italic">"{currentResult.candidateResponse}"</p>
                            </div>
                         </div>
                      </div>
                      <div className="absolute -right-40 -top-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
                   </div>

                   {/* CLINICAL TRUTHS & MISTAKES */}
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-emerald-50/50 p-8 rounded-[3rem] border border-emerald-100 relative overflow-hidden group">
                         <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Klinik Doğrular
                         </h5>
                         <div className="space-y-4 relative z-10">
                            {currentResult.aiEvaluation.clinicalTruths.map((t: string, i: number) => (
                               <div key={i} className="flex gap-4 items-start p-4 bg-white/40 rounded-2xl border border-white">
                                  <div className="w-6 h-6 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm">✓</div>
                                  <p className="text-[11px] font-bold text-slate-700 leading-tight uppercase tracking-tight">{t}</p>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-rose-50/50 p-8 rounded-[3rem] border border-rose-100 relative overflow-hidden group">
                         <h5 className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                            Kritik Sapmalar
                         </h5>
                         <div className="space-y-4 relative z-10">
                            {currentResult.aiEvaluation.criticalMistakes.map((m: string, i: number) => (
                               <div key={i} className="flex gap-4 items-start p-4 bg-white/40 rounded-2xl border border-white">
                                  <div className="w-6 h-6 bg-rose-600 text-white rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm">!</div>
                                  <p className="text-[11px] font-bold text-slate-700 leading-tight uppercase tracking-tight">{m}</p>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* 2. METRICS (RIGHT) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                   <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                      <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">NÖRAL ANALİZ</h5>
                      <div className="space-y-8">
                         <AnalysisMetric label="Etik Sınır Koruma" value={currentResult.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
                         <AnalysisMetric label="Duygusal Empati" value={currentResult.aiEvaluation.empathyCalibration} color="text-blue-600" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                         <AnalysisMetric label="Kriz Çözüm Hızı" value={currentResult.aiEvaluation.crisisResolutionEfficiency} color="text-orange-600" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                         <AnalysisMetric label="Mesleki Mesafe" value={currentResult.aiEvaluation.professionalDistance} color="text-emerald-600" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                      </div>
                   </div>

                   {/* DEEP TRACE (MINI PANEL) */}
                   <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                      <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">BİLİŞSEL ÇELİŞKİ</h5>
                      <div className="flex items-end gap-4 mb-6">
                         <span className="text-6xl font-black text-white leading-none">%{currentResult.aiEvaluation.neuralDivergence.contradictionIndex}</span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">INDEX</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 italic leading-relaxed">
                         Adayın mülakat dürüstlüğü ile kriz anındaki etik refleksleri arasındaki sapma oranı.
                      </p>
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl"></div>
                   </div>
                </div>
             </div>

             {/* EXPANDABLE DEEP TRACE LAYER */}
             {isTraceExpanded && (
                <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-200 shadow-inner animate-slide-up space-y-10">
                   <div className="flex items-center gap-4 mb-6 border-b border-slate-200 pb-6">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-600 shadow-xl">
                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Nöral İz Analizi (Deep Trace)</h4>
                         <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-2">Bilinçdışı Karar Mekanizmaları ve Mikro-Davranış Projeksiyonu</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Nöral Karar Yolu</span>
                         <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm italic text-lg font-bold text-slate-700 leading-relaxed uppercase">
                            "{currentResult.aiEvaluation.neuralDivergence.decisionPath}"
                         </div>
                      </div>
                      <div className="space-y-4">
                         <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest block ml-2">Gölge Senaryo (Shadow Outcome)</span>
                         <div className="bg-orange-600 p-8 rounded-[3rem] text-white shadow-xl italic text-lg font-bold leading-relaxed uppercase">
                            "{currentResult.aiEvaluation.neuralDivergence.alternativeOutcome}"
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-12 rounded-[4.5rem] border border-slate-100">
                      <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 text-center">MİKRO-DAVRANIŞ TAHMİNLERİ</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {[
                            { t: 'Ses Tonu Modülasyonu', v: currentResult.aiEvaluation.microBehaviors.toneAnalysis, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
                            { t: 'Non-Verbal Projeksiyon', v: currentResult.aiEvaluation.microBehaviors.nonVerbalPrediction, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                            { t: 'Sessizlik Toleransı', v: currentResult.aiEvaluation.microBehaviors.silenceTolerance, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                         ].map((m, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-slate-900 hover:text-white transition-all group">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all mb-6 shadow-sm">
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={m.icon} /></svg>
                               </div>
                               <h6 className="text-[10px] font-black uppercase tracking-widest mb-3">{m.t}</h6>
                               <p className="text-[12px] font-bold italic opacity-70 group-hover:opacity-100">"{m.v}"</p>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-orange-600 p-16 rounded-[5.5rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
                      <div className="text-center md:text-left space-y-4 flex-1 relative z-10">
                         <h5 className="text-[11px] font-black text-orange-200 uppercase tracking-widest leading-none">Dominant Duygu Spektrumu</h5>
                         <p className="text-7xl font-black uppercase tracking-tighter leading-none italic">{currentResult.aiEvaluation.neuralDivergence.dominantEmotion}</p>
                         <p className="text-[13px] font-bold text-orange-100 leading-relaxed opacity-80 uppercase tracking-widest">Kriz anında kontrol dışı tetiklenen birincil nöral tepki.</p>
                      </div>
                      <div className="w-full md:w-auto relative z-10">
                         <button onClick={() => setIsTraceExpanded(false)} className="w-full px-16 py-7 bg-white text-slate-900 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 hover:text-white transition-all">Veri İzini Kapat</button>
                      </div>
                      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
                   </div>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalLabView;
