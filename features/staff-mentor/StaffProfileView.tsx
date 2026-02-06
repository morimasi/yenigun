
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StaffMember, IDP, AIReport, UniversalExportData, Branch, Candidate, TrainingModule, TrainingUnit } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import { generateCandidateAnalysis } from '../../geminiService';
import DevelopmentRouteView from './DevelopmentRouteView';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine, BarChart, Bar, Cell 
} from 'recharts';

const StaffProfileView: React.FC<{ staffId: string; onUpdate?: () => void }> = ({ staffId, onUpdate }) => {
  const [data, setData] = useState<{ profile: StaffMember; assessments: any[]; activeIDP: IDP | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<string>('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'idp' | 'analytics' | 'history'>('overview');

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=get_details&staffId=${staffId}`);
      if (res.ok) {
        const details = await res.json();
        setData(details);
      }
    } catch (e) { console.error("Staff fetch error:", e); } 
    finally { setIsLoading(false); }
  }, [staffId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handleRefreshAnalysis = async () => {
    if (!data) return;
    
    if (!confirm("KRİTİK İŞLEM: Personelin tüm gelişim verileri, geçmiş testleri ve liyakat ivmesi yeniden sentezlenecek. Bu işlem mevcut raporu ve gelişim planını güncelleyecektir. Onaylıyor musunuz?")) return;

    setIsAnalysing(true);
    
    const phases = [
      "Tarihsel Veri Seti Okunuyor...",
      "Bilişsel Çelişki Katsayıları Modelleniyor...",
      "Delta Analizi (Initial vs Current) Başlatıldı...",
      "Nöro-Pedagojik İyileştirme Sentezi Yapılıyor...",
      "Güncel Liyakat Mühürü Hazırlanıyor..."
    ];

    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      setAnalysisPhase(phases[phaseIdx % phases.length]);
      phaseIdx++;
    }, 2500);

    try {
      const deepSnapshot: Partial<Candidate> = {
        id: data.profile.id,
        name: data.profile.name,
        branch: data.profile.branch,
        experienceYears: data.profile.experience_years,
        university: data.profile.university,
        department: data.profile.department,
        answers: (data.assessments || []).reduce((acc, curr) => ({ ...acc, ...curr.answers }), {}),
        timestamp: Date.now(),
        status: 'hired'
      };

      // @ts-ignore
      deepSnapshot.assessmentHistory = (data.assessments || []).map(a => ({
        score: a.score,
        timestamp: a.timestamp,
        battery: a.battery_id,
        tags: a.ai_tags
      }));
      
      const aiReport = await generateCandidateAnalysis(deepSnapshot as any, {} as any);
      
      const saveRes = await fetch('/api/staff?action=save_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, report: aiReport })
      });

      if (saveRes.ok) { 
        await fetchDetails(); 
        onUpdate?.(); 
        alert("Nöral Analiz ve Gelişim Rotası Başarıyla Yenilendi."); 
      }
    } catch (e) { 
      alert("Analiz Motoru Bağlantı Hatası: Sistem yoğun olabilir, lütfen tekrar deneyiniz."); 
    } finally { 
      clearInterval(phaseInterval);
      setAnalysisPhase('');
      setIsAnalysing(false); 
    }
  };

  const handleIDPSave = async (newIDP: IDP) => {
      try {
        const res = await fetch('/api/staff?action=save_idp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ staffId, data: newIDP })
        });
        if (res.ok) {
           setData(prev => prev ? ({ ...prev, activeIDP: newIDP }) : null);
        } else {
           throw new Error("Save failed");
        }
      } catch (e) {
          console.error("Save error", e);
          throw e;
      }
  };

  const radarData = useMemo(() => {
    const da = data?.profile?.report?.deepAnalysis;
    if (!da) return [];
    return Object.entries(da).map(([k, v]) => ({ 
      subject: (v as any).label || k.replace(/([A-Z])/g, ' $1').toUpperCase(), 
      value: (v as any)?.score || 0,
      fullMark: 100
    }));
  }, [data]);

  const learningCurve = useMemo(() => {
     if (!data?.assessments || !Array.isArray(data.assessments)) return [];
     return [...data.assessments].reverse().map((a, i) => ({ 
        name: `Test ${i+1}`, 
        score: a.score || 0, 
        date: new Date(a.timestamp).toLocaleDateString('tr-TR', {month:'short', day:'numeric'}) 
     }));
  }, [data]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-32 space-y-8 animate-fade-in">
       <div className="w-24 h-24 border-8 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
       <p className="font-black text-slate-300 uppercase tracking-[0.4em]">Uzman Verileri Çözümleniyor...</p>
    </div>
  );

  if (!data) return <div className="p-20 text-center text-slate-400 font-black uppercase">Dosya Bulunamadı</div>;

  const MetricCard = ({ label, value, color, icon, trend, detail }: any) => (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col justify-between">
       <div className="relative z-10 flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color.replace('text-', 'bg-').replace('600', '100')} ${color}`}>
             {icon}
          </div>
          <span className={`text-4xl font-black ${color}`}>%{value}</span>
       </div>
       <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          {trend && <p className="text-[9px] font-bold text-slate-300 uppercase">{trend}</p>}
          {detail && <p className="text-[10px] font-medium text-slate-500 mt-3 leading-relaxed border-t border-slate-100 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">{detail}</p>}
       </div>
       <div className={`absolute bottom-0 left-0 h-1.5 w-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20 relative">
      
      {/* ANALİZ YÜKLENİYOR OVERLAY */}
      {isAnalysing && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center">
           <div className="relative mb-12">
              <div className="w-56 h-56 border-[12px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] shadow-2xl flex items-center justify-center border border-white/10">
                    <svg className="w-12 h-12 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
              </div>
           </div>
           <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 animate-fade-in">Analiz Derinleştiriliyor</h3>
           <p className="text-orange-500 font-black text-xl uppercase tracking-[0.5em] h-8 transition-all duration-500">{analysisPhase}</p>
        </div>
      )}

      {/* 1. HEADER PROFILE CARD */}
      <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-0"></div>
         
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl group cursor-pointer hover:scale-105 transition-transform">
               {data.profile.name.charAt(0)}
               <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
            </div>
            <div className="space-y-3">
               <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{data.profile.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                     <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-lg text-slate-600 uppercase tracking-widest">{data.profile.branch}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.profile.experience_years} YIL DENEYİM</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  {[
                    { id: 'overview', label: 'GENEL BAKIŞ', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                    { id: 'idp', label: 'HİZMET İÇİ EĞİTİM', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                    { id: 'analytics', label: 'ANALİTİK', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                    { id: 'history', label: 'ARŞİV', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                  ].map(tab => (
                     <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                     >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
                        <span className="hidden md:inline">{tab.label}</span>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="flex gap-4 relative z-10">
            <button onClick={handleRefreshAnalysis} disabled={isAnalysing} className="px-6 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50">
               {isAnalysing ? 'SENTEZLENİYOR...' : 'YENİDEN ANALİZ ET'}
            </button>
         </div>
      </div>

      {/* 2. CONTENT STAGE */}
      <div className="min-h-[500px]">
         
         {activeTab === 'overview' && (
            <div className="space-y-8 animate-slide-up">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard 
                     label="KLİNİK DERİNLİK" 
                     value={data.profile.report?.deepAnalysis?.technicalExpertise?.score || 0} 
                     color="text-slate-900" 
                     icon="🧠" 
                     trend="Stabil ve Güçlü"
                  />
                  <MetricCard 
                     label="ETİK BÜTÜNLÜK" 
                     value={data.profile.report?.deepAnalysis?.workEthics?.score || 0} 
                     color="text-emerald-600" 
                     icon="⚖️" 
                     trend="Hassas Denge"
                  />
                  <MetricCard 
                     label="PEDAGOJİK ÇEVİKLİK" 
                     value={data.profile.report?.deepAnalysis?.pedagogicalAnalysis?.score || 0} 
                     color="text-blue-600" 
                     icon="📚" 
                     trend="Gelişime Açık"
                  />
                  <MetricCard 
                     label="PSİKOLOJİK DİRENÇ" 
                     value={data.profile.report?.deepAnalysis?.sustainability?.score || 0} 
                     color="text-orange-600" 
                     icon="🔋" 
                     trend="Tükenmişlik Riski"
                  />
               </div>

               <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                     <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                     Nöral Yetkinlik Çekirdeği
                  </h4>
                  <p className="text-lg font-medium text-slate-600 leading-relaxed text-justify italic">
                     "{data.profile.report?.detailedAnalysisNarrative || 'Derin analiz verisi bekleniyor.'}"
                  </p>
               </div>
            </div>
         )}

         {activeTab === 'idp' && (
            <DevelopmentRouteView 
               staff={data.profile}
               currentIDP={data.activeIDP}
               assessmentHistory={data.assessments}
               onSave={handleIDPSave}
            />
         )}

         {activeTab === 'analytics' && (
            <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col h-[500px]">
               <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-12 z-10">YETKİNLİK RADARI</h4>
               <div className="flex-1 w-full min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart data={radarData} outerRadius="70%">
                        <PolarGrid stroke="#ffffff20" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                        <Radar name="Personel" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} strokeWidth={3} />
                        <Tooltip />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
               <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
            </div>
         )}

         {activeTab === 'history' && (
            <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-10 border-b border-slate-50 bg-slate-50/50">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">KRONOLOJİK LİYAKAT DÖKÜMÜ</h4>
               </div>
               <div className="divide-y divide-slate-100">
                  {(data.assessments || []).map((a, idx) => (
                     <div key={idx} className="p-8 hover:bg-slate-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-sm">{data.assessments.length - idx}</div>
                           <div>
                              <h5 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{a.battery_id.replace(/_/g, ' ')}</h5>
                              <p className="text-[10px] font-bold text-slate-400">{new Date(a.timestamp).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <span className={`text-3xl font-black ${a.score > 80 ? 'text-emerald-500' : 'text-orange-500'}`}>%{a.score}</span>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default StaffProfileView;
