
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarChartProps } from 'recharts';
import { AIReport, AlgorithmicReport } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CandidateReportProps {
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  name: string;
  viewMode?: 'ai' | 'algo' | 'hybrid';
}

const CandidateReport: React.FC<CandidateReportProps> = ({ report, algoReport, name, viewMode = 'hybrid' }) => {
  
  const showAI = (viewMode === 'ai' || viewMode === 'hybrid') && report;
  const showAlgo = (viewMode === 'algo' || viewMode === 'hybrid') && algoReport;

  const exportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Yeni_Gun_Akademi_Analiz_${name.replace(/\s/g, '_')}.pdf`);
  };

  if (!report && !algoReport) {
    return (
      <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[5rem] animate-pulse">
        <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-xs">Veri İşleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in" id="report-container">
      {/* Action Toolbar */}
      <div className="flex justify-end gap-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          SAYFAYI YAZDIR
        </button>
        <button 
          onClick={exportPDF}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          PDF ANALİZ RAPORU İNDİR
        </button>
      </div>

      <div id="report-content" className="space-y-12 bg-white">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Reliability Score Card */}
          {showAlgo && (
            <div className={`p-10 rounded-[3.5rem] border-4 shadow-2xl relative overflow-hidden transition-all ${
              algoReport.reliabilityIndex < 70 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
            }`}>
              <div className="relative z-10">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${
                  algoReport.reliabilityIndex < 70 ? 'text-rose-600' : 'text-emerald-600'
                }`}>Dürüstlük İndeksi</h4>
                <div className="flex items-end gap-3">
                  <span className={`text-6xl font-black tracking-tighter ${
                    algoReport.reliabilityIndex < 70 ? 'text-rose-900' : 'text-emerald-900'
                  }`}>%{algoReport.reliabilityIndex}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-3">CV Tutarlılığı</span>
                </div>
                <p className="mt-6 text-xs font-bold text-slate-500 leading-relaxed italic">
                  {algoReport.reliabilityIndex < 70 
                    ? "Adayın beyanları arasında mantıksal boşluklar tespit edildi. (Bkz: Risk Flags)" 
                    : "Adayın deneyim ve eğitim beyanları istatistiksel olarak tutarlı."}
                </p>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-5">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
              </div>
            </div>
          )}

          {/* AI Score Card */}
          {showAI && (
            <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white md:col-span-2 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full">
                <div className="max-w-md">
                  <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Gemini 3.0 Hibrid Karar</h4>
                  <p className="text-2xl font-black tracking-tighter leading-tight mb-4 italic">"{report.summary}"</p>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{report.recommendation}</p>
                </div>
                <div className="mt-8 md:mt-0 text-right">
                  <div className="text-8xl font-black text-orange-600 tracking-tighter leading-none animate-scale-in">%{report.score}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Genel Uygunluk</p>
                </div>
              </div>
              <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-orange-600 to-transparent opacity-50"></div>
            </div>
          )}
        </div>

        {/* Risk & Patterns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {showAlgo && (
            <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <span className="w-2 h-6 bg-rose-600 rounded-full"></span>
                Algoritmik Risk Denetimi
              </h4>
              <div className="space-y-4">
                {algoReport.riskFlags.map((risk, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-rose-50 shadow-sm animate-slide-right" style={{ animationDelay: `${i*0.1}s` }}>
                    <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">{risk}</p>
                  </div>
                ))}
                {algoReport.riskFlags.length === 0 && (
                  <div className="p-10 text-center border-2 border-dashed border-emerald-100 rounded-[2rem] bg-emerald-50/30">
                    <p className="text-emerald-700 font-black text-[10px] uppercase tracking-widest">Herhangi bir deterministik risk saptanmadı.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {showAI && (
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
                Yetkinlik Uzayı Analizi
              </h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.competencies}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <Radar 
                      name="Aday" 
                      dataKey="value" 
                      stroke="#ea580c" 
                      fill="#ea580c" 
                      fillOpacity={0.6} 
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* SWOT Matrix */}
        {showAI && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Güçlü Yönler', data: report.swot.strengths, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Zayıf Yönler', data: report.swot.weaknesses, color: 'text-rose-600', bg: 'bg-rose-50' },
              { title: 'Fırsatlar', data: report.swot.opportunities, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Tehditler', data: report.swot.threats, color: 'text-orange-600', bg: 'bg-orange-50' }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] ${item.bg} border-2 border-white shadow-sm`}>
                <h5 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${item.color}`}>{item.title}</h5>
                <ul className="space-y-4">
                  {item.data.map((point, idx) => (
                    <li key={idx} className="text-[11px] font-bold text-slate-800 leading-snug flex gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.color.replace('text', 'bg')}`}></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateReport;
