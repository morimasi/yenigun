
import React, { useState } from 'react';
import { UniversalExportData, ExportConfig, CustomTrainingPlan } from '../../types';
import { UniversalPdfService } from '../../services/export/UniversalPdfService';
import CandidateReport from '../CandidateReport';
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
    setIsProcessing(true);
    setStatusMessage('Döküman Paketleniyor...');
    try {
      await UniversalPdfService.generateHighResPdf('print-stage', data);
      setStatusMessage('PDF İndirme Başlatıldı');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e: any) {
      alert(`PDF Motor Hatası: ${e.message}`);
    } finally { setIsProcessing(false); }
  };

  const handlePrint = () => {
    setStatusMessage('Yazıcı Bağlantısı Hazırlanıyor...');
    setTimeout(() => {
      window.print();
      setStatusMessage('');
    }, 500);
  };

  const handleDownloadPPTX = async () => {
    if (!data.type.includes('TRAINING') && !data.type.includes('PRESENTATION')) {
      return alert("PPTX (Düzenlenebilir Slayt) sadece akademik sunumlar için mevcuttur.");
    }
    setIsProcessing(true);
    setStatusMessage('Slayt Sentezleniyor...');
    try {
      const plan = data.payload as CustomTrainingPlan;
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      plan.slides?.forEach(slide => {
        let s = pptx.addSlide();
        s.background = { color: '0A0F1C' };
        s.addText(slide.title.toUpperCase(), { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: 'EA580C' });
        s.addText(slide.content.join('\n\n'), { x: 0.5, y: 1.5, w: '90%', h: '60%', fontSize: 18, color: 'FFFFFF', bullet: true });
      });

      await pptx.writeFile({ fileName: `YG_AKADEMI_${data.entityName.replace(/\s+/g, '_')}.pptx` });
      setStatusMessage('PPTX Hazır');
    } catch (e) {
      alert("PPTX Üretim Hatası");
    } finally { setIsProcessing(false); }
  };

  const handlePublish = async () => {
    if (!confirm("Bu içerik kurumsal arşive 'Mühürlü Dosya' olarak kaydedilecek. Onaylıyor musunuz?")) return;
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
        alert("Yayınlama başarılı. İçerik artık yetkili personelin erişimine açık.");
        onClose();
      }
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/98 backdrop-blur-3xl flex flex-col md:flex-row overflow-hidden animate-fade-in no-print">
      
      {/* SOL: CONTROL PANEL (COMMAND CENTER) */}
      <div className="w-full md:w-[420px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl relative">
         <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-950 text-orange-500 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">M</div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tighter">Publish Studio</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Unified Output v30.0</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-rose-50 text-slate-400 rounded-xl transition-all">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6" /></svg>
            </button>
         </div>

         <div className="flex-1 p-8 space-y-10 overflow-y-auto custom-scrollbar">
            
            {/* GRUP 1: DOSYA ÇIKTILARI */}
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-l-3 border-orange-600 pl-3">DÖKÜMAN ÇIKTILARI</label>
               <div className="grid grid-cols-1 gap-2">
                  <button onClick={handleDownloadPDF} className="w-full p-5 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-all shadow-lg flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <span className="text-xl">📄</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">PDF Olarak İndir</span>
                     </div>
                     <svg className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                  </button>
                  
                  <button onClick={handlePrint} className="w-full p-5 bg-slate-100 text-slate-700 rounded-2xl hover:bg-white hover:ring-2 hover:ring-slate-900 transition-all flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <span className="text-xl">🖨️</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Yazıcıya Gönder</span>
                     </div>
                     <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </button>

                  {data.type.includes('TRAINING') && (
                    <button onClick={handleDownloadPPTX} className="w-full p-5 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <span className="text-xl">📊</span>
                           <span className="text-[10px] font-black uppercase tracking-widest">Slayt (PPTX) İndir</span>
                        </div>
                        <svg className="w-4 h-4 opacity-30 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
                    </button>
                  )}
               </div>
            </div>

            {/* GRUP 2: YAYIN AYARLARI */}
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-l-3 border-slate-900 pl-3">GÖRÜNÜM AYARLARI</label>
               <div className="space-y-2">
                  <div onClick={() => setConfig({...config, showWatermark: !config.showWatermark})} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                     <span className="text-[10px] font-black uppercase text-slate-600">Akademik Filigran</span>
                     <div className={`w-10 h-5 rounded-full relative transition-all ${config.showWatermark ? 'bg-orange-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.showWatermark ? 'right-1' : 'left-1'}`}></div></div>
                  </div>
                  <div onClick={() => setConfig({...config, signatureRequired: !config.signatureRequired})} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                     <span className="text-[10px] font-black uppercase text-slate-600">Dijital Mühür & İmza</span>
                     <div className={`w-10 h-5 rounded-full relative transition-all ${config.signatureRequired ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.signatureRequired ? 'right-1' : 'left-1'}`}></div></div>
                  </div>
               </div>
            </div>

            {/* BİLGİ NOTU */}
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
               <p className="text-[9px] font-bold text-blue-600 leading-relaxed uppercase">
                  * "Arşivde Yayınla" işlemi dökümanı kurumsal veri tabanına mühürlü statüde kaydeder. PDF indirme ve Yazdırma işlemleri yerel çıktı araçlarıdır.
               </p>
            </div>
         </div>

         {/* ANA AKSİYON BUTONU */}
         <div className="p-8 border-t border-slate-100 bg-white">
            <button 
              onClick={handlePublish} 
              disabled={isProcessing} 
              className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
            >
               {isProcessing ? 'İŞLENİYOR...' : 'ARŞİVDE YAYINLA'}
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </button>
         </div>
      </div>

      {/* SAĞ: PREVIEW STAGE (Kritik: id="print-stage" hem PDF hem Yazıcı için kullanılır) */}
      <div className="flex-1 overflow-y-auto p-12 md:p-24 flex flex-col items-center custom-scrollbar bg-slate-200/50">
         <div id="print-stage" className="bg-white shadow-[0_100px_200px_rgba(0,0,0,0.3)] relative print:shadow-none print:m-0">
            {children ? children : data.type.includes('TRAINING') ? (
              <div className="w-[1000px] aspect-video bg-[#0A0F1C] p-24 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
                 <h1 className="text-6xl font-black text-orange-600 uppercase mb-12 tracking-tighter">{(data.payload as CustomTrainingPlan).title}</h1>
                 <p className="text-3xl text-white font-medium italic opacity-70 border-l-8 border-white/20 pl-12">"{(data.payload as CustomTrainingPlan).description}"</p>
                 <div className="mt-24 border-t border-white/10 pt-12">
                    <p className="text-2xl text-white font-black uppercase">YENİ GÜN AKADEMİ</p>
                 </div>
              </div>
            ) : data.type === 'CANDIDATE_MERIT_REPORT' ? (
              <CandidateReport candidate={data.payload} report={data.payload.report} options={config} />
            ) : (
              <div className="w-[210mm] min-h-[297mm] p-20 bg-white flex items-center justify-center">
                 <p className="text-slate-300 font-black uppercase tracking-widest">Önizleme Hazırlanıyor...</p>
              </div>
            )}
         </div>
         
         {statusMessage && (
           <div className="fixed bottom-12 right-12 px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest animate-slide-up shadow-3xl z-[6000]">
              {statusMessage}
           </div>
         )}
      </div>
    </div>
  );
};

export default ExportStudio;
