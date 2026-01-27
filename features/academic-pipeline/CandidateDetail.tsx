
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
      alert("AI Analiz Motoru Hatası: Lütfen API anahtarınızı ve bağlantınızı kontrol edin.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  return (
    <div className="bg-white rounded-[4.5rem] shadow-xl border border-slate-100 flex flex-col relative overflow-hidden">
      {isAnalysing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center">
           <div className="w-40 h-40 border-[10px] border-orange-600/10 border-t-orange-600 rounded-full animate-spin mb-10"></div>
           <p className="text-white font-black uppercase tracking-[0.5em]">{analysisPhase}</p>
        </div>
      )}

      <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex gap-8 items-center">
          <div className="w-24 h-24 bg-slate-900 rounded-[3rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl">
            {candidate.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <StatusBadge status={candidate.status} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {candidate.id?.toUpperCase()}</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name}</h2>
            <p className="text-[12px] font-black text-orange-600 uppercase tracking-widest mt-2">{candidate.branch}</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={handleRunAnalysis} disabled={isAnalysing} className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-orange-600/20 active:scale-95">
             ANALİZİ BAŞLAT
           </button>
        </div>
      </div>

      <div className="px-12 py-6 bg-slate-50 border-b border-slate-100 flex gap-6 overflow-x-auto no-print">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA' },
          { id: 'predictions', label: 'PERFORMANS' },
          { id: 'strategy', label: 'MÜLAKAT REHBERİ' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-16 bg-[#FAFAFA] min-h-[600px]">
        {candidate.report ? (
          <div className="space-y-12 animate-fade-in">
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {segments.map(s => (
                  <div key={s.key} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-600 transition-colors">{s.label}</span>
                      <span className="text-2xl font-black text-slate-900">%{candidate.report?.deepAnalysis?.[s.key]?.score || 0}</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${candidate.report?.deepAnalysis?.[s.key]?.score || 0}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'predictions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <PredictBar label="KURUMSAL SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-600" description="Adayın 12 ay içerisinde kurumdan ayrılmama olasılığı." />
                 <PredictBar label="PSİKOLOJİK DİRENÇ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-600" description="Vaka yoğunluğu altında stres yönetimi ve tükenmişlik direnci." />
                 <PredictBar label="ADAPTASYON HIZI" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-600" description="Yeni metodolojileri ve kurum kültürünü özümseme hızı." />
                 <PredictBar label="LİDERLİK POTANSİYELİ" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-slate-900" description="Sorumluluk alma ve ekip yönetme vizyonu." />
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="h-[600px] bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl relative">
                <ResponsiveContainer width="100%" height="100%">
                   <RadarChart data={radarData}>
                      <PolarGrid stroke="#f1f5f9" strokeWidth={3} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                      <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.08} strokeWidth={5} />
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                   </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 bg-white p-16 rounded-[5rem] shadow-2xl border border-slate-100">
                    <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] mb-16 border-l-8 border-orange-600 pl-8">MÜLAKAT STRATEJİSİ</h4>
                    <div className="space-y-10">
                       {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                         <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group hover:bg-white hover:border-orange-500 transition-all">
                            <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-xl">{i+1}</span>
                            <p className="text-xl font-black text-slate-800 leading-tight italic">"{q}"</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl">
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-8 block">Gözlem Odağı</span>
                       <ul className="space-y-6">
                          {candidate.report.interviewGuidance.criticalObservations.map((obs, i) => (
                            <li key={i} className="flex gap-4 items-start">
                               <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0"></div>
                               <p className="text-[13px] font-bold text-slate-300 uppercase tracking-tight">{obs}</p>
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 opacity-30 grayscale">
             <div className="w-40 h-40 bg-slate-100 rounded-[4rem] flex items-center justify-center mb-12 border-4 border-dashed border-slate-200">
                <svg className="w-20 h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
             </div>
             <p className="text-3xl font-black uppercase tracking-[0.5em]">Analiz Bekleniyor</p>
          </div>
        )}
      </div>

      <div className="p-12 bg-white border-t border-slate-50 flex justify-between items-center no-print">
         <button onClick={onDelete} className="px-10 py-5 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-colors">DOSYAYI SİL</button>
         <button onClick={() => exportService.exportSingleCandidatePDF(candidate, { showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true })} className="px-16 py-6 bg-slate-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all">RESMİ RAPOR (PDF)</button>
      </div>
    </div>
  );
};

export default CandidateDetail;
