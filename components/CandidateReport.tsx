
import React from 'react';
import { AIReport, Candidate } from '../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export interface ReportCustomizationOptions {
  showPersonalDetails: boolean;
  showAcademicBackground: boolean;
  showAIAnalysis: boolean;
  showSWOT: boolean;
  showCompetencyMap: boolean;
  showInterviewNotes: boolean;
  headerTitle?: string;
}

const defaultOptions: ReportCustomizationOptions = {
  showPersonalDetails: true,
  showAcademicBackground: true,
  showAIAnalysis: true,
  showSWOT: true,
  showCompetencyMap: true,
  showInterviewNotes: true
};

const SectionHeader: React.FC<{ title: string; number: string }> = ({ title, number }) => (
  <div className="flex items-center gap-6 mb-10 border-b-4 border-slate-900 pb-4 break-after-avoid mt-16 first:mt-0 relative">
    <span className="text-[14px] font-black bg-slate-900 text-white px-4 py-2 rounded-lg">{number}</span>
    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">{title}</h3>
    <div className="absolute right-0 bottom-4 text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">CONFIDENTIAL AI ANALYSIS</div>
  </div>
);

const CandidateReport: React.FC<{ report?: AIReport, candidate: Candidate, options?: ReportCustomizationOptions }> = ({ report, candidate, options = defaultOptions }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

  const radarData = report?.deepAnalysis ? [
    { subject: 'ETİK', value: report.deepAnalysis.workEthics?.score || 0 },
    { subject: 'KLİNİK', value: report.deepAnalysis.technicalExpertise?.score || 0 },
    { subject: 'PEDAGOJİ', value: report.deepAnalysis.pedagogicalAnalysis?.score || 0 },
    { subject: 'DİRENÇ', value: report.deepAnalysis.sustainability?.score || 0 },
    { subject: 'RESMİYET', value: report.deepAnalysis.formality?.score || 0 },
    { subject: 'UYUM', value: report.deepAnalysis.institutionalLoyalty?.score || 0 },
    { subject: 'GELİŞİM', value: report.deepAnalysis.developmentOpenness?.score || 0 },
    { subject: 'ELEŞTİRİ', value: report.deepAnalysis.criticismTolerance?.score || 0 },
    { subject: 'KARAKTER', value: report.deepAnalysis.personality?.score || 0 },
    { subject: 'VELİ', value: report.deepAnalysis.parentStudentRelations?.score || 0 },
  ] : [];

  return (
    <div className="bg-white p-[25mm] w-[210mm] text-slate-900 relative shadow-none border border-slate-100 font-sans" id="report-export-area" style={{ minHeight: '297mm' }}>
      
      {/* FILIGRAN */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.015] rotate-[-45deg] overflow-hidden">
        <span className="text-[180px] font-black uppercase select-none whitespace-nowrap">YENİ GÜN AKADEMİ</span>
      </div>

      {/* OFFICIAL HEADER */}
      <div className="flex justify-between items-start border-b-[8px] border-slate-900 pb-16 mb-16 relative z-10">
        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center font-black text-5xl shadow-2xl">YG</div>
            <div>
              <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.6em] mb-2">AKADEMİK LİYAKAT KURULU</p>
              <h2 className="text-[22px] font-black text-slate-900 uppercase tracking-tighter leading-tight max-w-[400px]">{options.headerTitle || 'UZMANLIK VE YETKİNLİK KARAR DOSYASI'}</h2>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">{candidate.name}</h1>
            <div className="flex items-center gap-4">
               <p className="text-xl font-black text-orange-600 uppercase tracking-[0.3em]">{candidate.branch}</p>
               <div className="w-2 h-2 rounded-full bg-slate-200"></div>
               <p className="text-xl font-black text-slate-400 uppercase tracking-[0.2em]">{candidate.experienceYears} Yıl Deneyim</p>
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-10">
          <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-3">LİYAKAT SKORU</p>
               <p className="text-8xl font-black leading-none">%{report?.score || '?'}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-600/30 rounded-full blur-3xl"></div>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right leading-relaxed">
            TARİH: {dateStr} <br />
            REFERANS: {candidate.id.toUpperCase()} <br />
            AI MODEL: GEMINI-3-FLASH-PREVIEW
          </div>
        </div>
      </div>

      {/* KLİNİK DNA RADAR & SUMMARY */}
      <section className="mb-20 grid grid-cols-12 gap-12 break-inside-avoid relative z-10">
         <div className="col-span-6 h-[350px] bg-slate-50 rounded-[4rem] p-10 border border-slate-100 flex items-center justify-center relative">
            <div className="absolute top-8 left-8">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ONLUK SPEKTRUM</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
               <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontBold: 900, fill: '#64748b' }} />
                  <Radar dataKey="value" stroke="#000000" fill="#000000" fillOpacity={0.08} strokeWidth={2.5} />
               </RadarChart>
            </ResponsiveContainer>
         </div>
         <div className="col-span-6 flex flex-col justify-center space-y-10">
            <div className="p-10 bg-slate-900 rounded-[3rem] text-white">
               <div className="flex justify-between items-end mb-8">
                  <div>
                     <p className="text-4xl font-black">%{report?.integrityIndex}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dürüstlük Endeksi</p>
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-black">%{report?.socialMaskingScore}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sosyal Maske</p>
                  </div>
               </div>
               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600" style={{ width: `${report?.integrityIndex}%` }}></div>
               </div>
            </div>
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Baş Klinik Özeti</span>
               <p className="text-[12px] font-bold text-slate-800 leading-relaxed italic">"{report?.summary}"</p>
            </div>
         </div>
      </section>

      {/* MATRIX DETAILS */}
      <section className="mb-20 relative z-10">
         <SectionHeader title="Boyutsal Analiz Detayları" number="01" />
         <div className="grid grid-cols-2 gap-10">
            {report && Object.entries(report.deepAnalysis).map(([key, segment]: [string, any]) => (
               <div key={key} className="p-10 border-2 border-slate-100 rounded-[3rem] break-inside-avoid bg-white">
                  <div className="flex justify-between items-center mb-6">
                     <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                     <span className="text-2xl font-black text-slate-900">%{segment.score}</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full mb-6">
                     <div className="h-full bg-slate-900" style={{ width: `${segment.score}%` }}></div>
                  </div>
                  <ul className="space-y-2">
                     {segment.pros.slice(0, 2).map((pro: string, idx: number) => (
                        <li key={idx} className="text-[10px] font-bold text-slate-600 leading-tight flex gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>{pro}</li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
      </section>

      {/* PREDICTIONS & SWOT */}
      <section className="mb-20 relative z-10 break-inside-avoid">
         <SectionHeader title="Prediktif Performans & SWOT" number="02" />
         <div className="grid grid-cols-12 gap-10">
            <div className="col-span-7 bg-slate-900 p-12 rounded-[4rem] text-white">
               <div className="space-y-8">
                  {[
                     { l: 'KURUMSAL BAĞLILIK', v: report?.predictiveMetrics.retentionProbability },
                     { l: 'BURNOUT DİRENCİ', v: 100 - (report?.predictiveMetrics.burnoutRisk || 0) },
                     { l: 'ÖĞRENME HIZI', v: report?.predictiveMetrics.learningVelocity },
                     { l: 'LİDERLİK POTANSİYELİ', v: report?.predictiveMetrics.leadershipPotential }
                  ].map((item, idx) => (
                     <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.l}</span>
                           <span className="text-3xl font-black text-orange-500">%{item.v}</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-600" style={{ width: `${item.v}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="col-span-5 flex flex-col gap-8">
               <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-4">GÜÇLÜ YÖNLER</span>
                  <div className="space-y-4">
                     {report?.swot.strengths.slice(0, 3).map((s, i) => (
                        <p key={i} className="text-[10px] font-black text-slate-900 leading-tight uppercase tracking-tight">{s}</p>
                     ))}
                  </div>
               </div>
               <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-4">RİSK ANALİZİ</span>
                  <div className="space-y-4">
                     {report?.swot.weaknesses.slice(0, 3).map((w, i) => (
                        <p key={i} className="text-[10px] font-black text-slate-900 leading-tight uppercase tracking-tight">{w}</p>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <div className="mt-32 pt-16 border-t-[6px] border-slate-900 flex justify-between items-end relative z-10">
         <div className="space-y-8">
            <div className="w-32 h-32 border-[8px] border-slate-900 rounded-full flex items-center justify-center rotate-[-15deg] opacity-90">
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase leading-tight">YENİ GÜN<br/>KLİNİK<br/>VERIFIED</p>
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">CERTIFICATE ID: YG-X-ALPHA-09-DECA</p>
         </div>
         <div className="flex gap-24 text-center pb-8">
            <div className="space-y-16">
               <div className="w-64 h-[2px] bg-slate-900"></div>
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">AKADEMİK KURUL</span>
            </div>
            <div className="space-y-16">
               <div className="w-64 h-[2px] bg-slate-900"></div>
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">KURUM MÜDÜRÜ</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CandidateReport;
