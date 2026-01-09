
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate } from '../../types';

interface CalendarViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ candidates, onUpdateCandidate }) => {
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showContactMenu, setShowContactMenu] = useState(false);
  const [timer, setTimer] = useState(0);

  // Mülakat süresi takibi
  useEffect(() => {
    let interval: any;
    if (isInterviewActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    if (!selectedCandidate) return;
    
    // Video konferans ise linki aç
    if (selectedCandidate.interviewSchedule?.location.startsWith('http')) {
      window.open(selectedCandidate.interviewSchedule.location, '_blank');
    }

    setSessionNotes(`--- MÜLAKAT OTURUMU: ${new Date().toLocaleString('tr-TR')} ---\nADAY: ${selectedCandidate.name}\nBRANŞ: ${selectedCandidate.branch}\n\nNOTLAR:\n`);
    setIsInterviewActive(true);
  };

  const handleEndInterview = () => {
    if (!selectedCandidate) return;
    if (window.confirm("Bu mülakat oturumunu sonlandırmak ve notları kaydetmek istiyor musunuz?")) {
      const finalNotes = `${selectedCandidate.adminNotes || ''}\n\n[MÜLAKAT TAMAMLANDI - SÜRE: ${formatTime(timer)}]\n${sessionNotes}`;
      
      onUpdateCandidate({ 
        ...selectedCandidate, 
        adminNotes: finalNotes,
        updated_at: new Date().toISOString() 
      });

      setIsInterviewActive(false);
      setSelectedInterviewId(null);
      setSessionNotes('');
    }
  };

  const handleContact = (method: 'whatsapp' | 'call' | 'email') => {
    if (!selectedCandidate) return;
    const phone = selectedCandidate.phone?.replace(/\D/g, '');
    const email = selectedCandidate.email;

    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/90${phone}`, '_blank');
        break;
      case 'call':
        window.location.href = `tel:+90${phone}`;
        break;
      case 'email':
        window.location.href = `mailto:${email}?subject=Mülakat Bilgilendirmesi - Yeni Gün Akademi`;
        break;
    }
    setShowContactMenu(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in h-[calc(100vh-14rem)] relative">
      
      {/* CANLI MÜLAKAT EKRANI (FULLSCREEN OVERLAY) */}
      {isInterviewActive && selectedCandidate && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="w-full max-w-7xl h-full bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
             <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-600 rounded-full animate-ping"></div>
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">CANLI OTURUM</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-1">{selectedCandidate.name}</h2>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div className="text-4xl font-mono font-black text-slate-400">{formatTime(timer)}</div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setSessionNotes(prev => prev + `\n[${formatTime(timer)}] KRİTİK GÖZLEM: `)} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all">KRİTİK NOT EKLE</button>
                  <button onClick={handleEndInterview} className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all">MÜLAKATI SONLANDIR</button>
                </div>
             </div>
             <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 border-r border-slate-100 overflow-y-auto p-10 space-y-10 bg-slate-50/20 custom-scrollbar">
                   <div>
                     <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-4">Adayın Zayıf Yönleri (Sorgulanmalı)</h4>
                     <ul className="space-y-4">
                        {selectedCandidate.report?.swot.threats.map((t, i) => (
                          <li key={i} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] font-bold text-rose-700 leading-relaxed italic">
                            "{t}"
                          </li>
                        ))}
                     </ul>
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Güçlü Yönler</h4>
                     <ul className="space-y-4">
                        {selectedCandidate.report?.swot.strengths.map((s, i) => (
                          <li key={i} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] font-bold text-emerald-700 leading-relaxed">
                            {s}
                          </li>
                        ))}
                     </ul>
                   </div>
                </div>
                <div className="flex-1 p-10 bg-white">
                   <textarea 
                     autoFocus 
                     className="w-full h-full p-10 rounded-[3rem] bg-slate-50 border-2 border-slate-100 focus:border-orange-600 outline-none font-bold text-xl text-slate-800 resize-none transition-all shadow-inner" 
                     placeholder="Mülakat gözlemlerinizi buraya anlık olarak not alın..." 
                     value={sessionNotes} 
                     onChange={e => setSessionNotes(e.target.value)} 
                   />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* SOL PANEL: Kompakt Randevu Listesi */}
      <div className={`lg:w-[320px] flex flex-col gap-4 shrink-0 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-2xl opacity-20' : ''}`}>
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-1">MÜLAKAT HAVUZU</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black">{interviewees.length}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase mb-2">RANDEVU</span>
              </div>
           </div>
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
          {interviewees.length > 0 ? interviewees.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedInterviewId(c.id)}
              className={`p-5 rounded-[2.5rem] border-2 transition-all cursor-pointer relative group ${
                selectedInterviewId === c.id ? 'bg-white border-orange-600 shadow-xl translate-x-1' : 'bg-white border-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-colors ${selectedInterviewId === c.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                   <span className="text-[12px] font-black leading-none">{c.interviewSchedule?.date.split('-')[2]}</span>
                   <span className="text-[8px] font-black uppercase mt-1">{new Date(c.interviewSchedule!.date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-[12px] truncate uppercase tracking-tight">{c.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] font-bold text-slate-400">{c.interviewSchedule?.time}</span>
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{c.interviewSchedule?.method.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-10 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Planlı mülakat yok</p>
            </div>
          )}
        </div>
      </div>

      {/* SAĞ PANEL: Mülakat Hazırlık ve Aksiyon Alanı */}
      <div className={`flex-1 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-2xl opacity-20' : ''}`}>
        {selectedCandidate ? (
          <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-100 h-full flex flex-col overflow-hidden animate-slide-up">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedCandidate.name}</h3>
                    <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.4em] mt-2">Mülakat Hazırlık Masası</p>
                  </div>
               </div>
               <div className="flex gap-3 relative">
                 <div className="relative">
                    <button 
                      onClick={() => setShowContactMenu(!showContactMenu)} 
                      className="px-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3"
                    >
                      HIZLI İLETİŞİM
                      <svg className={`w-3 h-3 transition-transform ${showContactMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showContactMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-scale-in">
                        <button onClick={() => handleContact('whatsapp')} className="w-full text-left p-4 hover:bg-emerald-50 rounded-2xl text-[10px] font-black text-emerald-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> WhatsApp Mesaj
                        </button>
                        <button onClick={() => handleContact('call')} className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl text-[10px] font-black text-blue-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Sesli Arama
                        </button>
                        <button onClick={() => handleContact('email')} className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl text-[10px] font-black text-slate-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2 h-2 bg-slate-400 rounded-full"></span> E-Posta Gönder
                        </button>
                      </div>
                    )}
                 </div>
                 <button onClick={handleStartInterview} className="px-10 py-5 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:bg-slate-900 transition-all">MÜLAKATI BAŞLAT</button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lojistik ve Yöntem</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{selectedCandidate.interviewSchedule?.method}</span>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-600">
                        {selectedCandidate.interviewSchedule?.location}
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50/50 p-8 rounded-[3rem] border border-orange-100">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Akademik Değerlendirme Özeti</p>
                    <p className="text-[13px] font-bold text-slate-700 italic leading-relaxed">
                      "{selectedCandidate.report?.summary}"
                    </p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Stratejik Mülakat Soruları</h4>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCandidate.report?.swot.threats.slice(0, 4).map((threat, i) => (
                      <div key={i} className="group p-6 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-orange-600 transition-all shadow-sm">
                        <div className="flex items-start gap-4">
                          <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black shrink-0">S{i+1}</span>
                          <p className="text-[12px] font-bold text-slate-800 leading-relaxed italic">
                            "Raporunuzdaki risklere dayanarak; <strong>{threat}</strong> durumunda kurumumuzdaki klinik süreçleri nasıl yönetirsiniz?"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-30">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
               <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-sm">Takvimden bir aday seçiniz</p>
             <p className="text-slate-300 font-bold text-[10px] mt-4 uppercase tracking-widest">Seçilen adayın mülakat hazırlık kartı burada belirecektir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
