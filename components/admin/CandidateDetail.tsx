
import React, { useState } from 'react';
import { Candidate } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

const CandidateDetail: React.FC<{ candidate: Candidate, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'info' | 'admin'>('analysis');

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);

    try {
      // 1. Yetki Kontrolü - Safe Check (Kritik Hata Düzeltmesi)
      const aiStudio = (window as any).aistudio;
      
      // Eğer window.aistudio varsa ve anahtar seçilmemişse diyaloğu aç
      if (aiStudio && typeof aiStudio.hasSelectedApiKey === 'function') {
        const hasKey = await aiStudio.hasSelectedApiKey();
        if (!hasKey && !process.env.API_KEY) {
          await aiStudio.openSelectKey();
          // Seçim başarılı varsayılıp devam edilir (Race condition önlemi)
          localStorage.setItem('AISTUDIO_LAST_KEY', 'selected');
        }
      }

      // 2. Analiz Akışı
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
      console.error("Akademi Motor Hatası:", e);
      let msg = e.message || "Bilinmeyen bir hata oluştu.";
      
      // Hata mesajını kullanıcı dostu hale getir
      if (msg.includes("AUTH_MISSING") || msg.includes("403")) {
        msg = "API Anahtarı bulunamadı veya yetkisiz. Lütfen sistem yöneticisinin Vercel/Environment ayarlarına API_KEY eklediğinden emin olun.";
      } else if (msg.includes("fetch")) {
        msg = "Ağ bağlantı hatası veya veritabanı senkronizasyon sorunu.";
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
            className={`px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${isAnalysing ? 'bg-slate-200 animate-pulse' : 'bg-orange-600 text-white shadow-xl hover:-translate-y-1'}`}
          >
            {isAnalysing ? 'MOTOR BAŞLATILIYOR...' : 'ANALİZİ TETİKLE'}
          </button>
        </div>
      </div>

      {/* Error Debug Banner */}
      {errorMessage && (
        <div className="mx-10 mt-6 p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center gap-4 animate-shake">
          <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">!</div>
          <div className="flex-1">
             <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Akademi Motor / Teknik Arıza</p>
             <p className="text-sm font-bold text-rose-900 mt-1 leading-snug">{errorMessage}</p>
          </div>
          {(window as any).aistudio && (
            <button 
              onClick={() => (window as any).aistudio.openSelectKey()}
              className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase border border-slate-200 shadow-sm"
            >
              ANAHTAR YENİLE
            </button>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
        {(candidate.report || candidate.algoReport) ? (
          <CandidateReport report={candidate.report} algoReport={candidate.algoReport} candidate={candidate} />
        ) : (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">Yapay Zeka Analizi Bekleniyor</p>
            <p className="text-slate-400 text-[10px] mt-4 max-w-xs font-medium uppercase tracking-widest">Adayın veritabanı kayıtları mevcut. Analizi başlatmak için yukarıdaki butonu kullanın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
