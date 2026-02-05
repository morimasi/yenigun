
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

  const handleBulkDelete = async () => {
    if (!confirm(`${checkedIds.size} adet aday kalıcı olarak silinecek. Onaylıyor musunuz?`)) return;
    setIsProcessing(true);
    setProcessStatus('Siliniyor');
    const ids = Array.from(checkedIds);
    let completed = 0;
    for (const id of ids) {
        try {
            onDeleteCandidate(id);
            completed++;
            setProcessProgress(Math.round((completed / ids.length) * 100));
            await new Promise(r => setTimeout(r, 50)); 
        } catch (e) { console.error(id); }
    }
    setCheckedIds(new Set());
    setIsProcessing(false);
    onRefresh();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden gap-0 bg-white rounded-xl border border-slate-200 shadow-sm relative flex-col lg:flex-row">
      
      {/* PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
           <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center space-y-6">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
              <h3 className="text-lg font-black text-slate-900 uppercase">{processStatus}...</h3>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                 <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${processProgress}%` }}></div>
              </div>
           </div>
        </div>
      )}

      {/* SOL: ADAY LİSTESİ (Mobilde Detay Açıkken Gizlenir) */}
      <div className={`${selectedCandidate ? 'hidden lg:flex lg:w-[320px]' : 'flex w-full'} flex-col border-r border-slate-100 bg-slate-50 transition-all duration-300 shrink-0`}>
        <div className="p-4 border-b border-slate-200 bg-white space-y-4">
           <div className="relative">
              <input type="text" placeholder="Aday Ara..." className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all shadow-inner" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredCandidates.length} KAYIT</span>
              <button onClick={toggleAll} className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">{checkedIds.size > 0 ? 'SEÇİMİ KALDIR' : 'TÜMÜNÜ SEÇ'}</button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
           {filteredCandidates.map(c => {
              const isSelected = selectedId === c.id;
              const isChecked = checkedIds.has(c.id);
              return (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedId(c.id)}
                  className={`relative px-4 py-4 md:py-3 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 flex items-center gap-4 ${isSelected ? 'bg-orange-50 border-l-4 border-l-orange-600' : 'border-l-4 border-l-transparent'}`}
                >
                  <div onClick={(e) => toggleCheck(c.id, e)} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-slate-950 border-slate-950' : 'border-slate-200 hover:border-orange-500'}`}>
                     {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                       <h4 className={`text-[13px] md:text-[11px] font-black uppercase truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{c.name}</h4>
                       <span className={`text-[11px] font-black ${c.report ? (c.report.score > 75 ? 'text-emerald-600' : 'text-orange-600') : 'text-slate-300'}`}>{c.report ? `%${c.report.score}` : '-'}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tight">{c.branch}</p>
                  </div>
                </div>
              );
           })}
        </div>
        
        {checkedIds.size > 0 && (
           <div className="p-3 border-t border-slate-100 bg-white grid grid-cols-3 gap-2">
              <button onClick={handleBulkDelete} className="py-3 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex flex-col items-center gap-1 shadow-sm">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg>
                 SİL ({checkedIds.size})
              </button>
              <button onClick={handleBulkZip} className="py-3 bg-orange-50 text-orange-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all flex flex-col items-center gap-1 col-span-2 shadow-sm">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
                 TOPLU ZIP PAKETİ İNDİR
              </button>
           </div>
        )}
      </div>

      {/* SAĞ: DETAY PANELİ */}
      <div className={`${selectedCandidate ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-white overflow-hidden relative z-0`}>
        {selectedCandidate ? (
          <>
            {/* Mobile Nav Header */}
            <div className="lg:hidden flex items-center gap-4 p-4 border-b border-slate-100 bg-white shrink-0">
               <button onClick={() => setSelectedId(null)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <div className="min-w-0">
                  <h3 className="text-sm font-black uppercase truncate leading-none">{selectedCandidate.name}</h3>
                  <p className="text-[10px] font-bold text-orange-600 uppercase mt-1">Dosya Detayı</p>
               </div>
            </div>
            <CandidateDetail 
                candidate={selectedCandidate}
                config={config}
                onUpdate={onUpdateCandidate}
                onDelete={() => { if (confirm('Silinsin mi?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
             <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             </div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">MIA ANALİZ MERKEZİ</p>
             <p className="text-[9px] font-bold text-slate-300 uppercase mt-2 tracking-widest">İncelemek için sol listeden bir dosya seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
