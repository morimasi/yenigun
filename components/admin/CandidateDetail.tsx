
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis, verifyCandidateIntegrity } from '../../analysisUtils';
import { exportService } from '../../services/exportService';
import StatusBadge from './StatusBadge';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip 
} from 'recharts';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [analysisPhase, setAnalysisPhase] = useState('');
  
  const [isInviting, setIsInviting] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    method: 'Yüz Yüze Görüşme',
    location: config.institutionName + ' Merkez Yerleşkesi'
  });

  const integrityReport = useMemo(() => {
    try {
      return verifyCandidateIntegrity(candidate);
    } catch (e) {
      return { score: 0, issues: ["Sistemik veri ayrıştırma hatası."], status: 'compromised' as const };
    }
  }, [candidate]);

  const segments = useMemo(() => [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'parentStudentRelations', label: 'VELİ DİNAMİĞİ' },
    { key: 'formality', label: 'RESMİYET' },
    { key: 'developmentOpenness', label: 'GELİŞİM' },
    { key: 'sustainability', label: 'DİRENÇ (BURNOUT)' },
    { key: 'technicalExpertise', label: 'ALAN YETERLİLİĞİ' },
    { key: 'criticismTolerance', label: 'ELEŞTİRİ' },
    { key: 'personality', label: 'KARAKTER' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' }
  ], []);

  const radarData = useMemo(() => {
    const report = candidate?.report;
    const deepAnalysis = report?.deepAnalysis;
    if (!deepAnalysis || typeof deepAnalysis !== 'object') return [];
    
    return segments.map(s => ({
      subject: s.label,
      value: (deepAnalysis[s.key] && typeof deepAnalysis[s.key].score === 'number') ? deepAnalysis[s.key].score : 0
    }));
  }, [candidate, segments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    const phases = ['Veri Paketleri Çözülüyor...', 'Gemini-3 Nöral Muhakeme...', 'Dahili Bütünlük Denetimi...', 'Stratejik Karar Üretiliyor...'];
    
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
      alert("AI Hata: Analiz motoru şu an meşgul.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  const handleSendInvitation = async () => {
    if (!confirm(`${candidate.name} adına mülakat daveti gönderilecek. Onaylıyor musunuz?`)) return;
    setIsInviting(true);
    try {
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: candidate.email,
          candidateName: candidate.name,
          date: scheduleData.date,
          time: scheduleData.time,
          location: scheduleData.location
        })
      });
      if (!emailRes.ok) throw new Error("İletişim hatası.");
      onUpdate({ ...candidate, status: 'interview_scheduled', interviewSchedule: { ...scheduleData }, timestamp: Date.now() });
      alert("Davet gönderildi.");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const PredictBar = ({ label, value, color, description }: { label: string, value: number, color: string, description?: string }) => (
    <div className="group space-y-4 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-end">
        <div>
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{label}</span>
           {description && <span className="text-[10px] font-bold text-slate-300 uppercase leading-none">{description}</span>}
        </div>
        <span className={`text-4xl font-black ${color}`}>%{value || 0}</span>
      </div>
      <div className="h-3.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
        <div className={`h-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')}`} style={{ width: `${value || 0}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[4.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col animate-scale-in relative">
      
      {isAnalysing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-20">
           <div className="relative mb-16">
              <div className="w-40 h-40 border-[10px] border-orange-600/10 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-orange-600 rounded-[2rem] animate-pulse shadow-[0_0_80px_rgba(234,88,12,0.4)]"></div>
              </div>
           </div>
           <h3 className="text-4xl font-black text-white uppercase tracking-[0.5em] mb-6">Muhakeme Motoru Aktif</h3>
           <p className="text-orange-500 font-black text-[14px] uppercase tracking-[0.3em] animate-bounce">{analysisPhase}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="p-12 bg-white border-b border-slate-50 flex justify-between items-center relative z-40 rounded-t-[4.5rem]">
        <div className="flex gap-10 items-center">
          <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl relative overflow-hidden group">
            {candidate.name?.charAt(0)}
            <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <div>
            <div className="flex items-center gap-5 mb-4">
              <StatusBadge status={candidate.status} />
              <div className="px-4 py-1.5 bg-slate-50 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">KLİNİK DOSYA: {candidate.id?.toUpperCase()}</div>
              
              {candidate.report && (
                <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  integrityReport.status === 'valid' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 
                  integrityReport.status === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-700' : 
                  'bg-rose-50 border-rose-500 text-rose-700'
                }`}>
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                   VERİ GÜVENLİĞİ: %{integrityReport.score}
                </div>
              )}
            </div>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] mb-2">{candidate.name}</h2>
            <div className="flex items-center gap-5 mt-6">
               <span className="text-[14px] font-black text-orange-600 uppercase tracking-[0.4em]">{candidate.branch}</span>
               <div className="w-2 h-2 rounded-full bg-slate-200"></div>
               <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">{candidate.experienceYears} YIL SAHA DENEYİMİ</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 no-print">
           <button 
             onClick={handleRunAnalysis} 
             disabled={isAnalysing} 
             className="px-12 py-6 bg-orange-600 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl shadow-orange-600/20 active:scale-95"
           >
             {isAnalysing ? 'ANALİZ EDİLİYOR...' : 'ANALİZİ BAŞLAT'}
           </button>
        </div>
      </div>

      {/* INTEGRITY ALERTS */}
      {candidate.report && integrityReport.status !== 'valid' && (
        <div className={`mx-12 mt-8 p-10 rounded-[3rem] border-4 flex items-center gap-8 animate-fade-in ${
          integrityReport.status === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'
        }`}>
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 ${integrityReport.status === 'warning' ? 'bg-amber-600' : 'bg-rose-600'} text-white shadow-2xl shadow-rose-600/20`}>
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <h4 className={`text-[16px] font-black uppercase tracking-[0.3em] ${integrityReport.status === 'warning' ? 'text-amber-800' : 'text-rose-800'}`}>Kritik Veri Bütünlüğü İhlali Saptandı</h4>
            <div className="space-y-2 mt-4">
              {integrityReport.issues.map((issue, idx) => (
                <p key={idx} className="text-[12px] font-bold text-slate-600 uppercase tracking-tight flex items-center gap-3">
                   <span className={`w-2 h-2 rounded-full ${integrityReport.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                   {issue}
                </p>
              ))}
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Akademik Kurul'un mülakat esnasında bu çelişkileri doğrudan sorgulaması zorunludur.</p>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="px-12 py-6 bg-white/90 backdrop-blur-md border-b border-slate-50 flex gap-6 overflow-x-auto custom-scrollbar no-print sticky top-28 z-40">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA SPEKTRUMU' },
          { id: 'predictions', label: 'PERFORMANS PROJEKSİYONU' },
          { id: 'strategy', label: 'MÜLAKAT STRATEJİSİ' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => { setActiveTab(t.id as any); window.scrollTo({ top: 112, behavior: 'smooth' }); }}
            className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
              activeTab === t.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="p-16 bg-[#FAFAFA] min-h-[600px]">
        {!candidate.report ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center p-20 grayscale opacity-40">
             <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 border-4 border-dashed border-slate-200">
                <svg className="w-20 h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
             </div>
             <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.8em] mb-6">Analiz Bekleniyor</h3>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-24 animate-fade-in pb-32">
            
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {segments.map(s => {
                  const segment = candidate.report?.deepAnalysis?.[s.key];
                  if (!segment) return null;
                  return (
                    <div key={s.key} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-500 hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                           <h5 className="text-[12px] font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-[0.3em] transition-colors mb-2">{s.label}</h5>
                        </div>
                        <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-2xl font-black ${segment.score > 70 ? 'bg-emerald-50 text-emerald-600' : segment.score > 40 ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'}`}>
                          {segment.score || 0}
                        </div>
                      </div>
                      
                      <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 mb-10 min-h-[120px] flex items-center">
                          <p className="text-[15px] font-bold text-slate-700 leading-relaxed italic">"{segment.pros?.[0] || 'Bu alanda yeterli veri derinliği bulunamadı.'}"</p>
                      </div>

                      <div className="space-y-4">
                        {segment.risks?.slice(0, 2).map((risk, idx) => (
                           <div key={idx} className="flex gap-4 items-start p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 shrink-0"></div>
                              <p className="text-[11px] font-black text-rose-700 uppercase tracking-widest leading-tight">{risk}</p>
                           </div>
                        ))}
                      </div>

                      <div className="absolute bottom-0 left-0 h-2 bg-slate-50 w-full">
                         <div className={`h-full transition-all duration-1000 ease-in-out ${segment.score > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${segment.score || 0}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 h-[700px] bg-white p-16 rounded-[5rem] border border-slate-100 shadow-2xl relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={3} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} />
                          <Radar name={candidate.name} dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.12} strokeWidth={6} dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} />
                          <Tooltip contentStyle={{ borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', fontSize: '12px', fontWeight: 'bold', padding: '20px' }} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="lg:col-span-4 space-y-8">
                    <div className="p-12 bg-slate-900 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                       <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-10 border-b border-white/10 pb-4">DOĞRULUK ANALİZİ</span>
                       <div className="space-y-12">
                          <div className="group/item">
                             <p className="text-6xl font-black leading-none">%{candidate.report!.integrityIndex}</p>
                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">Şeffaflık Endeksi</p>
                          </div>
                          <div className="group/item">
                             <p className="text-6xl font-black leading-none">%{candidate.report!.socialMaskingScore}</p>
                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">Maskeleme Eğilimi</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-12 bg-white rounded-[4rem] border border-slate-100 shadow-xl">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-6">KLİNİK ÖZET</span>
                       <p className="text-[18px] font-bold text-slate-800 leading-relaxed italic">"{candidate.report!.summary}"</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-16 rounded-[5rem] shadow-2xl border border-slate-100">
                   <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] mb-16 border-l-8 border-orange-600 pl-8 uppercase">PREDİKTİF AKADEMİK VERİ</h4>
                   <div className="space-y-8">
                      <PredictBar label="KURUMSAL SADAKAT" value={candidate.report!.predictiveMetrics.retentionProbability} color="text-emerald-500" />
                      <PredictBar label="PSİKOLOJİK DİRENÇ" value={100 - candidate.report!.predictiveMetrics.burnoutRisk} color="text-rose-500" />
                      <PredictBar label="ADAPTASYON HIZI" value={candidate.report!.predictiveMetrics.learningVelocity} color="text-blue-500" />
                      <PredictBar label="LİDERLİK VİZYONU" value={candidate.report!.predictiveMetrics.leadershipPotential} color="text-slate-900" />
                   </div>
                </div>
                <div className="bg-slate-900 p-16 rounded-[5rem] shadow-2xl text-white">
                   <h4 className="text-[14px] font-black text-orange-500 uppercase tracking-[0.5em] mb-12 border-b border-white/10 pb-6">STRATEJİK SWOT MATRİSİ</h4>
                   <div className="space-y-12">
                      <div>
                         <span className="text-[12px] font-black uppercase text-emerald-400 block mb-6 tracking-widest">GÜÇLÜ YÖNLER</span>
                         <div className="space-y-4">
                            {candidate.report!.swot.strengths.slice(0, 4).map((s, i) => (
                              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                 <p className="text-[13px] font-bold text-slate-200">{s}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div>
                         <span className="text-[12px] font-black uppercase text-rose-400 block mb-6 tracking-widest">GELİŞİM ALANLARI</span>
                         <div className="space-y-4">
                            {candidate.report!.swot.weaknesses.slice(0, 4).map((w, i) => (
                              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                                 <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                 <p className="text-[13px] font-bold text-slate-200">{w}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                 <div className="lg:col-span-8 space-y-16">
                    <div className="bg-white p-20 rounded-[5rem] shadow-2xl border border-slate-100">
                       <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-[0.6em] mb-20 border-l-[12px] border-orange-600 pl-10 leading-none">STRATEJİK MÜLAKAT SORULARI</h4>
                       <div className="space-y-10">
                          {candidate.report!.interviewGuidance.strategicQuestions.map((q, i) => (
                            <div key={i} className="group p-12 bg-slate-50 rounded-[4rem] border-2 border-transparent hover:border-orange-500 hover:bg-white transition-all duration-700 shadow-sm hover:shadow-2xl">
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

                    <div className="bg-slate-900 p-20 rounded-[5.5rem] text-white shadow-2xl relative overflow-hidden no-print">
                       <h4 className="text-[16px] font-black text-orange-500 uppercase tracking-[0.5em] mb-16 border-b border-white/10 pb-10">DAVET VE RANDEVU MERKEZİ</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Tarih</label>
                             <input 
                               type="date" 
                               className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-7 text-xl text-white font-bold outline-none focus:border-orange-600 transition-all"
                               value={scheduleData.date}
                               onChange={e => setScheduleData({...scheduleData, date: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Saat</label>
                             <input 
                               type="time" 
                               className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-7 text-xl text-white font-bold outline-none focus:border-orange-600 transition-all"
                               value={scheduleData.time}
                               onChange={e => setScheduleData({...scheduleData, time: e.target.value})}
                             />
                          </div>
                       </div>
                       <button 
                         onClick={handleSendInvitation}
                         disabled={isInviting}
                         className="w-full py-8 bg-orange-600 hover:bg-white hover:text-slate-900 text-white rounded-[3rem] font-black text-[14px] uppercase tracking-[0.5em] transition-all active:scale-95 disabled:opacity-50"
                       >
                          {isInviting ? 'GÖNDERİLİYOR...' : 'RESMİ DAVETİYEYİ ONAYLA VE GÖNDER'}
                       </button>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-10">
                    <div className="p-16 bg-orange-600 rounded-[5rem] text-white shadow-2xl">
                       <h5 className="text-[12px] font-black uppercase tracking-[0.5em] mb-12 text-orange-100">GÖZLEM ODAĞI</h5>
                       <ul className="space-y-10">
                          {candidate.report!.interviewGuidance.criticalObservations.map((obs, i) => (
                            <li key={i} className="flex gap-6 items-start">
                               <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black text-[14px] shrink-0">!</div>
                               <p className="text-[15px] font-black uppercase tracking-widest leading-snug">{obs}</p>
                            </li>
                          ))}
                       </ul>
                    </div>

                    <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                       <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">MOTOR TEKNOLOJİSİ</h5>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                             <span className="text-[10px] font-bold text-slate-600">Gemini-3 Flash (Deep Analysis)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                             <span className="text-[10px] font-bold text-slate-600">Cross-Verify Bütünlük Motoru</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-12 bg-white border-t border-slate-50 flex justify-between items-center no-print rounded-b-[4.5rem]">
         <div className="flex gap-6">
            <button onClick={onDelete} className="px-12 py-6 text-rose-500 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 rounded-[2rem] transition-all">SİL</button>
            <button className="px-12 py-6 text-slate-400 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 rounded-[2rem] transition-all">ARŞİVLE</button>
         </div>
         <div className="flex gap-6">
            <button 
              onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
                showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'RESMİ LİYAKAT RAPORU'
              })} 
              className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-black transition-all"
            >
              PDF RAPORU OLUŞTUR
            </button>
         </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
