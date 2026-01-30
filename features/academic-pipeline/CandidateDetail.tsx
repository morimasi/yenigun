
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
  const segments = useMemo(() => [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'technicalExpertise', label: 'KLİNİK BİLGİ' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'developmentOpenness', label: 'GELİŞİME AÇIKLIK' }
  ], []);

  // Analiz bittiğinde otomatik segment seçimi
  useEffect(() => {
    if (candidate.report?.deepAnalysis && !selectedSegment) {
      setSelectedSegment('workEthics');
    }
  }, [candidate.report, selectedSegment]);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return segments.map(s => ({ subject: s.label, value: da[s.key]?.score || 0 }));
  }, [candidate, segments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      
      onUpdate({ 
        ...candidate, 
        report: aiReport, 
        algoReport: algoReport, 
        timestamp: Date.now() 
      });
      setSelectedSegment('workEthics');
    } catch (e: any) { 
      alert("Muhakeme motoru yanıt vermedi. Lütfen tekrar deneyiniz."); 
    } finally { 
      setIsAnalysing(false); 
    }
  };

  const handleDecision = async (decision: 'hired' | 'rejected') => {
    if (!confirm(decision === 'hired' ? "Personel olarak atanacak?" : "Arşive kaldırılacak?")) return;
    onUpdate({
      ...candidate,
      status: decision === 'hired' ? 'hired' : 'rejected',
      timestamp: Date.now()
    });
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* HEADER */}
      <div className="h-[60px] border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4 overflow-hidden">
            <div className={`w-2.5 h-2.5 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight whitespace-nowrap">{candidate.name}</h2>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
               <span className="text-orange-700">{candidate.branch}</span>
               <span>•</span>
               <span>{candidate.experienceYears} Yıl</span>
            </div>
         </div>

         <div className="flex items-center gap-2 shrink-0">
            {candidate.report && candidate.report.score > 0 && (
               <div className="mr-3 text-right hidden md:block">
                  <span className="text-[10px] font-black text-emerald-600 block leading-none">%{candidate.report.score}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">LİYAKAT</span>
               </div>
            )}
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                 isAnalysing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-orange-600'
               }`}
            >
               {isAnalysing ? 'MUHAKEME AKTİF...' : 'ANALİZİ TETİKLE'}
            </button>
            <div className="flex bg-slate-100 p-0.5 rounded-lg ml-2">
               <button onClick={() => handleDecision('hired')} className="px-3 py-1.5 text-[9px] font-black uppercase rounded-md text-slate-600 hover:bg-white hover:text-emerald-600 transition-all">ATA</button>
               <button onClick={() => handleDecision('rejected')} className="px-3 py-1.5 text-[9px] font-black uppercase rounded-md text-slate-600 hover:bg-white hover:text-rose-600 transition-all">RED</button>
            </div>
         </div>
      </div>

      {/* TABS */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
         {[
           { id: 'matrix', label: 'MATRİS (DERİN OKUMA)' }, 
           { id: 'dna', label: 'SPEKTRUM & MİZAÇ' }, 
           { id: 'predictions', label: 'PROJEKSİYON' }, 
           { id: 'strategy', label: 'STRATEJİ' }
         ].map(t => (
            <button 
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded transition-all ${activeTab === t.id ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
               {t.label}
            </button>
         ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
         {!candidate.report || !candidate.report.deepAnalysis ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
               <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-4 animate-pulse"></div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {isAnalysing ? 'Muhakeme Motoru Veri İşliyor...' : 'Aday Analizi Bekleniyor'}
               </p>
            </div>
         ) : (
            <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
               
               {activeTab === 'matrix' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                     <div className="md:col-span-3 space-y-1">
                        {segments.map(s => {
                           const score = candidate.report?.deepAnalysis?.[s.key]?.score || 0;
                           const isSelected = selectedSegment === s.key;
                           return (
                             <button 
                                key={s.key} 
                                onClick={() => setSelectedSegment(s.key)}
                                className={`w-full p-4 rounded-xl border text-left transition-all relative ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'}`}
                             >
                                <span className={`text-[10px] font-black uppercase block ${isSelected ? 'text-orange-500' : 'text-slate-400'}`}>{s.label}</span>
                                <span className="text-lg font-black mt-1">%{score}</span>
                                {isSelected && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-l-full"></div>}
                             </button>
                           );
                        })}
                     </div>
                     
                     <div className="md:col-span-9 space-y-6">
                        {currentData ? (
                           <div className="space-y-6 animate-slide-up">
                              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-2 h-full bg-slate-900"></div>
                                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4">KLİNİK NEDENSELLİK (ROOT CAUSE)</h4>
                                 <p className="text-[13px] font-medium text-slate-700 leading-relaxed text-justify">"{currentData.reasoning || 'Veri bulunamadı.'}"</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                                    <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">MİKRO-DAVRANIŞLAR</h5>
                                    <ul className="space-y-2">
                                       {(currentData.behavioralIndicators || []).map((b: string, i: number) => (
                                          <li key={i} className="flex gap-3 items-start text-[11px] font-bold text-slate-700 leading-tight">
                                             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                                             {b}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                                    <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">KURUMSAL ETKİ</h5>
                                    <p className="text-[12px] font-medium text-slate-300 leading-relaxed">{currentData.institutionalImpact || 'Etki analizi yapılamadı.'}</p>
                                 </div>
                              </div>
                           </div>
                        ) : (
                          <div className="p-20 text-center opacity-20 uppercase font-black text-slate-400 tracking-widest">Kategori Seçiniz</div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={radarData} outerRadius="80%">
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                              <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.25} strokeWidth={3} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                           <div className="flex justify-between items-end mb-6">
                              <div>
                                 <p className="text-5xl font-black">%{candidate.report.integrityIndex || 0}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">DÜRÜSTLÜK ENDEKSİ</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-5xl font-black text-orange-500">%{candidate.report.socialMaskingScore || 0}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">SOSYAL MASKELEME</p>
                              </div>
                           </div>
                           <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-600" style={{ width: `${candidate.report.integrityIndex || 0}%` }}></div>
                           </div>
                        </div>
                        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200">
                           <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">ÖZET KARAKTER ANALİZİ</h4>
                           <p className="text-[13px] font-medium text-slate-600 leading-relaxed text-justify">{candidate.report.detailedAnalysisNarrative || 'Analiz metni oluşturulamadı.'}</p>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'predictions' && (
                  <div className="space-y-8">
                     <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">24 AYLIK EVRİM YOLU</h4>
                        <p className="text-xl md:text-2xl font-black leading-snug italic tracking-tight">"{candidate.report.predictiveMetrics?.evolutionPath || 'Projeksiyon verisi işlenemedi.'}"</p>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]"></div>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" />
                        <PredictBar label="ÖĞRENME" value={candidate.report.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" />
                        <PredictBar label="DİRENÇ" value={100 - (candidate.report.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" />
                        <PredictBar label="LİDERLİK" value={candidate.report.predictiveMetrics?.leadershipPotential || 0} color="text-orange-600" />
                     </div>
                  </div>
               )}

               {activeTab === 'strategy' && (
                  <div className="space-y-8 animate-fade-in">
                     <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-orange-600 pl-4">STRATEJİK MÜLAKAT REHBERİ</h4>
                        <div className="space-y-6">
                           {(candidate.report.interviewGuidance?.strategicQuestions || []).map((q, i) => (
                              <div key={i} className="flex gap-6 items-start group p-4 hover:bg-slate-50 rounded-2xl transition-all">
                                 <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 group-hover:bg-orange-600 transition-colors">{i+1}</span>
                                 <p className="text-[14px] font-bold text-slate-800 italic leading-snug">"{q}"</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

            </div>
         )}
      </div>
    </div>
  );
};

export default CandidateDetail;
