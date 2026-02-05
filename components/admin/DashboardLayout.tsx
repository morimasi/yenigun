
import React, { useState, useEffect } from 'react';
import { Candidate, GlobalConfig, UserSession, StaffRole } from '../../types';
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

interface DashboardLayoutProps {
  candidates: Candidate[];
  config: GlobalConfig;
  user: UserSession | null;
  onUpdateCandidate: (c: Candidate) => void;
  onUpdateConfig: (conf: GlobalConfig) => void;
  onDeleteCandidate: (id: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  isProcessing: boolean;
  staffRefreshKey: number;
  setStaffRefreshKey: (k: number) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const userRole = props.user?.role || StaffRole.Staff;
  
  // Role göre başlangıç sekmesi
  const getDefaultTab = () => {
    if (userRole === StaffRole.Admin) return 'pipeline';
    if (userRole === StaffRole.Mentor) return 'calendar';
    return 'training';
  };

  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());
  
  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [userRole]);

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return userRole === StaffRole.Admin ? <PipelineView {...props} /> : <div className="p-20 text-center uppercase font-black text-slate-300">Yetkisiz Erişim</div>;
      case 'analytics': return <AnalyticsView candidates={props.candidates} config={props.config} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'decision': return userRole === StaffRole.Admin ? <DecisionSupportView candidates={props.candidates} config={props.config} /> : null;
      case 'methodology': return userRole === StaffRole.Admin ? <MethodologyInventoryView /> : null;
      case 'archive': return userRole === StaffRole.Admin ? <ArchiveView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} onDeleteCandidate={props.onDeleteCandidate} /> : null;
      case 'settings': return userRole === StaffRole.Admin ? <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} /> : null;
      case 'arms': return <ArmsDashboard refreshTrigger={props.staffRefreshKey} onRefresh={() => props.setStaffRefreshKey(Date.now())} />;
      case 'comm': return <CommunicationCenter candidates={props.candidates} />;
      case 'training': return <TrainingHub />;
      default: return <TrainingHub />;
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
          user={props.user}
          onLogout={props.onLogout}
        />
      </header>
      
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        <div className="h-10 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-40">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">HİS: {activeTab.toUpperCase()}</span>
              <div className="h-3 w-px bg-white/10"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">HOŞ GELDİNİZ, {props.user?.name.toUpperCase()}</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-white uppercase tracking-widest">SİSTEM ÇEVRİMİÇİ</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scroll-smooth bg-[#F1F5F9]">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
