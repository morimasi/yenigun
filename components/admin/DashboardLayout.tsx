
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import AdminTopNav from './AdminTopNav';
import PipelineView from './PipelineView';
import AnalyticsView from './AnalyticsView';
import CalendarView from './CalendarView';
import SettingsView from './SettingsView';

interface DashboardLayoutProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'calendar' | 'settings'>('pipeline');

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20 max-w-[1600px] mx-auto w-full">
      {/* Üst Navigasyon Bloğu */}
      <AdminTopNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        institutionName={props.config.institutionName} 
      />
      
      {/* Ana İçerik Bloğu (Orta) */}
      <main className="flex-1 w-full min-w-0 px-2 md:px-0">
        <div className="bg-white/40 backdrop-blur-sm rounded-[4rem] border border-slate-100/50 p-2 md:p-6 shadow-inner min-h-[700px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
