
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, IntelligenceSegment } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import StatusBadge from './StatusBadge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'radar' | 'anomalies' | 'interview'>('intelligence');

  const radarData = useMemo(() => {
    if (!candidate.report?.deepAnalysis) return [];
    const d = candidate.report.deepAnalysis;
    return [
      { subject: 'Etik', value: d.workEthics.score },
      { subject: 'Klinik', value: d.technicalExpertise.score },
      { subject: 'Pedagoji', value: d.pedagogicalAnalysis.score },
      { subject: 'Sürdürülebilirlik', value: d.sustainability.score },
      { subject: 'Resmiyet', value: d.formality.score },
      { subject: 'Gelişim', value: d.developmentOpenness.score },
    ];
  }, [candidate.report]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e) {
      alert("Analiz sırasında hata oluştu. Lütfen API anahtarını kontrol edin.");
    } finally { setIsAnalysing(false); }
  };

  const AnalysisCard = ({ title, segment }: { title: string, segment: IntelligenceSegment }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 hover:shadow-lg transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 px-4 py-1 text-[7px] font-black uppercase tracking-widest ${segment.status === 'optimal' ? 'bg-emerald-500 text-white' : segment.status === 'warning' ? 'bg-orange-500 text-white' : 'bg-rose-500 text-white'}`}>
        {segment.competencyLevel}
      </div>
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h5>
        <span className="text-xl font-black text-slate-900">%{segment.score}</span>
      </div>
      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${segment.score > 70 ? 'bg-emerald-500' : segment.score > 40 ? 'bg-orange-500' : 'bg-rose-500'}`} style={{ width: `${segment.score}%` }}></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
         <div className="p-3 bg-emerald-50 rounded-2xl">
            <span className="text-[7px] font-black text-emerald-700 uppercase block mb-1">Pozitif</span>
            <p className="text-[8px] font-bold text-slate-600 leading-tight">{segment.pros[0]}</p>
         </div>
         <div className="p-3 bg-rose-50 rounded-2xl">
            <span className="text-[7px] font-black text-rose-700 uppercase block mb-1">Risk</span>
            <p className="text-[8px] font-bold text-slate-600 leading-tight">{segment.risks[0]}</p>
         </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="p-8 border-b border-slate-50 bg-white/50 backdrop-blur-md flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-xl">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={candidate.status} />
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">
                <span className={`w-1.5 h-1.5 rounded-full ${candidate.report ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                {candidate.report ? 'Analiz Hazır' : 'Analiz Bekliyor'}
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRunAnalysis} disabled={isAnalysing} className="px-8 py-5 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-50">
            {isAnalysing ? 'SİNYAL İŞLENİYOR...' : 'DERİN ANALİZİ TETİKLE'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-50/50 p-2 gap-2 border-b border-slate-50">
        {[
          { id: 'intelligence', label: '10 Boyutlu Matris' },
          { id: 'radar', label: 'Klinik Parmak İzi' },
          { id: 'anomalies', label: 'Semantik Çelişkiler' },
          { id: 'interview', label: 'Stratejik Rehber' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all rounded-2xl ${activeTab === t.id ? 'bg-white shadow-xl text-orange-600 scale-105' : 'text-slate-400 hover:bg-white/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#FDFDFD]">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-40">
             <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
             </div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">Analiz Motoru Onayınızı Bekliyor</p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-12 pb-10">
            {activeTab === 'intelligence' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <AnalysisCard title="Kişilik & Mizaç" segment={candidate.report.deepAnalysis.personality} />
                 <AnalysisCard title="Resmiyet & Kurum" segment={candidate.report.deepAnalysis.formality} />
                 <AnalysisCard title="Veli İlişkileri" segment={candidate.report.deepAnalysis.parentStudentRelations} />
                 <AnalysisCard title="Burnout Direnci" segment={candidate.report.deepAnalysis.sustainability} />
                 <AnalysisCard title="Eleştiriye Açıklık" segment={candidate.report.deepAnalysis.criticismTolerance} />
                 <AnalysisCard title="İş Ahlakı" segment={candidate.report.deepAnalysis.workEthics} />
                 <AnalysisCard title="Alan Yeterliliği" segment={candidate.report.deepAnalysis.technicalExpertise} />
                 <AnalysisCard title="Pedagojik Analiz" segment={candidate.report.deepAnalysis.pedagogicalAnalysis} />
                 <AnalysisCard title="Kurumsal Sadakat" segment={candidate.report.deepAnalysis.institutionalLoyalty} />
              </div>
            )}

            {activeTab === 'radar' && (
              <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl h-[500px] relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontBold: 900, fill: '#94a3b8' }} />
                      <Radar name={candidate.name} dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} />
                      <Tooltip />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'anomalies' && (
              <div className="space-y-8">
                <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white relative overflow-hidden">
                   <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">Dürüstlük ve Semantik Kontrol</h4>
                   <div className="grid grid-cols-2 gap-10">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Integrity Index</span>
                        <p className="text-5xl font-black text-white">%{candidate.report.integrityIndex}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Social Masking</span>
                        <p className="text-5xl font-black text-white">%{candidate.report.socialMaskingScore}</p>
                      </div>
                   </div>
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {candidate.report.interviewGuidance.answerAnomalies.map((anomaly, i) => (
                     <div key={i} className="p-8 bg-rose-50 border-l-8 border-rose-500 rounded-[2rem] flex items-start gap-6">
                        <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center font-black shrink-0 shadow-lg shadow-rose-500/20">!</div>
                        <div>
                          <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">Tespit Edilen Çelişki</p>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"{anomaly}"</p>
                        </div>
                     </div>
                   ))}
                   {candidate.report.interviewGuidance.answerAnomalies.length === 0 && (
                     <div className="p-10 text-center border-4 border-dashed border-slate-100 rounded-[3rem] opacity-40">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Belirgin Bir Semantik Çelişki Saptanmadı</p>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'interview' && (
              <div className="space-y-8">
                 <div className="bg-orange-600 p-10 rounded-[3.5rem] text-white shadow-2xl">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-8">Mülakat Sıkıştırma Soruları (AI Önerisi)</h4>
                    <div className="space-y-4">
                       {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                         <div key={i} className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm group hover:bg-white/20 transition-all cursor-help">
                            <p className="text-[13px] font-black leading-tight italic">"{q}"</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Mülakat Simülasyon Görevleri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {candidate.report.interviewGuidance.simulationTasks.map((task, i) => (
                         <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold text-slate-600 text-[11px] leading-relaxed">
                            <span className="text-orange-600 mr-2">#{i+1}</span> {task}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
