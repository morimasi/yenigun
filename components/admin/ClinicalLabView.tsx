
import React, { useState } from 'react';
import { Candidate, ClinicalTestType, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id);
  const [selectedTest, setSelectedTest] = useState<ClinicalTestType>(ClinicalTestType.DMP_STRESS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [phase, setPhase] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  const runTest = async () => {
    if (!activeCandidate) return;
    setIsSimulating(true);
    setResult(null);

    const phases = [
      'Nöral Profil Yükleniyor...',
      'Klinik Senaryo Oluşturuluyor...',
      'Etik İkilemler Enjekte Ediliyor...',
      'Aday Refleksleri Modelleniyor...',
      'Bilişsel Çelişki Katsayısı Hesaplanıyor...'
    ];

    let pIdx = 0;
    const interval = setInterval(() => {
      setPhase(phases[pIdx % phases.length]);
      pIdx++;
    }, 2000);

    try {
      const data = await runStresSimulation(activeCandidate, selectedTest);
      setResult(data);
    } catch (e) {
      alert("Laboratuvar Motoru Hatası: Lütfen tekrar deneyiniz.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
      setPhase('');
    }
  };

  const ScoreCard = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: React.ReactNode }) => (
    <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
       <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors">
            {icon}
          </div>
          <span className={`text-4xl font-black ${color}`}>%{value}</span>
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <div className="absolute bottom-0 left-0 h-1.5 bg-slate-50 w-full">
          <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-10 animate-fade-in items-start relative">
      
      {/* SOL: TEST KONTROL PANELİ */}
      <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-32 no-print">
        <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 space-y-10">
            <div>
              <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8">DENEY LABORATUVARI</h4>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">İNCELENECEK UZMAN</label>
                  <select 
                    className="w-full bg-white/5 p-6 rounded-[2rem] border border-white/10 text-[13px] font-bold outline-none focus:border-orange-600 transition-all text-white appearance-none"
                    value={activeCandidateId}
                    onChange={e => { setActiveCandidateId(e.target.value); setResult(null); }}
                  >
                    {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">STRES TESTİ PROTOKOLÜ</label>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.values(ClinicalTestType).map(t => (
                      <button
                        key={t}
                        onClick={() => { setSelectedTest(t); setResult(null); }}
                        className={`px-8 py-5 rounded-[2.5rem] text-[11px] font-black uppercase text-left transition-all flex items-center justify-between group ${
                          selectedTest === t ? 'bg-orange-600 text-white shadow-xl scale-[1.02]' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span>{t}</span>
                        <div className={`w-3 h-3 rounded-full ${selectedTest === t ? 'bg-white animate-pulse' : 'bg-slate-700'}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={runTest}
              disabled={isSimulating || !activeCandidate}
              className="w-full py-8 bg-white text-slate-900 rounded-[3rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
            >
              {isSimulating ? 'MUHAKEME MOTORU AKTİF...' : 'STRES TESTİNİ BAŞLAT'}
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
             Adayın Digital Twin modeli üzerinde stres testi uygulanmaktadır. Derin Muhakeme (Deep Reasoning) protokolü ile nöral sapmalar analiz edilir.
           </p>
        </div>
      </div>

      {/* SAĞ: ANALİZ SONUÇ EKRANI */}
      <div className="col-span-12 lg:col-span-8">
        {!result && !isSimulating ? (
          <div className="h-[800px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-24 opacity-40 grayscale">
             <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 border border-slate-100 shadow-inner">
               <svg className="w-20 h-20 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[1em] mb-4">VERİ BEKLENİYOR</h3>
             <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Laboratuvarı başlatmak için sol panelden bir protokol seçin.</p>
          </div>
        ) : isSimulating ? (
          <div className="h-[800px] bg-slate-50 rounded-[5rem] flex flex-col items-center justify-center space-y-12 relative overflow-hidden">
             <div className="relative">
                <div className="w-56 h-56 border-[14px] border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] animate-pulse shadow-2xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                </div>
             </div>
             <div className="text-center relative z-10 space-y-4">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Derin Muhakeme Motoru Aktif</h3>
               <p className="text-[15px] font-black text-orange-600 uppercase tracking-[0.5em] animate-pulse">{phase}</p>
             </div>
             <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-48 h-48 bg-orange-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-600 rounded-full blur-3xl"></div>
             </div>
          </div>
        ) : result && (
          <div className="space-y-12 animate-fade-in pb-20">
             
             {/* ÜST BENTO PANEL */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ScoreCard label="Liyakat Skoru" value={result.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
                <ScoreCard label="Stres Toleransı" value={100 - result.stressLevel} color="text-orange-600" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                <ScoreCard label="Klinik Empati" value={result.aiEvaluation.empathyCalibration} color="text-blue-600" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                <ScoreCard label="Mesleki Mesafe" value={result.aiEvaluation.professionalDistance} color="text-emerald-600" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
             </div>

             {/* ANA VAKA PANELİ */}
             <div className="bg-slate-900 p-20 rounded-[5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800 group">
                <div className="relative z-10">
                   <div className="flex justify-between items-center mb-16">
                      <div className="flex items-center gap-5">
                         <span className="w-4 h-4 bg-orange-600 rounded-full animate-ping"></span>
                         <h5 className="text-[13px] font-black text-orange-500 uppercase tracking-[0.6em]">AKTİF KLİNİK SİMÜLASYON</h5>
                      </div>
                      <button 
                        onClick={() => setIsDetailModalOpen(true)}
                        className="px-10 py-4 bg-white/10 hover:bg-white hover:text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                         NÖRAL İZİ SORGULA (DEEP TRACE)
                      </button>
                   </div>
                   <p className="text-4xl font-black leading-tight italic mb-16 tracking-tight uppercase">"{result.scenario}"</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-12 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-xl">
                         <span className="text-[11px] font-black text-slate-400 uppercase block mb-6 tracking-widest">Veli/Vaka Psikopatolojisi</span>
                         <p className="text-lg font-bold text-slate-300 leading-relaxed italic">"{result.parentPersona}"</p>
                      </div>
                      <div className="p-12 bg-orange-600/10 rounded-[4rem] border border-orange-600/20 backdrop-blur-xl">
                         <span className="text-[11px] font-black text-orange-500 uppercase block mb-6 tracking-widest">Öngörülen Aday Refleksi</span>
                         <p className="text-lg font-bold text-orange-100 leading-relaxed italic">"{result.candidateResponse}"</p>
                      </div>
                   </div>
                </div>
                <div className="absolute -right-60 -top-60 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[200px]"></div>
             </div>

             {/* DERİN ANALİZ KARTLARI (BENTO BOTTOM) */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-emerald-50 p-16 rounded-[5rem] border border-emerald-100 relative overflow-hidden">
                   <h5 className="text-[12px] font-black text-emerald-700 uppercase tracking-[0.4em] mb-10 border-l-4 border-emerald-600 pl-6">KLİNİK YETKİNLİK KANITLARI</h5>
                   <div className="space-y-8 relative z-10">
                      {result.aiEvaluation.clinicalTruths.map((truth, i) => (
                        <div key={i} className="flex gap-6 items-start p-6 bg-white/40 rounded-3xl border border-white">
                           <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-[14px] shrink-0 shadow-lg">✓</div>
                           <p className="text-[15px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{truth}</p>
                        </div>
                      ))}
                   </div>
                   <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-rose-50 p-16 rounded-[5rem] border border-rose-100 relative overflow-hidden">
                   <h5 className="text-[12px] font-black text-rose-700 uppercase tracking-[0.4em] mb-10 border-l-4 border-rose-600 pl-6">KRİTİK NÖRAL SAPMALAR</h5>
                   <div className="space-y-8 relative z-10">
                      {result.aiEvaluation.criticalMistakes.map((err, i) => (
                        <div key={i} className="flex gap-6 items-start p-6 bg-white/40 rounded-3xl border border-white">
                           <div className="w-8 h-8 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-[14px] shrink-0 shadow-lg">!</div>
                           <p className="text-[15px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{err}</p>
                        </div>
                      ))}
                   </div>
                   <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* DEEP TRACE MODAL */}
      {isDetailModalOpen && result && (
        <div className="fixed inset-0 z-[300] bg-slate-900/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-fade-in no-print">
           <div className="w-full max-w-6xl h-full bg-white rounded-[5rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
              <div className="p-12 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-orange-600 shadow-2xl">
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Nöral İz Analizi (Deep Trace)</h3>
                       <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mt-2">Bilişsel Çelişki ve Alternatif Olasılıklar</p>
                    </div>
                 </div>
                 <button onClick={() => setIsDetailModalOpen(false)} className="p-6 hover:bg-rose-50 rounded-[2.5rem] text-rose-500 transition-all">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-16 space-y-20 custom-scrollbar">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="p-12 bg-slate-900 rounded-[4rem] text-white">
                       <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-10">Bilişsel Çelişki (Contradiction Index)</h5>
                       <div className="flex items-end gap-5 mb-8">
                          <span className="text-7xl font-black leading-none">%{result.aiEvaluation.neuralDivergence.contradictionIndex}</span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase mb-2">SAPMA ORANI</span>
                       </div>
                       <p className="text-[13px] font-bold text-slate-300 leading-relaxed italic">"Adayın mülakat esnasındaki dürüstlük profili ile stres testindeki etik sınırları arasındaki nöral uyumsuzluk düzeyi."</p>
                    </div>
                    <div className="lg:col-span-2 p-12 bg-slate-50 rounded-[4rem] border border-slate-100 flex flex-col justify-center">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Nöral Karar Yolu</h5>
                       <p className="text-2xl font-black text-slate-900 leading-tight uppercase italic mb-8">"{result.aiEvaluation.neuralDivergence.decisionPath}"</p>
                       <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <span className="text-[10px] font-black text-orange-600 uppercase block mb-4">Alternatif Senaryo (Shadow Outcome)</span>
                          <p className="text-[14px] font-bold text-slate-600 italic leading-relaxed">"{result.aiEvaluation.neuralDivergence.alternativeOutcome}"</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-12">
                    <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-8 border-orange-600 pl-8">MİKRO-DAVRANIŞSAL SİMÜLASYON TAHMİNLERİ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {[
                         { t: 'Ses Tonu Analizi', v: result.aiEvaluation.microBehaviors.toneAnalysis, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
                         { t: 'Beden Dili Projeksiyonu', v: result.aiEvaluation.microBehaviors.nonVerbalPrediction, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                         { t: 'Sessizlik Eşiği', v: result.aiEvaluation.microBehaviors.silenceTolerance, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                       ].map((m, i) => (
                         <div key={i} className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl group hover:border-orange-500 transition-all">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all mb-8 shadow-inner">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={m.icon} /></svg>
                            </div>
                            <h6 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">{m.t}</h6>
                            <p className="text-[14px] font-bold text-slate-500 leading-relaxed italic">"{m.v}"</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-orange-600 p-16 rounded-[5.5rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                    <div className="text-center md:text-left space-y-4 flex-1">
                       <h5 className="text-[11px] font-black text-orange-200 uppercase tracking-widest leading-none">Dominant Duygu Spektrumu</h5>
                       <p className="text-7xl font-black uppercase tracking-tighter leading-none">{result.aiEvaluation.neuralDivergence.dominantEmotion}</p>
                       <p className="text-[13px] font-bold text-orange-100 leading-relaxed opacity-80 uppercase tracking-widest">Adayın kriz anında baskılamaya çalıştığı birincil nöral tepki.</p>
                    </div>
                    <div className="w-full md:w-auto">
                       <button onClick={() => setIsDetailModalOpen(false)} className="w-full px-16 py-7 bg-white text-slate-900 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 hover:text-white transition-all">Veri İzini Kapat</button>
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
