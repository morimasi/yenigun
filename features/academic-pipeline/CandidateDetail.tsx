
import React, { useState, useMemo } from 'react';
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
  
  const [isInviting, setIsInviting] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    method: 'Yüz Yüze Görüşme',
    location: config.institutionName + ' Merkez Yerleşkesi'
  });

  const integrityReport = useMemo(() => {
    return verifyCandidateIntegrity(candidate);
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
    const phases = ['Nöral Muhakeme...', 'Dahili Bütünlük Denetimi...', 'Stratejik Karar Üretiliyor...'];
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
      alert("AI Analiz Motoru Hatası: Lütfen bağlantınızı kontrol edin.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  const handleSendInvitation = async () => {
    if (!confirm(`${candidate.name} adına mülakat daveti gönderilecek?`)) return;
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

  return (
    <div className="bg-white rounded-[4.5rem] shadow-xl border border-slate-100 flex flex-col relative overflow-hidden">
      {isAnalysing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-20">
           <div className="w-40 h-40 border-[10px] border-orange-600/10 border-t-orange-600 rounded-full animate-spin mb-10"></div>
           <h3 className="text-4xl font-black text-white uppercase tracking-[0.5em] mb-4">Muhakeme Motoru Aktif</h3>
           <p className="text-orange-500 font-black text-[14px] uppercase tracking-[0.3em] animate-bounce">{analysisPhase}</p>
        </div>
      )}

      <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-white rounded-t-[4.5rem]">
        <div className="flex gap-10 items-center">
          <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl">
            {candidate.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-5 mb-4">
              <StatusBadge status={candidate.status} />
              <div className="px-4 py-1.5 bg-slate-50 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">KLİNİK DOSYA: {candidate.id?.toUpperCase()}</div>
              {candidate.report && (
                <div className={`px-5 py-2 rounded-2xl border-2 text-[10px] font-black uppercase transition-all ${
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
             {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZİ BAŞLAT'}
           </button>
        </div>
      </div>

      <div className="px-12 py-6 bg-white border-b border-slate-50 flex gap-6 overflow-x-auto no-print sticky top-28 z-40">
        {[
          { id: 'matrix', label: 'MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA' },
          { id: 'predictions', label: 'PERFORMANS' },
          { id: 'strategy', label: 'MÜLAKAT REHBERİ' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${activeTab === t.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 border-slate-100'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-16 bg-[#FAFAFA] min-h-[600px]">
        {!candidate.report ? (
          <div className="h-[400px] flex flex-col items-center justify-center opacity-30">
             <div className="w-40 h-40 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 mb-8"></div>
             <h3 className="text-3xl font-black uppercase tracking-[0.8em]">Analiz Bekleniyor</h3>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-24 animate-fade-in">
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {segments.map(s => {
                  const segment = candidate.report?.deepAnalysis?.[s.key];
                  if (!segment) return null;
                  return (
                    <div key={s.key} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-500 transition-all">
                      <div className="flex justify-between items-start mb-10">
                        <h5 className="text-[12px] font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-[0.3em] mb-2">{s.label}</h5>
                        <div className="text-2xl font-black text-slate-900">%{segment.score || 0}</div>
                      </div>
                      <p className="text-[15px] font-bold text-slate-700 leading-relaxed italic mb-8">"{segment.pros?.[0]}"</p>
                      <div className="absolute bottom-0 left-0 h-1.5 bg-slate-50 w-full">
                         <div className={`h-full transition-all duration-1000 ${segment.score > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${segment.score || 0}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {activeTab === 'predictions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <PredictBar label="KURUMSAL SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-600" />
                <PredictBar label="PSİKOLOJİK DİRENÇ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-600" />
                <PredictBar label="ADAPTASYON HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-600" />
                <PredictBar label="LİDERLİK POTANSİYELİ" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-slate-900" />
              </div>
            )}
            {activeTab === 'dna' && (
              <div className="h-[600px] bg-white rounded-[5rem] p-16 border border-slate-100 shadow-2xl">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart data={radarData}>
                      <PolarGrid stroke="#f1f5f9" strokeWidth={3} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} />
                      <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.1} strokeWidth={6} />
                   </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                 <div className="lg:col-span-8 space-y-16">
                    <div className="bg-white p-20 rounded-[5rem] shadow-2xl border border-slate-100">
                       <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-[0.6em] mb-20 border-l-[12px] border-orange-600 pl-10">STRATEJİK MÜLAKAT SORULARI</h4>
                       <div className="space-y-10">
                          {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                            <div key={i} className="p-12 bg-slate-50 rounded-[4rem] border-2 border-transparent hover:border-orange-500 transition-all">
                               <p className="text-2xl font-black text-slate-800 italic">"{q}"</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-12 bg-white border-t border-slate-50 flex justify-between items-center rounded-b-[4.5rem]">
         <button onClick={onDelete} className="px-12 py-6 text-rose-500 text-[12px] font-black uppercase hover:bg-rose-50 rounded-[2rem]">SİL</button>
         <button 
           onClick={() => exportService.exportSingleCandidatePDF(candidate, { showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true })} 
           className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] text-[12px] font-black uppercase shadow-3xl"
         >
           PDF RAPORU OLUŞTUR
         </button>
      </div>
    </div>
  );
};

export default CandidateDetail;
