
import React, { useState, useEffect, useMemo } from 'react';
import { GlobalConfig } from '../../types';
import { storageService } from '../../services/storageService';

interface SettingsViewProps {
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

const DEFAULT_CONFIG: Partial<GlobalConfig> = {
  institutionName: 'Yeni Gün Akademi',
  weightMatrix: { clinicalExpertise: 30, ethicalIntegrity: 30, emotionalResilience: 15, institutionalLoyalty: 10, learningAgility: 10, academicPedagogy: 5 },
  riskEngine: { criticalEthicalViolationPenalty: 40, inconsistentAnswerPenalty: 20, lowExperienceDiscountFactor: 0.85, jobHoppingPenalty: 15 },
  aiPersona: { skepticismLevel: 70, innovationBias: 50, stressTestIntensity: 80, detailedReporting: true },
  systemSettings: { minHiringScore: 75, highPotentialCutoff: 90, interviewDurationMinutes: 45, autoRejectBelowScore: 40, defaultMeetingLink: 'https://meet.google.com/new' }
};

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  const [draftConfig, setDraftConfig] = useState<GlobalConfig>({
    ...DEFAULT_CONFIG,
    ...config,
    weightMatrix: { ...DEFAULT_CONFIG.weightMatrix, ...(config.weightMatrix || {}) },
    riskEngine: { ...DEFAULT_CONFIG.riskEngine, ...(config.riskEngine || {}) },
    aiPersona: { ...DEFAULT_CONFIG.aiPersona, ...(config.aiPersona || {}) },
    systemSettings: { ...DEFAULT_CONFIG.systemSettings, ...(config.systemSettings || {}) }
  } as GlobalConfig);

