
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import AdminTopNav from './AdminTopNav'; // Artık Header görevi görüyor
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
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* ÜST KOMUTA BARI (Expanded Height & High Z-Index) */}
      <header className="shrink-0 z-[100] h-32 transition-all duration-500 shadow-2xl relative">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </header>
      
      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        {/* Alt Bilgi Barı (Context Strip) */}
        <div className="h-8 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-40">
           <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              <span className="text-slate-300">MODÜL:</span>
              <span className="text-orange-600">{activeTab.toUpperCase()}</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] font-bold text-slate-400 tracking-widest">VERİ AKIŞI: ONLINE</span>
           </div>
        </div>

        {/* Dinamik İçerik Sahnesi */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth bg-[#F8FAFC]">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
