
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
      alert("AI Analiz Hatası: Model yoğun, lütfen tekrar deneyin.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col relative flex-1 animate-scale-in">
      {isAnalysing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-20">
           <div className="w-40 h-40 border-[10px] border-orange-600/10 border-t-orange-600 rounded-full animate-spin mb-10 shadow-[0_0_100px_rgba(234,88,12,0.3)]"></div>
           <h3 className="text-4xl font-black text-white uppercase tracking-[0.5em] mb-4">Muhakeme Motoru Aktif</h3>
           <p className="text-orange-500 font-black text-[14px] uppercase tracking-[0.3em] animate-pulse">{analysisPhase}</p>
        </div>
      )}

      {/* HEADER - Dikey padding düşürüldü */}
      <div className="p-8 border-b border-slate-50 flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white rounded-t-[3rem] gap-6">
        <div className="flex gap-8 items-center">
          <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative overflow-hidden shrink-0">
            {candidate.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <StatusBadge status={candidate.status} />
              <div className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">DOSYA: {candidate.id?.toUpperCase()}</div>
              {candidate.report && (
                <div className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase transition-all flex items-center gap-2 ${
                  integrityReport.status === 'valid' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700'
                }`}>
                   VERİ GÜVENLİĞİ: %{integrityReport.score}
                </div>
              )}
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight truncate">{candidate.name}</h2>
            <div className="flex items-center gap-4 mt-2">
               <span className="text-[12px] font-black text-orange-600 uppercase tracking-[0.3em] whitespace-nowrap">{candidate.branch}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{candidate.experienceYears} YIL DENEYİM</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 no-print w-full xl:w-auto">
           <button onClick={handleRunAnalysis} disabled={isAnalysing} className="flex-1 xl:flex-none px-10 py-5 bg-orange-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.1em] hover:bg-slate-900 transition-all shadow-xl whitespace-nowrap">
             {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZİ BAŞLAT'}
           </button>
        </div>
      </div>

      {/* TABS - Daha yaygın mizanpaj */}
      <div className="px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-50 flex gap-4 overflow-x-auto no-print sticky top-0 z-40">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA' },
          { id: 'predictions', label: 'PERFORMANS PROJEKSİYONU' },
          { id: 'strategy', label: 'KARAR REHBERİ' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border ${activeTab === t.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA - Yayılmış gridler */}
      <div className="p-8 md:p-12 bg-[#FAFAFA] flex-1">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-40">
             <h3 className="text-2xl font-black uppercase tracking-[0.6em] text-slate-400">Veri İşleniyor</h3>
          </div>
        ) : (
          <div className="max-w-full space-y-16 animate-fade-in pb-20">
            
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3">
                  {segments.map(s => (
                    <button 
                      key={s.key} 
                      onClick={() => setSelectedSegment(s.key)}
                      className={`w-full p-6 rounded-2xl border transition-all text-left group flex justify-between items-center ${
                        selectedSegment === s.key ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.03] z-10' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-300'
                      }`}
                    >
                      <h5 className="text-[10px] font-black uppercase tracking-[0.1em]">{s.label}</h5>
                      <span className={`text-xl font-black ${selectedSegment === s.key ? 'text-orange-500' : 'text-slate-900'}`}>%{candidate.report?.deepAnalysis?.[s.key]?.score || 0}</span>
                    </button>
                  ))}
                </div>

                <div className="xl:col-span-8 h-full">
                  {currentData && (
                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl border border-slate-100 sticky top-24 animate-slide-up h-fit">
                       <div className="flex justify-between items-start mb-10">
                          <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-[10px] border-orange-600 pl-6 leading-none pt-1">NEDENSEL ANALİZ</h4>
                          <span className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{selectedSegment?.toUpperCase()}</span>
                       </div>
                       
                       <div className="space-y-12">
                          <div className="p-8 bg-orange-50 rounded-[3rem] border border-orange-100 relative">
                             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Gözlem & Muhakeme</p>
                             <p className="text-xl font-bold text-slate-800 leading-relaxed italic">
                                "{currentData.reasoning || 'Yorum üretiliyor...'}"
                             </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-6">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Klinik Emareler</span>
                                <div className="space-y-2">
                                   {(currentData.behavioralIndicators || []).map((item, i) => (
                                      <div key={i} className="flex gap-4 items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                         <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
                                         <p className="text-[11px] font-bold text-slate-600 uppercase leading-tight">{item}</p>
                                      </div>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-6">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Akademik Projeksiyon</span>
                                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                                   <p className="text-[12px] font-bold text-slate-300 leading-relaxed italic opacity-90">
                                      "{currentData.institutionalImpact || 'Etki analizi beklemede.'}"
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
              <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8">
                <div className="2xl:col-span-12 bg-slate-900 p-12 md:p-16 rounded-[4rem] shadow-2xl text-white relative overflow-hidden min-h-[500px] flex items-center">
                   <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-16 w-full">
                      <div className="space-y-10">
                         <h4 className="text-[13px] font-black text-orange-500 uppercase tracking-[0.5em] border-b border-white/10 pb-6">GELİŞİM VE EVRİM TAHMİNİ</h4>
                         <p className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tighter uppercase italic">
                           "{candidate.report.detailedAnalysisNarrative}"
                         </p>
                         <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 max-w-2xl">
                            <span className="text-[10px] font-black text-orange-500 uppercase block mb-4 tracking-widest">24 AY PROJEKSİYONU</span>
                            <p className="text-lg font-bold text-slate-300 leading-relaxed italic">"{candidate.report.predictiveMetrics.evolutionPath}"</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-400" />
                        <PredictBar label="ÖĞRENME HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-400" />
                        <PredictBar label="STRES DİRENCİ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-400" />
                        <PredictBar label="LİDERLİK" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-orange-400" />
                      </div>
                   </div>
                   <div className="absolute -right-40 -bottom-40 w-[60rem] h-[60rem] bg-orange-600/5 rounded-full blur-[200px]"></div>
                </div>
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8 items-stretch">
                 <div className="2xl:col-span-8 bg-white p-8 md:p-12 rounded-[4rem] border border-slate-100 shadow-xl h-[700px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={3} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                          <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.15} strokeWidth={5} dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} />
                          <Tooltip contentStyle={{borderRadius: '20px', border:'none', boxShadow:'0 20px 40px rgba(0,0,0,0.1)', padding:'15px'}} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="2xl:col-span-4 flex flex-col gap-6">
                    <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl flex-1 flex flex-col justify-center">
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-10 border-b border-white/5 pb-4">BÜTÜNLÜK PARAMETRELERİ</span>
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <p className="text-5xl font-black leading-none">%{candidate.report?.integrityIndex || 0}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase mt-4 tracking-widest leading-tight">ŞEFFAFLIK<br/>DÜZEYİ</p>
                          </div>
                          <div>
                             <p className="text-5xl font-black leading-none">%{candidate.report?.socialMaskingScore || 0}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase mt-4 tracking-widest leading-tight">SOSYAL<br/>MASKELEME</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-10 bg-orange-600 rounded-[3rem] text-white shadow-2xl">
                       <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-70">AKADEMİK SONUÇ</h5>
                       <p className="text-[18px] font-bold leading-relaxed italic">"{candidate.report?.summary || 'Analiz özeti beklemede.'}"</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8">
                 <div className="2xl:col-span-8 space-y-8">
                    <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-xl border border-slate-100">
                       <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] mb-12 border-l-[12px] border-orange-600 pl-8 leading-none">ÖZEL MÜLAKAT PROTOKOLÜ</h4>
                       <div className="grid grid-cols-1 gap-6">
                          {(candidate.report?.interviewGuidance?.strategicQuestions || []).map((q, i) => (
                            <div key={i} className="group p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-orange-500 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                               <div className="flex gap-8 items-start">
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 font-black text-xl shadow-lg group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                                     {i + 1}
                                  </div>
                                  <p className="text-xl font-black text-slate-800 leading-snug italic uppercase tracking-tighter">"{q}"</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="2xl:col-span-4 space-y-6">
                    <div className="p-12 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                       <h5 className="text-[11px] font-black uppercase tracking-[0.5em] mb-10 text-orange-500 border-b border-white/5 pb-4">KRİTİK GÖZLEM ODAĞI</h5>
                       <ul className="space-y-8 relative z-10">
                          {(candidate.report?.interviewGuidance?.criticalObservations || []).map((obs, i) => (
                            <li key={i} className="flex gap-5 items-start">
                               <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center font-black text-[12px] shrink-0 shadow-lg">!</div>
                               <p className="text-[13px] font-black uppercase tracking-widest leading-snug text-slate-300">{obs}</p>
                            </li>
                          ))}
                       </ul>
                       <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                    </div>
                    <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                       <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4">AI KARAR DESTEĞİ</h5>
                       <p className="text-[12px] font-bold text-emerald-800 leading-relaxed uppercase">
                         Bu aday için hazırlanan sorular, nöral sapmaları (contradictions) minimize etmek ve metodolojik dürüstlüğü test etmek amacıyla Gemini-3 motoru tarafından özel olarak kurgulanmıştır.
                       </p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-50 flex flex-col md:flex-row justify-between items-center rounded-b-[3rem] gap-6 no-print">
         <div className="flex gap-4 w-full md:w-auto">
            <button onClick={onDelete} className="flex-1 md:flex-none px-8 py-4 text-rose-500 text-[10px] font-black uppercase hover:bg-rose-50 rounded-xl border border-rose-100 transition-all">SİSTEMDEN KALDIR</button>
            <button className="flex-1 md:flex-none px-8 py-4 text-slate-400 text-[10px] font-black uppercase hover:bg-slate-50 rounded-xl border border-slate-100 transition-all">ARŞİVLE</button>
         </div>
         <button 
           onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
             showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'RESMİ AKADEMİK ANALİZ RAPORU'
           })} 
           className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase shadow-3xl hover:bg-black transition-all"
         >
           TAM ANALİZ RAPORUNU PDF OLARAK AL
         </button>
      </div>
    </div>
  );
};

export default CandidateDetail;
