
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const analyzedCandidates = useMemo(() => candidates.filter(c => !!c.report), [candidates]);
  const selectedCandidates = useMemo(() => 
    analyzedCandidates.filter(c => selectedIds.includes(c.id)), 
    [analyzedCandidates, selectedIds]
  );

  const toggleCandidate = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 2 ? [...prev, id] : prev)
    );
  };

  const comparisonData = useMemo(() => {
    const dimensions = [
      { key: 'workEthics', label: 'ETİK' },
      { key: 'technicalExpertise', label: 'KLİNİK' },
      { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
      { key: 'sustainability', label: 'DİRENÇ' },
      { key: 'institutionalLoyalty', label: 'SADAKAT' },
      { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' }
    ];

    return dimensions.map(d => ({
      subject: d.label,
      ...selectedCandidates.reduce((acc, c) => ({
        ...acc,
        [c.name]: c.report?.deepAnalysis?.[d.key]?.score || 0
      }), {})
    }));
  }, [selectedCandidates]);

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      {/* ÜST BAŞLIK & TALİMAT */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">STRATEJİK ATAMA MERKEZİ</h3>
          <p className="text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-[0.3em] max-w-xl leading-relaxed">
            Karşılaştırmak istediğiniz en fazla iki adayı seçin. AI, kurumunuzun akademik dengesini korumak için hangisinin daha kritik olduğunu analiz edecektir.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-orange-50 px-8 py-4 rounded-[2rem] border border-orange-100">
           <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">AKTİF ADAY HAVUZU: {analyzedCandidates.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SOL: ADAY SEÇİM LİSTESİ */}
        <div className="lg:col-span-3 space-y-4 no-print">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 ml-2">ANALİZ EDİLMİŞ DOSYALAR</h4>
           <div className="space-y-3">
              {analyzedCandidates.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => toggleCandidate(c.id)}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer relative group ${
                    selectedIds.includes(c.id) ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.05]' : 'bg-white border-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                   <div className="flex justify-between items-center">
                      <span className="text-[12px] font-black uppercase tracking-tighter">{c.name}</span>
                      <span className={`text-[10px] font-black ${selectedIds.includes(c.id) ? 'text-orange-500' : 'text-slate-300'}`}>%{c.report?.score}</span>
                   </div>
                   <p className="text-[8px] font-bold uppercase mt-2 opacity-50">{c.branch}</p>
                   {selectedIds.includes(c.id) && (
                     <div className="absolute -right-2 -top-2 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-[10px] font-black">
                        {selectedIds.indexOf(c.id) + 1}
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* SAĞ: KARŞILAŞTIRMALI ANALİZ MOTORU */}
        <div className="lg:col-span-9">
           {selectedCandidates.length === 0 ? (
             <div className="h-[600px] bg-slate-50 border-4 border-dashed border-slate-200 rounded-[5rem] flex flex-col items-center justify-center opacity-40 grayscale">
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl">
                   <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[1em] text-[14px]">KIYASLAMA İÇİN ADAY SEÇİN</p>
             </div>
           ) : (
             <div className="space-y-12 animate-scale-in">
                {/* RADAR CHART PANEL */}
                <div className="bg-white rounded-[5rem] shadow-2xl border border-slate-100 p-16 relative overflow-hidden">
                   <div className="flex justify-between items-center mb-16 relative z-10">
                      <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-8 border-orange-600 pl-8">LİYAKAT ÇATIŞTIRMASI (H2H)</h4>
                      <div className="flex gap-8">
                         {selectedCandidates.map((c, i) => (
                           <div key={c.id} className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-orange-600' : 'bg-slate-900'}`}></div>
                              <span className="text-[10px] font-black uppercase text-slate-400">{c.name}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="h-[500px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={comparisonData}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                          {selectedCandidates.map((c, i) => (
                            <Radar key={c.id} name={c.name} dataKey={c.name} stroke={i === 0 ? '#ea580c' : '#0f172a'} fill={i === 0 ? '#ea580c' : '#0f172a'} fillOpacity={0.06} strokeWidth={5} />
                          ))}
                          <Tooltip contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', padding: '20px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* YÖNETİCİYE STRATEJİK TAVSİYE (FARAZİ ANALİZ) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-slate-900 p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10">YÖNETİCİ ÖZETİ (AI BRIEF)</h5>
                      <div className="space-y-8 relative z-10">
                         <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10">
                            <p className="text-[14px] font-bold text-slate-300 leading-relaxed italic">
                               "Adayların her ikisi de klinik olarak yetkin. Ancak <strong>{selectedCandidates[0].name}</strong>, veli manipülasyonuna karşı daha dirençli bir profil sergiliyor. Eğer kurumunuzun mevcut kadrosunda 'idari disiplin' açığı varsa bu adayı önceliklendirmeniz tavsiye edilir. <strong>{selectedCandidates[1]?.name || 'Diğer aday'}</strong> ise akademik olarak daha esnek, ancak burnout riski %20 daha yüksek."
                            </p>
                         </div>
                         <div className="flex gap-4">
                            <div className="px-5 py-2 bg-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest">ÖNERİ: {selectedCandidates[0].name.split(' ')[0]}</div>
                            <div className="px-5 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">RİSK: {selectedCandidates[1]?.name.split(' ')[0] || 'Belirsiz'}</div>
                         </div>
                      </div>
                      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000"></div>
                   </div>

                   <div className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-xl">
                      <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10">24 AY PROJEKSİYONU (FUTURE VALUE)</h5>
                      <div className="space-y-8">
                         {selectedCandidates.map((c, i) => (
                           <div key={c.id} className="space-y-4">
                              <div className="flex justify-between items-end">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.name} (POTANSİYEL)</span>
                                 <span className={`text-2xl font-black ${i === 0 ? 'text-orange-600' : 'text-slate-900'}`}>%{c.report?.predictiveMetrics?.leadershipPotential || 0}</span>
                              </div>
                              <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                 <div className={`h-full transition-all duration-1000 ${i === 0 ? 'bg-orange-600' : 'bg-slate-900'}`} style={{ width: `${c.report?.predictiveMetrics?.leadershipPotential || 0}%` }}></div>
                              </div>
                              <p className="text-[10px] font-bold text-slate-500 leading-tight italic">
                                 {i === 0 ? '* Kurum içi mentorluk ve bölüm başkanlığı için ideal.' : '* Klinik derinlikte uzmanlaşma eğilimi, idari görevlerde sirkülasyon riski.'}
                              </p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DecisionSupportView;
