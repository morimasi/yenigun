
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import AdminTopNav from './AdminTopNav';
import PipelineView from '../../features/academic-pipeline/PipelineView';
import AnalyticsView from './AnalyticsView';
import CalendarView from './CalendarView';
import SettingsView from './SettingsView';
import DecisionSupportView from './DecisionSupportView';
import ClinicalLabView from '../../features/clinical-lab/ClinicalLabView';
import MethodologyInventoryView from './MethodologyInventoryView';
import ArchiveView from './ArchiveView';

interface DashboardLayoutProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
  isProcessing: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'calendar' | 'decision' | 'settings' | 'lab' | 'methodology' | 'archive'>('pipeline');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'decision': return <DecisionSupportView candidates={props.candidates} config={props.config} />;
      case 'lab': return <ClinicalLabView candidates={props.candidates} />;
      case 'methodology': return <MethodologyInventoryView />;
      case 'archive': return <ArchiveView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} onDeleteCandidate={props.onDeleteCandidate} />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col gap-1 animate-fade-in min-h-screen w-full relative">
      <header className="no-print w-full sticky top-20 md:top-24 z-[90] px-1 md:px-2 transition-all duration-300">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </header>
      
      <main className="flex-1 w-full px-1 md:px-2 pb-8 mt-4">
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-1 md:p-6 min-h-[92vh] relative overflow-hidden flex flex-col w-full transition-all">
          <div className="absolute top-0 right-0 w-[70rem] h-[70rem] bg-orange-50 rounded-full blur-[150px] -mr-[30rem] -mt-[30rem] opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 flex-1 flex flex-col w-full h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
