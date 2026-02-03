
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Candidate, ArchiveCategory, TrainingSlide } from '../../types';

interface ArchiveViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

// @fix: Added missing 'STAFF_HISTORY' and 'PERFORMANCE_SNAPSHOT' to CATEGORY_MAP for complete ArchiveCategory coverage.
const CATEGORY_MAP: Record<ArchiveCategory, { label: string, color: string, indicator: string }> = {
  TALENT_POOL: { label: 'YETENEK HAVUZU', color: 'text-emerald-600', indicator: 'bg-emerald-500' },
  FUTURE_REFERENCE: { label: 'GELECEK BAŞVURU', color: 'text-blue-600', indicator: 'bg-blue-500' },
  DISQUALIFIED: { label: 'DİSKALİFİYE', color: 'text-slate-500', indicator: 'bg-slate-400' },
  BLACK_LIST: { label: 'KARA LİSTE', color: 'text-rose-600', indicator: 'bg-rose-600' },
  HIRED_CONTRACTED: { label: 'KADROLU PERSONEL', color: 'text-slate-900', indicator: 'bg-slate-900' },
  PRESENTATION_LIBRARY: { label: 'SUNUM KÜTÜPHANESİ', color: 'text-orange-600', indicator: 'bg-orange-500' },
  STAFF_HISTORY: { label: 'PERSONEL GEÇMİŞİ', color: 'text-slate-400', indicator: 'bg-slate-300' },
  PERFORMANCE_SNAPSHOT: { label: 'PERFORMANS ÖZETİ', color: 'text-indigo-600', indicator: 'bg-indigo-500' }
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState({ category: 'ALL', search: '' });
  const [isPlayingPresentation, setIsPlayingPresentation] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const archivedCandidates = useMemo(() => 
    candidates.filter(c => c.status === 'archived').sort((a, b) => b.timestamp - a.timestamp), 
    [candidates]
  );

  const filteredList = useMemo(() => {
    return archivedCandidates.filter(c => {
      const matchesCat = filter.category === 'ALL' || c.archiveCategory === filter.category;
      const matchesSearch = c.name.toLocaleLowerCase('tr-TR').includes(filter.search.toLocaleLowerCase('tr-TR')) || 
                            c.branch.toLocaleLowerCase('tr-TR').includes(filter.search.toLocaleLowerCase('tr-TR'));
      return matchesCat && matchesSearch;
    });
  }, [archivedCandidates, filter]);

  const selectedCandidate = useMemo(() => 
    archivedCandidates.find(c => c.id === selectedId), 
    [archivedCandidates, selectedId]
  );

  const handleRestore = (candidate: Candidate) => {
    if (confirm("GÜVENLİK PROTOKOLÜ: Bu dosya üzerindeki 'Mühür' kaldırılacak ve aday aktif havuza taşınacaktır. Onaylıyor musunuz?")) {
      onUpdateCandidate({ ...candidate, status: 'pending', timestamp: Date.now() });
      setSelectedId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("KRİTİK İŞLEM: Bu kayıt veritabanından kalıcı olarak silinecek. Geri alınamaz. Devam edilsin mi?")) {
      onDeleteCandidate(id);
      setSelectedId(null);
    }
  };

  const handlePlayPresentation = () => {
    setIsPlayingPresentation(true);
    setActiveSlideIdx(0);
  };

  // Keyboard navigation for presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isPlayingPresentation || !selectedCandidate?.report?.presentationSlides) return;
        
        const total = selectedCandidate.report.presentationSlides.length;
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            setActiveSlideIdx(p => Math.min(total - 1, p + 1));
        } else if (e.key === 'ArrowLeft') {
            setActiveSlideIdx(p => Math.max(0, p - 1));
        } else if (e.key === 'Escape') {
            setIsPlayingPresentation(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayingPresentation, selectedCandidate]);

  if (isPlayingPresentation && selectedCandidate?.report?.presentationSlides) {
      const slides = selectedCandidate.report.presentationSlides;
      const slide = slides[activeSlideIdx];
      
      return (
        <div className="fixed inset-0 z-[2000] bg-slate-950 text-white flex flex-col overflow-hidden">
            <div className="absolute top-6 right-6 z-[2001] flex gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{activeSlideIdx + 1} / {slides.length}</div>
                <button onClick={() => setIsPlayingPresentation(false)} className="p-3 bg-rose-600/20 hover:bg-rose-600 rounded-full transition-all text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="flex-1 flex flex-col p-16 md:p-32 justify-center h-screen relative z-10">
                {slide.type === 'title' ? (
                   <div className="text-center space-y-12 animate-scale-in origin-center">
                      <div className="inline-flex items-center gap-4 px-8 py-3 border border-orange-500/30 bg-orange-500/10 rounded-full backdrop-blur-md mx-auto">
                         <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                         <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em]">AKADEMİK ARŞİV</span>
                      </div>
                      <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 drop-shadow-2xl">
                        {slide.title}
                      </h1>
                      <p className="text-2xl md:text-4xl font-bold text-slate-400 italic max-w-5xl mx-auto leading-relaxed">{slide.subtitle}</p>
                   </div>
                ) : (
                   <div className="grid grid-cols-12 gap-20 h-full items-center">
                      <div className="col-span-7 space-y-16">
                         <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none border-l-[16px] border-orange-600 pl-10 text-white">
                           {slide.title}
                         </h2>
                         <div className="space-y-8 pl-14">
                            {(slide.content || []).map((point, i) => (
                               <p key={i} className="text-3xl font-bold text-slate-300 leading-snug flex gap-6"><span className="text-orange-600">▪</span> {point}</p>
                            ))}
                         </div>
                      </div>
                      <div className="col-span-5 flex flex-col gap-10 justify-center">
                         {slide.interactiveElement && (
                            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(234,88,12,0.4)] relative overflow-hidden group">
                               <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block mb-4 relative z-10">TARTIŞMA</span>
                               <p className="text-2xl font-black uppercase italic relative z-10 text-white">"{slide.interactiveElement.question}"</p>
                            </div>
                         )}
                         <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-sm relative overflow-hidden">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">VAKA ÖRNEĞİ</span>
                            <p className="text-xl font-bold text-slate-400 italic leading-relaxed">"{slide.visualPrompt}"</p>
                         </div>
                      </div>
                   </div>
                )}
            </div>
            
            {/* Nav Controls */}
            <div className="fixed bottom-0 left-0 w-full p-8 flex justify-center z-[100]">
                <div className="flex gap-4">
                    <button onClick={() => setActiveSlideIdx(p => Math.max(0, p - 1))} className="p-4 bg-white/10 hover:bg-white hover:text-slate-900 rounded-full transition-all text-white backdrop-blur-md">←</button>
                    <button onClick={() => setActiveSlideIdx(p => Math.min(slides.length - 1, p + 1))} className="p-4 bg-white/10 hover:bg-white hover:text-slate-900 rounded-full transition-all text-white backdrop-blur-md">→</button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex h-full bg-white rounded-lg border border-slate-200 overflow-hidden">
      
      {/* SOL: VERİ LİSTESİ (MASTER) */}
      <div className="w-[400px] flex flex-col border-r border-slate-200 bg-white shrink-0">
        {/* Filtre Alanı */}
        <div className="p-3 border-b border-slate-200 space-y-3 bg-slate-50/50">
           <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                 ARŞİV KAYITLARI ({filteredList.length})
              </h3>
           </div>
           
           <div className="flex gap-2">
              <select 
                className="flex-1 bg-white border border-slate-200 text-[10px] font-bold rounded-md py-1.5 px-2 outline-none focus:border-orange-500 uppercase"
                value={filter.category}
                onChange={e => setFilter({...filter, category: e.target.value})}
              >
                 <option value="ALL">TÜM KATEGORİLER</option>
                 {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                 ))}
              </select>
           </div>
           
           <div className="relative">
              <input 
                 type="text" 
                 placeholder="İsim veya Ref No..." 
                 className="w-full bg-white border border-slate-200 rounded-md py-1.5 pl-8 pr-2 text-[10px] font-bold outline-none focus:border-orange-500 transition-all uppercase"
                 value={filter.search}
                 onChange={e => setFilter({...filter, search: e.target.value})}
              />
              <svg className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {filteredList.map(c => {
              const cat = CATEGORY_MAP[c.archiveCategory || 'FUTURE_REFERENCE'];
              const isSelected = selectedId === c.id;
              const isPresentation = c.archiveCategory === 'PRESENTATION_LIBRARY';
              
              return (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedId(c.id)}
                  className={`px-4 py-3 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 group ${isSelected ? 'bg-slate-50 border-l-4 border-l-slate-900' : 'border-l-4 border-l-transparent'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <span className={`text-[11px] font-black uppercase truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{c.name}</span>
                      <span className="text-[9px] font-mono text-slate-400">{new Date(c.timestamp).toLocaleDateString('tr-TR')}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{c.branch}</span>
                         <span className={`text-[8px] font-black uppercase mt-1 ${cat.color} flex items-center gap-1.5`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${cat.indicator}`}></div>
                            {cat.label}
                         </span>
                      </div>
                      {isPresentation ? (
                          <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      ) : (
                          c.report && <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-900 transition-colors">SKOR: %{c.report.score}</span>
                      )}
                   </div>
                </div>
              );
           })}
        </div>
      </div>

      {/* SAĞ: DOSYA DETAYI (DETAIL) */}
      <div className="flex-1 bg-slate-50/30 flex flex-col overflow-hidden relative">
         {selectedCandidate ? (
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               
               {/* DOSYA HEADER */}
               <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-6">
                     <div className={`w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-2xl font-black shadow-sm ${selectedCandidate.archiveCategory === 'PRESENTATION_LIBRARY' ? 'text-orange-500' : 'text-slate-300'}`}>
                        {selectedCandidate.archiveCategory === 'PRESENTATION_LIBRARY' ? 'S' : selectedCandidate.name.charAt(0)}
                     </div>
                     <div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">{selectedCandidate.name}</h1>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <span>{selectedCandidate.branch}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span>REF: {selectedCandidate.id}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className={`inline-block px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${
                        CATEGORY_MAP[selectedCandidate.archiveCategory || 'FUTURE_REFERENCE'].color
                     } border-current opacity-80`}>
                        {CATEGORY_MAP[selectedCandidate.archiveCategory || 'FUTURE_REFERENCE'].label}
                     </span>
                     <p className="text-[9px] font-mono text-slate-400 mt-2">TARİH: {new Date(selectedCandidate.timestamp).toLocaleString('tr-TR')}</p>
                  </div>
               </div>

               {/* KARAR METNİ */}
               <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">ARŞİV NOTU / AÇIKLAMA</h4>
                  <p className="text-[12px] font-medium text-slate-700 leading-relaxed font-mono">
                     "{selectedCandidate.archiveNote || 'Sistem tarafından otomatik arşivlenmiştir.'}"
                  </p>
               </div>

               {/* SUNUM İSE PLAYER GÖSTER */}
               {selectedCandidate.archiveCategory === 'PRESENTATION_LIBRARY' && selectedCandidate.report?.presentationSlides ? (
                   <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group">
                       <div className="relative z-10">
                           <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <h3 className="text-2xl font-black uppercase tracking-tight mb-2">AKADEMİK SUNUMU BAŞLAT</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">{selectedCandidate.report.presentationSlides.length} SLAYT • HAZIRLIKLI OYNATICI</p>
                           <button onClick={handlePlayPresentation} className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-xl">TAM EKRAN OYNAT</button>
                       </div>
                       <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[80px]"></div>
                   </div>
               ) : (
                   /* STANDARD ADAY VERİLERİ */
                   <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-white p-5 rounded-xl border border-slate-200">
                         <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">PROFİL ÖZETİ</h5>
                         <ul className="space-y-2">
                            <li className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-1">
                               <span className="text-slate-500">DENEYİM</span>
                               <span className="text-slate-900">{selectedCandidate.experienceYears} YIL</span>
                            </li>
                            <li className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-1">
                               <span className="text-slate-500">ÜNİVERSİTE</span>
                               <span className="text-slate-900 truncate max-w-[150px]">{selectedCandidate.university}</span>
                            </li>
                         </ul>
                      </div>
                      
                      {selectedCandidate.report && (
                         <div className="bg-slate-900 p-5 rounded-xl text-white">
                            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">LİYAKAT SKORU</h5>
                            <div className="flex items-end gap-4 mb-4">
                               <span className="text-4xl font-black text-white">%{selectedCandidate.report.score}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500" style={{ width: `${selectedCandidate.report.score}%` }}></div>
                            </div>
                         </div>
                      )}
                   </div>
               )}

               {/* ACTIONS */}
               <div className="flex gap-4 pt-4 border-t border-slate-200 mt-8">
                  {selectedCandidate.archiveCategory !== 'PRESENTATION_LIBRARY' && (
                      <button 
                         onClick={() => handleRestore(selectedCandidate)}
                         className="flex-1 py-3 bg-white border border-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                      >
                         HAVUZA GERİ YÜKLE
                      </button>
                  )}
                  <button 
                     onClick={() => handleDelete(selectedCandidate.id)}
                     className="px-6 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                  >
                     SİL
                  </button>
               </div>

            </div>
         ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">DOSYA SEÇİLMEDİ</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default ArchiveView;
