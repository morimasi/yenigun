
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig, ArchiveCategory } from '../../types';
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
  
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveForm, setArchiveForm] = useState<{ category: ArchiveCategory, note: string }>({
    category: 'FUTURE_REFERENCE',
    note: ''
  });

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
      setSelectedSegment('workEthics');
    }
  }, [candidate.report]);

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
    const phases = ['Veri Paketleri Çözülüyor...', 'Gemini-3 Nöral Muhakeme...', 'Nedensellik Bağı Kuruluyor...'];
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

  const handleArchiveSubmit = () => {
    onUpdate({
      ...candidate,
      status: 'archived',
      archiveCategory: archiveForm.category,
      archiveNote: archiveForm.note,
      timestamp: Date.now()
    });
    setIsArchiveModalOpen(false);
    alert("Aday akademik arşive mühürlendi.");
  };

  const currentData = selectedSegment ? candidate.report?.deepAnalysis?.[selectedSegment] : null;

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-none border-0 flex flex-col relative w-full h-full flex-1">
      {isAnalysing && (
        <div className="fixed inset-0 z-[110] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-20">
           <div className="w-40 h-40 border-[10px] border-orange-600/10 border-t-orange-600 rounded-full animate-spin mb-10"></div>
           <h3 className="text-4xl font-black text-white uppercase tracking-[0.5em] mb-4">Analiz Motoru Aktif</h3>
           <p className="text-orange-500 font-black text-[14px] uppercase tracking-[0.3em] animate-pulse">{analysisPhase}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="p-4 md:p-8 border-b border-slate-50 flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white rounded-t-[3rem] gap-6">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0">
            {candidate.name?.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <StatusBadge status={candidate.status} />
              <div className="px-2 py-1 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">REF: {candidate.id?.toUpperCase()}</div>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">{candidate.name}</h2>
            <div className="flex items-center gap-4">
               <span className="text-[11px] font-black text-orange-600 uppercase tracking-[0.3em]">{candidate.branch}</span>
               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{candidate.experienceYears} Yıllık Deneyim</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 no-print w-full xl:w-auto">
           <button onClick={handleRunAnalysis} disabled={isAnalysing} className="flex-1 xl:flex-none px-8 py-4 bg-orange-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.1em] hover:bg-slate-900 transition-all shadow-lg active:scale-95">
             {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZİ BAŞLAT'}
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="px-4 md:px-8 py-3 bg-white/95 backdrop-blur-xl border-b border-slate-50 flex gap-3 overflow-x-auto no-print sticky top-[10.5rem] z-40 no-scrollbar shadow-sm">
        {[
          { id: 'matrix', label: 'MATRİS' },
          { id: 'dna', label: 'SPEKTRUM' },
          { id: 'predictions', label: 'PROJEKSİYON' },
          { id: 'strategy', label: 'STRATEJİ' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border whitespace-nowrap ${activeTab === t.id ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 md:p-10 bg-[#FAFAFA] flex-1 w-full rounded-b-[3rem]">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-40">
             <h3 className="text-xl font-black uppercase tracking-[0.6em] text-slate-400">Veri Bekleniyor</h3>
          </div>
        ) : (
          <div className="w-full space-y-12 animate-fade-in pb-20">
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-2">
                  {segments.map(s => (
                    <button 
                      key={s.key} 
                      onClick={() => setSelectedSegment(s.key)}
                      className={`w-full p-4 rounded-xl border transition-all text-left group flex justify-between items-center ${
                        selectedSegment === s.key ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02] z-10' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-400'
                      }`}
                    >
                      <h5 className="text-[10px] font-black uppercase tracking-[0.1em]">{s.label}</h5>
                      <span className={`text-lg font-black ${selectedSegment === s.key ? 'text-orange-500' : 'text-slate-900'}`}>%{candidate.report?.deepAnalysis?.[s.key]?.score || 0}</span>
                    </button>
                  ))}
                </div>
                <div className="xl:col-span-9">
                  {currentData && (
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 sticky top-[15rem] animate-slide-up">
                       <div className="flex justify-between items-start mb-8">
                          <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.6em] border-l-[10px] border-orange-600 pl-6 leading-none py-2">NEDENSEL ANALİZ</h4>
                          <span className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{selectedSegment?.toUpperCase()}</span>
                       </div>
                       <div className="space-y-10">
                          <div className="p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100 relative group overflow-hidden">
                             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Gözlem & Muhakeme</p>
                             <p className="text-xl md:text-3xl font-bold text-slate-800 leading-tight italic tracking-tight">"{currentData.reasoning || 'Yorum üretiliyor...'}"</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Klinik Emareler</span>
                                <div className="space-y-2">
                                   {(currentData.behavioralIndicators || []).map((item, i) => (
                                      <div key={i} className="flex gap-4 items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white transition-all">
                                         <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
                                         <p className="text-[11px] font-bold text-slate-600 uppercase leading-tight tracking-tight">{item}</p>
                                      </div>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kurumsal Etki</span>
                                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-xl h-full flex items-center">
                                   <p className="text-[14px] font-bold text-slate-300 leading-relaxed italic opacity-95">"{currentData.institutionalImpact || 'Etki analizi beklemede.'}"</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'dna' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch w-full">
                 <div className="xl:col-span-8 bg-white p-8 rounded-[4rem] border border-slate-100 shadow-2xl h-[700px] relative overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                          <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.15} strokeWidth={6} dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} />
                          <Tooltip contentStyle={{borderRadius: '20px', border:'none', boxShadow:'0 20px 40px rgba(0,0,0,0.1)', padding:'20px', fontSize:'12px'}} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden group">
                       <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em] block mb-8 border-b border-white/5 pb-4">GÜVEN VE DOĞRULUK</span>
                       <div className="grid grid-cols-1 gap-10">
                          <div className="space-y-2">
                             <p className="text-6xl font-black leading-none tracking-tighter">%{candidate.report?.integrityIndex || 0}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight opacity-70">ŞEFFAFLIK</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-6xl font-black leading-none tracking-tighter">%{candidate.report?.socialMaskingScore || 0}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight opacity-70">MASKELEME</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-8 bg-orange-600 rounded-[3rem] text-white shadow-2xl relative group">
                       <h5 className="text-[11px] font-black uppercase tracking-[0.5em] mb-4 opacity-80">BİLEŞKE KARAR</h5>
                       <p className="text-[18px] font-bold leading-snug italic tracking-tight">"{candidate.report?.summary || 'Analiz özeti beklemede.'}"</p>
                    </div>
                 </div>
              </div>
            )}
            {activeTab === 'predictions' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-12 bg-slate-900 p-10 md:p-16 rounded-[4rem] shadow-3xl text-white relative overflow-hidden min-h-[500px] flex items-center border border-white/5">
                   <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-16 w-full items-center">
                      <div className="space-y-8">
                         <h4 className="text-[14px] font-black text-orange-500 uppercase tracking-[0.6em] border-b border-white/10 pb-6">PROFESYONEL EVRİM</h4>
                         <p className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter uppercase italic">"{candidate.report.detailedAnalysisNarrative}"</p>
                         <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 max-w-2xl backdrop-blur-md">
                            <span className="text-[10px] font-black text-orange-500 uppercase block mb-4 tracking-[0.3em]">24 AY PROJEKSİYONU</span>
                            <p className="text-xl font-bold text-slate-300 leading-relaxed italic opacity-90">"{candidate.report.predictiveMetrics.evolutionPath}"</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PredictBar label="SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-400" />
                        <PredictBar label="ÖĞRENME" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-400" />
                        <PredictBar label="DİRENÇ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-400" />
                        <PredictBar label="LİDERLİK" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-orange-400" />
                      </div>
                   </div>
                   <div className="absolute -right-40 -bottom-40 w-[60rem] h-[60rem] bg-orange-600/5 rounded-full blur-[200px] pointer-events-none"></div>
                </div>
              </div>
            )}
            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                 <div className="xl:col-span-8 space-y-10">
                    <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                       <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-[0.6em] mb-12 border-l-[12px] border-orange-600 pl-8 leading-none">MÜLAKAT PROTOKOLÜ</h4>
                       <div className="grid grid-cols-1 gap-6">
                          {(candidate.report?.interviewGuidance?.strategicQuestions || []).map((q, i) => (
                            <div key={i} className="group p-8 md:p-10 bg-slate-50 rounded-[3rem] border-2 border-transparent hover:border-orange-500 hover:bg-white transition-all duration-700 shadow-sm">
                               <div className="flex gap-8 items-start">
                                  <div className="w-12 h-12 bg-white rounded-[1.5rem] flex items-center justify-center text-orange-600 font-black text-xl shadow-xl group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                                     {i + 1}
                                  </div>
                                  <p className="text-xl md:text-2xl font-black text-slate-800 leading-snug italic uppercase tracking-tighter">"{q}"</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="xl:col-span-4 space-y-6">
                    <div className="p-12 bg-slate-900 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border border-white/5">
                       <h5 className="text-[11px] font-black uppercase tracking-[0.5em] mb-10 text-orange-500 border-b border-white/5 pb-4">GÖZLEM ODAĞI</h5>
                       <ul className="space-y-10 relative z-10">
                          {(candidate.report?.interviewGuidance?.criticalObservations || []).map((obs, i) => (
                            <li key={i} className="flex gap-6 items-start group/li">
                               <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center font-black text-[12px] shrink-0 shadow-2xl">!</div>
                               <p className="text-[14px] font-black uppercase tracking-widest leading-snug text-slate-300 group-hover/li:text-white transition-colors">{obs}</p>
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-10 bg-emerald-50 rounded-[3rem] border-2 border-emerald-100 shadow-xl relative group overflow-hidden">
                       <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">AI KARAR DESTEĞİ</h5>
                       <p className="text-[13px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tight relative z-10 italic">Bu aday için kurgulanan sorular, nöral sapmaları minimize etmek amacıyla Gemini-3 motoru tarafından özel olarak kurgulanmıştır.</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-8 md:p-12 bg-white border-t border-slate-50 flex flex-col md:flex-row justify-between items-center rounded-b-[3rem] gap-8 no-print">
         <div className="flex gap-4 w-full md:w-auto">
            <button onClick={onDelete} className="flex-1 md:flex-none px-10 py-4 text-rose-500 text-[10px] font-black uppercase hover:bg-rose-50 rounded-[1.5rem] border-2 border-rose-100 transition-all shadow-sm">SİSTEMDEN KALDIR</button>
            <button onClick={() => setIsArchiveModalOpen(true)} className="flex-1 md:flex-none px-10 py-4 text-orange-600 text-[10px] font-black uppercase hover:bg-orange-50 rounded-[1.5rem] border-2 border-orange-100 transition-all">ARŞİVE TAŞI</button>
         </div>
         <button 
           onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
             showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'RESMİ AKADEMİK ANALİZ RAPORU'
           })} 
           className="w-full md:w-auto px-16 py-5 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-3xl hover:bg-black transition-all active:scale-95"
         >
           TAM ANALİZ RAPORUNU PDF OLARAK AL
         </button>
      </div>

      {/* ARCHIVE MODAL */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in no-print">
           <div className="bg-white rounded-[4rem] w-full max-w-lg p-12 shadow-2xl border border-white/20 animate-scale-in">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8">Arşivleme Protokolü</h3>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Arşiv Kategorisi</label>
                    <div className="grid grid-cols-1 gap-2">
                       {[
                         { id: 'TALENT_POOL', label: 'Yetenek Havuzu (Premium)' },
                         { id: 'FUTURE_REFERENCE', label: 'Gelecek Başvuru Dönemi' },
                         { id: 'DISQUALIFIED', label: 'Diskalifiye / Uygun Değil' },
                         { id: 'BLACK_LIST', label: 'Etik Risk / Kara Liste' },
                         { id: 'HIRED_CONTRACTED', label: 'Sözleşmeli / Atanmış' }
                       ].map(cat => (
                         <button 
                           key={cat.id}
                           onClick={() => setArchiveForm({...archiveForm, category: cat.id as ArchiveCategory})}
                           className={`px-6 py-4 rounded-2xl text-[11px] font-bold text-left transition-all border ${archiveForm.category === cat.id ? 'bg-orange-600 border-orange-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                         >
                            {cat.label}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Arşivleme Notu (Opsiyonel)</label>
                    <textarea 
                       className="w-full bg-slate-50 rounded-3xl p-6 border border-slate-100 font-bold text-sm outline-none focus:border-orange-500 transition-all h-32"
                       placeholder="Karar gerekçesini kurumsal bellek için not edin..."
                       value={archiveForm.note}
                       onChange={e => setArchiveForm({...archiveForm, note: e.target.value})}
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsArchiveModalOpen(false)} className="flex-1 py-5 text-slate-400 text-[11px] font-black uppercase tracking-widest">Vazgeç</button>
                    <button onClick={handleArchiveSubmit} className="flex-2 px-10 py-5 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-black">Arşivi Onayla</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
