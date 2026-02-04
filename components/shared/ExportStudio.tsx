
import React, { useState } from 'react';
import { UniversalExportData, ExportConfig } from '../../types';
import { UniversalPdfService } from '../../services/export/UniversalPdfService';
import CandidateReport from '../CandidateReport';

interface ExportStudioProps {
  data: UniversalExportData;
  onClose: () => void;
  children?: React.ReactNode; // Opsiyonel, CandidateReport zaten data'dan besleniyor
}

const ExportStudio: React.FC<ExportStudioProps> = ({ data, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Döküman Yapılandırması
  const [config, setConfig] = useState<ExportConfig>({
    title: data.config?.title || 'AKADEMİK LİYAKAT DOSYASI',
    showWatermark: true,
    sections: [
      { id: 'full_report', label: 'Tam Kapsamlı Rapor', active: true }
    ],
    theme: 'corporate',
    includeCharts: true,
    includeAiNarrative: true,
    signatureRequired: true
  });

  const handleStartExport = async () => {
    setIsExporting(true);
    try {
      // 'print-stage' ID'li alanı hedefle
      await UniversalPdfService.generateHighResPdf('print-stage', data);
      alert("Dosya başarıyla yayınlandı.");
    } catch (e) {
      alert("Yayınlama motorunda hata oluştu.");
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/95 backdrop-blur-md flex flex-col md:flex-row overflow-hidden animate-fade-in no-print">
      
      {/* SOL PANEL: AYARLAR */}
      <div className="w-full md:w-[350px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl">
         <div className="p-8 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black">P</div>
               <h3 className="text-lg font-black text-slate-900 uppercase">Yayın Stüdyosu</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profesyonel Baskı Önizleme</p>
         </div>

         <div className="flex-1 p-8 space-y-8 overflow-y-auto">
            <div className="space-y-4">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GÖRÜNÜM AYARLARI</label>
               
               <button 
                 onClick={() => setConfig({...config, showWatermark: !config.showWatermark})}
                 className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${config.showWatermark ? 'border-orange-500 bg-orange-50' : 'border-slate-100'}`}
               >
                  <span className="text-[10px] font-bold uppercase text-slate-700">Mühür ve Filigran</span>
                  <div className={`w-3 h-3 rounded-full ${config.showWatermark ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
               </button>

               <button 
                 onClick={() => setConfig({...config, signatureRequired: !config.signatureRequired})}
                 className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${config.signatureRequired ? 'border-slate-900 bg-slate-50' : 'border-slate-100'}`}
               >
                  <span className="text-[10px] font-bold uppercase text-slate-700">İmza Panelleri</span>
                  <div className={`w-3 h-3 rounded-full ${config.signatureRequired ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
               </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
               <h4 className="text-[10px] font-black text-slate-900 uppercase mb-2">DOSYA BİLGİSİ</h4>
               <ul className="space-y-2 text-[10px] text-slate-600 font-medium font-mono">
                  <li>REF: {data.referenceId}</li>
                  <li>TÜR: {data.type}</li>
                  <li>SAYFA: Otomatik (A4)</li>
                  <li>KALİTE: 300 DPI</li>
               </ul>
            </div>
         </div>

         <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
            <button 
               onClick={handleStartExport} 
               disabled={isExporting}
               className="w-full py-4 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50 shadow-xl"
            >
               {isExporting ? 'İŞLENİYOR...' : 'PDF OLARAK İNDİR'}
            </button>
            <button 
               onClick={onClose} 
               className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-rose-600 hover:border-rose-200"
            >
               KAPAT
            </button>
         </div>
      </div>

      {/* SAĞ PANEL: CANLI ÖNİZLEME (RENDER STAGE) */}
      <div className="flex-1 bg-slate-800/50 overflow-y-auto custom-scrollbar flex justify-center p-8 md:p-16 relative">
         {/* Bu ID (print-stage) PDF servisi tarafından hedeflenir */}
         <div id="print-stage" className="flex flex-col gap-8 items-center">
            {/* 
                CandidateReport bileşeni artık "fragment" döndürmüyor. 
                Kendi içinde A4 boyutunda .pdf-page divleri döndürecek şekilde ayarlandı.
            */}
            <CandidateReport 
               candidate={data.payload as any} 
               report={data.payload.report} 
               options={config} // Config ayarlarını rapora pasla
            />
         </div>
      </div>

    </div>
  );
};

export default ExportStudio;
