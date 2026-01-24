
import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
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

  // Radar grafiği için veri güvenliği
  const radarData = useMemo(() => {
    const report = candidate?.report;
    const deepAnalysis = report?.deepAnalysis;
    
    if (!deepAnalysis) return [];
    
    const segments = [
      { key: 'workEthics', label: 'ETİK' },
      { key: 'technicalExpertise', label: 'KLİNİK' },
      { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
      { key: 'sustainability', label: 'DİRENÇ' },
      { key: 'formality', label: 'RESMİYET' },
      { key: 'institutionalLoyalty', label: 'UYUM' }
    ];

    return segments.map(s => ({
      subject: s.label,
      value: (deepAnalysis[s.key] && typeof deepAnalysis[s.key].score === 'number') ? deepAnalysis[s.key].score : 0
    }));
  }, [candidate]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    const phases = ['Sinyaller Toplanıyor...', 'Nöral Muhakeme Başlatıldı...', 'Vaka Analizleri Çaprazlanıyor...', 'Liyakat Raporu Oluşturuluyor...'];
    
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
      console.error("Analiz Hatası:", e);
      alert("AI Analiz Motoru Hatası: Sinyal işleme başarısız oldu.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  const PredictBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="group space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-base font-black ${color}`}>%{value || 0}</span>
      </div>
      <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner relative">
        <div className={`h-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')} relative z-10`} style={{ width: `${value || 0}%` }}></div>
      </div>
    </div>
  );

  // Object.entries için güvenli yardımcı fonksiyon
  const safeEntries = (obj: any) => (obj && typeof obj === 'object') ? Object.entries(obj) : [];

  return (
    <div className="bg-[#F8FAFC] rounded-[4rem] shadow-2xl border border-white h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {isAnalysing && (
        <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-20">
           <div className="relative mb-12">
              <div className="w-32 h-32 border-8 border-orange-600/20 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 bg-orange-600 rounded-2xl animate-pulse"></div>
              </div>
           </div>
           <h3 className="text-2xl font-black text-white uppercase tracking-[0.5em] mb-4">Liyakat İşleniyor</h3>
           <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest animate-bounce">{analysisPhase}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="p-10 bg-white border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
        <div className="flex gap-8 items-center relative z-10">
          <div className="w-24 h-24 bg-slate-900 rounded-[3rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl">
            {candidate.name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="flex items-center gap-4 mb-3">
              <StatusBadge status={candidate.status} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">DOSYA: {candidate.id?.slice(0, 8)}</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name || 'İsimsiz Aday'}</h2>
            <div className="flex items-center gap-3 mt-4">
               <span className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.3em]">{candidate.branch}</span>
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{candidate.experienceYears} YIL TECRÜBE</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleRunAnalysis} 
          disabled={isAnalysing} 
          className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl"
        >
          {isAnalysing ? 'İŞLENİYOR' : 'ANALİZİ BAŞLAT'}
        </button>
      </div>

      {/* TABS */}
      <div className="px-10 py-6 bg-white/50 backdrop-blur-xl border-b border-slate-100 flex gap-4">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA' },
          { id: 'predictions', label: 'PREDİKTİF' },
          { id: 'strategy', label: 'STRATEJİ' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === t.id ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#FDFDFD]">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-40">
             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.6em] mb-6">Analiz Bekleniyor</h3>
             <p className="max-w-md text-[10px] font-bold text-slate-300 uppercase leading-relaxed tracking-widest">Adayın liyakat haritasını oluşturmak için analizi tetikleyin.</p>
          </div>
        ) : (
          <div className="space-y-20 animate-fade-in pb-20">
            
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {safeEntries(candidate.report.deepAnalysis).map(([key, segment]: [string, any]) => (
                  <div key={key} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8">
                      <h5 className="text-[11px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${segment?.score > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {segment?.score || 0}
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[12px] font-bold text-slate-700 leading-tight italic">"{segment?.pros?.[0] || 'Veri bulunamadı.'}"</p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
                       <div className="h-full bg-slate-900" style={{ width: `${segment?.score || 0}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="h-[600px] bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                       <PolarGrid stroke="#f1f5f9" />
                       <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontBold: 900, fill: '#94a3b8' }} />
                       <Radar name={candidate.name} dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={4} />
                       <Tooltip />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'predictions' && candidate.report.predictiveMetrics && (
              <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100">
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-16">PROJEKSİYONLAR</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <PredictBar label="SADAKAT (RETENTION)" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-500" />
                   <PredictBar label="TÜKENMİŞLİK DİRENCİ" value={100 - (candidate.report.predictiveMetrics.burnoutRisk || 0)} color="text-rose-500" />
                </div>
              </div>
            )}

            {activeTab === 'strategy' && candidate.report.interviewGuidance && (
              <div className="bg-white p-16 rounded-[4.5rem] shadow-2xl border border-slate-100">
                 <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12">SORU SETİ</h4>
                 <div className="space-y-6">
                    {candidate.report.interviewGuidance.strategicQuestions?.map((q: string, i: number) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <p className="text-sm font-black italic">"{q}"</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

          </div>
        )}
      </div>

      <div className="p-10 bg-white border-t border-slate-100 flex justify-between items-center">
         <button onClick={onDelete} className="px-10 py-5 text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">SİL</button>
         <button 
           onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
             showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true 
           })} 
           className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
         >
           PDF RAPORU
         </button>
      </div>
    </div>
  );
};

export default CandidateDetail;
