
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarChartProps } from 'recharts';
import { AIReport, AlgorithmicReport } from '../types';

interface CandidateReportProps {
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  name: string;
  viewMode?: 'ai' | 'algo' | 'hybrid';
}

const CandidateReport: React.FC<CandidateReportProps> = ({ report, algoReport, name, viewMode = 'hybrid' }) => {
  const [showScheduler, setShowScheduler] = useState(false);
  
  const showAI = (viewMode === 'ai' || viewMode === 'hybrid') && report;
  const showAlgo = (viewMode === 'algo' || viewMode === 'hybrid') && algoReport;

  if (!report && !algoReport) {
    return (
      <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[5rem] animate-pulse">
        <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-xs">Analiz Verisi Mevcut Değil</p>
        <p className="text-slate-200 font-bold text-[10px] mt-4 uppercase">"Motorları Tetikle" butonunu kullanarak analizi başlatabilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-10" id="report-container">
      
      {/* Header Comparison Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {showAI && (
          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-orange-100 relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 p-6">
              <span className="px-4 py-1.5 bg-orange-600 text-white text-[9px] font-black rounded-full tracking-widest uppercase shadow-lg">GEMINI 3 FLASH ENGINE</span>
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Bilişsel/Multimodal Özet</h4>
            <div className="min-h-[100px] flex flex-col justify-center">
              <p className="text-slate-900 font-black text-2xl leading-[1.15] tracking-tight italic">"{report.summary}"</p>
            </div>
            <div className="mt-10 pt-10 border-t border-slate-50 flex items-end justify-between">
               <div>
                  <div className="text-6xl font-black text-orange-600 tracking-tighter">%{report.score}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase leading-none mt-2 tracking-widest">Global Yetkinlik</div>
               </div>
               <div className="bg-orange-50 px-4 py-2 rounded-xl text-orange-700 font-black text-[10px] uppercase">GÜVENİLİR ANALİZ</div>
            </div>
          </div>
        )}

        {showAlgo && (
          <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group border border-slate-800">
            <div className="absolute top-0 right-0 p-6">
              <span className="px-4 py-1.5 bg-white/10 text-white text-[9px] font-black rounded-full tracking-widest uppercase">DETERMİNİSTİK MOTOR</span>
            </div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Veri & Mantık Matrisi</h4>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-5 rounded-3xl border border-white/5 group-hover:border-white/20 transition-all">
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Yanıt Tutarlılığı</div>
                  <div className={`text-3xl font-black ${algoReport.reliabilityIndex < 70 ? 'text-rose-500' : 'text-emerald-400'}`}>
                    %{algoReport.reliabilityIndex}
                  </div>
               </div>
               <div className="bg-white/5 p-5 rounded-3xl border border-white/5 group-hover:border-white/20 transition-all">
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Klinik Etik Skoru</div>
                  <div className="text-3xl font-black text-blue-400">%{algoReport.ethicsScore}</div>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/5 flex items-end justify-between">
               <div>
                  <div className="text-6xl font-black text-white tracking-tighter">%{algoReport.overallScore}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase leading-none mt-2 tracking-widest">Matematiksel Puan</div>
               </div>
               <div className="bg-white/10 px-4 py-2 rounded-xl text-white font-black text-[10px] uppercase">KURAL TABANLI</div>
            </div>
          </div>
        )}
      </div>

      {/* Pattern Recognition & Risk Management */}
      {showAlgo && (
        <div className="bg-slate-50 p-12 rounded-[4.5rem] border border-slate-200 shadow-inner">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">Sistematik Karakter Analizi</h4>
              <div className="h-0.5 flex-1 bg-slate-200 mx-10 hidden md:block"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Belirgin Pozitif Örüntüler</h5>
                 <div className="flex flex-wrap gap-3">
                    {algoReport.detectedPatterns.map(p => (
                      <span key={p} className="px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 shadow-sm hover:border-emerald-200 transition-all">{p}</span>
                    ))}
                    {algoReport.detectedPatterns.length === 0 && <span className="text-slate-400 italic text-sm">Özel bir örüntü saptanmadı.</span>}
                 </div>
              </div>
              
              <div className="space-y-6">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-rose-500 pl-4">Kritik Risk Uyarıları</h5>
                 <div className="space-y-3">
                    {algoReport.riskFlags.map(f => (
                      <div key={f} className="flex items-center gap-4 text-[12px] font-bold text-rose-700 bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm animate-pulse-slow">
                         <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                         {f}
                      </div>
                    ))}
                    {algoReport.riskFlags.length === 0 && (
                      <div className="flex items-center gap-4 text-[12px] font-bold text-emerald-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                         <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                         Sistem Güvenli: Herhangi bir davranışsal risk bayrağı tespit edilmedi.
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
           <div className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] shadow-xl border border-slate-100 h-[500px] group">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10">Gemini 3 Flash: Yetkinlik Radarı</h4>
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
           
           <div className="lg:col-span-5 flex flex-col gap-10">
              <div className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl text-white flex-1 flex flex-col justify-center border border-slate-800">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Stratejik Öneri</h4>
                 <p className="text-xl font-bold leading-relaxed text-slate-300">"{report.recommendation}"</p>
              </div>
              <div className="bg-orange-600 p-10 rounded-[4rem] shadow-2xl text-white flex-1 flex flex-col justify-center">
                 <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-[0.3em] mb-6">Mülakat Fokus Noktası</h4>
                 <p className="text-xl font-black leading-tight">Adayın "${report.swot.weaknesses[0]}" alanındaki dürüstlük ve çözümleme kapasitesini test edin.</p>
              </div>
           </div>
        </div>
      )}

      {/* SWOT Matrix */}
      {showAI && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { title: 'Güçlü Yönler', data: report.swot.strengths, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { title: 'Zayıf Yönler', data: report.swot.weaknesses, color: 'text-rose-600', bg: 'bg-rose-50' },
             { title: 'Fırsatlar', data: report.swot.opportunities, color: 'text-blue-600', bg: 'bg-blue-50' },
             { title: 'Riskler', data: report.swot.threats, color: 'text-orange-600', bg: 'bg-orange-50' }
           ].map(item => (
             <div key={item.title} className={`p-8 rounded-[3rem] ${item.bg} border-2 border-white shadow-sm hover:shadow-md transition-all`}>
                <h5 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${item.color}`}>{item.title}</h5>
                <ul className="space-y-4">
                   {item.data.slice(0, 3).map((point, idx) => (
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
  );
};

export default CandidateReport;
