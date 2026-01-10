
import React, { useState, useMemo } from 'react';
import { Candidate } from '../../types';

interface CalendarViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ candidates, onUpdateCandidate }) => {
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [showContactMenu, setShowContactMenu] = useState(false);

  // Sadece mülakatı planlanmış adayları tarih sırasına göre listele
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
      
      {/* SOL PANEL: Randevu Akışı */}
      <div className="lg:w-[320px] flex flex-col gap-4 shrink-0 overflow-hidden">
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-1">MÜLAKAT TAKVİMİ</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black">{interviewees.length}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase mb-2">RANDEVU</span>
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
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aktif Randevu Bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* SAĞ PANEL: Aday Koordinasyon Dosyası */}
      <div className="flex-1 overflow-hidden">
        {selectedCandidate ? (
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-slide-up">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-xl">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedCandidate.name}</h3>
                    <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.4em] mt-2">Mülakat Hazırlık ve Lojistik</p>
                  </div>
               </div>
               <div className="flex gap-3">
                 <div className="relative">
                    <button 
                      onClick={() => setShowContactMenu(!showContactMenu)} 
                      className="px-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
                    >
                      İLETİŞİM KANALLARI
                      <svg className={`w-3 h-3 transition-transform ${showContactMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showContactMenu && (
                      <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-50 animate-scale-in">
                        <button onClick={() => handleContact('whatsapp')} className="w-full text-left p-4 hover:bg-emerald-50 rounded-xl text-[10px] font-black text-emerald-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> WhatsApp Mesajı
                        </button>
                        <button onClick={() => handleContact('call')} className="w-full text-left p-4 hover:bg-blue-50 rounded-xl text-[10px] font-black text-blue-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Sesli Arama
                        </button>
                        <button onClick={() => handleContact('email')} className="w-full text-left p-4 hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 uppercase transition-all flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-slate-400 rounded-full"></span> E-Posta Gönder
                        </button>
                      </div>
                    )}
                 </div>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Randevu Detayları</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm border border-slate-100">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{selectedCandidate.interviewSchedule?.date} • {selectedCandidate.interviewSchedule?.time}</span>
                      </div>
                      <div className="p-6 bg-white rounded-[2rem] border border-slate-100 text-[11px] font-bold text-slate-600 leading-relaxed shadow-inner">
                        <span className="block text-orange-600 text-[9px] font-black uppercase mb-1">Konum / Bağlantı</span>
                        {selectedCandidate.interviewSchedule?.location}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 relative z-10">Liyakat Analiz Özeti</p>
                    <p className="text-[13px] font-bold text-slate-300 italic leading-relaxed relative z-10">
                      "{selectedCandidate.report?.summary}"
                    </p>
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Stratejik Mülakat Soruları (AI Önerisi)</h4>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCandidate.report?.swot.threats.slice(0, 4).map((threat, i) => (
                      <div key={i} className="group p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-orange-600 transition-all shadow-sm hover:shadow-xl">
                        <div className="flex items-start gap-5">
                          <span className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-[10px] font-black shrink-0">SORU {i+1}</span>
                          <p className="text-[12px] font-bold text-slate-800 leading-relaxed italic">
                            "Adayın analiz raporunda belirtilen <strong>{threat}</strong> riski hakkında klinik yaklaşımını ve çözümleme metodolojisini derinlemesine sorgulayın."
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-10 bg-orange-50/30 border-2 border-orange-100 rounded-[3.5rem] flex items-center justify-between gap-10">
                  <div className="flex-1">
                    <h5 className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-2">Kurumsal Hatırlatma</h5>
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase">
                      Mülakat sonrasındaki nihai kararlarınızı ve aday hakkındaki kritik gözlemlerinizi, adayın ana sayfasındaki "Yönetici Özel Notları" alanına kaydetmeyi unutmayınız.
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shrink-0">
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center justify-center text-center p-24 opacity-30">
             <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mb-10">
               <svg className="w-14 h-14 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.8em] text-sm">Mülakat Yönetimi İçin Aday Seçiniz</p>
             <p className="text-slate-300 font-bold text-[10px] mt-6 uppercase tracking-[0.3em]">Koordinasyon verileri mülakat günü rehberlik için yüklenecektir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
