
import React, { useState, useMemo } from 'react';
import { Candidate } from '../../types';
import StatusBadge from './StatusBadge';

interface CalendarViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ candidates, onUpdateCandidate }) => {
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

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

  const upcomingToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return interviewees.filter(c => c.interviewSchedule?.date === today);
  }, [interviewees]);

  const selectedCandidate = interviewees.find(c => c.id === selectedInterviewId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in h-[calc(100vh-14rem)]">
      {/* Sol Panel: Mülakat Akışı */}
      <div className="lg:col-span-5 flex flex-col gap-6 overflow-hidden">
        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-4">Operasyonel Takvim</h3>
            <div className="flex items-end justify-between">
               <div>
                  <p className="text-5xl font-black tracking-tighter">{interviewees.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Aktif Planlama</p>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-black text-orange-500">{upcomingToday.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Bugünkü Görüşme</p>
               </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {interviewees.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedInterviewId(c.id)}
              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative ${
                selectedInterviewId === c.id 
                ? 'bg-white border-orange-600 shadow-xl scale-[1.02]' 
                : 'bg-white border-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-slate-400 leading-none">{c.interviewSchedule?.date.split('-')[2]}</span>
                    <span className="text-[8px] font-black text-orange-600 uppercase tracking-tighter mt-0.5">ARA</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base group-hover:text-orange-600 transition-colors">{c.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{c.branch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none">{c.interviewSchedule?.time}</p>
                  <p className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-tighter">{c.interviewSchedule?.method}</p>
                </div>
              </div>
            </div>
          ))}
          {interviewees.length === 0 && (
            <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem] text-slate-300 font-black uppercase text-xs tracking-[0.3em]">Mülakat Bulunmuyor</div>
          )}
        </div>
      </div>

      {/* Sağ Panel: Mülakat Hazırlık Dosyası */}
      <div className="lg:col-span-7 overflow-hidden">
        {selectedCandidate ? (
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-slide-up">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Stratejik Hazırlık Dosyası</p>
               </div>
               <div className="flex gap-2">
                 <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase hover:bg-slate-50 transition-all">İletişime Geç</button>
                 <button className="px-6 py-3 bg-orange-600 text-white rounded-2xl text-[9px] font-black uppercase shadow-lg hover:bg-orange-700 transition-all">Mülakatı Başlat</button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
               {/* Zaman ve Konum Detayı */}
               <section className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Görüşme Kanalları</p>
                    <p className="text-sm font-black text-slate-900">{selectedCandidate.interviewSchedule?.method} - {selectedCandidate.interviewSchedule?.location}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Hatırlatıcı Durumu</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${selectedCandidate.interviewSchedule?.isNotificationSent ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                       <p className="text-sm font-black text-slate-900">{selectedCandidate.interviewSchedule?.isNotificationSent ? 'E-Posta Gönderildi' : 'Onay Bekliyor'}</p>
                    </div>
                  </div>
               </section>

               {/* AI Destekli Hazırlık Soruları */}
               <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">AI-Tabanlı Kritik Sorular</h4>
                    <div className="flex-1 h-px bg-slate-100"></div>
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[8px] font-black rounded-full">STRATEJİK</span>
                  </div>
                  
                  <div className="space-y-4">
                     {selectedCandidate.report ? (
                        <>
                          <div className="p-6 bg-white border-2 border-slate-50 rounded-3xl shadow-sm hover:border-orange-200 transition-all">
                             <p className="text-[9px] font-black text-orange-600 uppercase mb-2">Soru 1: Etik & Sınırlar</p>
                             <p className="text-sm font-bold text-slate-800 leading-relaxed">"${selectedCandidate.report.swot.threats[0] || 'Genel etik yaklaşımı'}" konusundaki çelişkiyi netleştirmek için: "Bu durum kurumun marka değerine zarar verseydi tavrınız değişir miydi?"</p>
                          </div>
                          <div className="p-6 bg-white border-2 border-slate-50 rounded-3xl shadow-sm hover:border-orange-200 transition-all">
                             <p className="text-[9px] font-black text-orange-600 uppercase mb-2">Soru 2: Teknik Yetkinlik</p>
                             <p className="text-sm font-bold text-slate-800 leading-relaxed">"${selectedCandidate.report.swot.weaknesses[0] || 'Gelişim alanları'}" üzerine: "Bu alandaki yetersizliğinizin bir seans krizine yol açtığını düşünelim, ilk kime raporlama yaparsınız?"</p>
                          </div>
                        </>
                     ) : (
                        <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                           <p className="text-slate-300 font-black text-[10px] uppercase">Sorular için önce analiz motorunu çalıştırın</p>
                        </div>
                     )}
                  </div>
               </section>

               {/* Aday Takip Notları */}
               <section className="space-y-6">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Aday Bağlantı Günlüğü</h4>
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <div className="w-1 h-12 bg-slate-200 rounded-full shrink-0"></div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase">{new Date(selectedCandidate.timestamp).toLocaleDateString()} - Başvuru Alındı</p>
                           <p className="text-xs font-bold text-slate-600 mt-1">Dijital yetkinlik testi başarıyla tamamlandı.</p>
                        </div>
                     </div>
                     {selectedCandidate.interviewSchedule?.isNotificationSent && (
                        <div className="flex gap-4">
                           <div className="w-1 h-12 bg-emerald-200 rounded-full shrink-0"></div>
                           <div>
                              <p className="text-[9px] font-black text-emerald-600 uppercase">Resmi Davet Gönderildi</p>
                              <p className="text-xs font-bold text-slate-600 mt-1">Aday mülakat tarihini onayladı.</p>
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
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Mülakat Seçilmedi</p>
             <p className="text-slate-300 font-bold text-[10px] mt-4 uppercase">Stratejik hazırlık dosyası için soldan bir plan seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
