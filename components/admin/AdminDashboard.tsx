
import React, { useState, useMemo } from 'react';
import { Candidate, GlobalConfig, StaffMember, StaffRole, Branch, ArchiveCategory } from '../../types';

interface AdminDashboardProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate, onRefresh }) => {
  const [activeView, setActiveView] = useState<'candidates' | 'staff' | 'global_config'>('candidates');
  const [staffList, setStaffList] = useState<StaffMember[]>([]); // Normalde API'den gelir
  const [isHiring, setIsHiring] = useState<string | null>(null);

  const handlePromoteToStaff = async (candidate: Candidate) => {
    if (!confirm(`${candidate.name} isimli aday KURUM PERSONELİ olarak atanacak. Onaylıyor musunuz?`)) return;
    
    setIsHiring(candidate.id);
    
    // 1. ADIMI: ADAYI ARŞİVE MÜHÜRLE
    // @fix: Changed string literal to ArchiveCategory enum member for type safety.
    const updatedCandidate: Candidate = {
      ...candidate,
      status: 'archived',
      archiveCategory: ArchiveCategory.HIRED_CONTRACTED,
      archiveNote: `ATAMA: ${new Date().toLocaleDateString('tr-TR')} tarihinde personel kadrosuna dahil edildi.`,
      timestamp: Date.now()
    };

    // 2. ADIMI: PERSONEL KAYDI OLUŞTUR (SIMULATION)
    const newStaff: StaffMember = {
      id: `STF-${candidate.id.split('-')[1] || Math.random().toString(36).substr(2, 5)}`,
      name: candidate.name,
      email: candidate.email,
      role: StaffRole.Staff,
      branch: candidate.branch,
      experience_years: candidate.experienceYears,
      onboarding_complete: false,
      status: 'active'
    };

    try {
      // API Call Placeholder
      console.log("Personel Atama Başlatıldı:", newStaff);
      await onUpdateCandidate(updatedCandidate);
      alert(`${candidate.name} başarıyla Akademik Kadroya mühürlendi. Personel Dosyaları (ARMS) modülünden eğitim planını başlatabilirsiniz.`);
      onRefresh();
    } catch (e) {
      alert("Atama sırasında bir nöral hata oluştu.");
    } finally {
      setIsHiring(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">TOPLAM ADAY HAVUZU</p>
            <p className="text-4xl font-black text-slate-900">{candidates.filter(c => c.status !== 'archived').length}</p>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">AKADEMİK KADRO (AKTİF)</p>
            <p className="text-4xl font-black">{staffList.length || 'Sorgulanıyor...'}</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">KRİTİK LİYAKAT ORTALAMASI</p>
            <p className="text-4xl font-black text-slate-900">%{Math.round(candidates.reduce((a, b) => a + (b.report?.score || 0), 0) / (candidates.length || 1))}</p>
         </div>
      </div>

      {/* SUB-NAV */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
         {[
           { id: 'candidates', label: 'ADAY YÖNETİMİ' },
           { id: 'staff', label: 'PERSONEL YÖNETİMİ (ARMS)' },
           { id: 'global_config', label: 'EVRENSEL AYARLAR' }
         ].map(v => (
            <button 
               key={v.id}
               onClick={() => setActiveView(v.id as any)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === v.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
               {v.label}
            </button>
         ))}
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px]">
         
         {activeView === 'candidates' && (
            <div className="p-10 space-y-6">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Aktif Başvuru Kontrol Listesi</h3>
                  <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">{candidates.length} KAYIT</span>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-slate-100">
                           <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">İsim / Branş</th>
                           <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Liyakat</th>
                           <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                           <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksiyonlar</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {candidates.filter(c => c.status !== 'archived').map(c => (
                           <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="py-5 px-6">
                                 <p className="font-black text-slate-900 uppercase text-xs">{c.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{c.branch}</p>
                              </td>
                              <td className="py-5 px-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                       <div className="h-full bg-orange-600" style={{ width: `${c.report?.score || 0}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900">%{c.report?.score || 0}</span>
                                 </div>
                              </td>
                              <td className="py-5 px-6">
                                 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${c.status === 'interview_scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {c.status}
                                 </span>
                              </td>
                              <td className="py-5 px-6">
                                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => handlePromoteToStaff(c)}
                                      disabled={isHiring === c.id}
                                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase hover:bg-orange-600 transition-all shadow-md"
                                    >
                                       {isHiring === c.id ? 'İŞLENİYOR...' : 'PERSONEL OLARAK ATA'}
                                    </button>
                                    <button 
                                      onClick={() => { if(confirm('Silinsin mi?')) onDeleteCandidate(c.id); }}
                                      className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all"
                                    >SİL</button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {activeView === 'staff' && (
            <div className="flex flex-col items-center justify-center p-32 text-center opacity-30 grayscale scale-75">
               <div className="w-32 h-32 bg-slate-100 rounded-[4rem] flex items-center justify-center mb-8 border-4 border-dashed border-slate-200">
                  <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               </div>
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-[0.5em]">ARMS MODÜLÜ YÜKLENİYOR</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Tüm personel veritabanı senkronize ediliyor...</p>
            </div>
         )}

         {activeView === 'global_config' && (
            <div className="p-20 text-center">
               <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-10 text-3xl">⚙️</div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Sistem Parametreleri</h3>
               <p className="max-w-lg mx-auto text-sm text-slate-500 font-medium leading-relaxed">
                  Bu bölümden uygulamanın tüm modüllerinin çalışma limitlerini, API entegrasyonlarını ve kurumsal tema ayarlarını güncelleyebilirsiniz.
               </p>
               <div className="mt-12 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <button className="p-6 border-2 border-slate-100 rounded-[2rem] text-left hover:border-orange-500 transition-all">
                     <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">MİA AI Persona</span>
                     <span className="text-sm font-bold text-slate-800">Skeptik ve Analitik Mod</span>
                  </button>
                  <button className="p-6 border-2 border-slate-100 rounded-[2rem] text-left hover:border-orange-500 transition-all">
                     <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">ARMS Raporlama</span>
                     <span className="text-sm font-bold text-slate-800">Haftalık Otomatik Sentez</span>
                  </button>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default AdminDashboard;
