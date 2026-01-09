
import React from 'react';
import { AIReport, Candidate } from './types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
}

const AnalysisBox: React.FC<{ title: string; data: any }> = ({ title, data }) => (
  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] hover:shadow-lg transition-all">
     <div className="flex justify-between items-start mb-4">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h5>
        <span className={`text-lg font-black ${data.score > 75 ? 'text-emerald-600' : data.score > 45 ? 'text-orange-600' : 'text-rose-600'}`}>
          %{data.score}
        </span>
     </div>
     <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-4">{data.comment}</p>
     <div className="flex flex-wrap gap-2">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black text-slate-500 uppercase">
            {p}
          </span>
        ))}
     </div>
  </div>
);

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate }) => {
  if (!report) return null;

  return (
    <div id="strategic-report" className="space-y-12 animate-fade-in p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b-4 border-slate-900 pb-10 gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
            AKADEMİK LİYAKAT RAPORU v12.0
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name}</h1>
          <p className="text-orange-600 font-bold text-sm uppercase tracking-widest">{candidate.branch}</p>
        </div>
        <div className="text-right">
           <div className="bg-orange-600 text-white p-8 rounded-[2.5rem] shadow-2xl inline-block">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Genel Skor</p>
              <p className="text-6xl font-black">%{report.score}</p>
           </div>
        </div>
      </div>

      {/* Summary Box */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
         <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-6">Kurumsal Değerlendirme Özeti</h3>
         <p className="text-xl font-bold leading-relaxed italic relative z-10">"{report.summary}"</p>
         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </section>

      {/* Charts & Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="h-[400px] bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner">
           <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.competencies}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                <Radar name="Aday" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.6} />
              </RadarChart>
           </ResponsiveContainer>
        </div>
        <div className="space-y-8">
           <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Stratejik Karar Tavsiyesi</h4>
           <p className="text-base font-bold text-slate-600 leading-relaxed italic">
             {report.recommendation}
           </p>
           <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                 <h5 className="text-[9px] font-black text-emerald-800 uppercase mb-3">Güçlü Yönler</h5>
                 <ul className="space-y-2">
                    {report.swot.strengths.slice(0,3).map((s,i) => (
                      <li key={i} className="text-[10px] font-bold text-emerald-700 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {s}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                 <h5 className="text-[9px] font-black text-rose-800 uppercase mb-3">Riskler</h5>
                 <ul className="space-y-2">
                    {report.swot.threats.slice(0,3).map((t,i) => (
                      <li key={i} className="text-[10px] font-bold text-rose-700 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {t}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </div>

      {/* Detailed Analysis Grid */}
      <section className="space-y-8">
         <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Derinlemesine Vaka ve Karakter Analizi</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnalysisBox title="Etik Değerler" data={report.detailedAnalysis.ethics} />
            <AnalysisBox title="Pedagojik Derinlik" data={report.detailedAnalysis.pedagogy} />
            <AnalysisBox title="Klinik Bilgelik" data={report.detailedAnalysis.clinicalWisdom} />
            <AnalysisBox title="Duygusal Dayanıklılık" data={report.detailedAnalysis.emotionalResilience} />
            <AnalysisBox title="Kurumsal İşleyiş" data={report.detailedAnalysis.institutionalFit} />
            <AnalysisBox title="Stres Yönetimi" data={report.detailedAnalysis.stressResponse} />
         </div>
      </section>

      {/* Footer / Seal */}
      <div className="mt-20 pt-10 border-t-2 border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
         <div>DOĞRULAMA: {candidate.id.toUpperCase()}</div>
         <div className="text-right">YENİ GÜN AKADEMİ DİJİTAL MÜHÜR</div>
      </div>
    </div>
  );
};

export default CandidateReport;
