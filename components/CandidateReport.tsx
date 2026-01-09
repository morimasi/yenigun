
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

const CandidateReport: React.FC<CandidateReportProps> = ({ report, algoReport, candidate, viewMode = 'hybrid' }) => {
  const showAI = (viewMode === 'ai' || viewMode === 'hybrid') && report;
  const showAlgo = (viewMode === 'algo' || viewMode === 'hybrid') && algoReport;

  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    
    const element = document.getElementById('strategic-report-content');
    if (!element) return;
    
    // Yüksek DPI kalitesi için 2x scale
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

    // İlk Sayfa
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Çoklu Sayfa Döngüsü (Eğer içerik bir sayfadan uzunsa)
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`YGA_Analiz_${candidate.name.replace(/\s/g, '_')}_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-end gap-3 no-print">
        <button onClick={() => window.print()} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all">Sistem Yazdır</button>
        <button onClick={exportPDF} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:-translate-y-1 transition-all">Resmi PDF İndir</button>
      </div>

      <div id="strategic-report-content" className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-sm print-container mx-auto max-w-[210mm]">
        {/* Belge Anteti */}
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-8 mb-12">
          <div className="space-y-1">
            <div className="bg-slate-900 text-white px-3 py-1 inline-block rounded text-[9px] font-black uppercase tracking-[0.3em]">RESMİ AKADEMİK ANALİZ RAPORU</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name}</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{candidate.branch} | ID: {candidate.id}</p>
          </div>
          <div className="text-right">
             <div className="w-16 h-16 bg-slate-900 rounded-xl mb-2 ml-auto flex items-center justify-center text-white font-black text-xl">YG</div>
             <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Düzenleme Tarihi</p>
             <p className="text-[10px] font-bold text-slate-900">{new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* Özet Skor Paneli */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {showAlgo && (
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">DÜRÜSTLÜK & TUTARLILIK</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter text-slate-900">%{algoReport.reliabilityIndex}</span>
                <span className={`text-[10px] font-bold uppercase ${algoReport.reliabilityIndex > 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {algoReport.reliabilityIndex > 70 ? 'Güvenilir' : 'Kritik Risk'}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Tespit Edilen Riskler:</p>
                 {algoReport.riskFlags.map((risk, i) => (
                    <p key={i} className="text-[10px] font-bold text-rose-700 leading-tight mb-1">• {risk}</p>
                 ))}
              </div>
            </div>
          )}
          
          {showAI && (
            <div className="p-8 rounded-[2rem] bg-orange-600 text-white shadow-lg overflow-hidden relative">
              <h4 className="text-[9px] font-black text-orange-200 uppercase tracking-widest mb-3">YAPAY ZEKA LİYAKAT PUANI</h4>
              <span className="text-7xl font-black tracking-tighter">%{report.score}</span>
              <p className="mt-4 text-[11px] font-bold uppercase italic opacity-90 leading-tight">{report.summary}</p>
              <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          )}
        </div>

        {/* Yetkinlik Grafiği */}
        {showAI && (
          <section className="mb-12 chart-container">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6 border-l-4 border-orange-600 pl-4">Metodolojik Yetkinlik Grafiği</h3>
            <div className="h-[350px] bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-[10px] font-black text-slate-300 uppercase">Veriler İşleniyor...</div>}>
                <ResponsiveContainerComponent width="100%" height="100%">
                  <RadarChartComponent cx="50%" cy="50%" outerRadius="75%" data={report.competencies}>
                    <PolarGridComponent stroke="#cbd5e1" />
                    <PolarAngleAxisComponent dataKey="name" tick={{ fill: '#475569', fontSize: 9, fontWeight: 800 }} />
                    <RadarComponent name="Aday" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} />
                  </RadarChartComponent>
                </ResponsiveContainerComponent>
              </Suspense>
            </div>
          </section>
        )}

        {/* SWOT Analizi */}
        {showAI && (
          <section className="grid grid-cols-2 gap-6 mb-12 page-break">
            <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 swot-card">
              <h5 className="text-[10px] font-black text-emerald-800 uppercase mb-4 tracking-widest">AVANTAJLAR / GÜÇLÜ YANLAR</h5>
              <ul className="space-y-3">{report.swot.strengths.map((s, i) => <li key={i} className="text-[11px] font-bold text-slate-700 leading-snug">• {s}</li>)}</ul>
            </div>
            <div className="p-8 bg-rose-50 rounded-[2rem] border border-rose-100 swot-card">
              <h5 className="text-[10px] font-black text-rose-800 uppercase mb-4 tracking-widest">RİSKLER / GELİŞİM ALANLARI</h5>
              <ul className="space-y-3">{report.swot.weaknesses.map((w, i) => <li key={i} className="text-[11px] font-bold text-slate-700 leading-snug">• {w}</li>)}</ul>
            </div>
          </section>
        )}

        {/* Nihai Tavsiye */}
        {showAI && (
          <section className="bg-slate-900 p-10 rounded-[3rem] text-white">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
               <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">Kurumsal Mülakat Stratejisi</h4>
            </div>
            <p className="text-xl font-bold italic text-slate-200 leading-relaxed border-l-2 border-slate-700 pl-6">
              "{report.recommendation}"
            </p>
          </section>
        )}

        {/* Mühür ve Onay Alanı */}
        <div className="mt-16 pt-12 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div>SİSTEM ONAYI: OTOMATİK</div>
           <div className="text-right">YENİ GÜN AKADEMİ ARŞİV MÜHRÜ</div>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
