
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
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in min-h-[90vh] max-w-[1700px] mx-auto w-full relative">
      {/* SOL DİKEY KOMUTA DOCK'I */}
      <aside className="no-print">
        <AdminTopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          institutionName={props.config.institutionName}
          onRefresh={props.onRefresh}
          isProcessing={props.isProcessing}
        />
      </aside>
      
      {/* ANA İÇERİK KANVASI */}
      <main className="flex-1 w-full min-w-0">
        {/* ÜST ARAÇ ÇUBUĞU (Mobil ve Refresh için) */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{props.config.institutionName}</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-[3rem] border border-slate-200/50 p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] min-h-screen">
          {renderContent()}
        </div>
      </main>

      {/* FLOATING REFRESH BUTTON (Desktop only) */}
      <div className="fixed top-32 right-12 z-[70] hidden lg:block no-print">
         <button
            onClick={props.onRefresh}
            disabled={props.isProcessing}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white shadow-2xl transition-all hover:bg-orange-600 group active:scale-90 ${props.isProcessing ? 'opacity-70 rotate-180' : ''}`}
            title="Sistemi Tazele"
         >
            <svg className={`w-6 h-6 text-orange-500 transition-transform duration-700 ${props.isProcessing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
            </svg>
            <span className="text-[7px] font-black uppercase mt-1 tracking-tighter text-white opacity-40 group-hover:opacity-100">TAZELA</span>
         </button>
      </div>
    </div>
  );
};

export default DashboardLayout;
