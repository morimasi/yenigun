
import React, { useState } from 'react';
import { Candidate } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

const CandidateDetail: React.FC<{ candidate: Candidate, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);

    try {
      if (typeof window !== 'undefined') {
        const aiStudio = (window as any).aistudio;
        if (aiStudio?.hasSelectedApiKey) {
          const hasKey = await aiStudio.hasSelectedApiKey();
          if (!hasKey && !process.env.API_KEY) {
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
      
      // onUpdate çağrısı storageService.updateCandidate üzerinden DB'ye kaydı tetikler
      onUpdate(updated);
    } catch (e: any) {
      console.error("Analiz Hatası:", e);
      setErrorMessage(e.message || "Bilinmeyen bir hata oluştu.");
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in no-print">
           <div className="absolute top-8 right-8 flex gap-4">
              <button 
                onClick={() => window.print()} 
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 transition-all"
              >
                YAZDIRMAYI BAŞLAT
              </button>
              <button 
                onClick={() => setShowFullPreview(false)} 
                className="bg-orange-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl hover:bg-orange-700"
              >
                ×
              </button>
           </div>
           <div className="w-full h-full overflow-y-auto custom-scrollbar flex justify-center py-10">
              <div className="transform scale-90 md:scale-100 origin-top">
                <CandidateReport candidate={candidate} report={candidate.report} algoReport={candidate.algoReport} />
              </div>
           </div>
        </div>
      )}

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
          {candidate.report && (
            <button 
              onClick={() => setShowFullPreview(true)}
              className="px-8 py-5 rounded-[1.8rem] bg-white border-2 border-slate-200 font-black text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              TAM EKRAN ÖNİZLEME
            </button>
          )}
          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing}
            className={`px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${
              isAnalysing ? 'bg-slate-200 animate-pulse cursor-not-allowed text-slate-400' : 'bg-orange-600 text-white shadow-xl hover:-translate-y-1 active:scale-95'
            }`}
          >
            {isAnalysing ? 'İŞLENİYOR...' : (candidate.report ? 'ANALİZİ YENİLE' : 'STRATEJİK ANALİZ ÜRET')}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mx-10 mt-6 p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] flex items-start gap-5 animate-shake no-print">
          <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black shrink-0 text-xl">!</div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Teknik Aksaklık</p>
            <p className="text-sm font-bold text-rose-900">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
        {candidate.report || candidate.algoReport ? (
          <CandidateReport 
            candidate={candidate} 
            report={candidate.report} 
            algoReport={candidate.algoReport} 
          />
        ) : (
          <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center justify-center opacity-40">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-slate-300 font-black text-xs uppercase tracking-[0.4em]">Dijital Analiz Raporu Yok</p>
            <p className="text-slate-400 font-bold text-[10px] mt-4 uppercase max-w-xs mx-auto">Adayın liyakat skorlarını hesaplamak için yukarıdaki butona tıklayın.</p>
          </div>
        )}

        {/* Raw Data Section */}
        <section className="space-y-6 pt-12 border-t border-slate-50 mt-12 no-print">
           <div className="flex items-center gap-4 mb-8">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Aday Ham Veri Havuzu</h4>
              <div className="flex-1 h-px bg-slate-100"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(candidate.answers).map(([key, val]) => (
                <div key={key} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
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
