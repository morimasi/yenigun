
import React, { useState, useEffect, useMemo } from 'react';
import { GlobalConfig, AdvancedAnalyticsConfig } from '../../types';

interface SettingsViewProps {
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

const DEFAULT_ADVANCED: AdvancedAnalyticsConfig = {
  weights: { clinicalDepth: 30, ethicalIntegrity: 30, emotionalResilience: 15, institutionalLoyalty: 15, learningAgility: 10 },
  penalties: { criticalEthicalViolation: 30, inconsistentAnswers: 15, lowExperienceDiscount: 0.85 },
  thresholds: { minHiringScore: 70, highPotentialCutoff: 85 },
  aiCognition: { skepticismLevel: 60, innovationBias: 50, stressTestIntensity: 70 }
};

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  // Config içinde advancedAnalytics yoksa default ile başlat
  const [draftConfig, setDraftConfig] = useState<GlobalConfig>({
    ...config,
    advancedAnalytics: config.advancedAnalytics || DEFAULT_ADVANCED
  });
  
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'weights' | 'logic' | 'ai' | 'system'>('weights');

  useEffect(() => {
    setDraftConfig({
        ...config,
        advancedAnalytics: config.advancedAnalytics || DEFAULT_ADVANCED
    });
  }, [config]);

  // Ağırlıkların toplamını kontrol et
  const totalWeight = useMemo(() => {
    const w = draftConfig.advancedAnalytics?.weights || DEFAULT_ADVANCED.weights;
    // @fix: Explicitly cast values to number to fix arithmetic operation type error during weight accumulation.
    return Object.values(w).reduce((a, b) => (a as number) + (b as number), 0) as number;
  }, [draftConfig]);

  const handleAdvancedChange = (section: keyof AdvancedAnalyticsConfig, key: string, value: number) => {
    if (!draftConfig.advancedAnalytics) return;
    
    setDraftConfig(prev => ({
      ...prev,
      advancedAnalytics: {
        ...prev.advancedAnalytics!,
        [section]: {
          ...prev.advancedAnalytics![section],
          [key]: value
        }
      }
    }));
    setIsDirty(true);
  };

