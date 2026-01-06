
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [localNote, setLocalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  
  // Calendar States
  const [schedulingCandidateId, setSchedulingCandidateId] = useState<string | null>(null);
  const [isSendingNotification, setIsSendingNotification] = useState(false);

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

  const handleScheduleInterview = async (date: string, time: string) => {
    if (!schedulingCandidateId || !onUpdate) return;
    const candidate = candidates.find(c => c.id === schedulingCandidateId);
    if (!candidate) return;

    setIsSendingNotification(true);
    
    // Simulate notification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedCandidate: Candidate = {
      ...candidate,
      status: 'scheduled',
      interviewSchedule: {
        date,
        time,
        location: 'Yeni Gün Akademi - Ana Bina',
        method: 'Yüz Yüze'
      }
    };

    await onUpdate(updatedCandidate);
    setIsSendingNotification(false);
    setSchedulingCandidateId(null);
    alert(`${candidate.name} için mülakat planlandı ve onay bildirimleri gönderildi.`);
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
          { id: 'calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Planlama' }
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
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mülakat Bekleyen</span>
               <div className="text-6xl font-black text-orange-600 tracking-tighter">{candidates.filter(c => c.status === 'pending').length}</div>
               <div className="text-[10px] font-bold text-slate-500 uppercase">Aday Kuyruğu</div>
            </div>
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-56">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Planlanmış</span>
               <div className="text-6xl font-black text-slate-900 tracking-tighter">{candidates.filter(c => c.status === 'scheduled').length}</div>
               <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest">Takvim Doluluğu</div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
              <input 
                type="text" 
                placeholder="Aday Havuzunda Ara..."
                className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-sm font-bold outline-none mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                    {c.status === 'scheduled' && <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Planlı</span>}
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
                        {tab === 'report' ? 'Analiz' : tab === 'cv_details' ? 'Profil' : tab === 'answers' ? 'Yanıtlar' : 'Notlar'}
                      </button>
                    ))}
                  </div>

                  <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                    {detailTab === 'report' && selectedCandidate.report && <CandidateReport report={selectedCandidate.report} name={selectedCandidate.name} />}
                    {detailTab === 'cv_details' && (
                      <div className="space-y-10 animate-fade-in">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">İletişim & Temel Bilgi</h4>
                            <p className="font-bold text-slate-900">E: {selectedCandidate.email}</p>
                            <p className="font-bold text-slate-900">T: {selectedCandidate.phone}</p>
                            <p className="font-bold text-slate-900">Yaş: {selectedCandidate.age}</p>
                            <p className="font-bold text-slate-900">Deneyim: {selectedCandidate.experienceYears} Yıl</p>
                          </div>
                          <div className="p-8 bg-orange-50/50 rounded-[2.5rem] border border-orange-100/50 flex flex-col items-center justify-center">
                            {selectedCandidate.cvData ? (
                              <button className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">CV Dosyasını İndir</button>
                            ) : (
                              <p className="text-[10px] font-black text-orange-800 uppercase">CV Yüklenmedi</p>
                            )}
                          </div>
                        </div>
                        {selectedCandidate.status === 'scheduled' && (
                           <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between">
                              <div>
                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Planlanmış Mülakat</h4>
                                <p className="text-xl font-black text-slate-900">{selectedCandidate.interviewSchedule?.date} | {selectedCandidate.interviewSchedule?.time}</p>
                                <p className="text-sm font-bold text-slate-500 mt-1">{selectedCandidate.interviewSchedule?.location} ({selectedCandidate.interviewSchedule?.method})</p>
                              </div>
                              <div className="p-4 bg-emerald-500 text-white rounded-2xl">
                                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                           </div>
                        )}
                        <div className="space-y-6">
                           <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem]">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Eğitim Geçmişi & Kurumlar</h4>
                              <p className="text-slate-800 font-bold leading-relaxed whitespace-pre-wrap">{selectedCandidate.previousInstitutions || 'Veri girilmemiş.'}</p>
                           </div>
                           <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem]">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sertifikalar & Uzmanlıklar</h4>
                              <p className="text-slate-800 font-bold leading-relaxed whitespace-pre-wrap">{selectedCandidate.allTrainings || 'Veri girilmemiş.'}</p>
                           </div>
                        </div>
                      </div>
                    )}
                    {detailTab === 'notes' && (
                      <div className="space-y-8 animate-fade-in">
                        <textarea className="w-full h-80 p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none focus:border-orange-500 font-semibold text-slate-700 leading-relaxed shadow-xl" placeholder="Aday hakkındaki mülakat notlarınızı buraya kaydedin..." value={localNote} onChange={(e) => setLocalNote(e.target.value)} />
                        <div className="flex justify-end"><button onClick={handleSaveNote} disabled={isSavingNote} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all">{isSavingNote ? 'Kaydediliyor...' : 'Notu Mühürle'}</button></div>
                      </div>
                    )}
                    {detailTab === 'answers' && (
                      <div className="space-y-8 animate-fade-in">
                        {Object.entries(selectedCandidate.answers).map(([qid, val]) => (
                          <div key={qid} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Soru Kodu: {qid}</p>
                             <p className="font-bold text-slate-900">{Array.isArray(val) ? val.join(', ') : val}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-200 uppercase font-black tracking-widest text-2xl border-4 border-dashed border-slate-100 rounded-[4rem]">Aday Seçilmedi</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
               <div className="flex justify-between items-end mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Haftalık Mülakat Matrisi</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-wider">Mülakat planlamak için bir aday seçin ve takvimde bir slota tıklayın.</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <select 
                       className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:border-orange-500"
                       value={schedulingCandidateId || ''}
                       onChange={(e) => setSchedulingCandidateId(e.target.value)}
                     >
                       <option value="">Aday Seçin...</option>
                       {candidates.filter(c => c.status === 'pending').map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-7 gap-4">
                  {calendarDays.map(day => (
                    <div key={day} className="space-y-4">
                       <div className="text-center p-4 bg-slate-900 text-white rounded-2xl">
                          <p className="text-[10px] font-black uppercase opacity-50">{new Date(day).toLocaleDateString('tr-TR', { weekday: 'short' })}</p>
                          <p className="text-lg font-black">{new Date(day).getDate()}</p>
                       </div>
                       <div className="space-y-3">
                          {timeSlots.map(time => {
                            const isBooked = candidates.some(c => c.interviewSchedule?.date === day && c.interviewSchedule?.time === time);
                            const bookedCandidate = candidates.find(c => c.interviewSchedule?.date === day && c.interviewSchedule?.time === time);
                            
                            return (
                              <button
                                key={`${day}-${time}`}
                                onClick={() => !isBooked && schedulingCandidateId && handleScheduleInterview(day, time)}
                                disabled={isBooked || !schedulingCandidateId}
                                className={`w-full p-4 rounded-2xl border-2 transition-all group relative overflow-hidden flex flex-col items-center justify-center ${
                                  isBooked 
                                  ? 'bg-orange-50 border-orange-200 cursor-not-allowed' 
                                  : schedulingCandidateId 
                                    ? 'bg-white border-slate-100 hover:border-orange-500 hover:shadow-lg cursor-pointer' 
                                    : 'bg-slate-50 border-slate-100 opacity-50 cursor-default'
                                }`}
                              >
                                <span className={`text-[11px] font-black ${isBooked ? 'text-orange-600' : 'text-slate-900'}`}>{time}</span>
                                {isBooked && (
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1 truncate w-full text-center">
                                    {bookedCandidate?.name.split(' ')[0]}
                                  </span>
                                )}
                                {!isBooked && schedulingCandidateId && (
                                  <div className="absolute inset-0 bg-orange-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Planla</span>
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

      {/* Notification Dispatcher Animation */}
      {isSendingNotification && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[300] flex items-center justify-center">
           <div className="bg-white p-20 rounded-[4rem] text-center max-w-xl animate-scale-in relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full blur-[80px]"></div>
              
              <div className="relative mb-12">
                 <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] mx-auto flex items-center justify-center text-emerald-600 animate-bounce">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                 </div>
                 <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-4">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg">AI</div>
                 </div>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Onay Bildirimleri Gönderiliyor</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Adaya mülakat detayları e-posta ile iletiliyor ve akademi takvimi güncelleniyor...
              </p>
              
              <div className="mt-12 flex justify-center gap-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
