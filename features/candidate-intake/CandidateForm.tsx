
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
        alert("Lütfen tüm zorunlu alanları (Ad, E-posta, Telefon, Üniversite) eksiksiz doldurunuz.");
        return;
      }
    } else {
      const unanswered = currentQuestions.filter((q: Question) => !formData.answers[q.id]);
      if (unanswered.length > 0) {
        alert("Bu aşamayı tamamlamak için tüm soruları yanıtlamanız gerekmektedir.");
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
        <div className="space-y-10 animate-fade-in pb-10">
          <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
            <h3 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.4em] mb-12 border-l-4 border-orange-500 pl-6">01. TEMEL AKADEMİK KİMLİK</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">İLETİŞİM HATTI</label>
                 <input type="tel" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="05xx xxx xx xx" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">GÜNCEL YAŞ</label>
                 <input type="number" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">MESLEKİ KIDEM (YIL)</label>
                 <input type="number" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">BRANŞ ODAĞI</label>
                 <select className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500 text-white" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}>
                   {Object.values(Branch).map(b => <option key={b} value={b} className="text-slate-900">{b}</option>)}
                 </select>
               </div>
               <div className="space-y-3 col-span-1 md:col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ÖNCEKİ AKADEMİK KURUMLAR</label>
                 <input type="text" className="w-full rounded-2xl border border-white/10 p-5 font-bold bg-white/5 outline-none focus:ring-2 focus:ring-orange-500" value={formData.previousInstitutions} onChange={(e) => setFormData({...formData, previousInstitutions: e.target.value})} placeholder="Örn: X Rehabilitasyon, Y Koleji..." />
               </div>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-xl relative">
            <h3 className="text-[12px] font-black text-orange-600 uppercase tracking-[0.4em] mb-12 border-l-4 border-orange-600 pl-6">02. EĞİTİM & AKREDİTASYON HAVUZU</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">AD SOYAD (RESMİ)</label>
                  <input type="text" className="w-full rounded-3xl border border-slate-100 p-5 font-bold bg-slate-50/50 outline-none focus:ring-2 focus:ring-orange-200 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="İsim Soyisim" />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">E-POSTA ADRESİ</label>
                  <input type="email" className="w-full rounded-3xl border border-slate-100 p-5 font-bold bg-slate-50/50 outline-none focus:ring-2 focus:ring-orange-200 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="akademik@mail.com" />
               </div>
               <SearchableSelect label="MEZUN OLUNAN ÜNİVERSİTE" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
               <SearchableSelect label="BÖLÜM / ANABİLİM DALI" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
            </div>

            <div className="space-y-12">
               <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
                  {CERTIFICATION_CATEGORIES.map(cat => (
                    <button 
                      key={cat.id} 
                      type="button" 
                      onClick={() => setActiveCertCategory(cat.id)}
                      className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCertCategory === cat.id ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-105' : 'bg-white border-slate-50 text-slate-400 hover:border-orange-200'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {CERTIFICATIONS.filter(c => c.category === activeCertCategory).map(cert => (
                    <button 
                      key={cert.id} 
                      type="button" 
                      onClick={() => toggleTraining(cert.label)} 
                      className={`p-8 rounded-[2.5rem] text-left transition-all border-2 relative overflow-hidden group ${
                        formData.allTrainings.includes(cert.label) 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.03]' 
                        : 'bg-slate-50/50 border-slate-50 text-slate-500 hover:border-orange-500 hover:bg-white'
                      }`}
                    >
                      <div className="relative z-10">
                        <p className="text-[13px] font-black uppercase tracking-tight mb-3 pr-8 leading-tight">{cert.label}</p>
                        <p className={`text-[10px] font-bold leading-relaxed opacity-60 ${formData.allTrainings.includes(cert.label) ? 'text-orange-400' : 'text-slate-400'}`}>{cert.description}</p>
                      </div>
                      {formData.allTrainings.includes(cert.label) && (
                        <div className="absolute top-6 right-6 text-orange-500 animate-scale-in">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-10 transition-all ${formData.allTrainings.includes(cert.label) ? 'bg-orange-500 opacity-30' : 'bg-slate-300'}`}></div>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-10 animate-fade-in pb-16">
        {currentQuestions.map((q: Question, idx: number) => (
          <div key={q.id} className="bg-white p-10 md:p-16 rounded-[4.5rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
            <div className="flex items-start gap-8 mb-12">
              <div className="w-16 h-16 rounded-[2rem] bg-orange-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-3xl shadow-orange-600/30">
                {idx + 1}
              </div>
              <h4 className="text-3xl md:text-4xl font-black text-slate-900 leading-[0.95] tracking-tighter pt-2 uppercase italic">
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
                      className={`text-left p-10 rounded-[3rem] border-2 transition-all font-black text-[15px] uppercase tracking-tight ${
                        formData.answers[q.id] === opt 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-3xl scale-[1.02]' 
                        : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:border-orange-500 hover:bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] group-hover:bg-orange-600/10 transition-all duration-1000"></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      <div className="bg-white/95 backdrop-blur-3xl rounded-[5rem] shadow-[0_50px_120px_rgba(0,0,0,0.1)] overflow-hidden border border-white relative">
        <div className="bg-slate-900 p-12 md:p-20 text-white relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
          <div className="max-w-4xl relative z-10">
            <div className="flex items-center gap-6 mb-10">
               <span className="px-6 py-2 bg-orange-600 text-[12px] font-black uppercase rounded-2xl tracking-widest shadow-2xl">AŞAMA {currentStep + 1} / {FORM_STEPS.length}</span>
               <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-orange-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.85] italic">{FORM_STEPS[currentStep].title}</h1>
            <p className="text-slate-400 font-bold text-sm md:text-base uppercase tracking-[0.4em] opacity-80 leading-relaxed">{FORM_STEPS[currentStep].description}</p>
          </div>
        </div>
        <div className="p-8 md:p-20 min-h-[700px] bg-[#FDFDFD] relative">
          {renderStepContent()}
        </div>
        <div className="p-10 md:p-16 bg-white border-t border-slate-50 flex justify-between items-center sticky bottom-0 z-50 backdrop-blur-3xl bg-white/90">
          <button onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} className={`px-12 py-6 font-black text-[12px] uppercase tracking-[0.2em] transition-all rounded-[2rem] ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>← Önceki Aşama</button>
          <button onClick={handleNext} className="px-16 md:px-28 py-6 bg-orange-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-slate-900 transition-all shadow-3xl active:scale-95">
            {currentStep === FORM_STEPS.length - 1 ? 'ANALİZİ MÜHÜRLE' : 'SONRAKİ AŞAMA →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
