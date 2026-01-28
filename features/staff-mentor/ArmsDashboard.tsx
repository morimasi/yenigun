
import React, { useState, useMemo, useEffect } from 'react';
import { StaffMember, Branch } from '../../types';
import StaffProfileView from './StaffProfileView';

const ArmsDashboard: React.FC = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/staff?action=list_all');
      const data = await res.json();
      if (Array.isArray(data)) setStaffList(data);
    } catch (e) {
      console.error("Staff fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => 
      s.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
    );
  }, [staffList, searchTerm]);

  const stats = useMemo(() => {
    if (staffList.length === 0) return { avgScore: 0, growth: 0 };
    const validScores = staffList.filter(s => s.last_score !== null).map(s => s.last_score);
    const avg = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
    return { avgScore: avg, growth: Math.round(avg * 0.4) };
  }, [staffList]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      <div className="bg-slate-950 p-12 md:p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border border-white/5 group">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-5 py-2 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">AKADEMİK REZONANS SİSTEMİ</span>
              <div className="h-px w-20 bg-white/20"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">REAL-TIME DATABASE V3.0</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] italic">
              Kadrolu<br/>Klinik Zeka
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-10 text-right">
            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl">
               <p className="text-6xl font-black text-orange-500">%{stats.avgScore}</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-tight">KURUMSAL<br/>AKADEMİK VERİM</p>
            </div>
            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl">
               <p className="text-6xl font-black text-emerald-500">%{stats.growth}</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-tight">YILLIK<br/>REZONANS ARTIŞI</p>
            </div>
          </div>
        </div>
        <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[200px] group-hover:scale-110 transition-transform duration-[5s]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-3 space-y-6">
          <div className="p-8 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
             <div className="mb-8">
                <input 
                  type="text" 
                  placeholder="Personel Sorgula..." 
                  className="w-full bg-slate-50 rounded-2xl p-4 text-[11px] font-bold outline-none border border-transparent focus:border-orange-500 transition-all shadow-inner"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             
             <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                  [1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse"></div>)
                ) : filteredStaff.length === 0 ? (
                  <p className="text-[10px] font-black text-slate-300 uppercase text-center py-10">Kayıt Bulunamadı</p>
                ) : (
                  filteredStaff.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStaffId(s.id)}
                      className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center gap-5 text-left relative group/item ${
                        selectedStaffId === s.id ? 'bg-slate-950 border-slate-950 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-50 hover:border-orange-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-all ${selectedStaffId === s.id ? 'bg-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                        {s.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-black uppercase tracking-tight truncate leading-none mb-2">{s.name}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 truncate">{s.branch}</p>
                      </div>
                      {s.last_score !== null && (
                        <div className={`px-2 py-1 rounded-lg text-[9px] font-black ${s.last_score > 70 ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>%{s.last_score}</div>
                      )}
                    </button>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="xl:col-span-9">
          {selectedStaffId ? (
            <StaffProfileView staffId={selectedStaffId} />
          ) : (
            <div className="h-[800px] bg-white border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center p-24 opacity-30 grayscale">
               <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 shadow-inner border border-slate-100">
                  <svg className="w-20 h-20 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               </div>
               <h3 className="text-3xl font-black text-slate-300 uppercase tracking-[1em]">Klinik Dosya Seçin</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArmsDashboard;
