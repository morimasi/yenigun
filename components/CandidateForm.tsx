
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FORM_STEPS, BRANCH_QUESTIONS, CERTIFICATIONS, TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../constants';
import { Branch, Candidate, Gender, Question, Certification } from '../types';
import SearchableSelect from './SearchableSelect';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 22,
    gender: 'Belirtilmemiş' as Gender,
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

  // Adayın seçtiği eğitimlere özel doğrulama sorularını filtreleyen ve klinik adıma ekleyen mantık
  const currentQuestions = useMemo(() => {
    const stepId = FORM_STEPS[currentStep].id;
    let baseQuestions = BRANCH_QUESTIONS[stepId] || [];
    
    /**
     * @fix Line 53: verificationQuestion -> verificationQuestions. 
     * Since verificationQuestions is an array, we use flatMap to merge them into the questions list.
     */
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFormData(prev => ({
          ...prev,
          cvData: { base64: base64String, mimeType: file.type, fileName: file.name }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    const stepId = FORM_STEPS[currentStep].id;
    
    if (stepId === 'personal') {
      if (!formData.name || !formData.email || !formData.phone || !formData.university || !formData.department) {
        alert("Lütfen temel ve akademik bilgilerinizi eksiksiz doldurunuz.");
        return;
      }
    } else {
      const unanswered = currentQuestions.filter((q: Question) => !formData.answers[q.id]);
      if (unanswered.length > 0) {
        alert("Klinik değerlendirmenin tamamlanması için tüm soruları yanıtlamanız gerekmektedir.");
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

  const updateAnswer = (qid: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, answers: { ...prev.answers, [qid]: value } }));
  };

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];

    if (step.id === 'personal') {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
               <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.3em]">01. Akademik Profil Temeli</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">AD SOYAD</label>
                    <input type="text" className="w-full rounded-2xl border border-slate-100 p-4 font-bold bg-slate-50/30 outline-none focus:ring-2 focus:ring-orange-100" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Örn: Dr. Ahmet Yılmaz" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">KLİNİK BRANŞ</label>
                    <select className="w-full rounded-2xl border border-slate-100 p-4 font-bold bg-slate-50/30 outline-none focus:ring-2 focus:ring-orange-100" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}>
                      {/* @fix: Explicitly cast branch value to string for React keys and option values */}
                      {Object.values(Branch).map(b => <option key={b as string} value={b as string}>{b as string}</option>)}
                    </select>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SearchableSelect label="MEZUN OLUNAN ÜNİVERSİTE" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
                  <SearchableSelect label="MEZUNİYET BÖLÜMÜ" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
               </div>
            </div>
            <div onClick={() => fileInputRef.current?.click()} className={`lg:col-span-4 p-8 rounded-[2.5rem] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${formData.cvData ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 hover:border-orange-400 text-slate-400'}`}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${formData.cvData ? 'bg-orange-600' : 'bg-white shadow-md'}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={formData.cvData ? "M5 13l4 4L19 7" : "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"} /></svg>
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-widest">{formData.cvData ? 'BELGE DOĞRULANDI' : 'CV / PORTFOLYO YÜKLE'}</h4>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.3em] mb-8 border-l-4 border-orange-600 pl-4">Metodolojik Akreditasyon ve Sertifikasyon</h3>
            <div className="space-y-12">
               {['LANGUAGE_SPEECH', 'OCCUPATIONAL_THERAPY', 'PHYSIOTHERAPY', 'SPECIAL_ED_ABA'].map(cat => (
                 <div key={cat} className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{cat.replace('_', ' ')}</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {CERTIFICATIONS.filter(c => c.category === cat).map(cert => (
                       <button 
                         key={cert.id} 
                         type="button" 
                         onClick={() => toggleTraining(cert.label)} 
                         className={`p-5 rounded-2xl text-left transition-all border group relative ${
                           formData.allTrainings.includes(cert.label) 
                           ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' 
                           : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-300'
                         }`}
                       >
                         <p className="text-[11px] font-black uppercase tracking-tight mb-2">{cert.label}</p>
                         <p className={`text-[9px] font-bold leading-tight ${formData.allTrainings.includes(cert.label) ? 'text-slate-400' : 'text-slate-400'}`}>
                           {cert.description}
                         </p>
                         {formData.allTrainings.includes(cert.label) && (
                           <div className="absolute top-4 right-4 text-orange-500">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                           </div>
                         )}
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
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
              <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-lg shadow-orange-600/20">
                {idx + 1}
              </div>
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tighter pt-1 uppercase">
                {q.text}
              </h4>
            </div>
            <div className="pl-0 md:pl-20">
              {q.type === 'radio' ? (
                <div className="grid grid-cols-1 gap-4">
                  {(shuffledOptionsMap[q.id] || []).map((opt: string) => (
                    <button key={opt} onClick={() => updateAnswer(q.id, opt)} className={`text-left p-6 rounded-[2rem] border-2 transition-all font-black text-[13px] uppercase tracking-tight ${formData.answers[q.id] === opt ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Klinik Doğrulama Alanı</p>
                   <textarea className="w-full rounded-[2.5rem] border-2 border-slate-50 p-8 h-48 focus:border-orange-600 focus:bg-white outline-none font-bold text-[14px] bg-slate-50/50 shadow-inner transition-all" value={formData.answers[q.id] as string || ''} onChange={(e) => updateAnswer(q.id, e.target.value)} placeholder="Akademik cevabınızı literatür bilgisiyle destekleyerek yazınız..." />
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
      <div className="bg-white/90 backdrop-blur-3xl rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-white relative">
        <div className="bg-slate-900 p-10 md:p-16 text-white relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]"></div>
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <span className="px-4 py-1.5 bg-orange-600 text-[11px] font-black uppercase rounded-xl tracking-widest shadow-lg shadow-orange-600/30">AŞAMA {currentStep + 1} / {FORM_STEPS.length}</span>
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
          <button onClick={handleNext} className="px-12 md:px-20 py-5 bg-orange-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl shadow-orange-600/20 active:scale-95">
            {currentStep === FORM_STEPS.length - 1 ? 'AKADEMİK ANALİZİ BAŞLAT' : 'SONRAKİ ADIM →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
