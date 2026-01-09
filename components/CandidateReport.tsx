
import React, { Suspense, lazy } from 'react';
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
  if (!report) return null;

  const handlePDFExport = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    
    const element = document.getElementById('report-export-area');
    if (!element) return;
    
    // Yüksek kaliteli render için ayarlar
    const canvas = await html2canvas(element, {
      scale: 3, // 300 DPI kalitesi
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`AKADEMI_RAPOR_${candidate.name.replace(/\s/g, '_').toUpperCase()}.pdf`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Kontrol Paneli (Sadece Ekranda) */}
      <div className="flex justify-end gap-3 no-print mb-6">
        <button 
          onClick={() => window.print()}
          className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all text-slate-600"
        >
          Sistem Yazdır
        </button>
        <button 
          onClick={handlePDFExport}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16L7 11H10V4H14V11H17L12 16ZM5 18V20H19V18H5Z"/></svg>
          Mühürlü PDF Üret
        </button>
      </div>

      {/* Rapor Alanı */}
      <div id="report-export-area" className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-sm print:p-10 print:border-none print:shadow-none min-h-[297mm]">
        {/* Antet */}
        <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-12 mb-16 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl">YG</div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">YENİ GÜN ÖZEL EĞİTİM</p>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-2 border-orange-600 pl-3">AKADEMİK KURUL BAŞKANLIĞI</p>
              </div>
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">{candidate.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-orange-600 font-black text-xs uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full">{candidate.branch}</span>
              <span className="text-slate-300 font-bold text-[10px] uppercase">ANALİZ REF: {candidate.id.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-right">
             <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl inline-block relative overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2">Liyakat Skoru</p>
                <p className="text-6xl font-black">%{report.score}</p>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-600/10 rounded-full blur-2xl"></div>
             </div>
          </div>
        </div>

        {/* İcra Özeti */}
        <section className="mb-16 break-inside-avoid">
          <div className="p-12 bg-slate-900 rounded-[3.5rem] text-white relative overflow-hidden">
             <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em] mb-8">Stratejik Değerlendirme Özeti</h3>
             <p className="text-xl font-bold leading-relaxed italic opacity-95 relative z-10">"{report.summary}"</p>
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703V14H12.017C14.2262 14 16.017 12.2091 16.017 10V7C16.017 5.89543 15.1216 5 14.017 5H10.017C8.91246 5 8.01703 5.89543 8.01703 7V10C8.01703 11.1046 8.91246 12 10.017 12H13.017V14H10.017C7.80789 14 6.01703 15.7909 6.01703 18V21H14.017Z"/></svg>
             </div>
          </div>
        </section>

        {/* 8-Boyutlu Harita ve Karar */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center mb-16 break-inside-avoid">
          <div className="bg-slate-50 rounded-[4rem] p-10 border border-slate-100 relative group overflow-hidden">
             <div className="absolute top-8 left-10 z-10">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Yetkinlik Matrisi</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase">8-Boyutlu Klinik Haritalama</p>
             </div>
             <div className="h-[450px] relative z-0">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-[10px] font-black text-slate-300 uppercase">Veri İşleniyor...</div>}>
                <ResponsiveContainerComponent width="100%" height="100%">
                  <RadarChartComponent cx="50%" cy="50%" outerRadius="75%" data={report.competencies}>
                    <PolarGridComponent stroke="#cbd5e1" strokeWidth={1} />
                    <PolarAngleAxisComponent 
                      dataKey="name" 
                      tick={{ fill: '#475569', fontSize: 8, fontWeight: 900 }} 
                    />
                    <PolarRadiusAxisComponent angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <RadarComponent 
                      name="Aday" 
                      dataKey="value" 
                      stroke="#ea580c" 
                      strokeWidth={3}
                      fill="#ea580c" 
                      fillOpacity={0.4} 
                      dot={{ r: 4, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </RadarChartComponent>
                </ResponsiveContainerComponent>
              </Suspense>
             </div>
          </div>
          
          <div className="space-y-10">
             <div className="space-y-4">
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-6">Mülakat ve Karar Tavsiyesi</h4>
                <p className="text-base font-bold text-slate-600 leading-relaxed italic pl-6">
                  {report.recommendation}
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100">
                   <h5 className="text-[9px] font-black text-emerald-800 uppercase mb-4 tracking-widest">Avantajlar</h5>
                   <ul className="space-y-3">
                      {report.swot.strengths.slice(0,3).map((s,i) => (
                        <li key={i} className="text-[10px] font-bold text-emerald-700 flex items-start gap-2">
                           <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span> {s}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100">
                   <h5 className="text-[9px] font-black text-rose-800 uppercase mb-4 tracking-widest">Risk Faktörleri</h5>
                   <ul className="space-y-3">
                      {report.swot.threats.slice(0,3).map((t,i) => (
                        <li key={i} className="text-[10px] font-bold text-rose-700 flex items-start gap-2">
                           <span className="mt-1 w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span> {t}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Detaylı Analiz Bento Grid */}
        <section className="space-y-10 mb-16">
           <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-6">Kapsamlı Karakter ve Metodoloji Analizi</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnalysisBox title="Etik Değerler & Profesyonellik" data={report.detailedAnalysis.ethics} />
              <AnalysisBox title="Pedagojik Derinlik & Teknik" data={report.detailedAnalysis.pedagogy} />
              <AnalysisBox title="Klinik Muhakeme Yetisi" data={report.detailedAnalysis.clinicalWisdom} />
              <AnalysisBox title="Psikolojik Dayanıklılık" data={report.detailedAnalysis.emotionalResilience} />
              <AnalysisBox title="Kurumsal Hiyerarşi & Uyum" data={report.detailedAnalysis.institutionalFit} />
              <AnalysisBox title="Kriz & Stres Altında Refleks" data={report.detailedAnalysis.stressResponse} />
           </div>
        </section>

        {/* Mühür ve Alt Bilgi */}
        <div className="mt-24 pt-12 border-t-2 border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-50 rounded-full flex items-center justify-center grayscale opacity-30">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V5L12 2Z"/></svg>
              </div>
              <div>DİJİTAL DOĞRULAMA KODU: {candidate.id.toUpperCase()} <br/> ARŞİV TARİHİ: {new Date().toLocaleDateString('tr-TR')}</div>
           </div>
           <div className="text-right space-y-1">
              <p className="text-slate-400">YENİ GÜN AKADEMİ</p>
              <p>RESMİ ANALİZ VE LİYAKAT BELGESİ</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
