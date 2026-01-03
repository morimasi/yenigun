
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AIReport } from '../types';

interface CandidateReportProps {
  report: AIReport;
  name: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
          {payload[0].payload.name}
        </p>
        <p className="text-sm font-bold text-white">
          Yetkinlik Skoru: %{payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CandidateReport: React.FC<CandidateReportProps> = ({ report, name }) => {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Score Card */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden animate-fade-in transition-all hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-[60px] opacity-60"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Yapay Zeka Analizi</span>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none animate-fade-in">{name}</h3>
              
              <div className="mt-6 space-y-4 animate-fade-in stagger-1">
                <p className="text-slate-500 font-bold text-lg leading-relaxed italic">
                  "{report.summary}"
                </p>
                {report.cvSummary && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in stagger-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Özgeçmiş Analizi</span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{report.cvSummary}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center animate-scale-in">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * report.score) / 100} className="text-orange-600 transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900">{report.score}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Puan</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl transition-all hover:shadow-orange-100 hover:scale-[1.01] animate-fade-in stagger-3">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-600 rounded-lg animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-white text-sm uppercase tracking-widest">Kurumsal Karar Tavsiyesi</h4>
            </div>
            <p className="text-slate-300 text-lg font-semibold leading-relaxed">
              {report.recommendation}
            </p>
          </div>
        </div>

        {/* Competency Chart */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center animate-fade-in transition-all hover:shadow-2xl">
          <h4 className="font-extrabold text-slate-800 mb-8 uppercase tracking-widest text-xs">Yetkinlik Profili</h4>
          <div className="w-full h-80 animate-scale-in stagger-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.competencies}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }} 
                  iconType="diamond"
                />
                <Radar
                  name="Mevcut Potansiyel"
                  dataKey="value"
                  stroke="#ea580c"
                  fill="#ea580c"
                  fillOpacity={0.6}
                  activeDot={{ r: 6, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 w-full">
            {report.competencies.map((comp, idx) => (
              <div key={idx} className="flex flex-col items-center p-2 bg-slate-50 rounded-xl border border-slate-100/50 animate-fade-in transition-all hover:bg-orange-50" style={{ animationDelay: `${idx * 0.1}s` }}>
                <span className="text-[9px] font-black text-slate-400 uppercase truncate w-full text-center">{comp.name}</span>
                <span className="text-sm font-bold text-slate-700">% {comp.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SWOT Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Strengths */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border-t-4 border-orange-600 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in stagger-1">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <span className="text-xl font-black">S</span>
          </div>
          <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Güçlü Yönler</h5>
          <ul className="space-y-4">
            {report.swot.strengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 font-medium flex items-start animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3 mt-1.5 shrink-0"></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border-t-4 border-slate-400 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in stagger-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <span className="text-xl font-black">W</span>
          </div>
          <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Zayıf Yönler</h5>
          <ul className="space-y-4">
            {report.swot.weaknesses.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 font-medium flex items-start animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-1.5 shrink-0"></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border-t-4 border-emerald-500 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in stagger-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <span className="text-xl font-black">O</span>
          </div>
          <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Fırsatlar</h5>
          <ul className="space-y-4">
            {report.swot.opportunities.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 font-medium flex items-start animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3 mt-1.5 shrink-0"></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border-t-4 border-rose-500 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in stagger-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <span className="text-xl font-black">T</span>
          </div>
          <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Risk Faktörleri</h5>
          <ul className="space-y-4">
            {report.swot.threats.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 font-medium flex items-start animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-3 mt-1.5 shrink-0"></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
