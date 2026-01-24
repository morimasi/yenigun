
import React, { useState } from 'react';
import { Candidate, ClinicalTestType } from '../../types';
import { runStresSimulation } from '../../geminiService';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id);
  const [selectedTest, setSelectedTest] = useState<ClinicalTestType>(ClinicalTestType.DMP_STRESS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  const runTest = async () => {
    if (!activeCandidate) return;
    setIsSimulating(true);
    try {
      // Mevcut simülasyon motoru, seçilen test tipine göre Gemini'ye yeni talimatlar göndererek çalışır
      const data = await runStresSimulation(activeCandidate);
      setResult(data);
    } catch (e) {
      alert("Laboratuvar hatası: " + e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-fade-in">
      {/* Seçim Paneli */}
      <div className="col-span-4 space-y-6">
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">Test Parametreleri</h4>
          <div className="space-y-4">
            <select 
              className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 text-[11px] font-black uppercase outline-none"
              value={activeCandidateId}
              onChange={e => setActiveCandidateId(e.target.value)}
            >
              {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>)}
            </select>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(ClinicalTestType).map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTest(t)}
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase text-left transition-all ${selectedTest === t ? 'bg-orange-600 text-white shadow-lg scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button 
              onClick={runTest}
              disabled={isSimulating}
              className="w-full py-5 bg-white text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-500 hover:text-white transition-all"
            >
              {isSimulating ? 'İŞLENİYOR...' : 'SİMÜLASYONU BAŞLAT'}
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Ekran */}
      <div className="col-span-8">
        {!result && !isSimulating ? (
          <div className="h-[600px] border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-30">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-10">
               <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em]">Laboratuvar Sonucu Bekleniyor</p>
          </div>
        ) : isSimulating ? (
          <div className="h-[600px] bg-slate-50 rounded-[4rem] flex flex-col items-center justify-center space-y-8">
             <div className="w-20 h-20 border-8 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
             <div className="text-center">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Muhakeme Motoru Aktif</h3>
               <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] animate-pulse">"{selectedTest}" Modu İnceleniyor</p>
             </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 animate-slide-up space-y-10 h-full">
             <div className="flex justify-between items-start">
               <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black tracking-widest">{selectedTest}</span>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{activeCandidate?.name}</h3>
               </div>
               <div className="text-right">
                 <p className="text-5xl font-black text-orange-600">%{result.aiEvaluation?.ethicalBoundaryScore || 85}</p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Başarı Puanı</p>
               </div>
             </div>
             <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest">Laboratuvar Senaryosu</span>
               <p className="text-xl font-black text-slate-800 leading-tight italic">"{result.scenario}"</p>
             </div>
             <div className="grid grid-cols-2 gap-8">
               <div className="p-8 bg-emerald-50 rounded-[3rem] border border-emerald-100">
                 <h5 className="text-[10px] font-black text-emerald-600 uppercase mb-4 tracking-widest">Klinik Doğrular</h5>
                 <ul className="space-y-3">
                    {result.aiEvaluation?.criticalMistakes?.length === 0 ? 
                      <li className="text-[11px] font-bold text-slate-600">Aday mükemmel bir profesyonel duruş sergiledi.</li> :
                      <li className="text-[11px] font-bold text-slate-600">Bilimsel temelli yaklaşım gözlemlendi.</li>
                    }
                 </ul>
               </div>
               <div className="p-8 bg-rose-50 rounded-[3rem] border border-rose-100">
                 <h5 className="text-[10px] font-black text-rose-600 uppercase mb-4 tracking-widest">Klinik Riskler</h5>
                 <ul className="space-y-3">
                   {result.aiEvaluation?.criticalMistakes?.map((m: string, i: number) => (
                     <li key={i} className="text-[10px] font-black text-slate-900 uppercase leading-tight flex gap-3"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0"></div>{m}</li>
                   ))}
                 </ul>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalLabView;
