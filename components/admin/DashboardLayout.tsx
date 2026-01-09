
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import Sidebar from './Sidebar';
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
    <div className="flex flex-col xl:flex-row gap-10 animate-fade-in pb-20 max-w-[1600px] mx-auto">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        institutionName={props.config.institutionName} 
      />
      <main className="flex-1 min-w-0">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;
