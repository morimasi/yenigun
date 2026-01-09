
import React, { Suspense, lazy } from 'react';
import { AIReport, AlgorithmicReport, Candidate } from '../types';

// Chunk size uyarısını önlemek için ağır grafik bileşenlerini dinamik yüklüyoruz
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
    // Dinamik yükleme: jsPDF ve html2canvas sadece tıklandığında yüklenir
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    
    const element = document.getElementById('strategic-report-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`YGA_Rapor_${candidate.name.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-end gap-4 no-print">
        <button onClick={() => window.print()} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase">Yazdır</button>
        <button onClick={exportPDF} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl">PDF İndir</button>
      </div>

      <div id="strategic-report-content" className="bg-white rounded-[4rem] p-12 border border-slate-50 print-container">
        {/* Header */}
        <div className="flex justify-between items-end border-b-4 border-slate-900 pb-10 mb-12">
          <div className="space-y-2">
            <div className="bg-slate-900 text-white px-4 py-1 inline-block rounded-lg text-[10px] font-black uppercase tracking-[0.3em]">Yeni Gün Akademi - Stratejik Analiz</div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{candidate.name}</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{candidate.branch} • {candidate.experienceYears} Yıl Deneyim</p>
          </div>
        </div>

        {/* Skor Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {showAlgo && (
            <div className="p-10 rounded-[3rem] bg-slate-50 border-2 border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dürüstlük İndeksi</h4>
              <span className="text-6xl font-black tracking-tighter">%{algoReport.reliabilityIndex}</span>
              <div className="mt-4 space-y-2">
                {algoReport.riskFlags.map((risk, i) => (
                  <p key={i} className="text-[10px] font-bold text-rose-600 uppercase leading-tight">• {risk}</p>
                ))}
              </div>
            </div>
          )}
          
          {showAI && (
            <div className="p-10 rounded-[3rem] bg-orange-600 text-white shadow-2xl overflow-hidden relative">
              <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-4">AI Liyakat Skoru</h4>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-8xl font-black tracking-tighter">%{report.score}</span>
                <p className="max-w-[150px] text-right text-xs font-black uppercase italic opacity-80">{report.summary}</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          )}
        </div>

        {/* Radar Grafik - Dinamik Yükleme ile */}
        {showAI && (
          <div className="mb-12">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] mb-8 border-l-4 border-orange-600 pl-4">Yetkinlik Haritası</h3>
            <div className="h-[400px] bg-slate-50 rounded-[3rem] p-10">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-xs font-black text-slate-300">GRAFİK YÜKLENİYOR...</div>}>
                <ResponsiveContainerComponent width="100%" height="100%">
                  {/* FIX: Corrected closing tag from RadarChartComponentComponent to RadarChartComponent */}
                  <RadarChartComponent cx="50%" cy="50%" outerRadius="80%" data={report.competencies}>
                    <PolarGridComponent stroke="#e2e8f0" />
                    <PolarAngleAxisComponent dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <RadarComponent name="Aday" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.6} />
                  </RadarChartComponent>
                </ResponsiveContainerComponent>
              </Suspense>
            </div>
          </div>
        )}

        {/* SWOT ve Tavsiye */}
        {showAI && (
          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-emerald-50 rounded-[2.5rem] border-2 border-white">
                <h5 className="text-[9px] font-black text-emerald-700 uppercase mb-4">GÜÇLÜ YÖNLER</h5>
                <ul className="space-y-2">{report.swot.strengths.map((s, i) => <li key={i} className="text-[10px] font-bold text-slate-800">• {s}</li>)}</ul>
              </div>
              <div className="p-8 bg-rose-50 rounded-[2.5rem] border-2 border-white">
                <h5 className="text-[9px] font-black text-rose-700 uppercase mb-4">ZAYIF YÖNLER</h5>
                <ul className="space-y-2">{report.swot.weaknesses.map((w, i) => <li key={i} className="text-[10px] font-bold text-slate-800">• {w}</li>)}</ul>
              </div>
            </div>
            <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
              <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">Mülakat Strateji Tavsiyesi</h4>
              <p className="text-xl font-bold italic text-slate-300 leading-relaxed">"{report.recommendation}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateReport;
