
import React, { useState, useMemo, useRef } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import CandidateDetail from './CandidateDetail';
import { exportService } from '../../services/exportService';

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
  
  // HOVER POP-OVER STATE (FIXED POSITIONING)
  const [hoveredCandidate, setHoveredCandidate] = useState<Candidate | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ top: number, left: number } | null>(null);
  
  // SEÇİM SİSTEMİ STATE'LERİ
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR');
      const isActive = c.status !== 'archived'; // Sadece aktifler
      return isActive && name.includes(searchInput.toLocaleLowerCase('tr-TR'));
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [candidates, searchInput]);

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  const handleMouseEnter = (e: React.MouseEvent, candidate: Candidate) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Kartın sağ kenarının 10px yanına, üst kenarıyla hizalı
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

  const handleBulkZip = async () => {
    const targets = candidates.filter(c => checkedIds.has(c.id) && c.report);
    if (targets.length === 0) {
      alert("Lütfen en az bir analiz edilmiş aday seçiniz.");
      return;
    }
    setIsExporting(true);
    try {
      await exportService.exportAllCandidatesAsZip(targets, setExportProgress);
    } catch (e) {
      alert("ZIP Üretim Hatası.");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden gap-0 bg-white rounded-xl border border-slate-200 shadow-sm relative">
      
      {/* GLOBAL HOVER KPI CARD (FIXED ON TOP OF EVERYTHING) */}
      {hoveredCandidate && hoverPosition && (
        <div 
            className="fixed z-[9999] w-[280px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-5 animate-scale-in pointer-events-none"
            style={{ top: hoverPosition.top, left: hoverPosition.left }}
        >
            {/* Arrow Pointer */}
            <div className="absolute top-6 -left-2 w-4 h-4 bg-slate-900 rotate-45 border-l border-b border-slate-700"></div>

            <div className="relative z-10 space-y-4">
                {/* Header Info */}
                <div className="border-b border-white/10 pb-3">
                    <h5 className="text-[14px] font-black text-white uppercase tracking-tight leading-none">{hoveredCandidate.name}</h5>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold text-orange-400 uppercase tracking-wide">{hoveredCandidate.branch}</span>
                        <span className="text-[9px] font-bold text-slate-400">{hoveredCandidate.experienceYears} Yıl</span>
                    </div>
                </div>

                {/* KPI Metrics */}
                {hoveredCandidate.report ? (
                    <div className="space-y-3">
                        {/* Liyakat Skoru */}
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LİYAKAT SKORU</span>
                                <span className={`text-[12px] font-black ${hoveredCandidate.report.score > 75 ? 'text-emerald-400' : hoveredCandidate.report.score < 50 ? 'text-rose-400' : 'text-orange-400'}`}>
                                    %{hoveredCandidate.report.score}
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all ${hoveredCandidate.report.score > 75 ? 'bg-emerald-500' : hoveredCandidate.report.score < 50 ? 'bg-rose-500' : 'bg-orange-500'}`} 
                                    style={{ width: `${hoveredCandidate.report.score}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Etik Endeksi */}
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ETİK GÜVEN</span>
                                <span className={`text-[12px] font-black ${hoveredCandidate.report.integrityIndex > 80 ? 'text-blue-400' : 'text-slate-300'}`}>
                                    %{hoveredCandidate.report.integrityIndex || 0}
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all" style={{ width: `${hoveredCandidate.report.integrityIndex || 0}%` }}></div>
                            </div>
                        </div>

                        {/* Risk Uyarıları */}
                        {hoveredCandidate.report.socialMaskingScore > 60 && (
                            <div className="bg-rose-500/10 border border-rose-500/30 p-2 rounded-lg flex items-start gap-2 mt-2">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 animate-pulse shrink-0"></div>
                                <div>
                                    <p className="text-[9px] font-black text-rose-400 uppercase">YÜKSEK MASKELEME</p>
                                    <p className="text-[8px] text-rose-300/80 leading-tight">Adayın beyanı ile klinik refleksleri uyuşmuyor.</p>
                                </div>
                            </div>
                        )}
                         
                        {/* Pozitif Highlight */}
                        {hoveredCandidate.report.score > 85 && (
                             <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg flex items-center gap-2 mt-2">
                                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-[9px] font-black text-emerald-400 uppercase">HİPO (YÜKSEK POTANSİYEL)</span>
                             </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Analiz Bekleniyor</span>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* EXPORT OVERLAY */}
      {isExporting && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-12">
           <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center space-y-6 animate-scale-in">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Paketleniyor...</h3>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                 <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${exportProgress}%` }}></div>
              </div>
           </div>
        </div>
      )}

      {/* SOL: ULTRA-KOMPAKT ADAY LİSTESİ (SABİT 320px) */}
      <div className={`${selectedCandidate ? 'w-[320px]' : 'w-full max-w-3xl mx-auto'} flex flex-col border-r border-slate-100 bg-slate-50 transition-all duration-300 shrink-0`}>
        
        {/* LİSTE BAŞLIĞI VE ARAMA */}
        <div className="p-3 border-b border-slate-200 bg-white">
           <div className="relative mb-2">
              <input 
                 type="text" 
                 placeholder="Aday Ara..." 
                 className="w-full bg-slate-50 rounded-lg py-2 pl-8 pr-3 text-[11px] font-bold outline-none border border-slate-200 focus:border-orange-500 transition-all"
                 value={searchInput}
                 onChange={e => setSearchInput(e.target.value)}
               />
               <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filteredCandidates.length} KAYIT</span>
              <button onClick={toggleAll} className="text-[9px] font-bold text-orange-600 hover:underline">
                 {checkedIds.size > 0 ? 'SEÇİMİ KALDIR' : 'TÜMÜNÜ SEÇ'}
              </button>
           </div>
        </div>

        {/* LİSTE İÇERİĞİ */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           {filteredCandidates.map(c => {
              const isSelected = selectedId === c.id;
              const isChecked = checkedIds.has(c.id);
              const score = c.report?.score || 0;
              const scoreColor = score > 75 ? 'text-emerald-600' : score > 50 ? 'text-orange-600' : 'text-slate-400';

              return (
                <div 
                  key={c.id} 
                  onMouseEnter={(e) => handleMouseEnter(e, c)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setSelectedId(c.id)}
                  className={`candidate-card relative px-4 py-3 border-b border-slate-100 cursor-pointer transition-all hover:bg-white flex items-center gap-3 group ${
                    isSelected ? 'bg-white border-l-4 border-l-orange-600 shadow-sm' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div onClick={(e) => toggleCheck(c.id, e)} className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-slate-900 border-slate-900' : 'border-slate-300 hover:border-orange-500'}`}>
                     {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                       <h4 className={`text-[11px] font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{c.name}</h4>
                       <span className={`text-[10px] font-black ${scoreColor}`}>{score > 0 ? `%${score}` : '-'}</span>
                    </div>
                    <p className="text-[9px] font-medium text-slate-400 truncate uppercase">{c.branch}</p>
                  </div>
                </div>
              );
           })}
        </div>
        
        {/* BULK ACTION BAR (ALTTA) */}
        {checkedIds.size > 0 && (
           <div className="p-3 border-t border-slate-200 bg-white">
              <button onClick={handleBulkZip} className="w-full py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600">
                 {checkedIds.size} DOSYAYI İNDİR
              </button>
           </div>
        )}
      </div>

      {/* SAĞ: DETAY PANELİ (KANVAS) */}
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
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Görüntülemek için aday seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
