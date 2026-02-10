
import React, { useState, useMemo, useEffect } from 'react';
import { BRANCH_QUESTIONS } from '../../constants';
import { MODULAR_BATTERIES } from '../../features/staff-mentor/assessmentData';
import { Question, AssessmentBattery, AssessmentQuestion, UniversalExportData } from '../../types';
import ExportStudio from '../shared/ExportStudio';

type InventoryTarget = 'CANDIDATE' | 'STAFF';

const MethodologyInventoryView: React.FC = () => {
  const [targetType, setTargetType] = useState<InventoryTarget>('CANDIDATE');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const candidateQuestions = useMemo(() => Object.values(BRANCH_QUESTIONS).flat(), []);
  const staffBatteries = MODULAR_BATTERIES;

  const currentQuestions = useMemo(() => {
    if (targetType === 'CANDIDATE') {
      return activeCategoryId ? candidateQuestions.filter(q => q.category === activeCategoryId) : [];
    } else {
      return staffBatteries.find(b => b.id === activeCategoryId)?.questions || [];
    }
  }, [targetType, activeCategoryId, candidateQuestions]);

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden relative">
      
      {isExportOpen && (
        <ExportStudio 
          onClose={() => setIsExportOpen(false)}
          data={{
            type: 'INVENTORY_RECAP',
            entityName: activeCategoryId || 'Tüm Envanter',
            referenceId: `INV-${Date.now().toString().slice(-6)}`,
            payload: { questions: currentQuestions, type: targetType },
            config: { title: 'KURUMSAL DEĞERLENDİRME VE SORU ENVANTERİ' }
          }}
        />
      )}

      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 no-print">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Akademik Envanter</h3>
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
               <button onClick={() => { setTargetType('CANDIDATE'); setActiveCategoryId(null); }} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'CANDIDATE' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Aday</button>
               <button onClick={() => { setTargetType('STAFF'); setActiveCategoryId(null); }} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${targetType === 'STAFF' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Personel</button>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {(targetType === 'CANDIDATE' ? ['technicalExpertise', 'workEthics', 'pedagogicalAnalysis', 'sustainability', 'institutionalLoyalty'] : staffBatteries.map(b => b.id)).map(id => (
               <button key={id} onClick={() => setActiveCategoryId(id)} className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${activeCategoryId === id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-500 hover:border-orange-200'}`}>
                  <p className="text-[10px] font-black uppercase truncate">{id.replace(/_/g, ' ')}</p>
               </button>
            ))}
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeCategoryId || 'Kategori Seçiniz'}</h4>
           <button 
             onClick={() => setIsExportOpen(true)}
             disabled={!activeCategoryId}
             className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-20"
           >
              ENVANTERİ YAYINLA / YAZDIR
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-50">
           {currentQuestions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                 <p className="text-xl font-black uppercase tracking-[0.5em]">Veri Filtreleniyor</p>
              </div>
           ) : (
             currentQuestions.map((q, idx) => (
               <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-4">
                  <div className="flex gap-4">
                     <span className="text-2xl font-black text-slate-200">{idx + 1}</span>
                     <p className="text-lg font-bold text-slate-800 uppercase leading-snug">"{q.text}"</p>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default MethodologyInventoryView;
