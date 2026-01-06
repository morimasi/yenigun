
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, Branch, UserRole, AdminUser } from '../types';
import CandidateReport from './CandidateReport';
import { FORM_STEPS, MOCK_QUESTIONS } from '../constants';
import { generateCandidateAnalysis } from '../geminiService';

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
  const [isAnalysing, setIsAnalysing] = useState(false);
  
  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedCandidateId), [candidates, selectedCandidateId]);

  const flatQuestions = useMemo(() => Object.values(MOCK_QUESTIONS).flat(), []);

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

  const handleManualAnalysis = async () => {
    if (!selectedCandidate || !onUpdate) return;
    setIsAnalysing(true);
    try {
      const report = await generateCandidateAnalysis(selectedCandidate);
      if (report) {
        const updated = { ...selectedCandidate, report };
        await onUpdate(updated);
        alert("Yapay zeka analizi başarıyla tamamlandı.");
      }
    } catch (e: any) {
      if (e.message === "API_KEY_MISSING") {
        alert("Lütfen önce API anahtarınızı bağlayın.");
      } else {
        alert("Analiz sırasında bir hata oluştu: " + e.message);
      }
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedCandidate || !onUpdate) return;
    const updatedCandidate = { ...selectedCandidate, adminNotes: localNote };
    await onUpdate(updatedCandidate);
    alert("Notlar kaydedildi.");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in min-h-[85vh]">
      <aside className="lg:w-72 space-y-3">
        <div className="p-8 mb-6 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Panel</h2>
          <p className="text-2xl font-black mt-1 tracking-tighter">Yeni Gün Akademi</p>
        </div>

        {[
          { id: 'overview', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'Özet' },
          { id: 'candidates', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0', label: 'Adaylar' },
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
        {activeTab === 'candidates' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
              <input 
                type="text" 
                placeholder="İsim veya Branş Ara..."
                className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-sm font-bold outline-none shadow-sm focus:border-orange-500 mb-4"
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
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors text-lg tracking-tight">{c.name}</h4>
                    <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${c.report ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                      {c.report ? 'Analizli' : 'Bekliyor'}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{c.branch}</p>
                </button>
              ))}
            </div>

            <div className="xl:col-span-8">
              {selectedCandidate ? (
                <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[70vh] flex flex-col animate-scale-in">
                  <div className="flex bg-slate-50/50 p-3 gap-3 border-b border-slate-100 overflow-x-auto">
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
                    {detailTab === 'report' && (
                      selectedCandidate.report ? (
                        <CandidateReport report={selectedCandidate.report} name={selectedCandidate.name} />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-20">
                           <div className="w-40 h-40 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 animate-pulse">
                              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                           </div>
                           <div className="max-w-md">
                              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Analiz Hazır Değil</h3>
                              <p className="text-slate-500 font-bold mb-10 leading-relaxed italic">Bu aday için henüz yapay zeka değerlendirmesi oluşturulmamış veya API anahtarı hatası nedeniyle atlanmış.</p>
                              <button 
                                onClick={handleManualAnalysis}
                                disabled={isAnalysing}
                                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-orange-600 shadow-2xl transition-all"
                              >
                                {isAnalysing ? 'Analiz Motoru Çalışıyor...' : 'Analizi Şimdi Başlat'}
                              </button>
                           </div>
                        </div>
                      )
                    )}
                    {detailTab === 'cv_details' && (
                      <div className="space-y-10 animate-fade-in">
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">İletişim</h4>
                            <p className="font-bold text-slate-900 text-sm">{selectedCandidate.email}</p>
                            <p className="font-bold text-slate-900 text-sm">{selectedCandidate.phone}</p>
                        </div>
                        <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem]">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Geçmiş Deneyimler</h4>
                            <p className="text-slate-800 font-bold whitespace-pre-wrap">{selectedCandidate.previousInstitutions || 'Kayıt yok.'}</p>
                        </div>
                      </div>
                    )}
                    {detailTab === 'notes' && (
                      <div className="space-y-8 animate-fade-in">
                        <textarea className="w-full h-80 p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none font-semibold text-slate-700 shadow-xl" placeholder="Notlarınızı buraya alın..." value={localNote} onChange={(e) => setLocalNote(e.target.value)} />
                        <button onClick={handleSaveNote} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">Kaydet</button>
                      </div>
                    )}
                    {detailTab === 'answers' && (
                      <div className="space-y-10 animate-fade-in">
                        {Object.entries(selectedCandidate.answers).map(([qid, val]) => (
                          <div key={qid} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Soru ID: {qid}</p>
                             <p className="text-lg font-black text-slate-900 italic">"{Array.isArray(val) ? val.join(', ') : val}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-200 uppercase font-black tracking-widest text-2xl border-4 border-dashed border-slate-100 rounded-[4rem]">Bir Aday Seçin</div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 group">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aday Havuzu</span>
               <div className="text-6xl font-black text-slate-900 tracking-tighter mt-4">{candidates.length}</div>
            </div>
            <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Analiz Bekleyen</span>
               <div className="text-6xl font-black text-orange-600 tracking-tighter mt-4">{candidates.filter(c => !c.report).length}</div>
            </div>
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analizli Aday</span>
               <div className="text-6xl font-black text-emerald-600 tracking-tighter mt-4">{candidates.filter(c => c.report).length}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
