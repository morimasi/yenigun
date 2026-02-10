
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
          entityType: data.type,
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
      setStatusMessage('PDF Hazırlandı');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e: any) {
      alert(`PDF Üretim Hatası: ${e.message}`);
    } finally { setIsProcessing(false); }
  };

  const handlePrint = () => {
    setStatusMessage('Yazıcı Hazırlanıyor...');
    logExportAction('PRINT');
    setTimeout(() => {
      window.print();
      setStatusMessage('');
    }, 800);
  };

  const handlePublish = async () => {
    if (!confirm("İçerik kurumsal arşive mühürlenecek. Onaylıyor musunuz?")) return;
    setIsProcessing(true);
    try {
      await logExportAction('PUBLISH');
      alert("Yayınlama başarılı. Döküman kurumun resmi dijital hafızasına eklendi.");
      onClose();
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/98 backdrop-blur-3xl flex flex-col md:flex-row overflow-hidden animate-fade-in no-print">
      
      {/* SOL: EVRENSEL SIDEBAR */}
      <div className="w-full md:w-[440px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl relative">
         <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-slate-900 text-orange-500 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">YG</div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tighter">Yayın Merkezi</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5">{data.type} / Unified v32.0</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-xl transition-all">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6" /></svg>
            </button>
         </div>

         <div className="flex-1 p-8 space-y-10 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] block border-l-4 border-orange-600 pl-4">ÇIKTI SEÇENEKLERİ</label>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleDownloadPDF} className="p-6 bg-slate-900 text-white rounded-[2rem] hover:bg-orange-600 transition-all shadow-xl flex flex-col items-center gap-3">
                     <span className="text-3xl">📄</span>
                     <span className="text-[10px] font-black uppercase">PDF İNDİR</span>
                  </button>
                  <button onClick={handlePrint} className="p-6 bg-slate-50 text-slate-700 rounded-[2rem] border-2 border-slate-100 hover:border-slate-900 hover:bg-white transition-all flex flex-col items-center gap-3">
                     <span className="text-3xl">🖨️</span>
                     <span className="text-[10px] font-black uppercase">YAZDIR</span>
                  </button>
               </div>
            </div>

            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] block border-l-4 border-slate-300 pl-4">YAYIN AYARLARI</label>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Belge Başlığı</label>
                     <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" value={config.title} onChange={e => setConfig({...config, title: e.target.value})} />
                  </div>
                  <div onClick={() => setConfig({...config, showWatermark: !config.showWatermark})} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer group">
                     <span className="text-[10px] font-black uppercase text-slate-600">Kurumsal Filigran</span>
                     <div className={`w-10 h-5 rounded-full relative transition-all ${config.showWatermark ? 'bg-orange-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.showWatermark ? 'right-1' : 'left-1'}`}></div></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="p-8 border-t border-slate-100 bg-white">
            <button onClick={handlePublish} disabled={isProcessing} className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4">
               {isProcessing ? 'İŞLENİYOR...' : 'ARŞİVDE YAYINLA'}
            </button>
         </div>
      </div>

      {/* SAĞ: ÖNİZLEME (BAĞLAMSAL RENDER) */}
      <div className="flex-1 overflow-y-auto p-12 md:p-24 flex flex-col items-center custom-scrollbar bg-slate-200/50 relative">
         <div id="print-stage" className="bg-white shadow-[0_100px_200px_rgba(0,0,0,0.3)] relative print:shadow-none print:m-0 animate-scale-in origin-top min-w-[210mm]">
            {children ? children : (
              <div className="p-20 w-[210mm] min-h-[297mm] bg-white relative">
                 <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-12">
                    <div>
                       <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{config.title}</h1>
                       <p className="text-xs font-bold text-orange-600 uppercase tracking-[0.3em] mt-2">AKADEMİK KURUL RESMİ KAYDI</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-900 uppercase">{data.entityName}</p>
                       <p className="text-[10px] font-mono text-slate-400 mt-1">ID: {data.referenceId}</p>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">ÖZET VE GEREKÇE</h5>
                       <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                         "Bu belge, Yeni Gün Akademi MIA (Modular Intelligence Architecture) tarafından üretilen verilerin resmi dökümantasyonudur. İçerik kurum içi liyakat, eğitim veya denetim süreçleri için bağlayıcıdır."
                       </p>
                    </div>
                    
                    <div className="py-20 text-center opacity-20 grayscale border-4 border-dashed border-slate-100 rounded-[4rem]">
                       <p className="text-xl font-black uppercase tracking-[0.5em]">{data.type} VERİ SETİ</p>
                    </div>
                 </div>

                 <div className="absolute bottom-12 left-20 right-20 flex justify-between items-end border-t border-slate-100 pt-8">
                    <div>
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">YENİ GÜN AKADEMİ v32.0 PLATINUM</p>
                       <p className="text-[8px] font-mono text-slate-300">{new Date().toISOString()}</p>
                    </div>
                    <div className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-[8px] font-black text-slate-300 text-center uppercase p-2">Resmi Mühür</div>
                 </div>
              </div>
            )}
            
            {config.showWatermark && (
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] select-none z-0">
                  <div className="text-[150px] font-black rotate-[-35deg] whitespace-nowrap uppercase">YENİ GÜN AKADEMİ</div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ExportStudio;
