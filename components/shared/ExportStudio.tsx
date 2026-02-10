
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
    setStatusMessage('Döküman Paketleniyor...');
    try {
      // PDF motorunu tetikle (print-stage id'li div'i yakalar)
      await UniversalPdfService.generateHighResPdf('print-stage', data);
      setStatusMessage('İndirme Başlatıldı');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e: any) {
      alert(`PDF Motor Hatası: ${e.message}`);
    } finally { setIsProcessing(false); }
  };

  const handleDownloadPPTX = async () => {
    if (data.type !== 'TRAINING_LIBRARY' && data.type !== 'MULTIMODAL_PRESENTATION') {
      return alert("PPTX (Düzenlenebilir Slayt) sadece akademik sunumlar için mevcuttur.");
    }
    setIsProcessing(true);
    setStatusMessage('PowerPoint Sentezleniyor...');
    try {
      const plan = data.payload as CustomTrainingPlan;
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      plan.slides?.forEach(slide => {
        let s = pptx.addSlide();
        s.background = { color: '0A0F1C' };
        s.addText(slide.title.toUpperCase(), { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: 'EA580C', fontFace: 'Arial' });
        s.addText(slide.content.join('\n\n'), { x: 0.5, y: 1.5, w: '90%', h: '60%', fontSize: 18, color: 'FFFFFF', bullet: true });
        s.addText("YENİ GÜN AKADEMİ - KURUMSAL ARŞİV", { x: 0.5, y: 5.1, fontSize: 10, color: '475569' });
      });

      await pptx.writeFile({ fileName: `YG_AKADEMI_${plan.title.replace(/\s+/g, '_')}.pptx` });
      setStatusMessage('PPTX Hazır');
    } catch (e) {
      alert("PPTX Üretim Hatası");
    } finally { setIsProcessing(false); }
  };

  const handlePublish = async () => {
    const confirmMsg = data.type === 'TRAINING_LIBRARY' 
      ? "Bu eğitim tüm personel portalında 'Zorunlu Eğitim' olarak yayınlanacak. Onaylıyor musunuz?"
      : "Bu aday analizi resmi arşive 'Mühürlü Dosya' olarak kaydedilecek. Onaylıyor musunuz?";
      
    if (!confirm(confirmMsg)) return;

    setIsProcessing(true);
    setStatusMessage('Kurumsal Belleğe Yazılıyor...');
    try {
      const endpoint = data.type === 'TRAINING_LIBRARY' ? '/api/training?action=save' : '/api/candidates';
      const body = data.type === 'TRAINING_LIBRARY' 
        ? { ...data.payload, status: 'published', updatedAt: Date.now() }
        : { ...data.payload, status: 'archived', archiveCategory: 'TALENT_POOL_ANALYTICS', updatedAt: Date.now() };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        await fetch('/api/admin-notifications?action=create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'SYSTEM_ALERT',
            severity: 'SUCCESS',
            title: 'Yayın İşlemi Tamamlandı',
            message: `"${data.entityName}" başarıyla mühürlendi ve kataloğa eklendi.`
          })
        });
        alert("Yayınlama başarılı.");
        onClose();
      }
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/98 backdrop-blur-3xl flex flex-col md:flex-row overflow-hidden animate-fade-in no-print">
      
      {/* SOL: UNIFIED CONTROL SIDEBAR */}
      <div className="w-full md:w-[480px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl relative">
         <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-slate-950 text-orange-500 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-2xl">M</div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tighter">Publish Studio</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">MIA Unified Export v8.0</p>
               </div>
            </div>
            <button onClick={onClose} className="p-4 hover:bg-rose-50 text-slate-400 rounded-2xl transition-all">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>

         <div className="flex-1 p-10 space-y-12 overflow-y-auto custom-scrollbar">
            {/* FORMATLAR */}
            <div className="space-y-6">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] block border-l-4 border-orange-600 pl-4">DOSYA FORMATLARI</label>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleDownloadPDF} className="p-8 bg-slate-900 text-white rounded-[2.5rem] hover:bg-orange-600 transition-all shadow-xl flex flex-col items-center gap-3 group">
                     <span className="text-3xl group-hover:scale-110 transition-transform">📄</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">PDF (MÜHÜRLÜ)</span>
                  </button>
                  <button 
                    onClick={handleDownloadPPTX} 
                    className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 group ${data.type.includes('TRAINING') || data.type.includes('PRESENTATION') ? 'bg-white border-slate-200 hover:border-blue-500 text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-300 grayscale opacity-50'}`}
                  >
                     <span className="text-3xl group-hover:scale-110 transition-transform">📊</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">PPTX (SLAYT)</span>
                  </button>
               </div>
            </div>

            {/* DÖKÜMAN AYARLARI */}
            <div className="space-y-6">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] block border-l-4 border-slate-900 pl-4">YAYIN PARAMETRELERİ</label>
               <div className="space-y-3">
                  <button onClick={() => setConfig({...config, showWatermark: !config.showWatermark})} className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${config.showWatermark ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-slate-100 text-slate-500'}`}>
                     <span className="text-[11px] font-black uppercase">Resmi Akademik Filigran</span>
                     <div className={`w-6 h-6 rounded-full border-4 ${config.showWatermark ? 'bg-orange-500 border-orange-200' : 'bg-slate-100 border-white'}`}></div>
                  </button>
                  <button onClick={() => setConfig({...config, signatureRequired: !config.signatureRequired})} className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${config.signatureRequired ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 text-slate-500'}`}>
                     <span className="text-[11px] font-black uppercase">Dijital Mühür & İmza</span>
                     <div className={`w-6 h-6 rounded-full border-4 ${config.signatureRequired ? 'bg-emerald-500 border-emerald-200' : 'bg-slate-100 border-white'}`}></div>
                  </button>
               </div>
            </div>

            {/* BİLGİ NOTU */}
            <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
               <p className="text-[10px] font-bold text-blue-600 leading-relaxed uppercase">
                  * "Katalogda Yayınla" butonuna bastığınızda, bu içerik kurumsal arşive mühürlenir ve yetkili personelin erişimine açılır.
               </p>
            </div>
         </div>

         {/* AKSİYON BUTONU */}
         <div className="p-10 border-t border-slate-100 bg-white">
            <button 
              onClick={handlePublish}
              disabled={isProcessing}
              className="w-full py-8 bg-slate-950 text-white rounded-[3rem] font-black uppercase tracking-[0.4em] shadow-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
            >
               {isProcessing ? 'İŞLENİYOR...' : 'KATALOGDA YAYINLA'}
            </button>
         </div>
      </div>

      {/* SAĞ: LİVE RENDER PREVIEW (GHOST STAGE) */}
      <div className="flex-1 overflow-y-auto p-12 md:p-24 flex flex-col items-center custom-scrollbar bg-slate-200/50">
         <div className="mb-10 text-center">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[1em]">DÖKÜMAN ÖNİZLEME</span>
         </div>
         
         <div id="print-stage" className="bg-white shadow-[0_100px_200px_rgba(0,0,0,0.3)] relative transition-transform duration-500 hover:scale-[1.01]">
            {children ? children : data.type.includes('TRAINING') || data.type.includes('PRESENTATION') ? (
              <div className="w-[1000px] aspect-video bg-[#0A0F1C] p-24 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
                 <h1 className="text-6xl font-black text-orange-600 uppercase mb-12 tracking-tighter leading-none">{(data.payload as CustomTrainingPlan).title}</h1>
                 <p className="text-3xl text-white font-medium italic opacity-70 border-l-8 border-white/20 pl-12 leading-relaxed">"{(data.payload as CustomTrainingPlan).description}"</p>
                 <div className="mt-24 border-t border-white/10 pt-12 flex justify-between items-end">
                    <div>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">RESMİ AKADEMİK YAYIN</p>
                       <p className="text-2xl text-white font-black uppercase mt-2">YENİ GÜN AKADEMİ</p>
                    </div>
                    <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center border border-white/10 text-white font-black text-2xl tracking-widest shadow-2xl">YG</div>
                 </div>
              </div>
            ) : data.type === 'CANDIDATE_MERIT_REPORT' ? (
              <CandidateReport candidate={data.payload} report={data.payload.report} options={config} />
            ) : (
              <div className="w-[210mm] min-h-[297mm] p-20 bg-white flex items-center justify-center">
                 <p className="text-slate-300 font-black uppercase tracking-widest">Önizleme Oluşturulamadı</p>
              </div>
            )}
         </div>

         {statusMessage && (
           <div className="fixed bottom-12 right-12 px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest animate-slide-up shadow-3xl">
              {statusMessage}
           </div>
         )}
      </div>
    </div>
  );
};

export default ExportStudio;
