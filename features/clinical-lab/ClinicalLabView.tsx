
import React, { useState } from 'react';
import { Candidate, ClinicalTestType, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || '');
  const [selectedTest, setSelectedTest] = useState<ClinicalTestType>(ClinicalTestType.DMP_STRESS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [phase, setPhase] = useState('');
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  const runTest = async () => {
    if (!activeCandidate) return;
    setIsSimulating(true);
    setResult(null);

    const phases = [
      'Nöral Profil Yükleniyor...',
      'Klinik Senaryo Oluşturuluyor...',
      'Etik İkilemler Enjekte Ediliyor...',
      'Bilişsel Çelişki Hesaplanıyor...',
      'Otopsi Raporu Hazırlanıyor...'
    ];

    let pIdx = 0;
    const interval = setInterval(() => {
      setPhase(phases[pIdx % phases.length]);
      pIdx++;
    }, 1500);

    try {
      const data = await runStresSimulation(activeCandidate, selectedTest);
      setResult(data);
    } catch (e) {
      alert("Laboratuvar Motoru Hatası: Nöral veri paketi çözülemedi.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
      setPhase('');
    }
  };

  const AnalysisCard = ({ label, value, color, description }: { label: string, value: number, color: string, description: string }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-200 transition-all group relative overflow-hidden">
       <div className="flex justify-between items-start mb-2">
          <div className="space-y-0.5">
             <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</h6>
             <p className="text-[8px] font-bold text-slate-300 uppercase leading-none truncate max-w-[120px]" title={description}>{description}</p>
          </div>
          <span className={`text-2xl font-black ${color}`}>%{value}</span>
       </div>
       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-4 animate-fade-in pb-10 items-start h-[calc(100vh-6rem)] overflow-hidden">
      
      {/* SOL: DENEY KONTROL ÜNİTESİ (KOMPAKT) */}
      <div className="col-span-12 lg:col-span-3 space-y-4 h-full flex flex-col">
        <div className="bg-slate-900 p-5 rounded-[2rem] text-white shadow-lg border border-slate-800 relative overflow-hidden flex-1 flex flex-col">
          <div className="relative z-10 space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                 <div className="w-6 h-6 bg-orange-600 rounded-lg flex items-center justify-center font-black text-[10px]">L</div>
                 <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">ARAŞTIRMA KOMUTASI</h4>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">DENEY ADAYI</label>
                  <select 
                    className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-[11px] font-bold outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    value={activeCandidateId}
                    onChange={e => { setActiveCandidateId(e.target.value); setResult(null); }}
                  >
                    {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">PROTOKOL SEÇİMİ</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {Object.values(ClinicalTestType).map(t => (
                      <button
                        key={t}
                        onClick={() => { setSelectedTest(t); setResult(null); }}
                        className={`px-3 py-2.5 rounded-lg text-[9px] font-black uppercase text-left transition-all flex items-center justify-between group ${
                          selectedTest === t ? 'bg-orange-600 text-white shadow-md' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate pr-2">{t}</span>
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedTest === t ? 'bg-white animate-pulse' : 'bg-slate-700'}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <button 
              onClick={runTest}
              disabled={isSimulating || !activeCandidate}
              className="w-full py-4 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-orange-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
            >
              {isSimulating ? 'İŞLENİYOR...' : 'TESTİ BAŞLAT'}
            </button>
          </div>
        </div>
      </div>

      {/* SAĞ: ANALİZ SONUÇ EKRANI (DENSE) */}
      <div className="col-span-12 lg:col-span-9 h-full overflow-y-auto custom-scrollbar pr-2">
        {!result && !isSimulating ? (
          <div className="h-full bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center p-10 opacity-40 grayscale relative overflow-hidden">
             <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-100">
               <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">SİMÜLASYON BEKLENİYOR</h3>
             <p className="text-[10px] font-bold text-slate-300 uppercase">Sol panelden bir protokol seçin.</p>
          </div>
        ) : isSimulating ? (
          <div className="h-full bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center space-y-6 border border-slate-100 shadow-inner">
             <div className="w-16 h-16 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
             <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] animate-pulse">{phase}</p>
          </div>
        ) : result && (
          <div className="space-y-4 animate-scale-in">
             
             {/* 1. ÜST BİLGİ KARTI */}
             <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden group flex justify-between items-center">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                      <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">AKTİF SENARYO</h5>
                      <span className="px-3 py-1 bg-white/10 rounded-lg text-[8px] font-bold uppercase tracking-widest">STRES: %{result.stressLevel}</span>
                   </div>
                   <p className="text-lg font-bold leading-tight italic tracking-tight uppercase opacity-90 max-w-3xl">"{result.scenario}"</p>
                </div>
                <button 
                  onClick={() => setIsTraceModalOpen(true)}
                  className="px-6 py-3 bg-white/10 hover:bg-white hover:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                >
                   NÖRAL İZİ AÇ
                </button>
             </div>

             {/* 2. METRİKLER (4 Sütun) */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnalysisCard label="Etik Sınır" value={result.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" description="Kurumsal ilkelere sadakat." />
                <AnalysisCard label="Kriz Çözüm" value={result.aiEvaluation.crisisResolutionEfficiency} color="text-orange-600" description="Operasyonel hız." />
                <AnalysisCard label="Empati" value={result.aiEvaluation.empathyCalibration} color="text-blue-600" description="Duygusal kalibrasyon." />
                <AnalysisCard label="Mesafe" value={result.aiEvaluation.professionalDistance} color="text-emerald-600" description="Profesyonel duruş." />
             </div>

             {/* 3. REFLEKS VE PROFİL ANALİZİ */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                   <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">ADAY REFLEKSİ</h5>
                   <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"{result.candidateResponse}"</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                   <h5 className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">VELİ PSİKOPATOLOJİSİ</h5>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed">"{result.parentPersona}"</p>
                </div>
             </div>

             {/* 4. KANITLAR VE HATALAR (COMPACT LIST) */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 p-5 rounded-[2rem] border border-emerald-100">
                   <h5 className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-3">KLİNİK DOĞRULAR</h5>
                   <div className="space-y-2">
                      {result.aiEvaluation.clinicalTruths.map((truth, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <div className="w-4 h-4 bg-emerald-500 text-white rounded flex items-center justify-center font-black text-[9px] shrink-0">✓</div>
                           <p className="text-[10px] font-bold text-slate-700 uppercase leading-tight">{truth}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-rose-50/50 p-5 rounded-[2rem] border border-rose-100">
                   <h5 className="text-[9px] font-black text-rose-700 uppercase tracking-widest mb-3">KRİTİK HATALAR</h5>
                   <div className="space-y-2">
                      {result.aiEvaluation.criticalMistakes.map((err, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <div className="w-4 h-4 bg-rose-500 text-white rounded flex items-center justify-center font-black text-[9px] shrink-0">!</div>
                           <p className="text-[10px] font-bold text-slate-700 uppercase leading-tight">{err}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* DEEP TRACE MODAL (COMPACT) */}
      {isTraceModalOpen && result && (
        <div className="fixed inset-0 z-[300] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in no-print">
           <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nöral İz Analizi</h3>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Deep Trace Protocol</p>
                 </div>
                 <button onClick={() => setIsTraceModalOpen(false)} className="p-3 hover:bg-rose-50 rounded-xl text-rose-500 transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 <div className="flex items-center gap-8 bg-slate-900 p-8 rounded-[2rem] text-white">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">BİLİŞSEL ÇELİŞKİ</span>
                        <span className="text-5xl font-black text-orange-500">%{result.aiEvaluation.neuralDivergence.contradictionIndex}</span>
                    </div>
                    <div className="h-12 w-px bg-white/10"></div>
                    <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                       "Adayın mülakat esnasındaki dürüstlük profili ile stres testindeki etik sınırları arasındaki nöral uyumsuzluk düzeyi."
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                       <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-3">NÖRAL KARAR YOLU</h5>
                       <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{result.aiEvaluation.neuralDivergence.decisionPath}"</p>
                    </div>
                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-[2rem]">
                       <h5 className="text-[9px] font-black text-orange-700 uppercase tracking-widest mb-3">GÖLGE SENARYO (SHADOW)</h5>
                       <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{result.aiEvaluation.neuralDivergence.alternativeOutcome}"</p>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">MİKRO-DAVRANIŞ TAHMİNLERİ</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {[
                         { t: 'Ses Tonu', v: result.aiEvaluation.microBehaviors.toneAnalysis },
                         { t: 'Beden Dili', v: result.aiEvaluation.microBehaviors.nonVerbalPrediction },
                         { t: 'Sessizlik', v: result.aiEvaluation.microBehaviors.silenceTolerance }
                       ].map((m, i) => (
                         <div key={i} className="p-4 bg-slate-50 rounded-xl">
                            <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">{m.t}</span>
                            <p className="text-[10px] font-bold text-slate-800 leading-tight">"{m.v}"</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalLabView;
