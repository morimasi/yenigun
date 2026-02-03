
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import AdminTopNav from './AdminTopNav';
import PipelineView from '../../features/academic-pipeline/PipelineView';
import AnalyticsView from './AnalyticsView';
import CalendarView from './CalendarView';
import SettingsView from './SettingsView';
import DecisionSupportView from './DecisionSupportView';
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
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'calendar' | 'decision' | 'settings' | 'methodology' | 'archive' | 'arms' | 'comm'>('pipeline');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} config={props.config} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'decision': return <DecisionSupportView candidates={props.candidates} config={props.config} />;
      case 'methodology': return <MethodologyInventoryView />;
      case 'archive': return <ArchiveView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} onDeleteCandidate={props.onDeleteCandidate} />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      case 'arms': return <ArmsDashboard refreshTrigger={props.staffRefreshKey} onRefresh={() => props.setStaffRefreshKey(Date.now())} />;
      case 'comm': return <CommunicationCenter candidates={props.candidates} />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden text-sm">
      <header className="shrink-0 z-[100] h-14 bg-white border-b border-slate-200 shadow-sm relative">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </header>
      
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        <div className="h-6 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-40 text-[10px]">
           <div className="flex items-center gap-2 font-bold text-slate-500 uppercase tracking-widest">
              <span className="text-slate-400">MODÜL:</span>
              <span className="text-orange-600">{activeTab.toUpperCase()}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
              <span className="font-bold text-slate-400 tracking-widest">SİSTEM: HAZIR</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scroll-smooth bg-[#F1F5F9]">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
