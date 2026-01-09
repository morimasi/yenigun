
import React from 'react';
import { GlobalConfig } from '../../types';

interface SettingsViewProps {
  config: GlobalConfig;
  onUpdateConfig: (conf: GlobalConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  return (
    <div className="bg-white p-16 rounded-[4rem] shadow-xl border border-slate-100 space-y-10 animate-fade-in">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Kurumsal Ayarlar</h3>
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Kurum Adı</label>
          <input 
            type="text" className="w-full p-6 rounded-3xl bg-slate-50 font-bold border-none outline-none" 
            value={config.institutionName} 
            onChange={e => onUpdateConfig({...config, institutionName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">E-Posta Bildirim</label>
          <input 
            type="email" className="w-full p-6 rounded-3xl bg-slate-50 font-bold border-none outline-none" 
            value={config.notificationEmail} 
            onChange={e => onUpdateConfig({...config, notificationEmail: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
