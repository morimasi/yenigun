
import React, { useState } from 'react';
import { Candidate } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

const CandidateDetail: React.FC<{ candidate: Candidate, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);

    try {
      // 1. AI Studio Key Check (Sadece sandbox ortamındaysa)
      if (typeof window !== 'undefined') {
        const aiStudio = (window as any).aistudio;
        if (aiStudio?.hasSelectedApiKey) {
          try {
            const hasKey = await aiStudio.hasSelectedApiKey();
            if (!hasKey && !process.env.API_KEY) {
              await aiStudio.openSelectKey();
            }
          } catch (e) {
            console.debug("AI Studio context not available.");
          }
        }
      }

      // 2. Algoritmik Denetim
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      
      // 3. AI Analiz
      const aiReport = await generateCandidateAnalysis(candidate);
      
      const updated = { 
        ...candidate, 
        report: aiReport, 
        algoReport,
        updated_at: new Date().toISOString()
      };
      
      onUpdate(updated);
    } catch (e: any) {
      console.error("Motor Hatası Yakalandı:", e);
      
      // Dinamik Hata Mesajı
      let friendlyMessage = e.message || "Bilinmeyen bir teknik hata oluştu.";
      
      if (friendlyMessage.includes("AUTH_MISSING") || friendlyMessage.includes("API_KEY")) {
        friendlyMessage = "KRİTİK: API Anahtarı eksik. Vercel Panel -> Settings -> Environment Variables kısmına 'API_KEY' eklediğinizden ve Deploy ettiğinizden emin olun.";
      } else if (friendlyMessage.includes("403")) {
        friendlyMessage = "YETKİ HATASI (403): API anahtarınız geçerli ancak Gemini API servisi bu anahtar için etkinleştirilmemiş veya kısıtlanmış.";
      } else if (friendlyMessage.includes("429")) {
        friendlyMessage = "KOTA HATASI (429): Çok fazla istek gönderildi veya API kotanız doldu.";
      }

      setErrorMessage(friendlyMessage);
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center no-print">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black">{candidate.name.charAt(0)}</div>
          <div>
            <StatusBadge status={candidate.status} />
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">{candidate.name}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing}
            className={`px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${
              isAnalysing ? 'bg-slate-200 animate-pulse cursor-not-allowed' : 'bg-orange-600 text-white shadow-xl hover:-translate-y-1 active:scale-95'
            }`}
          >
            {isAnalysing ? 'AI ANALİZ MOTORU ÇALIŞIYOR...' : 'ANALİZİ ŞİMDİ TETİKLE'}
          </button>
        </div>
      </div>

      {/* Error Debug Banner */}
      {errorMessage && (
        <div className="mx-10 mt-6 p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-start gap-4 animate-shake">
          <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black shrink-0 shadow-lg">!</div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Sistem Mesajı / Teknik Arıza</p>
            <p className="text-xs font-bold text-rose-900 leading-relaxed">{errorMessage}</p>
            <p className="text-[9px] text-rose-400 mt-2 font-medium">İpucu: Eğer anahtarı yeni eklediyseniz, Vercel üzerinde mülakatçı panelini yenilemeden önce yeni bir 'Deployment' yapmanız gerekebilir.</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-white">
        {candidate.report || candidate.algoReport ? (
          <CandidateReport 
            candidate={candidate} 
            report={candidate.report} 
            algoReport={candidate.algoReport} 
          />
        ) : (
          <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-slate-300 font-black text-xs uppercase tracking-[0.4em]">Dijital Liyakat Raporu Bekleniyor</p>
            <p className="text-slate-400 text-[10px] font-bold mt-4 uppercase max-w-xs leading-relaxed">Analiz motoru, adayın senaryolara verdiği yanıtları branş bazlı etik ve teknik filtrelere sokar.</p>
          </div>
        )}

        {/* Yanıtlar Bölümü */}
        <section className="space-y-6 pt-12 border-t border-slate-50">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-3">
             <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
             Ham Veri Girişleri
           </h4>
           <div className="grid grid-cols-1 gap-4">
              {Object.entries(candidate.answers).map(([key, val]) => (
                <div key={key} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">{key}</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{Array.isArray(val) ? val.join(', ') : val}"</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default CandidateDetail;
