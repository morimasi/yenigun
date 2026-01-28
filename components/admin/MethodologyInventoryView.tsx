
import React from 'react';
import { BRANCH_QUESTIONS, CERTIFICATIONS } from '../../constants';

const MethodologyInventoryView: React.FC = () => {
  /**
   * @fix Line 8: verificationQuestion -> verificationQuestions.
   * We use flatMap because verificationQuestions is now an array for each certification.
   */
  const allQuestions = [
    ...Object.values(BRANCH_QUESTIONS).flat(),
    ...CERTIFICATIONS.flatMap(c => c.verificationQuestions)
  ];

  const categories = [
    { id: 'technicalExpertise', label: 'Alan Yeterliliği', color: 'bg-orange-600' },
    { id: 'workEthics', label: 'İş Ahlakı', color: 'bg-emerald-600' },
    { id: 'pedagogicalAnalysis', label: 'Pedagoji', color: 'bg-blue-600' },
    { id: 'sustainability', label: 'Direnç', color: 'bg-rose-600' },
    { id: 'institutionalLoyalty', label: 'Sadakat', color: 'bg-slate-900' }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">ANALİZ ENVANTERİ</h3>
          <p className="text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-[0.3em] max-w-xl">
            Sistemin liyakat kararlarını verirken kullandığı soru havuzu, klinik ağırlık matrisleri ve doğrulama protokolleri.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{cat.label}</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-slate-900 leading-none">
                {allQuestions.filter(q => q.category === cat.id).length}
              </span>
              <div className={`w-3 h-3 rounded-full mb-1 ${cat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">Aktif Soru ve Ağırlık Matrisleri</h4>
         <div className="space-y-6">
            {allQuestions.map((q, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-orange-200 transition-all group">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                       <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{q.category}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{q.type === 'radio' ? 'Çoktan Seçmeli' : 'Açık Uçlu'}</span>
                    </div>
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">ID: {q.id}</span>
                 </div>
                 <p className="text-xl font-black text-slate-800 leading-tight mb-8">"{q.text}"</p>
                 {q.weightedOptions && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.weightedOptions.map((opt, idx) => (
                        <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                           <p className="text-[12px] font-bold text-slate-700 mb-3 italic">"{opt.label}"</p>
                           <div className="flex flex-wrap gap-2">
                              {Object.entries(opt.weights).map(([wKey, wVal]) => (
                                <span key={wKey} className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500">
                                   {wKey}: {wVal}
                                </span>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default MethodologyInventoryView;
