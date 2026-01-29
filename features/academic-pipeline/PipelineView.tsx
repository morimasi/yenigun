
import React, { useState, useMemo } from 'react';
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
  
  // SEÇİM SİSTEMİ STATE'LERİ
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const name = (c.name || '').toLocaleLowerCase('tr-TR');
      return name.includes(searchInput.toLocaleLowerCase('tr-TR'));
    });
  }, [candidates, searchInput]);

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  // SEÇİM FONKSİYONLARI
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

  const handleCSVExport = () => {
    const targets = candidates.filter(c => checkedIds.has(c.id));
    if (targets.length === 0) {
       // Hiç seçilmemişse filtrelenmiş tüm listeyi çıkar
       exportService.exportCandidatesToCSV(filteredCandidates);
    } else {
       exportService.exportCandidatesToCSV(targets);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[85vh] w-full relative items-stretch">
      
      {/* EXPORT OVERLAY */}
      {isExporting && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-12">
           <div className="bg-white rounded-[4rem] p-16 max-w-lg w-full shadow-3xl text-center space-y-10 animate-scale-in">
              <div className="w-24 h-24 bg-orange-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto animate-bounce shadow-2xl">
                 <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Liyakat Arşivi Paketleniyor</h3>
              <div className="space-y-4">
                 <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-orange-600 transition-all duration-500" style={{ width: `${exportProgress}%` }}></div>
                 </div>
                 <p className="text-5xl font-black text-orange-600 tracking-tighter">%{exportProgress}</p>
              </div>
           </div>
        </div>
      )}

      {/* SOL: KOMPAKT ADAY LİSTESİ */}
      <div className="lg:w-[280px] shrink-0 no-print flex flex-col gap-4">
        
        {/* ARAMA VE ÜST KONTROLLER */}
        <div className="bg-white p-4 rounded-[2.2rem] border border-slate-100 shadow-xl space-y-3">
           <input 
              type="text" 
              placeholder="İsim Sorgula..." 
              className="w-full bg-slate-50 rounded-xl p-3 text-[11px] font-bold outline-none border border-slate-100 focus:border-orange-500 transition-all"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <div className="flex gap-2">
               <button 
                 onClick={toggleAll}
                 className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
               >
                 {checkedIds.size === filteredCandidates.length ? 'SEÇİMİ KALDIR' : 'TÜMÜNÜ SEÇ'}
               </button>
               <button 
                 onClick={handleCSVExport}
                 title="CSV Olarak İndir"
                 className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               </button>
            </div>
        </div>

        {/* BULK ACTION HUD (SEÇİM VARSA GÖZÜKÜR) */}
        {checkedIds.size > 0 && (
          <div className="bg-orange-600 p-5 rounded-[2rem] shadow-2xl text-white animate-slide-up">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest">{checkedIds.size} DOSYA SEÇİLİ</span>
                <button onClick={() => setCheckedIds(new Set())} className="text-[9px] font-bold underline opacity-80">İptal</button>
             </div>
             <button 
               onClick={handleBulkZip}
               className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
             >
                TOPLU PDF (ZIP) İNDİR
             </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-20rem)] pr-1 custom-scrollbar space-y-2">
           {filteredCandidates.map(c => {
              const isChecked = checkedIds.has(c.id);
              return (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3.5 rounded-[1.8rem] border-2 transition-all cursor-pointer group relative flex items-center gap-4 ${
                    selectedId === c.id 
                    ? 'bg-white border-orange-600 shadow-2xl translate-x-1' 
                    : 'bg-white border-slate-50 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <div 
                    onClick={(e) => toggleCheck(c.id, e)}
                    className={`w-5 h-5 rounded-lg border-2 shrink-0 transition-all flex items-center justify-center ${
                      isChecked ? 'bg-orange-600 border-orange-600' : 'border-slate-200 group-hover:border-orange-400'
                    }`}
                  >
                     {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-[11px] truncate uppercase leading-none mb-1.5">{c.name}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">{c.report?.score || '?'} PTS</span>
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight truncate">{c.branch.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              );
           })}
        </div>
      </div>

      {/* SAĞ: PANORAMİK DETAYLI ANALİZ KANVASI */}
      <div className="flex-1 min-w-0 w-full flex flex-col">
        {selectedCandidate ? (
          <div className="animate-scale-in flex-1 flex flex-col">
            <CandidateDetail 
              candidate={selectedCandidate}
              config={config}
              onUpdate={onUpdateCandidate}
              onDelete={() => { if (confirm('Aday sistemden silinsin mi?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); } }}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-[600px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center opacity-30 text-center p-12">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.8em] italic">Rezonans Bekleniyor</h3>
             <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mt-4">Analiz dosyasını aktive etmek için listeden seçim yapın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineView;
