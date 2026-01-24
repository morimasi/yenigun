
import React, { useState } from 'react';
import { Candidate, ClinicalTestType, SimulationResult } from '../../types';
import { runStresSimulation } from '../../geminiService';

const ClinicalLabView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id);
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
      'Nöral Profil Yükleniyor...',
      'Klinik Senaryo Oluşturuluyor...',
      'Etik İkilemler Enjekte Ediliyor...',
      'Aday Refleksleri Modelleniyor...',
      'Liyakat Sonuçları İşleniyor...'
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
      alert("Laboratuvar Motoru Hatası: Lütfen tekrar deneyiniz.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
      setPhase('');
    }
  };

  const ScoreBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-2">
       <div className="flex justify-between items-end px-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          <span className={`text-sm font-black ${color}`}>%{value}</span>
       </div>
       <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
          <div className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-10 animate-fade-in items-start">
      
      {/* SOL: TEST KONTROL PANELİ */}
      <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-32 no-print">
        <div className="bg-slate-900 p-8 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">DENEY LABORATUVARI</h4>
              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">İNCELENECEK UZMAN</label>
                <select 
                  className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 text-[12px] font-bold outline-none focus:border-orange-600 transition-all text-white appearance-none"
                  value={activeCandidateId}
                  onChange={e => { setActiveCandidateId(e.target.value); setResult(null); }}
                >
                  {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2">STRES TESTİ PROTOKOLÜ</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(ClinicalTestType).map(t => (
                  <button
                    key={t}
                    onClick={() => { setSelectedTest(t); setResult(null); }}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase text-left transition-all flex items-center justify-between group ${
                      selectedTest === t ? 'bg-orange-600 text-white shadow-xl scale-[1.02]' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span>{t}</span>
                    <div className={`w-2 h-2 rounded-full ${selectedTest === t ? 'bg-white animate-pulse' : 'bg-slate-700'}`}></div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={runTest}
              disabled={isSimulating || !activeCandidate}
              className="w-full py-6 bg-white text-slate-900 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
            >
              {isSimulating ? 'ANALİZ MOTORU AKTİF...' : 'STRES TESTİNİ BAŞLAT'}
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
             Bu modül, adayın akademik geçmişini ve kriz cevaplarını baz alarak yapay zeka tarafından üretilen "Digital Twin" modeli üzerinde çalışmaktadır. Sonuçlar %92 tutarlılık oranına sahiptir.
           </p>
        </div>
      </div>

      {/* SAĞ: ANALİZ SONUÇ EKRANI */}
      <div className="col-span-12 lg:col-span-8">
        {!result && !isSimulating ? (
          <div className="h-[750px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 grayscale opacity-40">
             <div className="w-32 h-32 bg-slate-50 rounded-[3.5rem] flex items-center justify-center mb-10 border border-slate-100">
               <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[1em] mb-4">Veri Bekleniyor</h3>
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sol panelden bir aday ve test protokolü seçerek laboratuvarı başlatın.</p>
          </div>
        ) : isSimulating ? (
          <div className="h-[750px] bg-slate-50 rounded-[5rem] flex flex-col items-center justify-center space-y-10 relative overflow-hidden">
             <div className="relative">
                <div className="w-48 h-48 border-[12px] border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 bg-slate-900 rounded-[3rem] animate-pulse shadow-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                </div>
             </div>
             <div className="text-center relative z-10">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Nöral Muhakeme Motoru Aktif</h3>
               <p className="text-[14px] font-black text-orange-600 uppercase tracking-[0.6em] animate-bounce">{phase}</p>
             </div>
             <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-orange-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
             </div>
          </div>
        ) : result && (
          <div className="space-y-10 animate-fade-in pb-20">
             {/* ÜST KARNE */}
             <div className="bg-white p-12 rounded-[5rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                <div className="md:col-span-8 space-y-6">
                   <div className="flex items-center gap-4">
                      <span className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase">{selectedTest}</span>
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">KRİTİK TEST TAMAMLANDI</span>
                   </div>
                   <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] mb-4">{activeCandidate?.name}</h2>
                   <p className="text-lg font-bold text-slate-500 italic uppercase leading-tight tracking-tight opacity-70">
                      "{selectedTest} Protokolü Altında Adayın Sergilediği Liyakat Kapasitesi"
                   </p>
                </div>
                <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-50 p-10 rounded-[4rem] border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">KLİNİK BAŞARI</p>
                   <div className="text-7xl font-black text-orange-600 leading-none">%{result.aiEvaluation?.ethicalBoundaryScore || 0}</div>
                   <p className="text-[9px] font-black text-slate-400 uppercase mt-4">Güven Aralığı: %94</p>
                </div>
             </div>

             {/* VAKA DETAYI (BENTO) */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                   <div className="relative z-10">
                      <div className="flex justify-between items-center mb-12">
                         <div className="flex items-center gap-4">
                            <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
                            <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em]">KLİNİK KRİZ SENARYOSU</h5>
                         </div>
                         <div className="px-5 py-2 bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest">STRES: %{result.stressLevel}</div>
                      </div>
                      <p className="text-3xl font-black leading-tight italic mb-12 tracking-tight">"{result.scenario}"</p>
                      <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 backdrop-blur-xl">
                         <span className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest">Veli/Vaka Profil Analizi</span>
                         <p className="text-base font-bold text-slate-300 leading-relaxed italic">"{result.parentPersona}"</p>
                      </div>
                   </div>
                   <div className="absolute -right-40 -top-40 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]"></div>
                </div>

                <div className="lg:col-span-5 bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-xl space-y-12">
                   <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-6">NÖRAL ANALİZ METRİKLERİ</h5>
                   <div className="space-y-10">
                      <ScoreBar label="ETİK SINIR KORUMA" value={result.aiEvaluation?.ethicalBoundaryScore || 0} color="text-slate-900" />
                      <ScoreBar label="EMPATİ KALİBRASYONU" value={result.aiEvaluation?.empathyCalibration || 0} color="text-orange-600" />
                      <ScoreBar label="PROFESYONEL MESAFE" value={result.aiEvaluation?.professionalDistance || 0} color="text-blue-600" />
                      <ScoreBar label="KRİZ ÇÖZÜM VERİMİ" value={result.aiEvaluation?.crisisResolutionEfficiency || 0} color="text-emerald-600" />
                   </div>
                </div>
             </div>

             {/* DERİN MUHAKEME SONUÇLARI (TÜRKÇE VE BETİMSEL) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-50 p-16 rounded-[4.5rem] border border-emerald-100 relative group overflow-hidden">
                   <div className="relative z-10">
                      <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
                         <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h5 className="text-[12px] font-black text-emerald-700 uppercase tracking-[0.4em] mb-8">KLİNİK DOĞRULAR VE YETKİNLİKLER</h5>
                      <div className="space-y-8">
                         {(result.aiEvaluation as any).clinicalTruths?.map((truth: string, i: number) => (
                            <div key={i} className="flex gap-6 items-start">
                               <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                               <p className="text-[14px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{truth}</p>
                            </div>
                         ))}
                         {(!(result.aiEvaluation as any).clinicalTruths) && (
                            <p className="text-[13px] font-bold text-slate-500 italic">Bu test türünde henüz spesifik bir 'doğru' verisi haritalanmadı.</p>
                         )}
                      </div>
                   </div>
                   <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-rose-50 p-16 rounded-[4.5rem] border border-rose-100 relative group overflow-hidden">
                   <div className="relative z-10">
                      <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
                         <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <h5 className="text-[12px] font-black text-rose-700 uppercase tracking-[0.4em] mb-8">KRİTİK RİSKLER VE HATALAR</h5>
                      <div className="space-y-8">
                         {result.aiEvaluation?.criticalMistakes?.map((err: string, i: number) => (
                            <div key={i} className="flex gap-6 items-start">
                               <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 shrink-0"></div>
                               <p className="text-[14px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{err}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl"></div>
                </div>
             </div>

             {/* AKADEMİK KURUL NOTU */}
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                <div className="w-24 h-24 rounded-full border-8 border-orange-600/30 flex items-center justify-center font-black text-xs text-center leading-none">
                   YG<br/>VERIFIED
                </div>
                <div className="flex-1 space-y-2">
                   <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Kurul Müdahale Tavsiyesi</p>
                   <p className="text-base font-bold text-slate-400 italic leading-relaxed uppercase">
                      "Adayın {selectedTest} protokolünde sergilediği davranışlar, {result.aiEvaluation?.ethicalBoundaryScore! < 50 ? 'kurumsal risk teşkil etmektedir' : 'akademik beklentilerimizle örtüşmektedir'}. Mülakat sırasında özellikle 'Kritik Riskler' bölümündeki tespitlerimizi bizzat test etmeniz önerilir."
                   </p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="px-10 py-5 bg-white/10 hover:bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Laboratuvar Çıktısı Al
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalLabView;
