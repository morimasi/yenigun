import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, IntelligenceSegment } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { exportService } from '../../services/exportService';
import StatusBadge from './StatusBadge';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [analysisPhase, setAnalysisPhase] = useState('');

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
    const phases = ['Nöral Ağlar Kuruluyor...', 'Vaka Analizleri Çapraz Sorgulanıyor...', 'Etik Refleksler Ölçülüyor...', 'Liyakat Skoru Hesaplanıyor...'];
    
    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      setAnalysisPhase(phases[phaseIdx % phases.length]);
      phaseIdx++;
    }, 2000);

    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e) {
      alert("AI Analiz Motoru Hatası: Lütfen sinyalleri kontrol edin.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  const PredictBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="group space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{label}</span>
        <span className={`text-base font-black ${color}`}>%{value}</span>
      </div>
      <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner relative">
        <div className={`h-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')} relative z-10`} style={{ width: `${value}%` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>
        {value > 80 && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>}
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] rounded-[4rem] shadow-2xl border border-white h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {/* ANALYSIS OVERLAY */}
      {isAnalysing && (
        <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-20 animate-fade-in">
           <div className="relative mb-12">
              <div className="w-32 h-32 border-8 border-orange-600/20 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 bg-orange-600 rounded-2xl animate-pulse shadow-2xl shadow-orange-600/50"></div>
              </div>
           </div>
           <h3 className="text-2xl font-black text-white uppercase tracking-[0.5em] mb-4">Liyakat İşleniyor</h3>
           <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest animate-bounce">{analysisPhase}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="p-10 bg-white border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex gap-8 items-center relative z-10">
          <div className="relative group cursor-zoom-in">
            <div className="w-24 h-24 bg-slate-900 rounded-[3rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl transition-all group-hover:rotate-12 group-hover:scale-110">
              {candidate.name.charAt(0)}
            </div>
            {candidate.report && (
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg animate-bounce">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
               </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-4 mb-3">
              <StatusBadge status={candidate.status} />
              <div className="h-1 w-8 bg-slate-100 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">DOSYA: {candidate.id.slice(0, 8)}</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name}</h2>
            <div className="flex items-center gap-3 mt-4">
               <span className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.3em]">{candidate.branch}</span>
               <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{candidate.experienceYears} YIL TECRÜBE</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-5 relative z-10">
          <button 
            onClick={handleRunAnalysis} 
            disabled={isAnalysing} 
            className="group relative px-12 py-6 overflow-hidden bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center gap-3">
               <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
               {isAnalysing ? 'SİNYAL İŞLENİYOR' : 'KLİNİK ANALİZİ BAŞLAT'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="px-10 py-6 bg-white/50 backdrop-blur-xl border-b border-slate-100 flex gap-4 no-print overflow-x-auto custom-scrollbar">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS', icon: 'M4 6h16M4 12h16m-7 6h7' },
          { id: 'dna', label: 'KLİNİK DNA (PARMAK İZİ)', icon: 'M9 12l2 2 4-4' },
          { id: 'predictions', label: 'PREDİKTİF ANALİZ', icon: 'M13 7h8m0 0v8' },
          { id: 'strategy', label: 'MÜLAKAT REHBERİ', icon: 'M8 10h.01' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === t.id ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#FDFDFD]">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-20">
             <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner group">
                <svg className="w-20 h-20 text-slate-200 group-hover:text-orange-200 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
             </div>
             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.6em] mb-6">Analiz Bekleniyor</h3>
             <p className="max-w-md text-[11px] font-bold text-slate-300 uppercase leading-relaxed tracking-widest">Adayın liyakat haritasını ve akademik projeksiyonlarını oluşturmak için yapay zeka motorunu tetikleyin.</p>
          </div>
        ) : (
          <div className="space-y-20 animate-fade-in pb-20">
            
            {/* MATRIX TAB */}
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {Object.entries(candidate.report.deepAnalysis).map(([key, segment]: [string, any]) => (
                  <div key={key} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                      <h5 className="text-[11px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${segment.score > 70 ? 'bg-emerald-50 text-emerald-600' : segment.score > 40 ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'}`}>
                        {segment.score}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[12px] font-bold text-slate-700 leading-tight italic">"{segment.pros[0]}"</p>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${segment.status === 'optimal' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {segment.competencyLevel}
                          </div>
                          {segment.contradictions?.length > 0 && (
                            <div className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                              ANOMALİ TESPİTİ
                            </div>
                          )}
                       </div>
                    </div>
                    {/* Background Subtle Progress */}
                    <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
                       <div className={`h-full ${segment.score > 70 ? 'bg-emerald-500' : segment.score > 40 ? 'bg-orange-500' : 'bg-rose-500'}`} style={{ width: `${segment.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PREDICTIONS TAB */}
            {activeTab === 'predictions' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
                      <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-16">24 AY PROJEKSİYONU</h4>
                      <div className="space-y-12">
                         <PredictBar label="KURUMSAL SADAKAT (RETENTION)" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-500" />
                         <PredictBar label="TÜKENMİŞLİK DİRENCİ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-500" />
                         <PredictBar label="ADAPTASYON & ÖĞRENME HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-sky-500" />
                         <PredictBar label="GELECEK LİDERLİK POTANSİYELİ" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-amber-500" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-8">
                      <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl flex flex-col justify-center">
                         <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">SWOT - GÜÇLÜ KASLAR</h4>
                         <div className="flex flex-wrap gap-3">
                            {candidate.report.swot.strengths.map((s, i) => (
                              <div key={i} className="px-6 py-3 bg-white/10 rounded-2xl text-[11px] font-bold border border-white/10 hover:bg-white/20 transition-all cursor-default">{s}</div>
                            ))}
                         </div>
                      </div>
                      <div className="bg-rose-50 p-12 rounded-[4rem] border-2 border-rose-100 flex flex-col justify-center">
                         <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-6">SWOT - KRİTİK RİSKLER</h4>
                         <div className="flex flex-wrap gap-3">
                            {candidate.report.swot.weaknesses.map((w, i) => (
                              <div key={i} className="px-6 py-3 bg-white rounded-2xl text-[11px] font-bold text-rose-700 shadow-sm border border-rose-100 hover:scale-105 transition-all cursor-alert">{w}</div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* STRATEGY TAB */}
            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-16 rounded-[4.5rem] shadow-2xl border border-slate-100">
                       <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 border-l-8 border-orange-600 pl-6">MÜLAKAT SORU SETİ (AI-BASED)</h4>
                       <div className="space-y-6">
                          {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-slate-900 hover:text-white transition-all duration-500">
                               <div className="flex gap-6 items-start">
                                  <span className="text-2xl font-black opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                                  <p className="text-sm font-black leading-relaxed italic group-hover:translate-x-2 transition-transform">"{q}"</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl">
                       <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-10">KRİTİK GÖZLEM LİSTESİ</h4>
                       <div className="space-y-8">
                          {candidate.report.interviewGuidance.criticalObservations.map((obs, i) => (
                            <div key={i} className="flex gap-5 items-start animate-fade-in" style={{ animationDelay: `${i*100}ms` }}>
                               <div className="w-2.5 h-2.5 bg-orange-600 rounded-full mt-1.5 shrink-0 shadow-[0_0_15px_rgba(234,88,12,0.8)]"></div>
                               <p className="text-[11px] font-black uppercase tracking-widest leading-tight opacity-90">{obs}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="bg-orange-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                       <div className="relative z-10">
                          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-70">SİMÜLASYON GÖREVİ</h4>
                          <p className="text-sm font-black italic leading-relaxed">"{candidate.report.interviewGuidance.simulationTasks[0]}"</p>
                       </div>
                       <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>
                 </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-10 bg-white border-t border-slate-100 flex justify-between items-center no-print sticky bottom-0 z-50">
         <div className="flex gap-4">
            <button onClick={onDelete} className="px-10 py-5 bg-rose-50 text-rose-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">ARŞİVDEN KALDIR</button>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
                showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'RESMİ LİYAKAT VE UYGUNLUK RAPORU' 
              })} 
              className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl flex items-center gap-4"
            >
               <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               OFFICIAL PDF EXPORT
            </button>
         </div>
      </div>
    </div>
  );
};

export default CandidateDetail;