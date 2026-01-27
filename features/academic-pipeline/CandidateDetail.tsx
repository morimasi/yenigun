
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis, verifyCandidateIntegrity } from '../../analysisUtils';
import { exportService } from '../../services/exportService';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import { PredictBar } from '../../shared/ui/PredictBar';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip 
} from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [analysisPhase, setAnalysisPhase] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const integrityReport = useMemo(() => verifyCandidateIntegrity(candidate), [candidate]);

  const segments = useMemo(() => [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'technicalExpertise', label: 'KLİNİK DERİNLİK' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'formality', label: 'RESMİYET' },
    { key: 'developmentOpenness', label: 'GELİŞİM' },
    { key: 'criticismTolerance', label: 'ELEŞTİRİ' },
    { key: 'personality', label: 'KARAKTER' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' }
  ], []);

  // Rapor yüklendiğinde otomatik ilk segmenti seç ve map hatalarını önle
  useEffect(() => {
    if (candidate.report?.deepAnalysis && !selectedSegment) {
      const firstKey = Object.keys(candidate.report.deepAnalysis)[0];
      setSelectedSegment(firstKey || 'workEthics');
    }
  }, [candidate.report, selectedSegment]);

  const radarData = useMemo(() => {
    const report = candidate?.report;
    const deepAnalysis = report?.deepAnalysis;
    if (!deepAnalysis) return [];
    return segments.map(s => ({
      subject: s.label,
      value: deepAnalysis[s.key]?.score || 0
    }));
  }, [candidate, segments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    const phases = ['Nöral Semantik Çözümleme...', 'Klinik Muhakeme Motoru...', 'Nedensellik Bağı Kuruluyor...', 'Gelecek Projeksiyonu...'];
    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      setAnalysisPhase(phases[phaseIdx % phases.length]);
      phaseIdx++;
    }, 2000);

    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e: any) {
      alert("AI Analiz Hatası: Model çok yoğun muhakeme yapıyor, lütfen tekrar deneyin.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="bg-white rounded-[4.5rem] shadow-xl border border-slate-100 flex flex-col relative overflow-hidden animate-scale-in">
      {isAnalysing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-20">
           <div className="w-40 h-40 border-[10px] border-orange-600/10 border-t-orange-600 rounded-full animate-spin mb-10 shadow-[0_0_100px_rgba(234,88,12,0.3)]"></div>
           <h3 className="text-4xl font-black text-white uppercase tracking-[0.5em] mb-4">Muhakeme Motoru Aktif</h3>
           <p className="text-orange-500 font-black text-[14px] uppercase tracking-[0.3em] animate-pulse">{analysisPhase}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-white rounded-t-[4.5rem]">
        <div className="flex gap-10 items-center">
          <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl relative overflow-hidden group">
            {candidate.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-5 mb-4">
              <StatusBadge status={candidate.status} />
              <div className="px-4 py-1.5 bg-slate-50 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">DOSYA: {candidate.id?.toUpperCase()}</div>
              {candidate.report && (
                <div className={`px-5 py-2 rounded-2xl border-2 text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
                  integrityReport.status === 'valid' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700'
                }`}>
                   VERİ GÜVENLİĞİ: %{integrityReport.score}
                </div>
              )}
            </div>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] mb-2">{candidate.name}</h2>
            <div className="flex items-center gap-5 mt-6">
               <span className="text-[14px] font-black text-orange-600 uppercase tracking-[0.4em]">{candidate.branch}</span>
               <div className="w-2 h-2 rounded-full bg-slate-200"></div>
               <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">{candidate.experienceYears} YIL DENEYİM</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 no-print">
           <button onClick={handleRunAnalysis} disabled={isAnalysing} className="px-12 py-6 bg-orange-600 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl">
             {isAnalysing ? 'İŞLENİYOR...' : 'AÇIKLAMALI ANALİZİ BAŞLAT'}
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="px-12 py-6 bg-white border-b border-slate-50 flex gap-6 overflow-x-auto no-print sticky top-28 z-40">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA' },
          { id: 'predictions', label: 'PROJEKSİYON' },
          { id: 'strategy', label: 'KARAR REHBERİ' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${activeTab === t.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 border-slate-100'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-16 bg-[#FAFAFA] min-h-[700px]">
        {!candidate.report ? (
          <div className="h-[400px] flex flex-col items-center justify-center opacity-30 text-center">
             <h3 className="text-3xl font-black uppercase tracking-[0.8em] text-slate-400">Analiz Verisi Bekleniyor</h3>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-24 animate-fade-in">
            
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-4">
                  {segments.map(s => (
                    <button 
                      key={s.key} 
                      onClick={() => setSelectedSegment(s.key)}
                      className={`w-full p-8 rounded-[2.5rem] border transition-all text-left group flex justify-between items-center ${
                        selectedSegment === s.key ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200'
                      }`}
                    >
                      <h5 className="text-[11px] font-black uppercase tracking-[0.2em]">{s.label}</h5>
                      <span className={`text-2xl font-black ${selectedSegment === s.key ? 'text-orange-500' : 'text-slate-900'}`}>%{candidate.report?.deepAnalysis?.[s.key]?.score || 0}</span>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-8">
                  {currentData && (
                    <div className="bg-white p-16 rounded-[5rem] shadow-2xl border border-slate-100 sticky top-48 animate-slide-up h-fit">
                       <div className="flex justify-between items-start mb-12">
                          <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-8 border-orange-600 pl-8">NEDENSEL MUHAKEME</h4>
                          <span className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">{selectedSegment?.toUpperCase()}</span>
                       </div>
                       
                       <div className="space-y-12">
                          <div className="p-10 bg-orange-50 rounded-[3.5rem] border border-orange-100">
                             <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-4">Analiz & Nedenler</span>
                             <p className="text-xl font-bold text-slate-800 leading-relaxed italic relative z-10">
                                "{currentData.reasoning || 'Veri işlenemedi.'}"
                             </p>
                          </div>

                          <div className="grid grid-cols-2 gap-10">
                             <div className="space-y-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Gözlemlenen Emareler</span>
                                <div className="space-y-3">
                                   {(currentData.behavioralIndicators || []).map((item, i) => (
                                      <div key={i} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                         <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
                                         <p className="text-[11px] font-bold text-slate-600 uppercase leading-tight">{item}</p>
                                      </div>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Kurumsal Etki (12 Ay)</span>
                                <div className="p-8 bg-slate-900 rounded-[3rem] text-white">
                                   <p className="text-[12px] font-bold text-slate-300 leading-relaxed italic">
                                      "{currentData.institutionalImpact || 'Etki simülasyonu henüz hazır değil.'}"
                                   </p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="space-y-12">
                <div className="bg-slate-900 p-20 rounded-[5.5rem] shadow-2xl text-white relative overflow-hidden">
                   <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-12">
                         <h4 className="text-[14px] font-black text-orange-500 uppercase tracking-[0.5em] border-b border-white/10 pb-6">GELİŞİM PROJEKSİYONU</h4>
                         <p className="text-4xl font-black leading-tight tracking-tighter uppercase italic">
                           "{candidate.report.detailedAnalysisNarrative}"
                         </p>
                         <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10">
                            <span className="text-[11px] font-black text-orange-500 uppercase block mb-4">2. Yıl Evrim Tahmini</span>
                            <p className="text-xl font-bold text-slate-300 leading-relaxed italic">"{candidate.report.predictiveMetrics.evolutionPath}"</p>
                         </div>
                      </div>
                      <div className="space-y-8">
                        <PredictBar label="SADAKAT (RETENTION)" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-400" />
                        <PredictBar label="ADAPTASYON HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-400" />
                        <PredictBar label="BURNOUT DİRENCİ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-400" />
                        <PredictBar label="LİDERLİK POTANSİYELİ" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-orange-400" />
                      </div>
                   </div>
                   <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]"></div>
                </div>
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 h-[650px] bg-white p-16 rounded-[5rem] border border-slate-100 shadow-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={3} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} />
                          <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.1} strokeWidth={6} dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="lg:col-span-4 space-y-8">
                    <div className="p-12 bg-slate-900 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                       <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-10">BÜTÜNLÜK ENDEKSİ</span>
                       <div className="space-y-12">
                          <div>
                             <p className="text-6xl font-black leading-none">%{candidate.report?.integrityIndex || 0}</p>
                             <p className="text-[11px] font-bold text-slate-400 uppercase mt-4 tracking-widest">Şeffaflık Puanı</p>
                          </div>
                          <div>
                             <p className="text-6xl font-black leading-none">%{candidate.report?.socialMaskingScore || 0}</p>
                             <p className="text-[11px] font-bold text-slate-400 uppercase mt-4 tracking-widest">Sosyal Maskeleme</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-12 bg-orange-600 rounded-[4rem] text-white shadow-2xl">
                       <h5 className="text-[11px] font-black uppercase tracking-[0.4em] mb-6">ÖZET KARAR</h5>
                       <p className="text-[18px] font-bold leading-relaxed italic">"{candidate.report?.summary || 'Rapor özeti hazır değil.'}"</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                 <div className="lg:col-span-8 space-y-16">
                    <div className="bg-white p-20 rounded-[5rem] shadow-2xl border border-slate-100">
                       <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-[0.6em] mb-20 border-l-[12px] border-orange-600 pl-10">STRATEJİK MÜLAKAT SORULARI</h4>
                       <div className="space-y-10">
                          {(candidate.report?.interviewGuidance?.strategicQuestions || []).map((q, i) => (
                            <div key={i} className="group p-12 bg-slate-50 rounded-[4rem] border-2 border-transparent hover:border-orange-500 hover:bg-white transition-all duration-700">
                               <div className="flex gap-10">
                                  <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-orange-600 font-black text-2xl shadow-xl group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                                     {i + 1}
                                  </div>
                                  <p className="text-2xl font-black text-slate-800 leading-tight italic">"{q}"</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="lg:col-span-4 space-y-10">
                    <div className="p-16 bg-slate-900 rounded-[5rem] text-white shadow-2xl">
                       <h5 className="text-[12px] font-black uppercase tracking-[0.5em] mb-12 text-orange-500">KRİTİK GÖZLEM ODAĞI</h5>
                       <ul className="space-y-10">
                          {(candidate.report?.interviewGuidance?.criticalObservations || []).map((obs, i) => (
                            <li key={i} className="flex gap-6 items-start">
                               <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center font-black text-[14px] shrink-0 border border-white/10">!</div>
                               <p className="text-[15px] font-black uppercase tracking-widest leading-snug text-slate-300">{obs}</p>
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-12 bg-white border-t border-slate-50 flex justify-between items-center rounded-b-[4.5rem] no-print">
         <button onClick={onDelete} className="px-12 py-6 text-rose-500 text-[12px] font-black uppercase hover:bg-rose-50 rounded-[2rem]">SİSTEMDEN KALDIR</button>
         <button 
           onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
             showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'RESMİ AKADEMİK ANALİZ RAPORU'
           })} 
           className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] text-[12px] font-black uppercase shadow-3xl hover:bg-black transition-all"
         >
           TAM RAPORU PDF OLARAK AL
         </button>
      </div>
    </div>
  );
};

export default CandidateDetail;
