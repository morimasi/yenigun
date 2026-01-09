
import React, { useState } from 'react';
import { Candidate } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import CandidateReport from '../CandidateReport';
import StatusBadge from './StatusBadge';

interface CandidateDetailProps {
  candidate: Candidate;
  onUpdate: (c: Candidate) => void;
  onDelete: () => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'info' | 'admin'>('analysis');
  const [analysisMode, setAnalysisMode] = useState<'hybrid' | 'ai' | 'algo'>('hybrid');

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate);
      onUpdate({ ...candidate, report: aiReport, algoReport });
    } catch (e) {
      alert("Analiz motoru hatası. API anahtarınızı kontrol edin.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleStatusChange = (status: Candidate['status']) => {
    onUpdate({ ...candidate, status });
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate.interviewSchedule?.date || !candidate.interviewSchedule?.time) {
      alert("Lütfen tarih ve saat seçiniz.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: candidate.email,
          candidateName: candidate.name,
          date: candidate.interviewSchedule.date,
          time: candidate.interviewSchedule.time,
          location: 'Yeni Gün Akademi Merkez Kampüs'
        })
      });

      if (response.ok) {
        onUpdate({
          ...candidate,
          interviewSchedule: { ...candidate.interviewSchedule, isNotificationSent: true }
        });
        alert("Resmi mülakat davetiyesi başarıyla gönderildi.");
      } else {
        throw new Error();
      }
    } catch {
      alert("E-posta gönderimi sırasında bir hata oluştu. Lütfen servis sağlayıcınızı kontrol edin.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in">
      {/* Header Section */}
      <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={candidate.status} />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Giriş: {new Date(candidate.timestamp).toLocaleDateString()}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{candidate.name}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">{candidate.branch} • {candidate.experienceYears} Yıl</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full xl:w-auto">
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalysing}
            className={`flex-1 xl:flex-none px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 ${
              isAnalysing ? 'bg-slate-200 text-slate-500 animate-pulse' : 'bg-orange-600 text-white hover:bg-slate-900'
            }`}
          >
            {isAnalysing ? 'Analiz Ediliyor...' : 'Motorları Çalıştır'}
          </button>
          <button 
            onClick={onDelete}
            className="p-5 rounded-[1.8rem] bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all border border-rose-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="flex bg-white border-b border-slate-50 px-10">
        {[
          { id: 'analysis', label: 'Stratejik Analiz' },
          { id: 'info', label: 'Başvuru Dosyası' },
          { id: 'admin', label: 'Operasyonel Karar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab.id ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
        {activeTab === 'analysis' && (
          <div className="space-y-12 animate-fade-in">
             {(candidate.report || candidate.algoReport) ? (
                <div className="space-y-10">
                  <div className="flex justify-center">
                    <div className="bg-slate-50 p-2 rounded-2xl flex gap-1 border border-slate-100">
                      {['hybrid', 'ai', 'algo'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => setAnalysisMode(mode as any)}
                          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            analysisMode === mode ? 'bg-white shadow-xl text-orange-600' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {mode === 'hybrid' ? 'Hibrid Analiz' : mode.toUpperCase() + ' Modeli'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <CandidateReport 
                    report={candidate.report} 
                    algoReport={candidate.algoReport} 
                    name={candidate.name} 
                    viewMode={analysisMode}
                  />
                </div>
              ) : (
                <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">Analiz Bekleniyor</p>
                  <button onClick={handleRunAnalysis} className="mt-8 text-orange-600 font-black text-[10px] uppercase border-b-2 border-orange-200 pb-1">Motorları Tetikle</button>
                </div>
              )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
             <section className="space-y-8">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Uzmanlık Verileri</h4>
               <div className="bg-slate-50 p-8 rounded-[3rem] space-y-4 border border-slate-100">
                  <div className="flex justify-between border-b pb-4"><span className="text-xs font-bold text-slate-400">E-Posta</span><span className="text-xs font-black">{candidate.email}</span></div>
                  <div className="flex justify-between border-b pb-4"><span className="text-xs font-bold text-slate-400">Deneyim</span><span className="text-xs font-black">{candidate.experienceYears} Yıl</span></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase mb-2">Eğitimler</p><p className="text-sm font-bold text-slate-800">{candidate.allTrainings}</p></div>
               </div>
             </section>
             <section className="space-y-8">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Kurumsal Geçmiş</h4>
               <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 h-full">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{candidate.previousInstitutions}</p>
               </div>
             </section>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-12 animate-fade-in pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <section className="space-y-8">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Süreç Yönetimi</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'pending', label: 'Beklemede' },
                    { id: 'interview_scheduled', label: 'Mülakat Planla' },
                    { id: 'rejected', label: 'Reddet' },
                    { id: 'hired', label: 'İşe Alındı' }
                  ].map(status => (
                    <button
                      key={status.id}
                      onClick={() => handleStatusChange(status.id as any)}
                      className={`p-8 rounded-[2.5rem] border-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                        candidate.status === status.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-600'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Panel Notları</h4>
                <textarea
                  className="w-full bg-slate-50 rounded-[3rem] p-10 h-64 outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all font-bold text-slate-800 text-sm shadow-inner"
                  placeholder="İş görüşmesi detayları..."
                  value={candidate.adminNotes || ''}
                  onChange={e => onUpdate({ ...candidate, adminNotes: e.target.value })}
                />
              </section>
            </div>

            {candidate.status === 'interview_scheduled' && (
              <section className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl border border-slate-800 animate-slide-up">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h4 className="text-2xl font-black tracking-tighter mb-2">Gelişmiş Planlayıcı</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Resmi Kurumsal Davetiye Gönderimi</p>
                   </div>
                </div>
                
                <form onSubmit={sendInvitation} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Görüşme Tarihi</label>
                    <input 
                      type="date" required
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-black text-sm outline-none focus:border-orange-600 transition-all text-white"
                      value={candidate.interviewSchedule?.date || ''}
                      onChange={e => onUpdate({...candidate, interviewSchedule: { ...candidate.interviewSchedule!, date: e.target.value, time: candidate.interviewSchedule?.time || '', location: 'Yeni Gün Akademi Merkez Bina', method: 'Yüz Yüze', isNotificationSent: false }})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Saat</label>
                    <input 
                      type="time" required
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-black text-sm outline-none focus:border-orange-600 transition-all text-white"
                      value={candidate.interviewSchedule?.time || ''}
                      onChange={e => onUpdate({...candidate, interviewSchedule: { ...candidate.interviewSchedule!, time: e.target.value, date: candidate.interviewSchedule?.date || '', location: 'Yeni Gün Akademi Merkez Bina', method: 'Yüz Yüze', isNotificationSent: false }})}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit" 
                      disabled={isSendingEmail}
                      className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all ${
                        isSendingEmail ? 'bg-slate-700 animate-pulse' : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-1'
                      }`}
                    >
                      {isSendingEmail ? 'E-POSTA GÖNDERİLİYOR...' : (candidate.interviewSchedule?.isNotificationSent ? 'TEKRAR GÖNDER' : 'DAVET ET VE KAYDET')}
                    </button>
                  </div>
                </form>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
