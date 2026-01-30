
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import DecisionAdvisorChat from './DecisionAdvisorChat';

interface DecisionSupportViewProps {
  candidates: Candidate[];
  config: GlobalConfig;
}

const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({ candidates, config }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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

  const dimensions = [
    { key: 'workEthics', label: 'İŞ AHLAKI' },
    { key: 'technicalExpertise', label: 'KLİNİK DERİNLİK' },
    { key: 'pedagogicalAnalysis', label: 'PEDAGOJİ' },
    { key: 'sustainability', label: 'DİRENÇ' },
    { key: 'institutionalLoyalty', label: 'SADAKAT' },
    { key: 'parentStudentRelations', label: 'VELİ YÖNETİMİ' },
    { key: 'formality', label: 'RESMİYET' }
  ];

  // Delta Analizi: İki aday arasındaki net puan farkı
  const deltaData = useMemo(() => {
    if (selectedCandidates.length !== 2) return [];
    return dimensions.map(d => {
      const val1 = selectedCandidates[0].report?.deepAnalysis?.[d.key]?.score || 0;
      const val2 = selectedCandidates[1].report?.deepAnalysis?.[d.key]?.score || 0;
      return {
        subject: d.label,
        diff: val1 - val2,
        absDiff: Math.abs(val1 - val2),
        winner: val1 > val2 ? selectedCandidates[0].name.split(' ')[0] : selectedCandidates[1].name.split(' ')[0]
      };
    }).sort((a, b) => b.absDiff - a.absDiff);
  }, [selectedCandidates]);

  const comparisonData = useMemo(() => {
    return dimensions.map(d => ({
      subject: d.label,
      ...selectedCandidates.reduce((acc, c) => ({
        ...acc,
        [c.name]: c.report?.deepAnalysis?.[d.key]?.score || 0
      }), {})
    }));
  }, [selectedCandidates]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
      {/* HEADER: COMPACT STRATEGIC BAR */}
      <div className="flex flex-row justify-between items-center gap-6 bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden shrink-0">
        <div className="relative z-10 flex items-center gap-6">
           <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner border border-white/5">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
           </div>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">KRİTİK ATAMA MODÜLÜ</span>
                 <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">VERİ TABANLI TAHKİM</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight uppercase leading-none text-white">Akademik Karar Destek</h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1 italic opacity-80 uppercase tracking-wide">
                "İnsan kaynağını sadece 'sayılarla' değil, 'kurumsal DNA' ile eşleştiriyoruz."
              </p>
           </div>
        </div>
        <div className="relative z-10">
           <button 
             onClick={() => setIsChatOpen(true)}
             disabled={selectedCandidates.length < 2}
             className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-lg disabled:opacity-30 active:scale-95 flex items-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             AI MUHAKEME PANELİ
           </button>
        </div>
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-orange-600/10 rounded-full blur-[60px]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* SOL: ADAY MATRİS SEÇİCİ (Compact List) */}
        <div className="xl:col-span-3 space-y-4 no-print">
           <div className="p-5 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-l-4 border-orange-600 pl-3">DOSYA HAVUZU</h4>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {analyzedCandidates.length === 0 ? (
                  <p className="text-[10px] font-bold text-slate-300 uppercase py-6 text-center">Analiz verisi yok.</p>
                ) : (
                  analyzedCandidates.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => toggleCandidate(c.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${
                        selectedIds.includes(c.id) 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg translate-x-1' 
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-orange-200 hover:bg-white'
                      }`}
                    >
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-black uppercase tracking-tight truncate pr-2">{c.name}</span>
                          <span className={`text-[10px] font-black ${selectedIds.includes(c.id) ? 'text-orange-500' : 'text-slate-400'}`}>%{c.report?.score}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${c.report && c.report.score > 75 ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                          <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">{(c.branch as string).split(' ')[0]}</span>
                       </div>
                       {selectedIds.includes(c.id) && (
                         <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-md border-2 border-white">
                            {selectedIds.indexOf(c.id) + 1}
                         </div>
                       )}
                    </div>
                  ))
                )}
              </div>
           </div>

           <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-[9px] font-bold text-orange-800 leading-snug uppercase tracking-tight">
                * Stratejik kıyaslama için 2 aday seçiniz. AI, "Kritik Sapma" noktalarını otomatik belirler.
              </p>
           </div>
        </div>

        {/* SAĞ: HAREKAT MERKEZİ (Compact Workspace) */}
        <div className="xl:col-span-9 space-y-6">
           {selectedCandidates.length < 2 ? (
             <div className="h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-50 relative overflow-hidden">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                   <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.5em] mb-2">SİNERJİ MATRİSİ</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kıyaslamak istediğiniz iki dosyayı sol panelden aktive edin.</p>
             </div>
           ) : (
             <div className="space-y-6 animate-scale-in">
                
                {/* 1. LAYER: RADAR SPECTRUM COMPARISON */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                   <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-6 relative z-10">
                         <div>
                            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4 leading-none py-1">Klinik Spektrum (H2H)</h4>
                         </div>
                         <div className="flex items-center gap-3">
                            {selectedCandidates.map((c, i) => (
                              <div key={c.id} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                 <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-orange-600' : 'bg-slate-900'}`}></div>
                                 <span className="text-[9px] font-black uppercase text-slate-600">{c.name.split(' ')[0]}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="h-[350px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={comparisonData}>
                             <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                             <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                             {selectedCandidates.map((c, i) => (
                               <Radar 
                                 key={c.id} 
                                 name={c.name} 
                                 dataKey={c.name} 
                                 stroke={i === 0 ? '#ea580c' : '#0f172a'} 
                                 fill={i === 0 ? '#ea580c' : '#0f172a'} 
                                 fillOpacity={i === 0 ? 0.1 : 0.05} 
                                 strokeWidth={i === 0 ? 3 : 2}
                                 dot={{ r: 3, fill: i === 0 ? '#ea580c' : '#0f172a', strokeWidth: 0 }}
                               />
                             ))}
                             <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', padding: '10px', fontSize: '10px', fontWeight: 'bold' }} />
                           </RadarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   {/* 2. LAYER (RIGHT): QUICK VERDICT */}
                   <div className="lg:col-span-4 flex flex-col gap-6">
                      <div className="flex-1 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between group border border-slate-800">
                         <div className="relative z-10">
                            <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-3">ÜST KURUL ÖZETİ</h5>
                            <p className="text-[12px] font-medium text-slate-300 leading-relaxed italic">
                               "En keskin ayrışma <strong>{deltaData[0]?.subject}</strong> alanındadır. <strong>{selectedCandidates[0].name.split(' ')[0]}</strong> sadakat noktasında daha stabil iken, <strong>{selectedCandidates[1].name.split(' ')[0]}</strong> teknik derinlikte öndedir."
                            </p>
                         </div>
                         <div className="mt-6 relative z-10">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">TAVSİYE:</span>
                            <div className="px-4 py-2 bg-orange-600 rounded-lg inline-block text-[11px] font-black uppercase tracking-widest shadow-lg">
                               {selectedCandidates[0].report!.score >= selectedCandidates[1].report!.score ? selectedCandidates[0].name.split(' ')[0] : selectedCandidates[1].name.split(' ')[0]} (ÖNCELİKLİ)
                            </div>
                         </div>
                      </div>

                      <div className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col justify-center text-center">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">GENEL SKOR KIYAS</span>
                         <div className="flex items-center justify-center gap-4">
                            <div className="space-y-1">
                               <p className="text-2xl font-black text-slate-900">%{selectedCandidates[0].report?.score}</p>
                               <div className="w-8 h-1 bg-orange-600 mx-auto rounded-full"></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-300">VS</span>
                            <div className="space-y-1">
                               <p className="text-2xl font-black text-slate-400">%{selectedCandidates[1].report?.score}</p>
                               <div className="w-8 h-1 bg-slate-200 mx-auto rounded-full"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 3. LAYER: DELTA ANALYSIS BENTO */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                      <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 border-l-4 border-orange-600 pl-4">DELTA (SAPMA)</h4>
                      <div className="h-[250px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deltaData} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 0 }} barCategoryGap={2}>
                               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                               <XAxis type="number" hide domain={[-50, 50]} />
                               <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} width={90} />
                               <Tooltip 
                                 cursor={{ fill: '#f8fafc' }}
                                 contentStyle={{ fontSize: '10px', borderRadius: '8px', padding: '5px' }}
                               />
                               <Bar dataKey="diff" radius={[4, 4, 4, 4]} barSize={12}>
                                  {deltaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.diff > 0 ? '#ea580c' : '#0f172a'} />
                                  ))}
                                </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="flex justify-between items-center mt-4 px-6 text-[8px] font-black uppercase tracking-widest text-slate-400">
                         <span>← {selectedCandidates[1].name.split(' ')[0]}</span>
                         <span>{selectedCandidates[0].name.split(' ')[0]} →</span>
                      </div>
                   </div>

                   <div className="lg:col-span-5 bg-[#FAFAFA] p-8 rounded-[2.5rem] border border-slate-200 flex flex-col justify-center space-y-4">
                      <div className="space-y-3">
                         <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">NÖRAL AYRIŞMA</h5>
                         {deltaData.slice(0, 3).map((d, i) => (
                           <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${d.diff > 0 ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white'}`}>
                                 {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h6 className="text-[9px] font-black text-slate-900 uppercase tracking-tight truncate">{d.subject}</h6>
                                 <p className="text-[9px] font-semibold text-slate-500 leading-tight">
                                    {Math.abs(d.diff) > 20 ? 'Kritik Ayrışma' : 'Standart'} • %{Math.abs(d.diff)} fark.
                                 </p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* 4. LAYER: FUTURE PROJECTION (COMPACT) */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 relative overflow-hidden">
                   <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-orange-600 pl-4">24 AY PROJEKSİYONU</h4>
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 relative z-10">
                      {selectedCandidates.map((c, i) => (
                        <div key={c.id} className="space-y-4">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md ${i === 0 ? 'bg-orange-600' : 'bg-slate-900'}`}>
                                 {c.name.charAt(0)}
                              </div>
                              <div>
                                 <h5 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">{c.name}</h5>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kariyer Yörüngesi</p>
                              </div>
                           </div>
                           <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic opacity-90">
                                 "{c.report?.predictiveMetrics?.evolutionPath || 'Hesaplanıyor...'}"
                              </p>
                           </div>
                           <div className="flex gap-4">
                              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">LİDERLİK</p>
                                 <p className={`text-xl font-black ${i === 0 ? 'text-orange-600' : 'text-slate-900'}`}>%{c.report?.predictiveMetrics?.leadershipPotential}</p>
                              </div>
                              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SADAKAT</p>
                                 <p className={`text-xl font-black ${i === 0 ? 'text-orange-600' : 'text-slate-900'}`}>%{c.report?.predictiveMetrics?.retentionProbability}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* MUHAKEME CHAT OVERLAY */}
      {isChatOpen && selectedCandidates.length === 2 && (
        <DecisionAdvisorChat 
          candidates={selectedCandidates} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default DecisionSupportView;
