
import React, { useState, useMemo, useRef } from 'react';
import { FORM_STEPS, MOCK_QUESTIONS, CERTIFICATION_LIST, TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../constants';
import { Branch, Candidate, Gender } from '../types';
import SearchableSelect from './SearchableSelect';

interface CandidateFormProps {
  onSubmit: (candidate: Omit<Candidate, 'id' | 'timestamp' | 'report'>) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [otherTrainings, setOtherTrainings] = useState('');
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

  const progress = useMemo(() => ((currentStep + 1) / FORM_STEPS.length) * 100, [currentStep]);

  const questions = useMemo(() => {
    const stepId = FORM_STEPS[currentStep].id;
    return (MOCK_QUESTIONS as any)[stepId] || [];
  }, [currentStep]);

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
        alert("Lütfen tüm temel ve akademik bilgilerinizi eksiksiz doldurunuz.");
        return;
      }
    } else {
      const currentQuestionIds = questions.map((q: any) => q.id);
      const unanswered = currentQuestionIds.filter((id: string) => !formData.answers[id]);
      if (unanswered.length > 0) {
        alert("Lütfen tüm senaryoları değerlendirerek ilerleyiniz.");
        return;
      }
    }

    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const finalData = {
        ...formData,
        allTrainings: otherTrainings.trim() 
          ? [...formData.allTrainings, `DİĞER: ${otherTrainings.trim()}`] 
          : formData.allTrainings
      };
      onSubmit(finalData as any);
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
          {/* ÜST DASHBOARD PANELİ: ANA KİMLİK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SOL BLOK: KİMLİK VE DEMOGRAFİ (7/12) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-2xl shadow-orange-900/5 space-y-5">
               <div className="flex justify-between items-center px-2">
                 <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> 01. PROFİL KARTI
                 </h3>
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Temel Veri Seti</span>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full rounded-2xl border-2 border-slate-50 p-4 font-black text-base text-slate-900 focus:border-orange-500 outline-none transition-all bg-slate-50/50 placeholder:text-slate-300"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="AD SOYAD"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      className="w-full rounded-2xl border-2 border-slate-50 p-3.5 font-bold text-[13px] text-slate-800 focus:border-orange-500 outline-none transition-all bg-slate-50/50"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="E-POSTA"
                    />
                    <input
                      type="text"
                      className="w-full rounded-2xl border-2 border-slate-50 p-3.5 font-bold text-[13px] text-slate-800 focus:border-orange-500 outline-none transition-all bg-slate-50/50"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="TELEFON"
                    />
                  </div>

                  <div className="grid grid-cols-12 gap-3 pt-1">
                    <div className="col-span-3">
                      <div className="bg-slate-50/50 border-2 border-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center group-focus-within:border-orange-500 transition-all">
                        <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">YAŞ</label>
                        <input
                          type="number"
                          min="18"
                          className="w-full bg-transparent font-black text-lg text-slate-900 outline-none text-center"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="col-span-9 flex bg-slate-100 p-1 rounded-2xl h-[64px]">
                      {['Kadın', 'Erkek', 'Belirtilmemiş'].map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({...formData, gender: g as Gender})}
                          className={`flex-1 py-1 rounded-xl text-[8px] font-black uppercase transition-all ${formData.gender === g ? 'bg-white text-orange-600 shadow-md scale-[0.97]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {g === 'Belirtilmemiş' ? 'DİĞER' : g}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* SAĞ BLOK: UZMANLIK (5/12) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-2xl shadow-orange-900/5 flex flex-col">
               <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 px-2">
                 <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> 02. UZMANLIK
               </h3>
               <div className="space-y-4 flex-1">
                 <div className="relative">
                    <select
                      className="w-full rounded-2xl border-2 border-slate-50 p-4 font-black text-[13px] text-slate-800 focus:border-orange-500 outline-none transition-all bg-slate-50/50 appearance-none cursor-pointer"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}
                    >
                      {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <SearchableSelect 
                      label="ÜNİVERSİTE"
                      options={TURKISH_UNIVERSITIES}
                      value={formData.university}
                      placeholder="Ara..."
                      onChange={(val) => setFormData({...formData, university: val})}
                    />
                    <SearchableSelect 
                      label="BÖLÜM"
                      options={TURKISH_DEPARTMENTS}
                      value={formData.department}
                      placeholder="Ara..."
                      onChange={(val) => setFormData({...formData, department: val})}
                    />
                 </div>
               </div>
            </div>
          </div>

          {/* ALT DASHBOARD PANELİ: DENEYİM VE DOSYA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-xl shadow-orange-900/5">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 px-2">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> 03. KLİNİK GEÇMİŞ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-1">
                   <div className="bg-slate-50/50 border-2 border-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center">
                     <label className="text-[7px] font-black text-orange-600 uppercase mb-2 tracking-widest">YIL</label>
                     <input
                      type="number"
                      className="w-full bg-transparent font-black text-3xl text-slate-900 outline-none text-center"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                    />
                   </div>
                </div>
                <div className="sm:col-span-4">
                   <textarea
                    className="w-full rounded-2xl border-2 border-slate-50 p-4 font-bold text-slate-800 focus:border-orange-500 outline-none transition-all bg-slate-50/50 h-[92px] resize-none text-[12px] placeholder:text-slate-300"
                    value={formData.previousInstitutions}
                    onChange={(e) => setFormData({...formData, previousInstitutions: e.target.value})}
                    placeholder="Daha önce çalıştığınız kurumlar ve pozisyonlar..."
                  />
                </div>
              </div>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-4 p-6 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center group shadow-xl ${
                formData.cvData ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 hover:border-orange-400 text-slate-400'
              }`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
                formData.cvData ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300 group-hover:text-orange-600'
              }`}>
                {formData.cvData ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                )}
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-widest text-center">{formData.cvData ? 'CV GÜNCELLENDİ' : 'DİJİTAL PORTFOLYO / CV'}</h4>
              <p className="text-[7px] font-bold opacity-50 mt-1 uppercase">{formData.cvData ? formData.cvData.fileName : 'PDF veya Görsel'}</p>
            </div>
          </div>

          {/* AKREDİTASYON PANELİ - ULTRA KOMPAKT GRID */}
          <div className="bg-white p-8 rounded-[3rem] border border-orange-50 shadow-2xl shadow-orange-900/10">
            <div className="flex justify-between items-center mb-6 px-2">
               <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> 04. KLİNİK AKREDİTASYONLAR
               </h3>
               <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg shadow-lg">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">{formData.allTrainings.length} SEÇİLİ</span>
               </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
              {CERTIFICATION_LIST.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleTraining(cert)}
                  className={`p-2.5 rounded-xl border transition-all text-left text-[8px] font-black uppercase tracking-tight flex items-center gap-2 relative overflow-hidden ${
                    formData.allTrainings.includes(cert)
                      ? 'bg-orange-600 border-orange-600 text-white shadow-lg -translate-y-0.5'
                      : 'bg-slate-50 border-transparent text-slate-400 hover:border-orange-200 hover:bg-white'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full border-2 shrink-0 ${formData.allTrainings.includes(cert) ? 'border-white bg-white' : 'border-slate-200'}`} />
                  <span className="truncate">{cert.split('(')[0]}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
               <div className="flex-1 bg-slate-50 rounded-xl p-1 px-3 border border-slate-100 flex items-center gap-3">
                 <span className="text-[7px] font-black text-slate-400 uppercase whitespace-nowrap">DİĞER:</span>
                 <input
                  type="text"
                  className="w-full bg-transparent p-2 text-[10px] font-bold text-slate-800 outline-none"
                  value={otherTrainings}
                  onChange={(e) => setOtherTrainings(e.target.value)}
                  placeholder="Ek eğitimlerinizi buraya ekleyin..."
                />
               </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-16 py-4">
        {questions.map((q: any, idx: number) => (
          <div key={q.id} className="animate-fade-in relative group" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-start gap-6 mb-8">
              <span className="shrink-0 w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-lg font-black shadow-xl shadow-orange-100">{idx + 1}</span>
              <label className="text-2xl font-black text-slate-900 leading-tight tracking-tight pt-1">{q.text}</label>
            </div>
            <div className="grid grid-cols-1 gap-4 ml-16">
              {q.type === 'radio' ? (
                q.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer(q.id, opt)}
                    className={`text-left p-6 rounded-[2rem] border-2 transition-all font-bold text-base relative overflow-hidden group/btn ${
                      formData.answers[q.id] === opt 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-2xl translate-x-3' 
                      : 'bg-white border-orange-50 text-slate-600 hover:border-orange-300 hover:bg-orange-50/30'
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                       <span>{opt}</span>
                       {formData.answers[q.id] === opt && (
                         <svg className="w-6 h-6 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       )}
                    </div>
                  </button>
                ))
              ) : (
                <textarea
                  className="w-full rounded-[2.5rem] border-2 border-orange-100 p-8 h-48 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-semibold text-slate-800 resize-none bg-orange-50/10 shadow-inner"
                  value={formData.answers[q.id] as string || ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder="Lütfen bu durumu detaylandırınız..."
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(234,88,12,0.15)] overflow-hidden border border-orange-100">
        <div className="bg-slate-900 p-12 md:p-16 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute right-16 top-16 z-10 hidden md:block">
            <div className="w-24 h-24 rounded-full border-8 border-white/5 flex items-center justify-center font-black text-2xl relative">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * progress) / 100} className="text-orange-600 transition-all duration-700" />
              </svg>
              <span className="relative">%{Math.round(progress)}</span>
            </div>
          </div>
          <div className="max-w-2xl relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">{FORM_STEPS[currentStep].title}</h1>
            <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] opacity-80">{FORM_STEPS[currentStep].description}</p>
          </div>
        </div>
        
        <div className="p-8 md:p-14 min-h-[600px] bg-gradient-to-b from-white to-slate-50/20">
          {renderStepContent()}
        </div>

        <div className="p-8 md:p-12 bg-white border-t border-orange-50 flex justify-between items-center">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
            disabled={currentStep === 0} 
            className={`px-8 py-4 font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-2xl ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'}`}
          >
            ← GERİ
          </button>
          <button 
            onClick={handleNext} 
            className="px-12 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-700 shadow-[0_20px_40px_-10px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-1 active:scale-95"
          >
            {currentStep === FORM_STEPS.length - 1 ? 'ANALİZİ BAŞLAT' : 'SONRAKİ ADIM →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
