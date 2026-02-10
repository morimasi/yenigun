
import React, { useState, useMemo } from 'react';
import { Candidate, ArchiveCategory } from '../../types';
import ExportStudio from '../shared/ExportStudio';

interface ArchiveViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

const VAULT_CATEGORIES: Record<ArchiveCategory, { label: string, color: string, icon: string }> = {
  CANDIDATE_POOL: { label: 'Yetenek Havuzu', color: 'emerald', icon: '💎' },
  HIRED_CONTRACTED: { label: 'Kadroya Alınanlar', color: 'blue', icon: '✅' },
  DISQUALIFIED: { label: 'Disfalifiye', color: 'slate', icon: '📁' },
  BLACK_LIST: { label: 'Yasaklılar', color: 'rose', icon: '🚫' },
  STAFF_HISTORY: { label: 'Eski Kadro', color: 'indigo', icon: '🏛️' },
  TALENT_POOL_ANALYTICS: { label: 'Karar Analitiği', color: 'orange', icon: '⚖️' },
  TRAINING_LIBRARY: { label: 'Eğitim Deposu', color: 'purple', icon: '📚' },
  PERFORMANCE_SNAPSHOT: { label: 'Performans İzi', color: 'pink', icon: '📊' },
  STRATEGIC_PLAN: { label: 'Strateji Odası', color: 'cyan', icon: '🛰️' },
  CLINICAL_CASE_STUDY: { label: 'Vaka Analizi', color: 'amber', icon: '🔬' }
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ candidates, onUpdateCandidate, onDeleteCandidate }) => {
  const [activeTab, setActiveTab] = useState<ArchiveCategory>('CANDIDATE_POOL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const archivedItems = useMemo(() => candidates.filter(c => c.status === 'archived'), [candidates]);
  const filteredItems = useMemo(() => archivedItems.filter(item => item.archiveCategory === activeTab && item.name.toLowerCase().includes(searchTerm.toLowerCase())), [archivedItems, activeTab, searchTerm]);
  const selectedItem = archivedItems.find(i => i.id === selectedId);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-50 animate-fade-in overflow-hidden">
      
      {isExportOpen && selectedItem && (
        <ExportStudio 
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'ARCHIVE',
            entityName: selectedItem.name,
            referenceId: selectedItem.id,
            payload: selectedItem,
            config: { title: `MÜHÜRLÜ ARŞİV KAYDI: ${VAULT_CATEGORIES[activeTab].label.toUpperCase()}` }
          }}
        />
      )}

      <div className="bg-slate-900 p-6 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black">A</div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Dijital Arşiv Kasası</h2>
         </div>
         <input type="text" placeholder="Arşivde Ara..." className="bg-white/10 border border-white/5 rounded-xl py-2 px-4 text-xs font-bold text-white outline-none focus:bg-white/20 w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="flex-1 flex overflow-hidden">
         <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 py-4 px-4 gap-1.5 overflow-y-auto">
            {(Object.entries(VAULT_CATEGORIES) as [ArchiveCategory, any][]).map(([key, cfg]) => (
               <button key={key} onClick={() => { setActiveTab(key); setSelectedId(null); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === key ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <span className="text-lg">{cfg.icon}</span>
                  <span className="text-[10px] font-black uppercase truncate">{cfg.label}</span>
               </button>
            ))}
         </div>

         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white">
            <div className="lg:col-span-4 border-r border-slate-50 overflow-y-auto">
               {filteredItems.map(item => (
                  <div key={item.id} onClick={() => setSelectedId(item.id)} className={`p-5 border-b border-slate-50 cursor-pointer transition-all ${selectedId === item.id ? 'bg-orange-50/50 border-l-4 border-l-orange-600' : ''}`}>
                     <h4 className="text-[12px] font-black text-slate-900 uppercase truncate">{item.name}</h4>
                     <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{item.branch}</p>
                  </div>
               ))}
            </div>
            <div className="lg:col-span-8 flex flex-col overflow-hidden p-12">
               {selectedItem ? (
                  <div className="animate-fade-in space-y-10">
                     <div className="flex justify-between items-center">
                        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{selectedItem.name}</h3>
                        <button onClick={() => setIsExportOpen(true)} className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-slate-950 transition-all">BELGEYİ YAZDIR / İNDİR</button>
                     </div>
                     <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-4">ARŞİV NOTU VE GEREKÇE</span>
                        <p className="text-lg font-bold text-slate-700 leading-relaxed italic">"{selectedItem.archiveNote || 'Kurumsal standartlar gereği mühürlü dijital kayda alınmıştır.'}"</p>
                     </div>
                  </div>
               ) : (
                  <div className="h-full flex items-center justify-center opacity-10 grayscale"><h3 className="text-4xl font-black uppercase tracking-[0.5em]">Mühürlü Kayıt Seçiniz</h3></div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ArchiveView;
