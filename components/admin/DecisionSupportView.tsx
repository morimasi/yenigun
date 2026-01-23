
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import DecisionAdvisorChat from './DecisionAdvisorChat';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const selectedCandidates = useMemo(() => 
    candidates.filter(c => selectedIds.includes(c.id)), 
    [candidates, selectedIds]
  );

  const comparisonData = useMemo(() => {
    if (selectedCandidates.length === 0) return [];
    
    // Yetkinlik isimlerini normalize et
    const metrics = ['ethics', 'pedagogy', 'clinicalWisdom', 'stressResponse', 'emotionalResilience', 'institutionalFit'];
    const metricLabels: Record<string, string> = {
      ethics: 'Etik', pedagogy: 'Pedagoji', clinicalWisdom: 'Klinik', 
      stressResponse: 'Kriz', emotionalResilience: 'Direnç', institutionalFit: 'Uyum'
    };

    return metrics.map(m => {
      const entry: any = { subject: metricLabels[m] };
      selectedCandidates.forEach(c => {
        entry[c.name] = (c.report?.detailedAnalysis as any)?.[m]?.score || 0;
      });
      return entry;
    });
  }, [selectedCandidates]);

  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 3 ? [...prev, id] : prev)
    );
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Karar Destek Merkezi</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Liyakat Bazlı Aday Karşılaştırma ve AI Danışmanlığı</p>
        </div>
        <div className="flex gap-4">
           {selectedIds.length > 0 && (
             <button 
               onClick={() => setIsAdvisorOpen(true)}
               className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:scale-105 transition-all flex items-center gap-3"
             >
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
               AI DANIŞMANINA SOR ({selectedIds.length})
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ADAY SEÇİM PANELİ */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[650px]">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> KARŞILAŞTIRMA HAVUZU (MAX 3)
          </h4>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {candidates.filter(c => !!c.report).map(c => (
              <div 
                key={c.id} 
                onClick={() => toggleCandidate(c.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer group flex items-center gap-4 ${
                  selectedIds.includes(c.id) ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] ${selectedIds.includes(c.id) ? 'bg-orange-600' : 'bg-white shadow-sm'}`}>
                  {c.report?.score}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[11px] font-black uppercase truncate">{c.name}</p>
                   <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${selectedIds.includes(c.id) ? 'text-slate-400' : 'text-slate-400'}`}>{c.branch.split(' ')[0]}</p>
                </div>
                {selectedIds.includes(c.id) && (
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center animate-scale-in">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KARŞILAŞTIRMA MATRİSİ */}
        <div className="lg:col-span-8 space-y-8">
           {selectedIds.length === 0 ? (
             <div className="h-[650px] bg-slate-50 border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-sm">
                  <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs leading-relaxed">Karşılaştırmak İçin En Az<br/>İki Aday Seçiniz</p>
             </div>
           ) : (
             <>
               <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 relative overflow-hidden">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-10 border-l-4 border-orange-600 pl-4">YETKİNLİK ÖRTÜŞME ANALİZİ</h4>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={comparisonData}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontBold: 900, fill: '#94a3b8' }} />
                        {selectedCandidates.map((c, idx) => (
                          <Radar 
                            key={c.id}
                            name={c.name} 
                            dataKey={c.name} 
                            stroke={idx === 0 ? '#ea580c' : idx === 1 ? '#0f172a' : '#64748b'} 
                            fill={idx === 0 ? '#ea580c' : idx === 1 ? '#0f172a' : '#64748b'} 
                            fillOpacity={0.3} 
                          />
                        ))}
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '40px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {selectedCandidates.map((c, idx) => (
                   <div key={c.id} className={`p-8 rounded-[3rem] border transition-all ${idx === 0 ? 'bg-orange-50 border-orange-100 shadow-xl' : 'bg-white border-slate-100 shadow-md'}`}>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Aday {idx + 1}</p>
                      <h5 className="text-lg font-black text-slate-900 uppercase tracking-tighter truncate">{c.name}</h5>
                      <div className="mt-6 space-y-4">
                         <div className="p-4 bg-white rounded-2xl border border-slate-100">
                            <span className="text-[7px] font-black text-orange-600 uppercase block mb-1">En Güçlü Yan</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-tight">{c.report?.swot.strengths[0] || 'Veri Yok'}</p>
                         </div>
                         <div className="p-4 bg-white rounded-2xl border border-slate-100">
                            <span className="text-[7px] font-black text-rose-600 uppercase block mb-1">Temel Risk</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-tight">{c.report?.swot.weaknesses[0] || 'Veri Yok'}</p>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             </>
           )}
        </div>
      </div>

      {isAdvisorOpen && (
        <DecisionAdvisorChat 
          candidates={selectedCandidates} 
          onClose={() => setIsAdvisorOpen(false)} 
        />
      )}
    </div>
  );
};

export default DecisionSupportView;
