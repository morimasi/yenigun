
import React, { useState, useEffect } from 'react';
import { StaffMember, CustomTrainingPlan } from '../../types';

interface AssignmentModalProps {
  plan: CustomTrainingPlan;
  onClose: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ plan, onClose }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/staff?action=list_all');
        if (res.ok) setStaffList(await res.json());
      } finally { setIsLoading(false); }
    };
    fetchStaff();
  }, []);

  const handleAssign = async () => {
    if (selectedIds.size === 0) return alert("Personel seçin.");
    try {
      const res = await fetch('/api/training?action=assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, staffIds: Array.from(selectedIds) })
      });
      if (res.ok) { alert("Atama başarılı."); onClose(); }
    } catch (e) { alert("Hata."); }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="fixed inset-0 z-[5500] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
       <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="text-2xl font-black text-slate-900 uppercase">Personel Atama</h3>
             <button onClick={onClose} className="p-4 hover:bg-rose-50 text-slate-400 rounded-2xl transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 max-h-[400px] custom-scrollbar space-y-2">
             {staffList.map(s => (
                <div key={s.id} onClick={() => toggleSelect(s.id)} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedIds.has(s.id) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-600'}`}>
                   <p className="text-[11px] font-black uppercase">{s.name}</p>
                   {selectedIds.has(s.id) && <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>}
                </div>
             ))}
          </div>
          <div className="p-10 bg-white">
             <button onClick={handleAssign} className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black uppercase shadow-xl hover:bg-orange-600 transition-all">SEÇİLİ {selectedIds.size} KİŞİYE ATA</button>
          </div>
       </div>
    </div>
  );
};

export default AssignmentModal;
