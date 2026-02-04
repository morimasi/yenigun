import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, Branch } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line 
} from 'recharts';
import ExportStudio from '../../components/shared/ExportStudio';
import CandidateReport from '../../components/CandidateReport';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedMatrixId, setSelectedMatrixId] = useState<string>('workEthics');
  const [isExportStudioOpen, setIsExportStudioOpen] = useState(false);
  
  const matrixSegments = [
    { id: 'workEthics', label: 'ETİK & SINIRLAR', icon: '⚖️' },
    { id: 'technicalExpertise', label: 'KLİNİK DERİNLİK', icon: '🧠' },
    { id: 'pedagogicalAnalysis', label: 'PEDAGOJİ', icon: '📚' },
    { id: 'institutionalLoyalty', label: 'SADAKAT & UYUM', icon: '🏛️' },
    { id: 'sustainability', label: 'DİRENÇ & STRES', icon: '🔋' }
  ];

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return matrixSegments.map(s => ({ 
      subject: s.label, 
      value: (da as any)?.[s.id]?.score || 0 
    }));
  }, [candidate.report]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e: any) { alert("Nöral Analiz Hatası: Bağlantı koptu."); } 
    finally { setIsAnalysing(false); }
  };

  const renderMatrix = () => {
    const data = (candidate.report?.deepAnalysis as any)?.[selectedMatrixId];
    if (!data) return <div className="p-10 text-center opacity-30 uppercase font-black tracking-widest">Veri Analiz Edilmedi</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
        <div className="md:col-span-4 space-y-2">
           {matrixSegments.map(s => (
             <button 
               key={s.id} 
               onClick={() => setSelectedMatrixId(s.id)}
               className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${selectedMatrixId === s.id ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300'}`}
             >
                <div className="flex items-center gap-3">
                   <span className="text-xl">{s.icon}</span>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMatrixId === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                </div>
                <span className={`text-sm font-black ${selectedMatrixId === s.id ? 'text-orange-500' : 'text-slate-900'}`}>%{ (candidate.report?.deepAnalysis as any)?.[s.id]?.score || 0 }</span>
             </button>
           ))}
        </div>
        <div className="md:col-span-8 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Klinik Gerekçelendirme</h4>
              <p className="text-sm font-bold text-slate-800 leading-relaxed italic text-justify">"{data.reasoning}"</p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block mb-4">GÜÇLÜ YÖNLER (PROS)</span>
                    <ul className="space-y-2">
                       {(data.pros || []).map((p:string,i:number) => <li key={i} className="text-[11px] font-bold text-emerald-800 flex gap-2"><span className="text-emerald-500">+</span> {p}</li>)}
                    </ul>
                 </div>
                 <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
                    <span className="text-[9px] font-black text-rose-700 uppercase tracking-widest block mb-4">RİSK ANALİZİ (CONS)</span>
                    <ul className="space-y-2">
                       {(data.risks || []).map((r:string,i:number) => <li key={i} className="text-[11px] font-bold text-rose-800 flex gap-2"><span className="text-rose-500">!</span> {r}</li>)}
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderDNA = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-scale-in">
       <div className="lg:col-span-5 bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col items-center">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 w-full text-left">Yetkinlik Parmak İzi</h4>
          <div className="w-full h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                   <PolarGrid stroke="#e2e8f0" />
                   <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} />
                   <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={3} />
                   <Tooltip />
                </RadarChart>
             </ResponsiveContainer>
          </div>
       </div>
       <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                   <p className="text-5xl font-black tracking-tighter">%{candidate.report?.integrityIndex}</p>
                   <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-2">Dürüstlük Endeksi</p>
                </div>
                <div className="text-right">
                   <p className="text-5xl font-black tracking-tighter">%{candidate.report?.socialMaskingScore}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Sosyal Maskeleme</p>
                </div>
             </div>
             <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-rose-500 transition-all duration-1000" style={{ width: `${candidate.report?.integrityIndex}%` }}></div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl"></div>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-4 border-l-4 border-orange-600 pl-6">Karakter Portresi (AI Sentezi)</h4>
             <p className="text-[13px] font-medium text-slate-600 leading-relaxed text-justify italic">
                "{candidate.report?.detailedAnalysisNarrative || "Analiz oluşturuluyor..."}"
             </p>
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

         <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em] mb-10 text-center">24 Aylık Liyakat ve Gelişim Projeksiyonu</h4>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectory}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} domain={[0, 100]} />
                     <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                     <Area type="monotone" dataKey="meritScore" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" name="Liyakat %" />
                     <Area type="monotone" dataKey="burnoutRisk" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="Burnout Risk %" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
               {trajectory.filter((_,i) => i % 6 === 0).map((t:any) => (
                  <div key={t.month} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">{t.month}. Ay Konumu</span>
                     <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter mb-1">{t.competencyLevel}</p>
                     <p className="text-[10px] font-medium text-slate-500 italic leading-snug">"{t.strategicAdvice}"</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    );
  };

  const renderStrategy = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-md">
          <div className="flex items-center gap-4 mb-10 border-l-8 border-slate-900 pl-8">
             <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mülakat Savaş Planı</h3>
             <span className="px-4 py-1.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">GİZLİ</span>
          </div>
          <div className="space-y-4">
             {candidate.report?.interviewGuidance?.strategicQuestions?.map((q, i) => (
                <div key={i} className="flex gap-6 items-start group p-6 hover:bg-slate-50 rounded-[2.5rem] transition-all border border-transparent hover:border-slate-100">
                   <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-lg group-hover:bg-orange-600 transition-colors">
                      {i + 1}
                   </div>
                   <div className="space-y-2">
                      <p className="text-base font-bold text-slate-800 leading-tight italic">"{q}"</p>
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        * Adayın etik direncini ve metodolojik samimiyetini test eder.
                      </p>
                   </div>
                </div>
             ))}
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-rose-50 p-10 rounded-[4rem] border border-rose-100">
             <h5 className="text-[11px] font-black text-rose-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                Kritik Gözlem Noktaları
             </h5>
             <div className="space-y-3">
                {candidate.report?.interviewGuidance?.criticalObservations?.map((obs, i) => (
                   <div key={i} className="flex gap-4 items-center bg-white/60 p-4 rounded-2xl border border-white">
                      <span className="text-rose-600 font-black text-sm">!</span>
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{obs}</p>
                   </div>
                ))}
             </div>
          </div>
          <div className="bg-slate-900 p-10 rounded-[4rem] text-white">
             <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6">Pratik Simülasyon Görevi</h5>
             <div className="space-y-4">
                {candidate.report?.interviewGuidance?.simulationTasks?.map((task, i) => (
                   <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-orange-500 font-black">►</span>
                      <p className="text-[12px] font-bold italic leading-relaxed text-slate-300">{task}</p>
                   </div>
                ))}
             </div>
          </div>
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
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse`}></div>
            <div>
               <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{candidate.name}</h2>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{candidate.branch} • {candidate.experienceYears} YIL DENEYİM</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {candidate.report && (
               <button onClick={() => setIsExportStudioOpen(true)} className="px-5 py-2 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">DOSYAYI YAYINLA</button>
            )}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
               <button onClick={() => setActiveTab('matrix')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'matrix' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>MATRIX</button>
               <button onClick={() => setActiveTab('dna')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'dna' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>DNA</button>
               <button onClick={() => setActiveTab('predictions')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'predictions' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>PREDICTIONS</button>
               <button onClick={() => setActiveTab('strategy')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>STRATEGY</button>
            </div>
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`px-8 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 ${isAnalysing ? 'opacity-50' : ''}`}
            >
               {isAnalysing ? 'NÖRAL ANALİZ...' : 'YENİDEN ANALİZ ET'}
            </button>
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-8">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
               <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mb-8 border-4 border-dashed border-slate-200">
                  <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.4em]">Analiz Bekleniyor</h3>
            </div>
         ) : (
            <div className="max-w-6xl mx-auto pb-20">
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