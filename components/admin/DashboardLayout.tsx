
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
import TrainingHub from '../../features/training/TrainingHub';
import AdminPanel from './AdminPanel';
import { SmartBackButton } from '../shared/SmartBackButton';

type AdminTab = 'pipeline' | 'analytics' | 'calendar' | 'decision' | 'settings' | 'methodology' | 'archive' | 'arms' | 'comm' | 'training' | 'admin';

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
  onExit: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('pipeline');
  const [tabHistory, setTabHistory] = useState<AdminTab[]>([]);
  
  const navigateToTab = (nextTab: AdminTab) => {
    if (activeTab !== nextTab) {
      setTabHistory(prev => [...prev, activeTab]);
      setActiveTab(nextTab);
    }
  };

  const handleBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(prev => prev.slice(0, -1));
      setActiveTab(prevTab);
    } else {
      props.onExit();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} config={props.config} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'decision': return <DecisionSupportView candidates={props.candidates} config={props.config} onRefresh={props.onRefresh} />;
      case 'methodology': return <MethodologyInventoryView />;
      case 'archive': return <ArchiveView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} onDeleteCandidate={props.onDeleteCandidate} />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      case 'arms': return <ArmsDashboard refreshTrigger={props.staffRefreshKey} onRefresh={() => props.setStaffRefreshKey(Date.now())} />;
      case 'comm': return <CommunicationCenter candidates={props.candidates} />;
      case 'training': return <TrainingHub />;
      case 'admin': return <AdminPanel candidates={props.candidates} onRefresh={props.onRefresh} config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden text-sm">
      <header className="shrink-0 z-[1000] h-14 bg-white border-b border-slate-200 shadow-sm relative">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={navigateToTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </header>
      
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        <div className="h-10 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-40">
           <div className="flex items-center gap-4">
              <SmartBackButton onClick={handleBack} label="GERİ" className="scale-75 origin-left" />
              <div className="flex items-center gap-2 font-bold text-slate-500 uppercase tracking-widest text-[10px]">
                 <span className="text-slate-400">MODÜL:</span>
                 <span className="text-orange-600">{activeTab.toUpperCase()}</span>
              </div>
           </div>
           <div className="flex items-center gap-2 text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-slate-400 tracking-widest uppercase">Akademi Hub Aktif</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scroll-smooth bg-[#F1F5F9] relative z-0">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
