
import React, { useState, useMemo } from 'react';
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
  
  const [isInviting, setIsInviting] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    method: 'Yüz Yüze Görüşme',
    location: config.institutionName + ' Merkez Yerleşkesi'
  });

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
    if (!deepAnalysis) return [];
    
    return segments.map(s => ({
      subject: s.label,
      value: (deepAnalysis[s.key] && typeof deepAnalysis[s.key].score === 'number') ? deepAnalysis[s.key].score : 0
    }));
  }, [candidate, segments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    const phases = ['Veri Paketleri Çözülüyor...', 'Klinik Muhakeme Başlatıldı...', 'Psikolojik Maske Analizi...', 'Stratejik Karar Üretiliyor...'];
    
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
    <div className="bg-white rounded-[4.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-slate-100 h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {isAnalysing && (
        <div className="absolute inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-20">
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

      {/* HEADER (EXPANDED) */}
      <div className="p-12 bg-white border-b border-slate-50 flex justify-between items-center relative">
        <div className="flex gap-10 items-center">
          <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl relative overflow-hidden group">
            {candidate.name?.charAt(0)}
            <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <div>
            <div className="flex items-center gap-5 mb-4">
              <StatusBadge status={candidate.status} />
              <div className="px-4 py-1.5 bg-slate-50 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">KLİNİK DOSYA: {candidate.id?.toUpperCase()}</div>
            </div>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] mb-2">{candidate.name}</h2>
            <div className="flex items-center gap-5 mt-6">
               <span className="text-[14px] font-black text-orange-600 uppercase tracking-[0.4em]">{candidate.branch}</span>
               <div className="w-2 h-2 rounded-full bg-slate-200"></div>
               <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">{candidate.experienceYears} YIL SAHA DENEYİMİ</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={handleRunAnalysis} 
             disabled={isAnalysing} 
             className="px-12 py-6 bg-orange-600 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl shadow-orange-600/20 active:scale-95"
           >
             {isAnalysing ? 'ANALİZ EDİLİYOR...' : 'LİYAKAT ANALİZİNİ BAŞLAT'}
           </button>
        </div>
      </div>

      {/* TABS (STICKY & LARGER) */}
      <div className="px-12 py-6 bg-white border-b border-slate-50 flex gap-6 overflow-x-auto custom-scrollbar no-print sticky top-0 z-40">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA SPEKTRUMU' },
          { id: 'predictions', label: 'PERFORMANS PROJEKSİYONU' },
          { id: 'strategy', label: 'MÜLAKAT STRATEJİSİ' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
              activeTab === t.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA (REFINED & SPACIOUS) */}
      <div className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-[#FAFAFA]">
        {!candidate.report ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-20 grayscale opacity-40">
             <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 border-4 border-dashed border-slate-200">
                <svg className="w-20 h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
             </div>
             <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.8em] mb-6">Analiz Bekleniyor</h3>
             <p className="max-w-lg text-[12px] font-bold text-slate-300 uppercase leading-relaxed tracking-widest">Adayın profesyonel yetkinliklerini ve psikolojik liyakatini ölçmek için yukarıdaki butondan AI analizini tetikleyin.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-24 animate-fade-in pb-32">
            
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {segments.map(s => {
                  const segment = candidate.report!.deepAnalysis[s.key];
                  return (
                    <div key={s.key} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-500 hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                           <h5 className="text-[12px] font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-[0.3em] transition-colors mb-2">{s.label}</h5>
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Boyutsal Değerlendirme</p>
                        </div>
                        <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-2xl font-black ${segment?.score > 70 ? 'bg-emerald-50 text-emerald-600' : segment?.score > 40 ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'}`}>
                          {segment?.score || 0}
                        </div>
                      </div>
                      
                      <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 mb-10 min-h-[120px] flex items-center">
                          <p className="text-[15px] font-bold text-slate-700 leading-relaxed italic">"{segment?.pros?.[0] || 'Bu alanda yeterli veri derinliği bulunamadı.'}"</p>
                      </div>

                      <div className="space-y-4">
                        {segment?.risks?.slice(0, 2).map((risk, idx) => (
                           <div key={idx} className="flex gap-4 items-start p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 shrink-0 animate-pulse"></div>
                              <p className="text-[11px] font-black text-rose-700 uppercase tracking-widest leading-tight">{risk}</p>
                           </div>
                        ))}
                      </div>

                      <div className="absolute bottom-0 left-0 h-2 bg-slate-50 w-full">
                         <div className={`h-full transition-all duration-1000 ease-in-out ${segment?.score > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${segment?.score || 0}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 h-[700px] bg-white p-16 rounded-[5rem] border border-slate-100 shadow-2xl relative">
                    <div className="absolute top-12 left-12 z-10">
                       <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] mb-3">KLİNİK MUHAKEME HARİTASI</h4>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adayın 10 Boyutlu Profesyonel DNA'sı</p>
                    </div>
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
                    <div className="p-12 bg-slate-900 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                       <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-10 border-b border-white/10 pb-4">DOĞRULUK ANALİZİ</span>
                       <div className="space-y-12">
                          <div className="group/item">
                             <p className="text-6xl font-black leading-none group-hover/item:text-orange-500 transition-colors">%{candidate.report.integrityIndex}</p>
                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">Dürüstlük ve Şeffaflık</p>
                          </div>
                          <div className="group/item">
                             <p className="text-6xl font-black leading-none group-hover/item:text-orange-500 transition-colors">%{candidate.report.socialMaskingScore}</p>
                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">Sosyal Maskeleme Eğilimi</p>
                          </div>
                       </div>
                       <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
                    </div>
                    <div className="p-12 bg-white rounded-[4rem] border border-slate-100 shadow-xl relative overflow-hidden">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-6">BAŞ KLİNİK ÖZETİ</span>
                       <p className="text-[18px] font-bold text-slate-800 leading-relaxed italic">"{candidate.report.summary}"</p>
                       <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 opacity-50 rounded-bl-[4rem]"></div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="space-y-16">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white p-16 rounded-[5rem] shadow-2xl border border-slate-100 relative">
                       <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] mb-16 border-l-8 border-orange-600 pl-8">PREDİKTİF AKADEMİK VERİ</h4>
                       <div className="space-y-8">
                          <PredictBar label="KURUMSAL SADAKAT" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-500" description="12 Aylık Tahmini Kalıcılık Oranı" />
                          <PredictBar label="PSİKOLOJİK DİRENÇ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-500" description="Duygusal Yük ve Stres Yönetimi" />
                          <PredictBar label="AKADEMİK ADAPTASYON" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-500" description="Yeni Metotları Kavrama Hızı" />
                          <PredictBar label="LİDERLİK VİZYONU" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-slate-900" description="Gelecek Dönem Sorumluluk Kapasitesi" />
                       </div>
                    </div>
                    <div className="bg-slate-900 p-16 rounded-[5rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
                       <div className="relative z-10">
                          <h4 className="text-[14px] font-black text-orange-500 uppercase tracking-[0.5em] mb-12 border-b border-white/10 pb-6">STRATEJİK SWOT MATRİSİ</h4>
                          <div className="grid grid-cols-1 gap-12">
                             <div>
                                <span className="text-[12px] font-black uppercase text-emerald-400 block mb-6 tracking-widest">AYIRT EDİCİ GÜÇLÜ YÖNLER</span>
                                <div className="grid grid-cols-1 gap-4">
                                   {candidate.report.swot.strengths.slice(0, 4).map((s, i) => (
                                     <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-5">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <p className="text-[13px] font-bold text-slate-200 uppercase tracking-tight">{s}</p>
                                     </div>
                                   ))}
                                </div>
                             </div>
                             <div>
                                <span className="text-[12px] font-black uppercase text-rose-400 block mb-6 tracking-widest">KRİTİK GELİŞİM ALANLARI</span>
                                <div className="grid grid-cols-1 gap-4">
                                   {candidate.report.swot.weaknesses.slice(0, 4).map((w, i) => (
                                     <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-5">
                                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                        <p className="text-[13px] font-bold text-slate-200 uppercase tracking-tight">{w}</p>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="mt-16 p-10 bg-white/5 rounded-[3rem] border border-white/10 relative z-10">
                          <p className="text-[16px] font-bold text-slate-300 leading-relaxed italic">
                             <span className="text-orange-500 font-black uppercase tracking-widest">AI REHBER NOTU:</span> {candidate.report.recommendation}
                          </p>
                       </div>
                       <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[180px]"></div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                 <div className="lg:col-span-8 space-y-16">
                    <div className="bg-white p-20 rounded-[5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                       <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-[0.6em] mb-20 border-l-[12px] border-orange-600 pl-10 leading-none">STRATEJİK MÜLAKAT SORULARI</h4>
                       <div className="space-y-10">
                          {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                            <div key={i} className="group p-12 bg-slate-50 rounded-[4rem] border-2 border-transparent hover:border-orange-500 hover:bg-white transition-all duration-700 shadow-sm hover:shadow-2xl">
                               <div className="flex gap-10">
                                  <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-orange-600 font-black text-2xl shadow-xl group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                                     {i + 1}
                                  </div>
                                  <p className="text-2xl font-black text-slate-800 leading-tight italic opacity-90 group-hover:opacity-100 transition-all">"{q}"</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-slate-900 p-20 rounded-[5.5rem] text-white shadow-2xl relative overflow-hidden">
                       <div className="relative z-10">
                          <h4 className="text-[16px] font-black text-orange-500 uppercase tracking-[0.5em] mb-16 border-b border-white/10 pb-10">DAVET VE RANDEVU MERKEZİ</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Görüşme Tarihi</label>
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
                             <div className="md:col-span-2 space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Lokasyon / Erişim</label>
                                <input 
                                  type="text" 
                                  placeholder="Mülakat Yeri veya Toplantı Linki"
                                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-7 text-xl text-white font-bold outline-none focus:border-orange-600 transition-all"
                                  value={scheduleData.location}
                                  onChange={e => setScheduleData({...scheduleData, location: e.target.value})}
                                />
                             </div>
                          </div>
                          <button 
                            onClick={handleSendInvitation}
                            disabled={isInviting}
                            className="w-full py-8 bg-orange-600 hover:bg-white hover:text-slate-900 text-white rounded-[3rem] font-black text-[14px] uppercase tracking-[0.5em] transition-all shadow-3xl active:scale-95 disabled:opacity-50"
                          >
                             {isInviting ? 'SİSTEM İLETİŞİM KURUYOR...' : 'RESMİ DAVETİYEYİ ONAYLA VE GÖNDER'}
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-10">
                    <div className="p-16 bg-orange-600 rounded-[5rem] text-white shadow-2xl relative overflow-hidden group">
                       <h5 className="text-[12px] font-black uppercase tracking-[0.5em] mb-12 text-orange-100 border-b border-white/20 pb-6">GÖZLEM ODAĞI</h5>
                       <ul className="space-y-10">
                          {candidate.report.interviewGuidance.criticalObservations.map((obs, i) => (
                            <li key={i} className="flex gap-6 items-start group-hover:translate-x-2 transition-transform duration-500">
                               <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black text-[14px] shrink-0">!</div>
                               <p className="text-[15px] font-black uppercase tracking-widest leading-snug">{obs}</p>
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-16 bg-white rounded-[5rem] border border-slate-100 shadow-xl">
                       <h5 className="text-[12px] font-black uppercase tracking-[0.4em] mb-10 text-slate-400">SİMÜLASYON ANALİZİ</h5>
                       <ul className="space-y-6">
                          {candidate.report.interviewGuidance.simulationTasks?.map((task, i) => (
                            <li key={i} className="text-[14px] font-bold text-slate-600 leading-relaxed uppercase flex gap-4"><div className="w-2 h-2 bg-orange-500 rounded-full mt-2.5 shrink-0"></div>{task}</li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* FOOTER ACTIONS (LARGER) */}
      <div className="p-12 bg-white border-t border-slate-50 flex justify-between items-center no-print">
         <div className="flex gap-6">
            <button onClick={onDelete} className="px-12 py-6 text-rose-500 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 rounded-[2rem] transition-all border border-transparent hover:border-rose-100">KAYDI İMHA ET</button>
            <button className="px-12 py-6 text-slate-400 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 rounded-[2rem] transition-all">ARŞİVE KALDIR</button>
         </div>
         <div className="flex gap-6">
            <button 
              onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
                showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'YENİ GÜN AKADEMİ: KLİNİK LİYAKAT VE UZMANLIK RAPORU'
              })} 
              className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-black transition-all active:scale-95"
            >
              RESMİ PDF RAPORU OLUŞTUR
            </button>
         </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
