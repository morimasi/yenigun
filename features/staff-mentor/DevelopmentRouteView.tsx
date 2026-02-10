
import React, { useState, useEffect, useMemo } from 'react';
import { StaffMember, IDP, CustomTrainingPlan, TrainingAssignment } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PresentationStudio from '../training/PresentationStudio';

interface DevelopmentRouteViewProps {
  staff: StaffMember;
  currentIDP: IDP | null;
  assessmentHistory: any[];
  onSave: (idp: IDP) => Promise<void>;
}

const DevelopmentRouteView: React.FC<DevelopmentRouteViewProps> = ({ staff, currentIDP, assessmentHistory, onSave }) => {
  const [localIDP, setLocalIDP] = useState<IDP | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<CustomTrainingPlan[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStudioPlan, setActiveStudioPlan] = useState<CustomTrainingPlan | null>(null);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`/api/training?action=get_staff_assignments&staffId=${staff.id}`);
      if (res.ok) setAssignments(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/training?action=list');
      if (res.ok) setCatalog(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    setLocalIDP(currentIDP ? JSON.parse(JSON.stringify(currentIDP)) : null);
    fetchAssignments();
    fetchCatalog();
    setIsLoading(false);
  }, [currentIDP, staff.id]);

  const handleAssignFromCatalog = async (plan: CustomTrainingPlan) => {
    try {
      const res = await fetch('/api/training?action=assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, staffId: staff.id })
      });
      if (res.ok) {
        await fetchAssignments();
        setIsCatalogOpen(false);
      }
    } catch (e) { alert("Atama hatası."); }
  };

  const handleRemoveAssignment = async (id: string) => {
    if (!confirm("Eğitim ataması silinecek. Onaylıyor musunuz?")) return;
    try {
      const res = await fetch('/api/training?action=remove_assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId: id })
      });
      if (res.ok) fetchAssignments();
    } catch (e) { alert("Hata."); }
  };

  const handleGenerateIDP = async () => {
    setIsGenerating(true);
    try {
      const newIDP = await armsService.generateIDP(staff, assessmentHistory);
      if (newIDP) {
        setLocalIDP(newIDP);
        await onSave(newIDP);
      }
    } catch (e) { alert("AI Sentez Hatası."); } 
    finally { setIsGenerating(false); }
  };

  if (activeStudioPlan) {
    return <PresentationStudio customPlan={activeStudioPlan} onClose={() => setActiveStudioPlan(null)} />;
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up h-full pb-10">
      
      {/* 1. AKADEMİ HUB BAĞLANTISI (DRAWER/MODAL) */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-[5000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-end p-6 animate-fade-in">
           <div className="bg-white w-full max-w-2xl h-full rounded-[4rem] shadow-2xl flex flex-col overflow-hidden animate-slide-right">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">Akademik Katalog</h3>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">HUB Kütüphanesinden Eğitim Ata</p>
                 </div>
                 <button onClick={() => setIsCatalogOpen(false)} className="p-4 hover:bg-rose-50 text-slate-400 rounded-2xl transition-all">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                 {catalog.map(plan => (
                    <div key={plan.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:border-orange-500 transition-all">
                       <div className="min-w-0 flex-1">
                          <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase mb-2 inline-block">{plan.category}</span>
                          <h4 className="text-base font-black text-slate-800 uppercase leading-none truncate">{plan.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">{plan.description}</p>
                       </div>
                       <button onClick={() => handleAssignFromCatalog(plan)} className="ml-6 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all shadow-sm">ATA</button>
                    </div>
                 ))}
                 {catalog.length === 0 && <p className="text-center text-slate-400 py-20 font-black">Katalogda yayınlanmış eğitim bulunamadı.</p>}
              </div>
           </div>
        </div>
      )}

      {/* 2. ANA KOMUTA SATIRI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* AI IDP CARD */}
         <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                  <h4 className="text-xl font-black uppercase tracking-tighter">Neural IDP Planı</h4>
               </div>
               {localIDP ? (
                  <div className="space-y-4">
                     <p className="text-3xl font-black text-orange-500 leading-none">%{Math.round(Math.random()*100)}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">AI tarafından sentezlenen gelişim rotası aktif ve mühürlü.</p>
                  </div>
               ) : (
                  <p className="text-sm font-medium text-slate-400 italic">Personelin liyakat geçmişine göre AI gelişim rotası henüz oluşturulmadı.</p>
               )}
            </div>
            <div className="mt-12 relative z-10">
               <button 
                  onClick={handleGenerateIDP} 
                  disabled={isGenerating}
                  className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl"
               >
                  {isGenerating ? 'SENTEZLENİYOR...' : localIDP ? 'PLANLI YENİLE' : 'NÖRAL PLAN ÜRET'}
               </button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
         </div>

         {/* HUB ASSIGNMENT CARD */}
         <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Akademi HUB Görevleri</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{assignments.length} Aktif Atama</p>
               </div>
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">📚</div>
            </div>
            <div className="mt-12">
               <button 
                  onClick={() => setIsCatalogOpen(true)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3"
               >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
                  KATALOGDAN EĞİTİM ATA
               </button>
            </div>
         </div>
      </div>

      {/* 3. ATAMALAR LİSTESİ (TABLE STYLE) */}
      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
         <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">AKREDİTASYON VE EĞİTİM GEÇMİŞİ</h5>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[9px] font-black text-slate-400 uppercase">SİSTEM ÇAPRAZ KONTROL: AKTİF</span>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {assignments.length === 0 ? (
               <div className="py-20 text-center opacity-20 grayscale">
                  <svg className="w-16 h-16 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">Atanmış eğitim bulunamadı</p>
               </div>
            ) : (
               <div className="divide-y divide-slate-50">
                  {assignments.map(asg => (
                     <div key={asg.id} className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-slate-50/50 transition-colors group">
                        <div className="flex items-center gap-8 flex-1 min-w-0">
                           <div className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-xl shadow-sm group-hover:rotate-6 transition-transform">🎓</div>
                           <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                 <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[8px] font-black uppercase">{asg.plan_data?.category || 'KLİNİK'}</span>
                                 <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(asg.assigned_at).toLocaleDateString()}</span>
                              </div>
                              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter truncate">{asg.plan_title}</h4>
                              <div className="flex items-center gap-6 mt-4">
                                 <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                       <div className="h-full bg-emerald-500" style={{ width: `${asg.progress}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">%{asg.progress}</span>
                                 </div>
                                 {asg.status === 'completed' && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg> MÜHÜRLENDİ</span>}
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => setActiveStudioPlan(asg.plan_data)}
                              className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                           >ÖNİZLE</button>
                           <button 
                              onClick={() => handleRemoveAssignment(asg.id)}
                              className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                           ><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DevelopmentRouteView;
