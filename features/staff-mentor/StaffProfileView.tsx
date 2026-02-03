
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StaffMember, IDP, AIReport, UniversalExportData, Branch, Candidate } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import { armsService } from '../../services/ai/armsService';
import { generateCandidateAnalysis } from '../../geminiService';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const StaffProfileView: React.FC<{ staffId: string; onUpdate?: () => void }> = ({ staffId, onUpdate }) => {
  const [data, setData] = useState<{ profile: StaffMember; assessments: any[]; activeIDP: IDP | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<string>('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGeneratingIDP, setIsGeneratingIDP] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'idp' | 'analytics' | 'history'>('overview');

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=get_details&staffId=${staffId}`);
      if (res.ok) {
        const details = await res.json();
        setData(details);
      }
    } catch (e) { console.error("Staff fetch error:", e); } 
    finally { setIsLoading(false); }
  }, [staffId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  /**
   * REFRESH ANALYTICS ENGINE
   * Personelin mülakat anından bugüne kadarki tüm verilerini (assessmentHistory) AI'ya gönderir.
   */
  const handleRefreshAnalysis = async () => {
    if (!data) return;
    
    if (!confirm("KRİTİK İŞLEM: Personelin tüm geçmiş test verileri ve liyakat ivmesi yeniden sentezlenecek. Mevcut rapor güncellenecektir. Onaylıyor musunuz?")) return;

    setIsAnalysing(true);
    
    const phases = [
      "Geçmiş Test Verileri Okunuyor...",
      "Bilişsel Çelişki Katsayıları Sentezleniyor...",
      "Gelişim İvmesi Modelleniyor (Trajectory)...",
      "Akademik Portre Yeniden Kurgulanıyor...",
      "Liyakat Mühürü Güncelleniyor..."
    ];

    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      setAnalysisPhase(phases[phaseIdx % phases.length]);
      phaseIdx++;
    }, 2500);

    try {
      // 360 Derece Tarihsel Veri Paketi Oluştur
      const deepSnapshot: Partial<Candidate> = {
        id: data.profile.id,
        name: data.profile.name,
        branch: data.profile.branch,
        experienceYears: data.profile.experience_years,
        university: data.profile.university,
        department: data.profile.department,
        // Tüm cevapları tek bir akıllı havuza dök
        answers: data.assessments.reduce((acc, curr) => ({ ...acc, ...curr.answers }), {}),
        // AI'ya tarihsel ivmeyi besle
        timestamp: Date.now(),
        status: 'hired'
      };

      // @ts-ignore - analyzeCandidate beklediği objeye assessmentHistory bilgisini gizlice enjekte ediyoruz
      deepSnapshot.assessmentHistory = data.assessments.map(a => ({
        score: a.score,
        timestamp: a.timestamp,
        battery: a.battery_id,
        tags: a.ai_tags
      }));
      
      const aiReport = await generateCandidateAnalysis(deepSnapshot as any, {} as any);
      
      const saveRes = await fetch('/api/staff?action=save_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, report: aiReport })
      });

      if (saveRes.ok) { 
        await fetchDetails(); 
        onUpdate?.(); 
        alert("Nöral Analiz Başarıyla Yenilendi. Yeni gelişim rotası mühürlendi."); 
      }
    } catch (e) { 
      alert("Analiz Motoru Bağlantı Hatası: Sistem yoğun olabilir, lütfen tekrar deneyiniz."); 
    } finally { 
      clearInterval(phaseInterval);
      setAnalysisPhase('');
      setIsAnalysing(false); 
    }
  };

  const handleGenerateIDP = async () => {
    if (!data) return;
    setIsGeneratingIDP(true);
    try {
      const newIDP = await armsService.generateIDP(data.profile, data.assessments);
      await fetch('/api/staff?action=save_idp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, data: newIDP })
      });
      fetchDetails();
    } catch (e) { alert("IDP hatası."); } 
    finally { setIsGeneratingIDP(false); }
  };

  const radarData = useMemo(() => {
    const da = data?.profile?.report?.deepAnalysis;
    if (!da) return [];
    return Object.entries(da).map(([k, v]) => ({ 
      subject: k.replace(/([A-Z])/g, ' $1').toUpperCase(), 
      value: (v as any).score 
    }));
  }, [data]);

  const learningCurve = useMemo(() => {
     if (!data?.assessments) return [];
     return data.assessments.map((a, i) => ({ 
        name: `T${i+1}`, 
        score: a.score, 
        date: new Date(a.timestamp).toLocaleDateString('tr-TR') 
     })).reverse();
  }, [data]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-32 space-y-8 animate-fade-in">
       <div className="w-24 h-24 border-8 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
       <p className="font-black text-slate-300 uppercase tracking-[0.4em]">Uzman Verileri Çözümleniyor...</p>
    </div>
  );

  if (!data) return <div className="p-20 text-center text-slate-400 font-black uppercase">Dosya Bulunamadı</div>;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20 relative">
      
      {/* ANALİZ YÜKLENİYOR OVERLAY */}
      {isAnalysing && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center">
           <div className="relative mb-12">
              <div className="w-56 h-56 border-[12px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] shadow-2xl flex items-center justify-center border border-white/10">
                    <svg className="w-12 h-12 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
              </div>
           </div>
           <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 animate-fade-in">Nöral Rekonstrüksiyon</h3>
           <p className="text-orange-500 font-black text-xl uppercase tracking-[0.5em] h-8 transition-all duration-500">{analysisPhase}</p>
        </div>
      )}

      {/* EXPORT OVERLAY */}
      {isExportOpen && (
        <ExportStudio
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'STAFF_PERFORMANCE_DOSSIER',
            entityName: data.profile.name,
            referenceId: staffId,
            payload: data
          }}
        >
           <div className="p-10 bg-white min-h-screen space-y-12">
              <div className="bg-slate-900 p-16 rounded-[4rem] text-white">
                 <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">{data.profile.name}</h1>
                 <p className="text-xl font-bold text-orange-500 uppercase tracking-widest">Resmi Klinik Liyakat Dosyası</p>
              </div>
           </div>
        </ExportStudio>
      )}

      {/* 1. PROFILE HEADER COCKPIT */}
      <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-10">
         <div className="flex items-center gap-10">
            <div className="w-32 h-32 bg-slate-900 rounded-[3rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl relative overflow-hidden group">
               <span className="relative z-10">{data.profile.name.charAt(0)}</span>
               <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-transparent opacity-40 group-hover:scale-125 transition-transform duration-700"></div>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{data.profile.name}</h2>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${data.profile.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{data.profile.status}</span>
               </div>
               <div className="flex flex-wrap items-center gap-6">
                  <span className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">{data.profile.branch}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{data.profile.experience_years} Yıl Saha Tecrübesi</span>
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                     {['overview', 'idp', 'analytics', 'history'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>{tab}</button>
                     ))}
                  </div>
               </div>
            </div>
         </div>
         <div className="flex gap-4 shrink-0">
            {/* ANALİZİ YENİLE BUTONU */}
            <button 
               onClick={handleRefreshAnalysis} 
               disabled={isAnalysing} 
               className="group relative px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50 overflow-hidden"
               title="Tüm geçmiş testleri ve ivmeyi sentezleyerek raporu tazeler"
            >
               <span className="relative z-10 flex items-center gap-3">
                  <svg className={`w-4 h-4 ${isAnalysing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
                  </svg>
                  {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZİ YENİLE'}
               </span>
            </button>
            <button onClick={() => setIsExportOpen(true)} className="p-5 bg-white border-2 border-slate-200 text-slate-900 rounded-[2rem] hover:bg-slate-50 transition-all shadow-sm">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* LEFT: NEURAL MAPS */}
         <div className="xl:col-span-5 space-y-8">
            <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-3xl relative overflow-hidden flex flex-col h-[500px]">
               <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-12 relative z-10">Bilişsel Yetkinlik Radar</h4>
               <div className="flex-1 relative z-10">
                  {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#ffffff10" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 900 }} />
                          <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} strokeWidth={5} />
                       </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-700 text-[11px] font-black uppercase tracking-widest text-center border-2 border-dashed border-white/5 rounded-3xl">Analiz Verisi Bulunmuyor</div>
                  )}
               </div>
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-xl space-y-10">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Akademik Tahminleme (Predictions)</h4>
               <div className="space-y-8">
                  {[
                    { label: 'ÖĞRENME HIZI', v: data.profile.report?.predictiveMetrics.learningVelocity || 0, c: 'text-blue-500' },
                    { label: 'TÜKENMİŞLİK DİRENCİ', v: 100 - (data.profile.report?.predictiveMetrics.burnoutRisk || 0), c: 'text-rose-500' },
                    { label: 'LİDERLİK POTANSİYELİ', v: data.profile.report?.predictiveMetrics.leadershipPotential || 0, c: 'text-orange-500' }
                  ].map(m => (
                    <div key={m.label} className="space-y-3">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{m.label}</span>
                          <span className={`text-3xl font-black ${m.c}`}>%{m.v}</span>
                       </div>
                       <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                          <div className={`h-full transition-all duration-1000 ${m.c.replace('text-', 'bg-')}`} style={{ width: `${m.v}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT: IDP & GROWTH WORKSPACE */}
         <div className="xl:col-span-7 space-y-8">
            
            {activeTab === 'idp' && (
               <div className="animate-scale-in space-y-8">
                  <div className="bg-orange-600 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="space-y-6 max-w-xl">
                           <div className="flex items-center gap-4">
                              <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
                              <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">Gelişim Rotası (IDP 2.0)</h3>
                           </div>
                           <p className="text-xl font-bold text-orange-50 italic leading-relaxed opacity-95">"{data.activeIDP?.focusArea || 'Kişiselleştirilmiş bir gelişim planı kurgulamak için butona tıklayın.'}"</p>
                        </div>
                        <button onClick={handleGenerateIDP} disabled={isGeneratingIDP} className="px-10 py-6 bg-white text-orange-600 rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-3xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 disabled:opacity-50">
                           {isGeneratingIDP ? 'PLAN ÜRETİLİYOR...' : 'YENİ PLAN ÜRET'}
                        </button>
                     </div>
                     <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-black/10 rounded-full blur-[150px] group-hover:scale-110 transition-transform duration-[3s]"></div>
                  </div>

                  {data.activeIDP && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { t: 'ADAPTASYON (0-30 GÜN)', c: data.activeIDP.roadmap.shortTerm, i: '🌱' },
                          { t: 'DERİNLEŞME (30-60 GÜN)', c: data.activeIDP.roadmap.midTerm, i: '🔭' },
                          { t: 'LİDERLİK (60-90 GÜN)', c: data.activeIDP.roadmap.longTerm, i: '🏆' }
                        ].map((r, i) => (
                           <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm hover:border-orange-500 hover:shadow-xl transition-all group flex flex-col gap-6">
                              <span className="text-4xl">{r.i}</span>
                              <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-600">{r.t}</h5>
                              <p className="text-[14px] font-bold text-slate-800 leading-relaxed italic">"{r.c}"</p>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'analytics' && (
               <div className="animate-fade-in space-y-8">
                  <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-xl">
                     <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-12 border-l-4 border-orange-600 pl-8">Bilişsel Gelişim Eğrisi (Learning Curve)</h4>
                     <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={learningCurve}>
                              <defs>
                                <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} domain={[0, 100]} />
                              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                              <Area type="monotone" dataKey="score" stroke="#ea580c" strokeWidth={5} fillOpacity={1} fill="url(#curveColor)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                     <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-8">Veriler son {learningCurve.length} testi baz almaktadır.</p>
                  </div>
               </div>
            )}

            {activeTab === 'overview' && (
               <div className="animate-fade-in space-y-8">
                  <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-xl relative overflow-hidden group">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 border-l-4 border-orange-600 pl-8">Akademik Portre Analizi</h4>
                     <p className="text-2xl font-bold text-slate-700 leading-relaxed italic text-justify group-hover:text-slate-900 transition-colors">
                        "{data.profile.report?.detailedAnalysisNarrative || 'Uzman için henüz derin bir akademik analiz mühürlenmedi. Lütfen sağ üstteki butondan analiz motorunu başlatın.'}"
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-emerald-50 p-12 rounded-[4rem] border border-emerald-100 shadow-sm">
                        <h5 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-8 flex items-center gap-3">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                           Klinik Kazanımlar
                        </h5>
                        <ul className="space-y-6">
                           {data.profile.report?.swot.strengths.map((s, i) => (
                              <li key={i} className="flex gap-5 items-start text-[14px] font-bold text-emerald-900">
                                 <span className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-[14px] shrink-0 shadow-lg">✓</span>
                                 <span className="uppercase tracking-tight">{s}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className="bg-rose-50 p-12 rounded-[4rem] border border-rose-100 shadow-sm">
                        <h5 className="text-[11px] font-black text-rose-700 uppercase tracking-widest mb-8 flex items-center gap-3">
                           <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                           Gelişim Alanları
                        </h5>
                        <ul className="space-y-6">
                           {data.profile.report?.swot.threats.map((t, i) => (
                              <li key={i} className="flex gap-5 items-start text-[14px] font-bold text-rose-900">
                                 <span className="w-8 h-8 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-[14px] shrink-0 shadow-lg">!</span>
                                 <span className="uppercase tracking-tight">{t}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default StaffProfileView;
