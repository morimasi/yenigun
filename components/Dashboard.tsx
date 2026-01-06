
import React, { useState, useMemo } from 'react';
import { Candidate, Branch, UserRole, AdminUser } from '../types';
import CandidateReport from './CandidateReport';
import { FORM_STEPS, MOCK_QUESTIONS } from '../constants';

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedCandidateId), [candidates, selectedCandidateId]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  const handleSyncSimulation = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsSyncing(false), 800);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in min-h-[85vh]">
      {/* Sidebar */}
      <aside className="lg:w-72 space-y-3">
        <div className="p-8 mb-6 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Yönetici Paneli</h2>
          <p className="text-2xl font-black mt-1 tracking-tighter">Dr. Ahmet Gün</p>
          
          <button 
            onClick={handleSyncSimulation}
            disabled={isSyncing}
            className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95"
          >
            {isSyncing ? (
              <span className="animate-pulse">Eşitleniyor %{syncProgress}</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Bulut Senkronize Et
              </>
            )}
          </button>
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
              activeTab === item.id ? 'bg-orange-600 text-white shadow-2xl shadow-orange-200 translate-x-2' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
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
      <main className="flex-1 space-y-8">
        {isSyncing && (
          <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl shadow-orange-100 animate-fade-in">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
               <div>
                 <h4 className="text-xl font-black tracking-tight">Bulut Senkronizasyonu</h4>
                 <p className="text-orange-100 text-sm font-bold">Yerel veriler güvenli sunucuya aktarılıyor...</p>
               </div>
            </div>
            <div className="text-5xl font-black">%{syncProgress}</div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-56 transition-all hover:shadow-xl group">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Toplam Aday</span>
               <div className="text-6xl font-black text-slate-900 tracking-tighter group-hover:text-orange-600 transition-colors">{candidates.length}</div>
               <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                 Sürekli Artış
               </div>
            </div>
            
            <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl flex flex-col justify-between h-56 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-orange-600 blur-[80px] opacity-20"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Veri Durumu</span>
               <div className="space-y-2 relative z-10">
                 <div className="text-2xl font-black tracking-tight leading-none">LOCAL SYNC</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase">Fiziksel Veritabanı Bekleniyor</div>
               </div>
               <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl text-[9px] font-black text-orange-500 uppercase self-start">Kısıtlı Mod</div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-56">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Verimliliği</span>
               <div className="text-6xl font-black text-slate-900 tracking-tighter">%{candidates.filter(c => c.report).length > 0 ? 100 : 0}</div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-orange-600" style={{ width: candidates.filter(c => c.report).length > 0 ? '100%' : '0%' }}></div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
              <div className="sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md z-10 pb-6 pt-2">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Aday Ara..."
                    className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-sm font-bold focus:ring-8 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all shadow-xl shadow-slate-200/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
              </div>
              {filteredCandidates.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCandidateId(c.id); setDetailTab('report'); }}
                  className={`w-full text-left p-8 rounded-[3rem] transition-all border-2 relative group overflow-hidden ${
                    selectedCandidateId === c.id ? 'bg-white border-orange-500 shadow-2xl scale-[1.02] z-10' : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors text-lg tracking-tight">{c.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{c.branch}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase ${c.status === 'scheduled' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                      {c.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="xl:col-span-8">
              {selectedCandidate ? (
                <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[70vh] flex flex-col animate-scale-in">
                  <div className="flex bg-slate-50/50 p-3 gap-3 border-b border-slate-100">
                    {[
                      { id: 'report', label: 'Stratejik Analiz' },
                      { id: 'answers', label: 'Veri Kayıtları' },
                      { id: 'scheduling', label: 'Operasyon' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setDetailTab(tab.id as any)}
                        className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.8rem] transition-all ${
                          detailTab === tab.id ? 'bg-white text-orange-600 shadow-xl scale-[1.02]' : 'text-slate-400 hover:bg-white/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                    {detailTab === 'report' && selectedCandidate.report && <CandidateReport report={selectedCandidate.report} name={selectedCandidate.name} />}
                    {detailTab === 'report' && !selectedCandidate.report && (
                      <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-10 h-10 text-slate-200 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <p className="text-slate-400 font-bold italic text-lg uppercase tracking-tight">AI Raporu Bekleniyor...</p>
                      </div>
                    )}
                    
                    {detailTab === 'answers' && (
                      <div className="space-y-12 animate-fade-in">
                        {FORM_STEPS.filter(s => s.id !== 'personal').map(step => (
                          <div key={step.id} className="space-y-6">
                            <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.3em] flex items-center gap-4">
                              <span className="w-12 h-0.5 bg-orange-100"></span>
                              {step.title}
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                              {(MOCK_QUESTIONS[step.id as keyof typeof MOCK_QUESTIONS] || []).map((q: any) => (
                                <div key={q.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-orange-100 transition-all group">
                                  <p className="text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest">{q.text}</p>
                                  <div className="text-base font-black text-slate-900 flex items-start gap-3">
                                    <div className="mt-1 shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    {Array.isArray(selectedCandidate.answers[q.id]) 
                                      ? (selectedCandidate.answers[q.id] as string[]).join(", ") 
                                      : (selectedCandidate.answers[q.id] || "Veri Girişi Yok")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {detailTab === 'scheduling' && (
                      <div className="py-20 text-center space-y-10 animate-scale-in">
                        <div className="w-32 h-32 bg-orange-50 rounded-[3rem] flex items-center justify-center mx-auto text-orange-600 shadow-2xl shadow-orange-100">
                          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Hiyerarşik Planlama</h4>
                        <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto">Mülakat takvimine erişmek ve slot ayırmak için aşağıdaki butonu kullanın.</p>
                        <button onClick={() => setActiveTab('calendar')} className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95">Takvim Katmanını Aç</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center p-20 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                     <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.2em]">Aday Seçilmedi</h3>
                  <p className="text-slate-400 text-sm font-bold mt-3">Detaylı analiz için sol panelden bir profesyonel seçiniz.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ... Calendar and Settings remains same but with simulated cloud logic ... */}
      </main>
    </div>
  );
};

export default Dashboard;
