
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSchedulingPopupOpen, setIsSchedulingPopupOpen] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Mülakat Form State
  const [interviewForm, setInterviewForm] = useState({
    date: candidate.interviewSchedule?.date || '',
    time: candidate.interviewSchedule?.time || '',
    method: candidate.interviewSchedule?.method || 'Yüz Yüze',
    location: candidate.interviewSchedule?.location || config.interviewSettings.defaultMeetingLink || 'Yeni Gün Akademi Merkez Ofis'
  });

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const updated = { ...candidate, report: aiReport, algoReport, updated_at: new Date().toISOString() };
      onUpdate(updated);
      setSuccessStatus("Akademik Analiz Tamamlandı");
      setTimeout(() => setSuccessStatus(null), 3000);
    } catch (e: any) {
      setErrorMessage(e.message || "Motor analizi sırasında hata oluştu.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewForm.date || !interviewForm.time) {
      setErrorMessage("Lütfen tarih ve saat verilerini eksiksiz giriniz.");
      return;
    }

    setIsScheduling(true);
    setErrorMessage(null);

    try {
      // 1. E-posta Otomasyonu (API Simulation)
      let emailSuccess = false;
      if (config.automation.autoEmailOnSchedule) {
        try {
          const emailRes = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: candidate.email,
              candidateName: candidate.name,
              date: interviewForm.date,
              time: interviewForm.time,
              location: interviewForm.location
            })
          });
          emailSuccess = emailRes.ok;
        } catch (e) {
          console.warn("E-posta sunucusu yanıt vermedi.");
        }
      }

      // 2. Aday Statüsünü 'Mülakat Planlandı' olarak güncelle
      const updatedCandidate: Candidate = {
        ...candidate,
        status: 'interview_scheduled',
        interviewSchedule: {
          ...interviewForm,
          isNotificationSent: emailSuccess || config.automation.autoEmailOnSchedule
        },
        updated_at: new Date().toISOString()
      };

      onUpdate(updatedCandidate);
      
      setSuccessStatus("Randevu Başarıyla Oluşturuldu");
      setIsSchedulingPopupOpen(false);
      setTimeout(() => setSuccessStatus(null), 4000);

    } catch (e: any) {
      setErrorMessage("Kritik hata: " + e.message);
    } finally {
      setIsScheduling(false);
    }
  };

  const updateStatus = (newStatus: Candidate['status']) => {
    onUpdate({ ...candidate, status: newStatus, updated_at: new Date().toISOString() });
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {/* PROFESSIONAL SCHEDULING POPUP (MODAL) */}
      {isSchedulingPopupOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in no-print">
          <div className="w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] overflow-hidden border border-white/20 animate-scale-in">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/40">
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Mülakat Planlama</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Akademik Değerlendirme Oturumu</p>
              </div>
              <button 
                onClick={() => setIsSchedulingPopupOpen(false)} 
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 hover:text-rose-600 hover:shadow-lg transition-all font-black text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-600 uppercase tracking-widest text-center animate-shake">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">Tarih</label>
                  <input 
                    type="date" 
                    className="w-full p-5 rounded-[1.8rem] bg-slate-50 border-2 border-transparent focus:border-orange-600 outline-none font-bold text-slate-800 transition-all shadow-inner"
                    value={interviewForm.date}
                    onChange={e => setInterviewForm({...interviewForm, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">Saat</label>
                  <input 
                    type="time" 
                    className="w-full p-5 rounded-[1.8rem] bg-slate-50 border-2 border-transparent focus:border-orange-600 outline-none font-bold text-slate-800 transition-all shadow-inner"
                    value={interviewForm.time}
                    onChange={e => setInterviewForm({...interviewForm, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">Görüşme Kanalı</label>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2 rounded-[2rem]">
                  {['Yüz Yüze', 'Google Meet', 'Zoom', 'Telefon'].map(m => (
                    <button
                      key={m}
                      onClick={() => setInterviewForm({...interviewForm, method: m})}
                      className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        interviewForm.method === m ? 'bg-white text-orange-600 shadow-md scale-100' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">Lojistik Detay / Bağlantı Linki</label>
                <textarea 
                  className="w-full p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-orange-600 outline-none font-bold text-slate-800 transition-all min-h-[100px] resize-none shadow-inner"
                  value={interviewForm.location}
                  onChange={e => setInterviewForm({...interviewForm, location: e.target.value})}
                  placeholder="Ofis numarası veya toplantı bağlantı adresini buraya ekleyin..."
                />
              </div>

              <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.automation.autoEmailOnSchedule ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Akıllı Bildirim</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{config.automation.autoEmailOnSchedule ? 'Adaya resmi davet e-postası iletilecek.' : 'Manuel bilgilendirme seçildi.'}</p>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setIsSchedulingPopupOpen(false)} 
                className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
              >
                Vazgeç
              </button>
              <button 
                onClick={handleScheduleInterview}
                disabled={isScheduling}
                className="flex-[2] py-5 bg-orange-600 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-orange-600/30 hover:bg-slate-900 transition-all active:scale-95"
              >
                {isScheduling ? 'İŞLENİYOR...' : 'RANDEVUYU KESİNLEŞTİR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL REPORT MODAL */}
      {showFullPreview && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 animate-fade-in no-print">
           <div className="absolute top-8 right-8 flex gap-4">
              <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 transition-all">SİSTEMDEN YAZDIR</button>
              <button onClick={() => setShowFullPreview(false)} className="bg-orange-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl hover:bg-orange-700 transition-all">×</button>
           </div>
           <div className="w-full h-full overflow-y-auto custom-scrollbar flex justify-center py-10">
              <div className="transform scale-90 md:scale-100 origin-top">
                <CandidateReport candidate={candidate} report={candidate.report} />
              </div>
           </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="p-10 border-b border-slate-50 bg-slate-50/40 flex flex-col xl:flex-row justify-between items-center gap-8 no-print">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl relative overflow-hidden group">
            <span className="relative z-10">{candidate.name.charAt(0)}</span>
            <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <StatusBadge status={candidate.status} />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">AKD-{candidate.id.toUpperCase()}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">{candidate.name}</h2>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={onDelete} 
            className="p-5 rounded-2xl text-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
            title="Adayı Sil"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
          
          {candidate.report && (
            <button 
              onClick={() => setShowFullPreview(true)} 
              className="px-8 py-5 rounded-[2rem] bg-white border-2 border-slate-200 font-black text-[11px] uppercase tracking-widest text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
            >
              GÖRÜNTÜLE
            </button>
          )}

          <button 
            onClick={() => setIsSchedulingPopupOpen(true)}
            className="px-8 py-5 rounded-[2rem] bg-orange-50 border-2 border-orange-100 font-black text-[11px] uppercase tracking-widest text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-orange-600/5 active:scale-95"
          >
            RANDEVU OLUŞTUR
          </button>

          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing}
            className={`px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${
              isAnalysing ? 'bg-slate-200 animate-pulse text-slate-400' : 'bg-slate-900 text-white shadow-2xl hover:bg-orange-600 hover:-translate-y-1'
            }`}
          >
            {isAnalysing ? 'MOTOR ANALİZ EDİYOR...' : 'YENİ ANALİZ ÜRET'}
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
        
        {successStatus && (
          <div className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] flex items-center justify-between gap-4 animate-bounce-y text-emerald-700 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/10">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">✓</span>
              <span>{successStatus}</span>
            </div>
          </div>
        )}

        {/* ACTIVE SCHEDULE CARD */}
        {candidate.interviewSchedule && (
          <section className="bg-slate-900 rounded-[3.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group shadow-2xl">
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-orange-600 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-2xl shadow-orange-600/40">
                 <span className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">{new Date(candidate.interviewSchedule.date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                 <span className="text-3xl font-black leading-none">{candidate.interviewSchedule.date.split('-')[2]}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2">Planlı Akademik Mülakat</p>
                <h4 className="text-3xl font-black tracking-tighter uppercase leading-none">{candidate.interviewSchedule.method} @ {candidate.interviewSchedule.time}</h4>
                <p className="text-[11px] font-bold text-slate-400 mt-3 truncate max-w-sm">{candidate.interviewSchedule.location}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSchedulingPopupOpen(true)} 
              className="px-10 py-5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 border border-white/20"
            >
              PLANLAMAYI DÜZENLE
            </button>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </section>
        )}

        {/* WORKFLOW ACTIONS */}
        <section className="bg-slate-50/50 p-10 rounded-[4rem] border-2 border-slate-50 flex flex-col gap-6">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Akademik Akış Kontrolü</p>
           <div className="flex flex-wrap gap-4">
             {[
               { id: 'pending', label: 'Analiz Havuzu', color: 'bg-white text-slate-900 border-slate-200' },
               { id: 'rejected', label: 'Kriter Dışı', color: 'bg-rose-50 text-rose-600 border-rose-100' },
               { id: 'hired', label: 'Kadrolu Uzman', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
               { id: 'withdrawn', label: 'Başvuru İptal', color: 'bg-slate-100 text-slate-500 border-slate-200' }
             ].map(s => (
               <button
                 key={s.id}
                 onClick={() => updateStatus(s.id as any)}
                 className={`px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                   candidate.status === s.id ? s.color + ' shadow-xl ring-4 ring-slate-100/50' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                 }`}
               >
                 {s.label}
               </button>
             ))}
           </div>
        </section>

        {/* AI ANALYSIS REPORT COMPONENT */}
        <section>
          {candidate.report ? (
            <CandidateReport candidate={candidate} report={candidate.report} />
          ) : (
            <div className="py-32 text-center border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/30">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-sm">Akademik Rapor Analiz Motoru Bekleniyor</p>
               <button onClick={handleRunAnalysis} className="mt-8 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline transition-all">Analizi Şimdi Başlat</button>
            </div>
          )}
        </section>

        {/* ADMIN PRIVATE NOTES */}
        <section className="space-y-6 pb-20">
          <div className="flex items-center gap-6">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Kurumsal Değerlendirme Kayıtları</h4>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>
          <textarea 
            className="w-full p-12 rounded-[4rem] bg-slate-50 border-2 border-transparent focus:border-orange-600 outline-none font-bold text-slate-800 min-h-[300px] resize-none transition-all shadow-inner text-lg leading-relaxed"
            placeholder="Adayın mesleki duruşu, kurum kültürüne uyumu ve mülakat gözlemleri hakkında sadece yöneticilerin erişebileceği detaylı notları buraya işleyiniz..."
            value={candidate.adminNotes || ''}
            onChange={e => onUpdate({...candidate, adminNotes: e.target.value})}
          />
        </section>
      </div>
    </div>
  );
};

export default CandidateDetail;
