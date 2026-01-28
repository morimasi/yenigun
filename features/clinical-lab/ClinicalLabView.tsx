
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
      'Nöral Profil Matrisi Yükleniyor...',
      'Akademik Geçmişteki Çelişkiler Taranıyor...',
      'Stres Senaryosu Nöral Olarak Modelleniyor...',
      'Bilişsel Çelişki Katsayısı (Contradiction) Hesaplanıyor...',
      'Klinik Otopsi Raporu Hazırlanıyor...'
    ];

    let pIdx = 0;
    const interval = setInterval(() => {
      setPhase(phases[pIdx % phases.length]);
      pIdx++;
    }, 2500);

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
    <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
       <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
             <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</h6>
             <p className="text-[9px] font-bold text-slate-300 uppercase leading-none">{description}</p>
          </div>
          <span className={`text-5xl font-black ${color}`}>%{value}</span>
       </div>
       <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-8 animate-fade-in pb-20 items-start">
      
      {/* SOL: DENEY KONTROL ÜNİTESİ */}
      <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-32 no-print">
        <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-3xl border border-slate-800 relative overflow-hidden group">
          <div className="relative z-10 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center font-black text-xs">L</div>
                 <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em]">ARAŞTIRMA KOMUTASI</h4>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">DENEY ADAYI</label>
                  <select 
                    className="w-full bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-white font-bold outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    value={activeCandidateId}
                    onChange={e => { setActiveCandidateId(e.target.value); setResult(null); }}
                  >
                    {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">STRES PROTOKOLÜ</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(ClinicalTestType).map(t => (
                      <button
                        key={t}
                        onClick={() => { setSelectedTest(t); setResult(null); }}
                        className={`px-8 py-5 rounded-[2.2rem] text-[10px] font-black uppercase text-left transition-all flex items-center justify-between group ${
                          selectedTest === t ? 'bg-orange-600 text-white shadow-xl scale-[1.02]' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                      >
                        <span>{t}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${selectedTest === t ? 'bg-white animate-pulse' : 'bg-slate-700'}`}></div>
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
              {isSimulating ? 'ZİHİNSEL ANALİZ AKTİF...' : 'SİMÜLASYONU BAŞLAT'}
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
        </div>

        <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-tighter italic">
             "Adayın mülakat verileri, beyan ettiği eğitimlerin metodolojik derinliği ve kriz refleksleri arasındaki nöral çakışma analiz edilmektedir."
           </p>
        </div>
      </div>

      {/* SAĞ: ANALİZ SONUÇLARI VE BENTO GRID */}
      <div className="col-span-12 lg:col-span-8 space-y-10">
        {!result && !isSimulating ? (
          <div className="h-[800px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-24 opacity-30 grayscale relative overflow-hidden">
             <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 shadow-inner border border-slate-100">
               <svg className="w-20 h-20 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.8em] mb-4">VERİ BEKLENİYOR</h3>
             <p className="text-[12px] font-black uppercase tracking-widest text-slate-300">Laboratuvarı başlatmak için sol panelden bir aday ve protokol seçin.</p>
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
          </div>
        ) : isSimulating ? (
          <div className="h-[800px] bg-slate-50 rounded-[5rem] flex flex-col items-center justify-center space-y-12 relative overflow-hidden border border-slate-100 shadow-inner">
             <div className="relative">
                <div className="w-56 h-56 border-[16px] border-slate-200 border-t-orange-600 rounded-full animate-spin shadow-2xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] shadow-3xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                </div>
             </div>
             <div className="text-center relative z-10 space-y-6">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Nöral Muhakeme Devrede</h3>
               <p className="text-[15px] font-black text-orange-600 uppercase tracking-[0.5em] animate-bounce">{phase}</p>
             </div>
             <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-600 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-[120px]"></div>
             </div>
          </div>
        ) : result && (
          <div className="space-y-10 animate-scale-in pb-20">
             
             {/* ÜST ANALİZ PANELİ - BENTO GRID 1 */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  onClick={() => setIsTraceModalOpen(true)}
                  className="bg-slate-900 p-12 rounded-[5rem] text-white shadow-3xl relative overflow-hidden group cursor-pointer border border-slate-800"
                >
                   <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                         <div className="flex justify-between items-start mb-12">
                            <div className="flex items-center gap-4">
                               <span className="w-4 h-4 bg-orange-600 rounded-full animate-ping"></span>
                               <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em]">AKTİF SİMÜLASYON SENARYOSU</h5>
                            </div>
                            <span className="px-5 py-2 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">STRES: %{result.stressLevel}</span>
                         </div>
                         <p className="text-4xl font-black leading-tight italic tracking-tight uppercase group-hover:text-orange-500 transition-colors">"{result.scenario}"</p>
                      </div>
                      <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-8">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nöral İz Analizini Görüntüle</span>
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                         </div>
                      </div>
                   </div>
                   <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[200px] group-hover:scale-110 transition-transform duration-1000"></div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                   <AnalysisCard label="Etik Sınır Koruma" value={result.aiEvaluation.ethicalBoundaryScore} color="text-slate-900" description="Adayın baskı altında kurum ilkelerine sadakati." />
                   <AnalysisCard label="Kriz Çözüm Verimi" value={result.aiEvaluation.crisisResolutionEfficiency} color="text-orange-600" description="Problem davranış anındaki operasyonel hızı." />
                </div>
             </div>

             {/* SONUÇLAR VE KANITLAR - BENTO GRID 2 */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-7 bg-white p-16 rounded-[5rem] shadow-2xl border border-slate-100 relative overflow-hidden group">
                   <div className="flex items-center gap-5 mb-12">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </div>
                      <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-8 border-orange-600 pl-6 leading-none">ÖNGÖRÜLEN ADAY REFLEKSİ</h5>
                   </div>
                   <p className="text-2xl font-black text-slate-800 leading-snug italic uppercase tracking-tighter opacity-90 group-hover:opacity-100 transition-opacity">
                      "{result.candidateResponse}"
                   </p>
                   <div className="mt-12 p-10 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner group-hover:bg-orange-50 group-hover:border-orange-100 transition-all duration-700">
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-4">Veli Psikopatolojisi (Çatışma Odağı)</span>
                      <p className="text-base font-bold text-slate-600 leading-relaxed italic">"{result.parentPersona}"</p>
                   </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                   <div className="bg-emerald-50 p-12 rounded-[4.5rem] border border-emerald-100 shadow-xl relative overflow-hidden group">
                      <h5 className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.4em] mb-8 border-l-4 border-emerald-600 pl-6">KLİNİK AVANTAJLAR</h5>
                      <div className="space-y-6 relative z-10">
                         {result.aiEvaluation.clinicalTruths.map((truth, i) => (
                           <div key={i} className="flex gap-5 items-start p-5 bg-white/40 rounded-3xl border border-white group-hover:bg-white transition-all">
                              <div className="w-7 h-7 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-[12px] shrink-0 shadow-lg">✓</div>
                              <p className="text-[13px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{truth}</p>
                           </div>
                         ))}
                      </div>
                      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                   </div>

                   <div className="bg-rose-50 p-12 rounded-[4.5rem] border border-rose-100 shadow-xl relative overflow-hidden group">
                      <h5 className="text-[11px] font-black text-rose-700 uppercase tracking-[0.4em] mb-8 border-l-4 border-rose-600 pl-6">NÖRAL SAPMALAR</h5>
                      <div className="space-y-6 relative z-10">
                         {result.aiEvaluation.criticalMistakes.map((err, i) => (
                           <div key={i} className="flex gap-5 items-start p-5 bg-white/40 rounded-3xl border border-white group-hover:bg-white transition-all">
                              <div className="w-7 h-7 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-[12px] shrink-0 shadow-lg">!</div>
                              <p className="text-[13px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{err}</p>
                           </div>
                         ))}
                      </div>
                      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* NEURAL TRACE MODAL: ADAY ANALİZİNİN "SİYAH KUTUSU" */}
      {isTraceModalOpen && result && (
        <div className="fixed inset-0 z-[300] bg-slate-900/98 backdrop-blur-3xl flex items-center justify-center p-8 animate-fade-in no-print">
           <div className="w-full max-w-7xl h-full bg-white rounded-[6rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in relative border border-white/20">
              
              {/* MODAL HEADER */}
              <div className="p-16 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center relative overflow-hidden">
                 <div className="flex items-center gap-10 relative z-10">
                    <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-orange-600 shadow-3xl">
                       <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Nöral İz Analizi (Deep Trace)</h3>
                       <p className="text-[13px] font-black text-orange-600 uppercase tracking-[0.5em] mt-3">Bilişsel Çelişki ve Alternatif Olasılıklar Matrisi</p>
                    </div>
                 </div>
                 <button onClick={() => setIsTraceModalOpen(false)} className="p-8 hover:bg-rose-50 rounded-[3rem] text-rose-500 transition-all z-10 group">
                    <svg className="w-12 h-12 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
                 <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[200px]"></div>
              </div>

              {/* MODAL CONTENT: THE DEEP DIVE */}
              <div className="flex-1 overflow-y-auto p-16 md:p-24 space-y-24 custom-scrollbar bg-[#FAFAFA]">
                 
                 {/* KATMAN 1: ÇELİŞKİ VE KARAR YOLU */}
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                    <div className="lg:col-span-5 bg-slate-900 p-16 rounded-[5rem] text-white shadow-3xl relative overflow-hidden flex flex-col justify-between group">
                       <div className="relative z-10">
                          <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em] mb-16 border-b border-white/5 pb-8 uppercase">BİLİŞSEL ÇELİŞKİ (CONTRADICTION INDEX)</h5>
                          <div className="flex items-end gap-6 mb-12">
                             <span className="text-9xl font-black leading-none tracking-tighter group-hover:text-orange-500 transition-colors">%{result.aiEvaluation.neuralDivergence.contradictionIndex}</span>
                             <span className="text-[14px] font-bold text-slate-400 uppercase mb-4 tracking-widest">SAPMA ORANI</span>
                          </div>
                          <p className="text-xl font-bold text-slate-300 leading-relaxed italic tracking-tight opacity-80">
                             "Adayın mülakat esnasındaki dürüstlük profili ile stres testindeki etik sınırları arasındaki nöral uyumsuzluk düzeyi. %30 üzerindeki sapmalar potansiyel 'Sosyal Maskeleme' emaresidir."
                          </p>
                       </div>
                       <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000"></div>
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                       <div className="bg-white p-16 rounded-[5rem] border border-slate-100 shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                          <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em] mb-10 border-l-8 border-orange-600 pl-8 leading-none">NÖRAL KARAR YOLU</h5>
                          <p className="text-3xl font-black text-slate-900 leading-tight uppercase italic mb-12 group-hover:text-orange-600 transition-colors">"{result.aiEvaluation.neuralDivergence.decisionPath}"</p>
                          <div className="p-10 bg-orange-50 rounded-[4rem] border border-orange-100 shadow-inner">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-xl italic font-black">S</div>
                                <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">Gölge Senaryo (Shadow Outcome)</span>
                             </div>
                             <p className="text-xl font-bold text-slate-700 italic leading-relaxed">"{result.aiEvaluation.neuralDivergence.alternativeOutcome}"</p>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                       </div>
                    </div>
                 </div>

                 {/* KATMAN 2: MİKRO-DAVRANIŞSAL PROJEKSİYONLAR */}
                 <div className="space-y-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
                       <div>
                          <h4 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Davranışsal Simülasyon Tahminleri</h4>
                          <p className="text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-[0.4em]">Gemini-3 Nöral Motoru tarafından üretilen mikro-davranış modelleri.</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                       {[
                         { t: 'Ses Tonu Analizi', v: result.aiEvaluation.microBehaviors.toneAnalysis, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
                         { t: 'Beden Dili Projeksiyonu', v: result.aiEvaluation.microBehaviors.nonVerbalPrediction, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                         { t: 'Sessizlik Eşiği', v: result.aiEvaluation.microBehaviors.silenceTolerance, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                       ].map((m, i) => (
                         <div key={i} className="p-16 bg-white rounded-[5rem] border border-slate-100 shadow-xl group hover:border-orange-500 transition-all duration-700 relative overflow-hidden">
                            <div className="w-16 h-16 bg-slate-50 rounded-[2.2rem] flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all mb-12 shadow-inner group-hover:rotate-12">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={m.icon} /></svg>
                            </div>
                            <h6 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-6 group-hover:text-orange-600 transition-colors">{m.t}</h6>
                            <p className="text-[16px] font-bold text-slate-500 leading-relaxed italic uppercase tracking-tighter opacity-80 group-hover:opacity-100 group-hover:text-slate-900 transition-all">"{m.v}"</p>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-bl-full translate-x-24 -translate-y-24 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* KATMAN 3: DOMINANT DUYGU VE FİNAL VERDİCT */}
                 <div className="bg-orange-600 p-20 rounded-[6rem] text-white flex flex-col lg:flex-row items-center gap-16 shadow-3xl relative overflow-hidden group">
                    <div className="text-center lg:text-left space-y-6 flex-1 relative z-10">
                       <h5 className="text-[12px] font-black text-orange-200 uppercase tracking-[0.5em] leading-none mb-10 border-b border-white/10 pb-6">DOMİNANT DUYGU SPEKTRUMU</h5>
                       <p className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-none group-hover:scale-105 transition-transform duration-1000">{result.aiEvaluation.neuralDivergence.dominantEmotion}</p>
                       <p className="text-xl font-bold text-orange-100 leading-relaxed opacity-90 uppercase tracking-widest max-w-2xl">
                          "Adayın kriz anında baskılamaya çalıştığı ancak muhakeme motoru tarafından saptanan birincil nöral tepki. Bu duygu, adayın uzun vadeli tükenmişlik yörüngesini belirler."
                       </p>
                    </div>
                    <div className="w-full lg:w-auto relative z-10">
                       <button 
                         onClick={() => setIsTraceModalOpen(false)}
                         className="w-full px-24 py-10 bg-white text-slate-900 rounded-[3rem] text-[14px] font-black uppercase tracking-[0.4em] shadow-3xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                       >
                          VERİ İZİNİ KAPAT
                       </button>
                    </div>
                    <div className="absolute -left-60 -bottom-60 w-[800px] h-[800px] bg-white/5 rounded-full blur-[200px] group-hover:scale-125 transition-transform duration-1000"></div>
                 </div>

              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalLabView;
