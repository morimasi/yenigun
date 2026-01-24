
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
  
  // Mülakat Davet State'leri
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
    const phases = ['Nöral Veriler Toplanıyor...', 'Onluk Matris Çaprazlanıyor...', 'Sosyal Maske Analiz Ediliyor...', 'Stratejik Rapor Mühürleniyor...'];
    
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
      alert("AI Analiz Motoru Hatası: Lütfen API anahtarınızı veya internet bağlantınızı kontrol edin.");
    } finally { 
      clearInterval(phaseInterval);
      setIsAnalysing(false); 
      setAnalysisPhase('');
    }
  };

  const handleSendInvitation = async () => {
    if (!confirm(`${candidate.name} adına resmi mülakat davetiyesi gönderilecektir. Onaylıyor musunuz?`)) return;
    
    setIsInviting(true);
    try {
      // 1. E-posta Gönderimi
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

      if (!emailRes.ok) throw new Error("Davet e-postası iletilemedi.");

      // 2. Aday Verisini Güncelle
      const updatedCandidate: Candidate = {
        ...candidate,
        status: 'interview_scheduled',
        interviewSchedule: {
          ...scheduleData
        },
        timestamp: Date.now()
      };
      
      onUpdate(updatedCandidate);
      alert("BAŞARILI: Mülakat randevusu sisteme işlendi ve aday bilgilendirildi.");
    } catch (err: any) {
      alert("HATA: " + err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const PredictBar = ({ label, value, color, description }: { label: string, value: number, color: string, description?: string }) => (
    <div className="group space-y-3 p-6 bg-white rounded-3xl border border-slate-50 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-end">
        <div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
           {description && <span className="text-[9px] font-bold text-slate-300 uppercase leading-none">{description}</span>}
        </div>
        <span className={`text-2xl font-black ${color}`}>%{value || 0}</span>
      </div>
      <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
        <div className={`h-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')}`} style={{ width: `${value || 0}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] rounded-[4rem] shadow-2xl border border-white h-full flex flex-col overflow-hidden animate-scale-in relative">
      
      {isAnalysing && (
        <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-20">
           <div className="relative mb-12">
              <div className="w-32 h-32 border-8 border-orange-600/20 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 bg-orange-600 rounded-2xl animate-pulse shadow-[0_0_50px_rgba(234,88,12,0.5)]"></div>
              </div>
           </div>
           <h3 className="text-3xl font-black text-white uppercase tracking-[0.4em] mb-4">Liyakat İşleniyor</h3>
           <p className="text-orange-500 font-black text-[12px] uppercase tracking-widest animate-bounce">{analysisPhase}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="p-10 bg-white border-b border-slate-100 flex justify-between items-center relative">
        <div className="flex gap-8 items-center">
          <div className="w-24 h-24 bg-slate-900 rounded-[3rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl">
            {candidate.name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="flex items-center gap-4 mb-3">
              <StatusBadge status={candidate.status} />
              <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">DOSYA ID: {candidate.id?.toUpperCase()}</div>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{candidate.name || 'İsimsiz Aday'}</h2>
            <div className="flex items-center gap-3 mt-4">
               <span className="text-[12px] font-black text-orange-600 uppercase tracking-[0.4em]">{candidate.branch}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{candidate.experienceYears} YIL TECRÜBE</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={handleRunAnalysis} 
             disabled={isAnalysing} 
             className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-orange-600/20"
           >
             {isAnalysing ? 'MUHAKEME EDİLİYOR...' : 'SİNYALİ ANALİZ ET'}
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="px-10 py-4 bg-white/50 backdrop-blur-xl border-b border-slate-100 flex gap-4 overflow-x-auto custom-scrollbar no-print">
        {[
          { id: 'matrix', label: '10 BOYUTLU MATRİS' },
          { id: 'dna', label: 'KLİNİK DNA' },
          { id: 'predictions', label: 'PREDİKTİF ANALİZ' },
          { id: 'strategy', label: 'MÜLAKAT STRATEJİSİ' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
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
          <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-40 grayscale">
             <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mb-8 border-4 border-dashed border-slate-200">
                <svg className="w-14 h-14 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
             </div>
             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.6em] mb-4">Liyakat Verisi Yok</h3>
             <p className="max-w-md text-[10px] font-bold text-slate-300 uppercase leading-relaxed tracking-widest">Üst menüden "Analizi Başlat" butonuna tıklayarak onluk matris değerlendirmesini tetikleyin.</p>
          </div>
        ) : (
          <div className="space-y-20 animate-fade-in pb-20">
            
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segments.map(s => {
                  const segment = candidate.report!.deepAnalysis[s.key];
                  return (
                    <div key={s.key} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-500 transition-all duration-500">
                      <div className="flex justify-between items-center mb-6">
                        <h5 className="text-[10px] font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-widest transition-colors">{s.label}</h5>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${segment?.score > 70 ? 'bg-emerald-50 text-emerald-600' : segment?.score > 40 ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'}`}>
                          {segment?.score || 0}
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 mb-6">
                          <p className="text-[11px] font-bold text-slate-600 leading-tight italic">"{segment?.pros?.[0] || 'Veri işlenemedi.'}"</p>
                      </div>
                      <div className="flex gap-2 mb-2">
                        {segment?.risks?.slice(0, 1).map((risk, idx) => (
                           <div key={idx} className="px-3 py-1 bg-rose-50 rounded-lg text-[8px] font-black text-rose-600 uppercase tracking-widest">KRİTİK: {risk}</div>
                        ))}
                      </div>
                      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                         <div className={`h-full transition-all duration-1000 ${segment?.score > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${segment?.score || 0}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 h-[600px] bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl relative">
                    <div className="absolute top-10 left-10 z-10">
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-2">ONLUK MUHAKEME RADARI</h4>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Klinik Karakter Spektrumu</p>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontBold: 900, fill: '#94a3b8' }} />
                          <Radar name={candidate.name} dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.15} strokeWidth={4} dot={{ r: 4, fill: '#ea580c' }} />
                          <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="lg:col-span-4 space-y-6">
                    <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">Dürüstlük ve Maske</span>
                       <div className="space-y-8">
                          <div>
                             <p className="text-4xl font-black leading-none">%{candidate.report.integrityIndex}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Dürüstlük Katsayısı</p>
                          </div>
                          <div>
                             <p className="text-4xl font-black leading-none">%{candidate.report.socialMaskingScore}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Sosyal Maske (İdealizasyon)</p>
                          </div>
                       </div>
                       <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Baş Klinik Notu</span>
                       <p className="text-[13px] font-bold text-slate-800 leading-relaxed italic">"{candidate.report.summary}"</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 border-l-4 border-orange-600 pl-6">PERFORMANS PROJEKSİYONU</h4>
                       <div className="space-y-6">
                          <PredictBar label="KURUMSAL BAĞLILIK" value={candidate.report.predictiveMetrics.retentionProbability} color="text-emerald-500" description="1 Yıllık Kalıcılık Tahmini" />
                          <PredictBar label="TÜKENMİŞLİK DİRENCİ" value={100 - candidate.report.predictiveMetrics.burnoutRisk} color="text-rose-500" description="Duygusal Yük Yönetimi" />
                          <PredictBar label="ÖĞRENME VELOSİTESİ" value={candidate.report.predictiveMetrics.learningVelocity} color="text-blue-500" description="Süpervizyon Adaptasyonu" />
                          <PredictBar label="LİDERLİK POTANSİYELİ" value={candidate.report.predictiveMetrics.leadershipPotential} color="text-slate-900" description="Gelecek Vizyonu" />
                       </div>
                    </div>
                    <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
                       <div className="relative z-10">
                          <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10">SWOT ANALİZİ (AI DRAFT)</h4>
                          <div className="grid grid-cols-2 gap-8">
                             <div>
                                <span className="text-[9px] font-black uppercase text-emerald-400 block mb-4">GÜÇLÜ YÖNLER</span>
                                <ul className="space-y-3">
                                   {candidate.report.swot.strengths.slice(0, 3).map((s, i) => (
                                     <li key={i} className="text-[10px] font-bold text-slate-300 uppercase leading-tight flex gap-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shrink-0"></div>{s}</li>
                                   ))}
                                </ul>
                             </div>
                             <div>
                                <span className="text-[9px] font-black uppercase text-rose-400 block mb-4">RİSK ALANLARI</span>
                                <ul className="space-y-3">
                                   {candidate.report.swot.weaknesses.slice(0, 3).map((w, i) => (
                                     <li key={i} className="text-[10px] font-bold text-slate-300 uppercase leading-tight flex gap-3"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 shrink-0"></div>{w}</li>
                                   ))}
                                </ul>
                             </div>
                          </div>
                       </div>
                       <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 relative z-10">
                          <p className="text-[11px] font-bold text-slate-400 leading-relaxed">
                             <span className="text-orange-500 font-black">AI TAVSİYESİ:</span> {candidate.report.recommendation}
                          </p>
                       </div>
                       <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-600/5 rounded-full blur-[100px]"></div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 {/* SOL: Mülakat Soruları ve Analiz */}
                 <div className="lg:col-span-7 space-y-12">
                    <div className="bg-white p-16 rounded-[4.5rem] shadow-2xl border border-slate-100 relative">
                       <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-16 border-l-4 border-orange-600 pl-8">CERRAHİ MÜLAKAT SORULARI</h4>
                       <div className="space-y-8">
                          {candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                            <div key={i} className="group p-10 bg-slate-50 rounded-[3rem] border-2 border-transparent hover:border-orange-500 transition-all duration-500">
                               <div className="flex gap-6">
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 font-black text-xl shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                                     {i + 1}
                                  </div>
                                  <p className="text-xl font-black text-slate-800 leading-tight italic opacity-90 group-hover:opacity-100">"{q}"</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Mülakat Davet Paneli (NEW) */}
                    <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                       <div className="relative z-10">
                          <h4 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.4em] mb-12">MÜLAKAT DAVET VE RANDEVU</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                             <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Görüşme Tarihi</label>
                                <input 
                                  type="date" 
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-orange-600 transition-all"
                                  value={scheduleData.date}
                                  onChange={e => setScheduleData({...scheduleData, date: e.target.value})}
                                />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Saat</label>
                                <input 
                                  type="time" 
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-orange-600 transition-all"
                                  value={scheduleData.time}
                                  onChange={e => setScheduleData({...scheduleData, time: e.target.value})}
                                />
                             </div>
                             <div className="md:col-span-2 space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Yöntem / Konum</label>
                                <select 
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-orange-600 transition-all mb-4"
                                  value={scheduleData.method}
                                  onChange={e => setScheduleData({...scheduleData, method: e.target.value})}
                                >
                                   <option value="Yüz Yüze Görüşme">Yüz Yüze Görüşme</option>
                                   <option value="Online (Google Meet)">Online (Google Meet)</option>
                                   <option value="Online (Zoom)">Online (Zoom)</option>
                                   <option value="Telefon Mülakatı">Telefon Mülakatı</option>
                                </select>
                                <input 
                                  type="text" 
                                  placeholder="Görüşme Adresi veya Link"
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-orange-600 transition-all"
                                  value={scheduleData.location}
                                  onChange={e => setScheduleData({...scheduleData, location: e.target.value})}
                                />
                             </div>
                          </div>
                          <button 
                            onClick={handleSendInvitation}
                            disabled={isInviting}
                            className="w-full py-6 bg-orange-600 hover:bg-white hover:text-slate-900 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                          >
                             {isInviting ? 'BİLGİLENDİRME İLETİLİYOR...' : 'RESMİ DAVETİYEYİ GÖNDER'}
                          </button>
                       </div>
                       <div className="absolute -right-40 -bottom-40 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]"></div>
                    </div>
                 </div>

                 {/* SAĞ: Gözlem Alanları */}
                 <div className="lg:col-span-5 space-y-8">
                    <div className="p-10 bg-orange-600 rounded-[3.5rem] text-white shadow-xl">
                       <h5 className="text-[10px] font-black uppercase tracking-widest mb-8 text-orange-200">Kritik Gözlem Alanları</h5>
                       <ul className="space-y-6">
                          {candidate.report.interviewGuidance.criticalObservations.map((obs, i) => (
                            <li key={i} className="flex gap-4 items-start">
                               <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0">!</div>
                               <p className="text-[11px] font-black uppercase tracking-widest leading-tight">{obs}</p>
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white">
                       <h5 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Simülasyon Görevleri</h5>
                       <ul className="space-y-4">
                          {candidate.report.interviewGuidance.simulationTasks?.map((task, i) => (
                            <li key={i} className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase flex gap-3"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>{task}</li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-10 bg-white border-t border-slate-100 flex justify-between items-center no-print">
         <div className="flex gap-3">
            <button onClick={onDelete} className="px-10 py-5 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">KAYDI SİL</button>
            <button className="px-10 py-5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">ARŞİVLE</button>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={() => exportService.exportSingleCandidatePDF(candidate, { 
                showAIAnalysis: true, showPersonalDetails: true, showSWOT: true, showAcademicBackground: true, showCompetencyMap: true, showInterviewNotes: true, headerTitle: 'YENİ GÜN AKADEMİ: KLİNİK LİYAKAT DOSYASI'
              })} 
              className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95"
            >
              RESMİ RAPOR ÜRET (PDF)
            </button>
         </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
