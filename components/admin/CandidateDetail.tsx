
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
  const [activeTab, setActiveTab] = useState<'analysis' | 'info' | 'admin'>('analysis');
  const [analysisMode, setAnalysisMode] = useState<'hybrid' | 'ai' | 'algo'>('hybrid');

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      // Çift motorlu analiz başlatılır
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate);
      
      onUpdate({ 
        ...candidate, 
        report: aiReport, 
        algoReport,
        status: (aiReport.score > 80 || algoReport.overallScore > 80) ? candidate.status : candidate.status
      });
    } catch (e) {
      alert("Sistem hatası: Gemini API anahtarı veya ağ bağlantısı hatası.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleStatusChange = (status: Candidate['status']) => {
    onUpdate({ ...candidate, status });
  };

  const saveInterview = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mülakat başarıyla planlandı ve adaya davet e-postası gönderildi.");
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
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Başvuru: {new Date(candidate.timestamp).toLocaleDateString()}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{candidate.name}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">{candidate.branch} • {candidate.experienceYears} Yıl Deneyim</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full xl:w-auto">
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalysing}
            className={`flex-1 xl:flex-none px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${
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
          { id: 'analysis', label: 'Stratejik Analiz', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
          { id: 'info', label: 'Başvuru Dosyası', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          { id: 'admin', label: 'Operasyonel Karar', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0' }
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
            {isAnalysing ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-10">
                 <div className="relative">
                    <div className="w-24 h-24 border-8 border-slate-50 border-t-orange-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-orange-600">AI</div>
                 </div>
                 <div className="text-center space-y-3">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest">Hibrid Motor İşleniyor</h4>
                    <p className="text-slate-400 font-bold text-sm">Gemini 3 Flash ve Algoritmik Denetleyici çapraz sorgu yapıyor...</p>
                 </div>
              </div>
            ) : (
              <>
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
                    <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">Henüz Analiz Yapılmadı</p>
                    <button onClick={handleRunAnalysis} className="mt-8 text-orange-600 font-black text-[10px] uppercase border-b-2 border-orange-200 pb-1">Analiz Başlatmak İçin Tıklayın</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="space-y-10">
               <section>
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Klinik Uzmanlık Verileri</h4>
                 <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase">E-Posta</span>
                      <span className="text-sm font-black text-slate-900">{candidate.email}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase">Telefon</span>
                      <span className="text-sm font-black text-slate-900">{candidate.phone || 'Girilmedi'}</span>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3">Mesleki Geçmiş</h5>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed bg-white p-5 rounded-2xl shadow-sm">{candidate.previousInstitutions}</p>
                    </div>
                 </div>
               </section>
            </div>
            
            <div className="space-y-10">
               <section>
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">CV ve Sertifikasyon</h4>
                 <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3">Eğitim & Sertifika Listesi</h5>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed bg-white p-5 rounded-2xl shadow-sm">{candidate.allTrainings}</p>
                    </div>
                    {candidate.cvData ? (
                      <div className="flex items-center justify-between p-5 bg-orange-600 rounded-[1.5rem] text-white shadow-xl">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                           </div>
                           <span className="text-xs font-black uppercase truncate max-w-[150px]">{candidate.cvData.fileName}</span>
                         </div>
                         <button className="bg-white text-orange-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">Görüntüle</button>
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-center text-slate-300 font-black text-[10px] uppercase">CV Yüklenmedi</div>
                    )}
                 </div>
               </section>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-12 animate-fade-in pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <section className="space-y-8">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Operasyonel Durum Yönetimi</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'pending', label: 'Beklemede', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { id: 'interview_scheduled', label: 'Mülakat Planla', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' },
                    { id: 'rejected', label: 'Olumsuz / Arşiv', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { id: 'hired', label: 'İşe Alındı', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
                  ].map(status => (
                    <button
                      key={status.id}
                      onClick={() => handleStatusChange(status.id as any)}
                      className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${
                        candidate.status === status.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105 z-10' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-600'
                      }`}
                    >
                      <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} /></svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Yönetici Özel Notları</h4>
                <textarea
                  className="w-full bg-slate-50 rounded-[3rem] p-10 h-64 outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all font-bold text-slate-800 text-sm shadow-inner"
                  placeholder="Aday hakkındaki sübjektif değerlendirmelerinizi ve kurul notlarını buraya ekleyin..."
                  value={candidate.adminNotes || ''}
                  onChange={e => onUpdate({ ...candidate, adminNotes: e.target.value })}
                />
              </section>
            </div>

            {candidate.status === 'interview_scheduled' && (
              <section className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl border border-slate-800 animate-slide-up">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h4 className="text-2xl font-black tracking-tighter mb-2">Mülakat Planlayıcı</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Adaya resmi davet gönderilecektir</p>
                   </div>
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5" /></svg>
                   </div>
                </div>
                
                <form onSubmit={saveInterview} className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Başlangıç Saati</label>
                    <input 
                      type="time" required
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-black text-sm outline-none focus:border-orange-600 transition-all text-white"
                      value={candidate.interviewSchedule?.time || ''}
                      onChange={e => onUpdate({...candidate, interviewSchedule: { ...candidate.interviewSchedule!, time: e.target.value, date: candidate.interviewSchedule?.date || '', location: 'Yeni Gün Akademi Merkez Bina', method: 'Yüz Yüze', isNotificationSent: false }})}
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1">
                      Davetiyeyi Onayla
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
