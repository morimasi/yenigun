
import React from 'react';
import { GlobalConfig } from '../../types';

interface SettingsViewProps {
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  const handleWeightChange = (key: keyof GlobalConfig['aiWeights'], value: number) => {
    onUpdateConfig({
      ...config,
      aiWeights: { ...config.aiWeights, [key]: value }
    });
  };

  const handleAutomationToggle = (key: keyof GlobalConfig['automation']) => {
    onUpdateConfig({
      ...config,
      automation: { ...config.automation, [key]: !config.automation[key] }
    });
  };

  const handleInterviewSettingChange = (key: keyof GlobalConfig['interviewSettings'], value: any) => {
    onUpdateConfig({
      ...config,
      interviewSettings: { ...config.interviewSettings, [key]: value }
    });
  };

  const totalWeight = (Object.values(config.aiWeights) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Akademik Komuta Merkezi</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Sistem Parametreleri ve Kurumsal Filtre Ayarları</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-orange-600 transition-all">Tümünü Yedekle</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Sütun: Kurumsal ve Otomasyon */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col gap-8">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4">Kurumsal Kimlik</h4>
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Kurum Adı</label>
                <input 
                  type="text" 
                  className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                  value={config.institutionName} 
                  onChange={e => onUpdateConfig({...config, institutionName: e.target.value})}
                />
              </div>
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">İletişim E-Postası</label>
                <input 
                  type="email" 
                  className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                  value={config.notificationEmail} 
                  onChange={e => onUpdateConfig({...config, notificationEmail: e.target.value})}
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
                      <div className={`w-10 h-5 rounded-full relative transition-all ${config.automation[item.id as keyof typeof config.automation] ? 'bg-orange-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.automation[item.id as keyof typeof config.automation] ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>

        {/* Orta Sütun: AI ve Mülakat Ayarları */}
        <div className="lg:col-span-8 space-y-8">
          {/* Mülakat Takvimi Ayarları Panel */}
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 relative overflow-hidden">
             <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4">Mülakat Yönetim Parametreleri</h4>
                  <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Takvim akışı ve varsayılan operasyonel ayarlar</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <div className="group">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Varsayılan Mülakat Süresi (Dakika)</label>
                      <input 
                        type="number" 
                        className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                        value={config.interviewSettings.defaultDuration} 
                        onChange={e => handleInterviewSettingChange('defaultDuration', parseInt(e.target.value))}
                      />
                   </div>
                   <div className="group">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Hazırlık/Buffer Süresi (Dakika)</label>
                      <input 
                        type="number" 
                        className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                        value={config.interviewSettings.bufferTime} 
                        onChange={e => handleInterviewSettingChange('bufferTime', parseInt(e.target.value))}
                      />
                   </div>
                </div>
                <div className="space-y-8">
                   <div className="group">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Varsayılan Toplantı Linki (Meet/Zoom)</label>
                      <input 
                        type="text" 
                        className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                        value={config.interviewSettings.defaultMeetingLink} 
                        onChange={e => handleInterviewSettingChange('defaultMeetingLink', e.target.value)}
                        placeholder="https://meet.google.com/..."
                      />
                   </div>
                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest block">Otomatik Statü Güncelleme</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Mülakat bitince 'Değerlendiriliyor'a çek</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${config.interviewSettings.autoStatusAfterInterview ? 'bg-orange-600' : 'bg-slate-300'}`} onClick={() => handleInterviewSettingChange('autoStatusAfterInterview', !config.interviewSettings.autoStatusAfterInterview)}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.interviewSettings.autoStatusAfterInterview ? 'left-7' : 'left-1'}`}></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* AI Ağırlıkları Panel */}
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 relative">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-orange-600 pl-4">Liyakat Analiz Motoru Parametreleri</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Yapay Zeka Karar Ağırlıkları ve Değerlendirme Tonu</p>
              </div>
              <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${totalWeight === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
                TOPLAM ETKİ: %{totalWeight} {totalWeight !== 100 && '(DENGELEYİN)'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                {[
                  { id: 'ethics', label: 'Etik Bütünlük Ağırlığı', desc: 'Sınır ihlali ve dürüstlük denetimi.' },
                  { id: 'clinical', label: 'Klinik Muhakeme Ağırlığı', desc: 'Vaka yönetimi ve metodolojik derinlik.' },
                  { id: 'experience', label: 'Deneyim Katsayısı', desc: 'Yıl ve çalışılan kurumların etkisi.' },
                  { id: 'fit', label: 'Kurumsal Uyum', desc: 'Hiyerarşi ve aidiyet potansiyeli.' }
                ].map(w => (
                  <div key={w.id} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{w.label}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{w.desc}</p>
                      </div>
                      <span className="text-xl font-black text-orange-600">%{config.aiWeights[w.id as keyof typeof config.aiWeights]}</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={config.aiWeights[w.id as keyof typeof config.aiWeights]} 
                      onChange={e => handleWeightChange(w.id as any, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Analiz Üretim Tonu</h5>
                <div className="flex flex-col gap-4">
                  {[
                    { id: 'strict', label: 'Rijit / Sorgulayıcı', desc: 'Risk odaklı, en küçük açığı dahi raporlar.' },
                    { id: 'balanced', label: 'Dengeli / Objektif', desc: 'Yetenek ve riskleri eşit oranda tartar.' },
                    { id: 'empathetic', label: 'Gelişim Odaklı', desc: 'Potansiyele odaklanır, yapıcı eleştiri sunar.' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => onUpdateConfig({...config, aiTone: t.id as any})}
                      className={`text-left p-6 rounded-[2rem] border-2 transition-all ${
                        config.aiTone === t.id 
                        ? 'bg-white border-orange-600 shadow-xl' 
                        : 'bg-transparent border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${config.aiTone === t.id ? 'text-orange-600' : 'text-slate-400'}`}>{t.label}</p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase">{t.desc}</p>
                    </button>
                  ))}
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
