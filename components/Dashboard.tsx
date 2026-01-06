
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, Branch, UserRole, AdminUser } from '../types';
import CandidateReport from './CandidateReport';
import { FORM_STEPS, MOCK_QUESTIONS } from '../constants';

interface DashboardProps {
  candidates: Candidate[];
  onDelete?: (id: string) => void;
  onUpdate?: (candidate: Candidate) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onDelete, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'calendar'>('overview');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'report' | 'cv_details' | 'answers' | 'notes'>('report');
  const [searchTerm, setSearchTerm] = useState('');
  const [localNote, setLocalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  
  // Calendar & Email States
  const [schedulingCandidateId, setSchedulingCandidateId] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [lastSentTo, setLastSentTo] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedCandidateId), [candidates, selectedCandidateId]);

  useEffect(() => {
    if (selectedCandidate) {
      setLocalNote(selectedCandidate.adminNotes || '');
    }
  }, [selectedCandidateId, selectedCandidate]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  const handleSaveNote = async () => {
    if (!selectedCandidate || !onUpdate) return;
    setIsSavingNote(true);
    try {
      const updatedCandidate = { ...selectedCandidate, adminNotes: localNote };
      await onUpdate(updatedCandidate);
      setTimeout(() => setIsSavingNote(false), 500);
    } catch (error) {
      console.error("Not kaydedilemedi", error);
      setIsSavingNote(false);
    }
  };

  const handleScheduleAndSendEmail = async (date: string, time: string) => {
    if (!schedulingCandidateId || !onUpdate) return;
    const candidate = candidates.find(c => c.id === schedulingCandidateId);
    if (!candidate) return;

    setLastSentTo(candidate.email);
    setIsSendingEmail(true);
    setEmailStatus('sending');
    
    const location = 'Yeni Gün Akademi - Ana Bina / Klinik Birimi';
    
    try {
      // GERÇEK API ÇAĞRISI
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: candidate.email,
          candidateName: candidate.name,
          date,
          time,
          location
        })
      });

      if (!response.ok) throw new Error('E-posta servisi yanıt vermedi.');

      const updatedCandidate: Candidate = {
        ...candidate,
        status: 'scheduled',
        interviewSchedule: {
          date,
          time,
          location,
          method: 'Yüz Yüze'
        }
      };

      await onUpdate(updatedCandidate);
      setEmailStatus('success');
      
      // Başarı ekranını 2 saniye göster sonra kapat
      setTimeout(() => {
        setIsSendingEmail(false);
        setEmailStatus('idle');
        setSchedulingCandidateId(null);
      }, 2000);

    } catch (error) {
      console.error("E-posta gönderim hatası:", error);
      setEmailStatus('error');
      setTimeout(() => {
        setIsSendingEmail(false);
        setEmailStatus('idle');
      }, 3000);
    }
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in min-h-[85vh]">
      <aside className="lg:w-72 space-y-3">
        <div className="p-8 mb-6 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Yönetici Paneli</h2>
          <p className="text-2xl font-black mt-1 tracking-tighter">Yeni Gün Akademi</p>
        </div>

        {[
          { id: 'overview', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'Dashboard' },
          { id: 'candidates', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0', label: 'Aday Havuzu' },
          { id: 'calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'E-Posta Planlama' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[2rem] transition-all duration-300 font-black text-[11px] uppercase tracking-widest group ${
              activeTab === item.id ? 'bg-orange-600 text-white shadow-2xl translate-x-2' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      <main className="flex-1 space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-56 transition-all hover:shadow-xl group">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Toplam Aday</span>
               <div className="text-6xl font-black text-slate-900 tracking-tighter group-hover:text-orange-600 transition-colors">{candidates.length}</div>
               <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">Aktif Akış</div>
            </div>
            <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl flex flex-col justify-between h-56 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-orange-600 blur-[80px] opacity-20"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">E-Posta Bekleyen</span>
               <div className="text-6xl font-black text-orange-600 tracking-tighter">{candidates.filter(c => c.status === 'pending').length}</div>
               <div className="text-[10px] font-bold text-slate-500 uppercase">Aday Kuyruğu</div>
            </div>
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-56">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Davet Gönderildi</span>
               <div className="text-6xl font-black text-slate-900 tracking-tighter">{candidates.filter(c => c.status === 'scheduled').length}</div>
               <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest">Planlı Görüşmeler</div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
              <div className="sticky top-0 bg-[#FDFDFD] pb-4 z-10">
                <input 
                  type="text" 
                  placeholder="Aday Havuzunda Ara..."
                  className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-sm font-bold outline-none shadow-sm focus:border-orange-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {filteredCandidates.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCandidateId(c.id); setDetailTab('report'); }}
                  className={`w-full text-left p-8 rounded-[3rem] transition-all border-2 relative group overflow-hidden ${
                    selectedCandidateId === c.id ? 'bg-white border-orange-500 shadow-2xl scale-[1.02] z-10' : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors text-lg tracking-tight">{c.name}</h4>
                    {c.status === 'scheduled' ? (
                      <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Mühürlendi</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-400 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Bekliyor</span>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{c.branch}</p>
                </button>
              ))}
            </div>

            <div className="xl:col-span-8">
              {selectedCandidate ? (
                <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[70vh] flex flex-col animate-scale-in">
                  <div className="flex bg-slate-50/50 p-3 gap-3 border-b border-slate-100 overflow-x-auto custom-scrollbar">
                    {['report', 'cv_details', 'answers', 'notes'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setDetailTab(tab as any)}
                        className={`flex-1 min-w-[120px] py-5 text-[11px] font-black uppercase tracking-widest rounded-[1.8rem] transition-all ${
                          detailTab === tab ? 'bg-white text-orange-600 shadow-xl' : 'text-slate-400 hover:bg-white/50'
                        }`}
                      >
                        {tab === 'report' ? 'Yapay Zeka Analizi' : tab === 'cv_details' ? 'Aday Profili' : tab === 'answers' ? 'Yanıtlar' : 'Mülakat Notları'}
                      </button>
                    ))}
                  </div>

                  <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                    {detailTab === 'report' && selectedCandidate.report && <CandidateReport report={selectedCandidate.report} name={selectedCandidate.name} />}
                    {detailTab === 'cv_details' && (
                      <div className="space-y-10 animate-fade-in">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">İletişim Bilgileri</h4>
                            <p className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                               <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={2}/></svg>
                               {selectedCandidate.email}
                            </p>
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                               <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth={2}/></svg>
                               {selectedCandidate.phone}
                            </p>
                            <p className="font-bold text-slate-900">Yaş: {selectedCandidate.age} | Deneyim: {selectedCandidate.experienceYears} Yıl</p>
                          </div>
                          {selectedCandidate.status === 'scheduled' && (
                           <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-center">
                              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">E-Posta Onaylı</h4>
                              <p className="text-xl font-black text-slate-900 leading-tight">{selectedCandidate.interviewSchedule?.date}</p>
                              <p className="text-lg font-bold text-slate-600">{selectedCandidate.interviewSchedule?.time}</p>
                           </div>
                          )}
                        </div>
                        <div className="space-y-6">
                           <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem]">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Eğitim & Kurum Geçmişi</h4>
                              <p className="text-slate-800 font-bold leading-relaxed whitespace-pre-wrap">{selectedCandidate.previousInstitutions || 'Veri bulunmuyor.'}</p>
                           </div>
                        </div>
                      </div>
                    )}
                    {detailTab === 'notes' && (
                      <div className="space-y-8 animate-fade-in">
                        <textarea className="w-full h-80 p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none focus:border-orange-500 font-semibold text-slate-700 leading-relaxed shadow-xl" placeholder="Aday hakkındaki mülakat notlarınızı buraya kaydedin..." value={localNote} onChange={(e) => setLocalNote(e.target.value)} />
                        <div className="flex justify-end"><button onClick={handleSaveNote} disabled={isSavingNote} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all">{isSavingNote ? 'Kaydediliyor...' : 'Notları Kaydet'}</button></div>
                      </div>
                    )}
                    {detailTab === 'answers' && (
                      <div className="space-y-8 animate-fade-in">
                        {Object.entries(selectedCandidate.answers).map(([qid, val]) => (
                          <div key={qid} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Vaka Analizi / Soru</p>
                             <p className="font-bold text-slate-900">{Array.isArray(val) ? val.join(', ') : val}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-200 uppercase font-black tracking-widest text-2xl border-4 border-dashed border-slate-100 rounded-[4rem]">Aday Seçin</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">E-Posta Davet Matrisi</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-wider">Planlanan her slot için adaya otomatik gerçek onay e-postası gönderilecektir.</p>
                  </div>
                  <div className="w-full md:w-auto">
                     <label className="block text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 ml-1">Mülakat Yapılacak Adayı Seçin</label>
                     <select 
                       className="w-full md:w-64 bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl font-black text-xs uppercase tracking-widest outline-none focus:border-orange-500 transition-all"
                       value={schedulingCandidateId || ''}
                       onChange={(e) => setSchedulingCandidateId(e.target.value)}
                     >
                       <option value="">Aday Seçin...</option>
                       {candidates.filter(c => c.status === 'pending').map(c => (
                         <option key={c.id} value={c.id}>{c.name} ({c.branch.split(' ')[0]})</option>
                       ))}
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {calendarDays.map(day => (
                    <div key={day} className="space-y-4">
                       <div className="text-center p-5 bg-slate-900 text-white rounded-[2rem] shadow-lg">
                          <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{new Date(day).toLocaleDateString('tr-TR', { weekday: 'long' })}</p>
                          <p className="text-2xl font-black leading-none">{new Date(day).getDate()}</p>
                       </div>
                       <div className="space-y-3">
                          {timeSlots.map(time => {
                            const bookedCandidate = candidates.find(c => c.interviewSchedule?.date === day && c.interviewSchedule?.time === time);
                            const isBooked = !!bookedCandidate;
                            
                            return (
                              <button
                                key={`${day}-${time}`}
                                onClick={() => !isBooked && schedulingCandidateId && handleScheduleAndSendEmail(day, time)}
                                disabled={isBooked || !schedulingCandidateId}
                                className={`w-full p-5 rounded-[2rem] border-2 transition-all group relative overflow-hidden flex flex-col items-center justify-center min-h-[80px] ${
                                  isBooked 
                                  ? 'bg-orange-50 border-orange-200 cursor-not-allowed' 
                                  : schedulingCandidateId 
                                    ? 'bg-white border-slate-100 hover:border-orange-500 hover:shadow-xl cursor-pointer hover:-translate-y-1' 
                                    : 'bg-slate-50 border-slate-100 opacity-50 cursor-default'
                                }`}
                              >
                                <span className={`text-sm font-black ${isBooked ? 'text-orange-600' : 'text-slate-900'}`}>{time}</span>
                                {isBooked && (
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1 truncate w-full text-center px-1">
                                    {bookedCandidate?.name.split(' ')[0]}
                                  </span>
                                )}
                                {!isBooked && schedulingCandidateId && (
                                  <div className="absolute inset-0 bg-orange-600 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={2.5}/></svg>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Davet Gönder</span>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* E-Posta Gönderim Animasyonu */}
      {isSendingEmail && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[300] flex items-center justify-center p-6">
           <div className="bg-white p-16 rounded-[5rem] text-center max-w-xl animate-scale-in relative overflow-hidden border border-orange-100 shadow-2xl">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-[80px]"></div>
              
              <div className="relative mb-10">
                 {emailStatus === 'sending' && (
                    <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] mx-auto flex items-center justify-center text-white animate-bounce shadow-xl">
                       <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                       </svg>
                    </div>
                 )}
                 {emailStatus === 'success' && (
                    <div className="w-24 h-24 bg-emerald-600 rounded-full mx-auto flex items-center justify-center text-white shadow-xl scale-110 transition-transform">
                       <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                 )}
                 {emailStatus === 'error' && (
                    <div className="w-24 h-24 bg-rose-600 rounded-full mx-auto flex items-center justify-center text-white shadow-xl">
                       <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                    </div>
                 )}
              </div>

              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
                 {emailStatus === 'sending' ? 'E-Posta Yola Çıktı' : emailStatus === 'success' ? 'Başarıyla İletildi' : 'Gönderim Başarısız'}
              </h3>
              <p className="text-slate-500 font-bold text-lg leading-relaxed mb-4">
                 {emailStatus === 'sending' ? (
                    <> <span className="text-orange-600">{lastSentTo}</span> adresine kurumsal mülakat davetiyesi iletiliyor... </>
                 ) : emailStatus === 'success' ? (
                    "Adaya tüm mülakat detayları başarıyla ulaştırıldı. Takvim mühürlendi."
                 ) : (
                    "E-posta servisine ulaşılamadı. Lütfen internet bağlantınızı veya API ayarlarınızı kontrol edin."
                 )}
              </p>
              
              {emailStatus === 'sending' && (
                <div className="mt-10 h-2 w-48 bg-slate-100 rounded-full mx-auto overflow-hidden">
                   <div className="h-full bg-emerald-500 animate-progress"></div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
