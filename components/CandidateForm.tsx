import React, { useState, useMemo, useRef } from 'react';
import { FORM_STEPS, MOCK_QUESTIONS, CERTIFICATION_LIST } from '../constants';
import { Branch, Candidate, Gender } from '../types';

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
        <div className="space-y-12 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="group">
                <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Adınız ve Soyadınız</label>
                <input
                  type="text"
                  className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Örn: Dr. Ayşe Yılmaz"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">E-Posta</label>
                  <input
                    type="email"
                    className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="E-posta"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Telefon</label>
                  <input
                    type="text"
                    className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="05XX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Yaş</label>
                  <input
                    type="number"
                    className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Cinsiyet</label>
                  <div className="flex bg-orange-50 p-2 rounded-[2rem] border-2 border-orange-100">
                    {['Kadın', 'Erkek', 'Belirtilmemiş'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({...formData, gender: g as Gender})}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${formData.gender === g ? 'bg-orange-600 text-white shadow-lg' : 'text-orange-400 hover:text-orange-600'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Branşınız / Uzmanlık Alanınız</label>
                <select
                  className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white appearance-none cursor-pointer"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}
                >
                  {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Mezun Olunan Üniversite</label>
                  <input
                    type="text"
                    className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    placeholder="Üniversite Adı"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Mezun Olunan Bölüm</label>
                  <input
                    type="text"
                    className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Bölüm Adı"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">Mesleki Deneyim (Yıl)</label>
                <input
                  type="number"
                  className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 text-center">Özgeçmiş Dokümanı</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-4 border-dashed rounded-[3rem] p-10 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                formData.cvData ? 'bg-orange-600 border-orange-400 text-white' : 'bg-orange-50 border-orange-200 hover:bg-white hover:border-orange-500'
              }`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg ${
                formData.cvData ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'
              }`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <p className="text-[12px] font-black uppercase tracking-widest text-center leading-relaxed">
                {formData.cvData ? formData.cvData.fileName : 'CV DOSYASINI BURAYA BIRAKIN'}
              </p>
              <p className="text-[10px] mt-2 opacity-50 font-bold uppercase">PDF / PNG / JPEG (MAX 5MB)</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="relative">
              <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4 ml-1">Mesleki Geçmiş: Çalışılan Kurumlar ve Görevler</label>
              <textarea
                className="w-full rounded-[2.5rem] border-2 border-orange-100 p-8 h-40 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all resize-none bg-orange-50/20"
                value={formData.previousInstitutions}
                onChange={(e) => setFormData({...formData, previousInstitutions: e.target.value})}
                placeholder="Örn: X Rehabilitasyon Merkezi (2018-2022) - Özel Eğitim Uzmanı..."
              />
            </div>

            <div className="relative">
              <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-6 ml-1 text-center">Eğitsel Donanım: Sertifikalar ve Teknik Eğitimler</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CERTIFICATION_LIST.map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleTraining(cert)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left text-[10px] font-black uppercase tracking-tight flex items-center gap-3 ${
                      formData.allTrainings.includes(cert)
                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg'
                        : 'bg-white border-orange-100 text-slate-500 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${formData.allTrainings.includes(cert) ? 'border-white bg-white/20' : 'border-orange-200'}`}>
                      {formData.allTrainings.includes(cert) && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-0.5" />}
                    </div>
                    {cert}
                  </button>
                ))}
              </div>
              <div className="mt-8">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4 italic">Diğer Sertifika ve Eğitimleriniz</label>
                <input
                  type="text"
                  className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white"
                  value={otherTrainings}
                  onChange={(e) => setOtherTrainings(e.target.value)}
                  placeholder="Listede olmayan diğer eğitimlerinizi virgülle ayırarak yazınız..."
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
    <div className="max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(234,88,12,0.15)] overflow-hidden border border-orange-100">
        <div className="bg-slate-900 p-16 text-white relative">
          <div className="absolute right-16 top-16">
            <div className="w-24 h-24 rounded-full border-8 border-white/5 flex items-center justify-center font-black text-2xl relative">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * progress) / 100} className="text-orange-600 transition-all duration-700" />
              </svg>
              <span className="relative">%{Math.round(progress)}</span>
            </div>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 leading-none">{FORM_STEPS[currentStep].title}</h1>
            <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs opacity-80">{FORM_STEPS[currentStep].description}</p>
          </div>
        </div>
        
        <div className="p-16 min-h-[600px] bg-gradient-to-b from-white to-orange-50/10">
          {renderStepContent()}
        </div>

        <div className="p-16 bg-white border-t border-orange-100 flex justify-between items-center">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
            disabled={currentStep === 0} 
            className={`px-10 py-5 font-black text-xs uppercase tracking-[0.2em] transition-all rounded-2xl ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'}`}
          >
            ← Geri Dön
          </button>
          <button 
            onClick={handleNext} 
            className="px-16 py-6 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-orange-700 shadow-[0_20px_40px_-10px_rgba(234,88,12,0.4)] transition-all hover:-translate-y-1 active:scale-95"
          >
            {currentStep === FORM_STEPS.length - 1 ? 'Analizi Başlat' : 'Sonraki Adım →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;