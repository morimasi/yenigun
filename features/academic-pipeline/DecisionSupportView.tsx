
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, IDP, StaffRole, Branch } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import DecisionAdvisorChat from '../../components/admin/DecisionAdvisorChat';
import ExportStudio from '../../components/shared/ExportStudio';
import { poolService } from '../../services/ai/poolService';
import { armsService } from '../../services/ai/armsService';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onRefresh: () => void;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config, onRefresh }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'h2h' | 'team_fit' | 'adaptation'>('h2h');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  
  const [comparisonReport, setComparisonReport] = useState<any>(null);
  const [onboardingPlan, setOnboardingPlan] = useState<IDP | null>(null);

  const analyzedCandidates = useMemo(() => 
    Array.isArray(candidates) ? candidates.filter(c => !!c.report) : [], 
    [candidates]
  );
  
  const selectedCandidates = useMemo(() => 
    analyzedCandidates.filter(c => selectedIds.includes(c.id)), 
    [analyzedCandidates, selectedIds]
  );

  const dimensions = [
    { key: 'technicalExpertise', label: 'KLİNİK DERİNLİK' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİK ÇEVİKLİK' },
    { key: 'workEthics', label: 'ETİK BÜTÜNLÜK' },
    { key: 'sustainability', label: 'PSİKOLOJİK DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'developmentOpenness', label: 'GELİŞİM HIZI' }
  ];

  const chartData = useMemo(() => {
    return dimensions.map(d => ({
      subject: d.label,
      ...(selectedCandidates[0] ? { [selectedCandidates[0].name]: selectedCandidates[0].report?.deepAnalysis?.[d.key]?.score || 0 } : {}),
      ...(selectedCandidates[1] ? { [selectedCandidates[1].name]: selectedCandidates[1].report?.deepAnalysis?.[d.key]?.score || 0 } : {})
    }));
  }, [selectedCandidates, dimensions]);

  const handleRunComparison = async () => {
    if (selectedCandidates.length < 1) return;
    setIsAnalysing(true);
    try {
      if (activeTab === 'h2h' && selectedCandidates.length === 2) {
        const res = await poolService.compareTwoCandidates(selectedCandidates[0], selectedCandidates[1], config);
        setComparisonReport(res);
      } else if (activeTab === 'adaptation' && selectedCandidates.length > 0) {
        const res = await armsService.generateIDP(selectedCandidates[0]);
        setOnboardingPlan(res);
      } else {
        const res = await poolService.analyzeTalentPool(selectedCandidates, config);
        setComparisonReport(res);
      }
    } catch (e) {
      alert("AI Muhakeme Hatası: Lütfen tekrar deneyiniz.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleHireAction = async (candidate: Candidate) => {
    if (!confirm(`${candidate.name} personel kadrosuna atanacak ve 90 günlük akademik oryantasyon planı mühürlenecektir. Onaylıyor musunuz?`)) return;
    setIsHiring(true);
    try {
      const res = await fetch('/api/staff?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: candidate.name,
          email: candidate.email,
          branch: candidate.branch,
          role: StaffRole.Staff,
          password: 'yg' + Math.floor(1000 + Math.random() * 9000),
          report: candidate.report,
          university: candidate.university,
          department: candidate.department,
          experience_years: candidate.experienceYears
        })
      });
      if (res.ok) {
        await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...candidate, 
            status: 'archived', 
            archiveCategory: 'HIRED_CONTRACTED', 
            archiveNote: `AKADEMİK KURUL KARARI: Personel olarak atandı. Tarih: ${new Date().toLocaleDateString()}` 
          })
        });
        alert("Atama Başarılı! Uzman dosyası ARMS Akademik Arşivine taşındı.");
        onRefresh();
        setSelectedIds([]);
      }
    } catch (e) {
      alert("Hiring işlemi sırasında sistem hatası oluştu.");
    } finally {
      setIsHiring(false);
    }
  };

  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
    setComparisonReport(null);
    setOnboardingPlan(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-fade-in no-print bg-[#F8FAFC] overflow-hidden">
      
      {isExportOpen && selectedCandidates.length > 0 && (
         <ExportStudio 
            onClose={() => setIsExportOpen(false)}
            data={{
               type: 'STRATEGIC_DECISION',
               entityName: selectedCandidates.length > 1 ? `${selectedCandidates[0].name} VS ${selectedCandidates[1].name}` : selectedCandidates[0].name,
               referenceId: `DEC-${Date.now().toString().slice(-6)}`,
               payload: { candidates: selectedCandidates, report: comparisonReport, onboarding: onboardingPlan }
            }}
         />
      )}

      {isChatOpen && <DecisionAdvisorChat candidates={selectedCandidates} onClose={() => setIsChatOpen(false)} />}

      {/* HEADER COCKPIT */}
      <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 shrink-0 relative overflow-hidden">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(234,88,12,0.4)] rotate-3">
               <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Karar Destek Sistemi</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">MIA Strategic Engine v27.0</p>
            </div>
         </div>

         <div className="flex items-center gap-4 relative z-10">
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
               {[
                 { id: 'h2h', label: 'H2H KIYAS' },
                 { id: 'team_fit', label: 'EKİP UYUMU' },
                 { id: 'adaptation', label: 'ADAPTASYON' }
               ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => { setActiveTab(t.id as any); setComparisonReport(null); setOnboardingPlan(null); }}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                  >
                     {t.label}
                  </button>
               ))}
            </div>
            <button onClick={() => setIsChatOpen(true)} className="p-4 bg-white/10 hover:bg-orange-600 text-white rounded-2xl transition-all shadow-lg group">
               <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
         </div>
         <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
         
         {/* LEFT SELECTION PANEL */}
         <div className="col-span-12 lg:col-span-3 flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">AKTİF DOSYALAR</h4>
               <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black">{selectedIds.length} / 2</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
               {analyzedCandidates.length === 0 ? (
                  <div className="py-20 text-center opacity-20 grayscale">
                     <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5" /></svg>
                     <p className="text-[10px] font-black uppercase tracking-widest">Analiz Verisi Yok</p>
                  </div>
               ) : (
                  analyzedCandidates.map(c => (
                     <button 
                       key={c.id} 
                       onClick={() => toggleCandidate(c.id)}
                       className={`w-full p-5 rounded-[2.5rem] border-2 transition-all flex items-center gap-4 text-left group relative ${
                         selectedIds.includes(c.id) 
                         ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02] translate-x-2' 
                         : 'bg-white border-transparent text-slate-500 hover:border-orange-200 hover:bg-slate-50'
                       }`}
                     >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 transition-all ${selectedIds.includes(c.id) ? 'bg-orange-600' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100'}`}>
                           {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[13px] font-black uppercase truncate mb-1">{c.name}</p>
                           <p className={`text-[8px] font-bold uppercase truncate opacity-60 ${selectedIds.includes(c.id) ? 'text-slate-400' : 'text-slate-500'}`}>{c.branch}</p>
                        </div>
                        <div className="text-right shrink-0">
                           <p className={`text-[12px] font-black ${selectedIds.includes(c.id) ? 'text-orange-500' : 'text-slate-900'}`}>%{c.report?.score}</p>
                        </div>
                     </button>
                  ))
               )}
            </div>
         </div>

         {/* MAIN CANVAS */}
         <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 overflow-hidden">
            {selectedCandidates.length === 0 ? (
               <div className="flex-1 bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center opacity-30 grayscale p-24 text-center">
                  <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-10 shadow-inner border border-slate-100">
                     <svg className="w-20 h-20 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 uppercase tracking-[0.5em] mb-6">Analiz Sahnesi</h3>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 max-w-lg leading-relaxed">Kıyaslamak veya adaptasyon rotası hazırlamak istediğiniz dosyaları seçin.</p>
               </div>
            ) : (
               <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-20">
                  
                  {/* H2H COMPARISON WORKSPACE */}
                  {activeTab === 'h2h' && (
                     <div className="space-y-6 animate-slide-up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[450px]">
                           <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col">
                              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 border-l-4 border-orange-600 pl-6">YETKİNLİK RADARI (DELTA)</h4>
                              <div className="flex-1 min-h-0">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={chartData}>
                                       <PolarGrid stroke="#f1f5f9" />
                                       <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                                       {selectedCandidates.map((c, i) => (
                                          <Radar key={c.id} name={c.name} dataKey={c.name} stroke={i === 0 ? '#ea580c' : '#0f172a'} fill={i === 0 ? '#ea580c' : '#0f172a'} fillOpacity={0.2} strokeWidth={4} />
                                       ))}
                                       <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                                       <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                    </RadarChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>

                           <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col">
                              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 border-l-4 border-slate-900 pl-6">LİYAKAT SKOR KIYASI</h4>
                              <div className="flex-1 min-h-0">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} barGap={4}>
                                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                       <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900 }} />
                                       <YAxis hide domain={[0, 100]} />
                                       <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                       {selectedCandidates.map((c, i) => (
                                          <Bar key={c.id} dataKey={c.name} fill={i === 0 ? '#ea580c' : '#0f172a'} radius={[10, 10, 0, 0]} barSize={32} />
                                       ))}
                                    </BarChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>
                        </div>

                        {selectedCandidates.length === 2 && (
                           <div className="bg-slate-950 p-12 rounded-[5rem] text-white relative overflow-hidden group border border-white/5">
                              <div className="relative z-10 space-y-10">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                       <span className="w-3 h-3 bg-orange-600 rounded-full animate-ping"></span>
                                       <h4 className="text-xl font-black uppercase tracking-widest text-orange-500">Nöral Delta Analizi</h4>
                                    </div>
                                    <button 
                                      onClick={handleRunComparison}
                                      disabled={isAnalysing}
                                      className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl"
                                    >
                                       {isAnalysing ? 'İŞLENİYOR...' : 'DERİN ANALİZİ BAŞLAT'}
                                    </button>
                                 </div>

                                 {comparisonReport ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
                                       <div className="space-y-6">
                                          <p className="text-2xl font-bold text-slate-300 leading-relaxed italic">"{comparisonReport.summary}"</p>
                                          <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                                             <h6 className="text-[10px] font-black text-orange-500 uppercase mb-4 tracking-widest">STRATEJİK ÜSTÜNLÜK</h6>
                                             <p className="text-base font-bold">{comparisonReport.winnerAdvantage}</p>
                                          </div>
                                       </div>
                                       <div className="grid grid-cols-1 gap-6">
                                          <div className="p-8 bg-rose-500/10 rounded-3xl border border-rose-500/20">
                                             <h6 className="text-[10px] font-black text-rose-500 uppercase mb-4 tracking-widest">KRİTİK RİSK</h6>
                                             <p className="text-sm font-medium text-rose-100 opacity-80">{comparisonReport.criticalRisk}</p>
                                          </div>
                                          <div className="p-8 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                                             <h6 className="text-[10px] font-black text-blue-400 uppercase mb-4 tracking-widest">ADAPTASYON TAVSİYESİ</h6>
                                             <p className="text-sm font-medium text-blue-50 opacity-80">{comparisonReport.onboardingRecommendation}</p>
                                          </div>
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="py-20 flex flex-col items-center justify-center opacity-40">
                                       <div className="text-5xl mb-6">⚖️</div>
                                       <p className="text-[12px] font-black uppercase tracking-[0.5em]">Aday farklarını sentezlemek için butona basın</p>
                                    </div>
                                 )}
                              </div>
                              <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]"></div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* TEAM FIT WORKSPACE */}
                  {activeTab === 'team_fit' && (
                     <div className="space-y-8 animate-slide-up">
                        <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-sm space-y-12">
                           <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                              <div>
                                 <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Organizasyonel Entegrasyon</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Team DNA Gap Analysis</p>
                              </div>
                              <div className="text-right">
                                 <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest">Klinik Boşluk Analizi</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {selectedCandidates.map(c => (
                                 <div key={c.id} className="p-10 bg-slate-50 rounded-[4rem] border border-slate-100 flex flex-col justify-between hover:border-orange-500 transition-all group h-full">
                                    <div className="space-y-6">
                                       <div className="flex justify-between items-start">
                                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{c.name}</p>
                                          <span className="text-3xl">🧩</span>
                                       </div>
                                       <div className="space-y-2">
                                          <p className="text-5xl font-black text-slate-900">%{c.report?.predictiveMetrics?.learningVelocity || 0}</p>
                                          <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">ÖĞRENME ÇEVİKLİĞİ</p>
                                       </div>
                                       <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
                                          <div className="h-full bg-orange-600" style={{ width: `${c.report?.predictiveMetrics?.learningVelocity}%` }}></div>
                                       </div>
                                    </div>
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                       <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic opacity-80 group-hover:opacity-100">"{c.report?.recommendation?.substring(0, 150)}..."</p>
                                       <button 
                                         onClick={() => handleHireAction(c)}
                                         disabled={isHiring}
                                         className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                                       >
                                          {isHiring ? 'MÜHÜRLENİYOR...' : 'PERSONEL OLARAK ATA'}
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* ADAPTATION WORKSPACE */}
                  {activeTab === 'adaptation' && (
                     <div className="space-y-8 animate-slide-up">
                        <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-sm">
                           {!onboardingPlan ? (
                              <div className="py-24 text-center space-y-8">
                                 <div className="w-32 h-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-10 shadow-inner">
                                    <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" /></svg>
                                 </div>
                                 <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">90 Günlük Nöral Adaptasyon Rotası</h3>
                                 <p className="text-slate-400 font-bold text-[12px] uppercase tracking-widest max-w-md mx-auto">Adayın liyakat zayıflıklarını onaracak özel süpervizyon planını AI ile üretin.</p>
                                 <button 
                                    onClick={handleRunComparison}
                                    disabled={isAnalysing}
                                    className="px-16 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-3xl hover:bg-orange-600 transition-all active:scale-95"
                                 >
                                    {isAnalysing ? 'MÜFREDAT SENTEZLENİYOR...' : 'ÖZEL ONBOARDING PLANI ÜRET'}
                                 </button>
                              </div>
                           ) : (
                              <div className="space-y-12 animate-fade-in">
                                 <div className="flex justify-between items-end border-b border-slate-50 pb-10">
                                    <div>
                                       <h4 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">90 Günlük Gelişim Yolu</h4>
                                       <p className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.4em] mt-3">KRİTİK ODAK: {onboardingPlan.focusArea}</p>
                                    </div>
                                    <button onClick={() => setIsExportOpen(true)} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">YAYINLA</button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                      { phase: 'İlk 30 Gün', color: 'orange', data: onboardingPlan.roadmap?.shortTerm },
                                      { phase: '60. Gün Eşiği', color: 'slate', data: onboardingPlan.roadmap?.midTerm },
                                      { phase: '90. Gün Final', color: 'emerald', data: onboardingPlan.roadmap?.longTerm }
                                    ].map((step, idx) => (
                                       <div key={idx} className={`p-10 bg-white border-2 border-slate-50 rounded-[4rem] relative overflow-hidden group hover:border-${step.color}-500 transition-all shadow-sm hover:shadow-xl`}>
                                          <div className={`w-12 h-12 rounded-2xl bg-${step.color === 'slate' ? 'slate-900' : step.color + '-600'} text-white flex items-center justify-center font-black text-lg mb-8 shadow-lg`}>{idx + 1}</div>
                                          <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">{step.phase}</h5>
                                          <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic">"{step.data}"</p>
                                          <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-${step.color === 'slate' ? 'slate-900' : step.color + '-600'}`}></div>
                                       </div>
                                    ))}
                                 </div>

                                 <div className="bg-slate-50 p-12 rounded-[5rem] border border-slate-100 space-y-8">
                                    <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-widest pl-6 border-l-4 border-orange-600">ATANAN KRİTİK EĞİTİMLER</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       {(onboardingPlan.curriculum || []).slice(0, 4).map((mod, i) => (
                                          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group">
                                             <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-orange-600 group-hover:text-white transition-all">{i+1}</div>
                                                <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{mod.title}</p>
                                             </div>
                                             <span className="text-[9px] font-black text-slate-300 uppercase">{(mod.units || []).length} Ünite</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DecisionSupportView;
