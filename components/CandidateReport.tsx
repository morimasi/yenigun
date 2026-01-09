
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
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Yeni_Gun_Akademi_Analiz_${name.replace(/\s/g, '_')}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!report && !algoReport) {
    return (
      <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[5rem] animate-pulse">
        <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-xs">Analiz Verisi Mevcut Değil</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in" id="report-container">
      {/* Action Toolbar */}
      <div className="flex justify-end gap-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Yazdır
        </button>
        <button 
          onClick={exportPDF}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          PDF İndir
        </button>
      </div>

      <div id="report-content" className="space-y-12 p-2">
        {/* Header Comparison Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showAI && (
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-orange-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6">
                <span className="px-4 py-1.5 bg-orange-600 text-white text-[9px] font-black rounded-full tracking-widest uppercase">AI ENGINE v3.0</span>
              </div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Bilişsel Sentez & Özet</h4>
              <p className="text-slate-900 font-black text-2xl leading-tight italic">"{report.summary}"</p>
              
              <div className="mt-10 pt-10 border-t border-slate-50 grid grid-cols-2 gap-6">
                <div>
                   <div className="text-5xl font-black text-orange-600 tracking-tighter">%{report.score}</div>
                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">AI Uygunluk</div>
                </div>
                <div className="flex flex-col justify-end items-end">
                   <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Derin Analiz</div>
                </div>
              </div>
            </div>
          )}

          {showAlgo && (
            <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 p-6">
                <span className="px-4 py-1.5 bg-white/10 text-white text-[9px] font-black rounded-full tracking-widest uppercase">ALGO ENGINE v4.0</span>
              </div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Deterministik Metrikler</h4>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                    <div className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Dürüstlük/Tutarlılık</div>
                    <div className={`text-3xl font-black ${algoReport.reliabilityIndex < 70 ? 'text-rose-500' : 'text-emerald-400'}`}>%{algoReport.reliabilityIndex}</div>
                 </div>
                 <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                    <div className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Klinik Etik</div>
                    <div className="text-3xl font-black text-blue-400">%{algoReport.ethicsScore}</div>
                 </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/5 flex items-end justify-between">
                 <div>
                    <div className="text-5xl font-black text-white tracking-tighter">%{algoReport.overallScore}</div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Statik Puan</div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Risk Heatmap & Patterns */}
        {showAlgo && (
          <div className="bg-slate-50 p-12 rounded-[4.5rem] border border-slate-200">
             <div className="flex items-center gap-4 mb-10">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Karakter Isı Haritası</h4>
                <div className="h-px flex-1 bg-slate-200"></div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-6">
                   <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Kriz Yönetim Kapasitesi</p>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${algoReport.crisisManagementScore}%` }}></div>
                      </div>
                      <p className="text-right text-[10px] font-black text-slate-900 mt-2">%{algoReport.crisisManagementScore}</p>
                   </div>
                   <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Deneyim/Kıdem Ağırlığı</p>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${algoReport.experienceWeight}%` }}></div>
                      </div>
                      <p className="text-right text-[10px] font-black text-slate-900 mt-2">%{algoReport.experienceWeight}</p>
                   </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-l-4 border-rose-500 pl-4">Tespit Edilen Kritik Riskler</h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {algoReport.riskFlags.map((f, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 bg-rose-50 rounded-[2rem] border border-rose-100 animate-slide-right" style={{ animationDelay: `${i * 0.1}s` }}>
                           <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5 shrink-0"></div>
                           <p className="text-[11px] font-bold text-rose-900 leading-relaxed">{f}</p>
                        </div>
                      ))}
                      {algoReport.riskFlags.length === 0 && (
                        <div className="col-span-2 p-10 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center">
                           <p className="text-[11px] font-black text-emerald-800 uppercase">Sistem Temiz: Herhangi bir davranışsal risk saptanmadı.</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Visual Analytics - Competency Radar */}
        {showAI && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] shadow-xl border border-slate-100 h-[500px]">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10">Yetkinlik Uzayı (Radar)</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.competencies}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <Radar 
                      name="Aday Profili" 
                      dataKey="value" 
                      stroke="#ea580c" 
                      fill="#ea580c" 
                      fillOpacity={0.6} 
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
             
             <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white flex-1 border border-slate-800">
                   <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Stratejik Karar Notu</h4>
                   <p className="text-lg font-bold leading-relaxed text-slate-300 italic">"{report.recommendation}"</p>
                </div>
                <div className="bg-orange-600 p-10 rounded-[3.5rem] shadow-2xl text-white flex-1 relative overflow-hidden">
                   <h4 className="text-[9px] font-black text-orange-200 uppercase tracking-[0.3em] mb-4">Mülakat Kritik Sorusu</h4>
                   <p className="text-xl font-black leading-tight">"${report.swot.threats[0] || 'Genel etik yaklaşımı'}" konusundaki tutarsızlığı çapraz sorgu ile mülakatta derinleştirin.</p>
                   <div className="absolute -right-4 -bottom-4 opacity-10"><svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg></div>
                </div>
             </div>
          </div>
        )}

        {/* SWOT Matrix & Opportunities */}
        {showAI && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { title: 'S: GÜÇLÜ YÖNLER', data: report.swot.strengths, color: 'text-emerald-600', bg: 'bg-emerald-50' },
               { title: 'W: ZAYIF YÖNLER', data: report.swot.weaknesses, color: 'text-rose-600', bg: 'bg-rose-50' },
               { title: 'O: FIRSATLAR', data: report.swot.opportunities, color: 'text-blue-600', bg: 'bg-blue-50' },
               { title: 'T: RİSKLER', data: report.swot.threats, color: 'text-orange-600', bg: 'bg-orange-50' }
             ].map((item, i) => (
               <div key={item.title} className={`p-8 rounded-[3rem] ${item.bg} border-2 border-white shadow-sm animate-fade-in`} style={{ animationDelay: `${i * 0.15}s` }}>
                  <h5 className={`text-[9px] font-black uppercase tracking-widest mb-6 ${item.color}`}>{item.title}</h5>
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
