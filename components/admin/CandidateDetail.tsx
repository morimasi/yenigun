
import React, { useState, useEffect } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import StatusBadge from './StatusBadge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const AnalysisPoint: React.FC<{ title: string; data: any; color: string }> = ({ title, data, color }) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 px-4 -mx-4 rounded-xl transition-all">
    <div className="w-36 shrink-0">
      <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{title}</h5>
      <div className="flex items-center gap-2">
        <span className={`text-base font-black ${color}`}>%{data.score}</span>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden max-w-[40px]">
          <div className={`h-full ${color.replace('text', 'bg')} transition-all duration-700`} style={{ width: `${data.score}%` }}></div>
        </div>
      </div>
    </div>
    <div className="flex-1">
      <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-2">
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
);

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

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
      setSuccessStatus("Akademik analiz mühürlendi.");
      setTimeout(() => setSuccessStatus(null), 3000);
    } catch (e: any) {
      console.error("Analiz Hatası:", e);
      setErrorStatus(`HATA: ${e.message}`);
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      {/* Dossier Header */}
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
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{candidate.branch} • {candidate.experienceYears} YIL DENEYİM</p>
          </div>
        </div>
        <button 
          onClick={handleRunAnalysis} 
          disabled={isAnalysing} 
          className={`px-5 py-3 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all ${isAnalysing ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-slate-900 text-white hover:bg-black shadow-lg active:scale-95'}`}
        >
          {isAnalysing ? 'ANALİZ EDİLİYOR...' : 'ANALİZİ GÜNCELLE'}
        </button>
      </div>

      {/* Report Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#F8FAFC]">
        {successStatus && (
          <div className="p-3 bg-emerald-600 text-white rounded-xl flex items-center gap-2 animate-slide-up font-black text-[8px] uppercase tracking-widest shadow-lg shadow-emerald-600/20">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
            {successStatus}
          </div>
        )}

        {errorStatus && (
          <div className="p-3 bg-rose-600 text-white rounded-xl flex items-center gap-2 animate-slide-up font-black text-[8px] uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {errorStatus}
          </div>
        )}

        {candidate.report ? (
          <div className="grid grid-cols-1 gap-6">
            {/* Executive Top Card */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 flex items-center gap-6">
              <div className="flex-1">
                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> I. Yönetici Analiz Özeti
                </h4>
                <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-l-2 border-orange-100 pl-4 py-0.5">
                  "{candidate.report.summary}"
                </p>
              </div>
              <div className="w-24 h-24 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white shadow-xl shrink-0">
                <span className="text-[7px] font-black text-orange-500 uppercase mb-0.5 tracking-tighter">LİYAKAT</span>
                <span className="text-3xl font-black">%{candidate.report.score}</span>
              </div>
            </div>

            {/* Competency Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 space-y-1">
                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> II. Teknik Kapasite
                </h4>
                <AnalysisPoint title="Metodolojik Pedagoji" data={candidate.report.detailedAnalysis.pedagogy} color="text-orange-600" />
                <AnalysisPoint title="Klinik Muhakeme" data={candidate.report.detailedAnalysis.clinicalWisdom} color="text-blue-600" />
                <AnalysisPoint title="Kriz & Stres Yanıtı" data={candidate.report.detailedAnalysis.stressResponse} color="text-rose-600" />
              </div>

              <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 space-y-1">
                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span> III. Karakteristik Profil
                </h4>
                <AnalysisPoint title="Etik Bütünlük" data={candidate.report.detailedAnalysis.ethics} color="text-emerald-600" />
                <AnalysisPoint title="Duygusal Dayanıklılık" data={candidate.report.detailedAnalysis.emotionalResilience} color="text-indigo-600" />
                <AnalysisPoint title="Kurumsal Aidiyet" data={candidate.report.detailedAnalysis.institutionalFit} color="text-slate-600" />
              </div>
            </div>

            {/* Radar & SWOT Combined */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 h-[280px]">
                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">IV. Yetkinlik Haritası</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={candidate.report.competencies}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 7, fontWeight: 900, fill: '#94a3b8' }} />
                    <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="xl:col-span-2 bg-slate-900 rounded-[1.5rem] p-8 text-white flex flex-col justify-center relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] mb-3">V. Nihai Kurul Karar Tavsiyesi</h4>
                    <p className="text-sm font-bold leading-relaxed italic opacity-90">
                      {candidate.report.recommendation}
                    </p>
                 </div>
                 <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-2xl transition-transform duration-1000"></div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
               <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span> VI. Yönetici Notları
               </h4>
               <textarea 
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-800 min-h-[100px] resize-none transition-all text-[11px]"
                placeholder="Örn: Veli iletişimi güçlü, ancak ABA verisi zayıf..."
                value={candidate.adminNotes || ''}
                onChange={e => onUpdate({...candidate, adminNotes: e.target.value})}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-4 border-dashed border-slate-50 opacity-40">
             <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
               <svg className="w-6 h-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px] mb-6">Analiz Verisi Bulunmuyor</p>
             <button onClick={handleRunAnalysis} className="px-8 py-4 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">ANALİZİ BAŞLAT</button>
          </div>
        )}
      </div>

      <div className="px-6 py-2 bg-white border-t border-slate-50 flex justify-between items-center text-[7px] font-black text-slate-300 uppercase tracking-widest no-print">
        <span>GİZLİDİR • AKADEMİK DOSYA</span>
        <button onClick={onDelete} className="text-rose-300 hover:text-rose-600 transition-colors">Kaydı Kalıcı Olarak Sil</button>
      </div>
    </div>
  );
};

export default CandidateDetail;
