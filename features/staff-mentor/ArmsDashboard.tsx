
import React, { useState, useMemo } from 'react';
import { StaffMember, Branch } from '../../types';
import StaffProfileView from './StaffProfileView';

const MOCK_STAFF: StaffMember[] = [
  { id: 's1', name: 'Zeynep Aksoy', branch: Branch.OzelEgitim, role: 'senior', startDate: Date.now() - 31536000000 * 3, status: 'active', assessments: [] },
  { id: 's2', name: 'Caner Yılmaz', branch: Branch.DilKonusma, role: 'teacher', startDate: Date.now() - 31536000000 * 1, status: 'active', assessments: [] },
  { id: 's3', name: 'Merve Doğan', branch: Branch.Ergoterapi, role: 'teacher', startDate: Date.now() - 31536000000 * 0.5, status: 'probation', assessments: [] }
];

const ArmsDashboard: React.FC = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  const selectedStaff = useMemo(() => MOCK_STAFF.find(s => s.id === selectedStaffId), [selectedStaffId]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      {/* ARMS HEADER - DARK THEME LUXURY */}
      <div className="bg-slate-950 p-12 md:p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border border-white/5 group">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="px-5 py-2 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">AKADEMİK REZONANS SİSTEMİ</span>
              <div className="h-px w-20 bg-white/20"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">MENTORLUK & GELİŞİM V2.0</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] italic">
              Kadrolu<br/>Klinik Zeka
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-10 text-right">
            <div>
               <p className="text-6xl font-black text-orange-500">%{MOCK_STAFF.length * 14}</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-tight">GLOBAL<br/>AKADEMİK VERİM</p>
            </div>
            <div>
               <p className="text-6xl font-black text-emerald-500">%{MOCK_STAFF.length * 28}</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-tight">YILLIK<br/>REZONANS ARTIŞI</p>
            </div>
          </div>
        </div>
        <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[200px] group-hover:scale-110 transition-transform duration-[5s]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* STAFF LIST SECTION */}
        <div className="xl:col-span-3 space-y-6">
          <div className="p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
             <div className="flex items-center justify-between mb-10 px-2">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">AKTİF AKADEMİSYENLER</h4>
                <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">{MOCK_STAFF.length}</span>
             </div>
             <div className="space-y-3">
                {MOCK_STAFF.map(staff => (
                  <button
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-6 text-left relative group/item ${
                      selectedStaffId === staff.id ? 'bg-slate-950 border-slate-950 text-white shadow-2xl translate-x-3' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-orange-500/30'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-xl transition-all ${selectedStaffId === staff.id ? 'bg-orange-600 scale-110' : 'bg-white'}`}>
                      {staff.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-black uppercase tracking-tight leading-none mb-2 truncate">{staff.name}</p>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedStaffId === staff.id ? 'text-slate-400' : 'text-slate-400'}`}>{staff.branch}</p>
                    </div>
                    {selectedStaffId === staff.id && <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>}
                  </button>
                ))}
             </div>
             <div className="mt-10 p-6 bg-orange-50 rounded-3xl border border-orange-100 opacity-60">
                <p className="text-[9px] font-black text-orange-900 uppercase leading-relaxed tracking-tight italic">
                   * Periyodik değerlendirmesini tamamlamayan personeller kırmızı ile işaretlenir.
                </p>
             </div>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="xl:col-span-9">
          {selectedStaff ? (
            <StaffProfileView staff={selectedStaff} />
          ) : (
            <div className="h-[850px] bg-white border-4 border-dashed border-slate-100 rounded-[6rem] flex flex-col items-center justify-center text-center p-24 opacity-30 grayscale relative overflow-hidden">
               <div className="w-48 h-48 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 shadow-inner border border-slate-100">
                  <svg className="w-24 h-24 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               </div>
               <h3 className="text-4xl font-black text-slate-300 uppercase tracking-[0.8em] mb-6 leading-none">Mentorluk Kanvası</h3>
               <p className="text-[13px] font-black uppercase tracking-[0.4em] text-slate-300">Sol panelden bir öğretmen dosyası seçerek nöral gelişimi yönetin.</p>
               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArmsDashboard;
