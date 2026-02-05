
import React, { useState, useEffect } from 'react';
import { UniversalExportData, ExportConfig, Candidate } from '../../types';
import { UniversalPdfService } from '../../services/export/UniversalPdfService';
import CandidateReport from '../CandidateReport';
import { storageService } from '../../services/storageService';

// @fix: Added children property to ExportStudioProps to support custom content injection in export views.
interface ExportStudioProps {
  data: UniversalExportData;
  onClose: () => void;
  children?: React.ReactNode;
}

const ExportStudio: React.FC<ExportStudioProps> = ({ data, onClose, children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<string>('Sistem Yöneticisi');

  const [config, setConfig] = useState<ExportConfig>({
    title: data.config?.title || 'AKADEMİK LİYAKAT DOSYASI',
    showWatermark: true,
    signatureRequired: true,
    theme: 'corporate',
    sections: {
      cover: true,
      executiveSummary: true,
      competencyMatrix: true,
      behavioralDNA: true,
      swotAnalysis: true,
      futureProjection: true,
      interviewGuide: true,
      clinicalSimulation: true
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('yeni_gun_admin_token');
    if (token) setCurrentUser('Kurul Başkanı'); 
  }, []);

  // --- AKSİYONLAR ---

  // A. PDF İNDİRME (Universal Engine v6.0 - Ghost Protocol)
  const handleDownloadPDF = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setStatusMessage('Motor Başlatılıyor...');
    
    try {
      // 1. UI Stabilizasyonu için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setStatusMessage('Görüntü İşleniyor...');
      
      // 'print-stage' ID'si sağ paneldeki container'dır.
      // v6.0 ile bu element klonlanıp izole bir alanda işlenecektir.
      await UniversalPdfService.generateHighResPdf('print-stage', data);
      
      setStatusMessage('Tamamlandı');
    } catch (e: any) {
      console.error("Export Error:", e);
      alert(`PDF Oluşturma Hatası: ${e.message || 'Bilinmeyen bir render hatası oluştu.'}`);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleArchive = async () => {
    if (!confirm(`Bu dosya "${currentUser}" imzasıyla veritabanına mühürlenecek. Onaylıyor musunuz?`)) return;
    
    setIsProcessing(true);
    setStatusMessage('Arşive Yazılıyor...');
    try {
      const candidate = data.payload as Candidate;
      const activeSections = Object.keys(config.sections).filter((k) => config.sections[k as keyof typeof config.sections]);
      
      const archivePayload: Candidate = {
        ...candidate,
        status: 'archived',
        archiveCategory: 'HIRED_CONTRACTED', 
        archiveNote: `RESMİ MÜHÜR: ${new Date().toLocaleDateString('tr-TR')} - ${currentUser}. Kapsam: ${activeSections.join(', ')}.`,
        timestamp: Date.now()
      };

      const result = await storageService.updateCandidate(archivePayload);
      
      if (result.success) {
        alert("Dosya başarıyla mühürlendi ve dijital arşive kaldırıldı.");
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (e: any) {
      alert(`Arşivleme Hatası: ${e.message}`);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const toggleSection = (key: keyof typeof config.sections) => {
    setConfig(prev => ({
      ...prev,
      sections: { ...prev.sections, [key]: !prev.sections[key] }
    }));
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/95 backdrop-blur-md flex flex-col md:flex-row overflow-hidden animate-fade-in">
      
      {/* SOL PANEL: KONTROL KULESİ (NO-PRINT) */}
      <div className="w-full md:w-[400px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl no-print">
         
         <div className="p-8 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg">P</div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase leading-none">Yayın Stüdyosu</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">v6.0 Ghost Engine</p>
               </div>
            </div>
         </div>

         <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
            
            {/* 1. GÖRÜNÜM AYARLARI */}
            <div className="space-y-4">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">GENEL AYARLAR</label>
               
               <button onClick={() => setConfig({...config, showWatermark: !config.showWatermark})} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${config.showWatermark ? 'border-orange-500 bg-orange-50' : 'border-slate-100'}`}>
                  <span className="text-[11px] font-bold uppercase text-slate-700">Mühür ve Filigran</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${config.showWatermark ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}></div>
               </button>

               <button onClick={() => setConfig({...config, signatureRequired: !config.signatureRequired})} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${config.signatureRequired ? 'border-slate-900 bg-slate-50' : 'border-slate-100'}`}>
                  <span className="text-[11px] font-bold uppercase text-slate-700">İmza Panelleri</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${config.signatureRequired ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}></div>
               </button>
            </div>

            {/* 2. İÇERİK SEÇİCİ */}
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">MODÜL SEÇİMİ</label>
               <div className="bg-slate-50 rounded-2xl border border-slate-200 p-2 space-y-1">
                  {[
                    { k: 'cover', l: 'Kapak Sayfası & Başlık' },
                    { k: 'executiveSummary', l: 'Yönetici Özeti & Kimlik' },
                    { k: 'competencyMatrix', l: 'Yetkinlik Matrisi (Radar)' },
                    { k: 'behavioralDNA', l: 'Davranışsal DNA & Nöral Analiz' },
                    { k: 'swotAnalysis', l: 'SWOT Analizi' },
                    { k: 'futureProjection', l: '24 Aylık Projeksiyon' },
                    { k: 'interviewGuide', l: 'Stratejik Mülakat Rehberi' },
                    { k: 'clinicalSimulation', l: 'Laboratuvar/Simülasyon Verisi' },
                  ].map((item) => (
                     <button 
                       key={item.k}
                       onClick={() => toggleSection(item.k as any)}
                       className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${config.sections[item.k as keyof typeof config.sections] ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:bg-slate-100'}`}
                     >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${config.sections[item.k as keyof typeof config.sections] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                           {config.sections[item.k as keyof typeof config.sections] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight">{item.l}</span>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* 3. AKSİYON BUTONLARI */}
         <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="flex gap-3">
               <button onClick={handlePrint} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm">
                  YAZDIR (A4)
               </button>
               <button 
                  onClick={handleDownloadPDF} 
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 relative overflow-hidden"
               >
                  {isProcessing ? (
                      <span className="flex items-center justify-center gap-2 animate-pulse">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {statusMessage}
                      </span>
                  ) : 'PDF İNDİR'}
               </button>
            </div>

            <button onClick={handleArchive} disabled={isProcessing} className="w-full py-4 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
               ARŞİVE MÜHÜRLE
            </button>

            <button onClick={onClose} className="w-full py-3 text-slate-400 text-[9px] font-bold uppercase hover:text-rose-500 transition-all">
               VAZGEÇ VE KAPAT
            </button>
         </div>
      </div>

      {/* SAĞ PANEL: CANLI ÖNİZLEME (RENDER STAGE) */}
      <div className="flex-1 bg-slate-800/50 overflow-y-auto custom-scrollbar flex justify-center p-8 md:p-16 relative print:p-0 print:bg-white print:overflow-visible">
         {/* 
            Bu ID (print-stage) PDF servisi tarafından hedeflenir.
            v6.0 ile bu içerik "Ghost Container"a kopyalanarak işlenir.
            Böylece ekrandaki kaydırma veya modal durumu PDF çıktısını bozmaz.
         */}
         <div id="print-stage" className="flex flex-col gap-8 items-center print:block print:w-full print:gap-0">
            {/* @fix: Prioritize children if provided for custom exports, otherwise render the default CandidateReport with studio config. */}
            {children ? children : (
               <CandidateReport 
                  candidate={data.payload as any} 
                  report={data.payload.report} 
                  options={config} // Config ayarlarını rapora pasla
               />
            )}
         </div>
      </div>

    </div>
  );
};

export default ExportStudio;
