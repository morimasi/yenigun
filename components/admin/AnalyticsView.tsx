
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
      if (!acc[c.branch]) acc[c.branch] = { name: c.branch, count: 0, totalScore: 0, totalCompliance: 0 };
      acc[c.branch].count++;
      acc[c.branch].totalScore += (c.report?.score || 0);
      acc[c.branch].totalCompliance += (c.algoReport?.branchComplianceScore || 0);
      return acc;
    }, {});

    const branchData = Object.values(branchStats).map((b: any) => ({
      ...b,
      avgScore: Math.round(b.totalScore / b.count),
      avgCompliance: Math.round(b.totalCompliance / b.count)
    }));

    const totalA = candidates.length;
    const avgCompliance = Math.round(candidates.reduce((a, b) => a + (b.algoReport?.branchComplianceScore || 0), 0) / totalA);
    const highPotentialCount = candidates.filter(c => (c.report?.score || 0) > 80).length;

    return { branchData, avgCompliance, highPotentialCount, totalA };
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

  if (!stats) return <div className="p-10 text-center text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">Liyakat Matrisi Yükleniyor...</div>;

  return (
    <div className="space-y-6 p-2 h-full overflow-y-auto custom-scrollbar">
      
      {/* 1. COMPACT KPI STRIP */}
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TOPLAM HAVUZ</p>
               <p className="text-3xl font-black text-slate-900">{stats.totalA}</p>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">HİPO ADAYLAR</p>
               <p className="text-2xl font-black text-orange-600">{stats.highPotentialCount}</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BRANŞ UYUM ORT.</p>
               <p className="text-2xl font-black text-orange-600">%{stats.avgCompliance}</p>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-orange-600" style={{ width: `${stats.avgCompliance}%` }}></div></div>
         </div>
         <div className="bg-slate-900 p-5 rounded-2xl shadow-lg text-white flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all" onClick={handlePoolAnalysis}>
            <div>
               <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">AKADEMİK STRATEJİ</p>
               <p className="text-[11px] font-bold text-slate-300 uppercase mt-1 leading-tight">{isPoolAnalysing ? 'İŞLENİYOR...' : 'POOL ANALİZİ BAŞLAT'}</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
               <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </div>
         </div>
      </div>

      {/* 2. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
         <div className="lg:col-span-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-orange-600 pl-4">BRANŞ BAZLI LİYAKAT VE UYUM ANALİZİ</h4>
               <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400"><div className="w-3 h-3 bg-slate-900 rounded-sm"></div> GENEL SKOR</div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> BRANŞ UYUMU</div>
               </div>
            </div>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.branchData} barGap={8}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="avgScore" name="Genel Skor" fill="#0f172a" barSize={32} radius={[6, 6, 0, 0]} />
                     <Bar dataKey="avgCompliance" name="Branş Uyum" fill="#ea580c" barSize={32} radius={[6, 6, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 3. AI STRATEGIC INSIGHTS */}
      {poolAiReport && (
         <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black">AI</div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">STRATEJİK HAVUZ RAPORU</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[12px] font-medium text-slate-600 leading-relaxed">
               <div className="space-y-2">
                  <strong className="text-slate-900 block uppercase text-[10px] tracking-widest text-orange-600">Yönetici Özeti</strong>
                  <p className="italic text-justify">"{poolAiReport.executiveSummary}"</p>
               </div>
               <div className="space-y-2">
                  <strong className="text-slate-900 block uppercase text-[10px] tracking-widest text-orange-600">Kritik Risk Alanı</strong>
                  <p className="font-bold text-rose-700">{poolAiReport.criticalRiskArea}</p>
               </div>
               <div className="space-y-2">
                  <strong className="text-slate-900 block uppercase text-[10px] tracking-widest text-orange-600">Atama Tavsiyesi</strong>
                  <p className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm">{poolAiReport.recommendedAction}</p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AnalyticsView;
