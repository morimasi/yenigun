
import React from 'react';
import { AIReport, Candidate } from '../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
}

const AnalysisRow: React.FC<{ title: string; data: any }> = ({ title, data }) => (
  <div className="grid grid-cols-12 gap-6 py-4 border-b border-slate-100 last:border-0 items-center break-inside-avoid">
    <div className="col-span-4">
      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h5>
      <div className="flex items-center gap-2">
        <span className="text-sm font-black text-slate-900">%{data.score}</span>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${data.score}%` }}></div>
        </div>
      </div>
    </div>
    <div className="col-span-8">
      <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic mb-2">"{data.comment}"</p>
      <div className="flex flex-wrap gap-1">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[7px] font-black text-slate-500 uppercase">
            {p}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate }) => {
  if (!report) return null;

  return (
    <div id="strategic-report" className="animate-fade-in print:p-0 p-4 max-w-4xl mx-auto space-y-12">
      
      {/* 1. RESMİ ÜST BİLGİ (OFFICIAL HEADER) */}
      <div className="flex justify-between items-end border-b-4 border-slate-900 pb-10 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-lg">YG</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">Yeni Gün Akademi</p>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Akademik Liyakat Raporu</h1>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{candidate.name}</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{candidate.branch}</span>
              <span className="text-slate-300 font-bold text-[9px]">ID: {candidate.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
           <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl inline-block">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1">Genel Skor</p>
              <p className="text-5xl font-black">%{report.score}</p>
           </div>
        </div>
      </div>

      {/* 2. YÖNETİCİ ÖZETİ (EXECUTIVE SUMMARY) */}
      <section className="space-y-4 break-inside-avoid">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-4 border-slate-900 pl-4">I. Stratejik Değerlendirme Özeti</h3>
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-lg font-bold leading-relaxed italic text-slate-700 tracking-tight">"{report.summary}"</p>
        </div>
      </section>

      {/* 3. YETKİNLİK MATRİSİ VE RADAR (MATRIX) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center break-inside-avoid">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 h-[380px]">
           <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={report.competencies}>
                <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 8, fontWeight: 900 }} 
                />
                <Radar 
                  name="Aday" 
                  dataKey="value" 
                  stroke="#0f172a" 
                  strokeWidth={3}
                  fill="#0f172a" 
                  fillOpacity={0.15} 
                />
              </RadarChart>
           </ResponsiveContainer>
        </div>
        <div className="space-y-6">
           <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em]">II. Analitik Karar Tavsiyesi</h4>
           <p className="text-base font-bold text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-6">
             {report.recommendation}
           </p>
           <div className="grid grid-cols-1 gap-4">
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                 <h5 className="text-[8px] font-black text-emerald-800 uppercase mb-3 tracking-widest">Temel Avantajlar</h5>
                 <ul className="space-y-1.5">
                    {report.swot.strengths.slice(0,3).map((s,i) => (
                      <li key={i} className="text-[9px] font-bold text-slate-600 flex items-start gap-2">
                         <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span> {s}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* 4. AYRINTILI KATEGORİK ANALİZ (DETAILED CATEGORIES) */}
      <section className="space-y-6 break-inside-avoid">
         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-4 border-slate-900 pl-4">III. Çok Boyutlu Yetkinlik Dökümü</h3>
         <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden px-8">
            <AnalysisRow title="Etik Değerler ve Sınırlar" data={report.detailedAnalysis.ethics} />
            <AnalysisRow title="Metodolojik Pedagoji" data={report.detailedAnalysis.pedagogy} />
            <AnalysisRow title="Klinik Muhakeme" data={report.detailedAnalysis.clinicalWisdom} />
            <AnalysisRow title="Duygusal Dayanıklılık" data={report.detailedAnalysis.emotionalResilience} />
            <AnalysisRow title="Kriz ve Stres Yönetimi" data={report.detailedAnalysis.stressResponse} />
            <AnalysisRow title="Kurumsal Profesyonellik" data={report.detailedAnalysis.institutionalFit} />
         </div>
      </section>

      {/* 5. RESMİ ONAY VE MÜHÜR (OFFICIAL SEAL) */}
      <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-slate-50 rounded-full flex items-center justify-center opacity-30">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" /></svg>
            </div>
            <div>Döküman Doğrulama: {candidate.id.toUpperCase()} <br/> Tarih: {new Date().toLocaleDateString('tr-TR')}</div>
         </div>
         <div className="text-right">
            Yeni Gün Akademi <br/> Akademik Kurul Dijital Onay Sistemi
         </div>
      </div>
    </div>
  );
};

export default CandidateReport;
