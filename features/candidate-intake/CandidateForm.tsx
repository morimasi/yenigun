
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
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
              <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">01. Kurumsal Kimlik Kaydı</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Akademik dosyanızın temelini oluşturun.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Tam Ad Soyad</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Örn: Dr. Ahmet Yılmaz" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">E-Posta Adresi</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:bg-white transition-all outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="ornek@mail.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Mobil İletişim</label>
                <input type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="05XX XXX XX XX" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Akademik Branş</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none cursor-pointer" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}>
                  {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Saha Deneyimi (Yıl)</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Güncel Yaş</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SearchableSelect label="Üniversite" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
              <SearchableSelect label="Bölüm" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
            </div>

            <div className="pt-4">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className={`group relative w-full p-8 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-8 ${
                    formData.cvData 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' 
                    : 'bg-slate-50/50 border-slate-200 hover:border-orange-500 hover:bg-white'
                  }`}
                >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${formData.cvData ? 'bg-orange-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={formData.cvData ? 3 : 2} d={formData.cvData ? "M5 13l4 4L19 7" : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4 4V4"} />
                      </svg>
                   </div>
                   <div className="text-left">
                      <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${formData.cvData ? 'text-white' : 'text-slate-900'}`}>
                        {formData.cvData ? 'Belge Sisteme Mühürlendi' : 'Özgeçmiş / Portfolyo Yükleme'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        {formData.cvData ? formData.cvData.fileName : 'PDF / JPG Formatında (Analiz için Kritik)'}
                      </p>
                   </div>
                </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic border-l-4 border-orange-600 pl-4">Metodolojik Akreditasyonlar</h3>
              <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{formData.allTrainings.length} SEÇİM</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
              {CERTIFICATION_CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  type="button" 
                  onClick={() => setActiveCertCategory(cat.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all whitespace-nowrap text-[11px] font-black uppercase border-2 ${
                    activeCertCategory === cat.id 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                   <span className="text-base">{cat.icon}</span>
                   <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCerts.map(cert => {
                const isSelected = formData.allTrainings.includes(cert.label);
                return (
                  <button 
                    key={cert.id} 
                    type="button" 
                    onClick={() => toggleTraining(cert.label)} 
                    className={`p-5 rounded-2xl text-left transition-all border-2 flex flex-col gap-2 relative overflow-hidden group ${
                      isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-orange-500'
                    }`}
                  >
                    <p className={`text-[12px] font-black uppercase tracking-tight leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>{cert.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">{cert.description}</p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-orange-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
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
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-12">
            <div className="relative z-10">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-4 block">GÜNCEL ETAP</span>
               <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">{step.title}</h2>
               <p className="text-[11px] font-bold text-slate-400 uppercase mt-4 tracking-widest max-w-2xl opacity-80">{step.description}</p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="space-y-4">
          {currentQuestions.map((q: Question, idx: number) => (
            <div key={q.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm group hover:border-orange-500 transition-all">
              <div className="flex items-start gap-5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-lg group-hover:bg-orange-600 transition-colors">
                  {idx + 1}
                </div>
                <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight italic pt-1">
                  {q.text}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-15">
                {(shuffledOptionsMap[q.id] || []).map((opt: string) => {
                  const isSelected = formData.answers[q.id] === opt;
                  return (
                    <button 
                      key={opt} 
                      onClick={() => setFormData(prev => ({ ...prev, answers: { ...prev.answers, [q.id]: opt } }))} 
                      className={`text-left px-8 py-5 rounded-2xl border-2 transition-all text-[13px] font-bold uppercase tracking-tight leading-snug flex items-center gap-4 ${
                        isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-x-1' 
                        : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span>{opt}</span>
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
    <div className="max-w-6xl mx-auto px-4 mt-6 mb-20">
      <div className="bg-white/95 backdrop-blur-3xl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.12)] overflow-hidden border border-white flex flex-col min-h-[85vh]">
        
        {/* PROGRESS NAVIGATION */}
        <div className="bg-slate-950 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em]">MİA KLİNİK ANALİZ</span>
              <div className="h-px w-12 bg-white/20"></div>
              <span className="text-[10px] font-black text-white/40 uppercase">ETAP {currentStep + 1} / {FORM_STEPS.length}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
              AKADEMİK DOSYA GİRİŞİ
            </h1>
          </div>
          
          <div className="relative z-10 flex flex-col items-end gap-3 w-full md:w-80">
            <div className="flex justify-between w-full mb-1">
               <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-60">TAMAMLANMA ORANI</span>
               <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">%{Math.round(((currentStep + 1) / FORM_STEPS.length) * 100)}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.6)] transition-all duration-1000" style={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-orange-600/5 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="p-4 md:p-16 flex-1 bg-[#FAFAFA]">
          {renderStepContent()}
        </div>

        {/* COMPACT FOOTER ACTIONS */}
        <div className="p-10 bg-white border-t border-slate-100 flex justify-between items-center sticky bottom-0 z-50 backdrop-blur-md bg-white/95">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
            className={`px-12 py-6 font-black text-[12px] uppercase tracking-widest transition-all rounded-2xl ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
          >
            ← ÖNCEKİ BÖLÜM
          </button>
          <button 
            onClick={handleNext}
            disabled={!isStepComplete}
            className={`px-16 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-3xl transition-all active:scale-95 ${
                isStepComplete 
                ? 'bg-slate-900 text-white hover:bg-orange-600' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            {currentStep === FORM_STEPS.length - 1 ? 'MÜHÜRLE VE ANALİZE GÖNDER' : 'SONRAKİ BÖLÜME GEÇ →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
