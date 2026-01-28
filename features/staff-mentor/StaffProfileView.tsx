
import React, { useState } from 'react';
import { StaffMember, IDP, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';

const StaffProfileView: React.FC<{ staff: StaffMember }> = ({ staff }) => {
  const [idp, setIdp] = useState<IDP | null>(null);
  const [slides, setSlides] = useState<TrainingSlide[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const SlideContent = ({ slide, index, total }: { slide: TrainingSlide, index: number, total: number }) => (
    <div className={`flex flex-col justify-between h-full transition-all duration-700 ${isFullscreen ? 'p-20 bg-slate-950 text-white' : 'p-12 bg-slate-50'}`}>
       <div className="space-y-12">
          <div className="flex justify-between items-start">
             <span className={`text-[12px] font-black uppercase tracking-[0.5em] ${isFullscreen ? 'text-orange-500' : 'text-orange-600'}`}>SLAYT {index + 1} / {total}</span>
             {isFullscreen && <button onClick={() => setIsFullscreen(false)} className="text-white/40 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">[ SUNUMDAN ÇIK ]</button>}
          </div>
          <h4 className={`font-black uppercase tracking-tighter italic leading-none ${isFullscreen ? 'text-7xl text-white' : 'text-4xl text-slate-900'}`}>"{slide.title}"</h4>
          <p className={`font-bold italic leading-relaxed opacity-90 ${isFullscreen ? 'text-3xl text-slate-300' : 'text-xl text-slate-600'}`}>"{slide.content}"</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
             <div className="space-y-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block border-b border-white/10 pb-4">KRİTİK ÖĞRETİLER</span>
                {slide.keyPoints.map((point, i) => (
                  <div key={i} className={`flex gap-5 items-center p-5 rounded-3xl border ${isFullscreen ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                     <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.8)]"></div>
                     <p className={`font-black uppercase tracking-tight ${isFullscreen ? 'text-base text-slate-200' : 'text-[12px] text-slate-800'}`}>{point}</p>
                  </div>
                ))}
             </div>
             {slide.clinicalCase && (
               <div className={`p-10 rounded-[3rem] border flex flex-col justify-center ${isFullscreen ? 'bg-orange-600/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
                  <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-4">KLİNİK VAKA ANALİZİ</span>
                  <p className={`font-bold italic leading-relaxed ${isFullscreen ? 'text-xl text-orange-100' : 'text-sm text-orange-900'}`}>{slide.clinicalCase}</p>
               </div>
             )}
          </div>
       </div>

       <div className={`mt-16 flex justify-between items-center pt-8 border-t ${isFullscreen ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex gap-4">
             <button disabled={index === 0} onClick={() => setActiveSlide(s => s - 1)} className="p-6 bg-slate-900 text-white rounded-full hover:bg-orange-600 transition-all disabled:opacity-20"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg></button>
             <button disabled={index === total - 1} onClick={() => setActiveSlide(s => s + 1)} className="p-6 bg-slate-900 text-white rounded-full hover:bg-orange-600 transition-all disabled:opacity-20"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg></button>
          </div>
          <div className="text-center">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">TARTIŞMA ODAĞI</p>
             <p className={`font-black uppercase italic ${isFullscreen ? 'text-2xl text-orange-500' : 'text-[14px] text-orange-600'}`}>"{slide.discussionQuestion}"</p>
          </div>
          <div className="hidden md:block">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ARMS v2 // NÖRAL EĞİTİM MOTORU</span>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-scale-in">
      {isFullscreen && slides && (
        <div className="fixed inset-0 z-[1000] bg-slate-950 animate-fade-in overflow-hidden">
           <SlideContent slide={slides[activeSlide]} index={activeSlide} total={slides.length} />
        </div>
      )}

      <div className="bg-white p-12 md:p-16 rounded-[4.5rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 mb-16 relative z-10">
          <div className="flex gap-10 items-center">
            <div className="w-32 h-32 bg-slate-950 rounded-[3rem] flex items-center justify-center text-white text-6xl font-black shadow-3xl">
              {staff.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4 italic">{staff.name}</h3>
              <div className="flex items-center gap-4">
                 <span className="px-5 py-2 bg-orange-600 rounded-xl text-[11px] font-black text-white uppercase tracking-widest">{staff.branch}</span>
                 <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{staff.role.toUpperCase()} DOSYASI</span>
              </div>
            </div>
          </div>
          {!idp && (
            <button 
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="px-12 py-6 bg-slate-950 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-3xl active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'NÖRAL ANALİZ AKTİF...' : 'GELİŞİM PLANINI MÜHÜRLE'}
            </button>
          )}
          {idp && (
             <button onClick={() => setIsFullscreen(true)} className="px-12 py-6 bg-orange-600 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-950 transition-all">SUNUMU BAŞLAT (TAM EKRAN)</button>
          )}
        </div>

        {idp && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in relative z-10">
             <div className="lg:col-span-5 space-y-8">
                <div className="p-12 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner">
                   <div className="flex items-center gap-3 mb-10">
                      <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div>
                      <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">KLİNİK BOŞLUK ANALİZİ</h5>
                   </div>
                   <div className="space-y-5">
                      {idp.identifiedGaps.map((gap, i) => (
                        <div key={i} className="flex gap-5 items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group/gap hover:border-rose-500 transition-all">
                           <div className="w-3 h-3 rounded-full bg-rose-500 group-hover/gap:animate-ping"></div>
                           <p className="text-[14px] font-black text-slate-700 uppercase tracking-tight">{gap}</p>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="p-12 bg-slate-950 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
                   <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-10">STRATEJİK YOL HARİTASI</h5>
                   <div className="space-y-12 relative z-10">
                      <div className="border-l-2 border-white/10 pl-8 relative">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase block mb-3">KISA VADE (0-3 AY)</span>
                        <p className="text-[16px] font-bold text-slate-300 leading-relaxed italic">"{idp.roadmap.shortTerm}"</p>
                      </div>
                      <div className="border-l-2 border-white/10 pl-8 relative">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase block mb-3">UZUN VADE (12 AY)</span>
                        <p className="text-[16px] font-bold text-slate-300 leading-relaxed italic">"{idp.roadmap.longTerm}"</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7 flex flex-col">
                {slides ? (
                   <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex-1 flex flex-col min-h-[700px]">
                      <SlideContent slide={slides[activeSlide]} index={activeSlide} total={slides.length} />
                   </div>
                ) : (
                   <div className="h-full flex items-center justify-center border-4 border-dashed border-slate-100 rounded-[4rem] opacity-30">
                      <p className="text-xl font-black uppercase tracking-[0.5em]">Eğitim Müfredatı Bekleniyor</p>
                   </div>
                )}
             </div>
          </div>
        )}
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-orange-600/5 rounded-full blur-[150px] group-hover:scale-125 transition-transform duration-[3s]"></div>
      </div>
    </div>
  );
};

export default StaffProfileView;
