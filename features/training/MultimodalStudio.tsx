
import React, { useState } from 'react';
import { 
  CustomTrainingPlan, 
  TrainingGenerationConfig, 
  TrainingSlide, 
  TrainingQuiz, 
  TargetAudience, 
  TrainingTheme 
} from '../../types';
import { armsService } from '../../services/ai/armsService';
import PresentationStudio from './PresentationStudio';

const MultimodalStudio: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const [plan, setPlan] = useState<CustomTrainingPlan>({
    id: `CUR-${Date.now()}`,
    title: '',
    category: 'CLINICAL',
    level: 'Intermediate',
    description: '',
    targetBranches: 'ALL',
    curriculum: [],
    createdBy: 'Sistem Yöneticisi',
    createdAt: Date.now()
  });

  const [config, setConfig] = useState<TrainingGenerationConfig>({
    pedagogicalBias: 'ABA',
    cognitiveLoad: 'PRO',
    audience: 'STAFF_JUNIOR',
    theme: 'ACADEMIC_COLD',
    slideCount: 8,
    includeVisuals: true,
    tone: 'academic',
    temperature: 0.7,
    thinkingBudget: 24576,
    academicConfig: {
      institutionName: 'Yeni Gün Akademi',
      headerAntet: true,
      signatureTitles: ['Klinik Direktör', 'Eğitmen'],
      footerNote: 'Bu belge kurumsal eğitim mühürüne sahiptir.',
      showWatermark: true
    }
  });

  const handleLaunchProduction = async () => {
    if (!plan.title || !plan.description) return alert("Başlık ve açıklama zorunludur.");
    setIsAiProcessing(true);
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      if (result) {
        setPlan({ ...plan, slides: result.slides, finalQuiz: result.quiz, aiConfig: config });
        setActiveStep(4); // Preview
      }
    } catch (e) {
      alert("Nöral Sentez Hatası.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const STEPS = [
    { id: 'strategy', label: 'Strateji', icon: '🎯' },
    { id: 'content', label: 'İçerik', icon: '📝' },
    { id: 'design', label: 'Tasarım', icon: '🎨' },
    { id: 'official', label: 'Resmiyet', icon: '🏛️' }
  ];

  if (activeStep === 4 && plan.slides) {
    return <PresentationStudio customPlan={plan} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[3000] bg-[#0A0F1C] flex flex-col animate-fade-in overflow-hidden text-slate-300">
      {/* TOP BAR */}
      <div className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-8">
          <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-rose-600 rounded-xl flex items-center justify-center text-white transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="h-8 w-px bg-white/10"></div>
          <h2 className="text-white font-black text-lg uppercase tracking-[0.2em]">Multimodal Studio <span className="text-orange-500">v2.0</span></h2>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
              {STEPS.map((s, idx) => (
                <button 
                  key={s.id} 
                  onClick={() => setActiveStep(idx)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeStep === idx ? 'bg-orange-600 text-white shadow-lg' : 'hover:text-white'}`}
                >
                  <span>{s.icon}</span>
                  <span className="hidden lg:inline">{s.label}</span>
                </button>
              ))}
           </div>
           <button 
            onClick={handleLaunchProduction} 
            disabled={isAiProcessing}
            className="px-10 py-3.5 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
           >
              {isAiProcessing ? 'Sentezleniyor...' : 'Eğitimi Üret'}
           </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar">
        <div className="w-full max-w-5xl space-y-12 animate-scale-in">
          
          {activeStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-white/5 space-y-8">
                <h4 className="text-xl font-black text-white uppercase tracking-tight border-l-4 border-orange-600 pl-6">Pedagojik Kalibrasyon</h4>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ekol Bias</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none focus:border-orange-500"
                      value={config.pedagogicalBias}
                      onChange={e => setConfig({...config, pedagogicalBias: e.target.value as any})}
                    >
                      {['ABA', 'FLOORTIME', 'ECSE', 'NEURAL', 'MONTESSORI'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bilişsel Yük</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['JUNIOR', 'PRO', 'SUPERVISOR'].map(l => (
                         <button 
                          key={l}
                          onClick={() => setConfig({...config, cognitiveLoad: l as any})}
                          className={`py-3 rounded-xl text-[9px] font-black border-2 transition-all ${config.cognitiveLoad === l ? 'bg-orange-600 border-orange-600 text-white' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                         >
                            {l}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-white/5 space-y-8">
                <h4 className="text-xl font-black text-white uppercase tracking-tight border-l-4 border-blue-600 pl-6">Hedef & Ton</h4>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hitap Edilen Kitle</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none focus:border-blue-500"
                      value={config.audience}
                      onChange={e => setConfig({...config, audience: e.target.value as TargetAudience})}
                    >
                      <option value="STAFF_JUNIOR">Yeni Uzmanlar (Oryantasyon)</option>
                      <option value="STAFF_SENIOR">Kıdemli Uzmanlar</option>
                      <option value="PARENTS">Ebeveynler</option>
                      <option value="ACADEMIC_BOARD">Akademik Kurul</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Anlatım Tonu</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none focus:border-blue-500"
                      value={config.tone}
                      onChange={e => setConfig({...config, tone: e.target.value as any})}
                    >
                      {['academic', 'inspirational', 'warning', 'analytical'].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="bg-slate-900/80 p-12 rounded-[4rem] border border-white/5 space-y-8 shadow-2xl">
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Eğitim Mimari Özeti</h4>
              <div className="space-y-6">
                 <input 
                  type="text"
                  placeholder="Eğitim Başlığı (Örn: Otizmde Özbakım Hiyerarşisi)"
                  className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-2xl font-black text-white outline-none focus:border-orange-500 shadow-inner"
                  value={plan.title}
                  onChange={e => setPlan({...plan, title: e.target.value})}
                 />
                 <textarea 
                  placeholder="Ayrıntılı açıklama ve AI için özel direktifler..."
                  className="w-full bg-black/40 border border-white/10 p-8 rounded-[2.5rem] text-lg font-medium text-slate-400 outline-none focus:border-orange-500 min-h-[250px] shadow-inner"
                  value={plan.description}
                  onChange={e => setPlan({...plan, description: e.target.value})}
                 />
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-white/5 space-y-8">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">Görsel & Yapı</h4>
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold text-white">Multimodal Görseller</p>
                      <p className="text-[10px] text-slate-500 uppercase mt-1">AI tarafından üretilen sahneler</p>
                    </div>
                    <button 
                      onClick={() => setConfig({...config, includeVisuals: !config.includeVisuals})}
                      className={`w-14 h-8 rounded-full transition-all relative ${config.includeVisuals ? 'bg-orange-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.includeVisuals ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slayt Sayısı</label>
                      <span className="text-orange-500 font-black">{config.slideCount}</span>
                    </div>
                    <input 
                      type="range" min="3" max="20" 
                      className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-orange-600"
                      value={config.slideCount}
                      onChange={e => setConfig({...config, slideCount: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-white/5 space-y-8">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">Tema Seçimi</h4>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'ACADEMIC_COLD', label: 'Akademik / Soğuk', color: 'bg-slate-200' },
                     { id: 'CREATIVE_WARM', label: 'Yaratıcı / Sıcak', color: 'bg-orange-200' },
                     { id: 'MINIMAL_TECH', label: 'Minimal / Modern', color: 'bg-blue-200' },
                     { id: 'OFFICIAL_MEB', label: 'Resmi / MEB', color: 'bg-rose-200' }
                   ].map(t => (
                     <button 
                      key={t.id}
                      onClick={() => setConfig({...config, theme: t.id as TrainingTheme})}
                      className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden ${config.theme === t.id ? 'border-orange-600 bg-white/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                     >
                        <div className={`w-3 h-3 rounded-full ${t.color} mb-3`}></div>
                        <p className={`text-[10px] font-black uppercase ${config.theme === t.id ? 'text-white' : 'text-slate-500'}`}>{t.label}</p>
                     </button>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-slate-900/80 p-12 rounded-[4rem] border border-white/5 space-y-10">
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Kurumsal Mühür Ayarları</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl">
                       <span className="text-[11px] font-bold text-slate-400 uppercase">Resmi Antet (Header)</span>
                       <button onClick={() => setConfig({...config, academicConfig: {...config.academicConfig, headerAntet: !config.academicConfig.headerAntet}})} className={`w-10 h-6 rounded-full relative transition-all ${config.academicConfig.headerAntet ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.academicConfig.headerAntet ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl">
                       <span className="text-[11px] font-bold text-slate-400 uppercase">Filigran (Watermark)</span>
                       <button onClick={() => setConfig({...config, academicConfig: {...config.academicConfig, showWatermark: !config.academicConfig.showWatermark}})} className={`w-10 h-6 rounded-full relative transition-all ${config.academicConfig.showWatermark ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.academicConfig.showWatermark ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">İmza Yetkilileri</label>
                    <div className="flex flex-wrap gap-2">
                       {['Kurucu', 'Müdür', 'Klinik Direktör', 'Eğitmen', 'Psikolog'].map(title => (
                         <button 
                          key={title}
                          onClick={() => {
                            const current = config.academicConfig.signatureTitles;
                            const next = current.includes(title) ? current.filter(t => t !== title) : [...current, title];
                            setConfig({...config, academicConfig: {...config.academicConfig, signatureTitles: next}});
                          }}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${config.academicConfig.signatureTitles.includes(title) ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-500'}`}
                         >
                           {title}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="h-16 bg-slate-900/80 border-t border-white/5 flex items-center justify-center gap-10 no-print">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nöral Sentez Hattı Hazır</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kognitif Bütçe: {config.thinkingBudget} Tokens</span>
         </div>
      </div>

      {isAiProcessing && (
        <div className="fixed inset-0 z-[4000] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
           <div className="relative mb-12">
              <div className="w-64 h-64 border-[4px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 bg-slate-900 rounded-[3rem] shadow-[0_0_50px_rgba(234,88,12,0.3)] flex items-center justify-center border border-white/10 animate-pulse">
                    <span className="text-orange-500 font-black text-2xl">YG</span>
                 </div>
              </div>
           </div>
           <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Akademik İnşa Süreci</h3>
           <p className="text-orange-500 font-black text-xl uppercase tracking-[0.5em] animate-pulse">
             {config.pedagogicalBias} Müfredatı Sentezleniyor...
           </p>
           <p className="text-slate-500 text-sm mt-8 max-w-lg mx-auto italic font-medium">"Literatür taraması yapılıyor, vaka simülasyonları kurgulanıyor ve interaktif slaytlar mühürleniyor."</p>
        </div>
      )}
    </div>
  );
};

export default MultimodalStudio;
