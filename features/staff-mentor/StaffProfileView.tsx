
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StaffMember, IDP, AIReport, UniversalExportData, Branch, Candidate, TrainingModule, TrainingUnit } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import DevelopmentRouteView from './DevelopmentRouteView';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const StaffProfileView: React.FC<{ staffId: string; onUpdate?: () => void }> = ({ staffId, onUpdate }) => {
  const [data, setData] = useState<{ profile: StaffMember; assessments: any[]; activeIDP: IDP | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'idp' | 'analytics' | 'history'>('overview');

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=get_details&staffId=${staffId}`);
      if (res.ok) setData(await res.json());
    } finally { setIsLoading(false); }
  }, [staffId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const radarData = useMemo(() => {
    const da = data?.profile?.report?.deepAnalysis;
    if (!da) return [];
    return Object.entries(da).map(([k, v]) => ({ 
      subject: (v as any).label || k.replace(/([A-Z])/g, ' $1').toUpperCase(), 
      value: (v as any)?.score || 0
    }));
  }, [data]);

  if (isLoading || !data) return <div className="p-20 text-center animate-pulse">Uzman Verisi Yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20 relative">
      
      {isExportOpen && (
        <ExportStudio 
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'STAFF_PROFILE',
            entityName: data.profile.name,
            referenceId: data.profile.id,
            payload: data,
            config: { title: 'PERSONEL LİYAKAT VE GELİŞİM PORTFOLYOSU' }
          }}
        />
      )}

      <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
               {data.profile.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{data.profile.name}</h2>
               <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mt-2">{data.profile.branch}</p>
            </div>
         </div>

         <div className="flex gap-3 relative z-10">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mr-4">
               {['overview', 'idp', 'analytics', 'history'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{tab}</button>
               ))}
            </div>
            <button onClick={() => setIsExportOpen(true)} className="px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">YAYINLA & İNDİR</button>
         </div>
      </div>

      <div className="flex-1">
         {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
               <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8">AKADEMİK ANALİZ ÖZETİ</h4>
                  <p className="text-lg font-medium text-slate-600 leading-relaxed italic">"{data.profile.report?.detailedAnalysisNarrative || 'Analiz verisi bekleniyor.'}"</p>
               </div>
               <div className="bg-slate-900 p-10 rounded-[4rem] text-white flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                     <RadarChart data={radarData}>
                        <PolarGrid stroke="#ffffff20" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} />
                        <Radar name="Uzman" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} strokeWidth={3} />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         )}
         {activeTab === 'idp' && <DevelopmentRouteView staff={data.profile} currentIDP={data.activeIDP} assessmentHistory={data.assessments} onSave={async (idp) => {}} />}
      </div>
    </div>
  );
};

export default StaffProfileView;
