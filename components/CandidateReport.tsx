
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarChartProps } from 'recharts';
import { AIReport, AlgorithmicReport, Candidate } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
    const element = document.getElementById('strategic-report-content');
    if (!element) return;
    
    // UI butonlarını gizle
    const buttons = element.querySelectorAll('.no-print');
    buttons.forEach(b => (b as HTMLElement).style.display = 'none');

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`YGA_Analiz_${candidate.name.replace(/\s/g, '_')}.pdf`);
    
    buttons.forEach(b => (b as HTMLElement).style.display = '');
  };

  if (!report && !algoReport) {
    return (
      <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[4rem]">
        <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">Analiz Verisi İşleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in" id="strategic-report-container">
      {/* Action Toolbar */}
      <div className="flex justify-end gap-4 no-print">
        <button 
          onClick={() => window.print()}
          className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-orange-200 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Yazdır
        </button>
        <button 
          onClick={exportPDF}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          PDF İndir
        </button>
      </div>

      <div id="strategic-report-content" className="bg-white rounded-[4rem] p-12 border border-slate-50 print-container">
        {/* Professional Report Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-slate-900 pb-10 mb-12 gap-6">
          <div className="space-y-2">
            <div className="bg-slate-900 text-white px-4 py-1 inline-block rounded-lg text-[10px] font-black uppercase tracking-[0.3em]">Yeni Gün Akademi - Stratejik Analiz</div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{candidate.name}</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{candidate.branch} • {candidate.experienceYears} Yıl Deneyim</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rapor Tarihi</p>
            <p className="text-lg font-black text-slate-900">{new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* Scoring Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {showAlgo && (
            <div className="p-10 rounded-[3rem] bg-slate-50 border-2 border-slate-100 relative overflow-hidden">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dürüstlük İndeksi</h4>
              <div className="flex items-baseline gap-2">
                 <span className={`text-6xl font-black tracking-tighter ${algoReport.reliabilityIndex < 70 ? 'text-rose-600' : 'text-slate-900'}`}>%{algoReport.reliabilityIndex}</span>
              </div>
              <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Veri Tutarlılığı ve Deterministik Güven Skoru</p>
            </div>
          )}
          
          {showAI && (
            <div className="p-10 rounded-[3rem] bg-orange-600 text-white md:col-span-2 shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-4">AI Karar Skoru</h4>
                <div className="flex justify-between items-center">
                  <div className="text-8xl font-black tracking-tighter">%{report.score}</div>
                  <div className="max-w-[200px] text-right">
                     <p className="text-xs font-black uppercase italic leading-tight">"{report.summary}"</p>
                  </div>
                </div>
               </div>
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          )}
        </div>

        {/* Depth Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
           {showAlgo && (
             <div className="space-y-8">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-slate-900 pl-4">Algoritmik Risk Tespiti</h3>
               <div className="space-y-4">
                 {algoReport.riskFlags.map((risk, i) => (
                   <div key={i} className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center shrink-0 font-black text-xs">!</div>
                      <p className="text-xs font-bold text-rose-900 leading-relaxed">{risk}</p>
                   </div>
                 ))}
                 {algoReport.riskFlags.length === 0 && (
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-center">
                       <p className="text-[10px] font-black text-emerald-800 uppercase">Kritik bir veri çelişkisi saptanmadı.</p>
                    </div>
                 )}
               </div>
             </div>
           )}

           {showAI && (
             <div className="space-y-8">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Yetkinlik Radar Analizi</h3>
                <div className="h-[300px] bg-slate-50 rounded-[3rem] p-8 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.competencies}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                      <Radar name="Aday" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} strokeWidth={3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
             </div>
           )}
        </div>

        {/* SWOT Matrix - Professional Export Look */}
        {showAI && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[
               { label: 'GÜÇLÜ YÖNLER', data: report.swot.strengths, color: 'emerald' },
               { label: 'ZAYIF YÖNLER', data: report.swot.weaknesses, color: 'rose' },
               { label: 'FIRSATLAR', data: report.swot.opportunities, color: 'blue' },
               { label: 'RİSKLER', data: report.swot.threats, color: 'orange' }
             ].map((item, i) => (
               <div key={i} className={`p-8 rounded-[2.5rem] bg-${item.color}-50 border-2 border-white shadow-sm`}>
                 <h5 className={`text-[9px] font-black text-${item.color}-700 uppercase tracking-widest mb-4`}>{item.label}</h5>
                 <ul className="space-y-3">
                    {item.data.map((point, idx) => (
                      <li key={idx} className="text-[10px] font-bold text-slate-800 leading-snug flex gap-2">
                         <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 bg-${item.color}-500`}></span>
                         {point}
                      </li>
                    ))}
                 </ul>
               </div>
             ))}
          </div>
        )}

        {/* Final Recommendation */}
        {showAI && (
          <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">Stratejik Karar ve Mülakat Tavsiyesi</h4>
            <p className="text-xl font-bold leading-relaxed italic text-slate-300">"{report.recommendation}"</p>
          </div>
        )}

        {/* Document Footer */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-center space-y-2 opacity-50">
           <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Bu rapor Yeni Gün Akademi Değerlendirme Sistemi tarafından otomatik oluşturulmuştur.</p>
           <p className="text-[8px] font-bold text-slate-300">ID: {candidate.id} • HASH: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
