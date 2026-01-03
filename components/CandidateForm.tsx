
import React, { useState, useMemo } from 'react';
import { FORM_STEPS, MOCK_QUESTIONS } from '../constants';
import { Branch, Candidate } from '../types';

interface CandidateFormProps {
  onSubmit: (candidate: Omit<Candidate, 'id' | 'timestamp' | 'report'>) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: Branch.OzelEgitim,
    experienceYears: 0,
    cvData: undefined as Candidate['cvData'] | undefined,
    answers: {} as Record<string, string | string[]>
  });

  const progress = useMemo(() => ((currentStep + 1) / FORM_STEPS.length) * 100, [currentStep]);

  const shuffledQuestions = useMemo(() => {
    const stepId = FORM_STEPS[currentStep].id;
    const questions = MOCK_QUESTIONS[stepId as keyof typeof MOCK_QUESTIONS] || [];
    return [...questions].sort(() => Math.random() - 0.5);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAnswer = (qid: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      answers: { ...prev.answers, [qid]: value }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Dosya boyutu çok büyük (Maksimum 2MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      updateField('cvData', {
        base64,
        mimeType: file.type,
        fileName: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];

    if (step.id === 'personal') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <div className="space-y-6">
            <div className="animate-fade-in stagger-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tam Adınız</label>
              <input
                type="text"
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-4 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all-custom outline-none text-slate-800 font-medium"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
            <div className="animate-fade-in stagger-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-Posta Adresi</label>
              <input
                type="email"
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-4 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all-custom outline-none text-slate-800 font-medium"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="ornek@eposta.com"
              />
            </div>
            <div className="pt-2 animate-fade-in stagger-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Özgeçmiş (CV) Yükle</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label 
                  htmlFor="cv-upload"
                  className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all-custom ${
                    formData.cvData 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-slate-200 bg-slate-50 hover:border-orange-400 hover:bg-orange-50 hover:shadow-lg'
                  }`}
                >
                  {formData.cvData ? (
                    <div className="flex items-center space-x-3 animate-scale-in">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-left">
                        <p className="text-sm font-bold truncate max-w-[200px]">{formData.cvData.fileName}</p>
                        <p className="text-[10px] opacity-70">Değiştirmek için tıklayın</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-slate-400 mb-2 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-bold text-slate-600">Dosya Seç (PDF, JPG, PNG)</span>
                      <span className="text-[10px] text-slate-400 mt-1">Maksimum 2MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="animate-fade-in stagger-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Branş Seçimi</label>
              <select
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-4 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all-custom outline-none text-slate-800 font-semibold appearance-none cursor-pointer"
                value={formData.branch}
                onChange={(e) => updateField('branch', e.target.value as Branch)}
              >
                {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="animate-fade-in stagger-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mesleki Deneyim (Yıl)</label>
              <input
                type="number"
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-4 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all-custom outline-none text-slate-800 font-medium"
                value={formData.experienceYears}
                onChange={(e) => updateField('experienceYears', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        {shuffledQuestions.map((q: any, idx: number) => (
          <div key={q.id} className="group animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-start space-x-4 mb-5">
              <div className="w-2 h-8 bg-orange-200 rounded-full group-hover:bg-orange-500 transition-all duration-300 group-hover:h-10"></div>
              <label className="text-lg font-bold text-slate-800 leading-tight transition-colors group-hover:text-slate-900">{q.text}</label>
            </div>
            
            {q.type === 'radio' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer(q.id, opt)}
                    className={`relative text-left px-6 py-5 rounded-2xl border-2 transition-all-custom group ${
                      formData.answers[q.id] === opt 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-100 scale-[1.02]' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-md'
                    }`}
                  >
                    <span className="text-sm font-bold tracking-tight">{opt}</span>
                    {formData.answers[q.id] === opt && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in">
                        <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : q.type === 'checkbox' ? (
              <div className="flex flex-wrap gap-3">
                {q.options.map((opt: string) => (
                  <label key={opt} className={`flex items-center space-x-3 px-6 py-3 rounded-full cursor-pointer transition-all-custom border-2 ${
                    (formData.answers[q.id] as string[] || []).includes(opt)
                    ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm scale-[1.05]'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg text-orange-600 focus:ring-orange-500 border-slate-300 transition-all"
                      checked={(formData.answers[q.id] as string[] || []).includes(opt)}
                      onChange={(e) => {
                        const current = formData.answers[q.id] as string[] || [];
                        const next = e.target.checked ? [...current, opt] : current.filter(i => i !== opt);
                        updateAnswer(q.id, next);
                      }}
                    />
                    <span className="text-sm font-bold">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full rounded-3xl border-2 border-slate-100 bg-slate-50/30 p-6 h-40 focus:border-orange-500 focus:bg-white focus:ring-8 focus:ring-orange-50 transition-all-custom outline-none text-slate-700 font-medium resize-none"
                value={formData.answers[q.id] as string || ''}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                placeholder="Lütfen bu alanı profesyonel ve içtenlikle doldurunuz..."
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative">
      {/* Branding Header */}
      <div className="bg-slate-900 rounded-t-[3rem] p-10 md:p-14 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight animate-fade-in leading-tight">Geleceği Birlikte <br/><span className="text-orange-500">İnşa Edelim</span></h1>
            <p className="text-slate-400 mt-6 text-lg font-medium max-w-lg animate-fade-in stagger-1">
              {FORM_STEPS[currentStep].description}
            </p>
          </div>

          {/* Orbit Tracker - New Circular Progress */}
          <div className="relative shrink-0 flex items-center justify-center animate-scale-in">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
              <circle 
                cx="64" cy="64" r="58" 
                stroke="currentColor" strokeWidth="6" 
                fill="transparent" 
                strokeDasharray={364} 
                strokeDashoffset={364 - (364 * progress) / 100} 
                className="text-orange-600 transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-white">{currentStep + 1}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aşama</span>
            </div>
          </div>
        </div>

        {/* Floating Particle Path - New Step Indicator */}
        <div className="mt-12 flex items-center justify-between gap-2 relative">
          <div className="absolute left-0 right-0 h-px bg-slate-800 top-1/2 -translate-y-1/2 z-0"></div>
          {FORM_STEPS.map((step, idx) => (
            <div 
              key={step.id} 
              className="relative z-10 group cursor-help"
              title={step.title}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all-custom duration-500 ${
                  idx <= currentStep 
                  ? 'bg-orange-500 scale-125 shadow-[0_0_15px_rgba(234,88,12,0.8)]' 
                  : 'bg-slate-700'
                }`}
              ></div>
              {idx === currentStep && (
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-600/30 rounded-full animate-ping"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-b-[3rem] shadow-2xl p-10 md:p-14 border-x border-b border-slate-100 relative overflow-hidden">
        {/* Large Aesthetic Background Number */}
        <div className="absolute bottom-0 right-0 text-[20rem] font-black text-slate-50/80 leading-none select-none -mb-20 -mr-10 pointer-events-none transition-all duration-700">
          0{currentStep + 1}
        </div>

        <div className="relative z-10">
          <div key={currentStep}>
            {renderStepContent()}
          </div>

          <div className="mt-20 flex items-center justify-between border-t border-slate-50 pt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-8 py-5 rounded-3xl font-bold transition-all-custom ${
                currentStep === 0 
                ? 'text-slate-300 cursor-not-allowed opacity-0 translate-x-10' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 active:scale-95'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Geri Dön</span>
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-4 px-12 py-5 bg-orange-600 text-white rounded-3xl font-black text-lg hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-200 active:scale-95 transition-all-custom beam-effect shadow-xl"
            >
              <span>{currentStep === FORM_STEPS.length - 1 ? 'Başvuruyu Gönder' : 'Sonraki Adım'}</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
