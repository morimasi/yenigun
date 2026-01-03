
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Candidate, Branch } from '../types';
import CandidateReport from './CandidateReport';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { generatePersonalizedInvite } from '../geminiService';

interface DashboardProps {
  candidates: Candidate[];
  onDelete?: (id: string) => void;
  onUpdate?: (candidate: Candidate) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onDelete, onUpdate }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [aiDraft, setAiDraft] = useState('');
  
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    location: 'Yeni Gün Merkez Kampüs',
    method: 'Yüz Yüze' as any
  });

  const reportRef = useRef<HTMLDivElement>(null);

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = filterBranch === 'all' || c.branch === filterBranch;
        const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
        return matchesSearch && matchesBranch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return (b.report?.score || 0) - (a.report?.score || 0);
        return b.timestamp - a.timestamp;
      });
  }, [candidates, searchTerm, filterBranch, filterStatus, sortBy]);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  // AI Draft generator
  const handleAiDraftRequest = async () => {
    if (!selectedCandidate) return;
    setIsAiDrafting(true);
    try {
      const draft = await generatePersonalizedInvite(selectedCandidate);
      setAiDraft(draft);
    } catch (e) {
      alert("AI taslak oluştururken bir hata oluştu.");
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!selectedCandidate) return;
    setIsSendingNotification(true);

    // Simulate multi-channel notification
    await new Promise(r => setTimeout(r, 2000));

    const updatedCandidate: Candidate = {
      ...selectedCandidate,
      status: 'scheduled',
      interviewSchedule: { ...interviewData }
    };

    onUpdate?.(updatedCandidate);
    setIsSendingNotification(false);
    setIsScheduling(false);
    setAiDraft('');
    alert(`${selectedCandidate.name} için randevu onaylandı. E-posta ve SMS kanalları üzerinden kurumsal davet iletildi.`);
  };

  const exportToCSV = () => {
    const headers = ['İsim', 'E-posta', 'Branş', 'Deneyim', 'Skor', 'Durum', 'Başvuru Tarihi'];
    const rows = candidates.map(c => [
      c.name,
      c.email,
      c.branch,
      c.experienceYears,
      c.report?.score || 0,
      c.status,
      new Date(c.timestamp).toLocaleDateString('tr-TR')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "yeni_gun_aday_havuzu.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !selectedCandidate) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#FDFDFD' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Analiz_${selectedCandidate.name.replace(/\s+/g, '_')}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Control Center & Global Actions */}
      <div className="flex flex-col xl:flex-row gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 sticky top-24 z-50">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Aday ara (isim, email)..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekleyenler</option>
            <option value="scheduled">Planlananlar</option>
            <option value="rejected">Reddedilenler</option>
          </select>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            CSV Export
          </button>
          <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {['date', 'score'].map(s => (
              <button 
                key={s}
                onClick={() => setSortBy(s as any)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${sortBy === s ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
              >
                {s === 'date' ? 'En Yeni' : 'En Başarılı'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Advanced Candidate Sidebar */}
        <div className="xl:col-span-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold">Arama kriterlerine uygun aday bulunamadı.</p>
            </div>
          ) : (
            filteredCandidates.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCandidateId(c.id)}
                className={`w-full text-left p-6 rounded-[2.5rem] transition-all-custom border relative overflow-hidden group ${
                  selectedCandidateId === c.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                {c.status === 'scheduled' && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-5 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em]">PLANLANDI</div>
                )}
                {c.status === 'rejected' && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-5 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em]">ELENDİ</div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${selectedCandidateId === c.id ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-600'}`}>
                    {c.branch}
                  </span>
                  {c.report && <div className="text-right"><span className="text-xl font-black text-orange-500">%{c.report.score}</span></div>}
                </div>
                <h4 className="font-bold text-lg truncate pr-10">{c.name}</h4>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-bold opacity-60 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {new Date(c.timestamp).toLocaleDateString('tr-TR')}
                  </span>
                  <span className="text-[10px] font-bold opacity-60">• {c.experienceYears} Yıl Deneyim</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detailed Decision Panel */}
        <div className="xl:col-span-8">
          {selectedCandidate ? (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black">
                    {selectedCandidate.name[0]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-none">{selectedCandidate.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-sm font-bold text-slate-400">{selectedCandidate.email}</p>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <p className="text-sm font-bold text-slate-400">{selectedCandidate.phone || 'Telefon Yok'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsScheduling(true)}
                    className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all"
                  >
                    Mülakat İşlemleri
                  </button>
                  <button onClick={handleDownloadPDF} disabled={isExporting} className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all" title="PDF Rapor İndir">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </button>
                  <button 
                    onClick={() => {
                       const updated = {...selectedCandidate, status: 'rejected' as any};
                       onUpdate?.(updated);
                    }}
                    className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all"
                    title="Adayı Ele"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <button 
                    onClick={() => onDelete?.(selectedCandidate.id)}
                    className="p-4 bg-slate-100 text-slate-400 hover:bg-rose-600 hover:text-white transition-all rounded-2xl"
                    title="Adayı Kalıcı Olarak Sil"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              <div ref={reportRef}>
                <CandidateReport report={selectedCandidate.report!} name={selectedCandidate.name} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col items-center">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Branş Dağılımı</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie 
                          data={Object.values(Branch).map(b => ({name: b, value: candidates.filter(c => c.branch === b).length}))} 
                          innerRadius={70} 
                          outerRadius={100} 
                          paddingAngle={8} 
                          dataKey="value"
                        >
                          {Object.values(Branch).map((_, i) => <Cell key={i} fill={['#ea580c', '#334155', '#0f172a', '#64748b', '#94a3b8'][i % 5]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
                  <h3 className="text-3xl font-black mb-6">Yönetici Özeti</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Toplam <span className="text-white">{candidates.length} başvuru</span> içinden <span className="text-orange-500 font-bold">{candidates.filter(c => (c.report?.score || 0) > 75).length} aday</span> yüksek uyumluluk (%75+) gösterdi.
                  </p>
                  <div className="mt-10 flex gap-4">
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Bekleyen</span>
                        <div className="text-2xl font-black mt-1">{candidates.filter(c => c.status === 'pending').length}</div>
                     </div>
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Planlanan</span>
                        <div className="text-2xl font-black mt-1 text-emerald-400">{candidates.filter(c => c.status === 'scheduled').length}</div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Scheduling & AI Drafting Modal */}
      {isScheduling && selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-2xl animate-fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-scale-in flex flex-col md:flex-row h-[85vh]">
            {/* Left: Planning Form */}
            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Mülakat Planlama</h3>
                <button onClick={() => setIsScheduling(false)} className="md:hidden text-slate-400 hover:text-slate-900 transition-colors">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Randevu Tarihi</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 transition-all"
                      value={interviewData.date}
                      onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Mülakat Saati</label>
                    <input 
                      type="time" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 transition-all"
                      value={interviewData.time}
                      onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Uygulama Yöntemi</label>
                  <div className="flex flex-wrap gap-3">
                    {['Yüz Yüze', 'Google Meet', 'Zoom'].map(m => (
                      <button 
                        key={m}
                        onClick={() => setInterviewData({...interviewData, method: m as any})}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest ${interviewData.method === m ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Toplantı Konumu veya Dijital Link</label>
                  <textarea 
                    className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 h-24 resize-none transition-all"
                    placeholder="Adres bilgisi veya toplantı linkini buraya ekleyin..."
                    value={interviewData.location}
                    onChange={(e) => setInterviewData({...interviewData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-12">
                 <button 
                  onClick={handleScheduleSubmit}
                  disabled={isSendingNotification || !interviewData.date || !interviewData.time}
                  className="w-full py-6 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-200 hover:bg-orange-700 hover:scale-[1.01] transition-all flex items-center justify-center space-x-4 disabled:opacity-40 disabled:grayscale"
                >
                  {isSendingNotification ? (
                    <>
                      <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      <span>Sistem İletişimi Kuruyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      <span>Planla ve Bildirimleri Gönder</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: AI Invitation Intelligence */}
            <div className="flex-1 bg-slate-50 p-12 border-l border-slate-200/50 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  AI Davet Mimarı
                </h4>
                <button onClick={() => setIsScheduling(false)} className="hidden md:block text-slate-400 hover:text-slate-900 transition-colors">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                {!aiDraft ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[3rem]">
                    <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-600 mb-6">
                       <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    </div>
                    <p className="text-slate-500 font-bold mb-8 leading-relaxed max-w-xs">Adayın başarı puanına ve profiline özel bir mülakat davet taslağı oluşturmak ister misiniz?</p>
                    <button 
                      onClick={handleAiDraftRequest}
                      disabled={isAiDrafting}
                      className="px-10 py-5 bg-white border-2 border-orange-200 text-orange-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all-custom flex items-center gap-3"
                    >
                      {isAiDrafting ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> : null}
                      AI Taslağı Oluştur
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 flex flex-col animate-fade-in">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="prose prose-slate prose-sm font-medium text-slate-600 whitespace-pre-wrap">
                        {aiDraft}
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between items-center border-t border-slate-50 pt-6">
                       <button onClick={() => setAiDraft('')} className="text-[10px] font-black text-slate-400 uppercase hover:text-rose-600 transition-colors">Taslağı Sil</button>
                       <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">Kişiselleştirilmiş İletişim Hazır</span>
                    </div>
                  </div>
                )}
                <div className="mt-6 flex items-start gap-3 p-6 bg-slate-900 rounded-[2rem] text-white/50 text-[10px] font-bold leading-relaxed">
                   <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <p>Gönderim sonrası mülakat bilgileri adayın paneline yansır ve eşzamanlı olarak WhatsApp/Email entegrasyonu üzerinden servis edilir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
