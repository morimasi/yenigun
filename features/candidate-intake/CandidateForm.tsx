
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
        alert("Temel bilgilerinizi eksiksiz doldurunuz.");
        return;
      }
    } else {
      const unanswered = currentQuestions.filter((q: Question) => !formData.answers[q.id]);
      if (unanswered.length > 0) {
        alert("Lütfen tüm soruları yanıtlayınız.");
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
      const matchesSearch = c.label.toLowerCase().includes(certSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCertCategory, certSearch]);

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];

    if (step.id === 'personal') {
      return (
        <div className="space-y-6 animate-fade-in">
          {/* KOMPAKT PROFİL PANELİ */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Temel Kimlik & Klinik Branş</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tam Ad Soyad</label>
                <input type="text" className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Örn: Ahmet Yılmaz" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">E-Posta</label>
                <input type="email" className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="ornek@mail.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">İletişim</label>
                <input type="tel" className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="05XX" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Klinik Branş</label>
                <select className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm font-bold outline-none" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}>
                  {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Deneyim (Yıl)</label>
                <input type="number" className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm font-bold" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Yaş</label>
                <input type="number" className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm font-bold" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableSelect label="Üniversite" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
              <SearchableSelect label="Bölüm" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
            </div>
          </div>

          {/* KOMPAKT SERTİFİKA PANELİ */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Uzmanlık Akreditasyonları</h3>
              </div>
              <div className="px-3 py-1 bg-orange-50 rounded-lg text-[10px] font-black text-orange-600 border border-orange-100">
                {formData.allTrainings.length} SEÇİLEN
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-slate-50 mb-6">
              {CERTIFICATION_CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  type="button" 
                  onClick={() => setActiveCertCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest border ${
                    activeCertCategory === cat.id 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                  }`}
                >
                   <span>{cat.icon}</span>
                   <span>{cat.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="mb-4 relative">
               <input 
                 type="text" 
                 placeholder="Sertifika ara..." 
                 className="w-full bg-slate-50 border-0 rounded-xl p-3 pl-10 text-xs font-bold"
                 value={certSearch}
                 onChange={e => setCertSearch(e.target.value)}
               />
               <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredCerts.map(cert => {
                const isSelected = formData.allTrainings.includes(cert.label);
                return (
                  <button 
                    key={cert.id} 
                    type="button" 
                    onClick={() => toggleTraining(cert.label)} 
                    className={`p-4 rounded-2xl text-left transition-all border-2 flex flex-col justify-between group ${
                      isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-white border-slate-50 text-slate-400 hover:border-orange-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-tight leading-tight">{cert.label}</p>
                      <p className={`text-[9px] font-bold opacity-60 line-clamp-1`}>{cert.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fade-in">
        {currentQuestions.map((q: Question, idx: number) => (
          <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                {idx + 1}
              </div>
              <h4 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">
                {q.text}
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(shuffledOptionsMap[q.id] || []).map((opt: string) => (
                <button 
                  key={opt} 
                  onClick={() => setFormData(prev => ({ ...prev, answers: { ...prev.answers, [q.id]: opt } }))} 
                  className={`text-left px-5 py-4 rounded-2xl border-2 transition-all text-xs font-bold uppercase tracking-tight ${
                    formData.answers[q.id] === opt 
                    ? 'bg-orange-600 border-orange-600 text-white shadow-lg translate-x-1' 
                    : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6 mb-12">
      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-xl overflow-hidden border border-white flex flex-col min-h-[70vh]">
        
        {/* ULTRA-MINIMAL PROGRESS FLOW */}
        <div className="bg-slate-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] font-black text-orange-500 uppercase tracking-[0.3em]">MİA KLİNİK ADAPTASYON</span>
              <span className="text-[8px] font-black text-white/20 uppercase">/ ETAP {currentStep + 1}</span>
            </div>
            <h1 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter italic leading-none">
              {FORM_STEPS[currentStep].title}
            </h1>
          </div>
          
          {/* SLIM PROGRESS LINE */}
          <div className="flex items-center gap-1.5 w-full md:w-64">
            {FORM_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-1000 ${
                  i <= currentStep ? 'bg-orange-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* COMPACT DESCRIPTION BAR */}
        <div className="bg-slate-50/50 px-6 py-2 border-b border-slate-100">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
             {FORM_STEPS[currentStep].description}
           </p>
        </div>

        <div className="p-4 md:p-8 flex-1 bg-[#FDFDFD]">
          {renderStepContent()}
        </div>

        {/* COMPACT FOOTER ACTIONS */}
        <div className="p-6 bg-white border-t border-slate-50 flex justify-between items-center sticky bottom-0 z-50">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
            className={`px-6 py-3 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900'}`}
          >
            ← GERİ
          </button>
          <button 
            onClick={handleNext} 
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95"
          >
            {currentStep === FORM_STEPS.length - 1 ? 'MÜHÜRLE VE GÖNDER' : 'SONRAKİ →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
