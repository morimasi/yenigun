
import React, { Suspense, lazy } from 'react';
import { AIReport, AlgorithmicReport, Candidate } from '../types';

const RadarChartComponent = lazy(() => import('recharts').then(mod => ({ default: mod.RadarChart })));
const RadarComponent = lazy(() => import('recharts').then(mod => ({ default: mod.Radar })));
const PolarGridComponent = lazy(() => import('recharts').then(mod => ({ default: mod.PolarGrid })));
const PolarAngleAxisComponent = lazy(() => import('recharts').then(mod => ({ default: mod.PolarAngleAxis })));
const ResponsiveContainerComponent = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));

interface CandidateReportProps {
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  candidate: Candidate;
  viewMode?: 'ai' | 'algo' | 'hybrid';
}

// Fix: Moved AnalysisBox outside CandidateReport and added React.FC type to fix the 'key' prop assignment error
const AnalysisBox: React.FC<{ title: string; data: any; icon?: string }> = ({ title, data, icon }) => (
  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group overflow-hidden relative">
     <div className="flex justify-between items-start mb-4">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h5>
        <span className={`text-lg font-black ${data.score > 75 ? 'text-emerald-600' : data.score > 45 ? 'text-orange-600' : 'text-rose-600'}`}>
          %{data.score}
        </span>
     </div>
     <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-4">{data.comment}</p>
     <div className="flex flex-wrap gap-2">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[8px] font-black text-slate-500 uppercase">
            {p}
          </span>
        ))}
     </div>
     <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-200/20 rounded-full blur-xl group-hover:bg-orange-200/20 transition-all"></div>
  </div>
);

const CandidateReport: React.FC<CandidateReportProps> = ({ report, algoReport, candidate, viewMode = 'hybrid' }) => {
  const showAI = (viewMode === 'ai' || viewMode === 'hybrid') && report;
  const showAlgo = (viewMode === 'algo' || viewMode === 'hybrid') && algoReport;

  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    
    const element = document.getElementById('strategic-report-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true, 
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`YGA_STRATEJIK_RAPOR_${candidate.name.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-end gap-3 no-print">
        <button onClick={() => window.print()} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all">Sistem Yazdır</button>
        <button onClick={exportPDF} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:-translate-y-1 transition-all">Resmi PDF İndir</button>
      </div>

      <div id="strategic-report-content" className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-sm print-container mx-auto max-w-[210mm] min-h-[297mm]">
        {/* Antet ve Başlık */}
        <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">YG</div>
              <div className="bg-slate-900 text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-[0.3em]">STRATEJİK AKADEMİK ANALİZ v10.0</div>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mt-4">{candidate.name}</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{candidate.branch} • LİYAKAT DENETİMİ</p>
          </div>
          <div className="text-right flex flex-col items-end">
             <div className="bg-orange-600 text-white p-6 rounded-[2rem] shadow-xl mb-4">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Genel Uygunluk</p>
                <p className="text-5xl font-black">%{report?.score || '?'}</p>
             </div>
             <p className="text-[10px] font-bold text-slate-900 uppercase">{new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* İcra Özeti (Executive Summary) */}
        <section className="mb-12">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em] mb-6 border-l-4 border-orange-600 pl-4">Yönetici İcra Özeti</h3>
          <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden">
             <p className="text-lg font-bold leading-relaxed italic relative z-10">"{report?.summary}"</p>
             <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Yetkinlik Radar Grafiği */}
        {showAI && (
          <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center page-break">
            <div className="h-[380px] bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">8-Boyutlu Yetkinlik Haritası</h4>
              <Suspense fallback={<div className="flex items-center justify-center h-full text-[10px] font-black text-slate-300 uppercase">Motor Çalışıyor...</div>}>
                <ResponsiveContainerComponent width="100%" height="100%">
                  <RadarChartComponent cx="50%" cy="50%" outerRadius="75%" data={report.competencies}>
                    <PolarGridComponent stroke="#cbd5e1" />
                    <PolarAngleAxisComponent dataKey="name" tick={{ fill: '#475569', fontSize: 8, fontWeight: 900 }} />
                    <RadarComponent name="Aday" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.6} />
                  </RadarChartComponent>
                </ResponsiveContainerComponent>
              </Suspense>
            </div>
            <div className="space-y-6">
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Stratejik Tavsiye</h4>
               <p className="text-sm font-bold text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-6 italic">
                 {report.recommendation}
               </p>
               <div className="flex flex-wrap gap-2 pt-4">
                  {report.swot.strengths.slice(0, 3).map((s, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-emerald-100">+{s}</span>
                  ))}
               </div>
            </div>
          </section>
        )}

        {/* Detaylı Analiz Bento Grid */}
        <section className="space-y-6 page-break">
           <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em] mb-6 border-l-4 border-orange-600 pl-4">Kapsamlı Psikolojik ve Profesyonel Analiz</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report?.detailedAnalysis && Object.entries(report.detailedAnalysis).map(([key, data]: [string, any]) => {
                const titles: any = {
                  ethics: "Etik Değerler & Sınırlar",
                  educational: "Eğitsel Derinlik & Metod",
                  history: "Mesleki Geçmiş & İvme",
                  emotional: "Duygu Durumu & EQ",
                  academic: "Akademik Donanım",
                  personality: "Kişilik & Mizaç",
                  stressManagement: "Stres & Kriz Yönetimi",
                  institutionalFit: "Kurumsal İşleyiş & Uyum"
                };
                return <AnalysisBox key={key} title={titles[key] || key} data={data} />;
              })}
           </div>
        </section>

        {/* SWOT ve Riskler */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 page-break">
           <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100">
              <h5 className="text-[10px] font-black text-rose-800 uppercase mb-6 tracking-[0.2em]">Kritik Riskler ve Tehditler</h5>
              <ul className="space-y-4">
                 {report?.swot.threats.map((t, i) => (
                   <li key={i} className="flex gap-4 items-start">
                      <span className="w-5 h-5 bg-rose-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">!</span>
                      <p className="text-[11px] font-bold text-slate-700 leading-snug">{t}</p>
                   </li>
                 ))}
              </ul>
           </div>
           <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100">
              <h5 className="text-[10px] font-black text-emerald-800 uppercase mb-6 tracking-[0.2em]">Gelişim Fırsatları</h5>
              <ul className="space-y-4">
                 {report?.swot.opportunities.map((o, i) => (
                   <li key={i} className="flex gap-4 items-start">
                      <span className="w-5 h-5 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      <p className="text-[11px] font-bold text-slate-700 leading-snug">{o}</p>
                   </li>
                 ))}
              </ul>
           </div>
        </section>

        {/* Mühür */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
           <div>SİSTEM DOĞRULAMA KODU: {candidate.id.toUpperCase()}</div>
           <div className="text-right">YENİ GÜN AKADEMİ DİJİTAL ARŞİV MÜHRÜ</div>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
