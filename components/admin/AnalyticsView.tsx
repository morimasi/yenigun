
import React, { useMemo } from 'react';
import { Candidate } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsView: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => {
  const data = useMemo(() => {
    const branches = candidates.reduce((acc: any, c) => {
      acc[c.branch] = (acc[c.branch] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(branches).map(k => ({ name: k, value: branches[k] }));
  }, [candidates]);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Başvuru</p>
          <p className="text-6xl font-black text-slate-900">{candidates.length}</p>
        </div>
        <div className="bg-orange-600 p-12 rounded-[4rem] shadow-2xl text-white">
          <p className="text-[10px] font-black text-orange-200 uppercase mb-2">Ortalama Skor</p>
          <p className="text-6xl font-black">%{Math.round(candidates.reduce((a,b) => a + (b.report?.score || 0), 0) / (candidates.length || 1))}</p>
        </div>
      </div>
      <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 h-[500px]">
        <h4 className="font-black text-slate-900 uppercase tracking-widest text-center mb-10">Branş Dağılımı</h4>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill="#ea580c" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsView;
