
import React, { useState, useMemo } from 'react';
import { UniversalExportData, ExportConfig } from '../../types';
import { UniversalPdfService } from '../../services/export/UniversalPdfService';

interface ExportStudioProps {
  data: UniversalExportData;
  onClose: () => void;
  children: React.ReactNode;
}

const ExportStudio: React.FC<ExportStudioProps> = ({ data, onClose, children }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [activePreviewPage, setActivePreviewPage] = useState(0);
  
  const [config, setConfig] = useState<ExportConfig>({
    title: data.config?.title || 'RESMİ AKADEMİK ANALİZ DOSYASI',
    showWatermark: true,
    sections: data.config?.sections || [
      { id: 'cover', label: 'Kapak ve Özet', active: true },
      { id: 'matrix', label: 'Derin Analiz Matrisi', active: true },
      { id: 'predictions', label: 'Gelecek Projeksiyonu', active: true },
      { id: 'strategic', label: 'Mülakat Stratejisi', active: true }
    ],
    theme: 'corporate',
    includeCharts: true,
    includeAiNarrative: true,
    signatureRequired: true
  });

  const handleStartExport = async () => {
    setIsExporting(true);
    try {
      // PDF Üretimi
      await UniversalPdfService.generateHighResPdf('publishing-canvas', data);
      alert("Döküman başarıyla mühürlendi ve yerel sürücüye aktarıldı.");
    } catch (e) {
      alert("HATA: Nöral yayınlama motorunda bir kesinti oluştu.");
    } finally {
      setIsExporting(false);
    }
  };

  const activeSections = config.sections.filter(s => s.active).map(s => s.id);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 animate-fade-in no-print">
      <div className="w-full max-w-[1400px] h-full bg-white rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden border border-white/10">
        
        <div className="w-full md:w-[420px] bg-slate-50 border-r border-slate-200 p-12 overflow-y-auto custom-scrollbar flex flex-col h-full">
           <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">P</div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Yayınlama Stüdyosu</h3>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                 Döküman standardını belirleyin ve dijital mühür ekleyerek dökümanı resmiyete kavuşturun.
              </p>
           </div>

           <div className="space-y-10 flex-1">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">RAPOR KAPSAMI</label>
                 <div className="grid grid-cols-1 gap-2">
                    {config.sections.map((sec, idx) => (
                       <button 
                         key={sec.id}
                         onClick={() => {
                           const next = [...config.sections];
                           next[idx].active = !next[idx].active;
                           setConfig({...config, sections: next});
                         }}
                         className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${sec.active ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-x-1' : 'bg-white border-slate-100 text-slate-300 hover:border-orange-500 hover:text-slate-600'}`}
                       >
                          <span className="text-[11px] font-black uppercase tracking-tight">{sec.label}</span>
                          <div className={`w-3 h-3 rounded-full ${sec.active ? 'bg-orange-500 animate-pulse' : 'bg-slate-100'}`}></div>
                       </button>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6 shadow-sm">
                 <div className="flex items-center justify-between group cursor-pointer" onClick={() => setConfig({...config, showWatermark: !config.showWatermark})}>
                    <div>
                       <span className="text-[11px] font-black text-slate-900 uppercase">AKADEMİK MÜHÜR</span>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">MIA Onay Damgası</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${config.showWatermark ? 'bg-orange-600' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showWatermark ? 'left-7' : 'left-1'}`}></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between group cursor-pointer" onClick={() => setConfig({...config, signatureRequired: !config.signatureRequired})}>
                    <div>
                       <span className="text-[11px] font-black text-slate-900 uppercase">İmza Panelleri</span>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Resmi Onay Alanları</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${config.signatureRequired ? 'bg-orange-600' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.signatureRequired ? 'left-7' : 'left-1'}`}></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="mt-12 pt-12 border-t border-slate-200 space-y-4">
              <button 
                onClick={handleStartExport}
                disabled={isExporting}
                className="w-full py-7 bg-orange-600 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
              >
                {isExporting ? 'MÜHÜRLENİYOR...' : 'DOSYAYI YAYINLA'}
              </button>
              <button onClick={onClose} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-rose-600 transition-colors">İPTAL ET</button>
           </div>
        </div>

        <div className="flex-1 bg-slate-200/50 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col items-center gap-12">
           
           <div className="flex bg-white/50 backdrop-blur-xl p-2 rounded-[2rem] shadow-xl border border-white gap-2 sticky top-0 z-50">
              {activeSections.map((sec, i) => (
                 <button 
                   key={sec} 
                   onClick={() => setActivePreviewPage(i)}
                   className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activePreviewPage === i ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white hover:text-slate-900'}`}
                 >
                    Sayfa {i + 1}
                 </button>
              ))}
           </div>

           <div className="relative w-full max-w-[210mm] transition-all duration-700" id="publishing-canvas">
              
              {activeSections.includes('cover') && (
                <div className={`pdf-page bg-white w-full shadow-2xl mb-12 relative overflow-hidden ${activePreviewPage !== activeSections.indexOf('cover') ? 'hidden' : 'block'}`} style={{ width: '210mm', height: '297mm', padding: '25mm' }}>
                   <div className="flex flex-col h-full border-[10px] border-slate-900 p-12 relative">
                      <div className="mb-20">
                         <div className="flex items-center gap-6 mb-12">
                            <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black">YG</div>
                            <div>
                               <h1 className="text-2xl font-black text-slate-900 leading-none uppercase">Yeni Gün Akademi</h1>
                               <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mt-2">Akademik Liyakat Raporu</p>
                            </div>
                         </div>
                         <h2 className="text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.8] mb-6">{data.entityName}</h2>
                         <div className="flex items-center gap-4">
                            <span className="px-5 py-2 bg-orange-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest">{data.type.replace('_', ' ')}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">REF: {data.referenceId}</span>
                         </div>
                      </div>

                      <div className="flex-1 space-y-16">
                         <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 relative">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6">YÖNETİCİ ÖZETİ</h4>
                            <p className="text-lg font-medium text-slate-700 leading-relaxed italic text-justify">
                               {data.payload.report?.summary || "Döküman özetleniyor..."}
                            </p>
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl"></div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-12">
                            <div className="p-10 bg-slate-900 rounded-[3rem] text-white">
                               <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-4">LİYAKAT SKORU</span>
                               <p className="text-8xl font-black leading-none">%{data.payload.report?.score || '?'}</p>
                            </div>
                            <div className="p-10 border-4 border-slate-100 rounded-[3rem] flex flex-col justify-center">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">DÜRÜSTLÜK ENDEKSİ</span>
                               <p className="text-6xl font-black text-slate-900 leading-none">%{data.payload.report?.integrityIndex || '100'}</p>
                            </div>
                         </div>
                      </div>

                      {config.showWatermark && (
                         <div className="absolute bottom-12 right-12 px-8 py-3 border-4 border-emerald-500 text-emerald-500 rounded-2xl font-black text-xs uppercase tracking-[0.3em] rotate-[-12deg] opacity-60">
                            MIA AI VERIFIED
                         </div>
                      )}
                      
                      <div className="mt-12 flex justify-between items-end border-t border-slate-100 pt-8">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PUBLISHED: {new Date().toLocaleString('tr-TR')}</p>
                         <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">SAYFA 01</p>
                      </div>
                   </div>
                </div>
              )}

              {activeSections.includes('matrix') && (
                <div className={`pdf-page bg-white w-full shadow-2xl mb-12 relative overflow-hidden ${activePreviewPage !== activeSections.indexOf('matrix') ? 'hidden' : 'block'}`} style={{ width: '210mm', height: '297mm', padding: '25mm' }}>
                   <div className="border-l-[12px] border-orange-600 h-full pl-16 py-10">
                      <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mb-16">02 // BOYUTSAL ANALİZ MATRİSİ</h3>
                      <div className="space-y-12">
                         {data.payload.report?.deepAnalysis && Object.entries(data.payload.report.deepAnalysis).slice(0, 4).map(([key, val]: any) => (
                            <div key={key} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                               <div className="flex justify-between items-end mb-6">
                                  <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</h5>
                                  <span className="text-3xl font-black text-orange-600">%{val.score}</span>
                               </div>
                               <p className="text-[12px] font-medium text-slate-600 leading-relaxed italic">"{val.reasoning}"</p>
                            </div>
                         ))}
                      </div>

                      {config.signatureRequired && (
                         <div className="mt-auto pt-20 grid grid-cols-2 gap-20">
                            <div className="text-center">
                               <div className="h-16 border-b border-slate-200 mb-4"></div>
                               <p className="text-[8px] font-black text-slate-900 uppercase">AKADEMİK DİREKTÖR</p>
                            </div>
                            <div className="text-center">
                               <div className="h-16 border-b border-slate-200 mb-4"></div>
                               <p className="text-[8px] font-black text-slate-900 uppercase">KLİNİK SÜPERVİZÖR</p>
                            </div>
                         </div>
                      )}
                      <div className="absolute bottom-10 right-10 text-[9px] font-black text-slate-400 uppercase tracking-widest">SAYFA 02</div>
                   </div>
                </div>
              )}

              {activeSections.includes('predictions') && (
                <div className={`pdf-page bg-white w-full shadow-2xl mb-12 relative overflow-hidden ${activePreviewPage !== activeSections.indexOf('predictions') ? 'hidden' : 'block'}`} style={{ width: '210mm', height: '297mm', padding: '25mm' }}>
                   <div className="h-full flex flex-col">
                      <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mb-16 border-b-2 border-slate-900 pb-4">03 // STRATEJİK PROJEKSİYON</h3>
                      <div className="flex-1 space-y-16">
                         <div className="bg-slate-900 p-16 rounded-[4rem] text-white relative overflow-hidden">
                            <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-8">24 AYLIK EVRİM YOLU</span>
                            <p className="text-3xl font-black italic leading-tight tracking-tighter">
                               "{data.payload.report?.predictiveMetrics?.evolutionPath || "Analiz ediliyor..."}"
                            </p>
                         </div>

                         <div className="grid grid-cols-2 gap-10">
                            {[
                               { l: 'SADAKAT', v: data.payload.report?.predictiveMetrics?.retentionProbability || 0, c: 'text-emerald-600' },
                               { l: 'ÖĞRENME', v: data.payload.report?.predictiveMetrics?.learningVelocity || 0, c: 'text-blue-600' },
                               { l: 'LİDERLİK', v: data.payload.report?.predictiveMetrics?.leadershipPotential || 0, c: 'text-orange-600' },
                               { l: 'DİRENÇ', v: 100 - (data.payload.report?.predictiveMetrics?.burnoutRisk || 0), c: 'text-rose-600' }
                            ].map(m => (
                               <div key={m.l} className="p-10 border-2 border-slate-100 rounded-[3rem] flex justify-between items-center">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.l}</span>
                                  <span className={`text-4xl font-black ${m.c}`}>%{m.v}</span>
                               </div>
                            ))}
                         </div>

                         <div className="bg-orange-50 p-12 rounded-[4rem] border border-orange-100">
                            <h5 className="text-[11px] font-black text-orange-800 uppercase tracking-widest mb-6">YÖNETİCİ TAVSİYESİ</h5>
                            <p className="text-[13px] font-bold text-orange-900 leading-relaxed text-justify">
                               {data.payload.report?.recommendation || "Stratejik karar önerisi oluşturuluyor..."}
                            </p>
                         </div>
                      </div>
                      <div className="absolute bottom-10 right-10 text-[9px] font-black text-slate-400 uppercase tracking-widest">SAYFA 03</div>
                   </div>
                </div>
              )}

              {activeSections.includes('strategic') && (
                <div className={`pdf-page bg-white w-full shadow-2xl mb-12 relative overflow-hidden ${activePreviewPage !== activeSections.indexOf('strategic') ? 'hidden' : 'block'}`} style={{ width: '210mm', height: '297mm', padding: '25mm' }}>
                   <div className="h-full flex flex-col">
                      <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mb-16 border-b-2 border-slate-900 pb-4">04 // MÜLAKAT REHBERİ</h3>
                      <div className="space-y-8 flex-1">
                         {data.payload.report?.interviewGuidance?.strategicQuestions ? (
                            <div className="space-y-6">
                               <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Stratejik Soru Havuzu</h5>
                               {data.payload.report.interviewGuidance.strategicQuestions.slice(0, 6).map((q: string, i: number) => (
                                  <div key={i} className="flex gap-8 items-start p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                     <span className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shrink-0">{i+1}</span>
                                     <p className="text-[12px] font-bold italic text-slate-700 leading-relaxed">"{q}"</p>
                                  </div>
                               ))}
                            </div>
                         ) : (
                            <div className="h-full flex items-center justify-center opacity-20">
                               <p className="text-2xl font-black uppercase tracking-widest">Veri Bulunmuyor</p>
                            </div>
                         )}
                      </div>
                      <div className="absolute bottom-10 right-10 text-[9px] font-black text-slate-400 uppercase tracking-widest">SAYFA 04</div>
                   </div>
                </div>
              )}

           </div>

           <div className="flex gap-4 mb-20 no-print">
              <button onClick={() => setActivePreviewPage(p => Math.max(0, p - 1))} className="p-6 bg-white rounded-full shadow-xl hover:bg-slate-900 hover:text-white transition-all">←</button>
              <button onClick={() => setActivePreviewPage(p => Math.min(activeSections.length - 1, p + 1))} className="p-6 bg-white rounded-full shadow-xl hover:bg-slate-900 hover:text-white transition-all">→</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExportStudio;
