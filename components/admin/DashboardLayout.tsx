
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
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in min-h-screen max-w-full mx-auto w-full relative pt-6 pb-12 px-4 md:px-8">
      {/* SOL KOMUTA MERKEZİ - Optimize edilmiş genişlik */}
      <aside className="no-print shrink-0">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </aside>
      
      {/* ANA İÇERİK KANVASI - Maksimum yayılım */}
      <main className="flex-1 w-full min-w-0">
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] p-4 md:p-8 min-h-[92vh] relative overflow-hidden flex flex-col">
          {/* Arka plan derinlik efekti */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-slate-50 rounded-full blur-[100px] -mr-80 -mt-80 opacity-40 pointer-events-none"></div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
