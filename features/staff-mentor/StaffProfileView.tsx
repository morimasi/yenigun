
import React, { useState } from 'react';
import { StaffMember, IDP, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';

const StaffProfileView: React.FC<{ staff: StaffMember }> = ({ staff }) => {
  const [idp, setIdp] = useState<IDP | null>(null);
  const [slides, setSlides] = useState<TrainingSlide[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const newIdp = await armsService.generateIDP(staff);
      setIdp(newIdp);
      const newSlides = await armsService.generateTrainingSlides(newIdp, staff.branch);
      setSlides(newSlides);
    } catch (e) {
      alert("Nöral planlama motoru hatası.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-scale-in">
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl">
        <div className="flex justify-between items-start mb-12">
          <div className="flex gap-8 items-center">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl">
              {staff.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{staff.name}</h3>
              <p className="text-[12px] font-black text-orange-600 uppercase tracking-[0.4em] mt-3">{staff.branch} / {staff.role}</p>
            </div>
          </div>
          {!idp && (
            <button 
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'ANALİZ EDİLİYOR...' : 'GELİŞİM PLANI OLUŞTUR'}
            </button>
          )}
        </div>

        {idp && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
             <div className="space-y-8">
                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                   <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">KLİNİK BOŞLUK ANALİZİ</h5>
                   <div className="space-y-3">
                      {idp.identifiedGaps.map((gap, i) => (
                        <div key={i} className="flex gap-4 items-center">
                           <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                           <p className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">{gap}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">STRATEJİK YOL HARİTASI</h5>
                   <div className="space-y-8 relative z-10">
                      <div>
                        <span className="text-[9px] font-black text-orange-500 uppercase block mb-2">KISA VADE (3 AY)</span>
                        <p className="text-[14px] font-bold text-slate-300 leading-relaxed italic">"{idp.roadmap.shortTerm}"</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-orange-500 uppercase block mb-2">UZUN VADE (12 AY)</span>
                        <p className="text-[14px] font-bold text-slate-300 leading-relaxed italic">"{idp.roadmap.longTerm}"</p>
                      </div>
                   </div>
                   <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">OTOMATİK EĞİTİM SUNUSU</h4>
                  <div className="flex gap-1">
                    {slides?.map((_, i) => (
                      <div key={i} className={`w-8 h-1 rounded-full transition-all ${i === activeSlide ? 'bg-orange-600 w-12' : 'bg-slate-100'}`}></div>
                    ))}
                  </div>
                </div>

                {slides ? (
                  <div className="bg-slate-50 rounded-[4rem] p-12 min-h-[500px] flex flex-col justify-between border border-slate-100 shadow-inner relative overflow-hidden group">
                     <div className="relative z-10">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6 block">SLAYT {activeSlide + 1} / {slides.length}</span>
                        <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-8 italic">"{slides[activeSlide].title}"</h4>
                        <p className="text-[16px] font-bold text-slate-600 leading-relaxed italic mb-10">"{slides[activeSlide].content}"</p>
                        
                        <div className="space-y-3">
                           {slides[activeSlide].keyPoints.map((point, i) => (
                             <div key={i} className="flex gap-4 items-center bg-white/60 p-4 rounded-2xl border border-white">
                                <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{point}</p>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="mt-12 flex justify-between items-center relative z-10">
                        <button 
                          disabled={activeSlide === 0}
                          onClick={() => setActiveSlide(s => s - 1)}
                          className="p-5 bg-white rounded-full shadow-lg text-slate-400 hover:text-orange-600 disabled:opacity-30 transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="text-center">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tartışma Odağı</p>
                           <p className="text-[11px] font-bold text-orange-600 uppercase italic">"{slides[activeSlide].discussionQuestion}"</p>
                        </div>
                        <button 
                          disabled={activeSlide === slides.length - 1}
                          onClick={() => setActiveSlide(s => s + 1)}
                          className="p-5 bg-white rounded-full shadow-lg text-slate-400 hover:text-orange-600 disabled:opacity-30 transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                     </div>
                     <div className="absolute -left-20 -top-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
                  </div>
                ) : (
                  <div className="h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem] flex items-center justify-center opacity-30">
                     <p className="text-[10px] font-black uppercase tracking-widest">Eğitim İçeriği Üretilmedi</p>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfileView;
