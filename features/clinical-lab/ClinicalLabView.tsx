
import React, { useState } from 'react';
import { Candidate, ClinicalTestType, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || '');
  const [selectedTest, setSelectedTest] = useState<ClinicalTestType>(ClinicalTestType.DMP_STRESS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [phase, setPhase] = useState('');

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  const runTest = async () => {
    if (!activeCandidate) return;
    setIsSimulating(true);
    setResult(null);

    const phases = [
      'Nöral Profil İnceleniyor...',
      'Akademik Geçmiş Veriye Dönüştürülüyor...',
      'Stres Senaryosu Kurgulanıyor...',
      'Klinik Muhakeme Test Ediliyor...'
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
      alert("Simülasyon Hatası: Sunucu meşgul.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
      setPhase('');
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-fade-in pb-20">
      {/* SOL KONTROL PANELİ */}
      <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-32 no-print">
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl border border-slate-800 overflow-hidden relative">
          <div className="relative z-10 space-y-8">
            <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">DENEY KOMUTASI</h4>
            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-2">İNCELENECEK AKADEMİSYEN</label>
                <select 
                  className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-orange-500 transition-all appearance-none"
                  value={activeCandidateId}
                  onChange={e => { setActiveCandidateId(e.target.value); setResult(null); }}
                >
                  {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-2">STRES PROTOKOLÜ</label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(ClinicalTestType).map(t => (
                    <button
                      key={t}
                      onClick={() => { setSelectedTest(t); setResult(null); }}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase text-left transition-all flex items-center justify-between ${
                        selectedTest === t ? 'bg-orange-600 text-white shadow-xl' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span>{t}</span>
                      <div className={`w-2 h-2 rounded-full ${selectedTest === t ? 'bg-white animate-pulse' : 'bg-slate-700'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={runTest}
              disabled={isSimulating || !activeCandidate}
              className="w-full py-6 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
            >
              {isSimulating ? 'MODEL ÇALIŞTIRILIYOR...' : 'SİMÜLASYONU BAŞLAT'}
            </button>
          </div>
        </div>
      </div>

      {/* SAĞ ANALİZ EKRANI */}
      <div className="col-span-12 lg:col-span-8">
        {!result && !isSimulating ? (
          <div className="h-[700px] bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-24 opacity-30 grayscale">
             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.8em]">ANALİZ BEKLENİYOR</h3>
          </div>
        ) : isSimulating ? (
          <div className="h-[700px] bg-slate-50 rounded-[4rem] flex flex-col items-center justify-center space-y-10 relative overflow-hidden">
             <div className="w-32 h-32 border-[10px] border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
             <p className="text-[14px] font-black text-orange-600 uppercase tracking-[0.5em] animate-pulse">{phase}</p>
          </div>
        ) : result && (
          <div className="space-y-10 animate-fade-in">
             {/* VAKA ÖZETİ PANELİ */}
             <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                   <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">SİMÜLASYON SENARYOSU</div>
                   <div className="h-[2px] flex-1 bg-slate-50"></div>
                </div>
                <p className="text-3xl font-black text-slate-900 leading-tight italic mb-10">"{result.scenario}"</p>
                <div className="grid grid-cols-2 gap-8">
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">Veli Profili (Farazi)</span>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{result.parentPersona}"</p>
                   </div>
                   <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-3">Adayın Muhtemel Refleksi</span>
                      <p className="text-sm font-bold text-slate-300 leading-relaxed italic">"{result.candidateResponse}"</p>
                   </div>
                </div>
             </div>

             {/* DERİN ANALİZ KARTLARI */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-50/50 p-12 rounded-[4rem] border border-emerald-100 space-y-8">
                   <h5 className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.4em] border-l-4 border-emerald-600 pl-4">KLİNİK DOĞRULAR & AVANTAJLAR</h5>
                   <div className="space-y-6">
                      {(result.aiEvaluation?.clinicalTruths || []).map((t, i) => (
                        <div key={i} className="group">
                           <p className="text-[13px] font-black text-slate-800 leading-snug uppercase tracking-tight flex items-start gap-3">
                              <span className="w-5 h-5 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-[10px] shrink-0 mt-1 shadow-lg">✓</span>
                              {t}
                           </p>
                           <p className="text-[11px] font-bold text-emerald-600/70 mt-2 ml-8 italic">
                              * Klinik Etki: Bu davranış, kurumun bilimsel standartlarını korur ve veli nezdinde akademik otoriteyi pekiştirir.
                           </p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-rose-50/50 p-12 rounded-[4rem] border border-rose-100 space-y-8">
                   <h5 className="text-[11px] font-black text-rose-700 uppercase tracking-[0.4em] border-l-4 border-rose-600 pl-4">RİSK ANALİZİ & KRİTİK HATALAR</h5>
                   <div className="space-y-6">
                      {(result.aiEvaluation?.criticalMistakes || []).map((m, i) => (
                        <div key={i} className="group">
                           <p className="text-[13px] font-black text-slate-800 leading-snug uppercase tracking-tight flex items-start gap-3">
                              <span className="w-5 h-5 bg-rose-600 text-white rounded-lg flex items-center justify-center text-[10px] shrink-0 mt-1 shadow-lg">!</span>
                              {m}
                           </p>
                           <p className="text-[11px] font-bold text-rose-600/70 mt-2 ml-8 italic">
                              * Kurumsal Risk: Adayın bu zafiyeti, uzun vadede vaka kaybına veya profesyonel sınır ihlallerine yol açabilir.
                           </p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* NÖRAL SAPMA PANELİ */}
             <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-200">
                <div className="flex justify-between items-end mb-10">
                   <div>
                      <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">BİLİŞSEL ÇELİŞKİ İNDEKSİ (DEEP TRACE)</h5>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Adayın maskelediği nöral tepkilerin sapma oranı</p>
                   </div>
                   <span className="text-6xl font-black text-slate-900">%{result.aiEvaluation?.neuralDivergence?.contradictionIndex || 0}</span>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 mb-8">
                   <span className="text-[10px] font-black text-blue-600 uppercase block mb-3">Nöral Karar Yolu</span>
                   <p className="text-lg font-bold text-slate-800 leading-tight italic">"{result.aiEvaluation?.neuralDivergence?.decisionPath}"</p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                   <div className="p-6 bg-slate-900 text-white rounded-[2rem]">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Dominant Duygu</p>
                      <p className="text-sm font-black uppercase tracking-tighter text-orange-500">{result.aiEvaluation?.neuralDivergence?.dominantEmotion}</p>
                   </div>
                   <div className="p-6 bg-white border border-slate-200 rounded-[2rem]">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Ses Tonu Projeksiyonu</p>
                      <p className="text-[11px] font-bold text-slate-600 leading-tight">"{result.aiEvaluation?.microBehaviors?.toneAnalysis}"</p>
                   </div>
                   <div className="p-6 bg-white border border-slate-200 rounded-[2rem]">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Sessizlik Toleransı</p>
                      <p className="text-sm font-black uppercase text-slate-800">{result.aiEvaluation?.microBehaviors?.silenceTolerance}</p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalLabView;
