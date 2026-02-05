
import React, { useState } from 'react';
import { Candidate, GlobalConfig, UserSession } from '../../types';
import AdminTopNav from './AdminTopNav';
import PipelineView from './PipelineView';
import AnalyticsView from './AnalyticsView';
import CalendarView from './CalendarView';
import SettingsView from './SettingsView';
import DecisionSupportView from './DecisionSupportView';
import MethodologyInventoryView from './MethodologyInventoryView';
import ArchiveView from './ArchiveView';
import AdminDashboard from './AdminDashboard';
import ArmsDashboard from '../../features/staff-mentor/ArmsDashboard';

// @fix: Added 'user' property to DashboardLayoutProps to resolve mismatch with App.tsx and enable session-aware UI.
interface DashboardLayoutProps {
  candidates: Candidate[];
  config: GlobalConfig;
  user: UserSession | null;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
  isProcessing: boolean;
  staffRefreshKey: number;
  setStaffRefreshKey: (k: number) => void;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>('pipeline');

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} config={props.config} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'decision': return <DecisionSupportView candidates={props.candidates} config={props.config} />;
      case 'methodology': return <MethodologyInventoryView />;
      case 'archive': return <ArchiveView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} onDeleteCandidate={props.onDeleteCandidate} />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      case 'admin_dashboard': return <AdminDashboard {...props} />;
      case 'arms': return <ArmsDashboard />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden text-sm">
      <header className="shrink-0 z-[100] h-14">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </header>
      
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        <div className="h-10 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-40">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">SİSTEM KONTROL MODÜLÜ: {activeTab.toUpperCase()}</span>
              <div className="h-3 w-px bg-white/10"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AKADEMİK DENETİM AKTİF</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-white uppercase tracking-widest">VERİ HATTI GÜVENLİ</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
