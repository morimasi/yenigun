
import React, { useState } from 'react';
import { UniversalExportData, ExportConfig } from '../../types';
import { UniversalPdfService } from '../../services/export/UniversalPdfService';

interface ExportStudioProps {
  data: UniversalExportData;
  onClose: () => void;
  children: React.ReactNode; // Raporda görünecek ana bileşen
}

const ExportStudio: React.FC<ExportStudioProps> = ({ data, onClose, children }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [config, setConfig] = useState<ExportConfig>({
    title: data.config?.title || 'AKADEMİK ANALİZ RAPORU',
    showWatermark: true,
    sections: [
      { id: 'personal', label: 'Profil Bilgileri', active: true },
      { id: 'matrix', label: 'Analiz Matrisi', active: true },
      { id: 'charts', label: 'Görsel Veri & Grafikler', active: true },
      { id: 'ai', label: 'Yapay Zeka Yorumu', active: true },
      { id: 'interview', label: 'Mülakat Rehberi', active: true }
    ],
    theme: 'corporate',
    includeCharts: true,
    includeAiNarrative: true,
    signatureRequired: true
  });

  const handleStartExport = async () => {
    setIsExporting(true);
    try {
      await UniversalPdfService.generateHighResPdf('export-preview-area', data);
    } catch (e) {
      alert("HATA: PDF Üretim motoru bir engele takıldı.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-fade-in no-print">
      <div className="w-full max-w-[1200px] h-full bg-white rounded-[3rem] shadow-3xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        
        {/* SOL: AYARLAR PANELİ */}
        <div className="w-full md:w-[380px] bg-slate-50 border-r border-slate-200 p-10 overflow-y-auto custom-scrollbar flex flex-col">
           <div className="mb-10">
              <span className="px-3 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block">PUBLISHING STUDIO</span>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Raporu Özelleştir</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Döküman Standartları ve Kapsam</p>
           </div>

           <div className="space-y-8 flex-1">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Belge Başlığı</label>
                 <input 
                   className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-orange-500 transition-all"
                   value={config.title}
                   onChange={e => setConfig({...config, title: e.target.value.toUpperCase()})}
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rapor Bölümleri</label>
                 <div className="grid grid-cols-1 gap-2">
                    {config.sections.map((sec, idx) => (
                       <button 
                         key={sec.id}
                         onClick={() => {
                           const newSecs = [...config.sections];
                           newSecs[idx].active = !newSecs[idx].active;
                           setConfig({...config, sections: newSecs});
                         }}
                         className={`flex items-center justify-between p-4 rounded-xl border transition-all ${sec.active ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                       >
                          <span className="text-[11px] font-black uppercase tracking-tight">{sec.label}</span>
                          <div className={`w-2 h-2 rounded-full ${sec.active ? 'bg-orange-500 animate-pulse' : 'bg-slate-200'}`}></div>
                       </button>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-900 uppercase">Resmi Mühür</span>
                    <input type="checkbox" className="accent-orange-600 h-4 w-4" checked={config.showWatermark} onChange={e => setConfig({...config, showWatermark: e.target.checked})} />
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-900 uppercase">İmza Blokları</span>
                    <input type="checkbox" className="accent-orange-600 h-4 w-4" checked={config.signatureRequired} onChange={e => setConfig({...config, signatureRequired: e.target.checked})} />
                 </div>
              </div>
           </div>

           <div className="mt-10 pt-10 border-t border-slate-200 flex flex-col gap-3">
              <button 
                onClick={handleStartExport}
                disabled={isExporting}
                className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
              >
                {isExporting ? 'MÜHÜRLENİYOR...' : 'PDF OLARAK YAYINLA'}
              </button>
              <button onClick={onClose} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-rose-600 transition-colors">İPTAL ET</button>
           </div>
        </div>

        {/* SAĞ: CANLI ÖNİZLEME (WYSIWYG) */}
        <div className="flex-1 bg-slate-200 p-8 md:p-20 overflow-y-auto custom-scrollbar flex flex-col items-center">
           <div 
             id="export-preview-area" 
             className={`w-full max-w-[210mm] bg-white shadow-2xl relative transition-all duration-500 overflow-hidden ${isExporting ? 'scale-[0.98] opacity-90' : ''}`}
             style={{ minHeight: '297mm', padding: '20mm' }}
           >
              {/* CORPORATE HEADER FOR PDF */}
              <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-12 mb-12">
                 <div>
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-3xl">YG</div>
                       <div>
                          <h1 className="text-2xl font-black text-slate-900 leading-none">YENİ GÜN AKADEMİ</h1>
                          <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mt-1">Akademik Kurul & Liyakat Ofisi</p>
                       </div>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">{config.title}</h2>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{data.entityName} // {data.type.replace('_', ' ')}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">TARİH: {new Date().toLocaleDateString('tr-TR')}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">REFERANS: {data.referenceId}</p>
                    {config.showWatermark && (
                       <div className="mt-8 px-4 py-2 border-2 border-emerald-500 text-emerald-500 rounded-lg inline-block font-black text-[9px] uppercase tracking-widest rotate-[-5deg]">
                          VERIFIED BY MIA AI
                       </div>
                    )}
                 </div>
              </div>

              {/* DYNAMIC CONTENT CLONE */}
              <div className="pdf-content-wrapper font-sans text-slate-800">
                 {children}
              </div>

              {/* SIGNATURE BLOCKS */}
              {config.signatureRequired && (
                 <div className="mt-20 pt-20 border-t border-slate-100 grid grid-cols-3 gap-12">
                    <div className="text-center">
                       <div className="h-20 border-b border-slate-200 mb-4"></div>
                       <p className="text-[9px] font-black text-slate-900 uppercase">AKADEMİK DİREKTÖR</p>
                    </div>
                    <div className="text-center">
                       <div className="h-20 border-b border-slate-200 mb-4"></div>
                       <p className="text-[9px] font-black text-slate-900 uppercase">KLİNİK SÜPERVİZÖR</p>
                    </div>
                    <div className="text-center">
                       <div className="h-20 border-b border-slate-200 mb-4"></div>
                       <p className="text-[9px] font-black text-slate-900 uppercase">KURUM MÜDÜRÜ</p>
                    </div>
                 </div>
              )}

              {/* PAGE FOOTER */}
              <div className="absolute bottom-8 left-0 w-full px-20 flex justify-between items-end opacity-40">
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bu döküman Yeni Gün Akademi mülkiyetindedir. Gizli tutulmalıdır.</p>
                 <p className="text-[8px] font-black text-slate-900">SAYFA 01</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExportStudio;
