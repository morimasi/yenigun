
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { AIReport, AlgorithmicReport } from '../types';

interface CandidateReportProps {
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  name: string;
  viewMode?: 'ai' | 'algo' | 'hybrid';
}

const CandidateReport: React.FC<CandidateReportProps> = ({ report, algoReport, name, viewMode = 'hybrid' }) => {
  
  const showAI = (viewMode === 'ai' || viewMode === 'hybrid') && report;
  const showAlgo = (viewMode === 'algo' || viewMode === 'hybrid') && algoReport;

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      {/* Dual Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {showAI && (
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-orange-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-orange-600 text-white text-[8px] font-black rounded-full">AI ENGINE</span>
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Psikometrik Özet</h4>
            <p className="text-slate-800 font-bold text-lg leading-relaxed italic">"{report.summary}"</p>
            <div className="mt-8 flex items-center gap-6">
               <div className="text-4xl font-black text-orange-600">%{report.score}</div>
               <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Genel Uyguluk<br/>(Sezgisel)</div>
            </div>
          </div>
        )}

        {showAlgo && (
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-white/10 text-white text-[8px] font-black rounded-full">ALGO ENGINE</span>
            </div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Deterministik Matris</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Reliability</div>
                  <div className={`text-xl font-black ${algoReport.reliabilityIndex < 70 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    %{algoReport.reliabilityIndex}
                  </div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Ethics Score</div>
                  <div className="text-xl font-black text-blue-400">%{algoReport.ethicsScore}</div>
               </div>
            </div>
            <div className="mt-8 flex items-center gap-6">
               <div className="text-4xl font-black text-white">%{algoReport.overallScore}</div>
               <div className="text-[10px] font-black text-slate-500 uppercase leading-none">Matematiksel Skor<br/>(Veri Odaklı)</div>
            </div>
          </div>
        )}
      </div>

      {/* Algorithmic Pattern Analysis (Only shown in Algo or Hybrid) */}
      {showAlgo && (
        <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-200">
           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Algoritmik Örüntü Tespiti (Pattern Recognition)</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Tespit Edilen Karakteristikler</h5>
                 <div className="flex flex-wrap gap-2">
                    {algoReport.detectedPatterns.map(p => (
                      <span key={p} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm">{p}</span>
                    ))}
                    {algoReport.detectedPatterns.length === 0 && <span className="text-slate-400 italic text-xs">Belirgin bir örüntü saptanmadı.</span>}
                 </div>
              </div>
              <div className="space-y-4">
                 <h5 className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Algoritmik Risk Bayrakları (Red Flags)</h5>
                 <div className="space-y-2">
                    {algoReport.riskFlags.map(f => (
                      <div key={f} className="flex items-center gap-3 text-[11px] font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100">
                         <span className="w-1.5 h-1.5 bg-rose-600 rounded-full"></span>
                         {f}
                      </div>
                    ))}
                    {algoReport.riskFlags.length === 0 && <span className="text-emerald-600 font-bold text-xs">Sistem güvenli: Kritik risk saptanmadı.</span>}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Legacy AI Visuals (SWOT & Competencies) */}
      {showAI && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 h-96">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Yapay Zeka Yetkinlik Matrisi</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.competencies}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <Radar name="Aday" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
             <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">AI SWOT Analizi</h4>
                <div className="grid grid-cols-2 gap-4">
                   {['strengths', 'weaknesses'].map(key => (
                     <div key={key} className="space-y-3">
                        <h5 className="text-[9px] font-black uppercase text-slate-900 border-b pb-2">{key === 'strengths' ? 'GÜÇLÜ' : 'ZAYIF'}</h5>
                        {(report.swot as any)[key].slice(0, 3).map((s: string) => (
                          <div key={s} className="text-[11px] font-bold text-slate-600 flex items-start gap-2">
                             <span className="w-1 h-1 bg-orange-600 rounded-full mt-1.5"></span>
                             {s}
                          </div>
                        ))}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </>
      )}

      {!report && !algoReport && (
        <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-[4rem]">
           <p className="text-slate-200 font-black uppercase tracking-[0.3em]">Henüz Analiz Verisi Yok</p>
        </div>
      )}

    </div>
  );
};

export default CandidateReport;
