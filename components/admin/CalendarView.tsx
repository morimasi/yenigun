
import React, { useState, useMemo } from 'react';
import { Candidate } from '../../types';
import StatusBadge from './StatusBadge';

interface CalendarViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ candidates, onUpdateCandidate }) => {
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showContactMenu, setShowContactMenu] = useState(false);

  const interviewees = useMemo(() => 
    candidates
      .filter(c => c.status === 'interview_scheduled' && c.interviewSchedule)
      .sort((a, b) => {
        const dateA = new Date(`${a.interviewSchedule!.date} ${a.interviewSchedule!.time}`).getTime();
        const dateB = new Date(`${b.interviewSchedule!.date} ${b.interviewSchedule!.time}`).getTime();
        return dateA - dateB;
      }), 
    [candidates]
  );

  const selectedCandidate = interviewees.find(c => c.id === selectedInterviewId);

  const handleStartInterview = () => {
    if (selectedCandidate?.interviewSchedule?.method.toLowerCase().includes('google') || 
        selectedCandidate?.interviewSchedule?.method.toLowerCase().includes('zoom')) {
      window.open(selectedCandidate.interviewSchedule.location, '_blank');
    }
    setSessionNotes(`--- MÜLAKAT OTURUMU (${new Date().toLocaleDateString('tr-TR')}) ---\n\n`);
    setIsInterviewActive(true);
  };

  const handleEndInterview = () => {
    if (!selectedCandidate) return;
    if (window.confirm("Oturumu sonlandırmak istiyor musunuz?")) {
      const updatedNotes = (selectedCandidate.adminNotes || '') + "\n\n" + sessionNotes;
      onUpdateCandidate({ ...selectedCandidate, adminNotes: updatedNotes, updated_at: new Date().toISOString() });
      setIsInterviewActive(false);
      setSelectedInterviewId(null);
    }
  };

  const handleContact = (method: 'whatsapp' | 'call' | 'email') => {
    if (!selectedCandidate) return;
    const phone = selectedCandidate.phone?.replace(/\s/g, '');
    const email = selectedCandidate.email;
    if (method === 'whatsapp') window.open(`https://wa.me/${phone}`, '_blank');
    else if (method === 'call') window.location.href = `tel:${phone}`;
    else window.location.href = `mailto:${email}`;
    setShowContactMenu(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in h-[calc(100vh-14rem)] relative">
      
      {/* CANLI MÜLAKAT OVERLAY (DEĞİŞMEDİ) */}
      {isInterviewActive && selectedCandidate && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-4 md:p-10 animate-fade-in no-print">
          <div className="w-full max-w-7xl h-full bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col">
             <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white text-lg font-black animate-pulse">LIVE</div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h2>
                </div>
                <button onClick={handleEndInterview} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase">OTURUMU BİTİR</button>
             </div>
             <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 border-r border-slate-100 overflow-y-auto p-8 space-y-8 bg-slate-50/20 text-xs">
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aday Analizi</h4>
                   <p className="font-bold text-slate-700 italic">"{selectedCandidate.report?.summary}"</p>
                </div>
                <div className="flex-1 p-8">
                   <textarea autoFocus className="w-full h-full bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 outline-none font-medium text-lg text-slate-800 resize-none" placeholder="Notlarınızı buraya alın..." value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* SOL PANEL: Daraltılmış Takvim Listesi (lg:320px) */}
      <div className={`lg:w-[320px] flex flex-col gap-4 shrink-0 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-2xl opacity-20' : ''}`}>
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl text-white">
           <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">RANDEVULAR</p>
           <p className="text-4xl font-black">{interviewees.length}</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
          {interviewees.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedInterviewId(c.id)}
              className={`p-4 rounded-[2rem] border-2 transition-all cursor-pointer relative ${
                selectedInterviewId === c.id ? 'bg-white border-orange-600 shadow-lg scale-[1.02]' : 'bg-white border-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center ${selectedInterviewId === c.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <span className="text-[10px] font-black leading-none">{c.interviewSchedule?.date.split('-')[2]}</span>
                   <span className="text-[7px] font-black uppercase mt-0.5">{new Date(c.interviewSchedule!.date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-[11px] truncate uppercase">{c.name}</h4>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">{c.interviewSchedule?.time}</span>
                    <span className="text-[7px] font-black text-orange-600 uppercase tracking-tighter">{c.interviewSchedule?.method.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ PANEL: Genişletilmiş Hazırlık Alanı */}
      <div className={`flex-1 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-2xl opacity-20' : ''}`}>
        {selectedCandidate ? (
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-black">{selectedCandidate.name.charAt(0)}</div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{selectedCandidate.name}</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Mülakat Ön Hazırlık</p>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setShowContactMenu(!showContactMenu)} className="px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-[8px] font-black uppercase tracking-widest">İLETİŞİM</button>
                 <button onClick={handleStartInterview} className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg">MÜLAKATI BAŞLAT</button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Lokasyon / Kanal</p>
                    <p className="text-xs font-black text-slate-900">{selectedCandidate.interviewSchedule?.method} - {selectedCandidate.interviewSchedule?.location}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Akademik Özet</p>
                    <p className="text-[10px] font-bold text-slate-600 italic">"{selectedCandidate.report?.summary}"</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-3 border-orange-600 pl-3">Sormanız Gereken Kritik Sorular</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCandidate.report?.swot.threats.slice(0, 4).map((threat, i) => (
                      <div key={i} className="p-5 bg-white border-2 border-slate-50 rounded-2xl hover:border-orange-200 transition-all">
                        <p className="text-[11px] font-bold text-slate-800 leading-relaxed italic">"Raporunuzdaki risklere dayanarak; {threat} durumunda kriz yönetimi planınız nedir?"</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-30">
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">TAKVİM SEÇİN</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
