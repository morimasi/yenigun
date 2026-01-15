
import React from 'react';
import { AIReport, Candidate } from '../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
}

const AnalysisRow: React.FC<{ title: string; data: any }> = ({ title, data }) => {
  if (!data) return null;
  return (
    <div className="py-6 border-b border-slate-100 last:border-0 break-inside-avoid">
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-4">
          <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h5>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">%{data.score || 0}</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900" style={{ width: `${data.score || 0}%` }}></div>
            </div>
          </div>
        </div>
        <div className="col-span-8">
          <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-3">"{data.comment || ''}"</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {data.keyPoints?.map((p: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[7px] font-black text-slate-500 uppercase">
                {p}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-2 bg-slate-50/50 rounded-lg border border-slate-100">
              <span className="text-[6px] font-black text-slate-400 uppercase block mb-1">Kısa Vadeli Etki</span>
              <p className="text-[8px] font-bold text-slate-600 leading-tight">{data.shortTermImpact || 'N/A'}</p>
            </div>
            <div className="p-2 bg-slate-50/50 rounded-lg border border-slate-100">
              <span className="text-[6px] font-black text-slate-400 uppercase block mb-1">Uzun Vadeli Projeksiyon</span>
              <p className="text-[8px] font-bold text-slate-600 leading-tight">{data.longTermImplication || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate }) => {
  if (!report || !report.detailedAnalysis) return (
    <div className="p-20 text-center font-black uppercase text-slate-300">
      Aday Analiz Verisi Bulunmuyor
    </div>
  );

  return (
    <div className="bg-white p-10 max-w-[210mm] mx-auto text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-end border-b-4 border-slate-900 pb-10 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-lg">YG</div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Yeni Gün Akademi</p>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2">{candidate.name}</h1>
          <p className="text-sm font-black text-orange-600 uppercase tracking-widest">{candidate.branch}</p>
        </div>
        <div className="text-right">
          <div className="bg-slate-900 text-white p-6 rounded-2xl">
            <p className="text-[8px] font-black uppercase tracking-widest text-orange-500 mb-1">Genel Skor</p>
            <p className="text-4xl font-black">%{report.score}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <section className="mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 border-l-4 border-slate-900 pl-4">I. Stratejik Özet</h3>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-base font-bold italic text-slate-700 leading-relaxed">"{report.summary}"</p>
        </div>
      </section>

      {/* Competencies */}
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div className="h-[250px] bg-white border border-slate-100 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={report.competencies}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} />
              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">II. Karar Tavsiyesi</h3>
          <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-4">
            {report.recommendation}
          </p>
        </div>
      </div>

      {/* Details */}
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 border-l-4 border-slate-900 pl-4">III. Boyutsal Analiz</h3>
        <div className="bg-white border border-slate-100 rounded-2xl px-6">
          <AnalysisRow title="Metodolojik Pedagoji" data={report.detailedAnalysis.pedagogy} />
          <AnalysisRow title="Klinik Muhakeme" data={report.detailedAnalysis.clinicalWisdom} />
          <AnalysisRow title="Etik Bütünlük" data={report.detailedAnalysis.ethics} />
          <AnalysisRow title="Kriz Yanıtı" data={report.detailedAnalysis.stressResponse} />
        </div>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center text-[7px] font-black text-slate-300 uppercase tracking-widest">
        <span>GİZLİDİR • AKADEMİK LİYAKAT DENETİMİ</span>
        <span>ID: {candidate.id.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default CandidateReport;
