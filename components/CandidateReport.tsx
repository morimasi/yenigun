
import React, { useMemo } from 'react';
import { AIReport, Candidate, ExportConfig } from '../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
  options: ExportConfig;
  comparisonData?: any; // Opsiyonel kıyaslama verisi
}

const PAGE_STYLE = {
  width: '210mm',
  minHeight: '296mm',
  padding: '12mm',
  backgroundColor: 'white',
  position: 'relative' as const,
  overflow: 'hidden',
  pageBreakAfter: 'always' as const
};

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate, options, comparisonData }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  
  const radarData = useMemo(() => {
    if (!report?.deepAnalysis) return [];
    const keys = Object.keys(report.deepAnalysis).slice(0, 6);
    return keys.map(k => ({
      subject: k.replace(/([A-Z])/g, ' $1').toUpperCase(),
      value: (report.deepAnalysis as any)[k]?.score || 0
    }));
  }, [report]);

  const Header = () => (
    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl">YG</div>
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">{options.title}</h1>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">RESMİ AKADEMİK KAYIT</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-900 uppercase">{candidate.name}</p>
        <p className="text-[9px] font-medium text-slate-500 uppercase">{candidate.branch}</p>
        <p className="text-[8px] font-mono text-slate-400 mt-1">{dateStr}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 items-center bg-slate-200/50 py-8 print:bg-white print:p-0 print:gap-0">
      
      {/* SAYFA 1: KAPAK VE ÖZET */}
      <div className="pdf-page bg-white relative shadow-2xl print:shadow-none" style={PAGE_STYLE}>
        <Header />
        
        <div className="mt-12 text-center space-y-6">
           <span className="px-6 py-1.5 bg-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">GİZLİDİR</span>
           <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{candidate.name}</h2>
           <p className="text-xl font-bold text-slate-500 uppercase tracking-[0.4em]">{candidate.branch}</p>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-12">
           <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                 <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">LİYAKAT SENTEZİ</h3>
                 <div className="flex items-end gap-3 mb-4">
                    <span className="text-7xl font-black text-slate-900">%{report?.score}</span>
                 </div>
                 <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-orange-600" style={{ width: `${report?.score}%` }}></div>
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-900 uppercase border-l-4 border-slate-900 pl-4">YÖNETİCİ ÖZETİ</h4>
                 <p className="text-[11px] font-medium text-slate-600 leading-relaxed text-justify italic">"{report?.summary}"</p>
              </div>
           </div>

           <div className="bg-white border border-slate-100 rounded-[4rem] p-6 h-[350px]">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">YETKİNLİK SPEKTRUMU</h4>
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 7, fontWeight: 900, fill: '#64748b' }} />
                    <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} strokeWidth={2} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="absolute bottom-12 left-0 w-full px-12 flex justify-between items-center text-[9px] font-bold text-slate-300">
           <span>YENİ GÜN AKADEMİ v20.0</span>
           <div className="flex gap-4">
              <span>QR DOĞRULAMA</span>
              <div className="w-10 h-10 bg-slate-100 rounded"></div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default CandidateReport;
