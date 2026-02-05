
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
    <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="max-w-[70%]">
          <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-orange-600 transition-colors">{label}</h5>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 leading-relaxed">{desc}</p>
        </div>
        <span className={`text-2xl md:text-3xl font-black text-${color}-600`}>{value}{suffix}</span>
      </div>
      <div className="px-1">
        <input 
          type="range" min={min} max={max} step={1}
          value={value} 
          onChange={e => onChange(parseInt(e.target.value))}
          className={`w-full h-2 md:h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-${color}-600`}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] pb-24 md:pb-32 animate-fade-in relative px-4 md:px-0">
      
      {/* 1. CONTROL HEADER - RESPONSIVE */}
      <div className="bg-slate-950 p-6 md:p-10 rounded-2xl md:rounded-[4rem] text-white shadow-3xl mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shrink-0">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
           <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-600 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center shadow-xl rotate-3 shrink-0">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31.826-4.74 0a1.724 1.724 0 00-2.573-1.066c.426 1.756 2.924 1.756 3.35 0" /></svg>
           </div>
           <div>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">MIA Konfigürasyon</h2>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black ${isDirty ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                  {isDirty ? 'DEĞİŞİKLİK MEVCUT' : 'SENKRONİZE'}
                </div>
              </div>
              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Akademik Algoritma Parametreleri</p>
           </div>
        </div>

        <div className={`px-6 py-4 rounded-2xl border-2 flex flex-col items-center shrink-0 relative z-10 ${Math.abs(totalWeight - 100) < 0.1 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/50 bg-rose-500/5 animate-pulse'}`}>
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">MATRİS TOPLAMI</span>
           <span className={`text-3xl md:text-4xl font-black ${Math.abs(totalWeight - 100) < 0.1 ? 'text-emerald-400' : 'text-rose-500'}`}>%{totalWeight}</span>
        </div>
        <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 2. NAVIGATION TABS - SCROLLABLE ON MOBILE */}
      <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto no-scrollbar shrink-0 px-1">
        {[
          { id: 'matrix', label: '1. Ağırlıklar', icon: 'M9 19v-6' },
          { id: 'risk', label: '2. Risk Motoru', icon: 'M12 9v2' },
          { id: 'ai', label: '3. AI Persona', icon: 'M13 10V3' },
          { id: 'ops', label: '4. Eşikler', icon: 'M19 11H5' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveModule(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-4 md:px-8 md:py-5 rounded-xl md:rounded-[2rem] border-2 transition-all whitespace-nowrap shrink-0 ${
              activeModule === tab.id 
              ? 'bg-white border-orange-600 text-orange-600 shadow-xl' 
              : 'bg-white border-transparent text-slate-400 hover:border-slate-200'
            }`}
          >
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. SETTINGS CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
        {activeModule === 'matrix' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-scale-in">
            <SliderCard label="Klinik Uzmanlık" desc="Teknik bilgi ve uygulama sadakatinin toplam skordaki ağırlığı." value={draft.weightMatrix.clinicalExpertise} onChange={(v:any) => updateModule('weightMatrix', 'clinicalExpertise', v)} />
            <SliderCard label="Etik Bütünlük" desc="Sınır ihlali direnci ve profesyonel dürüstlük katsayısı." value={draft.weightMatrix.ethicalIntegrity} onChange={(v:any) => updateModule('weightMatrix', 'ethicalIntegrity', v)} color="emerald" />
            <SliderCard label="Duygusal Direnç" desc="Stres altında karar alma ve tükenmişlik eşiği katsayısı." value={draft.weightMatrix.emotionalResilience} onChange={(v:any) => updateModule('weightMatrix', 'emotionalResilience', v)} color="rose" />
            <SliderCard label="Kurumsal Sadakat" desc="Kurum vizyonuyla uyum ve sürdürülebilirlik potansiyeli." value={draft.weightMatrix.institutionalLoyalty} onChange={(v:any) => updateModule('weightMatrix', 'institutionalLoyalty', v)} color="blue" />
            <SliderCard label="Öğrenme Çevikliği" desc="Yeni metotlara ve teknolojilere adaptasyon hızı." value={draft.weightMatrix.learningAgility} onChange={(v:any) => updateModule('weightMatrix', 'learningAgility', v)} color="purple" />
            <SliderCard label="Akademik Pedagoji" desc="Öğretim tasarımı ve BEP hakimiyeti derinliği." value={draft.weightMatrix.academicPedagogy} onChange={(v:any) => updateModule('weightMatrix', 'academicPedagogy', v)} color="orange" />
          </div>
        )}

        {activeModule === 'risk' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
             <div className="space-y-4">
                <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-widest pl-4 border-l-4 border-rose-600 mb-4">Cezalandırma Matrisi</h4>
                <SliderCard label="Kritik Etik İhlal" desc="Ağır etik hatalarda toplam puandan yapılacak kesinti." value={draft.riskEngine.criticalEthicalViolationPenalty} onChange={(v:any) => updateModule('riskEngine', 'criticalEthicalViolationPenalty', v)} color="rose" suffix=" Puan" />
                <SliderCard label="Tutarsızlık Cezası" desc="Mülakat ve özgeçmiş verileri arasındaki çelişki cezası." value={draft.riskEngine.inconsistentAnswerPenalty} onChange={(v:any) => updateModule('riskEngine', 'inconsistentAnswerPenalty', v)} color="rose" suffix=" Puan" />
             </div>
             <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest pl-4 border-l-4 border-slate-900 mb-4">Tolerans Ayarları</h4>
                <SliderCard label="Junior Çarpanı" desc="Düşük deneyimli adaylarda uygulanan tolerans faktörü." value={draft.riskEngine.lowExperienceDiscountFactor} min={0.5} max={1.0} step={0.05} onChange={(v:any) => updateModule('riskEngine', 'lowExperienceDiscountFactor', v)} color="slate" suffix="x" />
             </div>
          </div>
        )}

        {activeModule === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in">
             <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-xl space-y-8">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Bilişsel Kalibrasyon</h4>
                <SliderCard label="AI Şüphecilik" desc="AI'nın aday beyanlarını sorgulama şiddeti." value={draft.aiPersona.skepticismLevel} onChange={(v:any) => updateModule('aiPersona', 'skepticismLevel', v)} color="slate" />
                <SliderCard label="İnovasyon Bias" desc="Modern metotlara verilen ekstra kredi eğilimi." value={draft.aiPersona.innovationBias} onChange={(v:any) => updateModule('aiPersona', 'innovationBias', v)} color="emerald" />
             </div>
             <div onClick={() => updateModule('aiPersona', 'detailedReporting', !draft.aiPersona.detailedReporting)} className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between h-fit ${draft.aiPersona.detailedReporting ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                <div>
                   <h6 className="text-[12px] font-black text-slate-900 uppercase">Derin Analiz Modu</h6>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">AI analizlerini maksimum detayda tutar.</p>
                </div>
                <div className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${draft.aiPersona.detailedReporting ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                   <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${draft.aiPersona.detailedReporting ? 'right-1' : 'left-1'}`}></div>
                </div>
             </div>
          </div>
        )}

        {activeModule === 'ops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest pl-4 border-l-4 border-slate-900">Otomasyon Eşikleri</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <span className="text-[11px] font-black text-slate-700 uppercase">İşe Alım Skoru</span>
                      <input type="number" className="w-16 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-orange-600" value={draft.systemSettings.minHiringScore} onChange={e => updateModule('systemSettings', 'minHiringScore', parseInt(e.target.value))} />
                   </div>
                   <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <span className="text-[11px] font-black text-slate-700 uppercase">HiPo Limiti</span>
                      <input type="number" className="w-16 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-emerald-600" value={draft.systemSettings.highPotentialCutoff} onChange={e => updateModule('systemSettings', 'highPotentialCutoff', parseInt(e.target.value))} />
                   </div>
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Kurum Resmi Adı</label>
                <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 text-sm uppercase outline-none focus:border-orange-600 transition-all" value={draft.institutionName} onChange={e => setDraft({...draft, institutionName: e.target.value})} />
             </div>
          </div>
        )}
      </div>

      {/* 4. PERSISTENT SAVE BAR - MOBILE OPTIMIZED */}
      {isDirty && (
        <div className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-2xl">
           <div className="bg-slate-950 p-4 md:p-6 rounded-2xl md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between border border-white/10 backdrop-blur-xl gap-4">
              <div className="flex items-center gap-4 pl-0 md:pl-4">
                 <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white animate-pulse">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Mimari Değişiklik</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Sistemi güncellemek için kaydedin.</p>
                 </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 <button onClick={() => setDraft(config)} className="flex-1 md:flex-none px-6 py-4 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">İPTAL</button>
                 <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="flex-2 md:flex-none px-10 py-4 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl"
                 >
                    {isSaving ? '...' : 'MÜHÜRLE'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
