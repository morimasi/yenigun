
import React, { useMemo } from 'react';
import { AIReport, Candidate, ExportConfig } from '../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
  options: ExportConfig;
}

// A4 Standartları (mm)
const PAGE_STYLE = {
  width: '210mm',
  minHeight: '296mm',
  padding: '12mm', // Daha kompakt marj
  backgroundColor: 'white',
  position: 'relative' as const,
  overflow: 'hidden',
  pageBreakAfter: 'always' as const
};

// Yardımcı: Diziyi belirtilen boyutta parçalara böler
const chunkArray = (array: any[], size: number) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate, options }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  const { sections } = options;

  // --- VERİ HAZIRLIĞI ---
  const radarData = useMemo(() => {
    if (!report?.deepAnalysis) return [];
    return [
      { subject: 'ETİK', value: report.deepAnalysis.workEthics?.score || 0, fullMark: 100 },
      { subject: 'KLİNİK', value: report.deepAnalysis.technicalExpertise?.score || 0, fullMark: 100 },
      { subject: 'PEDAGOJİ', value: report.deepAnalysis.pedagogicalAnalysis?.score || 0, fullMark: 100 },
      { subject: 'DİRENÇ', value: report.deepAnalysis.sustainability?.score || 0, fullMark: 100 },
      { subject: 'UYUM', value: report.deepAnalysis.institutionalLoyalty?.score || 0, fullMark: 100 },
      { subject: 'GELİŞİM', value: report.deepAnalysis.developmentOpenness?.score || 0, fullMark: 100 },
    ];
  }, [report]);

  // Analiz maddelerini düzenli bir diziye çevir
  const analysisSegments = useMemo(() => {
    if (!report?.deepAnalysis) return [];
    return Object.entries(report.deepAnalysis).map(([key, val]: any) => ({
      key,
      title: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
      ...val
    }));
  }, [report]);

  // Analiz sayfalarını oluştur (Her sayfaya 3 analiz bloğu sığdırarak sıkışıklığı önle)
  const analysisPages = useMemo(() => chunkArray(analysisSegments, 3), [analysisSegments]);

  // Toplam sayfa sayısı hesabı (Kapak + Analiz Sayfaları + Sonuç Sayfası)
  // Basit bir hesap: 1 (Özet) + N (Analiz) + 1 (Sonuç)
  const totalPages = 1 + analysisPages.length + 1;

  // --- ALT BİLEŞENLER ---

  const Header = () => (
    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl">YG</div>
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">{options.title}</h1>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">AKADEMİK KURUL DEĞERLENDİRME RAPORU</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-900 uppercase">{candidate.name}</p>
        <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">{candidate.branch}</p>
        <p className="text-[8px] font-mono text-slate-400 mt-1">{candidate.id.substring(0,8).toUpperCase()} • {dateStr}</p>
      </div>
    </div>
  );

  const Footer = ({ pageNum }: { pageNum: number }) => (
    <div className="absolute bottom-6 left-0 w-full px-12 flex justify-between items-center border-t border-slate-100 pt-2">
      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">GİZLİ VE KİŞİSEL BELGE</span>
      <span className="text-[8px] font-black text-slate-900">SAYFA {pageNum} / {totalPages}</span>
    </div>
  );

  const Watermark = () => (
    options.showWatermark ? (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-45">
        <p className="text-9xl font-black text-slate-900 whitespace-nowrap">YENİ GÜN</p>
      </div>
    ) : null
  );

  // --- SAYFA 1: GENEL BAKIŞ (EXECUTIVE SUMMARY) ---
  const PageOverview = () => (
    <div className="pdf-page bg-white relative" style={PAGE_STYLE}>
      <Header />
      <Watermark />

      {/* ÜST BİLGİ KARTI */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 flex justify-between items-center">
         <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ADAY PROFİLİ</span>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mt-1">{candidate.name}</h2>
            <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-600 uppercase">
               <span>{candidate.university}</span>
               <span>•</span>
               <span>{candidate.department}</span>
               <span>•</span>
               <span>{candidate.experienceYears} Yıl Deneyim</span>
            </div>
         </div>
         <div className="text-right">
            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">GENEL LİYAKAT</span>
            <div className="flex items-end justify-end gap-2">
               <span className={`text-5xl font-black ${report?.score && report.score > 75 ? 'text-emerald-600' : 'text-slate-900'}`}>%{report?.score}</span>
            </div>
         </div>
      </div>

      {/* YÖNETİCİ ÖZETİ (TAM METİN) */}
      <div className="mb-8">
         <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">YÖNETİCİ ÖZETİ</h3>
         <p className="text-[11px] font-medium text-slate-700 leading-relaxed text-justify indent-4">
            {report?.summary}
         </p>
      </div>

      {/* METRİKLER VE RADAR */}
      <div className="grid grid-cols-2 gap-8 mb-8 h-[280px]">
         {/* Radar */}
         <div className="bg-white border border-slate-100 rounded-2xl relative">
            <span className="absolute top-3 left-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">YETKİNLİK AĞI</span>
            <ResponsiveContainer width="100%" height="100%">
               <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 800, fill: '#64748b' }} />
                  <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} strokeWidth={2} />
               </RadarChart>
            </ResponsiveContainer>
         </div>

         {/* KPIs */}
         <div className="flex flex-col gap-4 justify-center">
            <div className="bg-slate-900 p-5 rounded-2xl text-white">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DÜRÜSTLÜK ENDEKSİ</span>
                  <span className="text-2xl font-black">%{report?.integrityIndex}</span>
               </div>
               <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${report?.integrityIndex}%` }}></div></div>
               <p className="text-[8px] text-slate-400 mt-2 leading-tight opacity-80">
                  CV verileri ile mülakat yanıtları arasındaki tutarlılık oranı.
               </p>
            </div>
            
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SOSYAL MASKELEME</span>
                  <span className="text-2xl font-black text-slate-800">%{report?.socialMaskingScore}</span>
               </div>
               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${report?.socialMaskingScore}%` }}></div></div>
               <p className="text-[8px] text-slate-400 mt-2 leading-tight">
                  Adayın sosyal kabul görmek için verdiği "politik" cevap oranı.
               </p>
            </div>
         </div>
      </div>

      {/* KARAKTER PORTRESİ (TAM METİN) */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">DERİN KARAKTER PORTRESİ</h3>
         <p className="text-[10px] font-medium text-slate-600 leading-relaxed text-justify italic">
            "{report?.detailedAnalysisNarrative}"
         </p>
      </div>

      <Footer pageNum={1} />
    </div>
  );

  // --- SAYFA 2..N: DERİN ANALİZ (DYNAMIC PAGES) ---
  const AnalysisPages = () => (
    <>
      {analysisPages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="pdf-page bg-white relative" style={PAGE_STYLE}>
          <Header />
          <Watermark />
          
          <div className="mb-6 flex items-center gap-3">
             <div className="w-8 h-1 bg-slate-900"></div>
             <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">DERİNLEMESİNE ANALİZ & GEREKÇELENDİRME</h3>
          </div>

          <div className="space-y-6">
             {pageItems.map((item: any, idx: number) => (
                <div key={idx} className="border border-slate-200 rounded-2xl p-5 break-inside-avoid shadow-sm bg-white">
                   {/* Başlık Satırı */}
                   <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${item.score > 75 ? 'bg-emerald-500' : item.score < 50 ? 'bg-rose-500' : 'bg-orange-500'}`}></div>
                         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</span>
                         <span className="text-lg font-black text-slate-900">%{item.score}</span>
                      </div>
                   </div>

                   {/* Tam Metin Analiz */}
                   <div className="mb-4">
                      <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1">KLİNİK NEDENSELLİK (REASONING)</span>
                      <p className="text-[10px] font-medium text-slate-700 leading-relaxed text-justify">
                         {item.reasoning}
                      </p>
                   </div>

                   {/* Alt Detaylar (Grid) */}
                   <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl">
                      <div>
                         <span className="text-[8px] font-bold text-orange-600 uppercase block mb-1">GİZLİ KLİNİK NÜANS</span>
                         <p className="text-[9px] font-medium text-slate-600 leading-snug text-justify">
                            {item.clinicalNuances}
                         </p>
                      </div>
                      <div>
                         <span className="text-[8px] font-bold text-blue-600 uppercase block mb-1">KURUMSAL ETKİ</span>
                         <p className="text-[9px] font-medium text-slate-600 leading-snug text-justify">
                            {item.teamImpact}
                         </p>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          <Footer pageNum={2 + pageIndex} />
        </div>
      ))}
    </>
  );

  // --- SAYFA SON: GELECEK & STRATEJİ ---
  const PageConclusion = () => (
    <div className="pdf-page bg-white relative" style={PAGE_STYLE}>
      <Header />
      <Watermark />

      {/* SWOT ANALİZİ */}
      {sections.swotAnalysis && (
         <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
               <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span> GÜÇLÜ YÖNLER
               </h5>
               <ul className="space-y-2">
                  {report?.swot?.strengths?.map((s, i) => (
                     <li key={i} className="text-[9px] font-bold text-emerald-700 leading-tight">• {s}</li>
                  ))}
               </ul>
            </div>
            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
               <h5 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full"></span> RİSK ALANLARI
               </h5>
               <ul className="space-y-2">
                  {report?.swot?.weaknesses?.map((w, i) => (
                     <li key={i} className="text-[9px] font-bold text-rose-700 leading-tight">• {w}</li>
                  ))}
               </ul>
            </div>
         </div>
      )}

      {/* 24 AYLIK PROJEKSİYON */}
      {sections.futureProjection && (
         <div className="bg-slate-900 text-white p-8 rounded-3xl mb-8 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-3 gap-8">
               <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">TUTUNMA İHTİMALİ</span>
                  <span className="text-4xl font-black text-emerald-400">%{report?.predictiveMetrics?.retentionProbability}</span>
               </div>
               <div className="col-span-2">
                  <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block mb-1">KARİYER EVRİM YOLU</span>
                  <p className="text-[11px] font-bold text-white leading-relaxed italic">
                     "{report?.predictiveMetrics?.evolutionPath}"
                  </p>
               </div>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
         </div>
      )}

      {/* MÜLAKAT REHBERİ */}
      {sections.interviewGuide && (
         <div className="mb-8">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">STRATEJİK SORGULAMA KILAVUZU</h5>
            <div className="space-y-3">
               {report?.interviewGuidance?.strategicQuestions?.slice(0, 4).map((q, i) => (
                  <div key={i} className="flex gap-3 items-start">
                     <span className="w-5 h-5 bg-slate-100 text-slate-600 rounded flex items-center justify-center text-[9px] font-black shrink-0">{i+1}</span>
                     <p className="text-[10px] font-bold text-slate-700 italic leading-snug">"{q}"</p>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* İMZALAR */}
      {options.signatureRequired && (
         <div className="absolute bottom-20 left-0 w-full px-12 grid grid-cols-3 gap-8">
            {[
               { t: 'KLİNİK SÜPERVİZÖR', s: 'Uygundur / Uygun Değildir' },
               { t: 'AKADEMİK DİREKTÖR', s: 'Onay' },
               { t: 'KURUCU TEMSİLCİSİ', s: 'Onay' }
            ].map((sig, i) => (
               <div key={i} className="text-center">
                  <div className="h-12 border-b border-slate-300 mb-2"></div>
                  <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">{sig.t}</p>
                  <p className="text-[7px] font-bold text-slate-400 uppercase">{sig.s}</p>
               </div>
            ))}
         </div>
      )}

      <Footer pageNum={totalPages} />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 items-center bg-slate-200/50 py-8 print:bg-white print:p-0 print:gap-0">
      <PageOverview />
      <AnalysisPages />
      <PageConclusion />
    </div>
  );
};

export default CandidateReport;
