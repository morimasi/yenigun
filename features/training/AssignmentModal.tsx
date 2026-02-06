
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
        alert(`${selectedStaff.size} personelin eğitim rotasına eklendi.`);
        onClose();
      }
    } catch (e) { alert("Atama sırasında nöral hata."); }
    finally { setIsSaving(false); }
  };

  const toggleStaff = (id: string) => {
    const next = new Set(selectedStaff);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStaff(next);
  };

  return (
    <div className="fixed inset-0 z-[5500] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
       <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-scale-in border-b-[16px] border-orange-600">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
             <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Personel Atama Merkezi</h3>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">Rota: {plan.title}</p>
             </div>
             <button onClick={onClose} className="p-4 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-all"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 max-h-[500px] custom-scrollbar space-y-3">
             {isLoading ? (
               <div className="py-20 text-center animate-pulse text-slate-400 font-black uppercase text-xs">Yükleniyor...</div>
             ) : staffList.map(s => (
               <div 
                 key={s.id} 
                 onClick={() => toggleStaff(s.id)}
                 className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedStaff.has(s.id) ? 'bg-slate-950 border-slate-950 text-white shadow-xl translate-x-2' : 'bg-white border-slate-100 text-slate-500 hover:border-orange-300'}`}
               >
                  <div className="flex items-center gap-6">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner transition-all ${selectedStaff.has(s.id) ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100'}`}>{s.name.charAt(0)}</div>
                     <div>
                        <p className="text-[13px] font-black uppercase leading-none mb-1.5">{s.name}</p>
                        <p className={`text-[9px] font-bold uppercase ${selectedStaff.has(s.id) ? 'text-slate-400' : 'text-slate-400'}`}>{s.branch}</p>
                     </div>
                  </div>
                  {selectedStaff.has(s.id) && <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in"><svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg></div>}
               </div>
             ))}
          </div>

          <div className="p-10 bg-white">
             <button 
               onClick={handleAssign}
               disabled={isSaving || selectedStaff.size === 0}
               className="w-full py-8 bg-slate-950 text-white rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 transition-all disabled:opacity-30 active:scale-95"
             >
                {isSaving ? 'MÜHÜRLENİYOR...' : `${selectedStaff.size} UZMANA ATAMAYI TAMAMLA`}
             </button>
          </div>
       </div>
    </div>
  );
};

export default AssignmentModal;
