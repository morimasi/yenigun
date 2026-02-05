
import React, { useState } from 'react';
import { BRANCH_QUESTIONS } from '../../constants';
import { Question } from '../../types';

const MethodologyInventoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CANDIDATE' | 'STAFF'>('CANDIDATE');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Record<string, Question[]>>(BRANCH_QUESTIONS);

  const handleUpdateWeight = (qid: string, category: string, value: number) => {
     // Derin güncelleme mantığı buraya gelir
     console.log(`Updating ${qid} -> ${category}: ${value}`);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-10rem)]">
      
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl flex justify-between items-center relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Nöral Envanter Stüdyosu</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">Akademik Muhakeme & Ağırlık Matrisi Editörü</p>
         </div>
         <div className="relative z-10 flex gap-4">
            <button 
              onClick={() => setActiveTab('CANDIDATE')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CANDIDATE' ? 'bg-orange-600 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
            >ADAY SORULARI</button>
            <button 
              onClick={() => setActiveTab('STAFF')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'STAFF' ? 'bg-orange-600 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
            >PERSONEL BATARYALARI</button>
         </div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
         
         {/* KATEGORİ LİSTESİ */}
         <div className="col-span-12 lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SORU GRUPLARI</h4>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
               {Object.keys(questions).map(catKey => (
                  <button key={catKey} className="w-full p-4 rounded-2xl text-left hover:bg-slate-50 text-[11px] font-black uppercase text-slate-600 border border-transparent hover:border-slate-100 transition-all flex justify-between items-center group">
                     <span>{catKey.replace('_', ' ')}</span>
                     <span className="bg-slate-100 px-2 py-1 rounded text-[9px] group-hover:bg-orange-600 group-hover:text-white transition-colors">{questions[catKey].length}</span>
                  </button>
               ))}
               <button className="w-full p-4 rounded-2xl text-left border-2 border-dashed border-slate-100 text-slate-300 text-[10px] font-black uppercase hover:border-orange-500 hover:text-orange-500 transition-all">+ YENİ GRUP EKLE</button>
            </div>
         </div>

         {/* SORU EDİTÖRÜ */}
         <div className="col-span-12 lg:col-span-9 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">İçerik Yapılandırma</h3>
               </div>
               <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">SİSTEME MÜHÜRLE (SAVE)</button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
               {questions['clinical_logic']?.slice(0, 5).map((q, idx) => (
                  <div key={idx} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group hover:border-orange-200 transition-all relative">
                     <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">SORU #{idx + 1}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400">📝</button>
                           <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-500">🗑️</button>
                        </div>
                     </div>
                     {/* @fix: Explicitly cast q.text to string for compatibility with textarea defaultValue expectations. */}
                     <textarea 
                        className="w-full bg-transparent border-none text-lg font-black text-slate-800 uppercase tracking-tight outline-none resize-none mb-6 focus:text-orange-600 transition-colors"
                        defaultValue={(q.text as string)}
                     />
                     
                     <div className="space-y-4">
                        {q.weightedOptions?.map((opt, oIdx) => (
                           <div key={oIdx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                              <input className="flex-1 text-xs font-bold text-slate-600 border-none outline-none bg-transparent" defaultValue={opt.label} />
                              <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                              <div className="flex gap-6 items-center">
                                 {Object.entries(opt.weights).map(([wKey, wVal]) => (
                                    <div key={wKey} className="flex flex-col items-center">
                                       <span className="text-[8px] font-black text-slate-300 uppercase mb-1">{wKey.substring(0,3)}</span>
                                       <input 
                                          type="number" 
                                          step="0.1" 
                                          className="w-12 bg-slate-50 rounded p-1 text-[10px] font-black text-center text-orange-600 border border-slate-100" 
                                          defaultValue={wVal} 
                                       />
                                    </div>
                                 ))}
                              </div>
                              <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                              <div className="w-48">
                                 <span className="text-[8px] font-black text-slate-300 uppercase block mb-1">AI INSIGHT TAG</span>
                                 <input className="w-full text-[9px] font-bold text-slate-400 italic border-none outline-none" defaultValue={opt.analysisInsight} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
               <button className="w-full py-8 border-4 border-dashed border-slate-50 rounded-[3rem] text-slate-200 text-2xl font-black uppercase hover:border-orange-500 hover:text-orange-500 transition-all">+ YENİ SORU ENJEKTE ET</button>
            </div>
         </div>

      </div>
    </div>
  );
};

export default MethodologyInventoryView;
