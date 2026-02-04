
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StaffMember, IDP, AIReport, UniversalExportData, Branch, Candidate, TrainingModule, TrainingUnit } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import { armsService } from '../../services/ai/armsService';
import { generateCandidateAnalysis } from '../../geminiService';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine, BarChart, Bar, Cell 
} from 'recharts';

const StaffProfileView: React.FC<{ staffId: string; onUpdate?: () => void }> = ({ staffId, onUpdate }) => {
  const [data, setData] = useState<{ profile: StaffMember; assessments: any[]; activeIDP: IDP | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<string>('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGeneratingIDP, setIsGeneratingIDP] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'idp' | 'analytics' | 'history'>('overview');
  
  // CURRICULUM EDITOR STATE
  const [editMode, setEditMode] = useState(false);
  const [localIDP, setLocalIDP] = useState<IDP | null>(null);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=get_details&staffId=${staffId}`);
      if (res.ok) {
        const details = await res.json();
        setData(details);
        if (details.activeIDP) {
            setLocalIDP(JSON.parse(JSON.stringify(details.activeIDP))); // Deep copy for editing
        }
      }
    } catch (e) { console.error("Staff fetch error:", e); } 
    finally { setIsLoading(false); }
  }, [staffId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handleRefreshAnalysis = async () => {
    if (!data) return;
    
    if (!confirm("KRİTİK İŞLEM: Personelin tüm gelişim verileri, geçmiş testleri ve liyakat ivmesi yeniden sentezlenecek. Bu işlem mevcut raporu ve gelişim planını güncelleyecektir. Onaylıyor musunuz?")) return;

    setIsAnalysing(true);
    
    const phases = [
      "Tarihsel Veri Seti Okunuyor...",
      "Bilişsel Çelişki Katsayıları Modelleniyor...",
      "Delta Analizi (Initial vs Current) Başlatıldı...",
      "Nöro-Pedagojik İyileştirme Sentezi Yapılıyor...",
      "Güncel Liyakat Mühürü Hazırlanıyor..."
    ];

    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      setAnalysisPhase(phases[phaseIdx % phases.length]);
      phaseIdx++;
    }, 2500);

    try {
      const deepSnapshot: Partial<Candidate> = {
        id: data.profile.id,
        name: data.profile.name,
        branch: data.profile.branch,
        experienceYears: data.profile.experience_years,
        university: data.profile.university,
        department: data.profile.department,
        answers: (data.assessments || []).reduce((acc, curr) => ({ ...acc, ...curr.answers }), {}),
        timestamp: Date.now(),
        status: 'hired'
      };

      // @ts-ignore
      deepSnapshot.assessmentHistory = (data.assessments || []).map(a => ({
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
        alert("Nöral Analiz ve Gelişim Rotası Başarıyla Yenilendi."); 
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
      await saveIDP(newIDP);
      fetchDetails();
    } catch (e) { alert("IDP üretim hatası."); } 
    finally { setIsGeneratingIDP(false); }
  };

  const saveIDP = async (idpToSave: IDP) => {
      try {
        await fetch('/api/staff?action=save_idp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ staffId, data: idpToSave })
        });
        setLocalIDP(idpToSave);
      } catch (e) {
          console.error("Save error", e);
      }
  };

  const handleSaveChanges = async () => {
      if(localIDP) {
          await saveIDP(localIDP);
          setEditMode(false);
          alert("Müfredat güncellemeleri sisteme işlendi.");
      }
  };

  // --- EDIT FUNCTIONS ---
  const toggleUnitCompletion = (modIdx: number, unitIdx: number) => {
      if(!localIDP || !localIDP.curriculum) return;
      const newCurriculum = [...localIDP.curriculum];
      newCurriculum[modIdx].units[unitIdx].isCompleted = !newCurriculum[modIdx].units[unitIdx].isCompleted;
      setLocalIDP({...localIDP, curriculum: newCurriculum});
      // Auto save on toggle for better UX
      saveIDP({...localIDP, curriculum: newCurriculum}); 
  };

  const updateModuleTitle = (modIdx: number, val: string) => {
      if(!localIDP?.curriculum) return;
      const newC = [...localIDP.curriculum];
      newC[modIdx].title = val;
      setLocalIDP({...localIDP, curriculum: newC});
  };

  const addUnit = (modIdx: number) => {
      if(!localIDP?.curriculum) return;
      const newC = [...localIDP.curriculum];
      const newUnit: TrainingUnit = {
          id: `U-${Date.now()}`,
          title: 'Yeni Eğitim Ünitesi',
          type: 'reading',
          content: 'İçerik detayı giriniz...',
          durationMinutes: 30,
          isCompleted: false,
          aiRationale: 'Manuel olarak eklendi.'
      };
      newC[modIdx].units.push(newUnit);
      setLocalIDP({...localIDP, curriculum: newC});
  };

  const deleteUnit = (modIdx: number, unitIdx: number) => {
      if(!localIDP?.curriculum) return;
      const newC = [...localIDP.curriculum];
      newC[modIdx].units.splice(unitIdx, 1);
      setLocalIDP({...localIDP, curriculum: newC});
  };

  const radarData = useMemo(() => {
    const da = data?.profile?.report?.deepAnalysis;
    if (!da) return [];
    return Object.entries(da).map(([k, v]) => ({ 
      subject: (v as any).label || k.replace(/([A-Z])/g, ' $1').toUpperCase(), 
      value: (v as any)?.score || 0,
      fullMark: 100
    }));
  }, [data]);

  const learningCurve = useMemo(() => {
     if (!data?.assessments || !Array.isArray(data.assessments)) return [];
     return [...data.assessments].reverse().map((a, i) => ({ 
        name: `Test ${i+1}`, 
        score: a.score || 0, 
        date: new Date(a.timestamp).toLocaleDateString('tr-TR', {month:'short', day:'numeric'}) 
     }));
  }, [data]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-32 space-y-8 animate-fade-in">
       <div className="w-24 h-24 border-8 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
       <p className="font-black text-slate-300 uppercase tracking-[0.4em]">Uzman Verileri Çözümleniyor...</p>
    </div>
  );

  if (!data) return <div className="p-20 text-center text-slate-400 font-black uppercase">Dosya Bulunamadı</div>;

  const MetricCard = ({ label, value, color, icon, trend, detail }: any) => (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col justify-between">
       <div className="relative z-10 flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color.replace('text-', 'bg-').replace('600', '100')} ${color}`}>
             {icon}
          </div>
          <span className={`text-4xl font-black ${color}`}>%{value}</span>
       </div>
       <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          {trend && <p className="text-[9px] font-bold text-slate-300 uppercase">{trend}</p>}
          {detail && <p className="text-[10px] font-medium text-slate-500 mt-3 leading-relaxed border-t border-slate-100 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">{detail}</p>}
       </div>
       <div className={`absolute bottom-0 left-0 h-1.5 w-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20 relative">
      
      {/* EXPORT STUDIO */}
      {isExportOpen && data.profile.report && (
        <ExportStudio 
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'STAFF_PERFORMANCE_DOSSIER',
            entityName: data.profile.name,
            referenceId: data.profile.id,
            payload: data.profile
          }}
        >
           <div className="p-10">
              <h1 className="text-4xl font-black">Personel Gelişim Dosyası</h1>
           </div>
        </ExportStudio>
      )}

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
           <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 animate-fade-in">Analiz Derinleştiriliyor</h3>
           <p className="text-orange-500 font-black text-xl uppercase tracking-[0.5em] h-8 transition-all duration-500">{analysisPhase}</p>
        </div>
      )}

      {/* 1. HEADER PROFILE CARD */}
      <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-0"></div>
         
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl group cursor-pointer hover:scale-105 transition-transform">
               {data.profile.name.charAt(0)}
               <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
            </div>
            <div className="space-y-3">
               <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{data.profile.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                     <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-lg text-slate-600 uppercase tracking-widest">{data.profile.branch}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.profile.experience_years} YIL DENEYİM</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  {[
                    { id: 'overview', label: 'GENEL BAKIŞ', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                    { id: 'idp', label: 'HİZMET İÇİ EĞİTİM', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                    { id: 'analytics', label: 'ANALİTİK', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                    { id: 'history', label: 'ARŞİV', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                  ].map(tab => (
                     <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                     >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
                        <span className="hidden md:inline">{tab.label}</span>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="flex gap-4 relative z-10">
            <button onClick={handleRefreshAnalysis} disabled={isAnalysing} className="px-6 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50">
               {isAnalysing ? 'SENTEZLENİYOR...' : 'YENİDEN ANALİZ ET'}
            </button>
            <button onClick={() => setIsExportOpen(true)} className="p-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4 4V4" /></svg>
            </button>
         </div>
      </div>

      {/* 2. CONTENT STAGE */}
      <div className="min-h-[500px]">
         
         {/* --- OVERVIEW TAB --- */}
         {activeTab === 'overview' && (
            <div className="space-y-8 animate-slide-up">
               {/* KPI GRID */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard 
                     label="KLİNİK DERİNLİK" 
                     value={data.profile.report?.deepAnalysis?.technicalExpertise?.score || 0} 
                     color="text-slate-900" 
                     icon="🧠" 
                     trend="Stabil ve Güçlü"
                     detail="Metodolojik hakimiyet ve uygulama sadakati üst seviyede. Vaka formülasyonunda nadir görülen bir netlik var."
                  />
                  <MetricCard 
                     label="ETİK BÜTÜNLÜK" 
                     value={data.profile.report?.deepAnalysis?.workEthics?.score || 0} 
                     color="text-emerald-600" 
                     icon="⚖️" 
                     trend="Kritik Güven Unsuru"
                     detail="Kurumsal sınırlara ve profesyonel mesafeye sarsılmaz bağlılık. Manipülasyona kapalı profil."
                  />
                  <MetricCard 
                     label="PEDAGOJİK ÇEVİKLİK" 
                     value={data.profile.report?.deepAnalysis?.pedagogicalAnalysis?.score || 0} 
                     color="text-blue-600" 
                     icon="📚" 
                     trend="Gelişime Açık Alan"
                     detail="Klasik yöntemlerde güçlü ancak yeni nesil dijital pedagojiye adaptasyonda hafif direnç gözlemleniyor."
                  />
                  <MetricCard 
                     label="PSİKOLOJİK DİRENÇ" 
                     value={data.profile.report?.deepAnalysis?.sustainability?.score || 0} 
                     color="text-orange-600" 
                     icon="🔋" 
                     trend="İzlenmesi Gerekir"
                     detail="Yoğun kriz anlarında duygusal yorgunluk belirtileri mevcut. Süpervizyon desteği artırılmalı."
                  />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                        Nöral Yetkinlik Çekirdeği (Core Competency)
                     </h4>
                     <p className="text-lg font-medium text-slate-600 leading-relaxed text-justify italic group-hover:text-slate-900 transition-colors">
                        "{data.profile.report?.detailedAnalysisNarrative || 'Derin analiz verisi bekleniyor. Lütfen analiz motorunu çalıştırın.'}"
                     </p>
                     
                     {/* Alt Bilgi */}
                     <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-8">
                        <div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">DOMINANT KARAKTER</span>
                           <p className="text-xs font-bold text-slate-800">{data.profile.report?.deepAnalysis?.technicalExpertise?.score > 80 ? 'Teknik Otorite & Veri Odaklı' : 'İlişki Odaklı & Esnek'}</p>
                        </div>
                        <div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">LATENT (GİZLİ) RİSK</span>
                           <p className="text-xs font-bold text-rose-600">{data.profile.report?.deepAnalysis?.sustainability?.score < 60 ? 'Tükenmişlik ve Duygusal Yorgunluk' : 'Aşırı Özgüven ve İnovasyon Direnci'}</p>
                        </div>
                     </div>

                     <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-slate-50 rounded-full blur-3xl group-hover:bg-orange-50 transition-colors"></div>
                  </div>

                  <div className="space-y-6">
                     <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 flex flex-col justify-center h-full">
                        <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-6">STRATEJİK AVANTAJLAR</h5>
                        <ul className="space-y-4">
                           {data.profile.report?.swot?.strengths?.slice(0, 3).map((s, i) => (
                              <li key={i} className="flex gap-4 text-[11px] font-bold text-emerald-800 leading-tight">
                                 <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] shrink-0">✓</span> 
                                 {s}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- NEW MODULE: CURRICULUM & IDP --- */}
         {activeTab === 'idp' && (
            <div className="space-y-8 animate-slide-up">
               {!localIDP ? (
                  <div className="flex flex-col items-center justify-center p-24 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 text-center">
                     <div className="w-24 h-24 bg-white rounded-[3rem] flex items-center justify-center mb-8 shadow-sm text-slate-300">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                     </div>
                     <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tight mb-4">Müfredat Tanımlanmamış</h3>
                     <p className="text-slate-400 font-bold text-sm mb-8 max-w-md">Personelin test hatalarına ve eksik yetkinliklerine dayalı "Tanısal Müfredat" oluşturmak için nöral motoru başlatın.</p>
                     <button onClick={handleGenerateIDP} disabled={isGeneratingIDP} className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all disabled:opacity-50">
                        {isGeneratingIDP ? 'MÜFREDAT İNŞA EDİLİYOR...' : 'YENİ MÜFREDAT OLUŞTUR'}
                     </button>
                  </div>
               ) : (
                  <div className="grid grid-cols-12 gap-8">
                     
                     {/* LEFT COLUMN: STRATEGY & INFO */}
                     <div className="col-span-12 xl:col-span-4 space-y-6">
                        <div className="bg-orange-600 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                           <div className="relative z-10">
                              <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-4">GELİŞİM HEDEFİ (STRATEJİK ODAK)</h4>
                              <p className="text-2xl font-black leading-tight italic tracking-tight mb-8">"{localIDP.focusArea}"</p>
                              <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                                 <span className="text-[9px] font-black text-orange-200 uppercase block mb-2">AI ANALİZ NOTU</span>
                                 <p className="text-[11px] font-medium text-white/90 leading-relaxed italic">{localIDP.aiAnalysisSummary}</p>
                              </div>
                           </div>
                           <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-[60px]"></div>
                        </div>

                        {/* Identified Gaps */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                           <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">TESPİT EDİLEN EKSİKLİKLER</h5>
                           <div className="space-y-3">
                              {localIDP.identifiedGaps?.map((gap, i) => (
                                 <div key={i} className="flex gap-3 items-start p-3 bg-rose-50 rounded-xl border border-rose-100">
                                    <span className="text-rose-500 font-bold text-xs mt-0.5">!</span>
                                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{gap}</p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3">
                           <button 
                             onClick={() => setEditMode(!editMode)} 
                             className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${editMode ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'}`}
                           >
                              {editMode ? 'DÜZENLEMEYİ BİTİR' : 'MÜFREDATI DÜZENLE'}
                           </button>
                           {editMode && (
                              <button onClick={handleSaveChanges} className="px-6 py-4 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 transition-all">
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </button>
                           )}
                        </div>
                     </div>

                     {/* RIGHT COLUMN: CURRICULUM MODULES */}
                     <div className="col-span-12 xl:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">HİZMET İÇİ EĞİTİM MODÜLLERİ</h4>
                           <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-bold text-slate-500">{localIDP.curriculum?.length || 0} MODÜL ATANDI</span>
                        </div>

                        <div className="space-y-6">
                           {(localIDP.curriculum || []).map((module, modIdx) => (
                              <div key={module.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                                 {/* Module Header */}
                                 <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${module.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-900 text-white'}`}>
                                          {modIdx + 1}
                                       </div>
                                       <div>
                                          {editMode ? (
                                             <input 
                                               type="text" 
                                               className="bg-transparent border-b border-slate-300 font-black text-slate-900 text-sm outline-none w-full"
                                               value={module.title}
                                               onChange={(e) => updateModuleTitle(modIdx, e.target.value)}
                                             />
                                          ) : (
                                             <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">{module.title}</h5>
                                          )}
                                          <div className="flex gap-2 mt-1">
                                             <span className="text-[9px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">{module.difficulty.toUpperCase()}</span>
                                             <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">{module.focusArea}</span>
                                          </div>
                                       </div>
                                    </div>
                                    {editMode && (
                                       <button onClick={() => addUnit(modIdx)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-[9px] font-bold text-slate-600 transition-all">
                                          + ÜNİTE EKLE
                                       </button>
                                    )}
                                 </div>

                                 {/* Units List */}
                                 <div className="p-2 space-y-1">
                                    {module.units.map((unit, unitIdx) => (
                                       <div key={unit.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group/unit">
                                          <button 
                                            onClick={() => toggleUnitCompletion(modIdx, unitIdx)}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${unit.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-orange-500'}`}
                                          >
                                             {unit.isCompleted && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                                          </button>
                                          
                                          <div className="flex-1 min-w-0">
                                             <div className="flex justify-between items-start">
                                                <p className={`text-[11px] font-bold uppercase ${unit.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                   {unit.title}
                                                </p>
                                                {editMode && (
                                                   <button onClick={() => deleteUnit(modIdx, unitIdx)} className="text-rose-400 hover:text-rose-600 px-2">
                                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                                                   </button>
                                                )}
                                             </div>
                                             <p className="text-[10px] font-medium text-slate-500 mt-1 leading-relaxed">{unit.content}</p>
                                             
                                             {/* AI Rationale Tooltip */}
                                             <div className="mt-2 flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase">{unit.type}</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold">{unit.durationMinutes} DK</span>
                                                {unit.aiRationale && (
                                                   <span className="text-[9px] text-orange-600 italic opacity-80" title={unit.aiRationale}>
                                                      * {unit.aiRationale}
                                                   </span>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                    {module.units.length === 0 && (
                                       <div className="p-4 text-center text-[10px] font-bold text-slate-300 uppercase">Bu modülde henüz görev yok.</div>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* --- ANALYTICS TAB (DATA LAB) --- */}
         {activeTab === 'analytics' && (
            <div className="space-y-8 animate-scale-in">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                  {/* Radar Chart */}
                  <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col">
                     <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4 z-10">YETKİNLİK AĞI</h4>
                     <p className="text-[10px] font-medium text-slate-400 max-w-sm mb-8 relative z-10">
                        Bu grafik, personelin 8 temel yetkinlik alanındaki dengesini gösterir. Sivri uçlar uzmanlığı, içe çökük alanlar gelişim ihtiyacını işaret eder.
                     </p>
                     <div className="flex-1 w-full min-h-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={radarData} outerRadius="70%">
                              <PolarGrid stroke="#ffffff20" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                              <Radar name="Personel" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} strokeWidth={3} />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#000', fontSize: '10px', fontWeight: 'bold' }} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
                  </div>

                  {/* Velocity Chart */}
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-lg flex flex-col">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-4">ÖĞRENME İVMESİ (VOLATİLİTE)</h4>
                     <p className="text-[10px] font-medium text-slate-500 max-w-sm mb-8">
                        Zaman içindeki performans dalgalanmaları, personelin stres altındaki dayanıklılığını ve adaptasyon hızını gösterir.
                     </p>
                     <div className="flex-1 w-full min-h-0">
                        {learningCurve.length > 1 ? (
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={learningCurve}>
                                 <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                                       <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                 <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                 <YAxis domain={[0, 100]} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                 <Area type="monotone" dataKey="score" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        ) : (
                           <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                              YETERLİ GEÇMİŞ VERİ YOK
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- HISTORY TAB (ARCHIVE) --- */}
         {activeTab === 'history' && (
            <div className="animate-slide-up">
               <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                     <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">KRONOLOJİK LİYAKAT DÖKÜMÜ</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Toplam {data.assessments?.length || 0} adet tescilli sınav kaydı.</p>
                     </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                     {(data.assessments || []).map((a, idx) => (
                        <div key={idx} className="p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-center justify-between group gap-6">
                           <div className="flex items-center gap-8 w-full md:w-auto">
                              <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center font-black text-slate-400 text-lg shadow-inner">
                                 {data.assessments.length - idx}
                              </div>
                              <div>
                                 <h5 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{a.battery_id.toUpperCase().replace(/_/g, ' ')}</h5>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                    {new Date(a.timestamp).toLocaleDateString('tr-TR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                                 </p>
                              </div>
                           </div>
                           
                           <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                              {/* Analysis Tags */}
                              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                                 {(a.ai_tags || []).slice(0,3).map((tag: string, i: number) => (
                                    <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-bold text-slate-500 uppercase tracking-wider shadow-sm">
                                       #{tag}
                                    </span>
                                 ))}
                              </div>
                              
                              <div className="text-right pl-8 border-l border-slate-100">
                                 <span className={`text-4xl font-black ${a.score > 80 ? 'text-emerald-500' : a.score > 60 ? 'text-orange-500' : 'text-rose-500'}`}>%{a.score}</span>
                                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">BAŞARI ORANI</p>
                              </div>
                           </div>
                        </div>
                     ))}
                     {(!data.assessments || data.assessments.length === 0) && (
                        <div className="p-32 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                           Kayıt bulunamadı.
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default StaffProfileView;
