
import React, { useState, useMemo, useEffect } from 'react';
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
    
    const confirmSave = window.confirm("Mülakat oturumunu sonlandırıp notları kaydetmek istiyor musunuz?");
    if (confirmSave) {
      const updatedNotes = (selectedCandidate.adminNotes || '') + "\n\n" + sessionNotes;
      onUpdateCandidate({
        ...selectedCandidate,
        adminNotes: updatedNotes,
        updated_at: new Date().toISOString()
      });
      setIsInterviewActive(false);
      setSelectedInterviewId(null);
      alert("Mülakat verileri adayın profiline işlendi.");
    }
  };

  const handleContact = (method: 'whatsapp' | 'call' | 'email') => {
    if (!selectedCandidate) return;
    const phone = selectedCandidate.phone?.replace(/\s/g, '');
    const email = selectedCandidate.email;

    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/${phone}?text=Merhaba%20${selectedCandidate.name},%20Yeni%20Gün%20Akademi'den%20mülakat%20hatırlatması%20için%20ulaşıyorum.`, '_blank');
        break;
      case 'call':
        window.location.href = `tel:${phone}`;
        break;
      case 'email':
        window.location.href = `mailto:${email}?subject=Mülakat Hatırlatması - Yeni Gün Akademi`;
        break;
    }
    setShowContactMenu(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in h-[calc(100vh-14rem)] relative">
      
      {/* MÜLAKAT ODAK MODU (OVERLAY) */}
      {isInterviewActive && selectedCandidate && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-4 md:p-10 animate-fade-in no-print">
          <div className="w-full max-w-7xl h-full bg-white rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
             {/* Odak Modu Header */}
             <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-orange-600 rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black animate-pulse">
                    LIVE
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h2>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">Canlı Değerlendirme Oturumu</p>
                  </div>
                </div>
                <button 
                  onClick={handleEndInterview}
                  className="px-10 py-5 bg-rose-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-2xl transition-all"
                >
                  OTURUMU BİTİR VE KAYDET
                </button>
             </div>

             {/* Odak Modu İçerik */}
             <div className="flex-1 flex overflow-hidden">
                {/* Sol: Bilgi ve Sorular */}
                <div className="w-1/3 border-r border-slate-100 overflow-y-auto p-10 space-y-10 bg-slate-50/20">
                   <section className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adayın Akademik Özeti</h4>
                      <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                         <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{selectedCandidate.report?.summary || 'Analiz raporu bulunmuyor.'}"</p>
                      </div>
                   </section>

                   <section className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sormanız Gereken Kritik Sorular</h4>
                      {selectedCandidate.report?.swot.threats.slice(0, 3).map((threat, i) => (
                        <div key={i} className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                           <p className="text-[8px] font-black text-orange-600 uppercase mb-2">Stratejik Soru {i+1}</p>
                           <p className="text-xs font-bold text-slate-800 leading-relaxed">"{threat}" durumuyla ilgili klinik deneyiminizi bir örnekle açıklar mısınız?</p>
                        </div>
                      ))}
                   </section>
                </div>

                {/* Sağ: Not Alma Alanı */}
                <div className="flex-1 p-10 flex flex-col">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Mülakat Notları (Gerçek Zamanlı)</h4>
                   <textarea 
                      autoFocus
                      className="flex-1 w-full bg-slate-50/50 p-10 rounded-[3rem] border-2 border-slate-100 focus:border-orange-600 outline-none font-medium text-lg text-slate-800 resize-none transition-all leading-relaxed"
                      placeholder="Görüşme sırasındaki gözlemlerinizi, teknik yanıtları ve aday hakkındaki kritik hislerinizi buraya yazın..."
                      value={sessionNotes}
                      onChange={e => setSessionNotes(e.target.value)}
                   />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* STANDART GÖRÜNÜM */}
      <div className={`lg:col-span-5 flex flex-col gap-6 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-2xl scale-95 opacity-20' : ''}`}>
        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-4">Operasyonel Takvim</h3>
            <div className="flex items-end justify-between">
               <div>
                  <p className="text-5xl font-black tracking-tighter">{interviewees.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Planlanan Görüşme</p>
               </div>
               <div className="text-right">
                  <div className="flex -space-x-3 mb-3 justify-end">
                    {interviewees.slice(0, 4).map(c => (
                      <div key={c.id} className="w-8 h-8 rounded-full bg-orange-600 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black">
                        {c.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kadro Rezervasyonu</p>
               </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {interviewees.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedInterviewId(c.id)}
              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                selectedInterviewId === c.id 
                ? 'bg-white border-orange-600 shadow-xl scale-[1.02]' 
                : 'bg-white border-slate-50 hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-colors ${selectedInterviewId === c.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="text-[10px] font-black leading-none">{c.interviewSchedule?.date.split('-')[2]}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">{new Date(c.interviewSchedule!.date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base group-hover:text-orange-600 transition-colors truncate max-w-[150px]">{c.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{c.branch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none">{c.interviewSchedule?.time}</p>
                  <p className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-tighter">{c.interviewSchedule?.method}</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-orange-600 translate-x-1 group-hover:translate-x-0 transition-transform"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Sağ Panel: Mülakat Hazırlık Dosyası */}
      <div className={`lg:col-span-7 overflow-hidden transition-all duration-700 ${isInterviewActive ? 'blur-2xl scale-95 opacity-20' : ''}`}>
        {selectedCandidate ? (
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-slide-up">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Stratejik Hazırlık Dosyası</p>
                  </div>
               </div>
               <div className="flex gap-3 relative">
                 <div className="relative">
                    <button 
                      onClick={() => setShowContactMenu(!showContactMenu)}
                      className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[9px] font-black uppercase hover:border-orange-200 transition-all flex items-center gap-2"
                    >
                      İLETİŞİME GEÇ
                      <svg className={`w-3 h-3 transition-transform ${showContactMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    {showContactMenu && (
                      <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-scale-in">
                        <button onClick={() => handleContact('whatsapp')} className="w-full text-left p-4 hover:bg-emerald-50 rounded-2xl flex items-center gap-3 group transition-colors">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">WhatsApp</span>
                        </button>
                        <button onClick={() => handleContact('call')} className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl flex items-center gap-3 group transition-colors">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Arama Yap</span>
                        </button>
                        <button onClick={() => handleContact('email')} className="w-full text-left p-4 hover:bg-orange-50 rounded-2xl flex items-center gap-3 group transition-colors">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">E-Posta</span>
                        </button>
                      </div>
                    )}
                 </div>
                 
                 <button 
                  onClick={handleStartInterview}
                  className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[9px] font-black uppercase shadow-xl shadow-orange-600/20 hover:bg-slate-900 transition-all flex items-center gap-2 group"
                 >
                   MÜLAKATI BAŞLAT
                   <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
                 </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
               {/* Zaman ve Konum Detayı */}
               <section className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group hover:border-orange-200 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Görüşme Kanalı & Yöntem</p>
                    <p className="text-sm font-black text-slate-900">{selectedCandidate.interviewSchedule?.method}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 truncate">{selectedCandidate.interviewSchedule?.location}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Resmi Bildirim Durumu</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${selectedCandidate.interviewSchedule?.isNotificationSent ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                       <p className="text-sm font-black text-slate-900">{selectedCandidate.interviewSchedule?.isNotificationSent ? 'Sistem Onaylı / Davet Gidildi' : 'Onay Bekliyor'}</p>
                    </div>
                  </div>
               </section>

               {/* AI Destekli Hazırlık Soruları */}
               <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">AI-Tabanlı Kritik Sorular</h4>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                     {selectedCandidate.report ? (
                        selectedCandidate.report.swot.threats.slice(0, 2).map((threat, idx) => (
                          <div key={idx} className="p-6 bg-white border-2 border-slate-50 rounded-3xl shadow-sm hover:border-orange-200 hover:shadow-lg transition-all">
                             <p className="text-[9px] font-black text-orange-600 uppercase mb-2">Stratejik Odak Noktası {idx + 1}</p>
                             <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"Raporunuzdaki '{threat}' tespiti üzerine; bu riskin klinik bir vakada gerçekleştiğini varsayalım. Kriz anındaki ilk aksiyonunuz ne olurdu?"</p>
                          </div>
                        ))
                     ) : (
                        <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-50">
                           <p className="text-slate-300 font-black text-[10px] uppercase">Hazırlık soruları için aday raporu üretilmelidir.</p>
                        </div>
                     )}
                  </div>
               </section>

               {/* Aday Takip Notları */}
               <section className="space-y-6">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Süreç Geçmişi</h4>
                  <div className="space-y-4">
                     <div className="flex gap-4 relative">
                        <div className="absolute top-8 bottom-0 left-[3px] w-px bg-slate-100"></div>
                        <div className="w-2 h-2 mt-2 bg-slate-200 rounded-full shrink-0 relative z-10"></div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase">{new Date(selectedCandidate.timestamp).toLocaleDateString()} - Başvuru Alındı</p>
                           <p className="text-xs font-bold text-slate-600 mt-1">Dijital yetkinlik filtrelemesi tamamlandı.</p>
                        </div>
                     </div>
                     {selectedCandidate.interviewSchedule?.isNotificationSent && (
                        <div className="flex gap-4">
                           <div className="w-2 h-2 mt-2 bg-emerald-500 rounded-full shrink-0 relative z-10 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                           <div>
                              <p className="text-[9px] font-black text-emerald-600 uppercase">Resmi Davet Mühürlendi</p>
                              <p className="text-xs font-bold text-slate-600 mt-1">Sistem tarafından aday e-posta adresine randevu detayları iletildi.</p>
                           </div>
                        </div>
                     )}
                  </div>
               </section>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Takvim Boş</p>
             <p className="text-slate-300 font-bold text-[10px] mt-4 uppercase">Mülakat planı seçmek için sol panele göz atın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
