
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
  <div className="flex items-center gap-4 mb-6 border-b-2 border-slate-900 pb-2 break-after-avoid mt-8 first:mt-0 relative">
    <span className="text-[12px] font-black bg-slate-900 text-white px-3 py-1 rounded-md">{number}</span>
    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{title}</h3>
    <div className="absolute right-0 bottom-2 text-[8px] font-black text-slate-200 uppercase tracking-widest">Confidential / Confidential / Confidential</div>
  </div>
);

const CandidateReport: React.FC<{ report?: AIReport, candidate: Candidate, options?: ReportCustomizationOptions }> = ({ report, candidate, options = defaultOptions }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white p-[20mm] w-[210mm] text-slate-900 relative shadow-none border border-slate-100" id="report-export-area" style={{ minHeight: '297mm' }}>
      
      {/* FILIGRAN / WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg] overflow-hidden">
        <span className="text-[150px] font-black uppercase select-none">YENİ GÜN AKADEMİ</span>
      </div>

      {/* OFFICIAL HEADER */}
      <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-12 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-2xl">YG</div>
            <div>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-1">AKADEMİK KURUL DENETİMİ</p>
              <h2 className="text-[18px] font-black text-slate-900 uppercase tracking-tighter">{options.headerTitle || 'KURUMSAL LİYAKAT KARAR MUHTIRASI'}</h2>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none text-slate-900">{candidate.name}</h1>
            <p className="text-lg font-black text-slate-400 uppercase tracking-widest mt-2">{candidate.branch}</p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-2">GENEL UYGUNLUK</p>
               <p className="text-6xl font-black leading-none">%{report?.score || '?'}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-600/20 rounded-full blur-2xl"></div>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right leading-relaxed">
            DOSYA TARİHİ: {dateStr} <br />
            REFERANS NO: {candidate.id.toUpperCase()} <br />
            DİJİTAL MÜHÜR: VERIFIED_AI_X02
          </div>
        </div>
      </div>

      {/* FAZ 3: DÜRÜSTLÜK VE ETİK SPEKTRUMU */}
      {report && (
        <section className="mb-12 grid grid-cols-2 gap-8 break-inside-avoid relative z-10">
          <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col justify-center text-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Integrity Index (Dürüstlük)</span>
             <div className="text-4xl font-black text-slate-900 mb-2">%{report.integrityIndex}</div>
             <div className="h-2 bg-slate-200 rounded-full overflow-hidden w-full max-w-[150px] mx-auto">
                <div className={`h-full ${report.integrityIndex > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${report.integrityIndex}%` }}></div>
             </div>
             <p className="text-[8px] font-bold text-slate-400 uppercase mt-3 italic">"Cevap tutarlılığı ve öz-eleştiri dürüstlüğü puanı."</p>
          </div>
          <div className="p-8 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-center text-center shadow-xl">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Social Masking (Sosyal Maske)</span>
             <div className="text-4xl font-black text-white mb-2">%{report.socialMaskingScore}</div>
             <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full max-w-[150px] mx-auto">
                <div className={`h-full ${report.socialMaskingScore < 40 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${report.socialMaskingScore}%` }}></div>
             </div>
             <p className="text-[8px] font-bold text-slate-400 uppercase mt-3 italic">"Adayın kendini idealize etme eğilimi katsayısı."</p>
          </div>
        </section>
      )}

      {/* SECTION I: STRATEJİK ÖZET */}
      {options.showAIAnalysis && report && (
        <section className="mb-12 relative z-10">
          <SectionHeader title="Klinik Direktörlük Stratejik Özeti" number="01" />
          <div className="p-12 bg-white border-4 border-slate-900 rounded-[3.5rem] relative overflow-hidden shadow-sm">
             <div className="absolute top-4 left-4 text-slate-100 text-6xl font-black select-none">"</div>
             <p className="text-[14px] font-bold italic leading-relaxed text-slate-800 text-center relative z-10 px-8">
               {report.summary}
             </p>
             <div className="absolute bottom-4 right-4 text-slate-100 text-6xl font-black select-none rotate-180">"</div>
          </div>
        </section>
      )}

      {/* SECTION II: ETİK VE KLİNİK DERİNLİK */}
      {options.showAIAnalysis && report && (
        <section className="mb-12 relative z-10">
          <SectionHeader title="Boyutsal Yetkinlik Denetimi" number="02" />
          <div className="space-y-8">
             {[
               { label: 'Etik Bütünlük', data: report.detailedAnalysis.ethics },
               { label: 'Klinik Muhakeme', data: report.detailedAnalysis.clinicalWisdom },
               { label: 'Kurumsal Uyum', data: report.detailedAnalysis.institutionalFit }
             ].map((item, idx) => (
               <div key={idx} className="grid grid-cols-12 gap-8 items-start border-b border-slate-50 pb-8 last:border-0 break-inside-avoid">
                 <div className="col-span-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</h5>
                    <div className="flex items-center gap-4">
                       <span className="text-2xl font-black text-slate-900">%{item.data.score}</span>
                       <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                          <div className="h-full bg-slate-900" style={{ width: `${item.data.score}%` }}></div>
                       </div>
                    </div>
                 </div>
                 <div className="col-span-8">
                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-4 italic">"{item.data.comment}"</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <span className="text-[7px] font-black text-emerald-700 uppercase block mb-1">Kurumsal Avantaj</span>
                          <p className="text-[9px] font-bold text-slate-600 leading-tight">{item.data.shortTermImpact}</p>
                       </div>
                       <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                          <span className="text-[7px] font-black text-rose-700 uppercase block mb-1">Potansiyel Risk</span>
                          <p className="text-[9px] font-bold text-slate-600 leading-tight">{item.data.longTermImplication}</p>
                       </div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* FOOTER: DİJİTAL MÜHÜR VE ONAY */}
      <div className="mt-24 pt-12 border-t-4 border-slate-900 flex justify-between items-end relative z-10">
         <div className="space-y-4">
            <div className="w-24 h-24 border-4 border-slate-900 rounded-full flex items-center justify-center rotate-[-15deg] opacity-60">
               <div className="text-center">
                  <p className="text-[8px] font-black uppercase leading-tight">YENİ GÜN<br/>KLİNİK<br/>MÜHÜR</p>
               </div>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">VERIFIED BY NEWDAY AI SYSTEMS v3.5</p>
         </div>
         <div className="flex gap-16 text-center">
            <div className="space-y-8">
               <div className="w-48 h-px bg-slate-300"></div>
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">KLİNİK DİREKTÖR</span>
            </div>
            <div className="space-y-8">
               <div className="w-48 h-px bg-slate-300"></div>
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">GENEL MÜDÜR ONAYI</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CandidateReport;
