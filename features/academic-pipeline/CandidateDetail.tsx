
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
  
  // EDIT MODE STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: candidate.name,
    branch: candidate.branch,
    experienceYears: candidate.experienceYears,
    university: candidate.university,
    department: candidate.department
  });

  // ... (Matrix Segments definition remains same)
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
        timestamp: Date.now() // Timestmap güncelle ki sıralamada yukarı çıksın
    });
    setIsEditing(false);
  };

  const handlePermanentDelete = () => {
    if (isDeleteConfirmOpen) { onDelete(); } else { setIsDeleteConfirmOpen(true); setTimeout(() => setIsDeleteConfirmOpen(false), 5000); }
  };

  // ... (renderMatrix function remains similar, skipping for brevity but logic is preserved in component flow)
  const renderMatrix = () => {
    const da = candidate.report?.deepAnalysis;
    const data = (da as any)?.[selectedMatrixId];
    
    // ... (helper functions inside)
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in h-full">
            <div className="md:col-span-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 h-[650px]">
                {['KLİNİK', 'ETİK', 'KURUMSAL'].map(groupName => (
                    <div key={groupName} className="space-y-1 mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">{groupName} BOYUTU</span>
                        {matrixSegments.filter(s => s.group === groupName).map(s => (
                            <button key={s.id} onClick={() => setSelectedMatrixId(s.id)} className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-2 group ${selectedMatrixId === s.id ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-300'}`}>
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
                ))}
            </div>
            <div className="md:col-span-8 space-y-6 overflow-y-auto custom-scrollbar h-[650px] pr-2">
                {!data ? (
                    <div className="bg-white p-20 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Bu boyut için nöral sentez henüz tamamlanmadı.</p>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusColor(data.status)}`}></div>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-2">KLİNİK OTOPSİ RAPORU</h4>
                                <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{activeSegmentDef?.label}</p>
                                <p className="text-[11px] font-bold text-slate-400 mt-2 max-w-lg">{activeSegmentDef?.clinicalFocus}</p>
                            </div>
                            <span className={`px-5 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg ${getStatusColor(data.status)}`}>{data.status}</span>
                        </div>
                        <div className="space-y-10">
                            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative">
                                <p className="text-lg font-bold text-slate-800 leading-relaxed text-justify italic">"{data.reasoning}"</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100"><p className="text-[11px] font-bold text-blue-900 leading-relaxed italic">"{data.clinicalNuances}"</p></div>
                                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100"><p className="text-[11px] font-black text-emerald-900 leading-relaxed">"{data.literatureReference}"</p></div>
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
       <div className="lg:col-span-5 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden">
          <div className="w-full h-[400px] relative z-10">
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
          <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="flex justify-between items-end mb-10 relative z-10">
                <div><p className="text-6xl font-black">%{candidate.report?.integrityIndex || 0}</p><p className="text-[11px] font-black text-orange-500 uppercase tracking-widest mt-4">Dürüstlük Endeksi</p></div>
                <div className="text-right"><p className="text-6xl font-black">%{candidate.report?.socialMaskingScore || 0}</p><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-4">Sosyal Maskeleme</p></div>
             </div>
             <div className="h-2 bg-white/10 rounded-full overflow-hidden relative z-10 border border-white/5"><div className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500" style={{ width: `${candidate.report?.integrityIndex}%` }}></div></div>
          </div>
          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm"><p className="text-xl font-bold text-slate-700 leading-relaxed text-justify italic">"{candidate.report?.detailedAnalysisNarrative || "Nöral sentez bekleniyor..."}"</p></div>
       </div>
    </div>
  );

  const renderPredictions = () => {
    const trajectory = candidate.report?.predictiveMetrics?.trajectory || [];
    return (
      <div className="space-y-6 animate-slide-up">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PredictBar label="SADAKAT" value={candidate.report?.predictiveMetrics?.retentionProbability || 0} color="text-emerald-600" />
            <PredictBar label="ÖĞRENME" value={candidate.report?.predictiveMetrics?.learningVelocity || 0} color="text-blue-600" />
            <PredictBar label="DİRENÇ" value={100 - (candidate.report?.predictiveMetrics?.burnoutRisk || 0)} color="text-rose-600" />
            <PredictBar label="LİDERLİK" value={candidate.report?.predictiveMetrics?.leadershipPotential || 0} color="text-orange-600" />
         </div>
         <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="h-[350px] w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectory}>
                     <defs><linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ea580c" stopOpacity={0.15}/><stop offset="95%" stopColor="#ea580c" stopOpacity={0}/></linearGradient></defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} domain={[0, 100]} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                     <Area type="monotone" dataKey="meritScore" stroke="#ea580c" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    );
  };

  const renderStrategy = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-md">
          <div className="space-y-6">
             {candidate.report?.interviewGuidance?.strategicQuestions?.map((q, i) => (
                <div key={i} className="flex gap-8 items-start group p-8 hover:bg-slate-50 rounded-[3rem] transition-all border border-transparent hover:border-slate-100">
                   <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl shrink-0 shadow-2xl">{i + 1}</div>
                   <div className="space-y-3"><p className="text-xl font-bold text-slate-800 leading-tight italic">"{q}"</p></div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative">
      
      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Profil Düzenle</h3>
                    <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-[10px] font-black uppercase tracking-widest">ID: {candidate.id.substring(0,8)}</div>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-1">Ad Soyad</label>
                        <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-1">Branş</label>
                            <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={editForm.branch} onChange={e => setEditForm({...editForm, branch: e.target.value})}>
                                {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-1">Deneyim (Yıl)</label>
                            <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={editForm.experienceYears} onChange={e => setEditForm({...editForm, experienceYears: parseInt(e.target.value)})} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-1">Üniversite</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200 text-sm" value={editForm.university} onChange={e => setEditForm({...editForm, university: e.target.value})}>
                            <option value="">Seçiniz</option>
                            {TURKISH_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase">İPTAL</button>
                        <button onClick={handleSaveEdit} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-orange-600 transition-all">DEĞİŞİKLİKLERİ KAYDET</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* EXPORT OVERLAY */}
      {isExportStudioOpen && candidate.report && (
        <ExportStudio 
          onClose={() => setIsExportStudioOpen(false)}
          data={{ type: 'CANDIDATE_REPORT', entityName: candidate.name, referenceId: candidate.id.toUpperCase(), payload: candidate }}
        >
          <CandidateReport candidate={candidate} report={candidate.report} />
        </ExportStudio>
      )}

      {/* HEADER COCKPIT */}
      <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-6">
            <div className={`w-4 h-4 rounded-full ${candidate.status === 'interview_scheduled' ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse shadow-[0_0_15px_rgba(234,88,12,0.4)]`}></div>
            <div>
               <div className="flex items-center gap-3">
                   <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{candidate.name}</h2>
                   <button onClick={() => setIsEditing(true)} className="p-1.5 bg-slate-100 hover:bg-orange-100 text-slate-400 hover:text-orange-600 rounded-lg transition-all" title="Profili Düzenle">
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   </button>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{candidate.branch} • {candidate.experienceYears} YIL SAHA TECRÜBESİ</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            {candidate.report && (
               <button onClick={() => setIsExportStudioOpen(true)} className="px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">DOSYAYI YAYINLA</button>
            )}
            
            <button 
              onClick={handlePermanentDelete} 
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${isDeleteConfirmOpen ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
            >
              {isDeleteConfirmOpen ? 'EMİN MİSİNİZ? (TIKLA)' : 'KAYDI İMHA ET'}
            </button>

            <div className="flex bg-slate-50 p-1.5 rounded-[1.2rem] border border-slate-200 shadow-inner">
               <button onClick={() => setActiveTab('matrix')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'matrix' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>MATRIX</button>
               <button onClick={() => setActiveTab('dna')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dna' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>DNA</button>
               <button onClick={() => setActiveTab('predictions')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'predictions' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>PREDICTIONS</button>
               <button onClick={() => setActiveTab('strategy')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>STRATEGY</button>
            </div>
            <button 
               onClick={handleRunAnalysis} 
               disabled={isAnalysing}
               className={`px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95 ${isAnalysing ? 'opacity-50' : ''}`}
            >
               {isAnalysing ? 'İŞLENİYOR...' : 'YENİDEN ANALİZ ET'}
            </button>
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
         {!candidate.report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
               <div className="w-40 h-40 bg-slate-100 rounded-[4rem] flex items-center justify-center mb-10 border-4 border-dashed border-slate-200">
                  <svg className="w-20 h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.5em]">Liyakat Analizi Bekleniyor</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">Adayın verilerini işlemek için sağ üstteki butonu kullanın.</p>
            </div>
         ) : (
            <div className="max-w-[1600px] mx-auto pb-32">
               {activeTab === 'matrix' && renderMatrix()}
               {activeTab === 'dna' && renderDNA()}
               {activeTab === 'predictions' && renderPredictions()}
               {activeTab === 'strategy' && renderStrategy()}
            </div>
         )}
      </div>
    </div>
  );
};

export default CandidateDetail;
