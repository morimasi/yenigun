
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import StatusBadge from './StatusBadge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { exportService } from '../../services/exportService';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'interview'>('overview');

  const radarData = useMemo(() => {
    if (!candidate.algoReport) return [];
    const r = candidate.algoReport;
    return [
      { subject: 'Etik', value: r.ethicsScore },
      { subject: 'Klinik', value: r.clinicalScore },
      { subject: 'Pedagoji', value: r.pedagogyScore },
      { subject: 'Kriz', value: r.crisisManagementScore },
      { subject: 'Direnç', value: r.resilienceScore },
      { subject: 'Uyum', value: r.fitScore },
    ];
  }, [candidate.algoReport]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } finally { setIsAnalysing(false); }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-black">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={candidate.status} />
              <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">LİYAKAT SKORU: %{candidate.algoReport?.overallScore || '??'}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{candidate.name}</h2>
          </div>
        </div>
        <button onClick={handleRunAnalysis} disabled={isAnalysing} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
          {isAnalysing ? 'ANALİZ EDİLİYOR...' : 'ANALİZİ YENİLE'}
        </button>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-50 border-b border-slate-100 p-1">
        {['overview', 'radar', 'interview'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === t ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>
            {t === 'overview' ? 'Giriş' : t === 'radar' ? 'Klinik Parmak İzi' : 'Mülakat Rehberi'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {activeTab === 'radar' && (
          <div className="space-y-8 animate-fade-in">
            <div className="h-[400px] bg-slate-50 rounded-[3rem] border border-slate-100 p-8 relative overflow-hidden">
               <div className="absolute top-8 left-8">
                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Radar Liyakat Analizi</h4>
                 <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Yeni Gün Akademi Standartları</p>
               </div>
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                    <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {candidate.algoReport?.riskFlags.map((f, i) => (
                 <div key={i} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[9px] font-bold text-rose-700 leading-tight">
                    🚩 {f}
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
             <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">AI ÖZETİ</p>
                <p className="text-sm font-bold italic leading-relaxed">"{candidate.report?.summary || 'Henüz analiz yapılmadı.'}"</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white border border-slate-100 rounded-3xl">
                   <span className="text-[8px] font-black text-slate-400 uppercase block mb-2">Deneyim Katsayısı</span>
                   <p className="text-2xl font-black text-slate-900">%{candidate.algoReport?.experienceWeight || 0}</p>
                </div>
                <div className="p-6 bg-white border border-slate-100 rounded-3xl">
                   <span className="text-[8px] font-black text-slate-400 uppercase block mb-2">Güven Endeksi</span>
                   <p className="text-2xl font-black text-slate-900">%{candidate.algoReport?.reliabilityIndex || 0}</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-6 animate-fade-in">
            {candidate.report?.interviewGuidance.strategicQuestions.map((q, i) => (
              <div key={i} className="p-6 bg-orange-50 border border-orange-100 rounded-3xl">
                <p className="text-xs font-black text-orange-900 leading-tight">S{i+1}: {q}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
