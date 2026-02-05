
import React, { useState, useEffect } from 'react';
import { StaffMember, CustomTrainingPlan } from '../../types';

interface AssignmentModalProps {
  plan: CustomTrainingPlan | { id: string; title: string };
  onClose: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ plan, onClose }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/staff?action=list_all');
        if (res.ok) setStaffList(await res.json());
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchStaff();
  }, []);

  const handleAssign = async () => {
    if (selectedStaff.size === 0) return alert("Lütfen en az bir personel seçiniz.");
    setIsSaving(true);
    try {
      const res = await fetch('/api/training?action=assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          staffIds: Array.from(selectedStaff)
        })
      });
      if (res.ok) {
        alert("Atama Başarıyla Tamamlandı.");
        onClose();
      }
    } catch (e) { alert("Hata."); }
    finally { setIsSaving(false); }
  };

  const toggleStaff = (id: string) => {
    const next = new Set(selectedStaff);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStaff(next);
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
       <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
             <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Personel Atama</h3>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">Müfredat: {plan.title}</p>
             </div>
             <button onClick={onClose} className="p-4 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 max-h-[500px] custom-scrollbar space-y-2">
             {isLoading ? (
               <div className="py-20 text-center animate-pulse text-slate-400 font-black uppercase text-xs">Personel Listesi Yükleniyor...</div>
             ) : staffList.map(s => (
               <div 
                 key={s.id} 
                 onClick={() => toggleStaff(s.id)}
                 className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedStaff.has(s.id) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200'}`}
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedStaff.has(s.id) ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{s.name.charAt(0)}</div>
                     <div>
                        <p className="text-[11px] font-black uppercase leading-none mb-1">{s.name}</p>
                        <p className="text-[9px] font-bold opacity-60 uppercase">{s.branch}</p>
                     </div>
                  </div>
                  {selectedStaff.has(s.id) && <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
               </div>
             ))}
          </div>

          <div className="p-10 border-t border-slate-50 bg-white">
             <button 
               onClick={handleAssign}
               disabled={isSaving || selectedStaff.size === 0}
               className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-xl hover:bg-orange-600 transition-all disabled:opacity-30"
             >
                {isSaving ? 'İŞLENİYOR...' : `${selectedStaff.size} PERSONELE ATA`}
             </button>
          </div>
       </div>
    </div>
  );
};

export default AssignmentModal;
