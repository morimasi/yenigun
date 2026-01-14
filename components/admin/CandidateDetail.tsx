
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

const AnalysisBox: React.FC<{ 
  title: string, 
  data: any,
  color: string
}> = ({ title, data, color }) => (
  <div className="flex items-start gap-4 py-5 border-b border-slate-50 last:border-0 group transition-all hover:bg-slate-50/50 px-4 -mx-4 rounded-xl">
    <div className="w-40 shrink-0">
      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-600 transition-colors">{title}</h5>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-black ${color}`}>%{data.score}</span>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden max-w-[50px]">
          <div className={`h-full ${color.replace('text', 'bg')} transition-all duration-700`} style={{ width: `${data.score}%` }}></div>
        </div>
      </div>
    </div>
    <div className="flex-1">
      <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-2">
        {data.comment}
      </p>
      <div className="flex flex-wrap gap-1">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[8px] font-bold text-slate-500 uppercase tracking-tight shadow-sm">
            {p}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isSchedulingPopupOpen, setIsSchedulingPopupOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const [interviewForm, setInterviewForm] = useState({
    date: candidate.interviewSchedule?.date || '',
    time: candidate.interviewSchedule?.time || '',
    method: candidate.interviewSchedule?.method || 'Yüz Yüze',
    location: candidate.interviewSchedule?.location || config?.interviewSettings?.defaultMeetingLink || 'Akademi Merkez Kampüs',
    type: 'Teknik ve Akademik Mülakat'
  });

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorStatus(null);
    setSuccessStatus(null);
    
    try {
      console.log("Analiz başlatılıyor: ", candidate.name);
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      
      const updatedCandidate = { 
        ...candidate, 
        report: aiReport, 
        algoReport, 
        timestamp: Date.now() 
      };
      
      onUpdate(updatedCandidate);
      setSuccessStatus("Akademik analiz başarıyla mühürlendi.");
      setTimeout(() => setSuccessStatus(null), 4000);
    } catch (e: any) {
      console.error("Analiz Hatası:", e);
      setErrorStatus(`HATA: ${e.message}`);
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewForm.date || !interviewForm.time) return;
    setIsScheduling(true);
    const updatedCandidate: Candidate = {
      ...candidate,
      status: 'interview_scheduled',
      interviewSchedule: { ...interviewForm, isNotificationSent: config?.automation?.autoEmailOnSchedule ?? true },
      timestamp: Date.now()
    };
    onUpdate(updatedCandidate);
    setSuccessStatus("Mülakat Randevusu Kaydedildi");
    setIsSchedulingPopupOpen(false);
    setIsScheduling(false);
    setTimeout(() => setSuccessStatus(null), 3000);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      
      {/* MODAL: MÜLAKAT PLANLAMA */}
      {isSchedulingPopupOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in no-print">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in border border-white/20">
            <div className="p-8 border-b border-slate-50 bg-slate-900 text-white">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1">Operasyonel Planlama</h4>
              <p className="text-xl font-black uppercase tracking-tight">Mülakat Oturumu Oluştur</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Seans Tarihi</label>
                  <input type="date" className="w-full p-4 rounded-xl bg-slate-50 font-bold border-2 border-transparent focus:border-slate-900 outline-none transition-all text-xs" value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Başlangıç Saati</label>
                  <input type="time" className="w-full p-4 rounded-xl bg-slate-50 font-bold border-2 border-transparent focus:border-slate-900 outline-none transition-all text-xs" value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Oturum Tipi</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Yüz Yüze', 'Meet/Dijital'].map(m => (
                    <button key={m} onClick={() => setInterviewForm({...interviewForm, method: m})} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${interviewForm.method === m ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Konum Detayı</label>
                <input className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-800 text-xs" value={interviewForm.location} onChange={e => setInterviewForm({...interviewForm, location: e.target.value})} placeholder="Adres veya Link..." />
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-3">
              <button onClick={() => setIsSchedulingPopupOpen(false)} className="flex-1 py-4 text-[9px] font-black uppercase text-slate-400 hover:text-slate-600">Vazgeç</button>
              <button onClick={handleScheduleInterview} disabled={isScheduling} className="flex-[2] py-4 bg-orange-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg active:scale-95">RANDEVUYU KAYDET</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER: COMPACT & OFFICIAL */}
      <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-center no-print">
        <div className="flex gap-5 items-center">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge status={candidate.status} />
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">REF-{candidate.id.toUpperCase().slice(0,6)}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{candidate.name}</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{candidate.branch} • {candidate.experienceYears} Yıl Deneyim</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsSchedulingPopupOpen(true)} className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-black text-[8px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">Mülakat Planla</button>
          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing} 
            className={`px-6 py-3 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all ${isAnalysing ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-slate-900 text-white hover:bg-black shadow-xl'}`}
          >
            {isAnalysing ? 'MOTOR ÇALIŞIYOR...' : 'ANALİZİ GÜNCELLE'}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT: THE DOSSIER */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[#F8FAFC]">
        
        {successStatus && (
          <div className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center gap-3 animate-slide-up shadow-xl shadow-emerald-500/20 font-black text-[9px] uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            {successStatus}
          </div>
        )}

        {errorStatus && (
          <div className="p-4 bg-rose-600 text-white rounded-2xl flex items-center gap-3 animate-slide-up shadow-xl shadow-rose-600/20 font-black text-[9px] uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {errorStatus}
          </div>
        )}

        {candidate.report ? (
          <div className="space-y-8">
            {/* A. SUMMARY CARD */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> I. Yönetici Analiz Özeti
                </h4>
                <p className="text-base font-bold text-slate-700 leading-relaxed italic border-l-4 border-slate-100 pl-6 py-1">
                  "{candidate.report.summary}"
                </p>
              </div>
              <div className="w-32 h-32 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shrink-0">
                <span className="text-[8px] font-black text-orange-500 uppercase mb-1">SKOR</span>
                <span className="text-4xl font-black">%{candidate.report.score}</span>
              </div>
            </div>

            {/* B. DETAILED GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> II. Teknik Yetkinlikler
                </h4>
                <AnalysisBox title="Metodolojik Pedagoji" data={candidate.report.detailedAnalysis.pedagogy} color="text-orange-600" />
                <AnalysisBox title="Klinik Muhakeme" data={candidate.report.detailedAnalysis.clinicalWisdom} color="text-blue-600" />
                <AnalysisBox title="Kriz & Stres Yanıtı" data={candidate.report.detailedAnalysis.stressResponse} color="text-rose-600" />
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> III. Karakteristik Profil
                </h4>
                <AnalysisBox title="Etik Bütünlük" data={candidate.report.detailedAnalysis.ethics} color="text-emerald-600" />
                <AnalysisBox title="Duygusal Dayanıklılık" data={candidate.report.detailedAnalysis.emotionalResilience} color="text-indigo-600" />
                <AnalysisBox title="Kurumsal Aidiyet" data={candidate.report.detailedAnalysis.institutionalFit} color="text-slate-600" />
              </div>
            </div>

            {/* C. RECOMMENDATION */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">IV. Nihai Kurul Karar Tavsiyesi</h4>
                  <p className="text-lg font-bold leading-relaxed opacity-90 italic">
                    {candidate.report.recommendation}
                  </p>
               </div>
               <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            </div>

            {/* D. ADMIN NOTES */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span> V. Yönetici Özel Notları
               </h4>
               <textarea 
                className="w-full p-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-800 min-h-[140px] resize-none transition-all text-xs"
                placeholder="Bu aday hakkındaki özel gözlemlerinizi buraya işleyebilirsiniz..."
                value={candidate.adminNotes || ''}
                onChange={e => onUpdate({...candidate, adminNotes: e.target.value, timestamp: Date.now()})}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
               <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Bu aday için henüz bir analiz dökümü bulunmuyor.</p>
             <button onClick={handleRunAnalysis} className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">STRATEJİK ANALİZİ BAŞLAT</button>
          </div>
        )}
      </div>

      <div className="px-8 py-3 bg-white border-t border-slate-50 flex justify-between items-center text-[7px] font-black text-slate-300 uppercase tracking-widest no-print">
        <span>GİZLİDİR • AKADEMİK DOSYA</span>
        <button onClick={onDelete} className="text-rose-300 hover:text-rose-600 transition-colors uppercase">Kaydı Kalıcı Olarak Sil</button>
      </div>
    </div>
  );
};

export default CandidateDetail;
