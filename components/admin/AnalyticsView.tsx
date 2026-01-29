
import React, { useMemo, useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { analyzeTalentPool } from '../../services/ai/poolService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Line, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';

const AnalyticsView: React.FC<{ candidates: Candidate[], config: GlobalConfig }> = ({ candidates, config }) => {
  const [isPoolAnalysing, setIsPoolAnalysing] = useState(false);
  const [poolAiReport, setPoolAiReport] = useState<any>(null);

  const stats = useMemo(() => {
    if (!candidates.length) return null;

    const branchStats = candidates.reduce((acc: any, c) => {
      if (!acc[c.branch]) acc[c.branch] = { name: c.branch, count: 0, totalScore: 0, highMeritCount: 0 };
      acc[c.branch].count++;
      acc[c.branch].totalScore += (c.report?.score || 0);
      if ((c.report?.score || 0) > 75) acc[c.branch].highMeritCount++;
      return acc;
    }, {});

    const branchData = Object.values(branchStats).map((b: any) => ({
      ...b,
      avgScore: Math.round(b.totalScore / b.count),
      meritRatio: Math.round((b.highMeritCount / b.count) * 100)
    }));

    const correlationData = candidates.filter(c => c.report).map(c => ({
      exp: c.experienceYears,
      merit: c.report!.score,
      integrity: c.report!.integrityIndex,
      name: c.name,
      branch: c.branch
    }));

    const totalA = candidates.length;
    const avgMerit = Math.round(candidates.reduce((a, b) => a + (b.report?.score || 0), 0) / totalA);
    const ethicalStability = Math.round(candidates.reduce((a, b) => a + (b.report?.integrityIndex || 0), 0) / totalA);
    const highPotentialCount = candidates.filter(c => (c.report?.score || 0) > 80).length;

    return { branchData, correlationData, avgMerit, ethicalStability, highPotentialCount, totalA };
  }, [candidates]);

  const handlePoolAnalysis = async () => {
    if (candidates.length < 3) return alert("Yetersiz veri.");
    setIsPoolAnalysing(true);
    try {
      const report = await analyzeTalentPool(candidates, config);
      setPoolAiReport(report);
    } catch (e) {
      alert("Analiz hatası.");
    } finally {
      setIsPoolAnalysing(false);
    }
  };

  if (!stats) return <div className="p-10 text-center text-xs font-bold text-slate-300">Veri Bekleniyor</div>;

  return (
    <div className="space-y-6 p-2 h-full overflow-y-auto custom-scrollbar">
      
      {/* 1. COMPACT KPI STRIP */}
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">HAVUZ</p>
               <p className="text-2xl font-black text-slate-900">{stats.totalA}</p>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">HİPO</p>
               <p className="text-xl font-black text-orange-600">{stats.highPotentialCount}</p>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ORT. LİYAKAT</p>
               <p className="text-xl font-black text-slate-900">%{stats.avgMerit}</p>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900" style={{ width: `${stats.avgMerit}%` }}></div></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ETİK GÜVEN</p>
               <p className="text-xl font-black text-emerald-600">%{stats.ethicalStability}</p>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${stats.ethicalStability}%` }}></div></div>
         </div>
         <div className="bg-slate-900 p-4 rounded-xl shadow-sm text-white flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors" onClick={handlePoolAnalysis}>
            <div>
               <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">AI STRATEJİ</p>
               <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{isPoolAnalysing ? 'İŞLENİYOR...' : 'RAPORU ÇEK'}</p>
            </div>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </div>
      </div>

      {/* 2. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px]">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">BRANŞ PERFORMANSI</h4>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={stats.branchData} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                     <Tooltip contentStyle={{ fontSize: '10px', padding: '5px', borderRadius: '4px' }} />
                     <Bar dataKey="avgScore" fill="#ea580c" barSize={12} radius={[0, 4, 4, 0]} background={{ fill: '#f8fafc' }} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">DENEYİM vs LİYAKAT DAĞILIMI</h4>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis type="number" dataKey="exp" name="Deneyim" unit="Y" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                     <YAxis type="number" dataKey="merit" name="Skor" unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} domain={[0, 100]} />
                     <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: '10px', padding: '5px' }} />
                     <Scatter name="Adaylar" data={stats.correlationData} fill="#0f172a">
                        {stats.correlationData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.merit > 80 ? '#10b981' : entry.merit < 50 ? '#f43f5e' : '#0f172a'} />
                        ))}
                     </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 3. AI INSIGHTS (IF AVAILABLE) */}
      {poolAiReport && (
         <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 animate-fade-in">
            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">AI STRATEJİK ÖZET</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-medium text-slate-600">
               <p><strong className="text-slate-900 block mb-1 uppercase text-[9px]">Genel Durum</strong> {poolAiReport.executiveSummary}</p>
               <p><strong className="text-slate-900 block mb-1 uppercase text-[9px]">Risk Alanı</strong> {poolAiReport.criticalRiskArea}</p>
               <p><strong className="text-slate-900 block mb-1 uppercase text-[9px]">Tavsiye</strong> {poolAiReport.recommendedAction}</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default AnalyticsView;