  const handleUpdateField = (key: keyof GlobalConfig, value: any) => {
    setDraftConfig(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSaveToSystem = async () => {
    if (Math.abs(totalWeight - 100) > 1) {
        alert(`DİKKAT: Ağırlık toplamı %${totalWeight}. İdeal analiz için toplam tam %100 olmalıdır.`);
        return;
    }
    setIsSaving(true);
    await onUpdateConfig(draftConfig);
    setIsSaving(false);
    setIsDirty(false);
    alert("Parametrik matris güncellendi ve nöral hesaplama motoruna işlendi.");
  };

  const SliderControl = ({ label, value, onChange, min = 0, max = 100, step = 1, suffix = '%', description, colorClass = 'accent-slate-900' }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-slate-300 transition-all">
       <div className="flex justify-between items-start mb-4">
          <div>
             <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">{label}</label>
             {description && <p className="text-[9px] font-bold text-slate-400 mt-1 leading-tight max-w-[200px]">{description}</p>}
          </div>
          {/* @fix: Added explicit check and casting for value to fix unknown to ReactNode error. Used a fallback String() conversion. */}
          <span className={`text-2xl font-black ${colorClass.replace('accent-', 'text-')}`}>{typeof value === 'number' ? value.toFixed((step as number) < 1 ? 2 : 0) : String(value)}{suffix}</span>
       </div>
       <input 
         type="range" min={min} max={max} step={step}
         value={value} 
         onChange={e => onChange(parseFloat(e.target.value))}
         className={`w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer ${colorClass}`}
       />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-32 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter">Parametrik Analiz Motoru</h3>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-xl">
               Liyakat algoritmalarını kurumsal önceliklerinize göre kalibre edin. Bu ayarlar, adayların puanlama ve sıralama mantığını doğrudan değiştirir.
            </p>
         </div>
         <div className="relative z-10 flex gap-4">
            <div className={`px-6 py-3 rounded-2xl border ${Math.abs(totalWeight - 100) < 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'}`}>
               <span className="text-[10px] font-black uppercase tracking-widest block">TOPLAM AĞIRLIK</span>
               <span className="text-2xl font-black">%{totalWeight}</span>
            </div>
         </div>
         <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
         {[
            { id: 'weights', label: '1. AĞIRLIK MATRİSİ', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
            { id: 'logic', label: '2. CEZA VE TOLERANS', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            { id: 'ai', label: '3. AI BİLİŞSEL MİZAÇ', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { id: 'system', label: '4. SİSTEM AYARLARI', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0' },
         ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-white border-orange-600 shadow-xl text-orange-600' 
                  : 'bg-white border-white text-slate-400 hover:border-slate-200'
               }`}
            >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
               <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
         ))}
      </div>

      {/* CONTENT PANELS */}
      <div className="bg-slate-50 p-8 rounded-[4rem] border border-slate-100 min-h-[500px]">
         
         {/* 1. AĞIRLIK MATRİSİ */}
         {activeTab === 'weights' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <SliderControl 
                  label="Klinik Derinlik & Teknik" 
                  description="Metodolojik hakimiyet ve bilgi düzeyinin skora etkisi."
                  value={draftConfig.advancedAnalytics?.weights.clinicalDepth}
                  onChange={(v: number) => handleAdvancedChange('weights', 'clinicalDepth', v)}
                  colorClass="accent-orange-600 text-orange-600"
               />
               <SliderControl 
                  label="Etik Bütünlük" 
                  description="Dürüstlük, sınır koruma ve meslek etiğinin etkisi."
                  value={draftConfig.advancedAnalytics?.weights.ethicalIntegrity}
                  onChange={(v: number) => handleAdvancedChange('weights', 'ethicalIntegrity', v)}
                  colorClass="accent-emerald-600 text-emerald-600"
               />
               <SliderControl 
                  label="Duygusal Dayanıklılık" 
                  description="Stres yönetimi ve kriz anındaki soğukkanlılık."
                  value={draftConfig.advancedAnalytics?.weights.emotionalResilience}
                  onChange={(v: number) => handleAdvancedChange('weights', 'emotionalResilience', v)}
                  colorClass="accent-blue-600 text-blue-600"
               />
               <SliderControl 
                  label="Kurumsal Sadakat" 
                  description="Uzun vadeli çalışma potansiyeli ve aidiyet."
                  value={draftConfig.advancedAnalytics?.weights.institutionalLoyalty}
                  onChange={(v: number) => handleAdvancedChange('weights', 'institutionalLoyalty', v)}
                  colorClass="accent-slate-900 text-slate-900"
               />
               <SliderControl 
                  label="ÖĞRENME ÇEVİKLİĞİ (AGILITY)" 
                  description="Yeni yöntemlere adaptasyon ve eleştiriye açıklık."
                  value={draftConfig.advancedAnalytics?.weights.learningAgility}
                  onChange={(v: number) => handleAdvancedChange('weights', 'learningAgility', v)}
                  colorClass="accent-purple-600 text-purple-600"
               />
            </div>
         )}

         {/* 2. MANTIK VE CEZALAR */}
         {activeTab === 'logic' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] pl-2 border-l-4 border-rose-600">Ceza Mekanizması</h4>
                  <SliderControl 
                     label="Kritik Etik İhlal Cezası" 
                     description="Etik dışı bir cevap (örn: özel ders teklifi) verildiğinde toplam skordan düşülecek puan."
                     value={draftConfig.advancedAnalytics?.penalties.criticalEthicalViolation}
                     onChange={(v: number) => handleAdvancedChange('penalties', 'criticalEthicalViolation', v)}
                     colorClass="accent-rose-600 text-rose-600"
                     suffix=" Puan"
                  />
                  <SliderControl 
                     label="Tutarsızlık Cezası" 
                     description="Mülakat yanıtları ile deneyim yılı çelişirse kesilecek puan."
                     value={draftConfig.advancedAnalytics?.penalties.inconsistentAnswers}
                     onChange={(v: number) => handleAdvancedChange('penalties', 'inconsistentAnswers', v)}
                     colorClass="accent-rose-500 text-rose-500"
                     suffix=" Puan"
                  />
                  <SliderControl 
                     label="Deneyim İndirimi (Junior)" 
                     description="2 yıldan az deneyimlilerin ham puanı bu katsayı ile çarpılır (0.8 = %20 kesinti)."
                     value={draftConfig.advancedAnalytics?.penalties.lowExperienceDiscount}
                     onChange={(v: number) => handleAdvancedChange('penalties', 'lowExperienceDiscount', v)}
                     colorClass="accent-slate-500 text-slate-500"
                     min={0.5} max={1.0} step={0.01} suffix="x"
                  />
               </div>
               <div className="space-y-6">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] pl-2 border-l-4 border-emerald-600">Karar Eşikleri</h4>
                  <SliderControl 
                     label="Otomatik İşe Alım Önerisi" 
                     description="Bu skorun üzerindeki adaylar için sistem 'Kadroya Kat' önerisi sunar."
                     value={draftConfig.advancedAnalytics?.thresholds.minHiringScore}
                     onChange={(v: number) => handleAdvancedChange('thresholds', 'minHiringScore', v)}
                     colorClass="accent-emerald-600 text-emerald-600"
                  />
                  <SliderControl 
                     label="High Potential (HiPo) Limiti" 
                     description="Geleceğin lider adaylarını belirleyen üstün başarı sınırı."
                     value={draftConfig.advancedAnalytics?.thresholds.highPotentialCutoff}
                     onChange={(v: number) => handleAdvancedChange('thresholds', 'highPotentialCutoff', v)}
                     colorClass="accent-orange-500 text-orange-500"
                  />
               </div>
            </div>
         )}

         {/* 3. AI BİLİŞSEL AYARLAR */}
         {activeTab === 'ai' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-bl-[4rem]"></div>
                  <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">AI Mizaç Ayarları</h4>
                  
                  <div className="space-y-8">
                     <SliderControl 
                        label="Şüphecilik Seviyesi (Skepticism)" 
                        description="Yüksekse AI, adayın her beyanını sorgular ve kanıt arar. Düşükse beyana güvenir."
                        value={draftConfig.advancedAnalytics?.aiCognition.skepticismLevel}
                        onChange={(v: number) => handleAdvancedChange('aiCognition', 'skepticismLevel', v)}
                        colorClass="accent-slate-900 text-slate-900"
                     />
                     <SliderControl 
                        label="Stres Testi Şiddeti" 
                        description="Kriz simülasyonlarında veli/vaka profilinin zorluk derecesi."
                        value={draftConfig.advancedAnalytics?.aiCognition.stressTestIntensity}
                        onChange={(v: number) => handleAdvancedChange('aiCognition', 'stressTestIntensity', v)}
                        colorClass="accent-rose-600 text-rose-600"
                     />
                     <SliderControl 
                        label="İnovasyon Eğilimi" 
                        description="Düşükse geleneksel yöntemleri, yüksekse modern/deneysel yöntemleri ödüllendirir."
                        value={draftConfig.advancedAnalytics?.aiCognition.innovationBias}
                        onChange={(v: number) => handleAdvancedChange('aiCognition', 'innovationBias', v)}
                        colorClass="accent-blue-600 text-blue-600"
                     />
                  </div>
               </div>
               <div className="flex flex-col justify-center space-y-6">
                  <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
                     <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-widest mb-4">Mizaç Etkisi</h5>
                     <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">
                        Bu ayarlar, Gemini-3 modelinin "System Instruction" bölümüne dinamik olarak enjekte edilir. Şüphecilik seviyesinin %80 üzerine çıkarılması, ortalama liyakat skorlarında %15'e varan düşüşe neden olabilir ancak "Yanlış Pozitif" (Hatalı İşe Alım) riskini minimize eder.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* 4. TEMEL SİSTEM AYARLARI (LEGACY) */}
         {activeTab === 'system' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6 bg-white p-8 rounded-[3rem]">
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Kurum Adı</label>
                    <input 
                      type="text" 
                      className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                      value={draftConfig.institutionName} 
                      onChange={e => handleUpdateField('institutionName', e.target.value)}
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Mülakat Linki</label>
                    <input 
                      type="text" 
                      className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                      value={draftConfig.interviewSettings.defaultMeetingLink} 
                      onChange={e => {
                         const newSettings = { ...draftConfig.interviewSettings, defaultMeetingLink: e.target.value };
                         handleUpdateField('interviewSettings', newSettings);
                      }}
                    />
                  </div>
               </div>
            </div>
         )}

      </div>

      {/* SAVE ACTION BAR */}
      {isDirty && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6 animate-slide-up">
          <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-3xl">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white animate-pulse">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Konfigürasyon Değişti</p>
                <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Yeni parametreler tüm sisteme yansıtılacak.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setDraftConfig({ ...config, advancedAnalytics: config.advancedAnalytics || DEFAULT_ADVANCED })}
                className="px-6 py-3 bg-white/5 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
              >
                İptal
              </button>
              <button 
                onClick={handleSaveToSystem}
                disabled={isSaving}
                className={`px-8 py-3 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase shadow-xl hover:bg-orange-600 hover:text-white transition-all ${isSaving ? 'opacity-50' : ''}`}
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
