
import React, { useMemo } from 'react';
import { Candidate } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';

const COLORS = ['#ea580c', '#0f172a', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9'];

const AnalyticsView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  
  const stats = useMemo(() => {
    if (!candidates.length) return null;

    // 1. Branş Dağılımı
    const branchMap = candidates.reduce((acc: any, c) => {
      acc[c.branch] = (acc[c.branch] || 0) + 1;
      return acc;
    }, {});
    const branchData = Object.keys(branchMap).map(k => ({ name: k, value: branchMap[k] }));

    // 2. Skor Dağılımı (Histogram Mantığı)
    const scoreRanges = [
      { name: '0-40', value: 0 },
      { name: '41-60', value: 0 },
      { name: '61-80', value: 0 },
      { name: '81-100', value: 0 }
    ];
    candidates.forEach(c => {
      const score = c.report?.score || 0;
      if (score <= 40) scoreRanges[0].value++;
      else if (score <= 60) scoreRanges[1].value++;
      else if (score <= 80) scoreRanges[2].value++;
      else scoreRanges[3].value++;
    });

    // 3. Deneyim / Skor Korelasyonu
    const correlationData = candidates
      .filter(c => c.report)
      .map(c => ({
        x: c.experienceYears,
        y: c.report!.score,
        name: c.name
      }));

    // 4. Genel Metrikler
    const avgScore = Math.round(candidates.reduce((a, b) => a + (b.report?.score || 0), 0) / candidates.length);
    const hiringRate = Math.round((candidates.filter(c => c.status === 'hired').length / candidates.length) * 100);
    const topBranch = branchData.sort((a, b) => b.value - a.value)[0]?.name || 'Belirsiz';

    return { branchData, scoreRanges, correlationData, avgScore, hiringRate, topBranch };
  }, [candidates]);

  if (!stats) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center text-center p-20 opacity-40">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2M17 9V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2M9 9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2" /></svg>
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Analiz Motoru Beklemede</p>
        <p className="text-slate-300 font-bold text-[10px] mt-4 uppercase">Yeterli veri toplandığında stratejik grafikler burada belirecektir.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Üst Metrik Kartları (Bento Top) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Toplam Aday</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-slate-900 leading-none">{candidates.length}</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Aktif Havuz</span>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Akademik Ortalaması</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black leading-none">%{stats.avgScore}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Liyakat Katsayısı</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-600/10 rounded-full blur-2xl"></div>
        </div>
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">İşe Alım Verimi</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-slate-900 leading-none">%{stats.hiringRate}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dönüşüm Oranı</span>
          </div>
        </div>
        <div className="bg-orange-600 p-8 rounded-[3rem] shadow-2xl text-white">
          <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-2">En Yoğun Branş</p>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-tighter leading-tight">{stats.topBranch.split(' ')[0]}</span>
            <span className="text-[10px] font-bold text-orange-200 uppercase mt-2">Doygunluk Sinyali</span>
          </div>
        </div>
      </div>

      {/* Ana Analitik Bloğu (Bento Middle) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sol: Branş Dağılımı (Donut) */}
        <div className="lg:col-span-5 bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 relative">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">Branş Dağılım Matrisi</h4>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.branchData}
                  cx="50%" cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.branchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
             {stats.branchData.map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase truncate">{entry.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Sağ: Skor Dağılım Grafiği (Area) */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">Aday Kalite Spektrumu</h4>
           <div className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.scoreRanges}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ stroke: '#ea580c', strokeWidth: 2 }} contentStyle={{ borderRadius: '15px' }} />
                  <Area type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
           <p className="text-center text-[9px] font-bold text-slate-400 uppercase mt-4 tracking-widest">Skor Aralıklarına Göre Aday Yoğunluğu</p>
        </div>
      </div>

      {/* Alt Panel: Korelasyon ve AI Insights (Bento Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Korelasyon Grafiği */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">Deneyim / Liyakat Korelasyonu</h4>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="x" name="Deneyim" unit=" Yıl" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                  <YAxis type="number" dataKey="y" name="Skor" unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                  <ZAxis type="number" range={[100, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Adaylar" data={stats.correlationData} fill="#ea580c" shape="circle" />
                </ScatterChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* AI Stratejik İçgörü */}
        <div className="lg:col-span-4 bg-orange-50 p-10 rounded-[4rem] border-2 border-orange-100 flex flex-col justify-between relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                </div>
                <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">AI Stratejik İçgörü</h4>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-black text-slate-900 leading-tight uppercase">
                  {stats.avgScore > 70 ? 'Havuz Kalitesi Yüksek' : 'Eğitim Yatırımı Şart'}
                </p>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                  Mevcut aday havuzu verilerine göre, {stats.topBranch} alanında doygunluk varken, mülakat başarısı %{stats.hiringRate} seviyesinde seyrediyor. Akademik kurulun liyakat kriterlerini {stats.avgScore < 50 ? 'esnetmesi' : 'koruması'} önerilir.
                </p>
              </div>
           </div>
           <button className="relative z-10 mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
             DETAYLI RAPOR ÜRET
           </button>
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
