
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, IntelligenceSegment } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import StatusBadge from './StatusBadge';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');

  const radarData = useMemo(() => {
    if (!candidate.report?.deepAnalysis) return [];
    const d = candidate.report.deepAnalysis;
    return [
      { subject: 'ETİK', value: d.workEthics.score },
      { subject: 'KLİNİK', value: d.technicalExpertise.score },
      { subject: 'PEDAGOJİ', value: d.pedagogicalAnalysis.score },
      { subject: 'DİRENÇ', value: d.sustainability.score },
      { subject: 'RESMİYET', value: d.formality.score },
      { subject: 'UYUM', value: d.institutionalLoyalty.score },
    ];
  }, [candidate.report]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e) {
      alert("Sinyal İşleme Hatası: AI motoruna ulaşılamadı. Lütfen API_KEY yapılandırmasını kontrol edin.");
    } finally { setIsAnalysing(false); }
  };

  const PredictBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-sm font-black ${color}`}>%{value}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
        <div className={`h-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );

  const MatrixCard = ({ title, segment }: { title: string, segment: IntelligenceSegment }) => {
    const isOptimal = segment.score > 70;
    const isCritical = segment.score < 40;
    
    return (
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative border-t-4" 
           style={{ borderTopColor: isOptimal ? '#10b981' : isCritical ? '#ef4444' : '#f59e0b' }}>
        <div className="flex justify-between items-center mb-6">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h5>
          <span className="text-2xl font-black text-slate-900">%{segment.score}</span>
        </div>
        
        <div className="space-y-4">
           <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">AI Gözlemi</span>
              <p className="text-[11px] font-bold text-slate-700 leading-tight italic">"{segment.pros[0] || 'Değerlendiriliyor...'}"</p>
           </div>
           <div className="flex gap-2">
              <div className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${isOptimal ? 'bg-emerald-100 text-emerald-700' : isCritical ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                {segment.competencyLevel}
              </div>
              {segment.contradictions?.length > 0 && (
                <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[7px] font-black uppercase tracking-widest animate-pulse">
                  Anomali
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F8FAFC] rounded-[4rem] shadow-2xl border border-white h-full flex flex-col overflow-hidden animate-scale-in">
      
      {/* GLOSSY HEADER */}
      <div className="p-10 bg-white border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex gap-8 items-center relative z-10">
          <div className="relative group">
            <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl transition-transform group-hover:scale-105">
              {candidate.name.charAt(0)}
            </div>
            {candidate.report && (
               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
               </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <StatusBadge status={candidate.status} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-[0.2em]">SİNYAL ID: {candidate.id.toUpperCase()}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name}</h2>
            <p className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.3em] mt-3">{candidate.branch}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 relative z-10">
          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing} 
            className={`group relative px-10 py-5 overflow-hidden bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50`}
          >
            <span className="relative z-10">{isAnalysing ? 'VERİ İŞLENİYOR...' : 'DERİN ANALİZİ BAŞLAT'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Son Güncelleme: {new Date(candidate.timestamp).toLocaleDateString('tr-TR')}</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="px-10 py-6 bg-white/50 backdrop-blur-xl border-b border-slate-100 flex gap-4 no-print overflow-x-auto custom-scrollbar">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS', icon: 'M4 6h16M4 12h16m-7 6h7' },
          { id: 'dna', label: 'KLİNİK DNA (PARMAK İZİ)', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { id: 'predictions', label: 'PREDİKTİF ANALİZ', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { id: 'strategy', label: 'MÜLAKAT STRATEJİSİ', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === t.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={t.icon} /></svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* DASH-REPORT CONTENT */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#FDFDFD]">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-20 animate-pulse">
             <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner">
                <svg className="w-16 h-16 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
             </div>
             <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Analiz Bekleniyor</h3>
             <p className="max-w-md text-[10px] font-bold text-slate-300 uppercase leading-relaxed">Adayın verilerini işlemek ve liyakat raporunu oluşturmak için sağ üstteki butona tıklayınız.</p>
          </div>
        ) : (
          <div className="space-y-16 animate-fade-in">
            
            {/* TAB 1: 10 BOYUTLU MATRİS */}
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <MatrixCard title="Kişilik & Mizaç" segment={candidate.report.deepAnalysis.personality} />
                <MatrixCard title="Resmiyet & Kurum" segment={candidate.report.deepAnalysis.formality} />
                <MatrixCard title="Veli İlişkileri" segment={candidate.report.deepAnalysis.parentStudentRelations} />
                <MatrixCard title="Burnout Direnci" segment={candidate.report.deepAnalysis.sustainability} />
                <MatrixCard title="Eleştiriye Açıklık" segment={candidate.report.deepAnalysis.criticismTolerance} />
                <MatrixCard title="Gelişime Açıklık" segment={candidate.report.deepAnalysis.developmentOpenness} />
                <MatrixCard title="İş Ahlakı" segment={candidate.report.deepAnalysis.workEthics} />
                <MatrixCard title="Alan Yeterliliği" segment={candidate.report.deepAnalysis.technicalExpertise} />
                <MatrixCard title="Pedagojik Analiz" segment={candidate.report.deepAnalysis.pedagogicalAnalysis} />
              </div>
            )}

            {/* TAB 2: KLİNİK DNA (PARMAK İZİ) */}
            {activeTab === 'dna' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 flex flex-col items-center">
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 self-start border-l-4 border-orange-600 pl-4">LİYAKAT PARMAK İZİ</h4>
                   <div className="w-full h-[500px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontBold: 900, fill: '#94a3b8' }} />
                          <Radar name={candidate.name} dataKey="value" stroke="#ea580c" strokeWidth={4} fill="#ea580c" fillOpacity={0.2} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="lg:col-span-5 space-y-8">
                   <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6">Stratejik Karar Skoru</h4>
                        <div className="flex items-baseline gap-4">
                           <span className="text-7xl font-black leading-none text-white">%{candidate.report.score}</span>
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uygunluk</span>
                        </div>
                        <p className="mt-8 text-[11px] font-bold text-slate-400 leading-relaxed uppercase">
                           Bu skor; adayın klinik bilgisi, etik duruşu ve kurumsal kültüre olan anlamsal uyumunun AI tarafından ağırlıklandırılmış özetidir.
                        </p>
                      </div>
                      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px]"></div>
                   </div>
                   
                   <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8">Yönetici Özeti</h4>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed italic border-l-4 border-slate-900 pl-6">
                         "{candidate.report.summary}"
                      </p>
                   </div>
                </div>
              </div>
            )}

            {/* TAB 3: PREDİKTİF ANALİZ */}
            {activeTab === 'predictions' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-12 border-l-4 border-orange-600 pl-4">24 AY PROJEKSİYONU</h4>
                    <div className="space-y-10">
                       <PredictBar label="KURUMSAL BAĞLILIK" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-500" />
                       <PredictBar label="TÜKENMİŞLİK RİSKİ" value={candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-500" />
                       <PredictBar label="ÖĞRENME HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-sky-500" />
                       <PredictBar label="LİDERLİK POTANSİYELİ" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-amber-500" />
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-200">
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10">SWOT MATRİSİ</h4>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">GÜÇLÜ YANLAR</span>
                           {candidate.report.swot.strengths.map((s, i) => (
                             <div key={i} className="p-4 bg-white rounded-2xl text-[10px] font-bold text-slate-700 shadow-sm border border-emerald-50">{s}</div>
                           ))}
                        </div>
                        <div className="space-y-3">
                           <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest block">RİSKLER</span>
                           {candidate.report.swot.weaknesses.map((w, i) => (
                             <div key={i} className="p-4 bg-white rounded-2xl text-[10px] font-bold text-slate-700 shadow-sm border border-rose-50">{w}</div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MÜLAKAT STRATEJİSİ */}
            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                   <div className="bg-orange-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-10 opacity-80">KRİTİK MÜLAKAT SORULARI</h4>
                      <div className="space-y-4 relative z-10">
                         {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                           <div key={i} className="p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md group hover:bg-white/20 transition-all">
                              <p className="text-sm font-black leading-relaxed italic">"{q}"</p>
                           </div>
                         ))}
                      </div>
                      <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                   </div>

                   <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8">SİMÜLASYON GÖREVLERİ</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {candidate.report.interviewGuidance.simulationTasks.map((task, i) => (
                           <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold text-slate-600 text-[11px] leading-relaxed relative group">
                              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm mb-4 font-black">#{i+1}</div>
                              {task}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl flex flex-col justify-between">
                   <div>
                      <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-8">KRİTİK GÖZLEM</h4>
                      <div className="space-y-6">
                         {candidate.report.interviewGuidance.criticalObservations.map((obs, i) => (
                           <div key={i} className="flex gap-4 items-start">
                              <div className="w-2 h-2 bg-orange-600 rounded-full mt-1.5 shrink-0"></div>
                              <p className="text-[10px] font-black uppercase tracking-widest leading-tight opacity-80">{obs}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="mt-20 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">NİHAİ TAVSİYE</p>
                      <p className="text-sm font-black text-orange-500 uppercase leading-none">{candidate.report.recommendation}</p>
                   </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-10 bg-white border-t border-slate-100 flex justify-between items-center no-print">
         <button onClick={onDelete} className="px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">SİSTEMDEN SİL</button>
         <button onClick={() => window.print()} className="px-10 py-4 bg-slate-100 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            RAPORU YAZDIR (PDF)
         </button>
      </div>
    </div>
  );
};

export default CandidateDetail;
