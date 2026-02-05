
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Sistem güvenliği gereği dosya boyutu 3MB'dan küçük olmalıdır.");
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

  const isStepComplete = useMemo(() => {
    if (FORM_STEPS[currentStep].id === 'personal') {
        return !!(formData.name && formData.email && formData.phone && formData.university);
    }
    return currentQuestions.every(q => formData.answers[q.id]);
  }, [currentStep, formData, currentQuestions]);

  const handleNext = () => {
    if (!isStepComplete) {
      alert("Devam etmek için bu aşamadaki tüm soruları yanıtlamanız ve zorunlu alanları doldurmanız gerekmektedir.");
      return;
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
        <div className="space-y-4 animate-fade-in text-sm">
          <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">01. Kurumsal Kimlik Kaydı</h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Akademik dosyanızın temelini oluşturun.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tam Ad Soyad</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-3 text-sm md:text-xs font-bold focus:bg-white focus:border-orange-500 transition-all outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Örn: Ahmet Yılmaz" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">E-Posta Adresi</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-3 text-sm md:text-xs font-bold focus:bg-white focus:border-orange-500 transition-all outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="ornek@mail.com" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Mobil İletişim</label>
                <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-3 text-sm md:text-xs font-bold focus:bg-white focus:border-orange-500 transition-all outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="05XX XXX XX XX" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Akademik Branş</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-3 text-sm md:text-xs font-bold outline-none cursor-pointer" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}>
                  {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Saha Deneyimi (Yıl)</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-3 text-sm md:text-xs font-bold outline-none" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Güncel Yaş</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-3 text-sm md:text-xs font-bold outline-none" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableSelect label="Üniversite" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
              <SearchableSelect label="Bölüm" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
            </div>

            <div className="pt-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className={`group relative w-full p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col md:flex-row items-center justify-center gap-4 ${
                    formData.cvData 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                    : 'bg-slate-50 border-slate-300 hover:border-orange-500 hover:bg-white'
                  }`}
                >
                   <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${formData.cvData ? 'bg-orange-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={formData.cvData ? 2.5 : 2} d={formData.cvData ? "M5 13l4 4L19 7" : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4 4V4"} />
                      </svg>
                   </div>
                   <div className="text-center md:text-left">
                      <p className={`text-[13px] font-bold uppercase tracking-wide ${formData.cvData ? 'text-white' : 'text-slate-700'}`}>
                        {formData.cvData ? 'Belge Mühürlendi' : 'CV / Portfolyo Yükle'}
                      </p>
                      <p className="text-[10px] font-semibold opacity-70 uppercase">
                        {formData.cvData ? formData.cvData.fileName : 'PDF / JPG (Max 3MB)'}
                      </p>
                   </div>
                </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight border-l-2 border-orange-600 pl-3">Metodolojik Akreditasyonlar</h3>
              <span className="px-3 py-1 bg-slate-900 text-white rounded-md text-[9px] font-black uppercase tracking-widest self-start md:self-auto">{formData.allTrainings.length} SEÇİM</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
              {CERTIFICATION_CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  type="button" 
                  onClick={() => setActiveCertCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap text-[10px] font-black uppercase border ${
                    activeCertCategory === cat.id 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                   <span className="text-base">{cat.icon}</span>
                   <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredCerts.map(cert => {
                const isSelected = formData.allTrainings.includes(cert.label);
                return (
                  <button 
                    key={cert.id} 
                    type="button" 
                    onClick={() => toggleTraining(cert.label)} 
                    className={`p-4 md:p-3 rounded-lg text-left transition-all border flex flex-col gap-1 relative overflow-hidden group ${
                      isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-orange-400'
                    }`}
                  >
                    <p className={`text-[11px] md:text-[10px] font-bold uppercase tracking-tight leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>{cert.label}</p>
                    <p className="text-[10px] md:text-[9px] font-medium opacity-70 uppercase truncate">{cert.description}</p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-orange-500">
                        <svg className="w-4 h-4 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="bg-slate-900 p-6 md:p-10 rounded-2xl text-white shadow-lg relative overflow-hidden mb-6">
            <div className="relative z-10">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">GÜNCEL ETAP</span>
               <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">{step.title}</h2>
               <p className="text-[11px] md:text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-wide max-w-2xl opacity-90">{step.description}</p>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="space-y-4">
          {currentQuestions.map((q: Question, idx: number) => (
            <div key={q.id} className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-orange-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center text-[11px] font-black shrink-0">
                  {idx + 1}
                </div>
                <h4 className="text-[15px] md:text-base font-bold text-slate-900 leading-snug uppercase tracking-tight">
                  {q.text}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-12">
                {(shuffledOptionsMap[q.id] || []).map((opt: string) => {
                  const isSelected = formData.answers[q.id] === opt;
                  return (
                    <button 
                      key={opt} 
                      onClick={() => setFormData(prev => ({ ...prev, answers: { ...prev.answers, [q.id]: opt } }))} 
                      className={`text-left px-5 py-4 md:py-3 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-tight leading-snug flex items-center gap-4 ${
                        isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.01]' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-orange-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 mt-2 md:mt-4 mb-10">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col min-h-[85vh]">
        
        {/* PROGRESS NAVIGATION */}
        <div className="bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">MİA AKADEMİK SİSTEM</span>
              <div className="h-px w-6 bg-white/20"></div>
              <span className="text-[10px] font-black text-white/50 uppercase">BÖLÜM {currentStep + 1} / {FORM_STEPS.length}</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
              UZMANLIK DOSYASI
            </h1>
          </div>
          
          <div className="flex flex-col items-end gap-2 w-full md:w-64">
            <div className="flex justify-between w-full mb-1">
               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">DOSYA TAMAMLAMA</span>
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">%{Math.round(((currentStep + 1) / FORM_STEPS.length) * 100)}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-orange-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(234,88,12,0.5)]" style={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-10 flex-1 bg-[#F8FAFC]">
          {renderStepContent()}
        </div>

        {/* STICKY FOOTER ACTIONS */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex justify-between items-center sticky bottom-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] backdrop-blur-md bg-white/95">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
            className={`px-6 py-4 md:py-3 font-black text-[11px] uppercase tracking-widest transition-all rounded-xl ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            ← GERİ
          </button>
          <button 
            onClick={handleNext}
            disabled={!isStepComplete}
            className={`px-10 py-5 md:py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                isStepComplete 
                ? 'bg-slate-950 text-white hover:bg-orange-600 shadow-orange-600/20' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            {currentStep === FORM_STEPS.length - 1 ? 'DOSYAYI MÜHÜRLE' : 'DEVAM ET →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
