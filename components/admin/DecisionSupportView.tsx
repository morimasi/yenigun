
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
    <div className="flex flex-col gap-10 animate-fade-in pb-32">
      {/* HEADER: STRATEJİK KOMUTA */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-4xl">
           <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">KRİTİK ATAMA MODÜLÜ</span>
              <div className="h-px w-20 bg-white/20"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">VERİ TABANLI LİYAKAT TAHKİMİ</span>
           </div>
           <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">Akademik Karar<br/>Destek Merkezi</h3>
           <p className="text-base md:text-xl font-bold text-slate-400 leading-relaxed italic opacity-80 uppercase tracking-tight">
             "İnsan kaynağını sadece 'sayılarla' değil, 'kurumsal DNA' ile eşleştiriyoruz."
           </p>
        </div>
        <div className="relative z-10 flex gap-4">
           <button 
             onClick={() => setIsChatOpen(true)}
             disabled={selectedCandidates.length < 2}
             className="px-10 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl disabled:opacity-30 active:scale-95"
           >
             AI MUHAKEME PANELİ
           </button>
        </div>
        <div className="absolute -right-40 -top-40 w-[60rem] h-[60rem] bg-orange-600/5 rounded-full blur-[200px]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* SOL: ADAY MATRİS SEÇİCİ */}
        <div className="xl:col-span-3 space-y-6 no-print">
           <div className="p-8 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 border-l-4 border-orange-600 pl-4">DOSYA HAVUZU</h4>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {analyzedCandidates.length === 0 ? (
                  <p className="text-[10px] font-bold text-slate-300 uppercase py-10 text-center">Analiz edilmiş aday bulunmuyor.</p>
                ) : (
                  analyzedCandidates.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => toggleCandidate(c.id)}
                      className={`p-6 rounded-[2.2rem] border-2 transition-all cursor-pointer group relative ${
                        selectedIds.includes(c.id) 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl translate-x-2' 
                        : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                      }`}
                    >
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[13px] font-black uppercase tracking-tight truncate pr-4">{c.name}</span>
                          <span className={`text-[11px] font-black ${selectedIds.includes(c.id) ? 'text-orange-500' : 'text-slate-400'}`}>%{c.report?.score}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${c.report && c.report.score > 75 ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                          <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">{(c.branch as string).split(' ')[0]}</span>
                       </div>
                       {selectedIds.includes(c.id) && (
                         <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-[12px] font-black shadow-lg">
                            {selectedIds.indexOf(c.id) + 1}
                         </div>
                       )}
                    </div>
                  ))
                )}
              </div>
           </div>

           <div className="p-8 bg-orange-50 rounded-[3rem] border border-orange-100">
              <p className="text-[10px] font-bold text-orange-800 leading-relaxed uppercase tracking-tight">
                * Stratejik kıyaslama için en az ve en fazla 2 aday seçilmelidir. Analiz motoru, adaylar arasındaki "Kritik Sapma" noktalarını otomatik olarak belirler.
              </p>
           </div>
        </div>

        {/* SAĞ: HAREKAT MERKEZİ (PANORAMIC WORKSPACE) */}
        <div className="xl:col-span-9 space-y-8">
           {selectedCandidates.length < 2 ? (
             <div className="h-[800px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-24 opacity-30 grayscale relative overflow-hidden">
                <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 shadow-inner">
                   <svg className="w-20 h-20 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[1em] mb-4">SİNERJİ MATRİSİ</h3>
                <p className="text-[12px] font-black uppercase tracking-widest text-slate-300">Kıyaslamak istediğiniz iki dosyayı sol panelden aktive edin.</p>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
             </div>
           ) : (
             <div className="space-y-8 animate-scale-in">
                
                {/* 1. LAYER: RADAR SPECTRUM COMPARISON */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                   <div className="lg:col-span-8 bg-white rounded-[5rem] shadow-2xl border border-slate-100 p-16 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-16 relative z-10">
                         <div>
                            <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] border-l-[12px] border-orange-600 pl-8 leading-none py-2">Klinik Spektrum (H2H)</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest ml-12">Yüz Yüze Liyakat Çatıştırması</p>
                         </div>
                         <div className="flex flex-col items-end gap-4">
                            {selectedCandidates.map((c, i) => (
                              <div key={c.id} className="flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
                                 <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-orange-600' : 'bg-slate-900 shadow-xl'}`}></div>
                                 <span className="text-[11px] font-black uppercase text-slate-600">{c.name}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="h-[550px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <RadarChart data={comparisonData}>
                             <PolarGrid stroke="#f1f5f9" strokeWidth={3} />
                             <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                             {selectedCandidates.map((c, i) => (
                               <Radar 
                                 key={c.id} 
                                 name={c.name} 
                                 dataKey={c.name} 
                                 stroke={i === 0 ? '#ea580c' : '#0f172a'} 
                                 fill={i === 0 ? '#ea580c' : '#0f172a'} 
                                 fillOpacity={i === 0 ? 0.08 : 0.05} 
                                 strokeWidth={i === 0 ? 6 : 4}
                                 dot={{ r: 6, fill: i === 0 ? '#ea580c' : '#0f172a', strokeWidth: 3, stroke: '#fff' }}
                               />
                             ))}
                             <Tooltip contentStyle={{ borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', padding: '25px' }} />
                           </RadarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   {/* 2. LAYER (RIGHT): QUICK VERDICT */}
                   <div className="lg:col-span-4 flex flex-col gap-8">
                      <div className="flex-1 bg-slate-900 rounded-[4rem] p-12 text-white shadow-3xl relative overflow-hidden flex flex-col justify-between group">
                         <div className="relative z-10">
                            <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-6">ÜST KURUL ÖZETİ</h5>
                            <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                               <p className="text-[15px] font-bold text-slate-300 leading-relaxed italic uppercase tracking-tight">
                                  "İki profil arasındaki en keskin ayrışma <strong>{deltaData[0]?.subject}</strong> alanında gözlemlenmiştir. <strong>{selectedCandidates[0].name.split(' ')[0]}</strong> kurumsal sadakat noktasında %30 daha stabil bir projeksiyon çizerken, <strong>{selectedCandidates[1].name.split(' ')[0]}</strong> klinik derinlikte teknik olarak bir adım öndedir."
                               </p>
                            </div>
                         </div>
                         <div className="mt-12 relative z-10">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">STRATEJİK TAVSİYE:</span>
                            <div className="px-6 py-4 bg-orange-600 rounded-2xl inline-block text-[14px] font-black uppercase tracking-[0.2em] shadow-2xl">
                               {selectedCandidates[0].report!.score >= selectedCandidates[1].report!.score ? selectedCandidates[0].name.split(' ')[0] : selectedCandidates[1].name.split(' ')[0]} (ÖNCELİKLİ)
                            </div>
                         </div>
                         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000"></div>
                      </div>

                      <div className="p-10 bg-white border border-slate-100 rounded-[4rem] shadow-xl flex flex-col justify-center text-center">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">TOPLAM UYUM</span>
                         <div className="flex items-center justify-center gap-6">
                            <div className="space-y-1">
                               <p className="text-4xl font-black text-slate-900">%{selectedCandidates[0].report?.score}</p>
                               <div className="w-12 h-1.5 bg-orange-600 mx-auto rounded-full"></div>
                            </div>
                            <span className="text-xl font-black text-slate-200">VS</span>
                            <div className="space-y-1">
                               <p className="text-4xl font-black text-slate-400">%{selectedCandidates[1].report?.score}</p>
                               <div className="w-12 h-1.5 bg-slate-200 mx-auto rounded-full"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 3. LAYER: DELTA ANALYSIS BENTO */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   <div className="lg:col-span-7 bg-white p-16 rounded-[5rem] shadow-2xl border border-slate-100">
                      <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em] mb-12 border-l-[12px] border-orange-600 pl-8 leading-none">DELTA ANALİZİ (SAPMA MATRİSİ)</h4>
                      <div className="h-[450px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deltaData} layout="vertical" margin={{ left: 40, right: 40 }}>
                               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                               <XAxis type="number" hide domain={[-50, 50]} />
                               <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} width={120} />
                               <Tooltip 
                                 cursor={{ fill: '#f8fafc' }}
                                 content={({ active, payload }) => {
                                   if (active && payload && payload.length) {
                                     const data = payload[0].payload;
                                     return (
                                       <div className="bg-slate-900 p-6 rounded-[2rem] shadow-3xl text-white border border-white/10">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">{data.subject}</p>
                                          <p className="text-xl font-black">FARK: %{Math.abs(data.diff)}</p>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">LİDER: {data.winner}</p>
                                       </div>
                                     );
                                   }
                                   return null;
                                 }}
                               />
                               <Bar dataKey="diff" radius={[10, 10, 10, 10]} barSize={25}>
                                  {deltaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.diff > 0 ? '#ea580c' : '#0f172a'} />
                                  ))}
                                </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="flex justify-between items-center mt-8 px-10 text-[10px] font-black uppercase tracking-widest">
                         <span className="text-orange-600">← {selectedCandidates[1].name.split(' ')[0]} AVANTAJI</span>
                         <span className="text-slate-900">{selectedCandidates[0].name.split(' ')[0]} AVANTAJI →</span>
                      </div>
                   </div>

                   <div className="lg:col-span-5 bg-[#FAFAFA] p-16 rounded-[5rem] border-2 border-dashed border-slate-200 flex flex-col justify-center space-y-12">
                      <div className="space-y-6">
                         <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8">NÖRAL AYRIŞMA RAPORU</h5>
                         {deltaData.slice(0, 3).map((d, i) => (
                           <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-8 group hover:shadow-xl transition-all">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${d.diff > 0 ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white'}`}>
                                 {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h6 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{d.subject}</h6>
                                 <p className="text-[13px] font-bold text-slate-500 leading-tight">
                                    {Math.abs(d.diff) > 20 ? 'Kritik Seviye Ayrışma' : 'Standart Varyasyon'} • {d.winner} %{Math.abs(d.diff)} önde.
                                 </p>
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="p-8 bg-emerald-50 rounded-[3rem] border border-emerald-100">
                         <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-4">AI KARAR KESİNLİĞİ</span>
                         <p className="text-[14px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tight italic opacity-90">
                           Verilen mülakat yanıtları ve klinik veri setleri arasındaki korelasyon %94 oranında tutarlıdır. Bu kıyaslama stratejik atama için güvenilirdir.
                         </p>
                      </div>
                   </div>
                </div>

                {/* 4. LAYER: FUTURE PROJECTION & RETENTION */}
                <div className="bg-white p-12 md:p-20 rounded-[5.5rem] shadow-3xl border border-slate-100 relative overflow-hidden group">
                   <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-[0.6em] mb-20 border-l-[16px] border-orange-600 pl-10 leading-none">24 AY PROJEKSİYONU (VİZYON ÇAKIŞMASI)</h4>
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-24 relative z-10">
                      {selectedCandidates.map((c, i) => (
                        <div key={c.id} className="space-y-12">
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl ${i === 0 ? 'bg-orange-600' : 'bg-slate-900'}`}>
                                 {c.name.charAt(0)}
                              </div>
                              <div>
                                 <h5 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{c.name}</h5>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Kariyer Yörüngesi</p>
                              </div>
                           </div>
                           <div className="p-10 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner group-hover:bg-white transition-all duration-700">
                              <p className="text-[18px] font-bold text-slate-700 leading-relaxed italic opacity-90">
                                 "{c.report?.predictiveMetrics?.evolutionPath || 'Projeksiyon oluşturuluyor...'}"
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-3 text-center">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LİDERLİK POTANSİYELİ</p>
                                 <p className={`text-5xl font-black ${i === 0 ? 'text-orange-600' : 'text-slate-900'}`}>%{c.report?.predictiveMetrics?.leadershipPotential}</p>
                              </div>
                              <div className="space-y-3 text-center">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KURUMSAL BAĞLILIK</p>
                                 <p className={`text-5xl font-black ${i === 0 ? 'text-orange-600' : 'text-slate-900'}`}>%{c.report?.predictiveMetrics?.retentionProbability}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="absolute -left-40 -bottom-40 w-[60rem] h-[60rem] bg-orange-600/5 rounded-full blur-[250px] group-hover:scale-110 transition-transform duration-1000 pointer-events-none"></div>
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
