
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
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* ARMS HEADER - DARK THEME LUXURY */}
      <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-orange-600 rounded-lg text-[9px] font-black uppercase tracking-widest">MENTORLUK MODÜLÜ</span>
              <div className="h-px w-12 bg-white/20"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">AKADEMİK REZONANS V2.0</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none italic">
              Kurumsal Gelişim<br/>ve Mentorluk
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-5xl font-black text-orange-500">%{MOCK_STAFF.length * 12}</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">HAVUZ REZONANS VERİMİ</p>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* STAFF LIST */}
        <div className="xl:col-span-3 space-y-3">
          <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">AKTİF AKADEMİK KADRO</h4>
             <div className="space-y-2">
                {MOCK_STAFF.map(staff => (
                  <button
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${
                      selectedStaffId === staff.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-x-2' : 'bg-slate-50 border-transparent text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedStaffId === staff.id ? 'bg-orange-600' : 'bg-white shadow-sm'}`}>
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-tight leading-none">{staff.name}</p>
                      <p className={`text-[8px] font-bold uppercase mt-1 ${selectedStaffId === staff.id ? 'text-slate-400' : 'text-slate-400'}`}>{staff.branch}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* PROFILE & IDP VIEW */}
        <div className="xl:col-span-9">
          {selectedStaff ? (
            <StaffProfileView staff={selectedStaff} />
          ) : (
            <div className="h-[600px] bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center opacity-40 grayscale">
               <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               </div>
               <p className="text-xl font-black uppercase tracking-[0.5em] text-slate-400">Personel Dosyası Seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArmsDashboard;
