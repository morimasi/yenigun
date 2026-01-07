
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, Branch, GlobalConfig } from '../types';
import CandidateReport from './CandidateReport';
import { generateCandidateAnalysis } from '../geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';

// AIStudio bridge types
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Add readonly modifier to match the environment's global declaration
    readonly aistudio: AIStudio;
  }
}

interface DashboardProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, config, onUpdateCandidate, onUpdateConfig, onDeleteCandidate }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'calendar' | 'analytics' | 'settings'>('pipeline');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [filter, setFilter] = useState({ search: '', branch: 'All', status: 'All' });
  const [showApiKeyError, setShowApiKeyError] = useState(false);

  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedId), [candidates, selectedId]);

  // Robust Key Selector Bridge
  const handleOpenKeySelector = async () => {
    try {
      // Check if bridge exists
      if (typeof window.aistudio !== 'undefined' && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        setShowApiKeyError(false);
        // If selection triggered, we proceed assuming success (as per guidelines race condition rule)
        if (selectedCandidate) handleManualAnalysis();
      } else {
        console.error("AI Studio Key Bridge not found in this environment.");
        alert("API Anahtarı seçiciye şu an ulaşılamıyor. Lütfen platform servislerini kontrol edin.");
      }
    } catch (e) {
      console.error("Key selection failed:", e);
      setShowApiKeyError(true);
    }
  };

  const handleManualAnalysis = async () => {
    if (!selectedCandidate) return;
    setIsAnalysing(true);
    setShowApiKeyError(false);
    try {
      const report = await generateCandidateAnalysis(selectedCandidate);
      onUpdateCandidate({ ...selectedCandidate, report });
    } catch (e: any) {
      if (e.message === "MISSING_API_KEY" || e.message === "INVALID_API_KEY") {
        setShowApiKeyError(true);
      } else {
        alert("Analiz Motoru Hatası: " + e.message);
      }
    } finally {
      setIsAnalysing(false);
    }
  };

  const filteredList = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(filter.search.toLowerCase());
      const matchesBranch = filter.branch === 'All' || c.branch === filter.branch;
      const matchesStatus = filter.status === 'All' || c.status === filter.status;
      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [candidates, filter]);

  const statsData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      const count = candidates.filter(c => new Date(c.timestamp).toDateString() === d.toDateString()).length;
      return { name: dateStr, count };
    });
  }, [candidates]);

  return (
    <div className="flex flex-col xl:flex-row gap-10 animate-fade-in pb-20 max-w-[1600px] mx-auto">
      {/* Avant-Garde Navigation Sidebar */}
      <aside className="xl:w-80 space-y-6">
        <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-3 opacity-80">Akademi İşletim Sistemi</h2>
            <p className="text-3xl font-black tracking-tighter leading-none">{config.institutionName}</p>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Canlı Veri Senkronu</span>
            </div>
          </div>
        </div>

        <nav className="p-3 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-sm space-y-2">
          {[
            { id: 'pipeline', label: 'Aday Havuzu', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { id: 'calendar', label: 'Planlama Merkezi', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'analytics', label: 'Stratejik Analiz', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'settings', label: 'Kurumsal Ayarlar', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[2.2rem] transition-all duration-500 font-black text-[11px] uppercase tracking-widest group ${
                activeTab === tab.id ? 'bg-orange-600 text-white shadow-2xl translate-x-3 scale-[1.02]' : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Intelligent Workspace */}
      <main className="flex-1 min-w-0">
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Intelligent Filtering & List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col gap-6">
                <div className="relative group">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                   </div>
                   <input 
                    type="text" 
                    placeholder="İsim veya Branş Ara..." 
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] pl-16 pr-8 py-5 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-orange-600/10 transition-all"
                    value={filter.search}
                    onChange={e => setFilter({...filter, search: e.target.value})}
                  />
                </div>
                <div className="flex gap-3">
                   <select 
                    className="flex-1 bg-slate-50 border-none rounded-[1.2rem] px-5 py-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-orange-50 transition-colors"
                    value={filter.branch}
                    onChange={e => setFilter({...filter, branch: e.target.value})}
                  >
                    <option value="All">TÜM BRANŞLAR</option>
                    {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select 
                    className="flex-1 bg-slate-50 border-none rounded-[1.2rem] px-5 py-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-orange-50 transition-colors"
                    value={filter.status}
                    onChange={e => setFilter({...filter, status: e.target.value})}
                  >
                    <option value="All">TÜM DURUMLAR</option>
                    <option value="pending">BEKLEYENLER</option>
                    <option value="interview_scheduled">MÜLAKAT</option>
                    <option value="hired">İŞE ALIM</option>
                    <option value="rejected">ELENENLER</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-3 custom-scrollbar">
                {filteredList.map(c => (
                  <div 
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-8 rounded-[3.5rem] border-2 transition-all cursor-pointer relative group overflow-hidden ${
                      selectedId === c.id ? 'bg-white border-orange-600 shadow-2xl scale-[1.03] z-10' : 'bg-white border-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-orange-600 transition-colors">{c.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.branch}</span>
                           <span className="text-slate-200">•</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.experienceYears} Yıl Deneyim</span>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
                        c.status === 'hired' ? 'bg-emerald-50 text-emerald-600' :
                        c.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 
                        c.status === 'interview_scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </div>
                    </div>
                    {c.report && (
                      <div className="mt-6 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-600 transition-all duration-1000" style={{ width: `${c.report.score}%` }}></div>
                        </div>
                        <span className="text-[12px] font-black text-orange-600 tracking-tighter">%{c.report.score}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Candidate Detail Panel */}
            <div className="lg:col-span-7 sticky top-32">
              {selectedCandidate ? (
                <div className="bg-white rounded-[4.5rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[75vh] flex flex-col animate-scale-in">
                   {/* Actions Header */}
                   <div className="p-10 border-b border-slate-50 flex flex-wrap justify-between items-center gap-6 bg-slate-50/30">
                      <div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h3>
                        <p className="text-slate-400 font-bold mt-1 text-lg">{selectedCandidate.email}</p>
                      </div>
                      <div className="flex gap-4">
                         <button 
                           onClick={() => onUpdateCandidate({...selectedCandidate, status: 'rejected'})}
                           className="px-8 py-4 bg-white text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white border border-rose-100 shadow-sm transition-all"
                         >
                           Reddet
                         </button>
                         <button 
                           onClick={() => onUpdateCandidate({...selectedCandidate, status: 'hired'})}
                           className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-xl transition-all"
                         >
                           İşe Al
                         </button>
                      </div>
                   </div>

                   <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                      {selectedCandidate.report ? (
                        <CandidateReport report={selectedCandidate.report} name={selectedCandidate.name} />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-10">
                           {showApiKeyError ? (
                             <div className="max-w-md animate-bounce-in bg-rose-50/50 p-12 rounded-[4rem] border-2 border-dashed border-rose-200">
                               <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-rose-600 mx-auto mb-8 shadow-2xl shadow-rose-100/50">
                                 <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                               </div>
                               <h3 className="text-2xl font-black text-rose-900 uppercase tracking-tighter mb-4 leading-none">Bağlantı Sorunu</h3>
                               <p className="text-rose-700/70 font-bold mb-8 text-sm leading-relaxed italic">Yapay zeka motorunu çalıştırmak için Gemini API anahtarınızın seçilmesi gerekiyor.</p>
                               <button 
                                 onClick={handleOpenKeySelector}
                                 className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-rose-700 shadow-2xl transition-all hover:scale-[1.02]"
                               >
                                 Anahtarı Şimdi Bağla
                               </button>
                             </div>
                           ) : (
                             <div className="max-w-md">
                               <div className="w-28 h-28 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-orange-600 mx-auto mb-10 animate-pulse relative">
                                  <div className="absolute inset-0 rounded-[2.5rem] border-4 border-orange-200 animate-ping opacity-20"></div>
                                  <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                               </div>
                               <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Profil Analiz Bekliyor</h3>
                               <p className="text-slate-400 font-bold mb-10 text-base leading-relaxed">Bu adayın profesyonel yetkinlik ve karakter analizi henüz oluşturulmadı.</p>
                               <button 
                                 onClick={handleManualAnalysis}
                                 disabled={isAnalysing}
                                 className="w-full py-7 bg-orange-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] hover:bg-orange-700 shadow-2xl transition-all disabled:opacity-50"
                               >
                                 {isAnalysing ? 'AI İşlemci Çalışıyor...' : 'Analizi Tetikle'}
                               </button>
                             </div>
                           )}
                        </div>
                      )}
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[4.5rem] bg-slate-50/20 group transition-all hover:bg-white hover:border-orange-100">
                   <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-200 mb-8 transition-colors group-hover:bg-orange-50 group-hover:text-orange-200">
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   </div>
                   <p className="text-slate-200 text-3xl font-black uppercase tracking-[0.3em] text-center max-w-xs group-hover:text-orange-200 transition-colors">Bir Aday Dosyası Açın</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-[4.5rem] shadow-2xl p-16 animate-fade-in border border-slate-100 min-h-[70vh]">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Planlama Merkezi</h3>
                <p className="text-slate-400 font-bold text-lg italic">Yüz yüze ve online mülakat trafiğini buradan yönetin.</p>
              </div>
              <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                 <div className="px-6 py-3 bg-white rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-900">Günlük Görünüm</div>
                 <div className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Haftalık</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
               {/* Unscheduled Queue */}
               <div className="xl:col-span-4 space-y-6">
                  <h4 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] ml-2">İşlem Bekleyenler ({candidates.filter(c => c.status === 'pending' && c.report).length})</h4>
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {candidates.filter(c => c.status === 'pending' && c.report).map(c => (
                      <div key={c.id} className="p-8 bg-slate-50 rounded-[3rem] border border-transparent hover:border-orange-200 hover:bg-white transition-all group shadow-sm hover:shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                           <p className="font-black text-slate-900 text-lg tracking-tight">{c.name}</p>
                           <span className="text-[11px] font-black text-orange-600 tracking-tighter">%{c.report?.score}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedId(c.id)}
                          className="w-full py-4 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all"
                        >
                          Mülakat Tanımla
                        </button>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Visual Schedule Timeline */}
               <div className="xl:col-span-8">
                  <div className="p-10 bg-slate-900 rounded-[4rem] text-white h-full relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-10"></div>
                     <h4 className="text-xl font-black mb-10 tracking-tighter relative z-10 flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                        Aktif Randevu Akışı
                     </h4>
                     <div className="space-y-8 relative z-10">
                        {candidates.filter(c => c.status === 'interview_scheduled').length > 0 ? (
                          candidates.filter(c => c.status === 'interview_scheduled').map(c => (
                            <div key={c.id} className="flex gap-8 group">
                               <div className="flex flex-col items-center">
                                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    {c.interviewSchedule?.time}
                                  </div>
                                  <div className="w-px h-full bg-white/10 my-4 group-last:hidden"></div>
                               </div>
                               <div className="flex-1 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all hover:bg-white/10">
                                  <div className="flex justify-between items-start mb-2">
                                     <h5 className="text-2xl font-black tracking-tight">{c.name}</h5>
                                     <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg">{c.interviewSchedule?.method}</span>
                                  </div>
                                  <p className="text-slate-400 font-bold text-sm">{c.interviewSchedule?.date} • {c.interviewSchedule?.location}</p>
                                  <div className="mt-6 flex gap-3">
                                     <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Düzenle</button>
                                     <button className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors">İptal</button>
                                  </div>
                               </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-20 text-center opacity-30">
                             <p className="text-2xl font-black uppercase tracking-[0.3em]">Henüz Kayıt Yok</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Aday Havuzu', value: candidates.length, color: 'slate', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0' },
                { label: 'Başarı Oranı', value: `%${Math.round((candidates.filter(c => (c.report?.score || 0) > 70).length / (candidates.length || 1)) * 100)}`, color: 'orange', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { label: 'Hiring Hızı', value: '4.2 Gün', color: 'emerald', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Toplam Red', value: candidates.filter(c => c.status === 'rejected').length, color: 'rose', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' }
              ].map(stat => (
                <div key={stat.label} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 group hover:border-orange-100 transition-all">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                     stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 
                     stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                     stat.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                   }`}>
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} /></svg>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                   <p className={`text-4xl font-black tracking-tighter ${stat.color === 'orange' ? 'text-orange-600' : stat.color === 'emerald' ? 'text-emerald-600' : stat.color === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="bg-white p-12 rounded-[4.5rem] shadow-xl border border-slate-100">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Başvuru Trend Analizi</h4>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={statsData}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                        <YAxis hide />
                        <RechartsTooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800 }} />
                        <Area type="monotone" dataKey="count" stroke="#ea580c" strokeWidth={5} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-slate-900 p-12 rounded-[4.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600 rounded-full blur-[80px] opacity-10"></div>
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12 relative z-10">Branş Bazlı Yoğunluk</h4>
                  <div className="h-80 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.values(Branch).map(b => ({ name: b.split(' ')[0], val: candidates.filter(c => c.branch === b).length }))}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 9, fontWeight: 900}} />
                        <YAxis hide />
                        <Bar dataKey="val" radius={[10, 10, 2, 2]} barSize={40}>
                           {candidates.map((_, index) => (
                             <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ea580c' : '#1e293b'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-[4.5rem] shadow-2xl p-20 animate-fade-in border border-slate-100 max-w-4xl">
            <div className="flex items-center gap-6 mb-16">
               <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-orange-200">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
               </div>
               <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Kurumsal Parametreler</h3>
                  <p className="text-slate-400 font-bold mt-2">Sistemin kurumsal kimliğine ve AI davranışına yön verin.</p>
               </div>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.3em] ml-2">Kurum Marka Adı</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 rounded-[2rem] px-8 py-6 text-xl font-black outline-none border-2 border-transparent focus:border-orange-600/20 focus:bg-white transition-all shadow-inner"
                      value={config.institutionName}
                      onChange={e => onUpdateConfig({...config, institutionName: e.target.value})}
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.3em] ml-2">Analiz Algoritma Tonu</label>
                    <select 
                      className="w-full bg-slate-50 rounded-[2rem] px-8 py-6 font-bold cursor-pointer border-2 border-transparent focus:bg-white transition-all shadow-inner appearance-none"
                      value={config.aiTone}
                      onChange={e => onUpdateConfig({...config, aiTone: e.target.value as any})}
                    >
                      <option value="strict">🔍 STRİKT (Hata Kabul Etmez)</option>
                      <option value="balanced">⚖️ DENGELİ (Kurumsal Standart)</option>
                      <option value="empathetic">🌱 EMPATİK (Gelişim Odaklı)</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.3em] ml-2">Bildirim Alıcısı (E-Posta)</label>
                 <input 
                    type="email" 
                    className="w-full bg-slate-50 rounded-[2rem] px-8 py-6 text-lg font-bold outline-none border-2 border-transparent focus:bg-white transition-all shadow-inner"
                    value={config.notificationEmail}
                    onChange={e => onUpdateConfig({...config, notificationEmail: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-400 font-bold uppercase ml-4">Yeni başvurular ve mülakat onayları bu adrese iletilir.</p>
              </div>

              <div className="pt-10 flex gap-6">
                <button 
                  onClick={() => alert("Ayarlar senkronize edildi.")}
                  className="flex-1 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-600 shadow-2xl transition-all hover:-translate-y-1"
                >
                  Konfigürasyonu Kaydet
                </button>
                <button 
                  onClick={() => { if(confirm('Tüm yerel veriler sıfırlanacak. Emin misiniz?')) localStorage.clear(); window.location.reload(); }}
                  className="px-10 py-7 bg-rose-50 text-rose-600 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
