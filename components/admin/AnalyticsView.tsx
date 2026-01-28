
import React, { useMemo, useState, useEffect } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { analyzeTalentPool } from '../../services/ai/poolService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis,
  ComposedChart, Line
} from 'recharts';

const COLORS = ['#ea580c', '#0f172a', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9'];
const GRADIENTS = {
  primary: ['#ea580c', '#fb923c'],
  secondary: ['#0f172a', '#334155'],
  emerald: ['#10b981', '#34d399']
};

const AnalyticsView: React.FC<{ candidates: Candidate[], config: GlobalConfig }> = ({ candidates, config }) => {
  const [isPoolAnalysing, setIsPoolAnalysing] = useState(false);
  const [poolAiReport, setPoolAiReport] = useState<any>(null);

  const stats = useMemo(() => {
    if (!candidates.length) return null;

    // 1. Branch Intensity & Quality Matrix
    const branchStats = candidates.reduce((acc: any, c) => {
      if (!acc[c.branch]) acc[c.branch] = { name: c.branch, count: 0, totalScore: 0, totalExp: 0, highMeritCount: 0 };
      acc[c.branch].count++;
      acc[c.branch].totalScore += (c.report?.score || 0);
      acc[c.branch].totalExp += c.experienceYears;
      if ((c.report?.score || 0) > 75) acc[c.branch].highMeritCount++;
      return acc;
    }, {});

    const branchData = Object.values(branchStats).map((b: any) => ({
      ...b,
      avgScore: Math.round(b.totalScore / b.count),
      avgExp: Math.round(b.totalExp / b.count),
      meritRatio: Math.round((b.highMeritCount / b.count) * 100)
    }));

    // 2. Experience vs. Merit Correlation (Enhanced)
    const correlationData = candidates
      .filter(c => c.report)
      .map(c => ({
        exp: c.experienceYears,
        merit: c.report!.score,
        integrity: c.report!.integrityIndex,
        name: c.name,
        branch: c.branch
      }));

    // 3. Educational Pedigree (University Impact)
    const uniMap = candidates.reduce((acc: any, c) => {
      if (!acc[c.university]) acc[c.university] = { name: c.university, count: 0, totalMerit: 0 };
      acc[c.university].count++;
      acc[c.university].totalMerit += (c.report?.score || 0);
      return acc;
    }, {});

    const uniData = Object.values(uniMap)
      .map((u: any) => ({ name: u.name, avgMerit: Math.round(u.totalMerit / u.count), count: u.count }))
      .sort((a, b) => b.avgMerit - a.avgMerit)
      .slice(0, 5);

    // 4. Global KPIs
    // 'candidates' değişkeninin bir atama operatörü olmadan kullanılması sonucu oluşan shadowing ve 'declaration öncesi kullanım' hatası düzeltildi.
    const totalA = candidates.length;
    const avgMerit = Math.round(candidates.reduce((a, b) => a + (b.report?.score || 0), 0) / totalA);
    const ethicalStability = Math.round(candidates.reduce((a, b) => a + (b.report?.integrityIndex || 0), 0) / totalA);
    const highPotentialCount = candidates.filter(c => (c.report?.score || 0) > 80).length;

    return { branchData, correlationData, uniData, avgMerit, ethicalStability, highPotentialCount, totalA };
  }, [candidates]);

  const handlePoolAnalysis = async () => {
    if (candidates.length < 3) {
      alert("Havuz analizi için en az 3 mülakatı tamamlanmış aday gerekmektedir.");
      return;
    }
    setIsPoolAnalysing(true);
    try {
      const report = await analyzeTalentPool(candidates, config);
      setPoolAiReport(report);
    } catch (e) {
      alert("Havuz analizi başarısız oldu.");
    } finally {
      setIsPoolAnalysing(false);
    }
  };

  if (!stats) return <div className="py-40 text-center opacity-30">Veri bekleniyor...</div>;

  return (
    <div className="space-y-10 animate-fade-in pb-32">
      
      {/* SECTION 1: GLOBAL TALENT KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Havuz Kapasitesi</span>
           <div className="flex items-end gap-3">
              <span className="text-6xl font-black text-slate-900 leading-none">{stats.totalA}</span>
              <span className="text-[11px] font-bold text-emerald-500 uppercase mb-2">Aday</span>
           </div>
           <div className="mt-6 flex gap-2">
              <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
              <div className="h-1 flex-1 bg-emerald-500/20 rounded-full"></div>
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
           <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-2">Liyakat Katsayısı</span>
           <div className="flex items-end gap-3">
              <span className="text-6xl font-black leading-none">%{stats.avgMerit}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase mb-2">Ortalama</span>
           </div>
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl group">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Etik Stabilite</span>
           <div className="flex items-end gap-3">
              <span className="text-6xl font-black text-slate-900 leading-none">%{stats.ethicalStability}</span>
              <span className="text-[11px] font-bold text-emerald-500 uppercase mb-2">Güven</span>
           </div>
           <div className="mt-6 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${stats.ethicalStability}%` }}></div>
           </div>
        </div>

        <div className="bg-orange-600 p-10 rounded-[3.5rem] shadow-2xl text-white group">
           <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest block mb-2">High Potential (HiPo)</span>
           <div className="flex items-end gap-3">
              <span className="text-6xl font-black leading-none">{stats.highPotentialCount}</span>
              <span className="text-[11px] font-bold text-orange-200 uppercase mb-2">Kritik</span>
           </div>
           <p className="mt-4 text-[9px] font-bold text-orange-100 uppercase tracking-widest opacity-60">Liderlik Vaat Edenler</p>
        </div>
      </div>

      {/* SECTION 2: AI STRATEGIC INTELLIGENCE PANEL */}
      <div className="bg-slate-950 p-12 rounded-[5rem] text-white shadow-3xl relative overflow-hidden border border-white/5 group">
         <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-center">
            <div className="xl:w-1/3 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                  </div>
                  <h4 className="text-[14px] font-black text-orange-500 uppercase tracking-[0.5em]">AI STRATEJİ MOTORU</h4>
               </div>
               <h3 className="text-4xl font-black tracking-tighter uppercase leading-[0.9]">Havuz Sağlığı ve<br/>Piyasa Tahmini</h3>
               <button 
                 onClick={handlePoolAnalysis}
                 disabled={isPoolAnalysing}
                 className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-30"
               >
                  {isPoolAnalysing ? 'VERİLER İŞLENİYOR...' : 'GLOBAL ANALİZİ BAŞLAT'}
               </button>
            </div>

            <div className="xl:w-2/3 flex-1">
               {poolAiReport ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
                    <div className="p-8 bg-white/5 rounded-[3.5rem] border border-white/10">
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">Yönetici Özeti</span>
                       <p className="text-[15px] font-bold text-slate-300 leading-relaxed italic">"{poolAiReport.executiveSummary}"</p>
                    </div>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Güçlü Branş</span>
                          <span className="text-[13px] font-black text-emerald-400 uppercase">{poolAiReport.topPerformingBranch}</span>
                       </div>
                       <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kritik Risk Alanı</span>
                          <span className="text-[13px] font-black text-rose-400 uppercase">{poolAiReport.criticalRiskArea}</span>
                       </div>
                       <div className="p-6 bg-orange-600/10 rounded-[2rem] border border-orange-500/20">
                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-3">Stratejik Hamle Önerisi</span>
                          <p className="text-[12px] font-bold text-orange-100 uppercase">{poolAiReport.recommendedAction}</p>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-[4rem] opacity-20">
                    <p className="text-xl font-black uppercase tracking-[0.5em]">Veri Analizi Bekleniyor</p>
                 </div>
               )}
            </div>
         </div>
         <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-orange-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* SECTION 3: DEEP DRILL VISUALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* BENTO: BRANCH PERFORMANCE SPECTRUM */}
         <div className="lg:col-span-8 bg-white p-12 rounded-[5rem] shadow-2xl border border-slate-100 relative">
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 border-l-[12px] border-orange-600 pl-8 leading-none py-2">Branş Bazlı Liyakat Dağılımı</h4>
            <div className="h-[450px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={stats.branchData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                     <Tooltip 
                       contentStyle={{ borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}
                       cursor={{ fill: '#f8fafc' }}
                     />
                     <Bar dataKey="avgScore" fill="#ea580c" radius={[15, 15, 15, 15]} barSize={40} name="Ort. Skor" />
                     <Line type="monotone" dataKey="meritRatio" stroke="#0f172a" strokeWidth={4} dot={{ r: 6, fill: '#0f172a' }} name="Liyakat Oranı (%)" />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 flex justify-center gap-10">
               <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-600 rounded-lg"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akademik Puan</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-900 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liyakat Stabilite Çizgisi</span>
               </div>
            </div>
         </div>

         {/* BENTO: UNIVERSITY PERFORMANCE */}
         <div className="lg:col-span-4 bg-white p-12 rounded-[5rem] shadow-2xl border border-slate-100 flex flex-col">
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 border-l-[12px] border-orange-600 pl-8 leading-none py-2">Eğitim Kaynağı Analizi</h4>
            <div className="flex-1 space-y-8">
               {stats.uniData.map((uni, idx) => (
                 <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-3">
                       <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[200px]">{uni.name}</span>
                       <span className="text-xl font-black text-orange-600">%{uni.avgMerit}</span>
                    </div>
                    <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                       <div 
                         className="h-full bg-slate-900 transition-all duration-1000 group-hover:bg-orange-600" 
                         style={{ width: `${uni.avgMerit}%` }}
                       ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Klinik Verim</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase">{uni.count} Mezun</span>
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-12 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic">
                  * En yüksek performanslı eğitim kaynakları, kurumun 'Junior Akademisyen' programı için önceliklidir.
               </p>
            </div>
         </div>
      </div>

      {/* SECTION 4: SCATTER DNA CORRELATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-12 bg-white p-16 rounded-[6rem] shadow-3xl border border-slate-100 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
               <div>
                  <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.6em] border-l-[16px] border-orange-600 pl-10 leading-none py-2">Nöral Korelasyon Matrisi</h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-6 uppercase tracking-[0.4em] ml-14">Deneyim Yılı (X) ve Liyakat Skoru (Y) Çapraz Analizi</p>
               </div>
               <div className="flex gap-4">
                  <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                     Öğrenme Hızı Yüksek Alan
                  </div>
                  <div className="px-6 py-3 bg-rose-50 rounded-2xl border border-rose-100 text-[10px] font-black text-rose-700 uppercase tracking-widest">
                     Düşük Verim / Risk Alanı
                  </div>
               </div>
            </div>
            
            <div className="h-[550px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis type="number" dataKey="exp" name="Deneyim" unit=" Yıl" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900 }} />
                     <YAxis type="number" dataKey="merit" name="Skor" unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900 }} />
                     <ZAxis type="number" dataKey="integrity" range={[100, 1000]} name="Etik Güven" />
                     <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                 <div className="bg-slate-900 p-8 rounded-[3rem] shadow-3xl text-white border border-white/10 animate-scale-in">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-orange-500 mb-4">{data.name}</p>
                                    <div className="space-y-2">
                                       <div className="flex justify-between gap-10">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase">Branş:</span>
                                          <span className="text-[10px] font-black text-white uppercase">{data.branch}</span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase">Liyakat:</span>
                                          <span className="text-[10px] font-black text-emerald-400 uppercase">%{data.merit}</span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase">Etik:</span>
                                          <span className="text-[10px] font-black text-blue-400 uppercase">%{data.integrity}</span>
                                       </div>
                                    </div>
                                 </div>
                              );
                           }
                           return null;
                        }}
                     />
                     <Scatter name="Adaylar" data={stats.correlationData}>
                        {stats.correlationData.map((entry, index) => (
                           <Cell 
                             key={`cell-${index}`} 
                             fill={entry.merit > 75 ? '#10b981' : entry.merit < 40 ? '#f43f5e' : '#ea580c'} 
                             strokeWidth={entry.integrity > 80 ? 4 : 1}
                             stroke={entry.integrity > 80 ? '#fff' : 'transparent'}
                           />
                        ))}
                     </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-slate-50 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
         </div>
      </div>

    </div>
  );
};

export default AnalyticsView;
