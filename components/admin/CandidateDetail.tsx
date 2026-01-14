
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

const AnalysisRow: React.FC<{ 
  title: string, 
  data: any,
  color: string
}> = ({ title, data, color }) => (
  <div className="flex items-start gap-6 py-6 border-b border-slate-50 last:border-0 group">
    <div className="w-48 shrink-0">
      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-600 transition-colors">{title}</h5>
      <div className="flex items-center gap-3">
        <span className={`text-xl font-black ${color}`}>%{data.score}</span>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
          <div className={`h-full ${color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${data.score}%` }}></div>
        </div>
      </div>
    </div>
    <div className="flex-1">
      <p className="text-[12px] font-bold text-slate-700 leading-relaxed mb-3">
        {data.comment}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [interviewForm, setInterviewForm] = useState({
    date: candidate.interviewSchedule?.date || '',
    time: candidate.interviewSchedule?.time || '',
    method: candidate.interviewSchedule?.method || 'Yüz Yüze',
    location: candidate.interviewSchedule?.location || config?.interviewSettings?.defaultMeetingLink || 'Akademi Merkez Kampüs',
    type: 'Teknik ve Akademik Mülakat'
  });

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const updated = { ...candidate, report: aiReport, algoReport, updated_at: new Date().toISOString() };
      onUpdate(updated);
      setSuccessStatus("Analiz Raporu Mühürlendi");
      setTimeout(() => setSuccessStatus(null), 3000);
    } catch (e: any) {
      setErrorMessage(e.message || "Analiz motoru yanıt vermedi.");
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
      updated_at: new Date().toISOString()
    };
    onUpdate(updatedCandidate);
    setSuccessStatus("Mülakat Randevusu Sabitlendi");
    setIsSchedulingPopupOpen(false);
    setIsScheduling(false);
    setTimeout(() => setSuccessStatus(null), 3000);
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      
      {/* PROFESSIONAL SCHEDULING MODAL */}
      {isSchedulingPopupOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in no-print">
          <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-1">Mülakat Planlama</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Lojistik ve Operasyonel Detaylar</p>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Tarih</label>
                  <input type="date" className="w-full p-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-slate-900 outline-none transition-all text-sm" value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Saat</label>
                  <input type="time" className="w-full p-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-slate-900 outline-none transition-all text-sm" value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Mülakat Yöntemi</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Yüz Yüze', 'Meet', 'Zoom', 'Telefon'].map(m => (
                    <button key={m} onClick={() => setInterviewForm({...interviewForm, method: m})} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${interviewForm.method === m ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Konum / Dijital Bağlantı</label>
                <input className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-800 text-sm" value={interviewForm.location} onChange={e => setInterviewForm({...interviewForm, location: e.target.value})} />
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => setIsSchedulingPopupOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">İptal</button>
              <button onClick={handleScheduleInterview} disabled={isScheduling} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg">{isScheduling ? 'KAYDEDİLİYOR...' : 'RANDEVUYU MÜHÜRLE'}</button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT DOSSIER HEADER */}
      <div className="p-8 border-b border-slate-50 bg-white flex justify-between items-center no-print">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge status={candidate.status} />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">AKD-DOSYA-{candidate.id.toUpperCase().slice(0,6)}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{candidate.branch} • {candidate.experienceYears} Yıl Deneyim</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsSchedulingPopupOpen(true)} className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-black text-[9px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">Mülakat Planla</button>
          <button onClick={handleRunAnalysis} disabled={isAnalysing} className={`px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${isAnalysing ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-xl'}`}>
            {isAnalysing ? 'ANALİZ MOTORU ÇALIŞIYOR...' : 'ANALİZİ GÜNCELLE'}
          </button>
        </div>
      </div>

      {/* CONTENT AREA: PROFESSIONAL REPORT VIEW */}
      <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-[#FAFBFC]">
        
        {successStatus && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 animate-fade-in text-emerald-800 font-black text-[10px] uppercase tracking-widest">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {successStatus}
          </div>
        )}

        {candidate.report ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-10 space-y-12">
            
            {/* A. YÖNETİCİ ÖZETİ (EXECUTIVE SUMMARY) */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-2 h-6 bg-slate-900 rounded-full"></span>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">A. STRATEJİK YÖNETİCİ ÖZETİ</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 relative group min-h-[140px] flex items-center">
                    <p className="text-xl font-bold leading-relaxed italic text-slate-700">
                      "{candidate.report.summary}"
                    </p>
                    <svg className="absolute top-4 right-6 w-12 h-12 text-slate-100 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703V14H12.017C14.2262 14 16.017 12.2091 16.017 10V7C16.017 5.89543 15.1216 5 14.017 5H10.017C8.91246 5 8.01703 5.89543 8.01703 7V10C8.01703 11.1046 8.91246 12 10.017 12H13.017V14H10.017C7.80789 14 6.01703 15.7909 6.01703 18V21H14.017Z" /></svg>
                  </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl">
                  <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">LİYAKAT SKORU</p>
                  <span className="text-6xl font-black">%{candidate.report.score}</span>
                </div>
              </div>
            </section>

            {/* B. KATEGORİK YETKİNLİK ANALİZİ (CATEGORICAL ANALYSIS) */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">B. AYRINTILI YETKİNLİK MATRİSİ</h4>
              </div>
              <div className="bg-white border border-slate-50 rounded-3xl overflow-hidden px-8">
                <AnalysisRow title="Etik ve Profesyonel Sınırlar" data={candidate.report.detailedAnalysis.ethics} color="text-emerald-600" />
                <AnalysisRow title="Pedagojik Uygulama ve Teknik" data={candidate.report.detailedAnalysis.pedagogy} color="text-orange-600" />
                <AnalysisRow title="Klinik Muhakeme Yeteneği" data={candidate.report.detailedAnalysis.clinicalWisdom} color="text-blue-600" />
                <AnalysisRow title="Duygusal Dayanıklılık" data={candidate.report.detailedAnalysis.emotionalResilience} color="text-indigo-600" />
                <AnalysisRow title="Kriz ve Stres Yönetimi" data={candidate.report.detailedAnalysis.stressResponse} color="text-rose-600" />
                <AnalysisRow title="Kurumsal Adaptasyon" data={candidate.report.detailedAnalysis.institutionalFit} color="text-slate-600" />
              </div>
            </section>

            {/* C. SWOT VE KARAR DESTEK (SWOT ANALYSIS) */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-2 h-6 bg-slate-900 rounded-full"></span>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">C. STRATEJİK SWOT VE TAVSİYE</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-50/30 border border-emerald-100 rounded-3xl">
                  <h5 className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-6">Kritik Avantajlar (Strengths)</h5>
                  <ul className="space-y-3">
                    {candidate.report.swot.strengths.map((s, i) => (
                      <li key={i} className="text-[11px] font-bold text-slate-700 flex items-start gap-3">
                        <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 bg-rose-50/30 border border-rose-100 rounded-3xl">
                  <h5 className="text-[9px] font-black text-rose-800 uppercase tracking-widest mb-6">Potansiyel Risk Alanları (Threats)</h5>
                  <ul className="space-y-3">
                    {candidate.report.swot.threats.map((t, i) => (
                      <li key={i} className="text-[11px] font-bold text-slate-700 flex items-start gap-3">
                        <span className="mt-1 w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl">
                <h5 className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-4">AKADEMİK KURUL TAVSİYESİ</h5>
                <p className="text-lg font-bold leading-relaxed italic opacity-90">
                  {candidate.report.recommendation}
                </p>
              </div>
            </section>

            {/* D. YÖNETİCİ NOTLARI */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <span className="w-2 h-6 bg-slate-200 rounded-full"></span>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">D. KURUM İÇİ ÖZEL NOTLAR</h4>
              </div>
              <textarea 
                className="w-full p-8 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-800 min-h-[160px] resize-none transition-all shadow-inner text-base"
                placeholder="Aday hakkındaki mülakat gözlemlerinizi buraya kaydediniz..."
                value={candidate.adminNotes || ''}
                onChange={e => onUpdate({...candidate, adminNotes: e.target.value})}
              />
            </section>
          </div>
        ) : (
          <div className="py-32 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-white">
             <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
               <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Akademik Veri Bekleniyor</p>
             <button onClick={handleRunAnalysis} className="mt-8 px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">Analiz Motorunu Ateşle</button>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="px-10 py-4 bg-white border-t border-slate-50 flex justify-between items-center text-[8px] font-black text-slate-300 uppercase tracking-widest no-print">
        <span>Yeni Gün Akademi Karar Destek Sistemi v23.1</span>
        <span>Son Güncelleme: {new Date(candidate.timestamp).toLocaleString('tr-TR')}</span>
      </div>
    </div>
  );
};

export default CandidateDetail;
