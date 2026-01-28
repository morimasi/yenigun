
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FORM_STEPS, BRANCH_QUESTIONS, CERTIFICATIONS, CERTIFICATION_CATEGORIES, TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../../constants';
import { Branch, Candidate, Gender, MaritalStatus, Question, Certification } from '../../types';
import { SearchableSelect } from '../../shared/ui/SearchableSelect';

interface CandidateFormProps {
  onSubmit: (candidate: Omit<Candidate, 'id' | 'timestamp' | 'report'>) => void;
}

const shuffleArray = (array: string[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeCertCategory, setActiveCertCategory] = useState(CERTIFICATION_CATEGORIES[0].id);
  const [certSearch, setCertSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 22,
    gender: 'Belirtilmemiş' as Gender,
    maritalStatus: 'Bekar' as MaritalStatus,
    branch: Branch.OzelEgitim,
    university: '',
    department: '',
    experienceYears: 0,
    previousInstitutions: '',
    allTrainings: [] as string[],
    cvData: undefined as Candidate['cvData'] | undefined,
    answers: {} as Record<string, string | string[]>,
    status: 'pending' as const
  });

  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<string, string[]>>({});

  const progress = useMemo(() => ((currentStep + 1) / FORM_STEPS.length) * 100, [currentStep]);

  const currentQuestions = useMemo(() => {
    const stepId = FORM_STEPS[currentStep].id;
    let baseQuestions = [...(BRANCH_QUESTIONS[stepId] || [])];
    
    if (stepId === 'clinical_logic') {
      const trainingQuestions = CERTIFICATIONS
        .filter(cert => formData.allTrainings.includes(cert.label))
        .flatMap(cert => cert.verificationQuestions);
      
      baseQuestions = [...baseQuestions, ...trainingQuestions];
    }

    return baseQuestions.filter((q: Question) => {
      if (!q.requiredBranch || q.requiredBranch.length === 0) return true;
      return q.requiredBranch.includes(formData.branch);
    });
  }, [currentStep, formData.branch, formData.allTrainings]);

  useEffect(() => {
    const newMap: Record<string, string[]> = {};
    currentQuestions.forEach(q => {
      if (q.type === 'radio') {
        const labels = q.weightedOptions ? q.weightedOptions.map(o => o.label) : (q.options || []);
        if (labels.length > 0) {
          newMap[q.id] = shuffleArray(labels);
        }
      }
    });
    setShuffledOptionsMap(prev => ({ ...prev, ...newMap }));
  }, [currentQuestions]);

  const toggleTraining = (training: string) => {
    setFormData(prev => ({
      ...prev,
      allTrainings: prev.allTrainings.includes(training)
        ? prev.allTrainings.filter(t => t !== training)
        : [...prev.allTrainings, training]
    }));
  };

  const handleNext = () => {
    const stepId = FORM_STEPS[currentStep].id;
    if (stepId === 'personal') {
      if (!formData.name || !formData.email || !formData.phone || !formData.university) {
        alert("Lütfen temel akademik ve profil bilgilerinizi eksiksiz giriniz.");
        return;
      }
    } else {
      const unanswered = currentQuestions.filter((q: Question) => !formData.answers[q.id]);
      if (unanswered.length > 0) {
        alert("Analizi tamamlamak için tüm klinik soruları yanıtlamanız gerekmektedir.");
        return;
      }
    }

    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit(formData as any);
    }
  };

  const filteredCerts = useMemo(() => {
    return CERTIFICATIONS.filter(c => {
      const matchesCat = c.category === activeCertCategory;
      const matchesSearch = c.label.toLowerCase().includes(certSearch.toLowerCase()) || 
                           c.description.toLowerCase().includes(certSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCertCategory, certSearch]);

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];

    if (step.id === 'personal') {
      return (
        <div className="space-y-12 animate-fade-in pb-16">
          {/* ÜST PANEL: DEMOGRAFİK MATRİS */}
          <div className="bg-slate-950 p-10 md:p-16 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden group">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h3 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.5em]">01. TEMEL PROFİL VERİLERİ</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">İletişim Hattı</label>
                    <input type="tel" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-600 transition-all text-white" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="05xx xxx xx xx" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Yaş Faktörü</label>
                    <input type="number" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-600 text-white" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Saha Deneyimi (Yıl)</label>
                    <input type="number" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-600 text-white" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Klinik Branş</label>
                    <select className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-600 text-white appearance-none" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}>
                      {Object.values(Branch).map(b => <option key={b} value={b} className="text-slate-900">{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Eski Akademik Kurumlar</label>
                    <input type="text" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-600 text-white" value={formData.previousInstitutions} onChange={(e) => setFormData({...formData, previousInstitutions: e.target.value})} placeholder="X Vakfı, Y Rehabilitasyon Merkezi..." />
                  </div>
               </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-[40rem] h-[40rem] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none"></div>
          </div>

          {/* AKADEMİK KİMLİK PANELİ */}
          <div className="bg-white p-10 md:p-16 rounded-[4.5rem] border border-slate-100 shadow-2xl relative">
             <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em]">02. AKADEMİK KİMLİK & AKREDİTASYON</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 border-b border-slate-50 pb-16">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Resmi Ad Soyad</label>
                   <input type="text" className="w-full rounded-[2rem] border-2 border-slate-50 p-6 font-bold bg-slate-50/30 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Adınız Soyadınız" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">E-Posta Adresi</label>
                   <input type="email" className="w-full rounded-[2rem] border-2 border-slate-50 p-6 font-bold bg-slate-50/30 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="akademi@yenigun.com" />
                </div>
                <SearchableSelect label="MEZUN OLUNAN ÜNİVERSİTE" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
                <SearchableSelect label="BÖLÜM / ANABİLİM DALI" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
             </div>

             {/* SERTİFİKA HAVUZU: MODERN DASHBOARD DESIGN */}
             <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                
                {/* SOL: DİKEY KATEGORİ SİDEBAR */}
                <div className="xl:col-span-3 space-y-3">
                   <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 ml-2">UZMANLIK ALANLARI</h5>
                   <div className="grid grid-cols-1 gap-2">
                      {CERTIFICATION_CATEGORIES.map(cat => (
                        <button 
                          key={cat.id} 
                          type="button" 
                          onClick={() => setActiveCertCategory(cat.id)}
                          className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all text-left relative overflow-hidden group ${
                            activeCertCategory === cat.id 
                            ? 'bg-slate-900 text-white shadow-2xl scale-[1.03] z-10' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                           <span className="text-xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                           <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${activeCertCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>
                             {cat.label}
                           </span>
                           {activeCertCategory === cat.id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,1)]"></div>}
                        </button>
                      ))}
                   </div>
                </div>

                {/* SAĞ: İNTERAKTİF SERTİFİKA IZGARASI */}
                <div className="xl:col-span-9 space-y-8">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50 p-4 rounded-[2.5rem] border border-slate-100">
                      <div className="flex-1 w-full relative">
                         <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                         <input 
                           type="text" 
                           placeholder="Akreditasyon veya Eğitim sorgula..." 
                           className="w-full bg-white rounded-[2rem] p-5 pl-16 font-bold text-[13px] outline-none border border-transparent focus:border-orange-500 transition-all shadow-sm"
                           value={certSearch}
                           onChange={e => setCertSearch(e.target.value)}
                         />
                      </div>
                      <div className="px-8 py-4 bg-white rounded-2xl border border-slate-100 whitespace-nowrap">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEÇİLEN: </span>
                         <span className="text-[13px] font-black text-orange-600">{formData.allTrainings.length}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCerts.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-20 border-2 border-dashed border-slate-200 rounded-[3rem]">
                           <p className="text-xl font-black uppercase tracking-[0.5em]">Sonuç Bulunamadı</p>
                        </div>
                      ) : (
                        filteredCerts.map(cert => {
                          const isSelected = formData.allTrainings.includes(cert.label);
                          return (
                            <button 
                              key={cert.id} 
                              type="button" 
                              onClick={() => toggleTraining(cert.label)} 
                              className={`p-8 rounded-[2.5rem] text-left transition-all border-2 relative overflow-hidden group ${
                                isSelected 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-3xl scale-[1.03] z-10' 
                                : 'bg-white border-slate-50 text-slate-400 hover:border-orange-200 hover:shadow-xl'
                              }`}
                            >
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                   <div className={`px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest ${isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                      {cert.id.includes('intl') || cert.id.includes('aba') || cert.id.includes('dir') ? 'Uluslararası' : 'Milli/Yerel'}
                                   </div>
                                </div>
                                <p className="text-[13px] font-black uppercase tracking-tight mb-3 pr-8 leading-tight">{cert.label}</p>
                                <p className={`text-[10px] font-bold leading-relaxed transition-colors ${isSelected ? 'text-slate-400' : 'text-slate-300'}`}>{cert.description}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-6 right-6 text-orange-500 animate-scale-in">
                                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </div>
                              )}
                              <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[40px] opacity-10 transition-all duration-700 ${isSelected ? 'bg-orange-500 scale-150' : 'bg-slate-100 group-hover:bg-orange-200'}`}></div>
                            </button>
                          );
                        })
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-10 animate-fade-in pb-16">
        {currentQuestions.map((q: Question, idx: number) => (
          <div key={q.id} className="bg-white p-10 md:p-16 rounded-[4.5rem] border border-slate-100 shadow-3xl relative overflow-hidden group">
            <div className="flex items-start gap-8 mb-12">
              <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-3xl border border-slate-800">
                {idx + 1}
              </div>
              <h4 className="text-3xl md:text-5xl font-black text-slate-900 leading-[0.9] tracking-tighter pt-2 uppercase italic">
                {q.text}
              </h4>
            </div>
            <div className="pl-0 md:pl-24">
              {q.type === 'radio' && (
                <div className="grid grid-cols-1 gap-4">
                  {(shuffledOptionsMap[q.id] || []).map((opt: string) => (
                    <button 
                      key={opt} 
                      onClick={() => setFormData(prev => ({ ...prev, answers: { ...prev.answers, [q.id]: opt } }))} 
                      className={`text-left p-10 rounded-[3rem] border-2 transition-all font-black text-[16px] uppercase tracking-tight leading-snug ${
                        formData.answers[q.id] === opt 
                        ? 'bg-orange-600 border-orange-600 text-white shadow-3xl scale-[1.02] z-10' 
                        : 'bg-slate-50/50 border-slate-50 text-slate-400 hover:border-orange-500 hover:bg-white hover:shadow-2xl'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="absolute -right-20 -bottom-20 w-[30rem] h-[30rem] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-orange-600/10 transition-colors duration-1000"></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      <div className="bg-white/95 backdrop-blur-3xl rounded-[5rem] shadow-[0_60px_150px_rgba(0,0,0,0.12)] overflow-hidden border border-white relative">
        <div className="bg-slate-950 p-12 md:p-20 text-white relative">
          <div className="absolute right-0 top-0 w-[50rem] h-[50rem] bg-orange-600/10 rounded-full blur-[150px] -mr-40 -mt-40"></div>
          <div className="max-w-5xl relative z-10">
            <div className="flex items-center gap-6 mb-12">
               <div className="px-6 py-2.5 bg-orange-600 text-[12px] font-black uppercase rounded-2xl tracking-[0.2em] shadow-2xl">ETAP {currentStep + 1} / {FORM_STEPS.length}</div>
               <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-orange-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(234,88,12,0.8)]" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-6 leading-[0.8] italic group cursor-default">
               {FORM_STEPS[currentStep].title}
               <span className="inline-block w-4 h-4 md:w-8 md:h-8 bg-orange-600 rounded-full ml-6 group-hover:scale-150 transition-transform"></span>
            </h1>
            <p className="text-slate-400 font-bold text-sm md:text-xl uppercase tracking-[0.5em] opacity-80 leading-relaxed max-w-4xl">{FORM_STEPS[currentStep].description}</p>
          </div>
        </div>
        
        <div className="p-8 md:p-24 min-h-[800px] bg-[#FDFDFD] relative">
          {renderStepContent()}
        </div>

        <div className="p-12 md:p-20 bg-white border-t border-slate-50 flex justify-between items-center sticky bottom-0 z-50 backdrop-blur-3xl bg-white/90">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
            className={`px-12 py-7 font-black text-[12px] uppercase tracking-[0.3em] transition-all rounded-[2rem] ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-950 hover:bg-slate-50'}`}
          >
            ← GERİ DÖN
          </button>
          <button 
            onClick={handleNext} 
            className="px-16 md:px-32 py-7 bg-slate-950 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.5em] hover:bg-orange-600 transition-all shadow-3xl active:scale-95 hover:-translate-y-1"
          >
            {currentStep === FORM_STEPS.length - 1 ? 'MÜHÜRLE VE GÖNDER' : 'SONRAKİ ETAP →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
