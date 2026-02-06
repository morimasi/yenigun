
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, Branch } from '../../types';
import { generateCandidateAnalysis } from '../../geminiService';
import { calculateAlgorithmicAnalysis } from '../../analysisUtils';
import { PredictBar } from '../../shared/ui/PredictBar';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import ExportStudio from '../../components/shared/ExportStudio';
import CandidateReport from '../../components/CandidateReport';
import { TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../../constants';

const CandidateDetail: React.FC<{ candidate: Candidate, config: GlobalConfig, onUpdate: (c: Candidate) => void, onDelete: () => void }> = ({ candidate, config, onUpdate, onDelete }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dna' | 'predictions' | 'strategy'>('matrix');
  const [selectedMatrixId, setSelectedMatrixId] = useState<string>('technicalExpertise');
  const [isExportStudioOpen, setIsExportStudioOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: candidate.name,
    branch: candidate.branch,
    experienceYears: candidate.experienceYears,
    university: candidate.university,
    department: candidate.department
  });

  const matrixSegments = useMemo(() => [
    { id: 'technicalExpertise', label: 'KLİNİK DERİNLİK', icon: '🧠', group: 'KLİNİK', deepDesc: 'Metodolojik hakimiyet ve vaka formülasyon yeteneği.', clinicalFocus: 'ABA, Floortime, ETEÇOM uygulama sadakati.' },
    { id: 'pedagogicalAnalysis', label: 'PEDAGOJİK ÇEVİKLİK', icon: '🏃', group: 'KLİNİK', deepDesc: 'Anlık gelişen durumlara göre öğretim stratejisini esnetebilme hızı.', clinicalFocus: 'Kognitif esneklik ve öğretimsel adaptasyon.' },
    { id: 'crisisResilience', label: 'KRİZ DİRENCİ', icon: '🔥', group: 'KLİNİK', deepDesc: 'Yoğun problem davranış anlarında nöral stabiliteyi koruma.', clinicalFocus: 'Duygusal regülasyon ve profesyonel mesafe.' },
    { id: 'workEthics', label: 'ETİK & SINIRLAR', icon: '⚖️', group: 'ETİK', deepDesc: 'Mesleki kodlara sarsılmaz bağlılık.', clinicalFocus: 'Entegrite ve profesyonel dürüstlük.' },
    { id: 'institutionalLoyalty', label: 'SADAKAT & UYUM', icon: '🏛️', group: 'KURUMSAL', deepDesc: 'Kurum vizyonunu içselleştirme potansiyeli.', clinicalFocus: 'Aidiyet ve kurumsal hafıza bilinci.' },
    { id: 'sustainability', label: 'TÜKENMİŞLİK EŞİĞİ', icon: '🔋', group: 'KURUMSAL', deepDesc: 'Mesleki deformasyona karşı psikolojik sağlamlık.', clinicalFocus: 'Psikolojik sermaye ve stres toleransı.' }
  ], []);

  const activeSegmentDef = useMemo(() => matrixSegments.find(s => s.id === selectedMatrixId), [selectedMatrixId, matrixSegments]);

  const radarData = useMemo(() => {
    const da = candidate.report?.deepAnalysis;
    if (!da) return [];
    return matrixSegments.map(s => ({ subject: s.label, value: (da as any)?.[s.id]?.score || 0 }));
  }, [candidate.report, matrixSegments]);

  const handleRunAnalysis = async () => {
    setIsAnalysing(true);
    try {
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      const aiReport = await generateCandidateAnalysis(candidate, config);
      onUpdate({ ...candidate, report: aiReport, algoReport, timestamp: Date.now() });
    } catch (e: any) { alert("Nöral Analiz Hatası: Bağlantı koptu."); } 
    finally { setIsAnalysing(false); }
  };

  const handleSaveEdit = () => {
    onUpdate({ ...candidate, ...editForm, timestamp: Date.now() });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'OPTIMAL': return 'bg-emerald-500';
        case 'EXCEPTIONAL': return 'bg-indigo-600';
        case 'RISK': return 'bg-rose-600';
        case 'BORDERLINE': return 'bg-amber-500';
        default: return 'bg-slate-400';
    }
  };

  const renderMatrix = () => {
    const da = candidate.report?.deepAnalysis;
    const data = (da as any)?.[selectedMatrixId];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in h-full">
            <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar lg:h-[calc(100vh-18rem)]">
                {['KLİNİK', 'ETİK', 'KURUMSAL'].map(groupName => (
                    <div key={groupName} className="space-y-2 mb-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-2 block">{groupName} BOYUTU</span>
                        <div className="flex flex-col gap-2">
                           {matrixSegments.filter(s => s.group === groupName).map(s => (
                              <button 
                                 key={s.id} 
                                 onClick={() => setSelectedMatrixId(s.id)} 
                                 className={`w-full p-5 rounded-[2rem] border-2 text-left transition-all flex flex-col gap-2 group relative overflow-hidden ${
                                    selectedMatrixId === s.id 
                                    ? 'bg-slate-950 border-slate-950 text-white shadow-2xl' 
                                    : 'bg-white border-slate-100 hover:border-orange-200 text-slate-600'
                                 }`}
                              >
                                 <div className="flex items-center justify-between w-full relative z-10">
                                    <div className="flex items-center gap-4">
                                          <span className={`text-2xl transition-transform ${selectedMatrixId === s.id ? 'scale-110' : 'group-hover:scale-110'}`}>{s.icon}</span>
                                          <span className={`text-[11px] font-black uppercase tracking-widest ${selectedMatrixId === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                                    </div>
                                    <span className={`text-sm font-black ${selectedMatrixId === s.id ? 'text-orange-500' : 'text-slate-900'}`}>{da?.[s.id] ? `%${da[s.id].score}` : '-'}</span>
                                 </div>
                                 {selectedMatrixId === s.id && <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-orange-600/20 rounded-full blur-xl"></div>}
                              </button>
                           ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="lg:col-span-8 space-y-6 lg:overflow-y-auto custom-scrollbar lg:h-[calc(100vh-18rem)]">
                {!data ? (
                    <div className="h-full bg-white p-12 rounded-[3.5rem] border-4 border-dashed border-slate-50 flex flex-col items-center justify-center text-center opacity-40 grayscale">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner"><svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                        <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-400">Nöral Sentez Bekleniyor</p>
                    </div>
                ) : (
                    <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-2 h-full ${getStatusColor(data.status)}`}></div>
                        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.6em] mb-2">KLİNİK OTOPSİ BULGUSU</h4>
                                <p className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none">{activeSegmentDef?.label}</p>
                                <p className="text-[12px] font-bold text-slate-400 max-w-lg leading-relaxed uppercase tracking-wide">{activeSegmentDef?.clinicalFocus}</p>
                            </div>
                            <span className={`px-6 py-2.5 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest shadow-xl ${getStatusColor(data.status)}`}>{data.status}</span>
                        </div>
                        <div className="space-y-12">
                            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative shadow-inner">
                                <span className="absolute -top-4 left-10 px-4 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Gerekçe Paneli</span>
                                <p className="text-xl font-bold text-slate-800 leading-relaxed text-justify italic">"{data.reasoning}"</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100">
                                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-4">KLİNİK NÜANS</span>
                                   <p className="text-[13px] font-bold text-indigo-900 leading-relaxed italic">"{data.clinicalNuances}"</p>
                                </div>
                                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100">
                                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-4">LİTERATÜR ATFI</span>
                                   <p className="text-[13px] font-black text-emerald-900 leading-relaxed uppercase tracking-tight">"{data.literatureReference}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative">
      
      {/* DOSSIER HEADER */}
      <div className="bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between px-10 py-6 md:h-24 shrink-0 shadow-sm z-10 gap-6">
         <div className="flex items-center gap-8">
            <div className="relative group">
                <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl group-hover:scale-105 transition-transform">
                    {candidate.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse`}></div>
            </div>
            <div className="min-w-0">
               <div className="flex items-center gap-4">
                   <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none truncate">{candidate.name}</h2>
                   <button onClick={() => setIsEditing(true)} className="p-2.5 bg-slate-50 hover:bg-orange-600 hover:text-white text-slate-400 rounded-xl transition-all shrink-0 shadow-sm">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   </button>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 truncate">BRANŞ: <span className="text-orange-600">{candidate.branch}</span></p>
            </div>
         </div>

         <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 shadow-inner shrink-0">
               {['matrix', 'dna', 'predictions', 'strategy'].map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab as any)} 
                   className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeTab === tab ? 'bg-white text-orange-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                   }`}
                 >
                   {tab === 'predictions' ? 'GELECEK' : tab === 'strategy' ? 'SORULAR' : tab === 'matrix' ? 'MATRİS' : 'MİZAÇ'}
                 </button>
               ))}
            </div>
            <div className="h-10 w-px bg-slate-200 mx-2"></div>
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`shrink-0 px-10 py-4 bg-slate-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 ${isAnalysing ? 'opacity-50 animate-pulse' : ''}`}
            >
               {isAnalysing ? 'İŞLENİYOR...' : 'ANALİZ BAŞLAT'}
            </button>
         </div>
      </div>

      {/* CONTENT STAGE */}
      <div className="flex-1 overflow-y-auto p-10 md:p-12 custom-scrollbar bg-[#F8FAFC]">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-12">
               <div className="relative">
                  <div className="w-48 h-48 bg-white rounded-[4rem] flex items-center justify-center border-4 border-dashed border-slate-200 shadow-xl">
                     <svg className="w-20 h-20 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-orange-600 text-white p-4 rounded-3xl shadow-2xl animate-bounce">
                     <span className="text-[10px] font-black uppercase tracking-widest">Analiz Gerekiyor</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-4xl font-black text-slate-300 uppercase tracking-[0.4em]">Dosya Mühürlenmedi</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 max-w-md mx-auto leading-relaxed">Adayın liyakat matrisini ve nöral gelişim projeksiyonunu oluşturmak için üst menüden analiz motorunu tetikleyin.</p>
               </div>
            </div>
         ) : (
            <div className="max-w-[1400px] mx-auto pb-24">
               {activeTab === 'matrix' && renderMatrix()}
               {activeTab === 'dna' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-scale-in">
                     <div className="lg:col-span-5 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden h-[500px]">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 w-full text-left border-l-4 border-orange-600 pl-4">YETKİNLİK SPEKTRUMU</h4>
                        <div className="w-full h-full relative z-10">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={radarData}>
                                 <PolarGrid stroke="#f1f5f9" />
                                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                                 <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} strokeWidth={4} />
                                 <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="lg:col-span-7 space-y-8">
                        <div className="bg-slate-950 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                           <div className="flex justify-between items-end mb-12 relative z-10">
                              <div>
                                 <p className="text-7xl font-black text-orange-600 leading-none">%{candidate.report?.integrityIndex || 0}</p>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-6">Dürüstlük Endeksi</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-7xl font-black text-indigo-500 leading-none">%{candidate.report?.socialMaskingScore || 0}</p>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-6">Sosyal Maskeleme</p>
                              </div>
                           </div>
                           <div className="h-3 bg-white/5 rounded-full overflow-hidden relative z-10 border border-white/5 shadow-inner">
                              <div className="h-full bg-gradient-to-r from-rose-600 via-orange-500 to-emerald-500 shadow-[0_0_20px_rgba(234,88,12,0.5)]" style={{ width: `${candidate.report?.integrityIndex}%` }}></div>
                           </div>
                           <p className="mt-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center italic opacity-60">Sistem: Adayın beyanları ile nöral refleksleri arasındaki tutarlılık ölçümlenmiştir.</p>
                        </div>
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative">
                           <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em] mb-6">KARAKTER ANALİZİ (ÖZET)</h4>
                           <p className="text-xl font-bold text-slate-700 leading-relaxed text-justify italic">"{candidate.report?.detailedAnalysisNarrative}"</p>
                        </div>
                     </div>
                  </div>
               )}
               {/* Diğer tab içerikleri de benzer bir estetikle güncellenecektir... */}
            </div>
         )}
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 shadow-3xl animate-scale-in border border-white/20">
                <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-10 border-l-8 border-orange-600 pl-8">Dossier Kimlik Kartı</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Tam Ad Soyad</label>
                       <input type="text" className="w-full p-6 bg-slate-50 rounded-3xl font-black text-lg border-2 border-transparent focus:border-orange-500 outline-none transition-all shadow-inner" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Branş</label>
                           <select className="w-full p-6 bg-slate-50 rounded-3xl font-black text-sm border-2 border-transparent focus:border-orange-500 outline-none shadow-inner" value={editForm.branch} onChange={e => setEditForm({...editForm, branch: e.target.value as Branch})}>
                              {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Deneyim</label>
                           <input type="number" className="w-full p-6 bg-slate-50 rounded-3xl font-black text-lg border-2 border-transparent focus:border-orange-500 outline-none shadow-inner" value={editForm.experienceYears} onChange={e => setEditForm({...editForm, experienceYears: parseInt(e.target.value)})} />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-8">
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200">İPTAL</button>
                        <button onClick={handleSaveEdit} className="flex-2 py-6 bg-slate-950 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all">MÜHRÜ GÜNCELLE</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
