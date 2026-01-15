
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
            <p className="text-4xl font-black">%{report?.score || '?'}</p>
          </div>
        </div>
      </div>

      {/* Section I: Personal & Background Information */}
      <section className="mb-12 break-inside-avoid">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-slate-900 pl-4">I. Aday Tanıtım ve Özgeçmiş Verileri</h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Branş ve Kıdem</span>
            <p className="text-[11px] font-bold text-slate-800">{candidate.branch} • {candidate.experienceYears} Yıl</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">İletişim Bilgileri</span>
            <p className="text-[11px] font-bold text-slate-800">{candidate.email}</p>
            <p className="text-[11px] font-bold text-slate-800">{candidate.phone}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Kişisel Bilgiler</span>
            <p className="text-[11px] font-bold text-slate-800">{candidate.age} Yaş • {candidate.gender}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-slate-100 rounded-2xl">
            <h4 className="text-[8px] font-black text-orange-600 uppercase tracking-widest mb-3">Mesleki Geçmiş ve Deneyimler</h4>
            <p className="text-[11px] font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">
              {candidate.previousInstitutions || 'Bilgi sağlanmadı.'}
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-2xl">
            <h4 className="text-[8px] font-black text-orange-600 uppercase tracking-widest mb-3">Eğitsel Donanım ve Sertifikalar</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.allTrainings && candidate.allTrainings.length > 0 ? (
                candidate.allTrainings.map((train, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase">
                    {train}
                  </span>
                ))
              ) : (
                <p className="text-[11px] font-bold text-slate-400 italic">Beyan edilen sertifika bulunmuyor.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis Sections - Only render if report exists */}
      {report && report.detailedAnalysis ? (
        <>
          {/* Section II: Summary */}
          <section className="mb-12 break-inside-avoid">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 border-l-4 border-slate-900 pl-4">II. Stratejik Analiz Özeti</h3>
            <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl">
              <p className="text-sm font-bold italic leading-relaxed">"{report.summary}"</p>
            </div>
          </section>

          {/* Section III: Competency Map */}
          <div className="grid grid-cols-2 gap-10 mb-12 break-inside-avoid">
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
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">III. Karar ve Atama Tavsiyesi</h3>
              <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-4">
                {report.recommendation}
              </p>
            </div>
          </div>

          {/* Section IV: Detailed Breakdown */}
          <section className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 border-l-4 border-slate-900 pl-4">IV. Boyutsal Yetkinlik Analizi</h3>
            <div className="bg-white border border-slate-100 rounded-2xl px-6">
              <AnalysisRow title="Metodolojik Pedagoji" data={report.detailedAnalysis.pedagogy} />
              <AnalysisRow title="Klinik Muhakeme" data={report.detailedAnalysis.clinicalWisdom} />
              <AnalysisRow title="Etik Bütünlük" data={report.detailedAnalysis.ethics} />
              <AnalysisRow title="Kriz ve Stres Yanıtı" data={report.detailedAnalysis.stressResponse} />
              <AnalysisRow title="Duygusal Dayanıklılık" data={report.detailedAnalysis.emotionalResilience} />
              <AnalysisRow title="Kurumsal Aidiyet" data={report.detailedAnalysis.institutionalFit} />
            </div>
          </section>
        </>
      ) : (
        <section className="p-20 text-center border-4 border-dashed border-slate-50 rounded-[3rem] opacity-30 mt-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Yapay Zeka Analiz Verisi Bulunmuyor</p>
        </section>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center text-[7px] font-black text-slate-300 uppercase tracking-widest">
        <span>GİZLİDİR • AKADEMİK LİYAKAT DENETİM RAPORU</span>
        <span>RAPOR ID: {candidate.id.toUpperCase()} • TARİH: {new Date().toLocaleDateString('tr-TR')}</span>
      </div>
    </div>
  );
};

export default CandidateReport;
