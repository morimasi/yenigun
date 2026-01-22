
import React, { useState } from 'react';
import { Candidate, GlobalConfig } from '../../types';
import AdminTopNav from './AdminTopNav';
import PipelineView from './PipelineView';
import AnalyticsView from './AnalyticsView';
import CalendarView from './CalendarView';
import SettingsView from './SettingsView';
import { exportService } from '../../services/exportService';

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
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'calendar' | 'settings'>('pipeline');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExportAll = async () => {
    if (props.candidates.length === 0) {
      alert("Dışa aktarılacak aday bulunmamaktadır.");
      return;
    }

    if (!confirm(`${props.candidates.length} adayın analizi PDF olarak bir ZIP dosyasında toplanacaktır. Devam edilsin mi?`)) {
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      await exportService.exportAllCandidatesAsZip(props.candidates, (p) => setExportProgress(p));
    } catch (error: any) {
      console.error("Export Error:", error);
      alert(`Dışa aktarma hatası: ${error.message}`);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineView {...props} />;
      case 'analytics': return <AnalyticsView candidates={props.candidates} />;
      case 'calendar': return <CalendarView candidates={props.candidates} onUpdateCandidate={props.onUpdateCandidate} />;
      case 'settings': return <SettingsView config={props.config} onUpdateConfig={props.onUpdateConfig} />;
      default: return <PipelineView {...props} />;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20 max-w-[1600px] mx-auto w-full relative">
      {isExporting && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-8 no-print">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center space-y-8 animate-scale-in">
             <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl animate-bounce">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </div>
             <div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">ARŞİV OLUŞTURULUYOR</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">PDF Raporları İşleniyor</p>
             </div>
             <div className="space-y-3">
               <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full bg-orange-600 transition-all duration-500 ease-out" style={{ width: `${exportProgress}%` }}></div>
               </div>
               <p className="text-xl font-black text-orange-600 tracking-widest">%{exportProgress}</p>
             </div>
          </div>
        </div>
      )}

      <AdminTopNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        institutionName={props.config.institutionName}
        onExportAll={handleExportAll}
        isExporting={isExporting}
        onRefresh={props.onRefresh}
        isProcessing={props.isProcessing}
      />
      
      <main className="flex-1 w-full min-w-0 px-2 md:px-0">
        <div className="bg-white/40 backdrop-blur-sm rounded-[4rem] border border-slate-100/50 p-2 md:p-6 shadow-inner min-h-[700px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
