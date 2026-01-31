
import React from 'react';
import { AIReport, Candidate, Branch } from '../types';
import { BRANCH_CATEGORY_MULTIPLIERS } from '../constants/taxonomy';
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
    <div className="absolute right-0 bottom-4 text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">CONFIDENTIAL BRANCH SPECIFIC ANALYSIS</div>
  </div>
);

const CandidateReport: React.FC<{ report?: AIReport, candidate: Candidate, options?: ReportCustomizationOptions }> = ({ report, candidate, options = defaultOptions }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  const branchMultipliers = BRANCH_CATEGORY_MULTIPLIERS[candidate.branch as Branch] || {};

  const radarData = (report?.deepAnalysis && typeof report.deepAnalysis === 'object') ? [
    { subject: 'ETİK', value: report.deepAnalysis.workEthics?.score || 0, ideal: Math.min(100, 70 * (branchMultipliers.ethics || 1.0)) },
    { subject: 'KLİNİK', value: report.deepAnalysis.technicalExpertise?.score || 0, ideal: Math.min(100, 70 * (branchMultipliers.clinical || 1.0)) },
    { subject: 'PEDAGOJİ', value: report.deepAnalysis.pedagogicalAnalysis?.score || 0, ideal: Math.min(100, 70 * (branchMultipliers.pedagogicalAnalysis || 1.0)) },
    { subject: 'DİRENÇ', value: report.deepAnalysis.sustainability?.score || 0, ideal: Math.min(100, 70 * (branchMultipliers.sustainability || 1.0)) },
    { subject: 'UYUM', value: report.deepAnalysis.institutionalLoyalty?.score || 0, ideal: Math.min(100, 70 * (branchMultipliers.institutionalLoyalty || 1.0)) },
    { subject: 'GELİŞİM', value: report.deepAnalysis.developmentOpenness?.score || 0, ideal: 75 },
  ] : [];

  return (
    <div className="bg-white p-[25mm] w-[210mm] text-slate-900 relative shadow-none border border-slate-100 font-sans" id="report-export-area" style={{ minHeight: '297mm' }}>
      
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

        <div className="text-right flex flex-col items-end gap-6">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center min-w-[200px]">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-3">BRANŞ UYUMU</p>
            <p className="text-7xl font-black leading-none text-white">%{candidate.algoReport?.branchComplianceScore || '?'}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-4">GENEL LİYAKAT: %{report?.score || '?'}</p>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right leading-relaxed">
            TARİH: {dateStr} <br />
            REFERANS: {candidate.id.toUpperCase()} <br />
            MODEL: GEMINI-3-FLASH (REASONING)
          </div>
        </div>
      </div>

      {/* KLİNİK DNA RADAR (Overlay Mode) */}
      <section className="mb-20 grid grid-cols-12 gap-12 break-inside-avoid relative z-10">
         <div className="col-span-6 h-[400px] bg-slate-50 rounded-[4rem] p-10 border border-slate-100 flex items-center justify-center relative">
            <div className="absolute top-8 left-8">
               <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest block mb-2">UZMANLIK SPEKTRUMU</span>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase"><div className="w-2 h-2 bg-black rounded-full"></div> ADAY</div>
                  <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase"><div className="w-2 h-2 bg-slate-200 rounded-full"></div> İDEAL</div>
               </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
               <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} />
                  <Radar dataKey="ideal" stroke="#e2e8f0" fill="#cbd5e1" fillOpacity={0.4} strokeWidth={1} />
                  <Radar dataKey="value" stroke="#000000" fill="#000000" fillOpacity={0.08} strokeWidth={3} />
               </RadarChart>
            </ResponsiveContainer>
         </div>
         <div className="col-span-6 flex flex-col justify-center space-y-10">
            <div className="p-10 bg-slate-900 rounded-[3rem] text-white">
               <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block mb-4">GÜVEN VE DOĞRULUK</span>
               <div className="flex justify-between items-end mb-8">
                  <div>
                     <p className="text-4xl font-black">%{report?.integrityIndex || 0}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Dürüstlük Endeksi</p>
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-black">%{report?.socialMaskingScore || 0}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Sosyal Maske</p>
                  </div>
               </div>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600" style={{ width: `${report?.integrityIndex || 0}%` }}></div>
               </div>
            </div>
            <div className="p-10 bg-white border-2 border-slate-100 rounded-[3rem]">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Kurumsal Değerlendirme</span>
               <p className="text-[12px] font-bold text-slate-800 leading-relaxed italic">"{report?.summary}"</p>
            </div>
         </div>
      </section>

      {/* MATRIX DETAILS */}
      <SectionHeader title="Boyutsal Analiz Verisi" number="01" />
      <div className="grid grid-cols-2 gap-10 relative z-10">
        {report?.deepAnalysis && Object.entries(report.deepAnalysis).map(([key, segment]: [string, any]) => (
           <div key={key} className="p-8 border border-slate-100 bg-slate-50/50 rounded-[2.5rem] break-inside-avoid">
              <div className="flex justify-between items-center mb-6">
                 <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                 <span className="text-2xl font-black text-slate-900">%{segment?.score || 0}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed text-justify italic">"{segment?.reasoning?.substring(0, 200)}..."</p>
           </div>
        ))}
      </div>

      {/* PREDICTIONS */}
      <SectionHeader title="Gelişim ve Risk Projeksiyonu" number="02" />
      <div className="bg-slate-900 p-12 rounded-[4rem] text-white relative z-10">
         <div className="grid grid-cols-2 gap-16">
            <div className="space-y-8">
               {[
                  { l: 'KURUMSAL BAĞLILIK', v: report?.predictiveMetrics?.retentionProbability || 0 },
                  { l: 'BİLİŞSEL ÇEVİKLİK', v: report?.predictiveMetrics?.learningVelocity || 0 }
               ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.l}</span>
                        <span className="text-3xl font-black text-orange-500">%{item.v}</span>
                     </div>
                     <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600" style={{ width: `${item.v}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
            <div className="flex flex-col justify-center border-l border-white/10 pl-16">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">24 AY SONUNDA KONUM:</span>
               <p className="text-xl font-black uppercase tracking-tight italic leading-snug">"{report?.predictiveMetrics?.evolutionPath}"</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CandidateReport;
