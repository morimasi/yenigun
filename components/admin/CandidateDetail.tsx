
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
      // 1. AI Studio API Key Seçici Kontrolü
      if (typeof window !== 'undefined') {
        const aiStudio = (window as any).aistudio;
        if (aiStudio?.hasSelectedApiKey) {
          const hasKey = await aiStudio.hasSelectedApiKey();
          // Eğer ortam değişkeni yoksa ve manuel anahtar seçilmemişse diyaloğu aç
          if (!hasKey && !process.env.API_KEY) {
            console.log("Ortam değişkeni bulunamadı, AI Studio Key seçici açılıyor...");
            await aiStudio.openSelectKey();
          }
        }
      }

      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate);
      
      const updated = { 
        ...candidate, 
        report: aiReport, 
        algoReport,
        updated_at: new Date().toISOString()
      };
      
      onUpdate(updated);
    } catch (e: any) {
      console.error("Analiz Sırasında Teknik Aksaklık:", e);
      
      let msg = e.message || "Bilinmeyen bir hata.";
      
      if (msg.includes("AUTH_MISSING") || msg.includes("API_KEY")) {
        msg = "DİKKAT: API Anahtarı (API_KEY) sisteme enjekte edilemedi. Eğer Vercel kullanıyorsanız, Environment Variables sekmesine 'API_KEY' ekleyip 'Redeploy' yapmanız gerekmektedir.";
      } else if (msg.includes("403")) {
        msg = "YETKİSİZ ERİŞİM: API anahtarınız geçerli ancak Gemini servisi bu anahtar için kapalı veya faturalandırma (Billing) hatası var.";
      }

      setErrorMessage(msg);
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center no-print">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {candidate.name.charAt(0)}
          </div>
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
            {isAnalysing ? 'MOTOR ÇALIŞIYOR...' : 'ANALİZİ ŞİMDİ TETİKLE'}
          </button>
        </div>
      </div>

      {/* Error Debug Banner */}
      {errorMessage && (
        <div className="mx-10 mt-6 p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] flex items-start gap-5 animate-shake relative overflow-hidden">
          <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black shrink-0 shadow-lg text-xl z-10">!</div>
          <div className="flex-1 z-10">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Bağlantı ve Kimlik Hatası</p>
            <p className="text-sm font-bold text-rose-900 leading-relaxed">{errorMessage}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
        {candidate.report || candidate.algoReport ? (
          <CandidateReport 
            candidate={candidate} 
            report={candidate.report} 
            algoReport={candidate.algoReport} 
          />
        ) : (
          <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center justify-center opacity-60">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-slate-300 font-black text-xs uppercase tracking-[0.4em]">Stratejik Rapor Hazırlanmadı</p>
            <p className="text-slate-400 font-bold text-[10px] mt-4 uppercase max-w-xs mx-auto">AI Analiz motoru, aday cevaplarını liyakat ve etik filtrelerinden geçirmek için komut bekliyor.</p>
          </div>
        )}

        {/* Yanıtlar */}
        <section className="space-y-6 pt-12 border-t border-slate-50 mt-12">
           <div className="flex items-center gap-4 mb-8">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Mülakat Ham Verileri</h4>
              <div className="flex-1 h-px bg-slate-100"></div>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {Object.entries(candidate.answers).map(([key, val]) => (
                <div key={key} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-all shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">{key}</p>
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
