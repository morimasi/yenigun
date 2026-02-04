
import React, { useState, useMemo, useRef } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import CandidateDetail from './CandidateDetail';
import { exportService } from '../../services/exportService';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';

interface PipelineViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({ candidates, config, onUpdateCandidate, onDeleteCandidate, onRefresh }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  
  // HOVER POP-OVER STATE
  const [hoveredCandidate, setHoveredCandidate] = useState<Candidate | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ top: number, left: number } | null>(null);
  
  // SEÇİM & İŞLEM STATE'LERİ
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [processProgress, setProcessProgress] = useState(0);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR');
      const isActive = c.status !== 'archived'; 
      return isActive && name.includes(searchInput.toLocaleLowerCase('tr-TR'));
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [candidates, searchInput]);

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  // --- ACTIONS ---

  const handleMouseEnter = (e: React.MouseEvent, candidate: Candidate) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ top: rect.top, left: rect.right + 12 });
    setHoveredCandidate(candidate);
  };

  const handleMouseLeave = () => {
    setHoveredCandidate(null);
    setHoverPosition(null);
  };

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const toggleAll = () => {
    if (checkedIds.size === filteredCandidates.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filteredCandidates.map(c => c.id)));
    }
  };

  // 1. TOPLU ZIP İNDİRME
  const handleBulkZip = async () => {
    const targets = candidates.filter(c => checkedIds.has(c.id) && c.report);
    if (targets.length === 0) return alert("Lütfen en az bir analiz edilmiş aday seçiniz.");
    
    setIsProcessing(true);
    setProcessStatus('Paketleniyor');
    try {
      await exportService.exportAllCandidatesAsZip(targets, setProcessProgress);
    } catch (e) {
      alert("ZIP Üretim Hatası.");
    } finally {
      setIsProcessing(false);
      setProcessProgress(0);
    }
  };

  // 2. TOPLU SİLME
  const handleBulkDelete = async () => {
    if (!confirm(`${checkedIds.size} adet aday kalıcı olarak silinecek. Bu işlem geri alınamaz! Onaylıyor musunuz?`)) return;
    
    setIsProcessing(true);
    setProcessStatus('Siliniyor');
    const ids = Array.from(checkedIds);
    let completed = 0;

    for (const id of ids) {
        try {
            onDeleteCandidate(id);
            completed++;
            setProcessProgress(Math.round((completed / ids.length) * 100));
            // UI Thread'i bloklamamak için minik gecikme
            await new Promise(r => setTimeout(r, 50)); 
        } catch (e) {
            console.error(`Silme hatası ID: ${id}`);
        }
    }
    
    setCheckedIds(new Set());
    setIsProcessing(false);
    setProcessStatus('');
    setProcessProgress(0);
    onRefresh(); // Listeyi tazele
  };

  // 3. TOPLU AI ANALİZİ (SEQUENTIAL PROCESSING)
  const handleBulkAnalyze = async () => {
    const targets = candidates.filter(c => checkedIds.has(c.id));
    if (targets.length === 0) return;
    if (!confirm(`${targets.length} aday için Nöral Analiz motoru çalıştırılacak. Bu işlem zaman alabilir. Başlatılsın mı?`)) return;

    setIsProcessing(true);
    setProcessStatus('Analiz Ediliyor');
    let completed = 0;

    for (const candidate of targets) {
        try {
            // Algoritmik Hesaplama
            const algoReport = calculateAlgorithmicAnalysis(candidate, config);
            
            // AI Generative Analiz
            const aiReport = await generateCandidateAnalysis(candidate, config);
            
            // Güncelleme ve Kayıt
            onUpdateCandidate({ 
                ...candidate, 
                report: aiReport, 
                algoReport: algoReport, 
                timestamp: Date.now() 
            });

            completed++;
            setProcessProgress(Math.round((completed / targets.length) * 100));
            
            // Rate Limit Koruması (2 saniye soğuma)
            await new Promise(r => setTimeout(r, 2000));

        } catch (e) {
            console.error(`Analiz hatası: ${candidate.name}`, e);
        }
    }

    setIsProcessing(false);
    setProcessStatus('');
    setProcessProgress(0);
    alert("Toplu analiz tamamlandı.");
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden gap-0 bg-white rounded-xl border border-slate-200 shadow-sm relative">
      
      {/* GLOBAL HOVER KPI CARD */}
      {hoveredCandidate && hoverPosition && (
        <div 
            className="fixed z-[9999] w-[280px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-5 animate-scale-in pointer-events-none"
            style={{ top: hoverPosition.top, left: hoverPosition.left }}
        >
            <div className="absolute top-6 -left-2 w-4 h-4 bg-slate-900 rotate-45 border-l border-b border-slate-700"></div>
            <div className="relative z-10 space-y-4">
                <div className="border-b border-white/10 pb-3">
                    <h5 className="text-[14px] font-black text-white uppercase tracking-tight leading-none">{hoveredCandidate.name}</h5>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold text-orange-400 uppercase tracking-wide">{hoveredCandidate.branch}</span>
                        <span className="text-[9px] font-bold text-slate-400">{hoveredCandidate.experienceYears} Yıl</span>
                    </div>
                </div>
                {hoveredCandidate.report ? (
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LİYAKAT SKORU</span>
                                <span className={`text-[12px] font-black ${hoveredCandidate.report.score > 75 ? 'text-emerald-400' : 'text-orange-400'}`}>%{hoveredCandidate.report.score}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full transition-all ${hoveredCandidate.report.score > 75 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${hoveredCandidate.report.score}%` }}></div></div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center"><span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Analiz Bekleniyor</span></div>
                )}
            </div>
        </div>
      )}

      {/* PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-12">
           <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center space-y-6 animate-scale-in">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
              <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{processStatus}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">Lütfen pencereyi kapatmayınız.</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                 <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${processProgress}%` }}></div>
              </div>
              <p className="text-[12px] font-black text-orange-600">%{processProgress}</p>
           </div>
        </div>
      )}

      {/* SOL: ADAY LİSTESİ */}
      <div className={`${selectedCandidate ? 'w-[320px]' : 'w-full max-w-3xl mx-auto'} flex flex-col border-r border-slate-100 bg-slate-50 transition-all duration-300 shrink-0`}>
        
        {/* HEADER */}
        <div className="p-3 border-b border-slate-200 bg-white">
           <div className="relative mb-2">
              <input type="text" placeholder="Aday Ara..." className="w-full bg-slate-50 rounded-lg py-2 pl-8 pr-3 text-[11px] font-bold outline-none border border-slate-200 focus:border-orange-500 transition-all" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filteredCandidates.length} KAYIT</span>
              <button onClick={toggleAll} className="text-[9px] font-bold text-orange-600 hover:underline">{checkedIds.size > 0 ? 'SEÇİMİ KALDIR' : 'TÜMÜNÜ SEÇ'}</button>
           </div>
        </div>

        {/* LİSTE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           {filteredCandidates.map(c => {
              const isSelected = selectedId === c.id;
              const isChecked = checkedIds.has(c.id);
              return (
                <div 
                  key={c.id} 
                  onMouseEnter={(e) => handleMouseEnter(e, c)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setSelectedId(c.id)}
                  className={`candidate-card relative px-4 py-3 border-b border-slate-100 cursor-pointer transition-all hover:bg-white flex items-center gap-3 group ${isSelected ? 'bg-white border-l-4 border-l-orange-600 shadow-sm' : 'border-l-4 border-l-transparent'}`}
                >
                  <div onClick={(e) => toggleCheck(c.id, e)} className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-slate-900 border-slate-900' : 'border-slate-300 hover:border-orange-500'}`}>
                     {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                       <h4 className={`text-[11px] font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{c.name}</h4>
                       <span className={`text-[10px] font-black ${c.report ? (c.report.score > 75 ? 'text-emerald-600' : 'text-orange-600') : 'text-slate-300'}`}>{c.report ? `%${c.report.score}` : '-'}</span>
                    </div>
                    <p className="text-[9px] font-medium text-slate-400 truncate uppercase">{c.branch}</p>
                  </div>
                </div>
              );
           })}
        </div>
        
        {/* BULK ACTION BAR */}
        {checkedIds.size > 0 && (
           <div className="p-2 border-t border-slate-200 bg-white grid grid-cols-3 gap-2">
              <button onClick={handleBulkDelete} className="py-2 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex flex-col items-center justify-center gap-1">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 SİL ({checkedIds.size})
              </button>
              <button onClick={handleBulkAnalyze} className="py-2 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex flex-col items-center justify-center gap-1">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 ANALİZ ET
              </button>
              <button onClick={handleBulkZip} className="py-2 bg-orange-50 text-orange-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all flex flex-col items-center justify-center gap-1">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                 ZIP İNDİR
              </button>
           </div>
        )}
      </div>

      {/* SAĞ: DETAY PANELİ */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative z-0">
        {selectedCandidate ? (
          <CandidateDetail 
            candidate={selectedCandidate}
            config={config}
            onUpdate={onUpdateCandidate}
            onDelete={() => { if (confirm('Silinsin mi?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
             <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Görüntülemek için aday seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
