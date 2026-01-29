
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
import ArmsDashboard from '../../features/staff-mentor/ArmsDashboard';
import CommunicationCenter from '../../features/communication/CommunicationCenter';

interface DashboardLayoutProps {
  candidates: Candidate[];
  config: GlobalConfig;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
  isProcessing: boolean;
  staffRefreshKey: number;
  setStaffRefreshKey: (k: number) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'calendar' | 'decision' | 'settings' | 'lab' | 'methodology' | 'archive' | 'arms' | 'comm'>('pipeline');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} config={props.config} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'decision': return <DecisionSupportView candidates={props.candidates} config={props.config} />;
      case 'lab': return <ClinicalLabView candidates={props.candidates} />;
      case 'methodology': return <MethodologyInventoryView />;
      case 'archive': return <ArchiveView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} onDeleteCandidate={props.onDeleteCandidate} />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      case 'arms': return <ArmsDashboard refreshTrigger={props.staffRefreshKey} onRefresh={() => props.setStaffRefreshKey(Date.now())} />;
      case 'comm': return <CommunicationCenter candidates={props.candidates} />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col animate-fade-in min-h-screen w-full bg-slate-50">
      {/* COMPACT NAV */}
      <header className="no-print w-full sticky top-0 z-[100] transition-all duration-300">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </header>
      
      {/* MINIMAL CONTENT CANVAS */}
      <main className="flex-1 w-full px-4 md:px-6 py-4">
        <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm min-h-[calc(100vh-6rem)] relative overflow-hidden flex flex-col w-full transition-all duration-200">
          <div className="relative z-10 flex-1 flex flex-col w-full h-full p-4 md:p-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
