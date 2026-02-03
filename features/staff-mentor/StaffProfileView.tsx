
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StaffMember, IDP, AIReport, UniversalExportData } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import { armsService } from '../../services/ai/armsService';
import { generateCandidateAnalysis } from '../../geminiService';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const StaffProfileView: React.FC<{ staffId: string; onUpdate?: () => void }> = ({ staffId, onUpdate }) => {
  const [data, setData] = useState<{ profile: StaffMember; assessments: any[]; activeIDP: IDP | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGeneratingIDP, setIsGeneratingIDP] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'idp' | 'analytics'>('overview');

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=get_details&staffId=${staffId}`);
      if (res.ok) {
        const details = await res.json();
        setData(details);
      }
    } catch (e) {
      console.error("Staff fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleDeepAnalysis = async () => {
    if (!data) return;
    setIsAnalysing(true);
    try {
      const staffSnapshot = {
        ...data.profile,
        answers: data.assessments.reduce((acc, curr) => ({ ...acc, ...curr.answers }), {})
      };
      
      const aiReport = await generateCandidateAnalysis(staffSnapshot as any, {} as any);
      
      const saveRes = await fetch('/api/staff?action=save_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, report: aiReport })
      });

      if (saveRes.ok) {
        await fetchDetails();
        if (onUpdate) onUpdate();
        alert("Nöral Dosya Başarıyla Mühürlendi.");
      }
    } catch (e) {
      alert("Hata: Analiz Motoru Bağlantısı Kesildi.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleGenerateIDP = async () => {
    if (!data) return;
    setIsGeneratingIDP(true);
    try {
      const newIDP = await armsService.generateIDP(data.profile, data.assessments);
      const res = await fetch('/api/staff?action=save_idp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, data: newIDP })
      });
      if (res.ok) fetchDetails();
    } catch (e) {
      alert("IDP Üretim Hatası.");
    } finally {
      setIsGeneratingIDP(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!confirm("KRİTİK İŞLEM: Bu personelin kaydı silinecek ve tüm veriler 'Akademik Arşiv'e taşınacaktır. Onaylıyor musunuz?")) return;
    try {
      const res = await fetch(`/api/staff?action=archive&staffId=${staffId}`, { method: 'POST' });
      if (res.ok) {
        alert("Personel dosyası arşive mühürlendi.");
        if (onUpdate) onUpdate();
      }
    } catch (e) { alert("Silme hatası."); }
  };

  const radarData = useMemo(() => {
    const report = data?.profile?.report;
    if (!report?.deepAnalysis) return [];
    return Object.entries(report.deepAnalysis).map(([k, v]) => ({
      subject: k.replace(/([A-Z])/g, ' $1').toUpperCase(),
      value: v.score
    }));
  }, [data]);

  const growthData = useMemo(() => {
     if (!data?.assessments) return [];
     return data.assessments.map(a => ({
        date: new Date(a.timestamp).toLocaleDateString(),
        score: a.score
     }));
  }, [data]);

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">Nöral Veriler Çözümleniyor...</div>;
  if (!data) return <div className="p-20 text-center text-slate-400 font-black uppercase">Dosya Bulunamadı</div>;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
      
      {/* EXPORT STÜDYO ENTEGRASYONU */}
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
           <div className="p-10 space-y-12 bg-white">
              <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
                 <h2 className="text-4xl font-black uppercase mb-6">{data.profile.name}</h2>
                 <p className="text-xl italic opacity-80">"{data.profile.report?.summary}"</p>
              </div>
           </div>
        </ExportStudio>
      )}

      {/* TOP HEADER COMMAND BAR */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative overflow-hidden group">
               <span className="relative z-10">{data.profile.name.charAt(0)}</span>
               <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20"></div>
            </div>
            <div>
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{data.profile.name}</h2>
               <div className="flex items-center gap-4 mt-4">
                  <span className="px-4 py-1.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{data.profile.branch}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KIDEM: {data.profile.experience_years} YIL</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                     {['overview', 'idp', 'analytics'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{tab}</button>
                     ))}
                  </div>
               </div>
            </div>
         </div>
         <div className="flex gap-3 shrink-0">
            <button onClick={handleDeepAnalysis} disabled={isAnalysing} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50">
               {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZİ MÜHÜRLE'}
            </button>
            <button onClick={() => setIsExportOpen(true)} className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">DOSYALARI İNDİR</button>
            <button onClick={handleDeleteStaff} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* LEFT PANEL: PERFORMANCE AND CHARTS */}
         <div className="xl:col-span-4 space-y-8 h-full">
            <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden h-[450px] flex flex-col">
               <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8 relative z-10">Bilişsel Yetkinlik Matrisi</h4>
               <div className="flex-1 relative z-10">
                  {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart data={radarData}>
                          <PolarGrid stroke="#ffffff20" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#64748b', fontWeight: 900 }} />
                          <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} strokeWidth={4} />
                       </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">Analiz Verisi Bekleniyor</div>
                  )}
               </div>
               <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kritik Gelişim Parametreleri</h4>
               <div className="space-y-6">
                  {[
                    { label: 'ÖĞRENME HIZI', v: data.profile.report?.predictiveMetrics.learningVelocity || 0, c: 'text-emerald-500' },
                    { label: 'TÜKENMİŞLİK RİSKİ', v: data.profile.report?.predictiveMetrics.burnoutRisk || 0, c: 'text-rose-500' },
                    { label: 'LİDERLİK POTANSİYELİ', v: data.profile.report?.predictiveMetrics.leadershipPotential || 0, c: 'text-orange-500' }
                  ].map(m => (
                    <div key={m.label} className="space-y-3">
                       <div className="flex justify-between items-end">
                          <span className="text-[9px] font-black text-slate-900 uppercase">{m.label}</span>
                          <span className={`text-2xl font-black ${m.c}`}>%{m.v}</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${m.c.replace('text-', 'bg-')}`} style={{ width: `${m.v}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT PANEL: IDP AND TIMELINE */}
         <div className="xl:col-span-8 space-y-8">
            {activeTab === 'idp' && (
               <div className="animate-scale-in space-y-8">
                  <div className="bg-orange-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                     <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-6 max-w-xl">
                           <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">Bireysel Gelişim Planı (IDP)</h3>
                           <p className="text-lg font-bold text-orange-100 italic leading-relaxed opacity-90">"{data.activeIDP?.focusArea || 'Yeni bir gelişim rotası oluşturun.'}"</p>
                        </div>
                        <button onClick={handleGenerateIDP} disabled={isGeneratingIDP} className="px-8 py-4 bg-white text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 hover:text-white transition-all">
                           {isGeneratingIDP ? 'ÜRETİLİYOR...' : 'YENİ PLAN ÜRET'}
                        </button>
                     </div>
                     <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
                  </div>

                  {data.activeIDP && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { t: '30 GÜN: ADAPTASYON', c: data.activeIDP.roadmap.shortTerm },
                          { t: '60 GÜN: UZMANLAŞMA', c: data.activeIDP.roadmap.midTerm },
                          { t: '90 GÜN: LİDERLİK', c: data.activeIDP.roadmap.longTerm }
                        ].map((r, i) => (
                           <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm group hover:border-orange-500 transition-all">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-orange-600">{r.t}</h5>
                              <p className="text-[13px] font-bold text-slate-700 leading-relaxed italic">"{r.c}"</p>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'overview' && (
               <div className="animate-fade-in space-y-8">
                  <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 border-l-4 border-orange-600 pl-6">Nöral Profil Analizi</h4>
                     <p className="text-xl font-bold text-slate-700 leading-relaxed italic text-justify">
                        "{data.profile.report?.detailedAnalysisNarrative || 'Derin analiz henüz tamamlanmadı.'}"
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-emerald-50 p-10 rounded-[3.5rem] border border-emerald-100">
                        <h5 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-6">KLİNİK GÜÇLÜ YÖNLER</h5>
                        <ul className="space-y-4">
                           {data.profile.report?.swot.strengths.map((s, i) => (
                              <li key={i} className="flex gap-4 items-start text-sm font-bold text-emerald-800">
                                 <span className="w-6 h-6 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-[12px] shrink-0 shadow-lg">✓</span>
                                 {s}
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className="bg-rose-50 p-10 rounded-[3.5rem] border border-rose-100">
                        <h5 className="text-[11px] font-black text-rose-700 uppercase tracking-widest mb-6">MİZAÇ RİSKLERİ</h5>
                        <ul className="space-y-4">
                           {data.profile.report?.swot.threats.map((t, i) => (
                              <li key={i} className="flex gap-4 items-start text-sm font-bold text-rose-800">
                                 <span className="w-6 h-6 bg-rose-600 text-white rounded-lg flex items-center justify-center font-black text-[12px] shrink-0 shadow-lg">!</span>
                                 {t}
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
