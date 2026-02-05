
import React, { useState, useEffect, useMemo } from 'react';
import { GlobalConfig } from '../../types';

interface SettingsViewProps {
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

// DEFAULT FALLBACK CONFIG (Sistem boş gelirse diye)
const DEFAULT_CONFIG: Partial<GlobalConfig> = {
  institutionName: 'Yeni Gün Akademi',
  weightMatrix: {
    clinicalExpertise: 30,
    ethicalIntegrity: 30,
    emotionalResilience: 15,
    institutionalLoyalty: 10,
    learningAgility: 10,
    academicPedagogy: 5
  },
  riskEngine: {
    criticalEthicalViolationPenalty: 40,
    inconsistentAnswerPenalty: 20,
    lowExperienceDiscountFactor: 0.85,
    jobHoppingPenalty: 15
  },
  aiPersona: {
    skepticismLevel: 70,
    innovationBias: 50,
    stressTestIntensity: 80,
    detailedReporting: true
  },
  systemSettings: {
    minHiringScore: 75,
    highPotentialCutoff: 90,
    interviewDurationMinutes: 45,
    autoRejectBelowScore: 40,
    defaultMeetingLink: 'https://meet.google.com/new'
  }
};

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  // Eğer config eski yapıdaysa veya boşsa default ile merge et
  const [draftConfig, setDraftConfig] = useState<GlobalConfig>({
    ...DEFAULT_CONFIG,
    ...config,
    weightMatrix: { ...DEFAULT_CONFIG.weightMatrix, ...(config.weightMatrix || {}) },
    riskEngine: { ...DEFAULT_CONFIG.riskEngine, ...(config.riskEngine || {}) },
    aiPersona: { ...DEFAULT_CONFIG.aiPersona, ...(config.aiPersona || {}) },
    systemSettings: { ...DEFAULT_CONFIG.systemSettings, ...(config.systemSettings || {}) }
  } as GlobalConfig);

