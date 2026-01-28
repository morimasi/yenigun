
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
    let baseQuestions = BRANCH_QUESTIONS[stepId] || [];
    
    if (stepId === 'clinical_logic') {
      const trainingQuestions = CERTIFICATIONS
        .filter(cert => formData.allTrainings.includes(cert.label))
        .map(cert => cert.verificationQuestion);
      
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
        alert("Lütfen zorunlu alanları (Ad, E-posta, Telefon, Üniversite) doldurunuz.");
        return;
      }
    } else {
      const unanswered = currentQuestions.filter((q: Question) => !formData.answers[q.id]);
      if (unanswered.length > 0) {
        alert("Lütfen bu adımdaki tüm soruları yanıtlayınız.");
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

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];

    if (step.id === 'personal') {
      return (
        <div className="space-y-8 animate-fade-in">
          {/* MODÜL: KİŞİSEL PROFİL */}
          <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-500 pl-4">01. Kişisel Profil & Demografi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">İLETİŞİM TELEFONU</label>
                 <input type="tel" className="w-full rounded-2xl border border-white/10 p-4 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="05xx xxx xx xx" />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">GÜNCEL YAŞ</label>
                 <input type="number" className="w-full rounded-2xl border border-white/10 p-4 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">DENEYİM (YIL)</label>
                 <input type="number" className="w-full rounded-2xl border border-white/10 p-4 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">CİNSİYET</label>
                 <select className="w-full rounded-2xl border border-white/10 p-4 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500 text-white" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}>
                   <option value="Belirtilmemiş" className="text-slate-900">Seçiniz</option>
                   <option value="Kadın" className="text-slate-900">Kadın</option>
                   <option value="Erkek" className="text-slate-900">Erkek</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">MEDENİ DURUM</label>
                 <select className="w-full rounded-2xl border border-white/10 p-4 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500 text-white" value={formData.maritalStatus} onChange={(e) => setFormData({...formData, maritalStatus: e.target.value as MaritalStatus})}>
                   <option value="Bekar" className="text-slate-900">Bekar</option>
                   <option value="Evli" className="text-slate-900">Evli</option>
                   <option value="Diğer" className="text-slate-900">Diğer</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">KLİNİK BRANŞ</label>
                 <select className="w-full rounded-2xl border border-white/10 p-4 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500 text-white" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}>
                   {Object.values(Branch).map(b => <option key={b} value={b} className="text-slate-900">{b}</option>)}
                 </select>
               </div>
            </div>
          </div>

          {/* AKADEMİK KİMLİK & SERTİFİKA */}
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl">
            <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.4em] mb-10 border-l-4 border-orange-600 pl-4">02. Akademik Kimlik & Uzmanlık</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">AD SOYAD</label>
                  <input type="text" className="w-full rounded-2xl border border-slate-100 p-4 font-bold bg-slate-50/50 outline-none focus:ring-2 focus:ring-orange-200" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ad Soyad" />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">E-POSTA</label>
                  <input type="email" className="w-full rounded-2xl border border-slate-100 p-4 font-bold bg-slate-50/50 outline-none focus:ring-2 focus:ring-orange-200" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="mail@example.com" />
               </div>
               <SearchableSelect label="MEZUN OLUNAN ÜNİVERSİTE" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
               <SearchableSelect label="MEZUNİYET BÖLÜMÜ" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {CERTIFICATION_CATEGORIES.map(cat => (
                    <button 
                      key={cat.id} 
                      type="button" 
                      onClick={() => setActiveCertCategory(cat.id)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCertCategory === cat.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CERTIFICATIONS.filter(c => c.category === activeCertCategory).map(cert => (
                    <button 
                      key={cert.id} 
                      type="button" 
                      onClick={() => toggleTraining(cert.label)} 
                      className={`p-6 rounded-3xl text-left transition-all border relative overflow-hidden group ${
                        formData.allTrainings.includes(cert.label) 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' 
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-[12px] font-black uppercase tracking-tight mb-2">{cert.label}</p>
                      <p className="text-[9px] font-bold opacity-60 leading-tight">{cert.description}</p>
                      {formData.allTrainings.includes(cert.label) && (
                        <div className="absolute top-4 right-4 text-orange-500 animate-scale-in">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-12 animate-fade-in pb-10">
        {currentQuestions.map((q: Question, idx: number) => (
          <div key={q.id} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-lg">
                {idx + 1}
              </div>
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tighter pt-1 uppercase">
                {q.text}
              </h4>
            </div>
            <div className="pl-0 md:pl-20">
              {q.type === 'radio' && (
                <div className="grid grid-cols-1 gap-4">
                  {(shuffledOptionsMap[q.id] || []).map((opt: string) => (
                    <button 
                      key={opt} 
                      onClick={() => setFormData(prev => ({ ...prev, answers: { ...prev.answers, [q.id]: opt } }))} 
                      className={`text-left p-8 rounded-[2.5rem] border-2 transition-all font-black text-[14px] uppercase tracking-tight ${
                        formData.answers[q.id] === opt 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' 
                        : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      <div className="bg-white/90 backdrop-blur-3xl rounded-[4rem] shadow-2xl overflow-hidden border border-white relative">
        <div className="bg-slate-900 p-10 md:p-16 text-white relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]"></div>
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <span className="px-4 py-1.5 bg-orange-600 text-[11px] font-black uppercase rounded-xl tracking-widest">ADIM {currentStep + 1} / {FORM_STEPS.length}</span>
               <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-[0.9]">{FORM_STEPS[currentStep].title}</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] opacity-80">{FORM_STEPS[currentStep].description}</p>
          </div>
        </div>
        <div className="p-6 md:p-16 min-h-[600px] bg-[#FDFDFD]">
          {renderStepContent()}
        </div>
        <div className="p-8 md:p-12 bg-white border-t border-slate-50 flex justify-between items-center sticky bottom-0 z-50 backdrop-blur-md bg-white/80">
          <button onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} className={`px-10 py-5 font-black text-[11px] uppercase tracking-widest transition-all rounded-2xl ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>← ÖNCEKİ ADIM</button>
          <button onClick={handleNext} className="px-12 md:px-20 py-5 bg-orange-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl active:scale-95">
            {currentStep === FORM_STEPS.length - 1 ? 'ANALİZİ TAMAMLA' : 'SONRAKİ ADIM →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
