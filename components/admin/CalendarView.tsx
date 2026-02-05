
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, ArchiveCategory } from '../../types';
import StatusBadge from './StatusBadge';

interface CalendarViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ candidates, onUpdateCandidate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null);

  // Haftalık günleri hesapla
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const scheduledCandidates = useMemo(() => 
    candidates.filter(c => c.status === 'interview_scheduled' && c.interviewSchedule),
    [candidates]
  );

  // Çakışma Kontrolü (Aynı gün ve saatte birden fazla mülakat)
  const conflicts = useMemo(() => {
    const map: Record<string, string[]> = {};
    scheduledCandidates.forEach(c => {
      const key = `${c.interviewSchedule?.date}-${c.interviewSchedule?.time}`;
      if (!map[key]) map[key] = [];
      map[key].push(c.id);
    });
    return Object.values(map).filter(ids => ids.length > 1).flat();
  }, [scheduledCandidates]);

  const getCandidatesForDay = (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    return scheduledCandidates
      .filter(c => c.interviewSchedule?.date === dStr)
      .sort((a, b) => (a.interviewSchedule?.time || '').localeCompare(b.interviewSchedule?.time || ''));
  };

  const handleStatusUpdate = (candidate: Candidate, newStatus: 'hired' | 'rejected') => {
    const label = newStatus === 'hired' ? 'İşe Alındı' : 'Reddedildi';
    if (confirm(`Aday '${label}' olarak işaretlenecek ve otomatik olarak akademik arşive taşınacaktır. Onaylıyor musunuz?`)) {
      // @fix: Changed string literals to ArchiveCategory enum members for type safety.
      onUpdateCandidate({ 
        ...candidate, 
        status: 'archived', 
        archiveCategory: newStatus === 'hired' ? ArchiveCategory.HIRED_CONTRACTED : ArchiveCategory.DISQUALIFIED,
        archiveNote: `OTOMATİK KARAR: Mülakat sonucu '${label}' olarak sisteme işlendi. İşlem Tarihi: ${new Date().toLocaleString('tr-TR')}`,
        timestamp: Date.now() 
      });
      setSelectedId(null);
    }
  };

  const formatMonth = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(currentDate);

  const selectedCandidate = scheduledCandidates.find(c => c.id === selectedId);

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] animate-fade-in relative">
      
      {/* HEADER: KONTROL MERKEZİ */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">BUGÜN</button>
            <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{formatMonth}</h3>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">YÜKSEK LİYAKAT</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RİSKLİ/SINIR</span>
           </div>
           {conflicts.length > 0 && (
             <div className="flex items-center gap-3 animate-pulse bg-rose-50 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">{conflicts.length / 2} ÇAKIŞMA TESPİT EDİLDİ</span>
             </div>
           )}
        </div>
      </div>

      {/* GRID SYSTEM */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">
                {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(day)}
              </p>
              <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                day.toDateString() === new Date().toDateString() ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-900'
              }`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-4 overflow-y-auto custom-scrollbar pr-2">
          {weekDays.map((day, i) => {
            const dayCandidates = getCandidatesForDay(day);
            return (
              <div key={i} className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 min-h-[400px] p-3 space-y-3 flex flex-col">
                {dayCandidates.length > 0 ? (
                  dayCandidates.map(c => {
                    const isConflict = conflicts.includes(c.id);
                    const meritColor = c.report ? (c.report.score > 75 ? 'border-emerald-500 bg-emerald-50/30' : c.report.score > 40 ? 'border-orange-500 bg-orange-50/30' : 'border-rose-500 bg-rose-50/30') : 'border-slate-200 bg-white';
                    
                    const previewQuestions = c.report?.interviewGuidance?.phases?.flatMap(p => p.questions.map(q => q.text)) || [];

                    return (
                      <div 
                        key={c.id}
                        onMouseEnter={() => setShowQuickActions(c.id)}
                        onMouseLeave={() => setShowQuickActions(null)}
                        onClick={() => setSelectedId(c.id)}
                        className={`p-4 rounded-[2rem] border-2 transition-all cursor-pointer relative group ${
                          selectedId === c.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02] -translate-y-1' : `hover:shadow-xl ${meritColor}`
                        } ${isConflict && selectedId !== c.id ? 'animate-pulse ring-2 ring-rose-500 ring-offset-2' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-black ${selectedId === c.id ? 'text-orange-500' : 'text-slate-900'}`}>{c.interviewSchedule?.time}</span>
                          {isConflict && <div className="w-2 h-2 bg-rose-600 rounded-full"></div>}
                        </div>
                        <h4 className={`text-[11px] font-black uppercase truncate leading-tight ${selectedId === c.id ? 'text-white' : 'text-slate-900'}`}>{c.name}</h4>
                        <p className={`text-[8px] font-bold uppercase mt-1 opacity-60 ${selectedId === c.id ? 'text-slate-400' : 'text-slate-500'}`}>{c.branch.split(' ')[0]}</p>
                        
                        {/* PEEK ACTIONS (HOVER) */}
                        {showQuickActions === c.id && selectedId !== c.id && (
                          <div className="absolute top-0 left-full ml-4 z-50 w-64 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-scale-in">
                             <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-4">Mülakat Önizleme</p>
                             <div className="space-y-4">
                                {previewQuestions.slice(0, 2).map((q, idx) => (
                                  <div key={idx} className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-700 leading-relaxed italic">"{q}"</p>
                                  </div>
                                ))}
                                {!c.report && <p className="text-[10px] font-black text-slate-300 uppercase">Analiz Tamamlanmadı</p>}
                             </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center opacity-10">
                    <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL DRAWER / OVERLAY */}
      {selectedId && selectedCandidate && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-end p-8 no-print animate-fade-in">
           <div className="w-full max-w-2xl bg-white h-full rounded-[4.5rem] shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-slide-right relative">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-xl">
                       {selectedCandidate.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedCandidate.name}</h3>
                       <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.4em] mt-2">{selectedCandidate.interviewSchedule?.date} • {selectedCandidate.interviewSchedule?.time}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedId(null)} className="p-4 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Liyakat Spektrumu</p>
                       <div className="flex items-end gap-3 mb-4">
                          <span className="text-5xl font-black text-slate-900 leading-none">%{selectedCandidate.report?.score || '?'}</span>
                          <span className="text-[10px] font-bold text-orange-600 uppercase mb-2">GENEL SKOR</span>
                       </div>
                       <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                          <div className="h-full bg-orange-600" style={{ width: `${selectedCandidate.report?.score || 0}%` }}></div>
                       </div>
                    </div>
                    <div className="p-8 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-center">
                       <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Kritik Branş</p>
                       <p className="text-xl font-black uppercase tracking-tighter">{selectedCandidate.branch}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{selectedCandidate.experienceYears} Yıllık Saha Tecrübesi</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">STRATEJİK MÜLAKAT REHBERİ</h4>
                    {selectedCandidate.report?.interviewGuidance ? (
                       <div className="space-y-4">
                          {(selectedCandidate.report.interviewGuidance.phases?.flatMap(p => p.questions.map(q => q.text)) || []).map((q, i) => (
                             <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-orange-500 transition-all group">
                                <div className="flex gap-5">
                                   <span className="w-10 h-10 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-black text-xs shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">{i+1}</span>
                                   <p className="text-[13px] font-bold text-slate-700 leading-relaxed italic">"{q}"</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="p-10 border-2 border-dashed border-slate-100 rounded-[3rem] text-center opacity-30">
                          <p className="text-[10px] font-black uppercase">Analiz Verisi Bulunmuyor</p>
                       </div>
                    )}
                 </div>

                 <div className="bg-orange-50 p-10 rounded-[4rem] border border-orange-100">
                    <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">MÜLAKAT SONRASI AKSİYONLAR</h5>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => handleStatusUpdate(selectedCandidate, 'hired')} className="p-6 bg-slate-900 text-white rounded-[2rem] text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">İşe Alım Yap</button>
                       <button onClick={() => handleStatusUpdate(selectedCandidate, 'rejected')} className="p-6 bg-white border border-rose-100 text-rose-500 rounded-[2rem] text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">Reddet (Negatif)</button>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-white border-t border-slate-50 flex gap-4">
                 <button className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">ERTELE (GELECEK SÜRÜM)</button>
                 <button onClick={() => setSelectedId(null)} className="px-10 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">Kapat</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
