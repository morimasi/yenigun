
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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: candidate.name,
    branch: candidate.branch,
    experienceYears: candidate.experienceYears,
    university: candidate.university,
    department: candidate.department
  });

  const matrixSegments = useMemo(() => [
    { id: 'technicalExpertise', label: 'KLİNİK DERİNLİK', icon: '🧠', group: 'KLİNİK', deepDesc: 'Kanıta dayalı yöntemlerin (ABA, Floortime, ETEÇOM) uygulama sadakati ve vaka formülasyon yeteneği.', clinicalFocus: 'Metodolojik hakimiyet, veri analizi, program hazırlama kapasitesi.' },
    { id: 'pedagogicalAnalysis', label: 'PEDAGOJİK ÇEVİKLİK', icon: '🏃', group: 'KLİNİK', deepDesc: 'Anlık gelişen durumlara göre öğretim stratejisini esnetebilme ve B planına geçebilme hızı.', clinicalFocus: 'Kognitif esneklik, öğretimsel adaptasyon, fırsat öğretimi.' },
    { id: 'crisisResilience', label: 'KRİZ DİRENCİ', icon: '🔥', group: 'KLİNİK', deepDesc: 'Yoğun problem davranış anlarında nöral stabiliteyi koruma ve güvenli müdahale.', clinicalFocus: 'Duygusal regülasyon, profesyonel mesafe, kriz yönetimi.' },
    { id: 'parentStudentRelations', label: 'VELİ DİPLOMASİSİ', icon: '🤝', group: 'KLİNİK', deepDesc: 'Zorlu veli profilleriyle terapötik ittifakı bozmadan sınırları koruyabilme sanatı.', clinicalFocus: 'İletişim stratejisi, sınır yönetimi, ikna kabiliyeti.' },
    { id: 'workEthics', label: 'ETİK & SINIRLAR', icon: '⚖️', group: 'ETİK', deepDesc: 'Mesleki kodlara sarsılmaz bağlılık ve çıkar çatışmalarını yönetme.', clinicalFocus: 'Entegrite, dürüstlük, çıkar çatışması farkındalığı.' },
    { id: 'metacognitiveAwareness', label: 'ÖZ-DENETİM', icon: '🔍', group: 'ETİK', deepDesc: 'Kendi klinik performansını dış bir gözle eleştirebilme olgunluğu.', clinicalFocus: 'İçgörü (Insight), tevazu, öğrenme motivasyonu.' },
    { id: 'developmentOpenness', label: 'BİLİŞSEL ADAPTASYON', icon: '🚀', group: 'KURUMSAL', deepDesc: 'Yeni teknolojilere ve yöntemlere entegre olabilme hızı.', clinicalFocus: 'İnovasyon, teknoloji okuryazarlığı, değişim yönetimi.' },
    { id: 'institutionalLoyalty', label: 'SADAKAT & UYUM', icon: '🏛️', group: 'KURUMSAL', deepDesc: 'Kurum vizyonunu içselleştirme ve uzun vadeli stratejik ortaklık potansiyeli.', clinicalFocus: 'Aidiyet, kurumsal hafıza, vizyon birliği.' },
    { id: 'sustainability', label: 'TÜKENMİŞLİK EŞİĞİ', icon: '🔋', group: 'KURUMSAL', deepDesc: 'Mesleki deformasyona karşı psikolojik sağlamlık.', clinicalFocus: 'Psikolojik sermaye, stres toleransı, kariyer ömrü.' }
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
    onUpdate({
        ...candidate,
        name: editForm.name,
        branch: editForm.branch,
        experienceYears: editForm.experienceYears,
        university: editForm.university,
        department: editForm.department,
        timestamp: Date.now()
    });
    setIsEditing(false);
  };

  const renderMatrix = () => {
    const da = candidate.report?.deepAnalysis;
    const data = (da as any)?.[selectedMatrixId];
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'OPTIMAL': return 'bg-emerald-500';
            case 'EXCEPTIONAL': return 'bg-blue-600';
            case 'RISK': return 'bg-rose-600';
            case 'BORDERLINE': return 'bg-orange-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in h-full">
            <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar lg:pr-2 lg:h-[calc(100vh-20rem)]">
                {['KLİNİK', 'ETİK', 'KURUMSAL'].map(groupName => (
                    <div key={groupName} className="space-y-1 mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">{groupName} BOYUTU</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                           {matrixSegments.filter(s => s.group === groupName).map(s => (
                              <button key={s.id} onClick={() => setSelectedMatrixId(s.id)} className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-2 group ${selectedMatrixId === s.id ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300 text-slate-600'}`}>
                                 <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                          <span className="text-xl">{s.icon}</span>
                                          <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMatrixId === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                          {da?.[s.id] && <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(da[s.id]?.status)}`}></div>}
                                          <span className={`text-sm font-black ${selectedMatrixId === s.id ? 'text-orange-500' : 'text-slate-900'}`}>{da?.[s.id] ? `%${da[s.id].score}` : '-'}</span>
                                    </div>
                                 </div>
                              </button>
                           ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="lg:col-span-8 space-y-6 lg:overflow-y-auto custom-scrollbar lg:h-[calc(100vh-20rem)] lg:pr-2">
                {!data ? (
                    <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Bu boyut için nöral sentez henüz tamamlanmadı.</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusColor(data.status)}`}></div>
                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                            <div>
                                <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-2">KLİNİK OTOPSİ RAPORU</h4>
                                <p className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{activeSegmentDef?.label}</p>
                                <p className="text-[11px] font-bold text-slate-400 mt-2 max-w-lg leading-relaxed">{activeSegmentDef?.clinicalFocus}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg ${getStatusColor(data.status)}`}>{data.status}</span>
                        </div>
                        <div className="space-y-6 md:space-y-10">
                            <div className="bg-slate-50 p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-slate-100 relative">
                                <p className="text-base md:text-lg font-bold text-slate-800 leading-relaxed text-justify italic">"{data.reasoning}"</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                <div className="bg-blue-50/50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-blue-100">
                                   <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-2">DAVRANIŞSAL GÖSTERGELER</span>
                                   <ul className="space-y-1">
                                      {Array.isArray(data.behavioralIndicators) && data.behavioralIndicators.map((item: string, i: number) => (
                                          <li key={i} className="text-[10px] font-bold text-blue-900 leading-tight flex gap-2"><span>•</span> {item}</li>
                                      ))}
                                   </ul>
                                </div>
                                <div className="bg-emerald-50/50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-emerald-100">
                                   <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2">POZİTİF KANITLAR</span>
                                   <ul className="space-y-1">
                                      {Array.isArray(data.pros) && data.pros.map((item: string, i: number) => (
                                          <li key={i} className="text-[10px] font-bold text-emerald-900 leading-tight flex gap-2"><span>+</span> {item}</li>
                                      ))}
                                   </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderDNA = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-scale-in">
       <div className="lg:col-span-5 bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden h-[400px] md:h-auto">
          <div className="w-full h-full relative z-10">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                   <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                   <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} />
                   <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={4} />
                   <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                </RadarChart>
             </ResponsiveContainer>
          </div>
       </div>
       <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-8 md:p-10 rounded-2xl md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="flex flex-col md:flex-row justify-between items-end md:items-end mb-8 relative z-10 gap-6">
                <div><p className="text-5xl md:text-6xl font-black">%{candidate.report?.integrityIndex || 0}</p><p className="text-[10px] md:text-[11px] font-black text-orange-500 uppercase tracking-widest mt-2 md:mt-4">Dürüstlük Endeksi</p></div>
                <div className="text-left md:text-right"><p className="text-5xl md:text-6xl font-black">%{candidate.report?.socialMaskingScore || 0}</p><p className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest mt-2 md:mt-4">Sosyal Maskeleme</p></div>
             </div>
             <div className="h-2 bg-white/10 rounded-full overflow-hidden relative z-10 border border-white/5"><div className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500" style={{ width: `${candidate.report?.integrityIndex}%` }}></div></div>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm"><p className="text-base md:text-xl font-bold text-slate-700 leading-relaxed text-justify italic">"{candidate.report?.detailedAnalysisNarrative || "Nöral sentez bekleniyor..."}"</p></div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative">
      
      {/* HEADER COCKPIT - RESPONSIVE OPTIMIZED */}
      <div className="bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between px-6 md:px-8 py-4 md:py-0 md:h-20 shrink-0 shadow-sm z-10 gap-4">
         <div className="flex items-center gap-4 md:gap-6">
            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse shrink-0`}></div>
            <div className="min-w-0">
               <div className="flex items-center gap-3">
                   <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none truncate">{candidate.name}</h2>
                   <button onClick={() => setIsEditing(true)} className="p-2 bg-slate-50 hover:bg-orange-100 text-slate-400 hover:text-orange-600 rounded-lg transition-all shrink-0">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   </button>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 truncate">{candidate.branch}</p>
            </div>
         </div>

         <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-inner shrink-0">
               {['matrix', 'dna', 'predictions', 'strategy'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400'}`}>
                   {tab === 'predictions' ? 'GELECEK' : tab === 'strategy' ? 'SORULAR' : tab === 'matrix' ? 'MATRİS' : 'MİZAÇ'}
                 </button>
               ))}
            </div>
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`shrink-0 px-6 py-2.5 md:px-10 md:py-3 bg-slate-950 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-[0.1em] hover:bg-orange-600 transition-all ${isAnalysing ? 'opacity-50' : ''}`}
            >
               {isAnalysing ? '...' : 'ANALİZ'}
            </button>
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-[#F8FAFC] custom-scrollbar">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-6">
               <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-[3rem] md:rounded-[4rem] flex items-center justify-center mb-10 border-4 border-dashed border-slate-200">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="text-2xl md:text-3xl font-black text-slate-400 uppercase tracking-[0.5em]">Liyakat Bekleniyor</h3>
               <button onClick={handleRunAnalysis} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all">Sistemi Başlat</button>
            </div>
         ) : (
            <div className="max-w-[1600px] mx-auto pb-20">
               {activeTab === 'matrix' && renderMatrix()}
               {activeTab === 'dna' && renderDNA()}
               {activeTab === 'predictions' && (
                  <div className="space-y-6 animate-slide-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <PredictBar label="SADAKAT" value={candidate.report?.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" />
                        <PredictBar label="ÖĞRENME" value={candidate.report?.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" />
                        <PredictBar label="DİRENÇ" value={100 - (candidate.report?.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" />
                        <PredictBar label="LİDERLİK" value={candidate.report?.predictiveMetrics?.leadershipPotential || 0} color="text-orange-600" />
                    </div>
                    <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[5rem] border border-slate-200 shadow-sm">
                        <div className="h-[300px] md:h-[350px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={candidate.report?.predictiveMetrics?.trajectory || []}>
                                 <XAxis dataKey="month" tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} hide={true} />
                                 <YAxis domain={[0, 100]} hide={true} />
                                 <Area type="monotone" dataKey="meritScore" stroke="#ea580c" strokeWidth={5} fill="#ea580c20" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                    </div>
                  </div>
               )}
               {activeTab === 'strategy' && (
                  <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[4rem] border border-slate-200 shadow-md space-y-4">
                     {Array.isArray(candidate.report?.interviewGuidance?.strategicQuestions) && candidate.report.interviewGuidance.strategicQuestions.map((q, i) => (
                        <div key={i} className="flex gap-4 md:gap-8 items-start p-4 md:p-8 hover:bg-slate-50 rounded-2xl transition-all border-b border-slate-50 last:border-0">
                           <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-950 text-white rounded-xl md:rounded-[1.5rem] flex items-center justify-center font-black text-sm md:text-xl shrink-0 shadow-lg">{i + 1}</div>
                           <p className="text-base md:text-xl font-bold text-slate-800 leading-tight italic">"{q}"</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>

      {/* EDIT MODAL - STYLED FOR MOBILE */}
      {isEditing && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-8">Kimlik Güncelle</h3>
                <div className="space-y-5">
                    <input type="text" className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Ad Soyad" />
                    <select className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-orange-500 outline-none" value={editForm.branch} onChange={e => setEditForm({...editForm, branch: e.target.value as Branch})}>
                        {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <input type="number" className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-orange-500 outline-none" value={editForm.experienceYears} onChange={e => setEditForm({...editForm, experienceYears: parseInt(e.target.value)})} placeholder="Deneyim" />
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">İptal</button>
                        <button onClick={handleSaveEdit} className="flex-1 py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all">Mühürle</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
