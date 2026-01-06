
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { AIReport } from '../types';

interface CandidateReportProps {
  report: AIReport;
  name: string;
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
          {payload[0].payload.name}
        </p>
        <p className="text-sm font-bold text-white">
          Skor: %{payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CategoricalTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xl min-w-[200px]">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{data.category} Analizi</h5>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500">Aday Skoru:</span>
            <span className="text-sm font-black text-slate-900">% {data.score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500">Akademi Eşiği:</span>
            <span className="text-sm font-black text-orange-600">% {data.average}</span>
          </div>
          <div className="pt-2 border-t border-slate-50">
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
              data.score >= data.average ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {data.label}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CandidateReport: React.FC<CandidateReportProps> = ({ report, name }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden transition-all hover:shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full blur-[80px] opacity-60"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 text-white mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Akademi Onaylı AI Raporu</span>
            </div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6">{name}</h3>
            
            <p className="text-slate-500 font-bold text-xl leading-relaxed italic max-w-2xl mb-8">
              "{report.summary}"
            </p>

            <div className="p-6 bg-orange-50/50 rounded-[2.5rem] border border-orange-100/50">
               <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-600 rounded-xl">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-widest">Nihai Karar Tavsiyesi</h4>
               </div>
               <p className="text-slate-800 text-lg font-bold leading-relaxed">{report.recommendation}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={452} strokeDashoffset={452 - (452 * report.score) / 100} className="text-orange-600 transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{report.score}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Uygunluk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section: Bar Chart & Radar Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Categorical Bar Chart */}
        <div className="xl:col-span-8 bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-[0.2em]">Kategorik Performans Dağılımı</h4>
              <p className="text-slate-400 text-xs font-bold mt-1">Sütunlar adayı, yatay çizgi Akademi eşiğini gösterir.</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase">Aday</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase">Eşik</span>
               </div>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.categoricalScores} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} 
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CategoricalTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar 
                  dataKey="score" 
                  radius={[12, 12, 4, 4]} 
                  barSize={50}
                >
                  {report.categoricalScores.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score >= entry.average ? '#ea580c' : '#94a3b8'} 
                    />
                  ))}
                </Bar>
                {/* Visual average line for each bar logic is implicit in Tooltip, 
                    but we can color code cells based on threshold */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar Chart */}
        <div className="xl:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center text-white relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px] relative z-10">Yetkinlik Dengesi</h4>
          <div className="w-full h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.competencies}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} 
                />
                <Radar
                  name="Aday"
                  dataKey="value"
                  stroke="#ea580c"
                  fill="#ea580c"
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 text-center">Analitik Yetkinlik Matrisi</p>
        </div>
      </div>

      {/* SWOT Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { key: 'strengths', label: 'Güçlü Yönler', color: 'orange', code: 'S' },
          { key: 'weaknesses', label: 'Zayıf Yönler', color: 'slate', code: 'W' },
          { key: 'opportunities', label: 'Fırsatlar', color: 'emerald', code: 'O' },
          { key: 'threats', label: 'Riskler (Red Flags)', color: 'rose', code: 'T' }
        ].map((item, idx) => (
          <div 
            key={item.key} 
            className={`bg-white p-8 rounded-[2.5rem] shadow-lg border-t-8 transition-all hover:-translate-y-2 duration-500 animate-fade-in ${
              item.color === 'orange' ? 'border-orange-600' : 
              item.color === 'slate' ? 'border-slate-400' : 
              item.color === 'emerald' ? 'border-emerald-500' : 'border-rose-500'
            }`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black mb-6 ${
              item.color === 'orange' ? 'bg-orange-50 text-orange-600' : 
              item.color === 'slate' ? 'bg-slate-50 text-slate-600' : 
              item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {item.code}
            </div>
            <h5 className="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-6">{item.label}</h5>
            <ul className="space-y-4">
              {(report.swot as any)[item.key].map((s: string, i: number) => (
                <li key={i} className="text-sm text-slate-600 font-bold flex items-start gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    item.color === 'orange' ? 'bg-orange-500' : 
                    item.color === 'slate' ? 'bg-slate-400' : 
                    item.color === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateReport;
