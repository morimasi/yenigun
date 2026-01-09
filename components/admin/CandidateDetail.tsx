
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Mülakat Form State
  const [interviewForm, setInterviewForm] = useState({
    date: candidate.interviewSchedule?.date || '',
    time: candidate.interviewSchedule?.time || '',
    method: candidate.interviewSchedule?.method || 'Yüz Yüze',
    location: candidate.interviewSchedule?.location || 'Yeni Gün Akademi Merkez Ofis'
  });

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      // Güncel config ile analiz başlat
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const updated = { ...candidate, report: aiReport, algoReport, updated_at: new Date().toISOString() };
      onUpdate(updated);
      setSuccessStatus("Analiz Başarıyla Tamamlandı");
      setTimeout(() => setSuccessStatus(null), 3000);
    } catch (e: any) {
      setErrorMessage(e.message || "Analiz hatası.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewForm.date || !interviewForm.time) {
      setErrorMessage("Lütfen tarih ve saat seçiniz.");
      return;
    }

    setIsScheduling(true);
    setErrorMessage(null);
    setSuccessStatus(null);

    try {
      // 1. E-posta Gönderimi (API) - E-posta başarısız olsa bile randevu kaydedilmeli
      let emailSuccess = false;
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
        console.warn("E-posta gönderimi teknik nedenlerle yapılamadı.");
      }

      // 2. Aday Verisini Güncelle
      const updatedCandidate: Candidate = {
        ...candidate,
        status: 'interview_scheduled',
        interviewSchedule: {
          ...interviewForm,
          isNotificationSent: emailSuccess
        },
        updated_at: new Date().toISOString()
      };

      onUpdate(updatedCandidate);
      
      setSuccessStatus(emailSuccess ? "Mülakat Planlandı ve Bildirildi" : "Takvime İşlendi (E-posta Hatası)");
      setTimeout(() => setSuccessStatus(null), 4000);

    } catch (e: any) {
      setErrorMessage("İşlem sırasında bir hata oluştu: " + e.message);
    } finally {
      setIsScheduling(false);
    }
  };

  const updateStatus = (newStatus: Candidate['status']) => {
    onUpdate({ ...candidate, status: newStatus, updated_at: new Date().toISOString() });
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in no-print">
           <div className="absolute top-8 right-8 flex gap-4">
              <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 transition-all">YAZDIRMAYI BAŞLAT</button>
              <button onClick={() => setShowFullPreview(false)} className="bg-orange-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl hover:bg-orange-700">×</button>
           </div>
           <div className="w-full h-full overflow-y-auto custom-scrollbar flex justify-center py-10">
              <div className="transform scale-90 md:scale-100 origin-top">
                <CandidateReport candidate={candidate} report={candidate.report} />
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center no-print">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <StatusBadge status={candidate.status} />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{candidate.id.toUpperCase()}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">{candidate.name}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onDelete} className="p-5 rounded-2xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
          {candidate.report && (
            <button onClick={() => setShowFullPreview(true)} className="px-8 py-5 rounded-[1.8rem] bg-white border-2 border-slate-200 font-black text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">GÖRÜNTÜLE</button>
          )}
          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing}
            className={`px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${
              isAnalysing ? 'bg-slate-200 animate-pulse text-slate-400' : 'bg-slate-900 text-white shadow-xl hover:bg-orange-600'
            }`}
          >
            {isAnalysing ? 'ANALİZ EDİLİYOR...' : 'YENİ ANALİZ ÜRET'}
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
        
        {errorMessage && (
          <div className="p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center gap-4 animate-shake text-rose-600 font-bold text-sm">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {successStatus && (
          <div className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-3xl flex items-center justify-between gap-4 animate-bounce-y text-emerald-700 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">✓</span>
              <span>{successStatus}</span>
            </div>
          </div>
        )}

        {/* 1. Mülakat Planlama Modülü (PROFESYONEL) */}
        <section className="bg-slate-50 rounded-[3.5rem] p-10 border border-slate-100 relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Mülakat ve Randevu Yönetimi</h4>
                  <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Davet e-postası ve takvim senkronizasyonu</p>
                </div>
                {candidate.interviewSchedule?.isNotificationSent && (
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> DAVET GÖNDERİLDİ
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Tarih</label>
                    <input 
                      type="date" 
                      className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 focus:border-orange-600 outline-none"
                      value={interviewForm.date}
                      onChange={e => setInterviewForm({...interviewForm, date: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Saat</label>
                    <input 
                      type="time" 
                      className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 focus:border-orange-600 outline-none"
                      value={interviewForm.time}
                      onChange={e => setInterviewForm({...interviewForm, time: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Yöntem</label>
                    <select 
                      className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 focus:border-orange-600 outline-none appearance-none"
                      value={interviewForm.method}
                      onChange={e => setInterviewForm({...interviewForm, method: e.target.value})}
                    >
                      <option>Yüz Yüze</option>
                      <option>Google Meet</option>
                      <option>Zoom</option>
                      <option>Telefon Görüşmesi</option>
                    </select>
                 </div>
                 <div className="flex items-end">
                    <button 
                      onClick={handleScheduleInterview}
                      disabled={isScheduling}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        isScheduling ? 'bg-slate-200 text-slate-400' : 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 hover:bg-slate-900'
                      }`}
                    >
                      {isScheduling ? 'GÖNDERİLİYOR...' : 'RANDEVU OLUŞTUR & BİLDİR'}
                    </button>
                 </div>
              </div>

              <div className="mt-6">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Mülakat Konumu / Bağlantısı</label>
                <input 
                  type="text" 
                  className="w-full p-4 mt-2 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 focus:border-orange-600 outline-none"
                  value={interviewForm.location}
                  onChange={e => setInterviewForm({...interviewForm, location: e.target.value})}
                  placeholder="Kurum adresi veya toplantı linki..."
                />
              </div>
           </div>
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </section>

        {/* 2. Statü Yönetimi */}
        <section className="flex flex-wrap gap-3 p-8 bg-white border-2 border-slate-50 rounded-[3rem]">
           <p className="w-full text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 ml-2">Statü Hızlı Eylemler</p>
           {[
             { id: 'pending', label: 'Beklemeye Al', color: 'bg-amber-50 text-amber-600 border-amber-100' },
             { id: 'rejected', label: 'Olumsuz Değerlendir', color: 'bg-rose-50 text-rose-600 border-rose-100' },
             { id: 'hired', label: 'İşe Alımı Tamamla', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
             { id: 'withdrawn', label: 'Aday Geri Çekildi', color: 'bg-slate-100 text-slate-500 border-slate-200' }
           ].map(s => (
             <button
               key={s.id}
               onClick={() => updateStatus(s.id as any)}
               className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                 candidate.status === s.id ? s.color : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200'
               }`}
             >
               {s.label}
             </button>
           ))}
        </section>

        {/* 3. Analiz Raporu */}
        <section>
          {candidate.report ? (
            <CandidateReport candidate={candidate} report={candidate.report} />
          ) : (
            <div className="py-24 text-center border-4 border-dashed border-slate-50 rounded-[4rem] opacity-40">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">Dijital Analiz Raporu Bekleniyor</p>
            </div>
          )}
        </section>

        {/* 4. Aday Notları */}
        <section className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Yönetici Notları</h4>
          <textarea 
            className="w-full p-10 rounded-[3rem] bg-slate-50 border-2 border-transparent focus:border-orange-600 outline-none font-bold text-slate-700 min-h-[200px] resize-none transition-all"
            placeholder="Aday hakkında özel gözlemlerinizi buraya not edin (Sadece yöneticiler görebilir)..."
            value={candidate.adminNotes || ''}
            onChange={e => onUpdate({...candidate, adminNotes: e.target.value})}
          />
        </section>
      </div>
    </div>
  );
};

export default CandidateDetail;
