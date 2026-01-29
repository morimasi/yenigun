
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, ArchiveCategory } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis, verifyCandidateIntegrity } from '../../analysisUtils';
import { exportService } from '../../services/exportService';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import { PredictBar } from '../../shared/ui/PredictBar';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip 
} from 'recharts';

interface CandidateDetailProps {
  candidate: Candidate;
  config: GlobalConfig;
  onUpdate: (c: Candidate) => void;
  onDelete: () => void;
  onClose?: () => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, config, onUpdate, onDelete, onClose }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'strategy' | 'profile'>('matrix');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const segments = useMemo(() => [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'technicalExpertise', label: 'KLİNİK' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' }
  ], []);

  useEffect(() => {
    if (candidate.report?.deepAnalysis && !selectedSegment) {
      setSelectedSegment('workEthics');
    }
  }, [candidate.report]);

  const radarData = useMemo(() => {
    if (!candidate.report?.deepAnalysis) return [];
    return segments.map(s => ({
      subject: s.label,
      value: candidate.report?.deepAnalysis?.[s.key]?.score || 0
    }));
  }, [candidate.report, segments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e) {
      alert("AI Analiz Hatası");
    } finally { setIsAnalysing(false); }
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* DENSE HEADER */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-white text-xl font-black shrink-0">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{candidate.name}</h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{candidate.branch}</span>
               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{candidate.experienceYears}Y DENEYİM</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* DRAWER TABS */}
      <div className="flex border-b border-slate-50 px-6 py-2 gap-6 bg-white sticky top-0 z-10">
        {[
          { id: 'matrix', label: 'MATRİS ANALİZİ' },
          { id: 'strategy', label: 'MÜLAKAT REHBERİ' },
          { id: 'profile', label: 'DETAYLI DOSYA' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)} 
            className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === t.id ? 'border-orange-600 text-slate-950' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8 bg-[#FAFAFA]">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin mb-6"></div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Dosya Analiz Bekliyor</p>
             <button onClick={handleRunAnalysis} className="mt-6 px-10 py-3 bg-slate-950 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">Analizi Başlat</button>
          </div>
        ) : (
          <>
            {activeTab === 'matrix' && (
              <div className="space-y-6 animate-fade-in">
                 {/* RADAR SNAPSHOT */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#f1f5f9" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} />
                          <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.1} strokeWidth={4} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>

                 {/* DENSE METRICS */}
                 <div className="grid grid-cols-2 gap-2">
                    {segments.map(s => (
                       <button 
                         key={s.key} 
                         onClick={() => setSelectedSegment(s.key)}
                         className={`p-3 rounded-xl border transition-all text-left flex justify-between items-center ${selectedSegment === s.key ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500'}`}
                       >
                          <span className="text-[9px] font-black uppercase tracking-tighter">{s.label}</span>
                          <span className="text-sm font-black">%{candidate.report?.deepAnalysis?.[s.key]?.score}</span>
                       </button>
                    ))}
                 </div>

                 {/* REASONING SLIVER */}
                 {currentData && (
                   <div className="bg-slate-900 p-6 rounded-2xl text-white animate-slide-up">
                      <div className="flex justify-between mb-4 border-b border-white/10 pb-2">
                         <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{selectedSegment} ANALİZİ</span>
                         <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">GÜVEN: %{candidate.report.integrityIndex}</span>
                      </div>
                      <p className="text-[13px] font-medium leading-relaxed italic opacity-90">"{currentData.reasoning}"</p>
                      <div className="mt-4 space-y-2">
                         {currentData.behavioralIndicators?.slice(0,2).map((ind, i) => (
                           <div key={i} className="flex gap-2 items-center text-[10px] font-bold text-slate-400">
                              <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                              <span className="uppercase">{ind}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-4 animate-fade-in">
                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-orange-600 pl-3">Soruşturma Protokolü</h4>
                 {(candidate.report?.interviewGuidance?.strategicQuestions || []).map((q, i) => (
                    <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-orange-200 transition-all">
                       <div className="flex gap-4">
                          <span className="text-[11px] font-black text-orange-600 w-4">{i+1}</span>
                          <p className="text-[13px] font-bold text-slate-700 leading-snug italic">"{q}"</p>
                       </div>
                    </div>
                 ))}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AKADEMİK GEÇMİŞ</h4>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Üniversite / Bölüm</p>
                          <p className="text-[13px] font-black text-slate-900 uppercase">{candidate.university} / {candidate.department}</p>
                       </div>
                       <div className="pt-4 border-t border-slate-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Akreditasyonlar</p>
                          <div className="flex flex-wrap gap-1.5">
                             {candidate.allTrainings.map((t, i) => (
                               <span key={i} className="px-2 py-1 bg-slate-50 text-[9px] font-black text-slate-500 rounded border border-slate-100 uppercase">{t}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MINI ACTION BAR */}
      <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-2">
         <button onClick={onDelete} className="py-3 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-rose-100">KAYDI SİL</button>
         <button onClick={() => exportService.exportSingleCandidatePDF(candidate, {
           showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'RESMİ DOSYA'
         })} className="py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all">PDF RAPOR AL</button>
      </div>
    </div>
  );
};

export default CandidateDetail;
