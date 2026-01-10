
import React, { useState, useEffect } from 'react';
import { GlobalConfig } from '../../types';

interface SettingsViewProps {
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  // Yerel bir taslak state tutarak DB'ye yazmadan önce değişiklikleri biriktirelim
  const [draftConfig, setDraftConfig] = useState<GlobalConfig>(config);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  const handleWeightChange = (key: keyof GlobalConfig['aiWeights'], value: number) => {
    setDraftConfig(prev => ({
      ...prev,
      aiWeights: { ...prev.aiWeights, [key]: value }
    }));
    setIsDirty(true);
  };

  const handlePersonaChange = (key: keyof GlobalConfig['aiPersona'], value: number) => {
    setDraftConfig(prev => ({
      ...prev,
      aiPersona: { ...prev.aiPersona, [key]: value }
    }));
    setIsDirty(true);
  };

  const handleAutomationToggle = (key: keyof GlobalConfig['automation']) => {
    setDraftConfig(prev => ({
      ...prev,
      automation: { ...prev.automation, [key]: !prev.automation[key] }
    }));
    setIsDirty(true);
  };

  const handleInterviewSettingChange = (key: keyof GlobalConfig['interviewSettings'], value: any) => {
    setDraftConfig(prev => ({
      ...prev,
      interviewSettings: { ...prev.interviewSettings, [key]: value }
    }));
    setIsDirty(true);
  };

  const handleUpdateField = (key: keyof GlobalConfig, value: any) => {
    setDraftConfig(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSaveToSystem = async () => {
    setIsSaving(true);
    await onUpdateConfig(draftConfig);
    setIsSaving(false);
    setIsDirty(false);
    alert("Sistem konfigürasyonu bulut veritabanına mühürlendi ve tüm analiz motorlarına entegre edildi.");
  };

  const totalWeight = (Object.values(draftConfig.aiWeights) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-12 animate-fade-in pb-20 relative">
      
      {/* KAYDETME BARI (STICKY FOOTER MANTIĞI) */}
      {isDirty && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-8 animate-slide-up">
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-3xl">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white animate-pulse">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Taslak Değişiklikler Algılandı</p>
                <p className="text-[12px] font-bold text-slate-400 mt-2 uppercase">Ayarları tüm sisteme uygulamak için onaylayın.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setDraftConfig(config); setIsDirty(false); }} className="px-8 py-4 bg-white/5 text-white rounded-2xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">İptal Et</button>
              <button 
                onClick={handleSaveToSystem}
                disabled={isSaving}
                className={`px-10 py-4 bg-orange-600 text-white rounded-2xl text-[9px] font-black uppercase shadow-xl hover:bg-orange-700 transition-all ${isSaving ? 'opacity-50' : ''}`}
              >
                {isSaving ? 'İŞLENİYOR...' : 'SİSTEME ENTEGRE ET'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Akademik Komuta Merkezi</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Sistem Parametreleri ve Kurumsal Filtre Ayarları</p>
        </div>
        <button className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase cursor-not-allowed">Yedekleme Aktif</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col gap-8">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4">Kurumsal Kimlik</h4>
            <div className="space-y-6">
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
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">İletişim E-Postası</label>
                <input 
                  type="email" 
                  className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                  value={draftConfig.notificationEmail} 
                  onChange={e => handleUpdateField('notificationEmail', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
             <div className="relative z-10">
                <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6">İş Akışı Otomasyonu</h4>
                <div className="space-y-4">
                  {[
                    { id: 'autoEmailOnSchedule', label: 'Otomatik Davet E-Postası' },
                    { id: 'requireCvUpload', label: 'Zorunlu CV Yükleme' },
                    { id: 'allowMultipleApplications', label: 'Mükerrer Başvuru İzni' }
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer" onClick={() => handleAutomationToggle(item.id as any)}>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      <div className={`w-10 h-5 rounded-full relative transition-all ${draftConfig.automation[item.id as keyof typeof draftConfig.automation] ? 'bg-orange-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${draftConfig.automation[item.id as keyof typeof draftConfig.automation] ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 relative overflow-hidden">
             <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4">Mülakat Yönetim Parametreleri</h4>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <div className="group">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Varsayılan Mülakat Süresi (Dakika)</label>
                      <input 
                        type="number" 
                        className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                        value={draftConfig.interviewSettings.defaultDuration} 
                        onChange={e => handleInterviewSettingChange('defaultDuration', parseInt(e.target.value))}
                      />
                   </div>
                </div>
                <div className="space-y-8">
                   <div className="group">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Varsayılan Toplantı Linki</label>
                      <input 
                        type="text" 
                        className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                        value={draftConfig.interviewSettings.defaultMeetingLink} 
                        onChange={e => handleInterviewSettingChange('defaultMeetingLink', e.target.value)}
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 relative">
            <div className="flex justify-between items-start mb-12">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4">Liyakat Analiz Motoru Parametreleri</h4>
              <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${totalWeight === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
                TOPLAM ETKİ: %{totalWeight}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Stratejik Karar Ağırlıkları</h5>
                {[
                  { id: 'ethics', label: 'Etik Bütünlük Ağırlığı' },
                  { id: 'clinical', label: 'Klinik Muhakeme Ağırlığı' },
                  { id: 'experience', label: 'Deneyim Katsayısı' },
                  { id: 'fit', label: 'Kurumsal Uyum' }
                ].map(w => (
                  <div key={w.id} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{w.label}</p>
                      <span className="text-xl font-black text-orange-600">%{draftConfig.aiWeights[w.id as keyof typeof draftConfig.aiWeights]}</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={draftConfig.aiWeights[w.id as keyof typeof draftConfig.aiWeights]} 
                      onChange={e => handleWeightChange(w.id as any, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-10">
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mb-8">
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Analiz Üretim Tonu</h5>
                  <div className="flex flex-col gap-4">
                    {['strict', 'balanced', 'empathetic'].map(t => (
                      <button
                        key={t}
                        onClick={() => handleUpdateField('aiTone', t)}
                        className={`text-left p-6 rounded-[2rem] border-2 transition-all ${
                          draftConfig.aiTone === t 
                          ? 'bg-white border-orange-600 shadow-xl' 
                          : 'bg-transparent border-slate-200'
                        }`}
                      >
                        <p className={`text-[10px] font-black uppercase tracking-widest ${draftConfig.aiTone === t ? 'text-orange-600' : 'text-slate-400'}`}>{t}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50/50 p-10 rounded-[3rem] border border-orange-100">
                  <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-8">Karakter İnce Ayarları (Persona)</h5>
                  <div className="space-y-8">
                    {[
                      { id: 'skepticism', label: 'Şüphecilik Seviyesi' },
                      { id: 'empathy', label: 'Empati Derinliği' },
                      { id: 'formality', label: 'Resmiyet Ölçeği' }
                    ].map(p => (
                      <div key={p.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{p.label}</p>
                          <span className="text-xl font-black text-orange-600">%{draftConfig.aiPersona[p.id as keyof typeof draftConfig.aiPersona]}</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" 
                          value={draftConfig.aiPersona[p.id as keyof typeof draftConfig.aiPersona]} 
                          onChange={e => handlePersonaChange(p.id as any, parseInt(e.target.value))}
                          className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
