import React, { useState, useMemo, useEffect } from 'react';
import { GlobalConfig } from '../../types';

interface SettingsViewProps {
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  const [draft, setDraft] = useState<GlobalConfig>(config);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeModule, setActiveModule] = useState<'matrix' | 'risk' | 'ai' | 'ops'>('matrix');

  useEffect(() => {
    setDraft(config);
    setIsDirty(false);
  }, [config]);

  const totalWeight = useMemo(() => {
    // @fix: Cast Object.values to number[] to resolve '+' operator error on unknown types in reduce function.
    return (Object.values(draft.weightMatrix) as number[]).reduce((a, b) => a + b, 0);
  }, [draft.weightMatrix]);

  const updateModule = (module: keyof GlobalConfig, key: string, value: any) => {
    setDraft(prev => ({
      ...prev,
      [module]: {
        ...(prev[module] as any),
        [key]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (Math.abs(totalWeight - 100) > 0.1) {
      alert(`HATA: Liyakat Ağırlık Matrisi toplamı %100 olmalıdır. Mevcut toplam: %${totalWeight}`);
      return;
    }
    setIsSaving(true);
    try {
      await onUpdateConfig(draft);
      setIsDirty(false);
      alert("Sistem konfigürasyonu MIA Çekirdeğine başarıyla mühürlendi.");
    } finally {
      setIsSaving(false);
    }
  };

  const SliderCard = ({ label, desc, value, onChange, min = 0, max = 100, color = "orange", suffix = "%" }: any) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="max-w-[70%]">
          <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-orange-600 transition-colors">{label}</h5>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 leading-relaxed">{desc}</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black text-${color}-600`}>{value}{suffix}</span>
        </div>
      </div>
      <div className="relative z-10">
        <input 
          type="range" min={min} max={max} step={1}
          value={value} 
          onChange={e => onChange(parseInt(e.target.value))}
          className={`w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-${color}-600`}
        />
      </div>
      <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] pb-32 animate-fade-in relative">
      
      {/* 1. CONTROL HEADER */}
      <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shrink-0">
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-20 h-20 bg-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.3)] rotate-3">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0" /></svg>
           </div>
           <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">MIA Konfigürasyon Stüdyosu</h2>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black ${isDirty ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}>
                  {isDirty ? 'KAYDEDİLMEMİŞ DEĞİŞİKLİK' : 'SİSTEM SENKRONİZE'}
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">Akademik Algoritma ve Karar Destek Parametreleri</p>
           </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
           <div className={`px-8 py-4 rounded-3xl border-2 flex flex-col items-center ${Math.abs(totalWeight - 100) < 0.1 ? 'border-emerald-500 bg-emerald-500/10' : 'border-rose-500 bg-rose-500/10 animate-bounce'}`}>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">MATRİS TOPLAMI</span>
              <span className={`text-4xl font-black ${Math.abs(totalWeight - 100) < 0.1 ? 'text-emerald-400' : 'text-rose-500'}`}>%{totalWeight}</span>
           </div>
        </div>
        <div className="absolute -right-20 -bottom-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar shrink-0 px-2">
        {[
          { id: 'matrix', label: '1. Ağırlık Matrisi', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { id: 'risk', label: '2. Risk & Ceza Motoru', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { id: 'ai', label: '3. AI Bilişsel Persona', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          { id: 'ops', label: '4. Operasyonel Eşikler', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveModule(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] border-2 transition-all whitespace-nowrap ${
              activeModule === tab.id 
              ? 'bg-white border-orange-600 text-orange-600 shadow-xl scale-105' 
              : 'bg-white border-transparent text-slate-400 hover:border-slate-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
            <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. SETTINGS CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        {activeModule === 'matrix' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            <SliderCard 
              label="Klinik Uzmanlık" desc="Teknik bilgi, metodolojik hakimiyet ve uygulama sadakatinin toplam skordaki ağırlığı."
              value={draft.weightMatrix.clinicalExpertise} onChange={(v:any) => updateModule('weightMatrix', 'clinicalExpertise', v)}
            />
            <SliderCard 
              label="Etik Bütünlük" desc="Sınır ihlali direnci, profesyonel dürüstlük ve kurumsal entegrite hassasiyeti."
              value={draft.weightMatrix.ethicalIntegrity} onChange={(v:any) => updateModule('weightMatrix', 'ethicalIntegrity', v)} color="emerald"
            />
            <SliderCard 
              label="Duygusal Direnç" desc="Stres altında karar alma yetisi ve tükenmişlik (burnout) eşiği katsayısı."
              value={draft.weightMatrix.emotionalResilience} onChange={(v:any) => updateModule('weightMatrix', 'emotionalResilience', v)} color="rose"
            />
            <SliderCard 
              label="Kurumsal Sadakat" desc="Kurum vizyonuyla uyum ve uzun vadeli sürdürülebilir çalışma potansiyeli."
              value={draft.weightMatrix.institutionalLoyalty} onChange={(v:any) => updateModule('weightMatrix', 'institutionalLoyalty', v)} color="blue"
            />
            <SliderCard 
              label="Öğrenme Çevikliği" desc="Yeni metotlara, teknolojilere ve AI araçlarına adaptasyon hızı."
              value={draft.weightMatrix.learningAgility} onChange={(v:any) => updateModule('weightMatrix', 'learningAgility', v)} color="purple"
            />
            <SliderCard 
              label="Akademik Pedagoji" desc="Öğretim tasarımı, BEP hazırlama ve çocukla iletişim kalitesi derinliği."
              value={draft.weightMatrix.academicPedagogy} onChange={(v:any) => updateModule('weightMatrix', 'academicPedagogy', v)} color="orange"
            />
          </div>
        )}

        {activeModule === 'risk' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
             <div className="space-y-6">
                <h4 className="text-[12px] font-black text-rose-600 uppercase tracking-[0.4em] pl-4 border-l-4 border-rose-600">Kesinti Protokolleri</h4>
                <SliderCard 
                  label="Kritik Etik İhlal" desc="Tespit edilen her ağır etik hata için toplam puandan yapılacak kesinti."
                  value={draft.riskEngine.criticalEthicalViolationPenalty} onChange={(v:any) => updateModule('riskEngine', 'criticalEthicalViolationPenalty', v)} color="rose" suffix=" Puan"
                />
                <SliderCard 
                  label="Tutarsızlık Cezası" desc="Mülakat yanıtları ile özgeçmiş verileri arasındaki bilişsel çelişki cezası."
                  value={draft.riskEngine.inconsistentAnswerPenalty} onChange={(v:any) => updateModule('riskEngine', 'inconsistentAnswerPenalty', v)} color="rose" suffix=" Puan"
                />
             </div>
             <div className="space-y-6">
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] pl-4 border-l-4 border-slate-900">Tolerans Katsayıları</h4>
                <SliderCard 
                  label="Junior Deneyim Faktörü" desc="Düşük deneyimli adaylarda ham puanın çarpılacağı tolerans katsayısı."
                  value={draft.riskEngine.lowExperienceDiscountFactor} min={0.5} max={1.0} step={0.05} onChange={(v:any) => updateModule('riskEngine', 'lowExperienceDiscountFactor', v)} color="slate" suffix="x"
                />
                <SliderCard 
                  label="Job Hopping Cezası" desc="Sık iş değiştiren adayların sadakat puanından düşülecek sabit ceza puanı."
                  value={draft.riskEngine.jobHoppingPenalty} onChange={(v:any) => updateModule('riskEngine', 'jobHoppingPenalty', v)} color="orange" suffix=" Puan"
                />
             </div>
          </div>
        )}

        {activeModule === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-scale-in">
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                   <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">Bilişsel Kalibrasyon</h4>
                   <SliderCard 
                     label="AI Şüphecilik Seviyesi" desc="AI'nın aday beyanlarını sorgulama ve 'açık arama' şiddeti."
                     value={draft.aiPersona.skepticismLevel} onChange={(v:any) => updateModule('aiPersona', 'skepticismLevel', v)} color="slate"
                   />
                   <SliderCard 
                     label="İnovasyon Bi्यास (Ödülü)" desc="Modern metotları savunan adaylara verilecek ekstra kredi eğilimi."
                     value={draft.aiPersona.innovationBias} onChange={(v:any) => updateModule('aiPersona', 'innovationBias', v)} color="emerald"
                   />
                   <SliderCard 
                     label="Stres Testi Şiddeti" desc="Simülasyonlardaki veli karakterinin manipülasyon ve agresyon düzeyi."
                     value={draft.aiPersona.stressTestIntensity} onChange={(v:any) => updateModule('aiPersona', 'stressTestIntensity', v)} color="rose"
                   />
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 rounded-bl-[5rem]"></div>
             </div>
             
             <div className="flex flex-col justify-center gap-8">
                <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl">
                   <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-widest mb-6">PROMPT ENJEKSİYON NOTU</h5>
                   <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                      Bu ayarlar, Gemini-3-Flash modelinin "System Instruction" katmanına dinamik olarak kodlanır. Örneğin, şüphecilik %80 üzerine çıktığında AI'ya "Adayın cevaplarını potansiyel manipülasyon olarak varsay ve klinik kanıt iste" talimatı gönderilir.
                   </p>
                </div>
                <div onClick={() => updateModule('aiPersona', 'detailedReporting', !draft.aiPersona.detailedReporting)} className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between ${draft.aiPersona.detailedReporting ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                   <div>
                      <h6 className="text-[12px] font-black text-slate-900 uppercase">Derin Analiz Raporlaması</h6>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">AI analizlerini maksimum detayda tutar.</p>
                   </div>
                   <div className={`w-14 h-8 rounded-full transition-all relative ${draft.aiPersona.detailedReporting ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${draft.aiPersona.detailedReporting ? 'right-1' : 'left-1'}`}></div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeModule === 'ops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
             <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 space-y-8">
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] pl-4 border-l-4 border-slate-900">Otomasyon Eşikleri</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <div>
                         <span className="text-[11px] font-black text-slate-700 uppercase">Min. İşe Alım Skoru</span>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Bu skorun altındaki adaylar 'Riskli' etiketlenir.</p>
                      </div>
                      <input type="number" className="w-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-orange-600 text-lg" value={draft.systemSettings.minHiringScore} onChange={e => updateModule('systemSettings', 'minHiringScore', parseInt(e.target.value))} />
                   </div>
                   <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <div>
                         <span className="text-[11px] font-black text-slate-700 uppercase">HiPo (High Potential) Limiti</span>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Liderlik potansiyeli ve üstün başarı eşiği.</p>
                      </div>
                      <input type="number" className="w-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-emerald-600 text-lg" value={draft.systemSettings.highPotentialCutoff} onChange={e => updateModule('systemSettings', 'highPotentialCutoff', parseInt(e.target.value))} />
                   </div>
                   <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <div>
                         <span className="text-[11px] font-black text-slate-700 uppercase">Otomatik Red Eşiği</span>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Bu skorun altı direkt elenir.</p>
                      </div>
                      <input type="number" className="w-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-rose-600 text-lg" value={draft.systemSettings.autoRejectBelowScore} onChange={e => updateModule('systemSettings', 'autoRejectBelowScore', parseInt(e.target.value))} />
                   </div>
                </div>
             </div>
             
             <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 space-y-8">
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] pl-4 border-l-4 border-blue-600">Kurumsal Tanımlamalar</h4>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Kurum Resmi Adı</label>
                      <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-slate-900 text-sm uppercase tracking-widest outline-none focus:border-blue-600 transition-all" value={draft.institutionName} onChange={e => setDraft({...draft, institutionName: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Varsayılan Mülakat Linki</label>
                      <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-bold text-slate-600 text-xs outline-none focus:border-blue-600 transition-all" value={draft.systemSettings.defaultMeetingLink} onChange={e => updateModule('systemSettings', 'defaultMeetingLink', e.target.value)} />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 4. PERSISTENT SAVE BAR */}
      {isDirty && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6 animate-slide-up">
           <div className="bg-slate-900 p-6 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex items-center justify-between border border-white/10 backdrop-blur-2xl">
              <div className="flex items-center gap-5 pl-4">
                 <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white animate-pulse shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 </div>
                 <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Mimari Değişiklik Tespit Edildi</p>
                    <p className="text-[9px] font-bold text-slate-500 mt-1.5 uppercase">Yeni parametreleri mühürlemek için kaydedin.</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setDraft(config)} className="px-8 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">İPTAL</button>
                 <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="px-12 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase shadow-2xl hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
                 >
                    {isSaving ? 'İŞLENİYOR...' : 'KAYDET VE DAĞIT'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;