  const [activeTab, setActiveTab] = useState<'matrix' | 'risk' | 'ai' | 'system' | 'tools'>('matrix');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
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
  }, [config]);

  const totalWeight = useMemo(() => {
    const w = draftConfig.weightMatrix;
    return Object.values(w).reduce((a: number, b: number) => a + b, 0);
  }, [draftConfig.weightMatrix]);

  const updateField = (module: keyof GlobalConfig, key: string, value: any) => {
    setDraftConfig(prev => ({ ...prev, [module]: { ...(prev[module] as any), [key]: value } }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (Math.abs(totalWeight - 100) > 1) {
        alert(`HATA: Ağırlık Matrisi toplamı %${totalWeight}. Toplam tam %100 olmalıdır.`);
        return;
    }
    setIsSaving(true);
    await onUpdateConfig(draftConfig);
    setIsSaving(false);
    setIsDirty(false);
    alert("Parametreler Güncellendi.");
  };

  const handleSeedData = async () => {
      if(!confirm("DİKKAT: Veritabanına gerçekçi örnek veriler (Adaylar, Personeller, Müfredatlar, Simülasyonlar) enjekte edilecektir. Mevcut verileriniz silinmez ancak liste kalabalıklaşabilir. Onaylıyor musunuz?")) return;
      setIsSeeding(true);
      try {
          const res = await storageService.seedDatabase();
          if(res.success) {
              alert("Sistem Simülasyonu Başarılı: Veritabanı liyakat verileriyle canlandırıldı. Lütfen sayfayı yenileyiniz.");
              window.location.reload();
          } else {
              alert("Hata: " + res.error);
          }
      } finally {
          setIsSeeding(false);
      }
  };

  const Slider = ({ label, desc, value, onChange, min=0, max=100, color="orange", suffix="%" }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{label}</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-1 max-w-[250px] leading-relaxed">{desc}</p>
            </div>
            <span className={`text-2xl font-black text-${color}-600`}>{value}{suffix}</span>
        </div>
        <input type="range" min={min} max={max} step={1} value={value} onChange={e => onChange(Number(e.target.value))} className={`w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] pb-24 relative animate-fade-in">
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl mb-8 flex justify-between items-end relative overflow-hidden shrink-0">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Sistem Parametreleri</h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">MİA Bilişsel Yapılandırma Ünitesi</p>
            </div>
            <div className={`relative z-10 px-6 py-3 rounded-2xl border-2 flex flex-col items-center ${Math.abs(totalWeight - 100) <= 1 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-rose-500 bg-rose-500/10 text-rose-400 animate-pulse'}`}>
                <span className="text-[8px] font-black uppercase tracking-widest">MATRİS TOPLAMI</span>
                <span className="text-3xl font-black">%{totalWeight}</span>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="flex gap-4 px-2 mb-6 overflow-x-auto no-scrollbar shrink-0">
            {[
                { id: 'matrix', label: '1. AĞIRLIK MATRİSİ' },
                { id: 'risk', label: '2. RİSK MOTORU' },
                { id: 'ai', label: '3. AI PERSONA' },
                { id: 'system', label: '4. OPERASYONEL' },
                { id: 'tools', label: '5. SİSTEM ARAÇLARI' }
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-8 py-4 rounded-2xl border-2 transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'bg-white border-orange-600 shadow-xl text-orange-600 scale-105' : 'bg-white border-transparent text-slate-400 hover:border-slate-200'}`}>
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
            {activeTab === 'matrix' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
                    <Slider label="Klinik Uzmanlık" desc="Teknik bilginin skora etkisi." value={draftConfig.weightMatrix.clinicalExpertise} onChange={(v: number) => updateField('weightMatrix', 'clinicalExpertise', v)} />
                    <Slider label="Etik Bütünlük" desc="Dürüstlük ve sınırların ağırlığı." value={draftConfig.weightMatrix.ethicalIntegrity} onChange={(v: number) => updateField('weightMatrix', 'ethicalIntegrity', v)} color="emerald" />
                    <Slider label="Pedagojik Derinlik" desc="Öğretim stratejisi kalitesi." value={draftConfig.weightMatrix.academicPedagogy} onChange={(v: number) => updateField('weightMatrix', 'academicPedagogy', v)} color="blue" />
                    <Slider label="Duygusal Direnç" desc="Stres toleransı etkisi." value={draftConfig.weightMatrix.emotionalResilience} onChange={(v: number) => updateField('weightMatrix', 'emotionalResilience', v)} color="rose" />
                    <Slider label="Kurumsal Sadakat" desc="Aidiyet potansiyeli." value={draftConfig.weightMatrix.institutionalLoyalty} onChange={(v: number) => updateField('weightMatrix', 'institutionalLoyalty', v)} color="slate" />
                    <Slider label="Öğrenme Çevikliği" desc="Adaptasyon hızı." value={draftConfig.weightMatrix.learningAgility} onChange={(v: number) => updateField('weightMatrix', 'learningAgility', v)} color="purple" />
                </div>
            )}

            {activeTab === 'risk' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
                    <Slider label="Kritik Etik İhlal Cezası" desc="Skordan düşecek ceza puanı." value={draftConfig.riskEngine.criticalEthicalViolationPenalty} onChange={(v: number) => updateField('riskEngine', 'criticalEthicalViolationPenalty', v)} color="rose" suffix=" Puan" />
                    <Slider label="Tutarsızlık Cezası" desc="Çelişkili yanıt cezası." value={draftConfig.riskEngine.inconsistentAnswerPenalty} onChange={(v: number) => updateField('riskEngine', 'inconsistentAnswerPenalty', v)} color="rose" suffix=" Puan" />
                </div>
            )}

            {activeTab === 'tools' && (
               <div className="max-w-4xl animate-scale-in">
                  <div className="bg-white p-12 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center text-center">
                     <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center text-orange-600 mb-8 shadow-inner">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Demo & Test Laboratuvarı</h3>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 max-w-lg">Sistemi hemen test etmek için veritabanına gerçekçi ve temsili örnek veriler yükleyebilirsiniz. Bu işlem tüm modülleri aktive eder.</p>
                     <button 
                        onClick={handleSeedData}
                        disabled={isSeeding}
                        className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                     >
                        {isSeeding ? 'VERİLER MÜHÜRLENİYOR...' : 'DEMO VERİ SETİ ENJEKTE ET'}
                     </button>
                  </div>
               </div>
            )}
        </div>

        {isDirty && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6 animate-slide-up">
                <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-3xl">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Parametreler Değişti</p>
                    <div className="flex gap-2">
                        <button onClick={() => { setIsDirty(false); setDraftConfig(config); }} className="px-6 py-3 bg-white/5 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">İptal</button>
                        <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase shadow-xl hover:bg-orange-600 hover:text-white transition-all">{isSaving ? '...' : 'Kaydet'}</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SettingsView;
