
import React, { useState, useMemo, useRef } from 'react';
import { Candidate, Branch, UserRole, AdminUser } from '../types';
import CandidateReport from './CandidateReport';
import { FORM_STEPS, MOCK_QUESTIONS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  candidates: Candidate[];
  onDelete?: (id: string) => void;
  onUpdate?: (candidate: Candidate) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onDelete, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'calendar' | 'admin_settings'>('overview');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'report' | 'answers' | 'scheduling'>('report');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Takvim Seçim State'i
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [tempSchedule, setTempSchedule] = useState<{date: string, time: string, method: any}>({
    date: '', time: '10:00', method: 'Yüz Yüze'
  });

  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedCandidateId), [candidates, selectedCandidateId]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  // Takvim Günlerini Hesapla
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentDate]);

  const handleDayClick = (day: Date) => {
    if (!selectedCandidate) {
      alert("Lütfen önce mülakat planlamak istediğiniz adayı 'Aday Havuzu'ndan seçiniz.");
      setActiveTab('candidates');
      return;
    }
    setTempSchedule({ ...tempSchedule, date: day.toISOString().split('T')[0] });
    setIsSchedulingModalOpen(true);
  };

  const saveInterview = () => {
    if (selectedCandidate && onUpdate) {
      onUpdate({
        ...selectedCandidate,
        status: 'scheduled',
        interviewSchedule: {
          date: tempSchedule.date,
          time: tempSchedule.time,
          method: tempSchedule.method,
          location: tempSchedule.method === 'Yüz Yüze' ? 'Yeni Gün Ana Kampüs' : tempSchedule.method
        }
      });
      setIsSchedulingModalOpen(false);
      setActiveTab('calendar');
    }
  };

  const handleSync = () => {
    alert("Bulut bağlantısı algılanamadı. Çevrimiçi moda geçmek için projenizi Vercel üzerine deploy etmeli ve Postgres veritabanını bağlamalısınız.");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in min-h-[85vh]">
      {/* Sidebar */}
      <aside className="lg:w-72 space-y-2">
        <div className="p-6 mb-4 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-600 rounded-full blur-3xl opacity-50"></div>
          <h2 className="text-[10px] font-black uppercase tracking-widest opacity-60">Sistem Operatörü</h2>
          <p className="text-lg font-black mt-1">Dr. Admin</p>
          <button 
            onClick={handleSync}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Bulut ile Eşitle
          </button>
        </div>

        {[
          { id: 'overview', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'Dashboard' },
          { id: 'candidates', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0', label: 'Aday Havuzu' },
          { id: 'calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Mülakat Takvimi' },
          { id: 'admin_settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', label: 'Sistem Ayarları' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center space-x-4 px-6 py-5 rounded-[2rem] transition-all duration-500 font-bold text-sm group ${
              activeTab === item.id ? 'bg-orange-600 text-white shadow-2xl shadow-orange-200 translate-x-2' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
              </svg>
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
             <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aday Sinerjisi</span>
               <div className="text-5xl font-black text-slate-900 tracking-tighter">%{candidates.length > 0 ? Math.min(100, candidates.length * 5) : 0}</div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${candidates.length > 0 ? Math.min(100, candidates.length * 5) : 0}%` }}></div>
               </div>
             </div>
             
             <div className="bg-slate-900 p-8 rounded-[3rem] shadow-xl flex flex-col justify-between h-48 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-500 blur-3xl opacity-20"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bağlantı Türü</span>
               <div className="text-2xl font-black tracking-tight">LOCAL STORAGE</div>
               <div className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full self-start">Veriler Diske Mühürlendi</div>
             </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* List */}
            <div className="xl:col-span-4 space-y-4 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
              <div className="sticky top-0 bg-[#f8fafc] z-10 pb-4">
                <input 
                  type="text" 
                  placeholder="İsim veya branş ara..."
                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {filteredCandidates.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCandidateId(c.id); setDetailTab('report'); }}
                  className={`w-full text-left p-6 rounded-[2.5rem] transition-all border-2 relative group overflow-hidden ${
                    selectedCandidateId === c.id ? 'bg-white border-orange-500 shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors">{c.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{c.branch}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${c.status === 'scheduled' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                      {c.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="xl:col-span-8">
              {selectedCandidate ? (
                <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden min-h-[70vh] flex flex-col">
                  <div className="flex bg-slate-50 p-2 gap-2 border-b border-slate-100">
                    {[
                      { id: 'report', label: 'Analiz' },
                      { id: 'answers', label: 'Ham Cevaplar' },
                      { id: 'scheduling', label: 'Mülakat Ayarı' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setDetailTab(tab.id as any)}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${
                          detailTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                    {detailTab === 'report' && selectedCandidate.report && <CandidateReport report={selectedCandidate.report} name={selectedCandidate.name} />}
                    {detailTab === 'report' && !selectedCandidate.report && (
                      <div className="p-12 text-center">
                        <p className="text-slate-400 font-bold italic">Bu aday için henüz bir AI analizi oluşturulmamış.</p>
                      </div>
                    )}
                    
                    {detailTab === 'answers' && (
                      <div className="space-y-10 animate-fade-in">
                        {FORM_STEPS.filter(s => s.id !== 'personal').map(step => (
                          <div key={step.id} className="space-y-4">
                            <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-3">
                              <span className="w-8 h-px bg-orange-200"></span>
                              {step.title}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {(MOCK_QUESTIONS[step.id as keyof typeof MOCK_QUESTIONS] || []).map((q: any) => (
                                <div key={q.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                                  <p className="text-xs font-bold text-slate-400 mb-2">{q.text}</p>
                                  <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    {Array.isArray(selectedCandidate.answers[q.id]) 
                                      ? (selectedCandidate.answers[q.id] as string[]).join(", ") 
                                      : (selectedCandidate.answers[q.id] || "Yanıt Yok")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {detailTab === 'scheduling' && (
                      <div className="max-w-md mx-auto py-10 text-center space-y-8 animate-scale-in">
                        <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-orange-600">
                          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900">Hızlı Planlama</h4>
                          <p className="text-slate-500 font-medium mt-2">Takvim üzerinden bir güne tıklayarak {selectedCandidate.name} için randevu oluşturabilirsiniz.</p>
                        </div>
                        <button onClick={() => setActiveTab('calendar')} className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-colors">Takvimi Aç</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center p-20 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                  <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Aday Seçilmedi</h3>
                  <p className="text-slate-400 text-sm font-bold mt-2">Detayları görmek için sol listeden bir profesyonel seçiniz.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 animate-fade-in relative">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                {currentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-4">
                 <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
                 <button onClick={() => setCurrentDate(new Date())} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Bugün</button>
                 <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">{d}</div>
              ))}
              {calendarDays.map((day, idx) => {
                const dayStr = day ? day.toISOString().split('T')[0] : '';
                const dayInterviews = day ? candidates.filter(c => c.interviewSchedule?.date === dayStr) : [];
                return (
                  <div 
                    key={idx} 
                    onClick={() => day && handleDayClick(day)}
                    className={`min-h-[160px] p-4 rounded-[2rem] border-2 transition-all relative cursor-pointer ${
                      day ? 'bg-white border-slate-100 hover:border-orange-500' : 'bg-slate-50/50 border-transparent pointer-events-none'
                    }`}
                  >
                    {day && (
                      <>
                        <span className={`text-lg font-black ${day.toDateString() === new Date().toDateString() ? 'text-orange-600' : 'text-slate-900'}`}>{day.getDate()}</span>
                        <div className="mt-4 space-y-2">
                          {dayInterviews.map(inv => (
                            <div key={inv.id} className="p-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-tighter truncate border-l-4 border-orange-500">
                              {inv.interviewSchedule?.time} - {inv.name.split(' ')[0]}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isSchedulingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl p-10 space-y-8 animate-scale-in">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Mülakat Rezervasyonu</h3>
                <button onClick={() => setIsSchedulingModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Seçili Aday</p>
                <p className="text-xl font-black text-slate-900 mt-1">{selectedCandidate?.name}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tarih</label>
                    <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={tempSchedule.date} readOnly />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saat</label>
                    <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={tempSchedule.time} onChange={e => setTempSchedule({...tempSchedule, time: e.target.value})} />
                  </div>
                </div>
              </div>

              <button onClick={saveInterview} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-700 transition-colors">Randevuyu Onayla</button>
            </div>
          </div>
        )}

        {activeTab === 'admin_settings' && (
          <div className="p-12 bg-white rounded-[4rem] border border-slate-100 text-center space-y-6">
             <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-white">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             </div>
             <h3 className="text-2xl font-black">Admin Güvenlik Katmanı</h3>
             <p className="text-slate-500 max-w-md mx-auto">Sistem ayarları ve yetki matrisi şu an kilitli. Çok kullanıcılı yönetici desteği için bulut bağlantısı gereklidir.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
