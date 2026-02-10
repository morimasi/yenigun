
import React, { useState, useEffect } from 'react';
import { UniversalExportData, ExportConfig, Candidate, CustomTrainingPlan } from '../../types';
import { UniversalPdfService } from '../../services/export/UniversalPdfService';
import CandidateReport from '../CandidateReport';
import { storageService } from '../../services/storageService';
import PptxGenJS from 'pptxgenjs';

interface ExportStudioProps {
  data: UniversalExportData;
  onClose: () => void;
  children?: React.ReactNode;
}

const ExportStudio: React.FC<ExportStudioProps> = ({ data, onClose, children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [config, setConfig] = useState<ExportConfig>({
    title: data.config?.title || 'AKADEMİK YAYIN DOSYASI',
    showWatermark: true,
    signatureRequired: true,
    theme: 'corporate',
    sections: {
      cover: true, executiveSummary: true, competencyMatrix: true, behavioralDNA: true,
      swotAnalysis: true, futureProjection: true, interviewGuide: true, clinicalSimulation: true
    }
  });

  const handleDownloadPDF = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatusMessage('PDF Render Ediliyor...');
    try {
      await UniversalPdfService.generateHighResPdf('print-stage', data);
      setStatusMessage('İndirme Başarılı');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e: any) {
      alert(`PDF Hatası: ${e.message}`);
    } finally { setIsProcessing(false); }
  };

  const handleDownloadPPTX = async () => {
    if (data.type !== 'TRAINING_LIBRARY') return alert("PPTX sadece eğitim sunumları için mevcuttur.");
    setIsProcessing(true);
    setStatusMessage('PowerPoint Üretiliyor...');
    try {
      const plan = data.payload as CustomTrainingPlan;
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      plan.slides?.forEach(slide => {
        let s = pptx.addSlide();
        s.background = { color: '0A0F1C' };
        s.addText(slide.title.toUpperCase(), { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: 'EA580C', fontFace: 'Arial' });
        s.addText(slide.content.join('\n\n'), { x: 0.5, y: 1.5, w: '90%', h: '60%', fontSize: 18, color: 'FFFFFF', bullet: true });
        s.addText("YENİ GÜN AKADEMİ - RESMİ YAYIN", { x: 0.5, y: 5.1, fontSize: 10, color: '475569' });
      });

      await pptx.writeFile({ fileName: `YG_AKADEMI_${plan.title.replace(/\s+/g, '_')}.pptx` });
      setStatusMessage('PPTX Hazır');
    } catch (e) {
      alert("PPTX Motor Hatası");
    } finally { setIsProcessing(false); }
  };

  const handlePublish = async () => {
    if (!confirm("Eğitim kurumsal kataloğa mühürlenecek ve tüm personelin portalına eklenecek. Onaylıyor musunuz?")) return;
    setIsProcessing(true);
    setStatusMessage('Akademik Katalog Güncelleniyor...');
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data.payload, status: 'published', updatedAt: Date.now() })
      });
      if (res.ok) {
        // Bildirim Gönder
        await fetch('/api/admin-notifications?action=create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'SYSTEM_ALERT',
            severity: 'SUCCESS',
            title: 'Yeni Müfredat Yayınlandı',
            message: `"${data.entityName}" eğitimi tüm personel için erişime açıldı.`
          })
        });
        alert("Yayınlama işlemi tamamlandı.");
        onClose();
      }
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/95 backdrop-blur-xl flex flex-col md:flex-row overflow-hidden animate-fade-in no-print">
      
      {/* SOL KONTROL PANELİ */}
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl">
         <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl">Y</div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase leading-none">Yayın Stüdyosu</h3>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-2">v7.0 Unified Engine</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-rose-50 text-slate-400 rounded-xl transition-all">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>

         <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-l-4 border-orange-600 pl-3">DIŞA AKTARMA FORMATLARI</label>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleDownloadPDF} className="p-6 bg-slate-900 text-white rounded-[2rem] hover:bg-orange-600 transition-all shadow-lg flex flex-col items-center gap-2">
                     <span className="text-2xl">📄</span>
                     <span className="text-[10px] font-black uppercase">PDF (Mühürlü)</span>
                  </button>
                  <button onClick={handleDownloadPPTX} className="p-6 bg-slate-50 text-slate-900 rounded-[2rem] border border-slate-200 hover:border-blue-600 transition-all flex flex-col items-center gap-2">
                     <span className="text-2xl">📊</span>
                     <span className="text-[10px] font-black uppercase">PPTX (Düzenle)</span>
                  </button>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-l-4 border-slate-900 pl-3">YAYIN AYARLARI</label>
               <button onClick={() => setConfig({...config, showWatermark: !config.showWatermark})} className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${config.showWatermark ? 'border-orange-500 bg-orange-50' : 'border-slate-100'}`}>
                  <span className="text-xs font-black uppercase text-slate-700">Akademik Filigran</span>
                  <div className={`w-5 h-5 rounded-full border-2 ${config.showWatermark ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}></div>
               </button>
            </div>
         </div>

         <div className="p-10 border-t border-slate-100 bg-white space-y-4">
            <button 
              onClick={handlePublish}
              disabled={isProcessing}
              className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4"
            >
               {isProcessing ? 'İŞLENİYOR...' : 'KATALOGDA YAYINLA'}
            </button>
            <p className="text-[9px] font-bold text-slate-400 text-center uppercase leading-relaxed">
              * Yayınlanan içerikler tüm personel portalında anında görünür ve sistem mühürü ile korunur.
            </p>
         </div>
      </div>

      {/* SAĞ ÖNİZLEME ALANI */}
      <div className="flex-1 overflow-y-auto p-12 md:p-20 flex flex-col items-center custom-scrollbar">
         <div id="print-stage" className="bg-white shadow-[0_100px_200px_rgba(0,0,0,0.4)] relative">
            {children ? children : data.type === 'TRAINING_LIBRARY' ? (
              <div className="w-[1000px] aspect-video bg-[#0A0F1C] p-20 flex flex-col justify-center">
                 <h1 className="text-5xl font-black text-orange-600 uppercase mb-10">{(data.payload as CustomTrainingPlan).title}</h1>
                 <p className="text-2xl text-white font-medium italic opacity-60">"{(data.payload as CustomTrainingPlan).description}"</p>
                 <div className="mt-20 border-t border-white/10 pt-10 flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase">AKADEMİK YAYIN</p>
                       <p className="text-xl text-white font-black">YENİ GÜN AKADEMİ</p>
                    </div>
                    <div className="w-24 h-24 bg-white/5 rounded-3xl"></div>
                 </div>
              </div>
            ) : (
              <CandidateReport candidate={data.payload} report={data.payload.report} options={config} />
            )}
         </div>
         {statusMessage && (
           <div className="mt-10 px-8 py-4 bg-orange-600 text-white rounded-full font-black text-xs uppercase tracking-widest animate-pulse">
              {statusMessage}
           </div>
         )}
      </div>
    </div>
  );
};

export default ExportStudio;
