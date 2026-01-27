
import React, { useState } from 'react';
import { Candidate, ClinicalTestType, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || '');
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
          <span className={`text-4xl font-black ${color}`}>%{value || 0}</span>
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <div className="absolute bottom-0 left-0 h-1.5 bg-slate-50 w-full">
          <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value || 0}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-10 animate-fade-in items-start relative">
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
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">STRES TESTİ PROTOKÖLÜ</label>
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
      </div>

      <div className="col-span-12 lg:col-span-8">
        {!result && !isSimulating ? (
          <div className="h-[800px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-24 opacity-40 grayscale">
             <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[1em] mb-4">VERİ BEKLENİYOR</h3>
          </div>
        ) : isSimulating ? (
          <div className="h-[800px] bg-slate-50 rounded-[5rem] flex flex-col items-center justify-center space-y-12">
             <div className="w-56 h-56 border-[14px] border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
             <p className="text-[15px] font-black text-orange-600 uppercase tracking-[0.5em] animate-pulse">{phase}</p>
          </div>
        ) : result && (
          <div className="space-y-12 animate-fade-in pb-20">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ScoreCard label="Liyakat Skoru" value={result.aiEvaluation?.ethicalBoundaryScore || 0} color="text-slate-900" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
                <ScoreCard label="Stres Toleransı" value={100 - (result.stressLevel || 0)} color="text-orange-600" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                <ScoreCard label="Klinik Empati" value={result.aiEvaluation?.empathyCalibration || 0} color="text-blue-600" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                <ScoreCard label="Mesleki Mesafe" value={result.aiEvaluation?.professionalDistance || 0} color="text-emerald-600" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
             </div>
             <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                   <h5 className="text-[13px] font-black text-orange-500 uppercase tracking-[0.6em] mb-12">AKTİF KLİNİK SİMÜLASYON</h5>
                   <p className="text-3xl font-black leading-tight italic mb-12">"{result.scenario || 'Senaryo oluşturulamadı.'}"</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10">
                         <span className="text-[11px] font-black text-slate-400 uppercase block mb-4">Veli/Vaka Psikopatolojisi</span>
                         <p className="text-lg font-bold text-slate-300 italic">"{result.parentPersona || 'Profil verisi yok.'}"</p>
                      </div>
                      <div className="p-10 bg-orange-600/10 rounded-[3.5rem] border border-orange-600/20">
                         <span className="text-[11px] font-black text-orange-500 uppercase block mb-4">Öngörülen Aday Refleksi</span>
                         <p className="text-lg font-bold text-orange-100 italic">"{result.candidateResponse || 'Refleks tahmin edilemedi.'}"</p>
                      </div>
                   </div>
                   
                   <div className="mt-12 grid grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <h6 className="text-[11px] font-black text-emerald-500 uppercase">Klinik Doğrular</h6>
                         {(result.aiEvaluation?.clinicalTruths || []).map((t, i) => <p key={i} className="text-xs text-slate-400">✓ {t}</p>)}
                      </div>
                      <div className="space-y-4">
                         <h6 className="text-[11px] font-black text-rose-500 uppercase">Kritik Hatalar</h6>
                         {(result.aiEvaluation?.criticalMistakes || []).map((m, i) => <p key={i} className="text-xs text-slate-400">! {m}</p>)}
                      </div>
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
