import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, Branch } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import ExportStudio from '../../components/shared/ExportStudio';
import CandidateReport from '../../components/CandidateReport';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedMatrixId, setSelectedMatrixId] = useState<string>('technicalExpertise');
  const [isExportStudioOpen, setIsExportStudioOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // STATİK MATRIX SEGMENTLERİ - SERVICE İLE %100 UYUMLU ID'LER
  const matrixSegments = useMemo(() => [
    { id: 'technicalExpertise', label: 'KLİNİK DERİNLİK', icon: '🧠', group: 'KLİNİK' },
    { id: 'pedagogicalAgility', label: 'PEDAGOJİK ÇEVİKLİK', icon: '🏃', group: 'KLİNİK' },
    { id: 'crisisResilience', label: 'KRİZ DİRENCİ', icon: '🔥', group: 'KLİNİK' },
    { id: 'parentalDiplomacy', label: 'VELİ DİPLOMASİSİ', icon: '🤝', group: 'KLİNİK' },
    { id: 'clinicalDocumentation', label: 'BİLİMSEL KAYIT', icon: '📝', group: 'KLİNİK' },
    { id: 'workEthics', label: 'ETİK & SINIRLAR', icon: '⚖️', group: 'ETİK' },
    { id: 'metacognitiveAwareness', label: 'ÖZ-DENETİM', icon: '🔍', group: 'ETİK' },
    { id: 'cognitiveAgility', label: 'BİLİŞSEL ADAPTASYON', icon: '🚀', group: 'KURUMSAL' },
    { id: 'institutionalLoyalty', label: 'SADAKAT & UYUM', icon: '🏛️', group: 'KURUMSAL' },
    { id: 'stabilityFactor', label: 'TÜKENMİŞLİK EŞİĞİ', icon: '🔋', group: 'KURUMSAL' }
  ], []);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return matrixSegments.map(s => ({ 
      subject: s.label, 
      value: (da as any)?.[s.id]?.score || 0 
    }));
  }, [candidate.report, matrixSegments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e: any) { alert("Nöral Analiz Hatası: Bağlantı koptu."); } 
    finally { setIsAnalysing(false); }
  };

  const handlePermanentDelete = async () => {
    if (isDeleteConfirmOpen) {
       onDelete();
    } else {
       setIsDeleteConfirmOpen(true);
       setTimeout(() => setIsDeleteConfirmOpen(false), 5000);
    }
  };

  const renderMatrix = () => {
    const da = candidate.report?.deepAnalysis;
    const data = (da as any)?.[selectedMatrixId];
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'OPTIMAL': return 'bg-emerald-500';
            case 'EXCEPTIONAL': return 'bg-blue-600';
            case 'RISK': return 'bg-rose-600';
            case 'BORDERLINE': return 'bg-orange-500';
            default: return 'bg-slate-400';
        }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in h-full">
        {/* SOL: KATEGORİ LİSTESİ */}
        <div className="md:col-span-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 h-[650px]">
           {['KLİNİK', 'ETİK', 'KURUMSAL'].map(groupName => (
             <div key={groupName} className="space-y-1 mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">{groupName} BOYUTU</span>
                {matrixSegments.filter(s => s.group === groupName).map(s => (
                    <button 
                    key={s.id} 
                    onClick={() => setSelectedMatrixId(s.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${selectedMatrixId === s.id ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300'}`}
                    >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{s.icon}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMatrixId === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {da?.[s.id] && <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(da[s.id]?.status)}`}></div>}
                        <span className={`text-sm font-black ${selectedMatrixId === s.id ? 'text-orange-500' : 'text-slate-900'}`}>
                           {da?.[s.id] ? `%${da[s.id].score}` : '-'}
                        </span>
                    </div>
                    </button>
                ))}
             </div>
           ))}
        </div>

        {/* SAĞ: DERİN ANALİZ KANVASI */}
        <div className="md:col-span-8 space-y-6 overflow-y-auto custom-scrollbar h-[650px] pr-2">
           {!data ? (
              <div className="bg-white p-20 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <p className="text-sm font-black uppercase tracking-widest text-slate-400">Bu boyut için nöral sentez henüz tamamlanmadı.</p>
              </div>
           ) : (
             <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusColor(data.status)}`}></div>
                
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-2">KLİNİK MUHAKEME VE NEDENSELLİK</h4>
                      <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{matrixSegments.find(s => s.id === selectedMatrixId)?.label}</p>
                   </div>
                   <div className="text-right">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg ${getStatusColor(data.status)}`}>
                          {data.status}
                      </span>
                   </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">TEMEL GEREKÇELENDİRME</span>
                        <p className="text-lg font-bold text-slate-800 leading-relaxed text-justify italic">"{data.reasoning}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 hover:bg-blue-50 transition-colors">
                             <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest block mb-4">KLİNİK NÜANSLAR (SATIR ARASI)</span>
                             <p className="text-[12px] font-bold text-blue-900 leading-relaxed italic">"{data.clinicalNuances}"</p>
                          </div>
                          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group/team">
                             <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-4">MOLEKÜLER EKİP ETKİSİ</span>
                             <p className="text-[12px] font-bold text-slate-300 leading-relaxed italic relative z-10">"{data.teamImpact}"</p>
                             <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl group-hover/team:bg-orange-600/10 transition-colors"></div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100">
                             <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block mb-4">LİTERATÜR KORELASYONU</span>
                             <p className="text-[12px] font-black text-emerald-900 leading-relaxed">"{data.literatureReference}"</p>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <span className="text-[8px] font-black text-emerald-600 uppercase block mb-3">KRİTİK AVANTAJLAR</span>
                                <ul className="space-y-2">
                                   {(data.pros || []).slice(0,3).map((p:string, i:number) => <li key={i} className="text-[10px] font-bold text-slate-600 flex gap-3"><span className="text-emerald-500">✓</span> {p}</li>)}
                                </ul>
                             </div>
                             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <span className="text-[8px] font-black text-rose-600 uppercase block mb-3">TESPİT EDİLEN RİSKLER</span>
                                <ul className="space-y-2">
                                   {(data.risks || []).slice(0,3).map((r:string, i:number) => <li key={i} className="text-[10px] font-bold text-slate-600 flex gap-3"><span className="text-rose-500">!</span> {r}</li>)}
                                </ul>
                             </div>
                          </div>
                       </div>
                    </div>

                    {data.behavioralIndicators && data.behavioralIndicators.length > 0 && (
                      <div className="pt-8 border-t border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-5">GÖZLEMLENEBİLİR MİKRO-DAVRANIŞSAL PROJEKSİYONLAR</span>
                          <div className="flex flex-wrap gap-3">
                             {data.behavioralIndicators.map((ind: string, i: number) => (
                                <span key={i} className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-tight shadow-sm"># {ind}</span>
                             ))}
                          </div>
                      </div>
                    )}
                </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  const renderDNA = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-scale-in">
       <div className="lg:col-span-5 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 w-full text-left relative z-10">Yetkinlik Parmak İzi</h4>
          <div className="w-full h-[400px] relative z-10">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                   <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                   <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} />
                   <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={4} />
                   <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                </RadarChart>
             </ResponsiveContainer>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl"></div>
       </div>
       <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="flex justify-between items-end mb-10 relative z-10">
                <div>
                   <p className="text-6xl font-black tracking-tighter leading-none">%{candidate.report?.integrityIndex || 0}</p>
                   <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest mt-4">Dürüstlük ve Tutarlılık Endeksi</p>
                </div>
                <div className="text-right">
                   <p className="text-6xl font-black tracking-tighter leading-none">%{candidate.report?.socialMaskingScore || 0}</p>
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-4">Sosyal Maskeleme Seviyesi</p>
                </div>
             </div>
             <div className="h-2 bg-white/10 rounded-full overflow-hidden relative z-10 border border-white/5">
                <div className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500 transition-all duration-1000" style={{ width: `${candidate.report?.integrityIndex}%` }}></div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl"></div>
          </div>
          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] mb-6 border-l-4 border-orange-600 pl-8">Akademik Karakter Portresi</h4>
             <p className="text-xl font-bold text-slate-700 leading-relaxed text-justify italic group-hover:text-slate-900 transition-colors">
                "{candidate.report?.detailedAnalysisNarrative || "Nöral sentez bekleniyor..."}"
             </p>
             <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-slate-50 rounded-full blur-2xl"></div>
          </div>
       </div>
    </div>
  );

  const renderPredictions = () => {
    const trajectory = candidate.report?.predictiveMetrics?.trajectory || [];
    return (
      <div className="space-y-6 animate-slide-up">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PredictBar label="KURUMSAL SADAKAT" value={candidate.report?.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" description="24 Ay Tutunma" />
            <PredictBar label="ÖĞRENME HIZI" value={candidate.report?.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" description="Klinik Adaptasyon" />
            <PredictBar label="DİRENÇ GÜCÜ" value={100 - (candidate.report?.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" description="Tükenmişlik Eşiği" />
            <PredictBar label="LİDERLİK" value={candidate.report?.predictiveMetrics?.leadershipPotential || 0} color="text-orange-600" description="Mentorluk Pot." />
         </div>

         <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.6em] mb-12 text-center">24 Aylık Liyakat ve Gelişim Projeksiyonu</h4>
            <div className="h-[350px] w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectory}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15}/>
                           <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} domain={[0, 100]} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                     <Area type="monotone" dataKey="meritScore" stroke="#ea580c" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" name="Liyakat %" />
                     <Area type="monotone" dataKey="burnoutRisk" stroke="#ef4444" strokeWidth={2} strokeDasharray="8 8" fill="transparent" name="Tükenmişlik %" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-50 rounded-full blur-[100px]"></div>
         </div>
      </div>
    );
  };

  const renderStrategy = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-6 mb-12 border-l-[12px] border-slate-900 pl-10 relative z-10">
             <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Mülakat Savaş Planı</h3>
             <span className="px-6 py-2 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">STRATEJİK</span>
          </div>
          <div className="space-y-6 relative z-10">
             {candidate.report?.interviewGuidance?.strategicQuestions?.map((q, i) => (
                <div key={i} className="flex gap-8 items-start group p-8 hover:bg-slate-50 rounded-[3rem] transition-all border border-transparent hover:border-slate-100">
                   <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl shrink-0 shadow-2xl group-hover:bg-orange-600 transition-colors">
                      {i + 1}
                   </div>
                   <div className="space-y-3">
                      <p className="text-xl font-bold text-slate-800 leading-tight italic">"{q}"</p>
                      <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">
                        * Adayın metodolojik dürüstlüğünü ve etik direncini saniyeler içinde test eder.
                      </p>
                   </div>
                </div>
             ))}
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-slate-50 rounded-full blur-[100px]"></div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative">
      {isExportStudioOpen && candidate.report && (
        <ExportStudio 
          onClose={() => setIsExportStudioOpen(false)}
          data={{
            type: 'CANDIDATE_REPORT',
            entityName: candidate.name,
            referenceId: candidate.id.toUpperCase(),
            payload: candidate
          }}
        >
          <CandidateReport candidate={candidate} report={candidate.report} />
        </ExportStudio>
      )}

      {/* HEADER COCKPIT */}
      <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-6">
            <div className={`w-4 h-4 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse shadow-[0_0_15px_rgba(234,88,12,0.4)]`}></div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{candidate.name}</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{candidate.branch} • {candidate.experienceYears} YIL SAHA TECRÜBESİ</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            {candidate.report && (
               <button onClick={() => setIsExportStudioOpen(true)} className="px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">DOSYAYI YAYINLA</button>
            )}
            
            <button 
              onClick={handlePermanentDelete} 
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${isDeleteConfirmOpen ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
            >
              {isDeleteConfirmOpen ? 'EMİN MİSİNİZ? (TIKLA)' : 'KAYDI İMHA ET'}
            </button>

            <div className="flex bg-slate-50 p-1.5 rounded-[1.2rem] border border-slate-200 shadow-inner">
               <button onClick={() => setActiveTab('matrix')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'matrix' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>MATRIX</button>
               <button onClick={() => setActiveTab('dna')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dna' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>DNA</button>
               <button onClick={() => setActiveTab('predictions')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'predictions' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>PREDICTIONS</button>
               <button onClick={() => setActiveTab('strategy')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>STRATEGY</button>
            </div>
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95 ${isAnalysing ? 'opacity-50' : ''}`}
            >
               {isAnalysing ? 'İŞLENİYOR...' : 'YENİDEN ANALİZ ET'}
            </button>
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
               <div className="w-40 h-40 bg-slate-100 rounded-[4rem] flex items-center justify-center mb-10 border-4 border-dashed border-slate-200">
                  <svg className="w-20 h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.5em]">Liyakat Analizi Bekleniyor</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">Adayın verilerini işlemek için sağ üstteki butonu kullanın.</p>
            </div>
         ) : (
            <div className="max-w-[1600px] mx-auto pb-32">
               {activeTab === 'matrix' && renderMatrix()}
               {activeTab === 'dna' && renderDNA()}
               {activeTab === 'predictions' && renderPredictions()}
               {activeTab === 'strategy' && renderStrategy()}
            </div>
         )}
      </div>
    </div>
  );
};

export default CandidateDetail;