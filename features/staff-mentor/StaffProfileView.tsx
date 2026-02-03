
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StaffMember, IDP, AIReport } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import { armsService } from '../../services/ai/armsService';
import { generateCandidateAnalysis } from '../../geminiService';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const StaffProfileView: React.FC<{ staffId: string }> = ({ staffId }) => {
  const [data, setData] = useState<{ profile: StaffMember; assessments: any[]; activeIDP: IDP | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGeneratingIDP, setIsGeneratingIDP] = useState(false);

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

  /**
   * DERİN ANALİZ VE OTOMATİK VERİTABANI KAYDI
   * Bu fonksiyon bir kez çalıştırıldığında sonuç veritabanına mühürlenir.
   */
  const handleDeepAnalysis = async (force = false) => {
    if (!data) return;
    
    // Eğer kayıtlı bir rapor zaten varsa ve "Zorla (force)" denmemişse işlemi durdur.
    if ((data.profile as any).report && !force) {
        return;
    }

    setIsAnalysing(true);
    try {
      // 1. ADIM: Personel verilerini analiz motoru için hazırla
      const staffSnapshot = {
        ...data.profile,
        answers: data.assessments.reduce((acc, curr) => ({ ...acc, ...curr.answers }), {})
      };
      
      // 2. ADIM: Nöral Motoru (Gemini) Çalıştır
      const aiReport = await generateCandidateAnalysis(staffSnapshot as any, {} as any);
      
      // 3. ADIM: Sonucu Veritabanına "Otomatik" Mühürle (Persistence)
      const saveRes = await fetch('/api/staff?action=save_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, report: aiReport })
      });

      if (saveRes.ok) {
        // 4. ADIM: Başarılıysa UI verisini tazele (Artık report veritabanından gelecek)
        await fetchDetails();
        alert("Klinik analiz başarıyla tamamlandı ve veritabanına mühürlendi.");
      } else {
        throw new Error("DB_SAVE_FAIL");
      }
    } catch (e) {
      console.error("Deep Analysis Fail:", e);
      alert("Analiz Hatası: Nöral motor veya veritabanı yanıt vermedi.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleGenerateIDP = async () => {
    if (!data) return;
    setIsGeneratingIDP(true);
    try {
      const newIDP = await armsService.generateIDP(data.profile);
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

  const radarData = useMemo(() => {
    const report = (data?.profile as any)?.report as AIReport;
    if (!report?.deepAnalysis) return [];
    
    return [
      { subject: 'ETİK', value: report.deepAnalysis.workEthics?.score || 0 },
      { subject: 'KLİNİK', value: report.deepAnalysis.technicalExpertise?.score || 0 },
      { subject: 'PEDAGOJİ', value: report.deepAnalysis.pedagogicalAnalysis?.score || 0 },
      { subject: 'AKADEMİK', value: report.deepAnalysis.academicPedagogy?.score || 0 }, // Yeni Kategori
      { subject: 'SADAKAT', value: report.deepAnalysis.institutionalLoyalty?.score || 0 },
      { subject: 'DİRENÇ', value: report.deepAnalysis.sustainability?.score || 0 }
    ];
  }, [data]);

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">Klinik Veriler Çözümleniyor...</div>;
  if (!data) return <div className="p-20 text-center text-slate-400 font-black uppercase">Personel Kaydı Bulunamadı</div>;

  const staffReport = (data.profile as any).report as AIReport;

  return (
    <div className="space-y-6 animate-scale-in pb-20">
      {isExportOpen && data && staffReport && (
        <ExportStudio
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'STAFF_IDP',
            entityName: data.profile.name,
            referenceId: staffId,
            payload: data
          }}
        >
           <div className="space-y-12">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
                 <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">Akademik Durum Özeti</h3>
                 <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{staffReport.summary}"</p>
              </div>
              <div className="grid grid-cols-2 gap-10">
                 <div className="p-8 bg-white border-2 border-orange-100 rounded-3xl">
                    <h5 className="text-[10px] font-black text-orange-600 uppercase mb-4">Liyakat Skoru</h5>
                    <p className="text-6xl font-black text-slate-900">%{staffReport.score}</p>
                 </div>
                 <div className="p-8 bg-slate-900 text-white rounded-3xl">
                    <h5 className="text-[10px] font-black text-orange-500 uppercase mb-4">Dürüstlük Endeksi</h5>
                    <p className="text-6xl font-black text-white">%{staffReport.integrityIndex}</p>
                 </div>
              </div>
           </div>
        </ExportStudio>
      )}

      {/* HEADER SECTION */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex justify-between items-center">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl">
               {data.profile.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{data.profile.name}</h2>
               <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{data.profile.branch}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {staffId}</span>
                  {staffReport && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">ANALİZ MÜHÜRLENDİ</span>}
               </div>
            </div>
         </div>
         <div className="flex gap-3">
            <button 
                onClick={() => handleDeepAnalysis(true)} 
                disabled={isAnalysing}
                className="px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
            >
               {isAnalysing ? 'İŞLENİYOR...' : staffReport ? 'ANALİZİ YENİLE' : 'DERİN ANALİZ BAŞLAT'}
            </button>
            <button onClick={() => setIsExportOpen(true)} disabled={!staffReport} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-30">YAYINLA</button>
            <button onClick={handleGenerateIDP} disabled={isGeneratingIDP} className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md active:scale-95 disabled:opacity-50">
               {isGeneratingIDP ? 'ÜRETİLİYOR...' : 'IDP GÜNCELLE'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* SOL: RADAR VE KPI */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">YETKİNLİK SPEKTRUMU</h4>
               {staffReport ? (
                   <div className="flex-1 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                                <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.15} strokeWidth={3} />
                                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                   </div>
               ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30 grayscale">
                       <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                       <p className="text-[11px] font-black uppercase tracking-widest">Veri Görselleştirme İçin Derin Analiz Gerekli</p>
                   </div>
               )}
            </div>
         </div>

         {/* SAĞ: DETAYLI RAPOR VE GEÇMİŞ */}
         <div className="lg:col-span-7 space-y-6">
            {staffReport && (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl animate-fade-in">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">AKADEMİK OTOPSİ ÖZETİ</h4>
                    <p className="text-[13px] font-medium leading-relaxed text-slate-300 italic">"{staffReport.summary}"</p>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">GELİŞİM ÇEVİKLİĞİ</span>
                            <p className="text-xl font-black">%{staffReport.predictiveMetrics?.learningVelocity}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">BURN-OUT RİSKİ</span>
                            <p className="text-xl font-black text-rose-400">%{staffReport.predictiveMetrics?.burnoutRisk}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 border-l-4 border-orange-600 pl-4">MODÜLER TEST GEÇMİŞİ</h4>
               <div className="space-y-3">
                  {data.assessments.length === 0 ? (
                     <div className="py-20 text-center text-slate-300 uppercase font-black text-[10px]">Henüz test çözülmedi.</div>
                  ) : (
                     data.assessments.map((ass, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100 group hover:border-orange-200 transition-all">
                           <div>
                              <p className="text-[11px] font-black text-slate-900 uppercase">{ass.battery_id.replace(/_/g, ' ')}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{new Date(ass.timestamp).toLocaleDateString('tr-TR')}</p>
                           </div>
                           <div className="flex items-center gap-4">
                                <span className={`text-xl font-black ${ass.score > 75 ? 'text-emerald-600' : 'text-orange-600'}`}>%{ass.score}</span>
                                <div className="w-1 h-8 bg-slate-200 rounded-full group-hover:bg-orange-600 transition-colors"></div>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
            
            {data.activeIDP && (
                <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100">
                    <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">AKTİF GELİŞİM ROTASI</h4>
                    <p className="text-[12px] font-bold text-orange-900 leading-relaxed italic">"{(data.activeIDP as any).focusArea}"</p>
                    <ul className="mt-4 space-y-2">
                        {(data.activeIDP as any).identifiedGaps?.map((gap: string, i: number) => (
                            <li key={i} className="flex gap-3 items-center text-[11px] font-medium text-orange-800">
                                <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                                {gap}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default StaffProfileView;
