
import React, { useState, useMemo, useRef } from 'react';
import { FORM_STEPS, MOCK_QUESTIONS } from '../constants';
import { Branch, Candidate } from '../types';

interface CandidateFormProps {
  onSubmit: (candidate: Omit<Candidate, 'id' | 'timestamp' | 'report'>) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 22,
    branch: Branch.OzelEgitim,
    experienceYears: 0,
    previousInstitutions: '',
    allTrainings: '',
    cvData: undefined as Candidate['cvData'] | undefined,
    answers: {} as Record<string, string | string[]>,
    status: 'pending' as const
  });

  const progress = useMemo(() => ((currentStep + 1) / FORM_STEPS.length) * 100, [currentStep]);

  const questions = useMemo(() => {
    const stepId = FORM_STEPS[currentStep].id;
    return MOCK_QUESTIONS[stepId as keyof typeof MOCK_QUESTIONS] || [];
  }, [currentStep]);

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
      if (!formData.name || !formData.email || !formData.phone) {
        alert("Lütfen temel iletişim bilgilerini eksiksiz doldurunuz.");
        return;
      }
    } else {
      const currentQuestionIds = questions.map((q: any) => q.id);
      const unanswered = currentQuestionIds.filter(id => !formData.answers[id]);
      if (unanswered.length > 0) {
        alert("Lütfen bu aşamadaki tüm senaryoları değerlendiriniz.");
        return;
      }
    }

    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit(formData);
    }
  };

  const updateAnswer = (qid: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, answers: { ...prev.answers, [qid]: value } }));
  };

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];

    if (step.id === 'personal') {
      return (
        <div className="space-y-10 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ad Soyad</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Adınız ve Soyadınız"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">E-Posta</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="E-posta adresiniz"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Telefon</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="05XX XXX XX XX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Yaş</label>
                  <input
                    type="number"
                    className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deneyim (Yıl)</label>
                  <input
                    type="number"
                    className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Branş</label>
                <select
                  className="w-full rounded-2xl border-2 border-slate-100 p-4 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all bg-white"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}
                >
                  {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Özgeçmiş Yükleme</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    formData.cvData ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200 hover:border-orange-400 hover:bg-white'
                  }`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
                    formData.cvData ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600'
                  }`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-500 text-center">
                    {formData.cvData ? formData.cvData.fileName : 'PDF / Görsel Seçin'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Önceki Çalıştığı Kurum ve Okullar</label>
              <textarea
                className="w-full rounded-2xl border-2 border-slate-100 p-6 h-32 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all resize-none bg-slate-50/20"
                value={formData.previousInstitutions}
                onChange={(e) => setFormData({...formData, previousInstitutions: e.target.value})}
                placeholder="Hangi kurumlarda ne kadar süre görev aldınız? (Açık uçlu cevap)"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aldığı Tüm Eğitimler ve Sertifikalar</label>
              <textarea
                className="w-full rounded-2xl border-2 border-slate-100 p-6 h-32 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all resize-none bg-slate-50/20"
                value={formData.allTrainings}
                onChange={(e) => setFormData({...formData, allTrainings: e.target.value})}
                placeholder="ABA, PECS, Denver, Ergoterapi yaklaşımları vb. aldığınız tüm profesyonel eğitimleri listeleyiniz..."
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {questions.map((q: any, idx: number) => (
          <div key={q.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-start gap-5 mb-6">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black">{idx + 1}</span>
              <label className="text-xl font-bold text-slate-900 leading-snug">{q.text}</label>
            </div>
            <div className="grid grid-cols-1 gap-3 ml-12">
              {q.type === 'radio' ? (
                q.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer(q.id, opt)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all font-bold text-sm ${
                      formData.answers[q.id] === opt 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-x-2' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-orange-200 hover:bg-orange-50/30'
                    }`}
                  >
                    {opt}
                  </button>
                ))
              ) : (
                <textarea
                  className="w-full rounded-2xl border-2 border-slate-100 p-6 h-40 focus:border-orange-500 outline-none font-medium text-slate-700 resize-none bg-slate-50/30"
                  value={formData.answers[q.id] as string || ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder="Lütfen bu durumu profesyonel bakış açınızla detaylandırınız..."
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-12 text-white relative">
          <div className="absolute right-12 top-12">
            <div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center font-black text-xl">
              %{Math.round(progress)}
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">{FORM_STEPS[currentStep].title}</h1>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">{FORM_STEPS[currentStep].description}</p>
        </div>
        <div className="p-12 min-h-[500px]">
          {renderStepContent()}
        </div>
        <div className="p-12 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} disabled={currentStep === 0} className={`px-8 py-4 font-black text-[11px] uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-900'}`}>← Geri Dön</button>
          <button onClick={handleNext} className="px-12 py-5 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all active:scale-95">
            {currentStep === FORM_STEPS.length - 1 ? 'Analizi Başlat' : 'Sonraki Aşama →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
