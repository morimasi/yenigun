
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
  const [interviewTimer, setInterviewTimer] = useState(0);

  // Mülakat süresini takip eden timer
  useEffect(() => {
    let interval: any;
    if (isInterviewActive) {
      interval = setInterval(() => {
        setInterviewTimer(prev => prev + 1);
      }, 1000);
    } else {
      setInterviewTimer(0);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive]);

  const formatDuration = (seconds: number) => {
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
    
    // Eğer link varsa yeni sekmede aç (Google Meet / Zoom vb)
    if (selectedCandidate.interviewSchedule?.location.startsWith('http')) {
      window.open(selectedCandidate.interviewSchedule.location, '_blank');
    }

    setSessionNotes(`--- CANLI MÜLAKAT KAYDI: ${new Date().toLocaleString('tr-TR')} ---\n\n`);
    setIsInterviewActive(true);
  };

  const handleEndInterview = () => {
    if (!selectedCandidate) return;
    if (window.confirm("Mülakat oturumunu sonlandırmak ve notları aday dosyasına işlemek istiyor musunuz?")) {
      const finalNotes = (selectedCandidate.adminNotes || '') + 
        `\n\n[MÜLAKAT TAMAMLANDI - SÜRE: ${formatDuration(interviewTimer)}]\n` + sessionNotes;
      
      onUpdateCandidate({ 
        ...selectedCandidate, 
        adminNotes: finalNotes,
        status: 'pending', // Mülakat sonrası tekrar değerlendirme aşamasına al
        updated_at: new Date().toISOString() 
      });

      setIsInterviewActive(false);
      setSelectedInterviewId(null);
      setSessionNotes('');
    }
  };

  const handleContact = (method: 'whatsapp' | 'call' | 'email') => {
    if (!selectedCandidate) return;
    const phone = selectedCandidate.phone?.replace(/\s/g, '');
    const email = selectedCandidate.email;

    const message = encodeURIComponent(`Merhaba ${selectedCandidate.name}, Yeni Gün Akademi'den mülakatınızla ilgili iletişime geçiyoruz.`);

    switch(method) {
      case 'whatsapp': window.open(`https://wa.me/90${phone}?text=${message}`, '_blank'); break;
      case 'call': window.location.href = `tel:+90${phone}`; break;
      case 'email': window.location.href = `mailto:${email}?subject=Mülakat Bilgilendirmesi`; break;
    }
    setShowContactMenu(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in h-[calc(100vh-14rem)] relative">
      
      {/* 1. CANLI MÜLAKAT MODU (OVERLAY) */}
      {isInterviewActive && selectedCandidate && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-4 md:p-10 animate-fade-in no-print">
          <div className="w-full max-w-7xl h-full bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col border-8 border-orange-600/10">
             <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-600 rounded-full animate-ping"></div>
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">OTURUM AKTİF</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-1">{selectedCandidate.name}</h2>
                  </div>
                  <div className="h-14 w-px bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SÜRE</span>
                    <span className="text-4xl font-mono font-black text-slate-900">{formatDuration(interviewTimer)}</span>
                  </div>
                </div>
                <button onClick={handleEndInterview} className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-600/30 hover:bg-rose-700 transition-all">MÜLAKATI BİTİR VE KAYDET</button>
             </div>
             
             <div className="flex-1 flex overflow-hidden">
                {/* Sol: AI Destekli Hazırlık Kartı */}
                <div className="w-1/3 border-r border-slate-100 overflow-y-auto p-10 space-y-10 bg-slate-50/30 custom-scrollbar">
                   <div>
                     <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-4">Adayın Zayıf Noktaları (Sorgulayın)</h4>
                     <div className="space-y-4">
                        {selectedCandidate.report?.swot.threats.map((t, i) => (
                          <div key={i} className="p-5 bg-white border-2 border-rose-50 rounded-2xl">
                             <p className="text-[11px] font-bold text-slate-700 italic leading-relaxed">"Raporunuzdaki <strong>{t}</strong> riskiyle ilgili, benzer bir durumda nasıl bir klinik aksiyon alırsınız?"</p>
                          </div>
                        ))}
                     </div>
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Güçlü Yönler</h4>
                     <div className="flex flex-wrap gap-2">
                        {selectedCandidate.report?.swot.strengths.map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">{s}</span>
                        ))}
                     </div>
                   </div>
                </div>
                {/* Sağ: Not Defteri */}
                <div className="flex-1 p-10">
                   <textarea 
                     autoFocus 
                     className="w-full h-full p-12 rounded-[3.5rem] bg-slate-50 border-2 border-slate-100 focus:border-orange-600 outline-none font-bold text-xl text-slate-800 resize-none transition-all shadow-inner" 
                     placeholder="Adayın cevaplarını, tutumunu ve klinik muhakemesini buraya anlık olarak not alın..." 
                     value={sessionNotes} 
                     onChange={e => setSessionNotes(e.target.value)} 
                   />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 2. SOL PANEL: Randevu Havuzu */}
      <div className={`lg:w-[320px] flex flex-col gap-4 shrink-0 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-3xl opacity-0 scale-95' : ''}`}>
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-1">RANDEVULARIM</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black">{interviewees.length}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase mb-2">UZMAN ADAYI</span>
              </div>
           </div>
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
          {interviewees.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedInterviewId(c.id)}
              className={`p-5 rounded-[2.5rem] border-2 transition-all cursor-pointer relative group ${
                selectedInterviewId === c.id ? 'bg-white border-orange-600 shadow-xl scale-[1.02] translate-x-1' : 'bg-white border-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex gap-4 items-center">
                {/* Fix: replaced 'selectedId' with 'selectedInterviewId' */}
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
          ))}
          {interviewees.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Planlanmış mülakat yok</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. SAĞ PANEL: Mülakat Yönetim Masası */}
      <div className={`flex-1 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-3xl opacity-0 scale-95' : ''}`}>
        {selectedCandidate ? (
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-slide-up">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-xl">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedCandidate.name}</h3>
                    <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.4em] mt-2">Mülakat Hazırlık Dosyası</p>
                  </div>
               </div>
               <div className="flex gap-3">
                 <div className="relative">
                    <button 
                      onClick={() => setShowContactMenu(!showContactMenu)} 
                      className="px-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
                    >
                      HIZLI İLETİŞİM
                      <svg className={`w-3 h-3 transition-transform ${showContactMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showContactMenu && (
                      <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-50 animate-scale-in">
                        <button onClick={() => handleContact('whatsapp')} className="w-full text-left p-4 hover:bg-emerald-50 rounded-xl text-[10px] font-black text-emerald-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> WhatsApp Mesajı Gönder
                        </button>
                        <button onClick={() => handleContact('call')} className="w-full text-left p-4 hover:bg-blue-50 rounded-xl text-[10px] font-black text-blue-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Sesli Arama Başlat
                        </button>
                        <button onClick={() => handleContact('email')} className="w-full text-left p-4 hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2 h-2 bg-slate-400 rounded-full"></span> Resmi E-Posta Yaz
                        </button>
                      </div>
                    )}
                 </div>
                 <button onClick={handleStartInterview} className="px-10 py-5 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/30 hover:bg-slate-900 transition-all hover:-translate-y-1">MÜLAKATI BAŞLAT</button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Mülakat Parametreleri</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm border border-slate-100">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        </div>
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{selectedCandidate.interviewSchedule?.method}</span>
                      </div>
                      <div className="p-5 bg-white rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-600 leading-relaxed">
                        {selectedCandidate.interviewSchedule?.location}
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50/40 p-8 rounded-[3rem] border border-orange-100">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Akademik Ön Analiz (AI)</p>
                    <p className="text-[13px] font-bold text-slate-700 italic leading-relaxed">
                      "{selectedCandidate.report?.summary}"
                    </p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Kritik Mülakat Senaryoları</h4>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCandidate.report?.swot.threats.slice(0, 4).map((threat, i) => (
                      <div key={i} className="group p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-orange-600 transition-all shadow-sm hover:shadow-xl">
                        <div className="flex items-start gap-5">
                          <span className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black shrink-0">S{i+1}</span>
                          <p className="text-[13px] font-bold text-slate-800 leading-relaxed italic">
                            "Adayın dosyasına göre <strong>{threat}</strong> konusu klinik bir risk teşkil edebilir. Lütfen bu durumu yönetme stratejisini detaylıca sorgulayın."
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center justify-center text-center p-24 opacity-30">
             <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mb-10">
               <svg className="w-14 h-14 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.8em] text-sm">Akıllı Takvimden Bir Aday Seçiniz</p>
             <p className="text-slate-300 font-bold text-[10px] mt-6 uppercase tracking-[0.3em]">Mülakat öncesi hazırlık verileri burada yüklenecektir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
