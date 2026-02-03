
import React, { useState, useEffect, useCallback } from 'react';
import { StaffMember, IDP } from '../../types';
import ExportStudio from '../../components/shared/ExportStudio';
import { armsService } from '../../services/ai/armsService';

const StaffProfileView: React.FC<{ staffId: string }> = ({ staffId }) => {
  const [data, setData] = useState<{ profile: StaffMember; assessments: any[]; activeIDP: IDP | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGeneratingIDP, setIsGeneratingIDP] = useState(false);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?action=get_details&staffId=${staffId}`);
      if (res.ok) {
        const details = await res.json();
        setData(details);
      }
    } catch (e) {
      console.error("Staff fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleGenerateIDP = async () => {
    if (!data) return;
    setIsGeneratingIDP(true);
    try {
      const newIDP = await armsService.generateIDP(data.profile);
      const res = await fetch('/api/staff?action=save_idp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, data: newIDP })
      });
      if (res.ok) fetchDetails();
    } catch (e) {
      alert("IDP Üretim Hatası.");
    } finally {
      setIsGeneratingIDP(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">Klinik Veriler Çözümleniyor...</div>;
  if (!data) return <div className="p-20 text-center text-slate-400 font-black uppercase">Personel Kaydı Bulunamadı</div>;

  return (
    <div className="space-y-6 animate-scale-in pb-20">
      {isExportOpen && data && (
        <ExportStudio
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'STAFF_IDP',
            entityName: data.profile.name,
            referenceId: staffId,
            payload: data
          }}
        >
           <div className="space-y-12">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
                 <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">Akademik Durum Özeti</h3>
                 <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"Bu dosya, personelin son 12 aydaki klinik performansını ve nöral gelişim yörüngesini içerir."</p>
              </div>
              <div className="grid grid-cols-2 gap-10">
                 <div className="p-8 bg-white border-2 border-orange-100 rounded-3xl">
                    <h5 className="text-[10px] font-black text-orange-600 uppercase mb-4">Mevcut Yetkinlik Skoru</h5>
                    <p className="text-6xl font-black text-slate-900">%{data.profile.last_score || '?'}</p>
                 </div>
                 <div className="p-8 bg-slate-900 text-white rounded-3xl">
                    <h5 className="text-[10px] font-black text-orange-500 uppercase mb-4">Gelişim Odağı</h5>
                    <p className="text-xl font-bold uppercase">{(data.activeIDP as any)?.focusArea || 'Genel Gelişim'}</p>
                 </div>
              </div>
              {data.activeIDP && (
                 <div className="space-y-6">
                    <h4 className="text-xl font-black text-slate-900 border-b-4 border-orange-600 pb-2 inline-block uppercase">Gelişim Yol Haritası</h4>
                    <div className="grid grid-cols-3 gap-6">
                       <div className="p-6 bg-slate-50 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">KISA VADE</p>
                          <p className="text-xs font-bold text-slate-700">{(data.activeIDP as any).roadmap?.shortTerm}</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">ORTA VADE</p>
                          <p className="text-xs font-bold text-slate-700">{(data.activeIDP as any).roadmap?.midTerm}</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">UZUN VADE</p>
                          <p className="text-xs font-bold text-slate-700">{(data.activeIDP as any).roadmap?.longTerm}</p>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </ExportStudio>
      )}

      {/* HEADER SECTION */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex justify-between items-center">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl">
               {data.profile.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{data.profile.name}</h2>
               <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{data.profile.branch}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {staffId}</span>
               </div>
            </div>
         </div>
         <div className="flex gap-3">
            <button onClick={() => setIsExportOpen(true)} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">YAYINLA</button>
            <button onClick={handleGenerateIDP} disabled={isGeneratingIDP} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
               {isGeneratingIDP ? 'ÜRETİLİYOR...' : 'GELİŞİM PLANI (IDP) ÜRET'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Mevcut Yetkinlik</h4>
               <div className="text-center py-10">
                  <span className="text-7xl font-black text-slate-900">%{data.profile.last_score || 0}</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">Genel Klinik Performans</p>
               </div>
            </div>
            <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white shadow-lg">
               <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-6">Mentor Özet Görüşü</h4>
               <p className="text-sm font-bold leading-relaxed italic">
                  "{data.activeIDP ? (data.activeIDP as any).focusArea : 'Henüz gelişim planı oluşturulmadı. Başlamak için yukarıdaki butonu kullanın.'}"
               </p>
            </div>
         </div>

         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px]">
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 border-l-4 border-orange-600 pl-4">Değerlendirme Geçmişi</h4>
               <div className="space-y-4">
                  {data.assessments.length === 0 ? (
                     <div className="py-20 text-center text-slate-300 uppercase font-black text-[10px]">Veri Yok</div>
                  ) : (
                     data.assessments.map((ass, i) => (
                        <div key={i} className="p-5 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                           <div>
                              <p className="text-[11px] font-black text-slate-900 uppercase">{ass.battery_id.replace(/_/g, ' ')}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{new Date(ass.timestamp).toLocaleDateString('tr-TR')}</p>
                           </div>
                           <span className="text-2xl font-black text-slate-900">%{ass.score}</span>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StaffProfileView;
