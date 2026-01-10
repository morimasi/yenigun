
import React, { Suspense, lazy, useState } from 'react';
import { AIReport, Candidate } from '../types';

const RadarChartComponent = lazy(() => import('recharts').then(mod => ({ default: mod.RadarChart })));
const RadarComponent = lazy(() => import('recharts').then(mod => ({ default: mod.Radar })));
const PolarGridComponent = lazy(() => import('recharts').then(mod => ({ default: mod.PolarGrid })));
const PolarAngleAxisComponent = lazy(() => import('recharts').then(mod => ({ default: mod.PolarAngleAxis })));
const PolarRadiusAxisComponent = lazy(() => import('recharts').then(mod => ({ default: mod.PolarRadiusAxis })));
const ResponsiveContainerComponent = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
}

const AnalysisBox: React.FC<{ title: string; data: any }> = ({ title, data }) => (
  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white transition-all duration-300 break-inside-avoid shadow-sm print:border-slate-200">
     <div className="flex justify-between items-start mb-4">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h5>
        <span className={`text-sm font-black ${data.score > 75 ? 'text-emerald-600' : data.score > 45 ? 'text-orange-600' : 'text-rose-600'}`}>
          %{data.score}
        </span>
     </div>
     <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-4">{data.comment}</p>
     <div className="flex flex-wrap gap-2">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[8px] font-black text-slate-500 uppercase print:border-slate-300">
            {p}
          </span>
        ))}
     </div>
  </div>
);

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate }) => {
  const [exportSettings, setExportSettings] = useState({
    includeSummary: true,
    includeMatrix: true,
    includeSwot: true,
    includeDetails: true,
    showSeal: true
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!report) return null;

  const handlePDFExport = async () => {
    setIsExporting(true);
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    
    const element = document.getElementById('report-export-area');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Sayfa yönetimi: Eğer içerik tek sayfayı çok aşıyorsa bölme mantığı (basit versiyon)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AKADEMI_RAPOR_${candidate.name.replace(/\s/g, '_').toUpperCase()}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* İleri Düzey Dışa Aktarma Paneli */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-orange-100 shadow-xl no-print flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-4 items-center">
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mr-2">Dışa Aktarma Ayarları:</h4>
          {[
            { key: 'includeSummary', label: 'Özet' },
            { key: 'includeMatrix', label: 'Matris' },
            { key: 'includeSwot', label: 'SWOT' },
            { key: 'includeDetails', label: 'Detaylar' },
            { key: 'showSeal', label: 'Resmi Mühür' }
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={(exportSettings as any)[opt.key]} 
                onChange={() => setExportSettings(prev => ({ ...prev, [opt.key]: !(prev as any)[opt.key] }))}
                className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-orange-600 transition-colors uppercase tracking-tighter">{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all text-slate-600"
          >
            Önizleme / Yazdır
          </button>
          <button 
            onClick={handlePDFExport}
            disabled={isExporting}
            className={`px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 ${isExporting ? 'opacity-50' : ''}`}
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16L7 11H10V4H14V11H17L12 16ZM5 18V20H19V18H5Z"/></svg>
            )}
            PDF OLARAK MÜHÜRLE
          </button>
        </div>
      </div>

      {/* Rapor Alanı */}
      <div id="report-export-area" className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-sm print:p-10 print:border-none print:shadow-none min-h-[297mm] relative overflow-hidden">
        
        {/* Arkaplan Filigranı (Sadece PDF'de Şık Görünür) */}
        {exportSettings.showSeal && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none rotate-12">
            <svg className="w-[600px] h-[600px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 5V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V5L12 2Z"/>
            </svg>
          </div>
        )}

        {/* Kurumsal Antet */}
        <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-12 mb-16 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl">YG</div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">YENİ GÜN AKADEMİ</p>
                <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-orange-600 pl-4">AKADEMİK LİYAKAT DENETLEME KURULU</p>
              </div>
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">{candidate.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-orange-600 font-black text-xs uppercase tracking-widest bg-orange-50 px-5 py-2 rounded-full border border-orange-100">{candidate.branch}</span>
              <span className="text-slate-300 font-bold text-[10px] uppercase">DÖKÜMAN KODU: {candidate.id.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
             <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl inline-block relative overflow-hidden group">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-500 mb-2">Genel Başarı Skoru</p>
                <p className="text-7xl font-black">%{report.score}</p>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
             </div>
             {exportSettings.showSeal && (
               <div className="mt-6 flex items-center gap-3">
                  <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-right">
                    YAPAY ZEKA <br/> ONAYLI BELGE
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* İcra Özeti Bölümü */}
        {exportSettings.includeSummary && (
          <section className="mb-16 break-inside-avoid animate-fade-in">
            <div className="p-14 bg-slate-900 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
               <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.6em] mb-10">Stratejik Değerlendirme Çıktısı</h3>
               <p className="text-2xl font-bold leading-snug italic opacity-95 relative z-10 tracking-tight">"{report.summary}"</p>
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703V14H12.017C14.2262 14 16.017 12.2091 16.017 10V7C16.017 5.89543 15.1216 5 14.017 5H10.017C8.91246 5 8.01703 5.89543 8.01703 7V10C8.01703 11.1046 8.91246 12 10.017 12H13.017V14H10.017C7.80789 14 6.01703 15.7909 6.01703 18V21H14.017Z"/></svg>
               </div>
            </div>
          </section>
        )}

        {/* Matris ve Karar Bölümü */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center mb-16 break-inside-avoid">
          {exportSettings.includeMatrix && (
            <div className="bg-slate-50 rounded-[4rem] p-12 border border-slate-100 relative group overflow-hidden">
               <div className="absolute top-10 left-12 z-10">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em] mb-1">Yetkinlik Matrisi</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">8-Boyutlu Klinik Profilleme</p>
               </div>
               <div className="h-[480px] relative z-0">
                <Suspense fallback={<div className="flex items-center justify-center h-full text-[10px] font-black text-slate-300 uppercase">Analiz Haritası Yükleniyor...</div>}>
                  <ResponsiveContainerComponent width="100%" height="100%">
                    <RadarChartComponent cx="50%" cy="50%" outerRadius="75%" data={report.competencies}>
                      <PolarGridComponent stroke="#cbd5e1" strokeWidth={1.5} />
                      <PolarAngleAxisComponent 
                        dataKey="name" 
                        tick={{ fill: '#475569', fontSize: 9, fontWeight: 900 }} 
                      />
                      <PolarRadiusAxisComponent angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <RadarComponent 
                        name="Aday" 
                        dataKey="value" 
                        stroke="#ea580c" 
                        strokeWidth={4}
                        fill="#ea580c" 
                        fillOpacity={0.4} 
                        dot={{ r: 5, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </RadarChartComponent>
                  </ResponsiveContainerComponent>
                </Suspense>
               </div>
            </div>
          )}
          
          <div className="space-y-12">
             <div className="space-y-6">
                <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-6 border-orange-600 pl-8">Akademik Karar Tavsiyesi</h4>
                <p className="text-xl font-bold text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-8">
                  {report.recommendation}
                </p>
             </div>
             
             {exportSettings.includeSwot && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="bg-emerald-50/50 p-10 rounded-[3rem] border border-emerald-100">
                     <h5 className="text-[10px] font-black text-emerald-800 uppercase mb-6 tracking-widest">Temel Güçlü Yanlar</h5>
                     <ul className="space-y-4">
                        {report.swot.strengths.slice(0,4).map((s,i) => (
                          <li key={i} className="text-[11px] font-bold text-emerald-700 flex items-start gap-3">
                             <span className="mt-1.5 w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span> {s}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="bg-rose-50/50 p-10 rounded-[3rem] border border-rose-100">
                     <h5 className="text-[10px] font-black text-rose-800 uppercase mb-6 tracking-widest">Kritik Risk Alanları</h5>
                     <ul className="space-y-4">
                        {report.swot.threats.slice(0,4).map((t,i) => (
                          <li key={i} className="text-[11px] font-bold text-rose-700 flex items-start gap-3">
                             <span className="mt-1.5 w-2 h-2 bg-rose-500 rounded-full shrink-0"></span> {t}
                          </li>
                        ))}
                     </ul>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Detaylı Analiz Bölümü */}
        {exportSettings.includeDetails && (
          <section className="space-y-12 mb-16 break-inside-avoid">
             <div className="flex items-center gap-6">
                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-6 border-orange-600 pl-8">Çok Boyutlu Yetkinlik Analizleri</h3>
                <div className="flex-1 h-px bg-slate-100"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnalysisBox title="Etik ve Sınırlar" data={report.detailedAnalysis.ethics} />
                <AnalysisBox title="Pedagojik Teknik" data={report.detailedAnalysis.pedagogy} />
                <AnalysisBox title="Klinik Muhakeme" data={report.detailedAnalysis.clinicalWisdom} />
                <AnalysisBox title="Duygusal Direnç" data={report.detailedAnalysis.emotionalResilience} />
                <AnalysisBox title="Kurumsal Uyum" data={report.detailedAnalysis.institutionalFit} />
                <AnalysisBox title="Kriz Refleksleri" data={report.detailedAnalysis.stressResponse} />
             </div>
          </section>
        )}

        {/* Sayfa Altı ve Mühür Bölümü */}
        <div className="mt-24 pt-12 border-t-2 border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 border-4 border-slate-50 rounded-full flex items-center justify-center grayscale opacity-40">
                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V5L12 2Z"/></svg>
              </div>
              <div className="leading-relaxed">
                ANALİZ TARİHİ: {new Date().toLocaleDateString('tr-TR')} <br/> 
                DOĞRULAMA KODU: {candidate.id.toUpperCase()}
              </div>
           </div>
           <div className="text-right space-y-2">
              <p className="text-slate-400 font-black">YENİ GÜN AKADEMİ AKADEMİK KURULU</p>
              <div className="flex justify-end gap-2">
                 <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                 <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                 <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