  const [activeTab, setActiveTab] = useState<'matrix' | 'risk' | 'ai' | 'system'>('matrix');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Dışarıdan gelen config değişirse ve biz editlemiyorsak güncelle
    if (!isDirty) {
        setDraftConfig({
            ...DEFAULT_CONFIG,
            ...config,
            weightMatrix: { ...DEFAULT_CONFIG.weightMatrix, ...(config.weightMatrix || {}) },
            riskEngine: { ...DEFAULT_CONFIG.riskEngine, ...(config.riskEngine || {}) },
            aiPersona: { ...DEFAULT_CONFIG.aiPersona, ...(config.aiPersona || {}) },
            systemSettings: { ...DEFAULT_CONFIG.systemSettings, ...(config.systemSettings || {}) }
        } as GlobalConfig);
    }
  }, [config, isDirty]);

  // Ağırlık toplamını hesapla (Matematiksel tutarlılık için)
  // @fix: Explicitly cast values to number[] to ensure mathematical compatibility in reduce.
  const totalWeight = useMemo(() => {
    const w = draftConfig.weightMatrix;
    return (Object.values(w) as number[]).reduce((a: number, b: number) => a + b, 0);
  }, [draftConfig.weightMatrix]);

  // Generic Update Handler
  const updateField = (module: keyof GlobalConfig, key: string, value: any) => {
    setDraftConfig(prev => ({
      ...prev,
      [module]: {
        ...(prev[module] as any),
        [key]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (Math.abs(totalWeight - 100) > 1) {
        alert(`HATA: Ağırlık Matrisi toplamı %${totalWeight}. Analiz tutarlılığı için toplam tam %100 olmalıdır.`);
        return;
    }
    setIsSaving(true);
    await onUpdateConfig(draftConfig);
    setIsSaving(false);
    setIsDirty(false);
    alert("Parametrik Motor Ayarları Güncellendi ve Dağıtıldı.");
  };

  // Reusable Slider Component
  const Slider = ({ label, desc, value, onChange, min=0, max=100, color="orange", suffix="%" }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{label}</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-1 max-w-[250px] leading-relaxed">{desc}</p>
            </div>
            <span className={`text-2xl font-black text-${color}-600`}>{value}{suffix}</span>
        </div>
        <input 
            type="range" min={min} max={max} step={1}
            value={value} 
            onChange={e => onChange(Number(e.target.value))}
            className={`w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-${color}-600`}
        />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] pb-24 relative animate-fade-in">
        
        {/* HEADER */}
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl mb-8 flex justify-between items-end relative overflow-hidden shrink-0">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Parametrik Analiz Motoru</h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">v3.0 Modüler Konfigürasyon Ünitesi</p>
            </div>
            
            {/* Total Weight Indicator */}
            {/* @fix: Ensuring totalWeight subtraction is valid and wrapping numeric display in React-safe nodes. */}
            <div className={`relative z-10 px-6 py-3 rounded-2xl border-2 flex flex-col items-center ${Math.abs((totalWeight as number) - 100) <= 1 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-rose-500 bg-rose-500/10 text-rose-400 animate-pulse'}`}>
                <span className="text-[8px] font-black uppercase tracking-widest">MATRİS TOPLAMI</span>
                <span className="text-3xl font-black">%{(totalWeight as React.ReactNode)}</span>
            </div>
            
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[80px]"></div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 px-2 mb-6 overflow-x-auto no-scrollbar shrink-0">
            {[
                { id: 'matrix', label: '1. AĞIRLIK MATRİSİ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { id: 'risk', label: '2. CEZA VE TOLERANS', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                { id: 'ai', label: '3. AI BİLİŞSEL MİZAÇ', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { id: 'system', label: '4. SİSTEM AYARLARI', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-white border-orange-600 shadow-xl text-orange-600 scale-105' 
                        : 'bg-white border-transparent text-slate-400 hover:border-slate-200'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                </button>
            ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
            
            {/* MODULE 1: WEIGHT MATRIX */}
            {activeTab === 'matrix' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
                    <Slider 
                        label="Klinik Uzmanlık (Clinical)" 
                        desc="Metodolojik hakimiyet ve teknik bilginin skora etkisi." 
                        value={draftConfig.weightMatrix.clinicalExpertise} 
                        onChange={(v: number) => updateField('weightMatrix', 'clinicalExpertise', v)} 
                        color="orange"
                    />
                    <Slider 
                        label="Etik Bütünlük (Integrity)" 
                        desc="Meslek etiği, sınırlar ve dürüstlüğün ağırlığı." 
                        value={draftConfig.weightMatrix.ethicalIntegrity} 
                        onChange={(v: number) => updateField('weightMatrix', 'ethicalIntegrity', v)} 
                        color="emerald"
                    />
                    <Slider 
                        label="Pedagojik Derinlik" 
                        desc="Öğretim stratejileri ve çocukla etkileşim kalitesi." 
                        value={draftConfig.weightMatrix.academicPedagogy} 
                        onChange={(v: number) => updateField('weightMatrix', 'academicPedagogy', v)} 
                        color="blue"
                    />
                    <Slider 
                        label="Duygusal Direnç" 
                        desc="Kriz anında soğukkanlılık ve stres toleransı." 
                        value={draftConfig.weightMatrix.emotionalResilience} 
                        onChange={(v: number) => updateField('weightMatrix', 'emotionalResilience', v)} 
                        color="rose"
                    />
                    <Slider 
                        label="Kurumsal Sadakat" 
                        desc="Vizyon uyumu ve uzun vadeli çalışma potansiyeli." 
                        value={draftConfig.weightMatrix.institutionalLoyalty} 
                        onChange={(v: number) => updateField('weightMatrix', 'institutionalLoyalty', v)} 
                        color="slate"
                    />
                    <Slider 
                        label="Öğrenme Çevikliği" 
                        desc="Yeni teknolojilere ve yöntemlere adaptasyon hızı." 
                        value={draftConfig.weightMatrix.learningAgility} 
                        onChange={(v: number) => updateField('weightMatrix', 'learningAgility', v)} 
                        color="purple"
                    />
                </div>
            )}

            {/* MODULE 2: RISK ENGINE */}
            {activeTab === 'risk' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
                    <div className="space-y-6">
                        <h4 className="text-[12px] font-black text-rose-600 uppercase tracking-[0.3em] pl-4 border-l-4 border-rose-600">Kesinti Protokolleri</h4>
                        <Slider 
                            label="Kritik Etik İhlal Cezası" 
                            desc="Etik dışı bir yanıtın toplam skordan düşeceği puan." 
                            value={draftConfig.riskEngine.criticalEthicalViolationPenalty} 
                            onChange={(v: number) => updateField('riskEngine', 'criticalEthicalViolationPenalty', v)} 
                            color="rose"
                            suffix=" Puan"
                        />
                        <Slider 
                            label="Tutarsızlık Cezası" 
                            desc="Mülakat yanıtları ile deneyim yılı çelişirse kesilecek puan." 
                            value={draftConfig.riskEngine.inconsistentAnswerPenalty} 
                            onChange={(v: number) => updateField('riskEngine', 'inconsistentAnswerPenalty', v)} 
                            color="rose"
                            suffix=" Puan"
                        />
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[12px] font-black text-orange-600 uppercase tracking-[0.3em] pl-4 border-l-4 border-orange-600">Tolerans Ayarları</h4>
                        <Slider 
                            label="Deneyim Çarpanı (Junior)" 
                            desc="2 yıldan az deneyimlilerin ham puanı bu katsayı ile çarpılır (0.8 = %20 kesinti)." 
                            value={draftConfig.riskEngine.lowExperienceDiscountFactor} 
                            onChange={(v: number) => updateField('riskEngine', 'lowExperienceDiscountFactor', v)} 
                            color="slate"
                            min={0.5} max={1.0} step={0.05} suffix="x"
                        />
                        <Slider 
                            label="Job Hopping (Sık İş Değiştirme) Cezası" 
                            desc="CV'de sık kurum değiştiren adaylardan kırılacak sadakat puanı." 
                            value={draftConfig.riskEngine.jobHoppingPenalty} 
                            onChange={(v: number) => updateField('riskEngine', 'jobHoppingPenalty', v)} 
                            color="orange"
                            suffix=" Puan"
                        />
                    </div>
                </div>
            )}

            {/* MODULE 3: AI PERSONA */}
            {activeTab === 'ai' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-scale-in">
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Bilişsel Kalibrasyon</h4>
                            <Slider 
                                label="Şüphecilik Seviyesi (Skepticism)" 
                                desc="Yüksekse AI adayın her beyanını sorgular ve kanıt arar. Düşükse beyana güvenir." 
                                value={draftConfig.aiPersona.skepticismLevel} 
                                onChange={(v: number) => updateField('aiPersona', 'skepticismLevel', v)} 
                                color="slate"
                            />
                            <Slider 
                                label="Stres Testi Şiddeti" 
                                desc="Simülasyonlardaki veli/vaka profilinin zorluk derecesi." 
                                value={draftConfig.aiPersona.stressTestIntensity} 
                                onChange={(v: number) => updateField('aiPersona', 'stressTestIntensity', v)} 
                                color="rose"
                            />
                            <Slider 
                                label="İnovasyon Ödülü (Bias)" 
                                desc="Modern yöntemleri kullanan adaylara verilecek ekstra kredi eğilimi." 
                                value={draftConfig.aiPersona.innovationBias} 
                                onChange={(v: number) => updateField('aiPersona', 'innovationBias', v)} 
                                color="blue"
                            />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-bl-[4rem]"></div>
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
                            <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-widest mb-4">Prompt Enjeksiyonu</h5>
                            <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">
                                Bu ayarlar, Gemini-3 modelinin "System Instruction" katmanına dinamik olarak kodlanır. Örneğin, şüphecilik %80 üzerine çıkarsa, sistem promtuna "Adayın her cevabını potansiyel bir manipülasyon olarak değerlendir ve kanıt iste" talimatı eklenir.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODULE 4: SYSTEM SETTINGS */}
            {activeTab === 'system' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
                    <div className="space-y-6 bg-white p-8 rounded-[3rem]">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] pl-2 border-l-4 border-slate-900">Otomasyon Eşikleri</h4>
                        <Slider 
                            label="Otomatik İşe Alım Önerisi" 
                            desc="Bu skorun üzerindeki adaylar için sistem 'Kadroya Kat' önerisi sunar." 
                            value={draftConfig.systemSettings.minHiringScore} 
                            onChange={(v: number) => updateField('systemSettings', 'minHiringScore', v)} 
                            color="emerald"
                        />
                        <Slider 
                            label="High Potential (HiPo) Limiti" 
                            desc="Geleceğin lider adaylarını belirleyen üstün başarı sınırı." 
                            value={draftConfig.systemSettings.highPotentialCutoff} 
                            onChange={(v: number) => updateField('systemSettings', 'highPotentialCutoff', v)} 
                            color="orange"
                        />
                        <Slider 
                            label="Otomatik Red Eşiği" 
                            desc="Bu puanın altındaki adaylar için sistem otomatik 'Olumsuz' şablonu önerir." 
                            value={draftConfig.systemSettings.autoRejectBelowScore} 
                            onChange={(v: number) => updateField('systemSettings', 'autoRejectBelowScore', v)} 
                            color="rose"
                        />
                    </div>
                    <div className="space-y-6 bg-white p-8 rounded-[3rem]">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] pl-2 border-l-4 border-blue-600">Operasyonel</h4>
                        <div className="group">
                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Kurum Adı</label>
                            <input 
                                type="text" 
                                className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-blue-600 outline-none transition-all text-sm"
                                value={draftConfig.institutionName} 
                                onChange={e => setDraftConfig({...draftConfig, institutionName: e.target.value})}
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Mülakat Linki (Default)</label>
                            <input 
                                type="text" 
                                className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-blue-600 outline-none transition-all text-sm"
                                value={draftConfig.systemSettings.defaultMeetingLink} 
                                onChange={e => updateField('systemSettings', 'defaultMeetingLink', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* SAVE BAR */}
        {isDirty && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6 animate-slide-up">
                <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white animate-pulse">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Ayarlar Değişti</p>
                            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Sisteme işlemek için kaydedin.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => { setIsDirty(false); onUpdateConfig(config); }} // Reset to props
                            className="px-6 py-3 bg-white/5 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
                        >
                            İptal
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-8 py-3 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase shadow-xl hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
                        >
                            {isSaving ? 'İşleniyor...' : 'Kaydet'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SettingsView;
