
import React, { useState } from 'react';
import { Candidate, SimulationResult } from '../../types';
import { GoogleGenAI, Type } from "@google/genai";

interface SimulationEngineProps {
  candidates: Candidate[];
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationResult | null>(null);

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    const candidate = candidates.find(c => c.id === activeCandidateId);
    if (!candidate) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const systemInstruction = `
        ROL: Gelişmiş Klinik Kriz Simülatörü.
        MODEL: Gemini-3-Flash (Deep Reasoning Mode).
        BÜTÇE: 24,576 Thinking Tokens.
        
        GÖREV: Adayın zayıf etik sınırlarını veya pedagojik açıklarını test edecek "kişiye özel" bir stres senaryosu tasarla.
        
        DÜŞÜNME SÜRECİ: Önce adayın tüm cevaplarını oku. Nerede açık vermiş? Hangi durumda "profesyonel mesafesini" kaybedebilir? Veli personasını adayın en çok zorlanacağı karakter yapısına büründür.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Adayın profesyonel sınırlarını zorlayacak, yüksek stresli bir klinik kriz senaryosu kurgula ve simüle et.",
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 24576 },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenario: { type: Type.STRING },
              parentPersona: { type: Type.STRING },
              stressLevel: { type: Type.NUMBER },
              candidateResponse: { type: Type.STRING },
              aiEvaluation: {
                type: Type.OBJECT,
                properties: {
                  ethicalBoundaryScore: { type: Type.NUMBER },
                  empathyCalibration: { type: Type.NUMBER },
                  professionalDistance: { type: Type.NUMBER },
                  crisisResolutionEfficiency: { type: Type.NUMBER },
                  criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      });

      setSimulationData(JSON.parse(response.text || "{}"));
    } catch (e) {
      alert("Simülasyon Hatası: Derin düşünme motoru geçici olarak yanıt vermiyor.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-100 pb-8">
         <div className="flex gap-4">
            {candidates.map(c => (
              <button 
                key={c.id} 
                onClick={() => { setActiveCandidateId(c.id); setSimulationData(null); }}
                className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCandidateId === c.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {c.name}
              </button>
            ))}
         </div>
         <button 
           onClick={handleStartSimulation} 
           disabled={isSimulating}
           className="group relative px-10 py-4 overflow-hidden bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-orange-600/30 transition-all disabled:opacity-50"
         >
           <span className="relative z-10 flex items-center gap-3">
             <svg className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             {isSimulating ? 'DERİN MUHAKEME...' : 'KLİNİK STRES TESTİ'}
           </span>
           <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         </button>
      </div>

      {!simulationData && !isSimulating ? (
        <div className="py-40 text-center relative overflow-hidden rounded-[4rem] bg-slate-50/50 border-2 border-dashed border-slate-100">
           <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.8em]">Flash-3 Nöral Simülasyon</p>
           <p className="max-w-md mx-auto mt-6 text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-widest">
             Adayın dijital kopyası üzerinde yapılan derin muhakeme testleri ile klinik sınır ihlali olasılıkları hesaplanır.
           </p>
        </div>
      ) : isSimulating ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-10">
           <div className="relative">
              <div className="w-24 h-24 border-t-4 border-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl animate-pulse"></div>
              </div>
           </div>
           <div className="text-center space-y-4">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Flash-3 Muhakeme Ediyor</h3>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">Derin Karar Ağaçları Analiz Ediliyor</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                       <span className="w-3 h-3 bg-orange-600 rounded-full animate-ping"></span>
                       <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">KLİNİK VAKA SENARYOSU (DEEP REASONING)</h5>
                    </div>
                    <p className="text-2xl font-black leading-tight italic mb-12 tracking-tight group-hover:text-orange-50 transition-colors">"{simulationData.scenario}"</p>
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                       <span className="text-[9px] font-black text-slate-400 uppercase block mb-3 tracking-widest">Parent / Clinical Boundary Analysis</span>
                       <p className="text-sm font-bold text-slate-200 leading-relaxed">{simulationData.parentPersona}</p>
                    </div>
                 </div>
                 <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
              </div>

              <div className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-xl relative group">
                 <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-10 border-l-4 border-orange-600 pl-4">ÖNGÖRÜLEN ADAY REFLEKSİ</h5>
                 <p className="text-base font-bold text-slate-600 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                    "{simulationData.candidateResponse}"
                 </p>
              </div>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-50 p-12 rounded-[4.5rem] border border-slate-100 shadow-inner">
                 <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-12">REASONING METRİKLERİ</h5>
                 <div className="space-y-10">
                    {[
                      { l: 'ETİK SINIR KORUMA', v: simulationData.aiEvaluation.ethicalBoundaryScore, c: 'bg-slate-900' },
                      { l: 'EMPATİ KALİBRASYONU', v: simulationData.aiEvaluation.empathyCalibration, c: 'bg-orange-600' },
                      { l: 'PROFESYONEL MESAFE', v: simulationData.aiEvaluation.professionalDistance, c: 'bg-sky-600' },
                      { l: 'KRİZ ÇÖZÜM HIZI', v: simulationData.aiEvaluation.crisisResolutionEfficiency, c: 'bg-emerald-600' }
                    ].map((m, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                           <span>{m.l}</span>
                           <span className="text-slate-900">%{m.v}</span>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                           <div className={`h-full ${m.c} rounded-full transition-all duration-1000`} style={{ width: `${m.v}%` }}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-rose-600 p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden">
                 <h5 className="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-8">KRİTİK HATA SİNYALLERİ</h5>
                 <div className="space-y-6 relative z-10">
                    {simulationData.aiEvaluation.criticalMistakes.map((err, i) => (
                      <div key={i} className="flex gap-5 items-start">
                         <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0">!</div>
                         <p className="text-[11px] font-black uppercase tracking-widest leading-tight opacity-90">{err}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SimulationEngine;
