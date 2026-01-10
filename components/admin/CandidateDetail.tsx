
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

// İçerik kategorilerini temsil eden yardımcı bileşen
const AnalysisTile: React.FC<{ 
  title: string, 
  data: any, 
  variant: 'emerald' | 'orange' | 'rose' 
}> = ({ title, data, variant }) => {
  const colors = {
    emerald: 'border-emerald-100 bg-emerald-50/20 text-emerald-700',
    orange: 'border-orange-100 bg-orange-50/20 text-orange-700',
    rose: 'border-rose-100 bg-rose-50/20 text-rose-700'
  };

  const barColors = {
    emerald: 'bg-emerald-500',
    orange: 'bg-orange-500',
    rose: 'bg-rose-500'
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group bg-white ${colors[variant]}`}>
      <div className="flex justify-between items-start mb-6">
        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{title}</h5>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black">%{data.score}</span>
          <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${barColors[variant]}`} style={{ width: `${data.score}%` }}></div>
          </div>
        </div>
      </div>
      <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-6 italic">"{data.comment}"</p>
      <div className="flex flex-wrap gap-2">
        {data.keyPoints?.map((p: string, i: number) => (
          <span key={i} className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:border-orange-200 transition-colors">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
};

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSchedulingPopupOpen, setIsSchedulingPopupOpen] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    date: candidate.interviewSchedule?.date || '',
    time: candidate.interviewSchedule?.time || '',
    method: candidate.interviewSchedule?.method || 'Yüz Yüze',
    location: candidate.interviewSchedule?.location || config?.interviewSettings?.defaultMeetingLink || 'Yeni Gün Akademi Merkez Ofis',
    type: 'Akademik Değerlendirme'
  });

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    setErrorMessage(null);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const updated = { ...candidate, report: aiReport, algoReport, updated_at: new Date().toISOString() };
      onUpdate(updated);
      setSuccessStatus("Stratejik Karar Matrisi Güncellendi");
      setTimeout(() => setSuccessStatus(null), 3000);
    } catch (e: any) {
      setErrorMessage(e.message || "Analiz motorunda teknik aksama.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewForm.date || !interviewForm.time) {
      setErrorMessage("Lütfen mülakat lojistiğini tamamlayınız.");
      return;
    }
    setIsScheduling(true);
    try {
      const updatedCandidate: Candidate = {
        ...candidate,
        status: 'interview_scheduled',
        interviewSchedule: { ...interviewForm, isNotificationSent: config?.automation?.autoEmailOnSchedule ?? true },
        updated_at: new Date().toISOString()
      };
      onUpdate(updatedCandidate);
      setSuccessStatus("Mülakat Protokolü Kaydedildi");
      setIsSchedulingPopupOpen(false);
      setTimeout(() => setSuccessStatus(null), 4000);
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsScheduling(false);
    }
  };

  const updateStatus = (newStatus: Candidate['status']) => {
    onUpdate({ ...candidate, status: newStatus, updated_at: new Date().toISOString() });
  };

  const getVariant = (score: number) => score > 75 ? 'emerald' : score > 45 ? 'orange' : 'rose';

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {/* PROFESSIONAL SCHEDULING MODAL */}
      {isSchedulingPopupOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in no-print">
          <div className="w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl overflow-hidden border-8 border-white/20 animate-scale-in">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/40">
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4">Mülakat Konfigürasyonu</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Operasyonel Planlama</p>
              </div>
              <button onClick={() => setIsSchedulingPopupOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 hover:text-rose-600 transition-all font-black text-xl">×</button>
            </div>
            <div className="p-12 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <input type="date" className="p-6 rounded-3xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all" value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})} />
                <input type="time" className="p-6 rounded-3xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all" value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-3xl">
                {['Yüz Yüze', 'Meet', 'Zoom', 'Telefon'].map(m => (
                  <button key={m} onClick={() => setInterviewForm({...interviewForm, method: m})} className={`py-4 rounded-2xl text-[9px] font-black uppercase transition-all ${interviewForm.method === m ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{m}</button>
                ))}
              </div>
              <textarea className="w-full p-8 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-orange-600 outline-none font-bold text-slate-800 transition-all min-h-[120px] resize-none" value={interviewForm.location} onChange={e => setInterviewForm({...interviewForm, location: e.target.value})} placeholder="Toplantı detaylarını buraya girin..." />
            </div>
            <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button onClick={() => setIsSchedulingPopupOpen(false)} className="flex-1 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-400">İptal</button>
              <button onClick={handleScheduleInterview} disabled={isScheduling} className="flex-[2] py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all">{isScheduling ? 'İŞLENİYOR...' : 'RANDEVUYU ONAYLA'}</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="p-12 border-b border-slate-50 bg-slate-50/40 flex flex-col xl:flex-row justify-between items-center gap-10 no-print">
        <div className="flex gap-8 items-center">
          <div className="w-24 h-24 bg-slate-900 rounded-[3rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative overflow-hidden group">
            <span className="relative z-10">{candidate.name.charAt(0)}</span>
            <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <StatusBadge status={candidate.status} />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">AKD-{candidate.id.toUpperCase()}</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mt-2">{candidate.name}</h2>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => setIsSchedulingPopupOpen(true)} className="px-10 py-6 rounded-[2.2rem] bg-orange-50 border-2 border-orange-100 font-black text-[11px] uppercase tracking-widest text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-orange-600/5">RANDEVU OLUŞTUR</button>
          <button onClick={handleRunAnalysis} disabled={isAnalysing} className={`px-12 py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-widest transition-all ${isAnalysing ? 'bg-slate-200 animate-pulse text-slate-400' : 'bg-slate-900 text-white shadow-2xl hover:bg-orange-600'}`}>{isAnalysing ? 'ANALİZ EDİLİYOR...' : 'YENİ ANALİZ ÜRET'}</button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar">
        
        {successStatus && (
          <div className="p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] flex items-center gap-6 animate-bounce-y text-emerald-800 font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-emerald-500/10">
            <span className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg">✓</span>
            <span>{successStatus}</span>
          </div>
        )}

        {/* ACTIVE SCHEDULE PREVIEW */}
        {candidate.interviewSchedule && (
          <section className="bg-slate-900 rounded-[4rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group shadow-2xl">
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-orange-600 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-xl shadow-orange-600/40">
                 <span className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">{new Date(candidate.interviewSchedule.date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                 <span className="text-3xl font-black leading-none">{candidate.interviewSchedule.date.split('-')[2]}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2">Planlı Mülakat</p>
                <h4 className="text-3xl font-black tracking-tighter uppercase leading-none">{candidate.interviewSchedule.method} @ {candidate.interviewSchedule.time}</h4>
                <p className="text-[11px] font-bold text-slate-400 mt-3 truncate max-w-md">{candidate.interviewSchedule.location}</p>
              </div>
            </div>
            <button onClick={() => setIsSchedulingPopupOpen(true)} className="px-10 py-5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 border border-white/20">DÜZENLE</button>
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
          </section>
        )}

        {/* COMPACT BENTO-ANALYSIS DASHBOARD */}
        {candidate.report ? (
          <section className="space-y-12">
            
            {/* Skor ve Özet Bloğu */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-50 p-12 rounded-[4rem] border-2 border-slate-50 relative overflow-hidden flex flex-col justify-center">
                 <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.5em] mb-6">Stratejik Karar Özeti</h3>
                 <p className="text-2xl font-bold leading-snug italic text-slate-800">"{candidate.report.summary}"</p>
                 <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703V14H12.017C14.2262 14 16.017 12.2091 16.017 10V7C16.017 5.89543 15.1216 5 14.017 5H10.017C8.91246 5 8.01703 5.89543 8.01703 7V10C8.01703 11.1046 8.91246 12 10.017 12H13.017V14H10.017C7.80789 14 6.01703 15.7909 6.01703 18V21H14.017Z" /></svg>
                 </div>
              </div>
              <div className="bg-slate-900 p-12 rounded-[4rem] flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden group">
                <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2 relative z-10">Liyakat Katsayısı</p>
                <span className="text-7xl font-black tracking-tighter relative z-10">%{candidate.report.score}</span>
                <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-[85%] transition-transform duration-700 opacity-20"></div>
              </div>
            </div>

            {/* Kategorik Analiz Bento Grid */}
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.4em]">Derinlemesine Yetkinlik Matrisi</h4>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              
              {/* Grup 1: Profesyonel Çekirdek */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnalysisTile title="Etik Bütünlük & Sınırlar" data={candidate.report.detailedAnalysis.ethics} variant={getVariant(candidate.report.detailedAnalysis.ethics.score)} />
                <AnalysisTile title="Klinik Muhakeme Yetisi" data={candidate.report.detailedAnalysis.clinicalWisdom} variant={getVariant(candidate.report.detailedAnalysis.clinicalWisdom.score)} />
              </div>

              {/* Grup 2: Operasyonel Performans */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnalysisTile title="Metodolojik Pedagoji" data={candidate.report.detailedAnalysis.pedagogy} variant={getVariant(candidate.report.detailedAnalysis.pedagogy.score)} />
                <AnalysisTile title="Kriz & Stres Yanıtı" data={candidate.report.detailedAnalysis.stressResponse} variant={getVariant(candidate.report.detailedAnalysis.stressResponse.score)} />
                <AnalysisTile title="Duygusal Dayanıklılık" data={candidate.report.detailedAnalysis.emotionalResilience} variant={getVariant(candidate.report.detailedAnalysis.emotionalResilience.score)} />
              </div>
            </div>

            {/* SWOT & Karar Bloğu */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-emerald-50/40 p-10 rounded-[4rem] border-2 border-emerald-100">
                  <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.3em] mb-8">Kritik Avantajlar</h5>
                  <div className="space-y-4">
                    {candidate.report.swot.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-[2rem] border border-emerald-50 shadow-sm">
                         <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">✓</span>
                         <p className="text-[12px] font-bold text-slate-700 leading-tight">{s}</p>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-rose-50/40 p-10 rounded-[4rem] border-2 border-rose-100">
                  <h5 className="text-[10px] font-black text-rose-800 uppercase tracking-[0.3em] mb-8">Potansiyel Riskler</h5>
                  <div className="space-y-4">
                    {candidate.report.swot.threats.map((t, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-[2rem] border border-rose-50 shadow-sm">
                         <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">!</span>
                         <p className="text-[12px] font-bold text-slate-700 leading-tight">{t}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Tavsiye Paneli */}
            <div className="p-12 bg-white border-2 border-slate-100 rounded-[4rem] shadow-xl">
               <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6">Mülakat ve Karar Tavsiyesi</h4>
               <p className="text-lg font-bold text-slate-600 leading-relaxed border-l-8 border-orange-600 pl-10">
                 {candidate.report.recommendation}
               </p>
            </div>

          </section>
        ) : (
          <div className="py-40 text-center border-4 border-dashed border-slate-100 rounded-[5rem] bg-slate-50/30">
             <div className="w-24 h-24 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
               <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-sm">Akademik Karar Verisi Bulunamadı</p>
             <button onClick={handleRunAnalysis} className="mt-8 px-12 py-6 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">Analizi Şimdi Başlat</button>
          </div>
        )}

        {/* ADMIN PRIVATE NOTES AREA */}
        <section className="space-y-8 pb-24 pt-12">
          <div className="flex items-center gap-8">
            <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-4 border-orange-600 pl-6">Yönetici Özel Notları</h4>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>
          <textarea 
            className="w-full p-16 rounded-[4.5rem] bg-slate-50 border-2 border-transparent focus:border-orange-600 outline-none font-bold text-slate-800 min-h-[300px] resize-none transition-all shadow-inner text-xl leading-relaxed"
            placeholder="Adayın mülakat performansı, beklentileri ve klinik tutumu hakkındaki özel notlarınızı buraya işleyiniz..."
            value={candidate.adminNotes || ''}
            onChange={e => onUpdate({...candidate, adminNotes: e.target.value})}
          />
        </section>
      </div>
    </div>
  );
};

export default CandidateDetail;
