
import React from 'react';
import { AIReport, Candidate } from './types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
}

const AnalysisBox: React.FC<{ title: string; data: any }> = ({ title, data }) => (
  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:shadow-xl hover:bg-white transition-all duration-500 group overflow-hidden relative">
     <div className="flex justify-between items-start mb-4">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h5>
        <span className={`text-lg font-black ${data.score > 75 ? 'text-emerald-600' : data.score > 45 ? 'text-orange-600' : 'text-rose-600'}`}>
          %{data.score}
        </span>
     </div>
     <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-4">{data.comment}</p>
     <div className="flex flex-wrap gap-2">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[8px] font-black text-slate-500 uppercase">
            {p}
          </span>
        ))}
     </div>
     <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-600/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate }) => {
  if (!report) return null;

  return (
    <div id="strategic-report" className="space-y-16 animate-fade-in p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b-[6px] border-slate-900 pb-12 gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3">
            <span className="bg-orange-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20">AKADEMİ</span>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">STRATEJİK LİYAKAT DENETİMİ v13.0</span>
          </div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">{candidate.name}</h1>
          <div className="flex items-center gap-4">
            <span className="text-orange-600 font-black text-sm uppercase tracking-widest border-l-4 border-orange-600 pl-4">{candidate.branch}</span>
            <span className="text-slate-300 font-bold text-xs">ID: {candidate.id.toUpperCase()}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
           <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl inline-block relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2">Liyakat Katsayısı</p>
                <p className="text-7xl font-black">%{report.score}</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700"></div>
           </div>
        </div>
      </div>

      {/* Summary Box */}
      <section className="bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.6em] mb-8">Üst Kurul Değerlendirme Özeti</h3>
            <p className="text-2xl font-bold leading-snug italic tracking-tight opacity-95">"{report.summary}"</p>
         </div>
         <div className="absolute bottom-0 right-0 p-12 opacity-5 pointer-events-none">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703V14H12.017C14.2262 14 16.017 12.2091 16.017 10V7C16.017 5.89543 15.1216 5 14.017 5H10.017C8.91246 5 8.01703 5.89543 8.01703 7V10C8.01703 11.1046 8.91246 12 10.017 12H13.017V14H10.017C7.80789 14 6.01703 15.7909 6.01703 18V21H14.017Z" /></svg>
         </div>
      </section>

      {/* 8-Dimensional Chart & Karar Mekanizması */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
        <div className="bg-white rounded-[4rem] p-12 border-2 border-slate-50 shadow-inner relative group">
           <div className="absolute top-8 left-8">
              <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em] mb-1">Yetkinlik Matrisi</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase">8-Boyutlu Klinik Haritalama</p>
           </div>
           <div className="h-[480px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.competencies}>
                  <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: '#1e293b', fontSize: 9, fontWeight: 900, textAnchor: 'middle' }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Aday" 
                    dataKey="value" 
                    stroke="#ea580c" 
                    strokeWidth={4}
                    fill="#ea580c" 
                    fillOpacity={0.45} 
                    dot={{ r: 5, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#1e293b' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>
        
        <div className="space-y-10">
           <div className="space-y-4">
              <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-6">Stratejik Karar Tavsiyesi</h4>
              <p className="text-lg font-bold text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-6">
                {report.recommendation}
              </p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 hover:shadow-lg transition-all">
                 <h5 className="text-[10px] font-black text-emerald-800 uppercase mb-5 tracking-widest">Kritik Avantajlar</h5>
                 <ul className="space-y-3">
                    {report.swot.strengths.slice(0,4).map((s,i) => (
                      <li key={i} className="text-[11px] font-bold text-emerald-700 flex items-start gap-3">
                         <span className="mt-1 w-2 h-2 bg-emerald-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> {s}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100 hover:shadow-lg transition-all">
                 <h5 className="text-[10px] font-black text-rose-800 uppercase mb-5 tracking-widest">Potansiyel Riskler</h5>
                 <ul className="space-y-3">
                    {report.swot.threats.slice(0,4).map((t,i) => (
                      <li key={i} className="text-[11px] font-bold text-rose-700 flex items-start gap-3">
                         <span className="mt-1 w-2 h-2 bg-rose-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span> {t}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </div>

      {/* Detailed Analysis Bento Grid */}
      <section className="space-y-10">
         <div className="flex items-center gap-6">
            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.4em]">Derinlemesine Karakter ve Vaka Analizi</h3>
            <div className="flex-1 h-px bg-slate-100"></div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnalysisBox title="Etik Değerler & Sınırlar" data={report.detailedAnalysis.ethics} />
            <AnalysisBox title="Metodolojik Pedagoji" data={report.detailedAnalysis.pedagogy} />
            <AnalysisBox title="Klinik Muhakeme" data={report.detailedAnalysis.clinicalWisdom} />
            <AnalysisBox title="Duygusal Dayanıklılık" data={report.detailedAnalysis.emotionalResilience} />
            <AnalysisBox title="Kurumsal Profesyonellik" data={report.detailedAnalysis.institutionalFit} />
            <AnalysisBox title="Kriz & Stres Yanıtı" data={report.detailedAnalysis.stressResponse} />
         </div>
      </section>

      {/* Footer / Trust Seal */}
      <div className="mt-24 pt-12 border-t-2 border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
               <svg className="w-6 h-6 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" /></svg>
            </div>
            <div>DİJİTAL DOĞRULAMA KODU: {candidate.id.toUpperCase()}</div>
         </div>
         <div className="text-center sm:text-right">
            YENİ GÜN AKADEMİ <br/> AKADEMİK KURUL ONAYLI ANALİZ BELGESİ
         </div>
      </div>
    </div>
  );
};

export default CandidateReport;
