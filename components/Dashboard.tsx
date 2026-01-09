
import React, { useState, useMemo } from 'react';
import { Candidate, Branch, GlobalConfig, AIReport, AlgorithmicReport } from '../types';
import CandidateReport from './CandidateReport';
import { generateCandidateAnalysis } from '../geminiService';
import { calculateAlgorithmicAnalysis } from '../analysisUtils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';

interface DashboardProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, config, onUpdateCandidate, onUpdateConfig, onDeleteCandidate }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'calendar' | 'settings'>('pipeline');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [filter, setFilter] = useState({ search: '', branch: 'All', status: 'All' });
  const [analysisMode, setAnalysisMode] = useState<'ai' | 'algo' | 'hybrid'>('hybrid');

  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedId), [candidates, selectedId]);

  // Analytics Data
  const analyticsData = useMemo(() => {
    const branchCounts = candidates.reduce((acc: any, curr) => {
      acc[curr.branch] = (acc[curr.branch] || 0) + 1;
      return acc;
    }, {});

    const scoreDistribution = [
      { name: '0-20', count: candidates.filter(c => (c.report?.score || 0) <= 20).length },
      { name: '21-40', count: candidates.filter(c => (c.report?.score || 0) > 20 && (c.report?.score || 0) <= 40).length },
      { name: '41-60', count: candidates.filter(c => (c.report?.score || 0) > 40 && (c.report?.score || 0) <= 60).length },
      { name: '61-80', count: candidates.filter(c => (c.report?.score || 0) > 60 && (c.report?.score || 0) <= 80).length },
      { name: '81-100', count: candidates.filter(c => (c.report?.score || 0) > 80).length },
    ];

    return {
      branchData: Object.keys(branchCounts).map(key => ({ name: key, value: branchCounts[key] })),
      scoreDistribution
    };
  }, [candidates]);

  const handleManualAnalysis = async () => {
    if (!selectedCandidate) return;
    setIsAnalysing(true);
    const algoReport = calculateAlgorithmicAnalysis(selectedCandidate);
    let aiReport = selectedCandidate.report;
    try {
      aiReport = await generateCandidateAnalysis(selectedCandidate);
    } catch (e) {
      console.warn("AI Analizi başarısız, algoritmik verilerle devam ediliyor.");
    }
    onUpdateCandidate({ ...selectedCandidate, report: aiReport, algoReport });
    setIsAnalysing(false);
  };

  const filteredList = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(filter.search.toLowerCase());
      const matchesBranch = filter.branch === 'All' || c.branch === filter.branch;
      const matchesStatus = filter.status === 'All' || c.status === filter.status;
      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [candidates, filter]);

  const COLORS = ['#ea580c', '#0f172a', '#64748b', '#94a3b8', '#cbd5e1'];

  return (
    <div className="flex flex-col xl:flex-row gap-10 animate-fade-in pb-20 max-w-[1600px] mx-auto">
      {/* Sidebar Navigation */}
      <aside className="xl:w-80 space-y-6">
        <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-3 opacity-80">Yeni Gün Akademi AI</h2>
            <p className="text-3xl font-black tracking-tighter leading-none">{config.institutionName}</p>
            <p className="text-[9px] mt-4 font-bold text-slate-500 tracking-widest uppercase italic">Dual-Engine v3.0 (Flash)</p>
          </div>
        </div>

        <nav className="p-3 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-sm space-y-2">
          {[
            { id: 'pipeline', label: 'ADAY AKIŞI', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { id: 'analytics', label: 'STRATEJİK VERİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'calendar', label: 'MÜLAKAT TAKVİMİ', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'settings', label: 'SİSTEM AYARLARI', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[2.2rem] transition-all duration-500 font-black text-[11px] uppercase tracking-widest group ${
                activeTab === tab.id ? 'bg-orange-600 text-white shadow-2xl translate-x-3' : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List Section */}
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="İsim veya branş ara..." 
                      className="w-full bg-slate-50 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-100 transition-all"
                      onChange={e => setFilter({...filter, search: e.target.value})}
                    />
                    <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <select 
                    className="w-full bg-slate-50 rounded-2xl p-5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer border-none"
                    onChange={e => setFilter({...filter, branch: e.target.value})}
                  >
                    <option value="All">Tüm Branşlar</option>
                    {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
               </div>
               
               <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredList.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedId(c.id)}
                      className={`p-7 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                        selectedId === c.id ? 'bg-white border-orange-600 shadow-2xl scale-[1.02]' : 'bg-white border-slate-50 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <h4 className="font-black text-slate-900 text-lg leading-tight">{c.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.branch}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${c.status === 'pending' ? 'bg-amber-400' : c.status === 'rejected' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                      </div>
                      
                      {(c.report || c.algoReport) && (
                        <div className="mt-5 flex gap-2">
                           {c.report && <span className="px-4 py-2 bg-orange-50 text-orange-600 text-[10px] font-black rounded-xl border border-orange-100">FLASH: %{c.report.score}</span>}
                           {c.algoReport && <span className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl">ALGO: %{c.algoReport.overallScore}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredList.length === 0 && (
                    <div className="p-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest">Aday Bulunamadı</div>
                  )}
               </div>
            </div>

            {/* Detailed View Section */}
            <div className="lg:col-span-8">
              {selectedCandidate ? (
                <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[85vh] flex flex-col animate-scale-in">
                   <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/40">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-full tracking-widest uppercase">ID: {selectedCandidate.id}</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{new Date(selectedCandidate.timestamp).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedCandidate.name}</h3>
                        <div className="flex gap-4 mt-6">
                           {[
                             { id: 'ai', label: 'FLASH AI', color: 'bg-orange-600' },
                             { id: 'algo', label: 'ALGORİTMİK', color: 'bg-slate-900' },
                             { id: 'hybrid', label: 'HİBRİT PANEL', color: 'bg-emerald-600' }
                           ].map(mode => (
                             <button 
                               key={mode.id}
                               onClick={() => setAnalysisMode(mode.id as any)}
                               className={`text-[10px] font-black px-6 py-2.5 rounded-2xl transition-all border-2 ${
                                 analysisMode === mode.id ? `${mode.color} text-white border-transparent shadow-lg` : 'bg-white text-slate-400 border-slate-100 hover:border-orange-200'
                               }`}
                             >{mode.label}</button>
                           ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={handleManualAnalysis}
                          className="px-10 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl hover:-translate-y-1"
                        >
                          Motorları Tetikle
                        </button>
                        <button 
                          onClick={() => onDeleteCandidate(selectedCandidate.id)}
                          className="px-10 py-3 text-rose-500 font-black text-[9px] uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-all"
                        >
                          Kaydı Tamamen Sil
                        </button>
                      </div>
                   </div>
                   
                   <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                      {isAnalysing ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-8 py-20">
                           <div className="w-24 h-24 border-[10px] border-orange-50 border-t-orange-600 rounded-full animate-spin"></div>
                           <div className="text-center">
                             <p className="font-black text-slate-900 text-xl tracking-tighter uppercase mb-2">Multimodal Analiz Devrede</p>
                             <p className="text-slate-400 font-bold text-sm">Gemini 3 Flash & Deterministik Motor verileri sentezliyor...</p>
                           </div>
                        </div>
                      ) : (
                        <CandidateReport 
                          report={selectedCandidate.report} 
                          algoReport={selectedCandidate.algoReport} 
                          name={selectedCandidate.name}
                          viewMode={analysisMode}
                        />
                      )}
                      
                      {/* Admin Notes Area */}
                      <div className="mt-16 pt-16 border-t border-slate-100">
                         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Kurumsal Notlar & Değerlendirme</h4>
                         <textarea 
                           className="w-full bg-slate-50 rounded-[2.5rem] p-10 h-48 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all border-2 border-transparent focus:border-orange-100"
                           placeholder="Mülakat öncesi veya sonrası teknik görüşlerinizi buraya not edebilirsiniz..."
                           value={selectedCandidate.adminNotes || ''}
                           onChange={e => onUpdateCandidate({...selectedCandidate, adminNotes: e.target.value})}
                         />
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-full border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
                   <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8">
                      <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   </div>
                   <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-sm">Aday Seçimi Bekleniyor</p>
                   <p className="text-slate-300 font-bold text-xs mt-4">Sol panelden bir aday seçerek detaylı analize ulaşın.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Toplam Başvuru</h4>
                   <p className="text-6xl font-black text-slate-900 tracking-tighter">{candidates.length}</p>
                </div>
                <div className="bg-orange-600 p-12 rounded-[4rem] shadow-2xl text-white">
                   <h4 className="text-[11px] font-black text-orange-200 uppercase tracking-widest mb-2">Ortalama Uyumluluk</h4>
                   <p className="text-6xl font-black tracking-tighter">
                     %{Math.round(candidates.reduce((a,b) => a + (b.report?.score || 0), 0) / (candidates.length || 1))}
                   </p>
                </div>
                <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Aktif Branş Sayısı</h4>
                   <p className="text-6xl font-black tracking-tighter">{analyticsData.branchData.length}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 h-[500px]">
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-10 text-center">Branş Dağılım Analizi</h4>
                   <ResponsiveContainer width="100%" height="80%">
                      <PieChart>
                        <Pie data={analyticsData.branchData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={10} dataKey="value">
                          {analyticsData.branchData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', fontWeight: 'bold' }} />
                      </PieChart>
                   </ResponsiveContainer>
                </div>

                <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 h-[500px]">
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-10 text-center">Skor Frekans Dağılımı</h4>
                   <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={analyticsData.scoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', fontWeight: 'bold' }} />
                        <Bar dataKey="count" fill="#ea580c" radius={[12, 12, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-[5rem] shadow-2xl border border-slate-100 p-20 text-center animate-fade-in">
             <div className="max-w-xl mx-auto">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-emerald-100">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               </div>
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-6">Mülakat Planlayıcı</h3>
               <p className="text-slate-500 font-medium text-lg leading-relaxed mb-12">Davet edilen adaylar için otomatik Google Meet veya Zoom entegrasyonu hazırlayan mülakat yönetim katmanı.</p>
               <div className="grid grid-cols-1 gap-4">
                  {candidates.filter(c => c.status === 'interview_scheduled').length > 0 ? (
                    candidates.filter(c => c.status === 'interview_scheduled').map(c => (
                      <div key={c.id} className="p-8 bg-slate-50 rounded-[3rem] flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-emerald-100">
                         <div className="text-left">
                           <h5 className="font-black text-slate-900 text-lg">{c.name}</h5>
                           <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{c.interviewSchedule?.date} @ {c.interviewSchedule?.time}</p>
                         </div>
                         <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">Giriş Yap</button>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 border-4 border-dashed border-slate-50 rounded-[4rem]">
                       <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Henüz Planlanmış Mülakat Yok</p>
                    </div>
                  )}
               </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
             <div className="bg-white p-16 rounded-[4rem] shadow-xl border border-slate-100 space-y-12">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Kurumsal Yapılandırma</h3>
                
                <div className="space-y-8">
                   <div className="group">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Kurum Resmi Adı</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 p-6 rounded-3xl font-bold text-slate-800 outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all"
                        value={config.institutionName}
                        onChange={e => onUpdateConfig({...config, institutionName: e.target.value})}
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">AI Analiz Tonu</label>
                        <select 
                          className="w-full bg-slate-50 p-6 rounded-3xl font-black text-[11px] uppercase tracking-widest outline-none appearance-none cursor-pointer"
                          value={config.aiTone}
                          onChange={e => onUpdateConfig({...config, aiTone: e.target.value as any})}
                        >
                          <option value="strict">KATII / KRİTİK</option>
                          <option value="balanced">DENGELİ / ANALİTİK</option>
                          <option value="empathetic">EMPATİK / GELİŞİMSEL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Bildirim E-Postası</label>
                        <input 
                          type="email" 
                          className="w-full bg-slate-50 p-6 rounded-3xl font-bold text-slate-800 outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all"
                          value={config.notificationEmail}
                          onChange={e => onUpdateConfig({...config, notificationEmail: e.target.value})}
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-slate-50">
                   <div className="flex items-center justify-between p-8 bg-orange-50 rounded-[3rem] border border-orange-100">
                      <div>
                        <h5 className="font-black text-orange-900 text-lg">Veritabanı Senkronizasyonu</h5>
                        <p className="text-orange-600 font-bold text-[10px] uppercase tracking-widest mt-1">Son Güncelleme: {new Date(config.lastUpdated).toLocaleTimeString()}</p>
                      </div>
                      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
