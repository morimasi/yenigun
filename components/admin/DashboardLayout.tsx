
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
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'calendar' | 'decision' | 'settings' | 'lab' | 'methodology'>('pipeline');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'decision': return <DecisionSupportView candidates={props.candidates} config={props.config} />;
      case 'lab': return <ClinicalLabView candidates={props.candidates} />;
      case 'methodology': return <MethodologyInventoryView />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in min-h-screen w-full relative">
      {/* ÜST KOMUTA MERKEZİ (ARTIK YATAY) */}
      <header className="no-print w-full sticky top-0 z-[70] px-4">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </header>
      
      {/* ANA İÇERİK KANVASI - PANORAMİK YAYILIM */}
      <main className="flex-1 w-full px-2 md:px-4 pb-8">
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.05)] p-2 md:p-10 min-h-[90vh] relative overflow-hidden flex flex-col w-full">
          {/* Arka plan derinlik efekti */}
          <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-slate-50 rounded-full blur-[120px] -mr-96 -mt-96 opacity-40 pointer-events-none"></div>
          
          <div className="relative z-10 flex-1 flex flex-col w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
