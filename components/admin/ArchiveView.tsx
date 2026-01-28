
import React, { useState, useMemo } from 'react';
import { Candidate, ArchiveCategory } from '../../types';
import { SearchableSelect } from '../../shared/ui/SearchableSelect';

interface ArchiveViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

const CATEGORY_MAP: Record<ArchiveCategory, { label: string, color: string, desc: string }> = {
  TALENT_POOL: { label: 'Yetenek Havuzu', color: 'bg-emerald-500', desc: 'İleride kesinlikle değerlendirilmesi gereken yüksek potansiyelli uzmanlar.' },
  FUTURE_REFERENCE: { label: 'Gelecek Başvuru', color: 'bg-blue-500', desc: 'Mevcut pozisyon uygun olmasa da gelişim vaat eden adaylar.' },
  DISQUALIFIED: { label: 'Diskalifiye', color: 'bg-slate-400', desc: 'Kurumsal liyakat kriterlerini karşılamayan başvurular.' },
  BLACK_LIST: { label: 'Kara Liste', color: 'bg-rose-600', desc: 'Etik veya güvenlik riski taşıyan, tekrar mülakata alınmayacak isimler.' },
  HIRED_CONTRACTED: { label: 'Atanmış / Çalışan', color: 'bg-slate-900', desc: 'Kurum bünyesine katılmış veya daha önce çalışmış kadro.' }
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const archivedCandidates = useMemo(() => 
    candidates.filter(c => c.status === 'archived'), 
    [candidates]
  );

  const filteredArchive = useMemo(() => {
    return archivedCandidates.filter(c => {
      const matchesCategory = activeCategory === 'ALL' || c.archiveCategory === activeCategory;
      const matchesSearch = c.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [archivedCandidates, activeCategory, searchTerm]);

  const stats = useMemo(() => {
    const res: Record<string, number> = { ALL: archivedCandidates.length };
    archivedCandidates.forEach(c => {
      if (c.archiveCategory) res[c.archiveCategory] = (res[c.archiveCategory] || 0) + 1;
    });
    return res;
  }, [archivedCandidates]);

  const handleRestore = (candidate: Candidate) => {
    if (confirm("Bu aday aktif mülakat havuzuna (Beklemede) geri taşınacaktır. Onaylıyor musunuz?")) {
      onUpdateCandidate({
        ...candidate,
        status: 'pending',
        timestamp: Date.now()
      });
    }
  };

  const handleFullDelete = (id: string) => {
    if (confirm("DİKKAT: Aday verileri kalıcı olarak silinecektir. Bu işlem geri alınamaz!")) {
      onDeleteCandidate(id);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      
      {/* HEADER & ANALYTICS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 bg-slate-900 p-12 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-3xl">
           <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">KURUMSAL BELLEK</span>
              <div className="h-px w-20 bg-white/20"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">STABIL VERİ ARŞİVİ</span>
           </div>
           <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">Akademik Arşiv<br/>Yönetim Merkezi</h3>
           <p className="text-base md:text-xl font-bold text-slate-400 leading-relaxed italic opacity-80 uppercase tracking-tight">
             "Kurumun liyakat hafızası, geçmiş verilerle geleceği aydınlatıyor."
           </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-4">
           <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl flex items-center gap-8">
              <div className="text-center">
                 <p className="text-5xl font-black">{stats.ALL}</p>
                 <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mt-2">TOPLAM KAYIT</p>
              </div>
              <div className="w-px h-16 bg-white/10"></div>
              <div className="text-center">
                 <p className="text-5xl font-black text-emerald-500">{stats.TALENT_POOL || 0}</p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">PREMIUM YETENEK</p>
              </div>
           </div>
        </div>
        <div className="absolute -right-40 -top-40 w-[60rem] h-[60rem] bg-orange-600/5 rounded-full blur-[200px] pointer-events-none"></div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sticky top-28 z-40 no-print">
         <div className="lg:col-span-8 bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveCategory('ALL')}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
               TÜM ARŞİV ({stats.ALL})
            </button>
            {Object.entries(CATEGORY_MAP).map(([key, data]) => (
              <button 
                key={key}
                onClick={() => setActiveCategory(key as ArchiveCategory)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-3 ${activeCategory === key ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                 <div className={`w-2 h-2 rounded-full ${activeCategory === key ? 'bg-white' : data.color}`}></div>
                 {data.label} ({stats[key] || 0})
              </button>
            ))}
         </div>
         <div className="lg:col-span-4 bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center px-8">
            <svg className="w-5 h-5 text-slate-300 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
               type="text"
               placeholder="Arşivde isim sorgula..."
               className="flex-1 bg-transparent font-bold text-sm outline-none text-slate-900 placeholder:text-slate-300"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* GRID AREA */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredArchive.length === 0 ? (
           <div className="col-span-full py-40 text-center bg-white rounded-[5rem] border-4 border-dashed border-slate-100 opacity-40">
              <svg className="w-20 h-20 text-slate-200 mx-auto mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <h4 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Arşivde Kayıt Bulunmuyor</h4>
           </div>
         ) : (
           filteredArchive.map(c => {
             const catInfo = CATEGORY_MAP[c.archiveCategory || 'FUTURE_REFERENCE'];
             return (
               <div key={c.id} className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                     <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-white shadow-md ${catInfo.color}`}>
                        {catInfo.label}
                     </div>
                     <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date(c.timestamp).toLocaleDateString('tr-TR')}</span>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-10">
                     <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white text-2xl font-black shadow-xl">
                        {c.name.charAt(0)}
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{c.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.branch}</p>
                     </div>
                  </div>

                  <div className="space-y-6 mb-10">
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 min-h-[100px] flex flex-col justify-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Arşivleme Notu</span>
                        <p className="text-[12px] font-bold text-slate-600 leading-relaxed italic truncate-3-lines">
                           "{c.archiveNote || 'Herhangi bir karar notu eklenmemiş.'}"
                        </p>
                     </div>
                     
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] ${c.report && c.report.score > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                           %{c.report?.score || '?'}
                        </div>
                        <div className="flex-1">
                           <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${c.report && c.report.score > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${c.report?.score || 0}%` }}></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     <button 
                       onClick={() => handleRestore(c)}
                       className="py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                     >
                        HAVUZA GERİ TAŞI
                     </button>
                     <button 
                        onClick={() => handleFullDelete(c.id)}
                        className="py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                     >
                        KALICI OLARAK SİL
                     </button>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -translate-y-24 translate-x-24 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 pointer-events-none opacity-50"></div>
               </div>
             );
           })
         )}
      </div>

      {/* FOOTER INFO */}
      <div className="bg-orange-50 p-10 rounded-[4rem] border border-orange-100 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-orange-600 shadow-xl shrink-0">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         </div>
         <div className="flex-1 space-y-2 text-center md:text-left">
            <h5 className="text-[14px] font-black text-orange-900 uppercase tracking-widest">Arşiv Mantığı ve Kurumsal Koruma</h5>
            <p className="text-[12px] font-bold text-orange-800 leading-relaxed uppercase tracking-tight opacity-80">
               Arşivlenen dosyalar bulut veritabanında mühürlenir. Bu veriler mülakat istatistiklerini beslerken aktif listeyi meşgul etmez. Kara listeye alınan adaylar, aynı e-posta veya TC Kimlik ile başvurduklarında sistem otomatik uyarı verir.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ArchiveView;
