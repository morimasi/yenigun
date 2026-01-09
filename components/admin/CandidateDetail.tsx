
import React, { useState } from 'react';
import { Candidate } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

// Aday detaylarını gösteren ve AI analizini tetikleyen ana detay bileşeni
const CandidateDetail: React.FC<{ candidate: Candidate, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);

    try {
      // 1. Safe AI Studio Key Check
      // window.aistudio objesinin varlığını kontrol ederek güvenli erişim sağlıyoruz.
      if (typeof window !== 'undefined') {
        const aiStudio = (window as any).aistudio;
        if (aiStudio && typeof aiStudio.hasSelectedApiKey === 'function') {
          try {
            const hasKey = await aiStudio.hasSelectedApiKey();
            if (!hasKey && !process.env.API_KEY) {
              await aiStudio.openSelectKey();
            }
          } catch (authErr) {
            console.debug("AI Studio sandbox check skipped - not in Studio environment.");
          }
        }
      }

      // 2. Local Algorithmic Audit
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      
      // 3. Remote AI Analysis (Gemini)
      const aiReport = await generateCandidateAnalysis(candidate);
      
      const updated = { 
        ...candidate, 
        report: aiReport, 
        algoReport,
        updated_at: new Date().toISOString()
      };
      
      onUpdate(updated);
    } catch (e: any) {
      console.error("Akademi Motor Hata Raporu:", e);
      let msg = e.message || "Bilinmeyen bir motor hatası oluştu.";
      
      if (msg.includes("ANALİZ_DURDU") || msg.includes("AUTH_MISSING")) {
        msg = "KRİTİK: Gemini API Anahtarı bulunamadı. Vercel ortam değişkenlerinde 'API_KEY' tanımlı olmalıdır.";
      } else if (msg.includes("DATABASE_ERROR") || msg.includes("sql")) {
        msg = "VERİTABANI KRİZİ: Neon Postgres bağlantısında sorun var. Lütfen 'POSTGRES_URL' anahtarını kontrol edin.";
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
              isAnalysing ? 'bg-slate-200 animate-pulse cursor-not-allowed' : 'bg-orange-600 text-white shadow-xl hover:-translate-y-1'
            }`}
          >
            {isAnalysing ? 'AI MOTORU ANALİZ EDİYOR...' : 'ANALİZİ ŞİMDİ TETİKLE'}
          </button>
        </div>
      </div>

      {/* Error Debug Banner */}
      {errorMessage && (
        <div className="mx-10 mt-6 p-6 bg-rose-50 border-2 border-rose-100 rounded-2xl">
          <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-1">Analiz Hatası</p>
          <p className="text-rose-800 text-xs font-bold leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
        {candidate.report || candidate.algoReport ? (
          <CandidateReport 
            candidate={candidate} 
            report={candidate.report} 
            algoReport={candidate.algoReport} 
          />
        ) : (
          <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-[3rem]">
            <p className="text-slate-300 font-black text-xs uppercase tracking-[0.4em]">Henüz Analiz Yapılmadı</p>
            <p className="text-slate-400 text-[10px] font-bold mt-4 uppercase">AI Motorunu tetikleyerek liyakat raporu oluşturabilirsiniz.</p>
          </div>
        )}

        {/* Raw Data Section */}
        <section className="space-y-6 pt-12 border-t border-slate-50">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Aday Yanıtları & Detaylar</h4>
           <div className="grid grid-cols-1 gap-4">
              {Object.entries(candidate.answers).map(([key, val]) => (
                <div key={key} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">{key}</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{Array.isArray(val) ? val.join(', ') : val}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CV Download / View */}
        {candidate.cvData && (
          <section className="pt-12 border-t border-slate-50">
            <a 
              href={`data:${candidate.cvData.mimeType};base64,${candidate.cvData.base64}`} 
              download={candidate.cvData.fileName}
              className="flex items-center justify-between p-8 bg-slate-900 text-white rounded-[2.5rem] hover:bg-orange-600 transition-all shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Doküman Mevcut</p>
                  <p className="text-sm font-black tracking-tight">{candidate.cvData.fileName}</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full">İndir</span>
            </a>
          </section>
        )}

        {/* Delete Action */}
        <div className="pt-20 pb-10 flex justify-center">
          <button 
            onClick={onDelete}
            className="text-[10px] font-black text-rose-400 hover:text-rose-600 uppercase tracking-[0.4em] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Kaydı Kalıcı Olarak Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
