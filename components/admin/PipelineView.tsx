
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, Branch } from '../../types';
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
  const [filterBranch, setFilterBranch] = useState<string>('ALL');
  
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = (c.name || '').toLocaleLowerCase('tr-TR').includes(searchInput.toLocaleLowerCase('tr-TR'));
      const matchesBranch = filterBranch === 'ALL' || c.branch === filterBranch;
      const isActive = c.status !== 'archived'; 
      return matchesSearch && matchesBranch && isActive;
    }).sort((a, b) => (b.report?.score || 0) - (a.report?.score || 0));
  }, [candidates, searchInput, filterBranch]);

  const selectedCandidate = useMemo(() => 
    candidates.find(c => c.id === selectedId), 
    [candidates, selectedId]
  );

  const toggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCheckedIds(next);
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-slate-100 text-slate-400';
    if (score >= 80) return 'bg-emerald-100 text-emerald-700';
    if (score >= 60) return 'bg-orange-100 text-orange-700';
    return 'bg-rose-100 text-rose-700';
  };

  return (
    <div className="flex h-full gap-6">
      {/* SOL: VERİ TABLOSU (DATA GRID) */}
      <div className={`${selectedCandidate ? 'w-1/2' : 'w-full'} flex flex-col gap-4 transition-all duration-300`}>
        
        {/* TOOLBAR */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm shrink-0">
           <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                 <input 
                   type="text" 
                   placeholder="Aday Ara..." 
                   className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-orange-500 focus:bg-white transition-all"
                   value={searchInput}
                   onChange={e => setSearchInput(e.target.value)}
                 />
                 <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <select 
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 py-2 px-3 rounded-lg outline-none focus:border-orange-500 cursor-pointer"
                value={filterBranch}
                onChange={e => setFilterBranch(e.target.value)}
              >
                 <option value="ALL">Tüm Branşlar</option>
                 {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">{filteredCandidates.length} KAYIT</span>
              {checkedIds.size > 0 && (
                 <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-sm">
                    {checkedIds.size} DOSYAYI İNDİR
                 </button>
              )}
           </div>
        </div>

        {/* COMPACT TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl flex-1 overflow-hidden shadow-sm flex flex-col">
           <div className="overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                       <th className="p-4 w-10 border-b border-slate-200">
                          <input type="checkbox" className="accent-slate-900" onChange={(e) => {
                             if(e.target.checked) setCheckedIds(new Set(filteredCandidates.map(c => c.id)));
                             else setCheckedIds(new Set());
                          }} />
                       </th>
                       <th className="p-3 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">ADAY PROFİLİ</th>
                       <th className="p-3 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">BRANŞ & EĞİTİM</th>
                       <th className="p-3 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">LİYAKAT SKORU</th>
                       <th className="p-3 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">DURUM</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.length === 0 ? (
                       <tr><td colSpan={5} className="p-10 text-center text-xs font-bold text-slate-400 uppercase">Kayıt Bulunamadı</td></tr>
                    ) : (
                       filteredCandidates.map(c => (
                          <tr 
                            key={c.id} 
                            onClick={() => setSelectedId(c.id)}
                            className={`cursor-pointer transition-all hover:bg-blue-50/50 ${selectedId === c.id ? 'bg-orange-50 hover:bg-orange-50' : ''}`}
                          >
                             <td className="p-4" onClick={e => e.stopPropagation()}>
                                <input type="checkbox" className="accent-slate-900" checked={checkedIds.has(c.id)} onChange={() => toggleCheck(c.id)} />
                             </td>
                             <td className="p-3">
                                <div className="flex items-center gap-3">
                                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white ${selectedId === c.id ? 'bg-orange-600' : 'bg-slate-900'}`}>
                                      {c.name.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{c.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase">{c.email}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="p-3">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{c.branch}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{c.experienceYears} YIL • {c.university}</p>
                             </td>
                             <td className="p-3 text-center">
                                <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black ${getScoreColor(c.report?.score)}`}>
                                   %{c.report?.score || '?'}
                                </span>
                             </td>
                             <td className="p-3 text-center">
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${c.status === 'interview_scheduled' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                                   {c.status === 'interview_scheduled' ? 'MÜLAKAT' : 'BEKLEMEDE'}
                                </span>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* SAĞ: DETAY PANELİ (SPLIT VIEW) */}
      {selectedCandidate && (
        <div className="w-1/2 flex flex-col bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-slide-right">
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <CandidateDetail 
                candidate={selectedCandidate}
                config={config}
                onUpdate={onUpdateCandidate}
                onDelete={() => { if(confirm('Silinsin mi?')) { onDeleteCandidate(selectedCandidate.id); setSelectedId(null); }}}
              />
           </div>
           <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setSelectedId(null)} className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest px-4">Kapat</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PipelineView;
