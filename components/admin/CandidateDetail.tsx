
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import StatusBadge from './StatusBadge';
import { ReportCustomizationOptions } from '../CandidateReport';

const AnalysisPoint: React.FC<{ title: string; data: any; color: string }> = ({ title, data, color }) => (
  <div className="flex flex-col gap-3 py-5 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 px-4 -mx-4 rounded-xl transition-all">
    <div className="flex items-start justify-between">
      <div className="w-40 shrink-0">
        <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{title}</h5>
        <div className="flex items-center gap-2">
          <span className={`text-base font-black ${color}`}>%{data.score}</span>
          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden max-w-[40px]">
            <div className={`h-full ${color.replace('text', 'bg')} transition-all duration-700`} style={{ width: `${data.score}%` }}></div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-3">
          {data.comment}
        </p>
        <div className="flex flex-wrap gap-1">
          {data.keyPoints?.map((p: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[7px] font-bold text-slate-500 uppercase tracking-tight shadow-sm">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-2">
      <div className="p-3 bg-white/50 rounded-xl border border-slate-100 shadow-sm">
        <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Kısa Vadeli Etki</span>
        <p className="text-[9px] font-semibold text-slate-600">{data.shortTermImpact}</p>
      </div>
      <div className="p-3 bg-white/50 rounded-xl border border-slate-100 shadow-sm">
        <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Uzun Vadeli Projeksiyon</span>
        <p className="text-[9px] font-semibold text-slate-600">{data.longTermImplication}</p>
      </div>
    </div>
  </div>
);

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  // Rapor Özelleştirme State
  const [reportOptions, setReportOptions] = useState<ReportCustomizationOptions>({
    showPersonalDetails: true,
    showAcademicBackground: true,
    showAIAnalysis: true,
    showSWOT: true,
    showCompetencyMap: true,
    showInterviewNotes: true
  });

  const handleRunAnalysis = async () => {
    if (isAnalysing) return;
    setIsAnalysing(true);
    setErrorStatus(null);
    setSuccessStatus(null);
    
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      
      const updatedCandidate = { 
        ...candidate, 
        report: aiReport, 
        algoReport, 
        timestamp: Date.now() 
      };
      
      onUpdate(updatedCandidate);
      setSuccessStatus("Akademik analiz başarıyla mühürlendi.");
      setTimeout(() => setSuccessStatus(null), 3000);
    } catch (e: any) {
      setErrorStatus(`ANALİZ BAŞARISIZ: ${e.message}`);
    } finally {
      setIsAnalysing(false);
    }
  };

  const toggleOption = (key: keyof ReportCustomizationOptions) => {
    setReportOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center no-print">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={candidate.status} />
              <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">DOSYA NO: {candidate.id.toUpperCase().slice(0,8)}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{candidate.name}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing} 
            className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isAnalysing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-lg active:scale-95'}`}
          >
            {isAnalysing ? 'ANALİZ EDİLİYOR...' : 'YENİDEN ANALİZ ET'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#F8FAFC]">
        {/* Rapor Özelleştirme Paneli */}
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm no-print">
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            PDF RAPOR KONFİGÜRASYONU
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
             {[
               { key: 'showPersonalDetails', label: 'Kişisel Veri' },
               { key: 'showAcademicBackground', label: 'Akademik Geçmiş' },
               { key: 'showAIAnalysis', label: 'AI Analiz' },
               { key: 'showSWOT', label: 'SWOT Analizi' },
               { key: 'showCompetencyMap', label: 'Yetkinlik Haritası' },
               { key: 'showInterviewNotes', label: 'Mülakat Alanı' }
             ].map(opt => (
               <button
                 key={opt.key}
                 onClick={() => toggleOption(opt.key as any)}
                 className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-tight border-2 transition-all ${
                   reportOptions[opt.key as keyof ReportCustomizationOptions] 
                   ? 'bg-orange-600 border-orange-600 text-white shadow-md' 
                   : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                 }`}
               >
                 {opt.label}
               </button>
             ))}
          </div>
        </div>

        {candidate.report ? (
          <div className="space-y-6">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 flex items-center gap-6">
              <div className="flex-1">
                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> I. Yönetici Özeti
                </h4>
                <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-l-2 border-orange-100 pl-4 py-0.5">
                  "{candidate.report.summary}"
                </p>
              </div>
              <div className="w-24 h-24 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white shadow-xl shrink-0">
                <span className="text-[7px] font-black text-orange-500 uppercase mb-0.5">LİYAKAT</span>
                <span className="text-3xl font-black">%{candidate.report.score}</span>
              </div>
            </div>

            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 space-y-2">
              <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> II. Detaylı Analiz Metrikleri
              </h4>
              <AnalysisPoint title="Pedagoji" data={candidate.report.detailedAnalysis.pedagogy} color="text-orange-600" />
              <AnalysisPoint title="Etik Bütünlük" data={candidate.report.detailedAnalysis.ethics} color="text-emerald-600" />
              <AnalysisPoint title="Kriz Yönetimi" data={candidate.report.detailedAnalysis.stressResponse} color="text-rose-600" />
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[2rem] opacity-30">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Gelişmiş Analiz Verisi Bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
