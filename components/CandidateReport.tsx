
import React from 'react';
import { AIReport, Candidate, Branch, ExportConfig } from '../types';
import { BRANCH_CATEGORY_MULTIPLIERS } from '../constants/taxonomy';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
  options: ExportConfig;
}

const PAGE_STYLE = {
  width: '210mm',
  height: '296mm', // A4 boyutu
  padding: '15mm', // Kompakt marj
  backgroundColor: 'white',
  position: 'relative' as const,
  overflow: 'hidden',
  boxShadow: '0 0 15px rgba(0,0,0,0.1)',
  pageBreakAfter: 'always' as const
};

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate, options }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  const { sections } = options;

  // Radar Data Hazırlığı
  const radarData = (report?.deepAnalysis && typeof report.deepAnalysis === 'object') ? [
    { subject: 'ETİK', value: report.deepAnalysis.workEthics?.score || 0, fullMark: 100 },
    { subject: 'KLİNİK', value: report.deepAnalysis.technicalExpertise?.score || 0, fullMark: 100 },
    { subject: 'PEDAGOJİ', value: report.deepAnalysis.pedagogicalAnalysis?.score || 0, fullMark: 100 },
    { subject: 'DİRENÇ', value: report.deepAnalysis.sustainability?.score || 0, fullMark: 100 },
    { subject: 'UYUM', value: report.deepAnalysis.institutionalLoyalty?.score || 0, fullMark: 100 },
    { subject: 'GELİŞİM', value: report.deepAnalysis.developmentOpenness?.score || 0, fullMark: 100 },
  ] : [];

  // --- SAYFA 1: KAPAK VE ÖZET ---
  const PageOne = () => {
    // Eğer Sayfa 1'deki kritik modüllerin hepsi kapalıysa sayfayı render etme (Opsiyonel: Ancak Kapak genellikle istenir)
    if (!sections.cover && !sections.executiveSummary && !sections.competencyMatrix) return null;

    return (
      <div id="report-page-1" className="pdf-page bg-white relative print:shadow-none print:m-0 print:w-full print:h-auto" style={PAGE_STYLE}>
        {/* HEADER (Cover varsa göster) */}
        {sections.cover && (
          <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-8 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-4xl shadow-xl print:shadow-none">YG</div>
              <div>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mb-1">AKADEMİK KURUL</p>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">{options.title}</h1>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DOSYA NO: {candidate.id.substring(0,8).toUpperCase()}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TARİH: {dateStr}</p>
            </div>
          </div>
        )}

        {/* CANDIDATE INFO STRIP (Executive Summary içindeyse göster) */}
        {sections.executiveSummary && (
          <>
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl mb-10 flex justify-between items-center print:bg-white print:border-slate-300">
              <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{candidate.name}</h2>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">{candidate.branch} • {candidate.experienceYears} YIL DENEYİM</p>
              </div>
              <div className="text-right">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">GENEL SKOR</span>
                  <span className={`text-5xl font-black ${report?.score && report.score > 75 ? 'text-emerald-600' : 'text-slate-900'}`}>%{report?.score || '?'}</span>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4 border-l-4 border-orange-600 pl-3">YÖNETİCİ ÖZETİ</h3>
              <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl text-justify print:border-slate-200">
                  <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">
                    "{report?.summary || 'Analiz verisi bekleniyor...'}"
                  </p>
              </div>
            </div>
          </>
        )}

        {/* METRICS GRID (COMPACT) */}
        {sections.competencyMatrix && (
          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* RADAR CHART */}
            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-4 h-[220px] relative print:bg-white print:border-slate-200">
                <span className="absolute top-4 left-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">YETKİNLİK AĞI</span>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="65%">
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                      <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* KEY INDICATORS */}
            <div className="flex flex-col gap-4">
                <div className="flex-1 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-center print:bg-slate-800">
                  <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mb-2">DÜRÜSTLÜK ENDEKSİ</span>
                  <div className="flex items-end gap-3">
                      <span className="text-5xl font-black">%{report?.integrityIndex || 0}</span>
                      <span className="text-[10px] text-slate-400 mb-2 opacity-80">GÜVENİLİR BEYAN</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${report?.integrityIndex}%` }}></div></div>
                </div>
                <div className="flex-1 border-2 border-slate-100 rounded-3xl p-6 flex flex-col justify-center print:border-slate-300">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">SOSYAL MASKELEME</span>
                  <div className="flex items-end gap-3">
                      <span className="text-5xl font-black text-slate-800">%{report?.socialMaskingScore || 0}</span>
                      <span className="text-[10px] text-slate-400 mb-2">RİSK FAKTÖRÜ</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${report?.socialMaskingScore}%` }}></div></div>
                </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        {options.showWatermark && (
          <div className="absolute bottom-12 right-12 opacity-10 pointer-events-none transform -rotate-12 border-4 border-slate-900 text-slate-900 font-black text-4xl p-4 rounded-xl uppercase tracking-[0.5em]">
              MIA CONFIDENTIAL
          </div>
        )}
        
        <div className="absolute bottom-6 left-0 w-full px-12 flex justify-between items-center text-[8px] font-bold text-slate-300 uppercase tracking-widest print:text-slate-500">
          <span>SAYFA 1/2</span>
          <span>BU BELGE YENİ GÜN AKADEMİ LİYAKAT PROTOKOLLERİNE GÖRE ÜRETİLMİŞTİR.</span>
        </div>
      </div>
    );
  };

  // --- SAYFA 2: DETAYLI ANALİZ VE İMZA ---
  const PageTwo = () => {
    // Sayfa 2'de içerik yoksa render etme
    if (!sections.behavioralDNA && !sections.swotAnalysis && !sections.futureProjection && !sections.interviewGuide) return null;

    return (
      <div id="report-page-2" className="pdf-page bg-white relative print:shadow-none print:m-0 print:w-full print:h-auto" style={PAGE_STYLE}>
        
        {sections.behavioralDNA && (
          <>
            <div className="mb-8 border-b-2 border-slate-100 pb-4 flex justify-between items-end">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">BOYUTSAL DERİN ANALİZ</h3>
              <span className="text-[9px] font-bold text-slate-400 uppercase">DETAYLI DÖKÜM</span>
            </div>

            {/* COMPACT MATRIX GRID (2 Columns, Dense) */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
              {report?.deepAnalysis && Object.entries(report.deepAnalysis).slice(0, 6).map(([key, val]: any, idx) => (
                  <div key={key} className="break-inside-avoid">
                    <div className="flex justify-between items-end mb-2 border-b border-slate-100 pb-1">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <span className={`text-sm font-black ${val.score > 75 ? 'text-emerald-600' : val.score < 50 ? 'text-rose-600' : 'text-orange-600'}`}>%{val.score}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-600 leading-snug text-justify">
                        {val.reasoning ? `"${val.reasoning.substring(0, 200)}..."` : 'Veri yok.'}
                    </p>
                  </div>
              ))}
            </div>
          </>
        )}

        {/* SWOT */}
        {sections.swotAnalysis && (
          <div className="grid grid-cols-2 gap-8 mb-12 h-[200px]">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 print:bg-white print:border-emerald-200">
                <h5 className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-4">GÜÇLÜ YÖNLER</h5>
                <ul className="space-y-2">
                  {report?.swot?.strengths?.slice(0, 4).map((s, i) => (
                      <li key={i} className="flex gap-2 text-[10px] font-bold text-emerald-700 leading-tight">
                        <span className="text-emerald-500">•</span> {s}
                      </li>
                  ))}
                </ul>
            </div>
            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 print:bg-white print:border-rose-200">
                <h5 className="text-[9px] font-black text-rose-800 uppercase tracking-widest mb-4">RİSK ALANLARI</h5>
                <ul className="space-y-2">
                  {report?.swot?.weaknesses?.slice(0, 4).map((w, i) => (
                      <li key={i} className="flex gap-2 text-[10px] font-bold text-rose-700 leading-tight">
                        <span className="text-rose-500">•</span> {w}
                      </li>
                  ))}
                </ul>
            </div>
          </div>
        )}

        {/* FUTURE PROJECTION */}
        {sections.futureProjection && (
          <div className="mb-16">
            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">24 AYLIK PROJEKSİYON</h5>
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center gap-6 print:bg-slate-800">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">EVRİM YOLU</p>
                  <p className="text-lg font-black italic leading-tight">"{report?.predictiveMetrics?.evolutionPath || 'Analiz Ediliyor...'}"</p>
                </div>
                <div className="text-right border-l border-white/20 pl-6">
                  <span className="block text-3xl font-black text-emerald-400">%{report?.predictiveMetrics?.retentionProbability}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">TUTUNMA İHTİMALİ</span>
                </div>
            </div>
          </div>
        )}

        {/* INTERVIEW GUIDE (Opsiyonel Ek Alan) */}
        {sections.interviewGuide && report?.interviewGuidance?.strategicQuestions && (
           <div className="mb-16">
              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">KRİTİK MÜLAKAT SORULARI</h5>
              <div className="space-y-2">
                 {report.interviewGuidance.strategicQuestions.slice(0, 3).map((q, i) => (
                    <div key={i} className="text-[10px] font-bold text-slate-700 italic border-l-2 border-orange-500 pl-3">
                       "{q}"
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* SIGNATURES */}
        {options.signatureRequired && (
          <div className="absolute bottom-16 left-0 w-full px-12 grid grid-cols-3 gap-12">
              {[
                { t: 'KLİNİK SÜPERVİZÖR', s: 'Onay' },
                { t: 'AKADEMİK DİREKTÖR', s: 'Onay' },
                { t: 'KURUCU TEMSİLCİSİ', s: 'Onay' }
              ].map((sig, i) => (
                <div key={i} className="text-center">
                    <div className="h-16 border-b border-slate-300 mb-2"></div>
                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">{sig.t}</p>
                    <p className="text-[7px] font-bold text-slate-400 uppercase">{sig.s}</p>
                </div>
              ))}
          </div>
        )}

        <div className="absolute bottom-6 left-0 w-full px-12 flex justify-between items-center text-[8px] font-bold text-slate-300 uppercase tracking-widest print:text-slate-500">
          <span>SAYFA 2/2</span>
          <span>BU BELGE YENİ GÜN AKADEMİ LİYAKAT PROTOKOLLERİNE GÖRE ÜRETİLMİŞTİR.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 items-center bg-slate-200/50 py-8 print:bg-white print:p-0 print:gap-0">
      <PageOne />
      <PageTwo />
    </div>
  );
};

export default CandidateReport;
