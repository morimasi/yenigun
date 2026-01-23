
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
  <div className="flex items-center gap-6 mb-10 border-b-4 border-slate-900 pb-4 break-after-avoid mt-12 first:mt-0 relative">
    <span className="text-[14px] font-black bg-slate-900 text-white px-4 py-2 rounded-lg">{number}</span>
    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">{title}</h3>
    <div className="absolute right-0 bottom-4 text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">PRIVILEGED DOCUMENT</div>
  </div>
);

const CandidateReport: React.FC<{ report?: AIReport, candidate: Candidate, options?: ReportCustomizationOptions }> = ({ report, candidate, options = defaultOptions }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

  const radarData = report?.deepAnalysis ? [
    { subject: 'ETİK', value: report.deepAnalysis.workEthics.score },
    { subject: 'KLİNİK', value: report.deepAnalysis.technicalExpertise.score },
    { subject: 'PEDAGOJİ', value: report.deepAnalysis.pedagogicalAnalysis.score },
    { subject: 'DİRENÇ', value: report.deepAnalysis.sustainability.score },
    { subject: 'RESMİYET', value: report.deepAnalysis.formality.score },
    { subject: 'UYUM', value: report.deepAnalysis.institutionalLoyalty.score },
  ] : [];

  return (
    <div className="bg-white p-[25mm] w-[210mm] text-slate-900 relative shadow-none border border-slate-100 font-sans" id="report-export-area" style={{ minHeight: '297mm' }}>
      
      {/* FILIGRAN */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] rotate-[-45deg] overflow-hidden">
        <span className="text-[180px] font-black uppercase select-none">KLİNİK LİYAKAT</span>
      </div>

      {/* OFFICIAL HEADER */}
      <div className="flex justify-between items-start border-b-[8px] border-slate-900 pb-16 mb-16 relative z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center font-black text-4xl shadow-2xl">YG</div>
            <div>
              <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.6em] mb-2">AKADEMİK KURUL ONAYLI</p>
              <h2 className="text-[20px] font-black text-slate-900 uppercase tracking-tighter leading-tight">{options.headerTitle || 'LİYAKAT VE YETKİNLİK KARAR DOSYASI'}</h2>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">{candidate.name}</h1>
            <p className="text-xl font-black text-slate-400 uppercase tracking-[0.3em]">{candidate.branch}</p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-8">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">UYGUNLUK SKORU</p>
               <p className="text-7xl font-black leading-none">%{report?.score || '?'}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-600/20 rounded-full blur-2xl"></div>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right leading-relaxed">
            DÜZENLEME: {dateStr} <br />
            DOSYA ID: {candidate.id.toUpperCase()} <br />
            DİJİTAL MÜHÜR: YG-AI-VERIFIED-V2
          </div>
        </div>
      </div>

      {/* KLİNİK DNA RADAR */}
      <section className="mb-16 grid grid-cols-12 gap-12 break-inside-avoid relative z-10">
         <div className="col-span-6 h-[320px] bg-slate-50 rounded-[3rem] p-8 border border-slate-100 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
               <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontBold: 900, fill: '#64748b' }} />
                  <Radar dataKey="value" stroke="#000000" fill="#000000" fillOpacity={0.1} strokeWidth={2} />
               </RadarChart>
            </ResponsiveContainer>
         </div>
         <div className="col-span-6 flex flex-col justify-center space-y-8">
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
               <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-4">Integrity & Social Masking</span>
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-3xl font-black">%{report?.integrityIndex}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Dürüstlük Endeksi</p>
                  </div>
                  <div className="text-right">
                     <p className="text-3xl font-black">%{report?.socialMaskingScore}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Sosyal Maske</p>
                  </div>
               </div>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Yönetici Özeti</span>
               <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">"{report?.summary}"</p>
            </div>
         </div>
      </section>

      {/* MATRIX DETAILS */}
      <section className="mb-16 relative z-10">
         <SectionHeader title="Boyutsal Yetkinlik Matrisi" number="01" />
         <div className="grid grid-cols-2 gap-8">
            {report && Object.entries(report.deepAnalysis).slice(0, 8).map(([key, segment]: [string, any]) => (
               <div key={key} className="p-8 border-2 border-slate-100 rounded-[2.5rem] break-inside-avoid">
                  <div className="flex justify-between items-center mb-4">
                     <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                     <span className="text-xl font-black text-slate-900">%{segment.score}</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full mb-4">
                     <div className="h-full bg-slate-900" style={{ width: `${segment.score}%` }}></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 leading-tight">"{segment.pros[0]}"</p>
               </div>
            ))}
         </div>
      </section>

      {/* PREDICTIONS */}
      <section className="mb-16 relative z-10 break-inside-avoid">
         <SectionHeader title="Prediktif Performans Projeksiyonu" number="02" />
         <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
            <div className="grid grid-cols-2 gap-12">
               {[
                  { l: 'KURUMSAL BAĞLILIK', v: report?.predictiveMetrics.retentionProbability },
                  { l: 'BURNOUT DİRENCİ', v: 100 - (report?.predictiveMetrics.burnoutRisk || 0) },
                  { l: 'ÖĞRENME HIZI', v: report?.predictiveMetrics.learningVelocity },
                  { l: 'LİDERLİK POTANSİYELİ', v: report?.predictiveMetrics.leadershipPotential }
               ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.l}</span>
                        <span className="text-2xl font-black text-orange-500">%{item.v}</span>
                     </div>
                     <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600" style={{ width: `${item.v}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <div className="mt-24 pt-16 border-t-[4px] border-slate-900 flex justify-between items-end relative z-10">
         <div className="space-y-6">
            <div className="w-28 h-28 border-[6px] border-slate-900 rounded-full flex items-center justify-center rotate-[-15deg] opacity-80">
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase leading-tight">YENİ GÜN<br/>KLİNİK<br/>VERIFIED</p>
               </div>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">CERTIFICATE ID: YG-X-ALPHA-09</p>
         </div>
         <div className="flex gap-20 text-center">
            <div className="space-y-12">
               <div className="w-56 h-px bg-slate-300"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AKADEMİK KURUL</span>
            </div>
            <div className="space-y-12">
               <div className="w-56 h-px bg-slate-300"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">KURUM MÜDÜRÜ</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CandidateReport;
