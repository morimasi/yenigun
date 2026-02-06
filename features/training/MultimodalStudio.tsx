
import React, { useState } from 'react';
import { 
  CustomTrainingPlan, 
  TrainingGenerationConfig, 
  TrainingSlide, 
  TrainingQuiz, 
  TargetAudience, 
  TrainingTheme,
  PedagogicalSchool,
  CognitiveLoad
} from '../../types';
import { armsService } from '../../services/ai/armsService';
import PresentationStudio from './PresentationStudio';

const MultimodalStudio: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [plan, setPlan] = useState<CustomTrainingPlan>({
    id: `CUR-${Date.now()}`,
    title: '',
    category: 'CLINICAL',
    level: 'Intermediate',
    description: '',
    targetBranches: 'ALL',
    curriculum: [],
    createdBy: 'Sistem Yöneticisi',
    createdAt: Date.now(),
    status: 'active'
  });

  const [config, setConfig] = useState<TrainingGenerationConfig>({
    pedagogicalBias: PedagogicalSchool.ABA,
    cognitiveLoad: CognitiveLoad.Pro,
    audience: 'KIDEMLI_UZMANLAR',
    theme: 'GOLDEN_ACADEMY',
    slideCount: 10,
    includeVisuals: true,
    hasEvaluation: true,
    tone: 'academic',
    temperature: 0.7,
    thinkingBudget: 24576,
    academicConfig: {
      institutionName: 'Yeni Gün Özel Eğitim Akademi',
      headerAntet: true,
      signatureTitles: ['Klinik Direktör', 'Eğitmen'],
      footerNote: 'Bu belge dijital mühür ile korunmaktadır.',
      showWatermark: true,
      officialSeal: true
    }
  });

  // VERİTABANI MÜHÜRLEME MOTORU
  const handleFinalSeal = async (slides: TrainingSlide[], quiz?: TrainingQuiz) => {
    setStatusMsg('Kurumsal Arşive Mühürleniyor...');
    const finalPayload = {
      ...plan,
      slides,
      finalQuiz: quiz,
      aiConfig: config,
      status: 'published',
      updatedAt: Date.now()
    };

    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });
      if (!res.ok) throw new Error("DB_ERROR");
      
      setPlan(finalPayload);
      setActiveStep(4); // Preview Mode
    } catch (e) {
      alert("Hata: Veritabanı bağlantısı koptu ama eğitim üretildi. Önizleme devam ediyor.");
      setPlan(finalPayload);
      setActiveStep(4);
    }
  };

  const handleLaunchProduction = async () => {
    if (!plan.title || !plan.description) {
        setActiveStep(1); // İçerik adımına geri döndür
        return alert("KRİTİK EKSİKLİK: Eğitim başlığı ve klinik kapsam tanımı olmadan üretim yapılamaz.");
    }
    
    setIsAiProcessing(true);
    setStatusMsg('Nöral Veri Setleri İşleniyor...');
    
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      if (result) {
        await handleFinalSeal(result.slides, result.quiz);
      }
    } catch (e) {
      alert("Nöral Sentez Hatası: AI motoru kognitif yükü taşıyamadı. Lütfen tekrar deneyiniz.");
    } finally {
      setIsAiProcessing(false);
      setStatusMsg('');
    }
  };

  const STEPS = [
    { id: 'strategy', label: '1. EKOL & STRATEJİ', icon: '🎯' },
    { id: 'content', label: '2. KLİNİK İÇERİK', icon: '📝' },
    { id: 'design', label: '3. TEMA & GÖRSEL', icon: '🎨' },
    { id: 'official', label: '4. RESMİ MÜHÜR', icon: '🏛️' }
  ];

  const NavigationButtons = () => (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5 no-print">
       <button 
         onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
         disabled={activeStep === 0}
         className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeStep === 0 ? 'opacity-0' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
       >
         ← GERİ DÖN
       </button>
       
       {activeStep < 3 ? (
         <button 
           onClick={() => setActiveStep(prev => prev + 1)}
           className="px-12 py-4 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-orange-500 transition-all flex items-center gap-3"
         >
           SONRAKİ ADIM: {STEPS[activeStep + 1].label} →
         </button>
       ) : (
         <button 
            onClick={handleLaunchProduction}
            disabled={isAiProcessing}
            className="px-16 py-5 bg-white text-slate-950 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-orange-600 hover:text-white transition-all active:scale-95"
         >
            NÖRAL ÜRETİMİ VE MÜHÜRLEMEYİ BAŞLAT
         </button>
       )}
    </div>
  );

  if (activeStep === 4 && plan.slides) {
    return <PresentationStudio customPlan={plan} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[3000] bg-[#0A0F1C] flex flex-col animate-fade-in overflow-hidden text-slate-300">
      
      {/* HUD HEADER */}
      <div className="h-20 bg-slate-900/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-8">
          <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-rose-600 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="h-10 w-px bg-white/10"></div>
          <h2 className="text-white font-black text-xl uppercase tracking-[0.3em]">Neural Studio <span className="text-orange-500">v4.1</span></h2>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-white/10 shadow-inner">
              {STEPS.map((s, idx) => (
                <button 
                  key={s.id} 
                  onClick={() => setActiveStep(idx)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeStep === idx ? 'bg-orange-600 text-white shadow-2xl' : 'hover:text-white hover:bg-white/5'}`}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="hidden lg:inline">{s.label.split('. ')[1]}</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* CORE WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar bg-[radial-gradient(circle_at_top,_#1e293b,_#0a0f1c)]">
        <div className="w-full max-w-5xl space-y-12 animate-scale-in">
          
          {/* STEP 0: STRATEGY */}
          {activeStep === 0 && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-900/60 p-10 rounded-[4rem] border border-white/5 shadow-3xl space-y-10">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-[10px] border-orange-600 pl-8">Pedagojik Çerçeve</h4>
                    <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Ekol Seçimi (Terminoloji Bias)</label>
                        <select 
                        className="w-full bg-black/60 border border-white/10 p-5 rounded-[2rem] font-bold text-white outline-none focus:border-orange-500 appearance-none shadow-inner"
                        value={config.pedagogicalBias}
                        onChange={e => setConfig({...config, pedagogicalBias: e.target.value as PedagogicalSchool})}
                        >
                        {Object.values(PedagogicalSchool).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Bilişsel Yük Seviyesi</label>
                        <div className="grid grid-cols-1 gap-3">
                        {Object.values(CognitiveLoad).map(l => (
                            <button 
                            key={l}
                            onClick={() => setConfig({...config, cognitiveLoad: l as CognitiveLoad})}
                            className={`p-5 rounded-[2rem] text-[11px] font-black uppercase text-left border-2 transition-all flex items-center justify-between ${config.cognitiveLoad === l ? 'bg-orange-600 border-orange-600 text-white shadow-xl' : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20'}`}
                            >
                                <span>{l}</span>
                                {config.cognitiveLoad === l && <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>}
                            </button>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>

                <div className="bg-slate-900/60 p-10 rounded-[4rem] border border-white/5 shadow-3xl space-y-10">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-[10px] border-blue-600 pl-8">Hedef Kitle & Ton</h4>
                    <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Hitap Edilen Grup</label>
                        <select 
                        className="w-full bg-black/60 border border-white/10 p-5 rounded-[2rem] font-bold text-white outline-none focus:border-blue-500 appearance-none shadow-inner"
                        value={config.audience}
                        onChange={e => setConfig({...config, audience: e.target.value as TargetAudience})}
                        >
                        <option value="YENI_EGITMENLER">Oryantasyon (Yeni Uzmanlar)</option>
                        <option value="KIDEMLI_UZMANLAR">Ustalık Sınıfı (Kıdemli Personel)</option>
                        <option value="VELILER">Aile Eğitim Semineri</option>
                        <option value="AKADEMIK_KURUL">Yönetim Kurulu & Akademik Raporlama</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Anlatım Modu</label>
                        <div className="grid grid-cols-2 gap-3">
                        {['academic', 'inspirational', 'warning', 'analytical', 'formal'].map(o => (
                            <button 
                            key={o} 
                            onClick={() => setConfig({...config, tone: o as any})}
                            className={`p-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${config.tone === o ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/5 bg-white/5 text-slate-500'}`}
                            >
                            {o}
                            </button>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <NavigationButtons />
            </div>
          )}

          {/* STEP 1: CONTENT */}
          {activeStep === 1 && (
            <div className="space-y-8">
                <div className="bg-slate-900/60 p-16 rounded-[5rem] border border-white/5 space-y-12 shadow-3xl">
                <h4 className="text-4xl font-black text-white uppercase tracking-tighter">Müfredat Manifestosu</h4>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Eğitim Başlığı</label>
                        <input 
                        type="text"
                        placeholder="Örn: Otizmde Özbakım Hiyerarşisi ve Zincirleme Öğretim"
                        className="w-full bg-black/60 border border-white/10 p-8 rounded-[2.5rem] text-3xl font-black text-white outline-none focus:border-orange-500 shadow-inner"
                        value={plan.title}
                        onChange={e => setPlan({...plan, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Detaylı Klinik Kapsam & Özel AI Talimatları</label>
                        <textarea 
                        placeholder="Eğitimin odaklanacağı spesifik vakalar, kaçınılması gereken terminolojiler veya AI için vurgulanmasını istediğiniz kritik noktaları buraya yazın..."
                        className="w-full bg-black/60 border border-white/10 p-10 rounded-[3.5rem] text-xl font-medium text-slate-400 outline-none focus:border-orange-500 min-h-[250px] shadow-inner leading-relaxed"
                        value={plan.description}
                        onChange={e => setPlan({...plan, description: e.target.value})}
                        />
                    </div>
                </div>
                </div>
                <NavigationButtons />
            </div>
          )}

          {/* STEP 2: DESIGN & EVALUATION */}
          {activeStep === 2 && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-900/60 p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-3xl">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-[10px] border-orange-600 pl-8">Görsel & Yapı</h4>
                    <div className="space-y-8">
                    <div onClick={() => setConfig({...config, includeVisuals: !config.includeVisuals})} className={`flex items-center justify-between p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all ${config.includeVisuals ? 'border-orange-600 bg-orange-600/10' : 'border-white/5 bg-white/5'}`}>
                        <div>
                        <p className="font-black text-white uppercase tracking-widest">Görsel Entegrasyonu</p>
                        <p className="text-[10px] text-slate-500 uppercase mt-1">AI tabanlı multimodal sahneler</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full relative transition-all ${config.includeVisuals ? 'bg-orange-600 shadow-[0_0_20px_#ea580c]' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.includeVisuals ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>

                    <div onClick={() => setConfig({...config, hasEvaluation: !config.hasEvaluation})} className={`flex items-center justify-between p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all ${config.hasEvaluation ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'}`}>
                        <div>
                        <p className="font-black text-white uppercase tracking-widest">Eğitim Sonu Quiz</p>
                        <p className="text-[10px] text-slate-500 uppercase mt-1">Öğrenme başarısı ölçümleme</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full relative transition-all ${config.hasEvaluation ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.hasEvaluation ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>

                    <div className="space-y-4 px-4">
                        <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Slayt Hiyerarşisi</label>
                        <span className="text-2xl font-black text-orange-500">{config.slideCount} Sayfa</span>
                        </div>
                        <input 
                        type="range" min="5" max="30" step="1"
                        className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-orange-600"
                        value={config.slideCount}
                        onChange={e => setConfig({...config, slideCount: parseInt(e.target.value)})}
                        />
                    </div>
                    </div>
                </div>

                <div className="bg-slate-900/60 p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-3xl">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-[10px] border-emerald-500 pl-8">Akademik Temalar</h4>
                    <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: 'ACADEMIC_COLD', label: 'Akademik Soğuk', color: 'bg-slate-200' },
                        { id: 'GOLDEN_ACADEMY', label: 'Premium Gold', color: 'bg-amber-400' },
                        { id: 'CREATIVE_WARM', label: 'Yaratıcı Sıcak', color: 'bg-orange-400' },
                        { id: 'MINIMAL_TECH', label: 'Minimal Modern', color: 'bg-blue-400' },
                        { id: 'OFFICIAL_MEB', label: 'Resmi MEB', color: 'bg-rose-400' }
                    ].map(t => (
                        <button 
                        key={t.id}
                        onClick={() => setConfig({...config, theme: t.id as TrainingTheme})}
                        className={`p-6 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${config.theme === t.id ? 'border-orange-600 bg-white/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                        >
                            <div className={`w-4 h-4 rounded-full ${t.color} mb-3 shadow-lg group-hover:scale-125 transition-transform`}></div>
                            <p className={`text-[11px] font-black uppercase tracking-tight ${config.theme === t.id ? 'text-white' : 'text-slate-500'}`}>{t.label}</p>
                        </button>
                    ))}
                    </div>
                </div>
                </div>
                <NavigationButtons />
            </div>
          )}

          {/* STEP 3: OFFICIAL SEAL */}
          {activeStep === 3 && (
            <div className="space-y-8">
                <div className="bg-slate-900/60 p-16 rounded-[5rem] border border-white/5 space-y-12 shadow-3xl">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Akademik Mühürleme Konfigürasyonu</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        {[
                        { k: 'headerAntet', l: 'Resmi Başlık (Header Antet)', d: 'Kurum logonuz ve resmi adınız slayt başına eklenir.' },
                        { k: 'showWatermark', l: 'Kopya Koruması (Watermark)', d: 'Sayfa arkasına dijital kurum mührü basılır.' },
                        { k: 'officialSeal', l: 'Akademik Onay Mührü', d: 'Sunum sonuna QR destekli geçerlilik mührü eklenir.' }
                        ].map(item => (
                        <div key={item.k} onClick={() => setConfig({...config, academicConfig: {...config.academicConfig, [item.k]: !(config.academicConfig as any)[item.k]}})} className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${ (config.academicConfig as any)[item.k] ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5 opacity-50' }`}>
                            <div className="flex-1">
                                <p className="text-[12px] font-black text-white uppercase tracking-widest">{item.l}</p>
                                <p className="text-[9px] text-slate-500 uppercase mt-1">{item.d}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${ (config.academicConfig as any)[item.k] ? 'bg-orange-600 border-orange-600 shadow-[0_0_15px_#ea580c]' : 'border-slate-600' }`}>
                                { (config.academicConfig as any)[item.k] && <div className="w-2 h-2 bg-white rounded-full"></div> }
                            </div>
                        </div>
                        ))}
                    </div>
                    
                    <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">İmza Panelleri (Kurul Yetkilileri)</label>
                        <div className="grid grid-cols-2 gap-3">
                        {['Kurucu', 'Müdür', 'Klinik Direktör', 'Eğitmen', 'Psikolog', 'Süpervizör'].map(title => (
                            <button 
                            key={title}
                            onClick={() => {
                                const current = config.academicConfig.signatureTitles;
                                const next = current.includes(title) ? current.filter(t => t !== title) : [...current, title];
                                setConfig({...config, academicConfig: {...config.academicConfig, signatureTitles: next}});
                            }}
                            className={`px-5 py-4 rounded-2xl text-[10px] font-black uppercase transition-all text-center border-2 ${config.academicConfig.signatureTitles.includes(title) ? 'bg-orange-600 border-orange-600 text-white shadow-xl' : 'bg-black/20 border-white/5 text-slate-500'}`}
                            >
                            {title}
                            </button>
                        ))}
                        </div>
                        <div className="pt-6">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Kurum Resmi İsmi</label>
                        <input 
                            type="text"
                            className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl font-black text-white uppercase outline-none focus:border-orange-500 mt-2"
                            value={config.academicConfig.institutionName}
                            onChange={e => setConfig({...config, academicConfig: {...config.academicConfig, institutionName: e.target.value}})}
                        />
                        </div>
                    </div>
                </div>
                </div>
                <NavigationButtons />
            </div>
          )}

        </div>
      </div>

      {/* STATUS BAR */}
      <div className="h-16 bg-slate-900/90 border-t border-white/5 flex items-center justify-center gap-12 no-print shrink-0">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nöral Sentez Hattı: ONLINE</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adım: <span className="text-orange-500">{activeStep + 1} / 4</span></span>
         </div>
      </div>

      {/* OVERLAY LOADER */}
      {isAiProcessing && (
        <div className="fixed inset-0 z-[5000] bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
           <div className="relative mb-16 scale-125">
              <div className="w-64 h-64 border-[4px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-28 h-28 bg-slate-900 rounded-[3rem] shadow-[0_0_80px_rgba(234,88,12,0.4)] flex items-center justify-center border border-white/10 animate-pulse">
                    <span className="text-orange-500 font-black text-3xl tracking-widest">YG</span>
                 </div>
              </div>
           </div>
           <div className="space-y-6">
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter animate-fade-in">Akademik İnşa Aktif</h3>
              <p className="text-orange-500 font-black text-2xl uppercase tracking-[0.4em] animate-pulse h-8">
                {statusMsg}
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default MultimodalStudio;
