
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
    title: data.config?.title || 'RESMİ AKADEMİK YAYIN DOSYASI',
    showWatermark: true,
    signatureRequired: true,
    theme: 'corporate',
    sections: {
      cover: true, executiveSummary: true, competencyMatrix: true, behavioralDNA: true,
      swotAnalysis: true, futureProjection: true, interviewGuide: true, clinicalSimulation: true
    }
  });

  const logExportAction = async (format: string) => {
    try {
      await fetch('/api/export-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: data.referenceId,
          entityType: data.type.includes('TRAINING') ? 'TRAINING' : 'CANDIDATE',
          exportFormat: format,
          documentTitle: config.title,
          metadata: { timestamp: Date.now(), config }
        })
      });
    } catch (e) { console.error("Audit log failed", e); }
  };

  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    setStatusMessage('Bilişsel Veriler PDF Formuna Dönüştürülüyor...');
    try {
      await UniversalPdfService.generateHighResPdf('print-stage', data);
      await logExportAction('PDF');
      setStatusMessage('PDF Hazırlandı ve İndirildi');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e: any) {
      alert(`PDF Üretim Hatası: ${e.message}`);
    } finally { setIsProcessing(false); }
  };

  const handlePrint = () => {
    setStatusMessage('Yazıcı Sürücüsü Hazırlanıyor...');
    logExportAction('PRINT');
    setTimeout(() => {
      window.print();
      setStatusMessage('');
    }, 800);
  };

  const handleDownloadPPTX = async () => {
    if (!data.type.includes('TRAINING') && !data.type.includes('PRESENTATION')) {
      return alert("Düzenlenebilir Slayt (PPTX) sadece eğitim modülleri için aktiftir.");
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
        s.addText(slide.title.toUpperCase(), { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: 'EA580C' });
        s.addText(slide.content.join('\n\n'), { x: 0.5, y: 1.5, w: '90%', h: '60%', fontSize: 18, color: 'FFFFFF', bullet: true });
      });

      await pptx.writeFile({ fileName: `YG_AKADEMI_${data.entityName.replace(/\s+/g, '_')}.pptx` });
      await logExportAction('PPTX');
      setStatusMessage('PowerPoint Dosyası Hazır');
    } catch (e) {
      alert("PPTX Motoru Hatası");
    } finally { setIsProcessing(false); }
  };

  const handlePublish = async () => {
    if (!confirm("DİKKAT: Bu içerik kurumsal 'Akademik Arşive' mühürlü statüde kaydedilecek. Bu işlem geri alınamaz. Onaylıyor musunuz?")) return;
    setIsProcessing(true);
    setStatusMessage('Kurumsal Belleğe Kalıcı Kayıt Yapılıyor...');
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
        await logExportAction('PUBLISH');
        alert("Yayınlama başarılı. Döküman artık kurumun dijital hafızasının bir parçası.");
        onClose();
      }
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/98 backdrop-blur-3xl flex flex-col md:flex-row overflow-hidden animate-fade-in no-print">
      
      {/* SOL: COMMAND & CONFIG SIDEBAR */}
      <div className="w-full md:w-[440px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl relative">
         <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-slate-900 text-orange-500 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border border-slate-800">M</div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tighter">Yayın Merkezi</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5">MIA Audit-Ready Output v31.0</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-xl transition-all">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6" /></svg>
            </button>
         </div>

         <div className="flex-1 p-8 space-y-12 overflow-y-auto custom-scrollbar">
            
            {/* GRUP 1: İHRACAT OPERASYONLARI */}
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] block border-l-4 border-orange-600 pl-4">DOSYA ÇIKTI MERKEZİ</label>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleDownloadPDF} className="p-6 bg-slate-900 text-white rounded-[2rem] hover:bg-orange-600 transition-all shadow-xl flex flex-col items-center gap-3 group">
                     <span className="text-3xl">📄</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">PDF İNDİR</span>
                  </button>
                  
                  <button onClick={handlePrint} className="p-6 bg-slate-50 text-slate-700 rounded-[2rem] border-2 border-slate-100 hover:border-slate-900 hover:bg-white transition-all flex flex-col items-center gap-3 group">
                     <span className="text-3xl">🖨️</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">YAZDIR</span>
                  </button>
               </div>
               
               {data.type.includes('TRAINING') && (
                 <button onClick={handleDownloadPPTX} className="w-full p-5 bg-blue-50 text-blue-700 rounded-2xl border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 group">
                    <span className="text-xl">📊</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">PPTX (PowerPoint) OLARAK AKTAR</span>
                 </button>
               )}
            </div>

            {/* GRUP 2: DÖKÜMAN KİMLİĞİ */}
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] block border-l-4 border-slate-300 pl-4">YAYIN PARAMETRELERİ</label>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Döküman Başlığı</label>
                     <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" value={config.title} onChange={e => setConfig({...config, title: e.target.value})} />
                  </div>
                  
                  <div className="space-y-3">
                     <div onClick={() => setConfig({...config, showWatermark: !config.showWatermark})} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900">Akademik Filigran</span>
                        <div className={`w-10 h-5 rounded-full relative transition-all ${config.showWatermark ? 'bg-orange-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.showWatermark ? 'right-1' : 'left-1'}`}></div></div>
                     </div>
                     <div onClick={() => setConfig({...config, signatureRequired: !config.signatureRequired})} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900">Dijital Mühür & İmza</span>
                        <div className={`w-10 h-5 rounded-full relative transition-all ${config.signatureRequired ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.signatureRequired ? 'right-1' : 'left-1'}`}></div></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* DENETİM NOTU */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-white/10 shadow-inner">
               <p className="text-[9px] font-bold text-orange-500 leading-relaxed uppercase italic">
                  * "ARŞİVDE YAYINLA" BUTONUNA BASTIĞINIZDA, BU DÖKÜMAN KURUMUN RESMİ AKADEMİK KAYITLARINA MÜHÜRLÜ STATÜDE EKLENİR VE TÜM İHRACAT İŞLEMLERİ LOGLANIR.
               </p>
            </div>
         </div>

         <div className="p-8 border-t border-slate-100 bg-white">
            <button 
              onClick={handlePublish} 
              disabled={isProcessing} 
              className="w-full py-7 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 group"
            >
               <span>{isProcessing ? 'YAYINLANIYOR...' : 'ARŞİVDE YAYINLA'}</span>
               {!isProcessing && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
            </button>
         </div>
      </div>

      {/* SAĞ: PREVIEW STAGE (A4 PRESET) */}
      <div className="flex-1 overflow-y-auto p-12 md:p-24 flex flex-col items-center custom-scrollbar bg-slate-200/50 relative">
         <div id="print-stage" className="bg-white shadow-[0_100px_200px_rgba(0,0,0,0.3)] relative print:shadow-none print:m-0 animate-scale-in origin-top">
            {children ? children : data.type.includes('TRAINING') ? (
              <div className="w-[1000px] aspect-video bg-[#0A0F1C] p-24 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
                 <h1 className="text-6xl font-black text-orange-600 uppercase mb-12 tracking-tighter">{(data.payload as CustomTrainingPlan).title}</h1>
                 <p className="text-3xl text-white font-medium italic opacity-70 border-l-8 border-white/20 pl-12">"{(data.payload as CustomTrainingPlan).description}"</p>
                 <div className="mt-24 border-t border-white/10 pt-12 flex justify-between items-end">
                    <div>
                       <p className="text-2xl text-white font-black uppercase">YENİ GÜN AKADEMİ</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">RESMİ EĞİTİM YAYIN DOSYASI</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-600 font-mono">DÖKÜMAN REF: {data.referenceId}</p>
                    </div>
                 </div>
              </div>
            ) : data.type === 'CANDIDATE_MERIT_REPORT' ? (
              <CandidateReport candidate={data.payload} report={data.payload.report} options={config} />
            ) : (
              <div className="w-[210mm] min-h-[297mm] p-20 bg-white flex items-center justify-center">
                 <p className="text-slate-300 font-black uppercase tracking-widest text-center animate-pulse">Önizleme Verisi Ayrıştırılıyor...</p>
              </div>
            )}
            
            {/* WATERMARK OVERLAY (Only if enabled and visible in preview) */}
            {config.showWatermark && (
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] select-none z-0">
                  <div className="text-[150px] font-black rotate-[-35deg] whitespace-nowrap uppercase">YENİ GÜN AKADEMİ</div>
               </div>
            )}
         </div>
         
         {statusMessage && (
           <div className="fixed bottom-12 right-12 px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] animate-slide-up shadow-3xl z-[6000] border border-orange-400">
              {statusMessage}
           </div>
         )}
      </div>
    </div>
  );
};

export default ExportStudio;
