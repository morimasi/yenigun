
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
          {/* ÜST PANEL: TEMEL BİLGİLER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* SOL: AD/İLETİŞİM (Kompakt Grid) */}
            <div className="lg:col-span-8 bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
               <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-2">01. Bireysel Profil</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Tam Adınız</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-100 p-3 font-bold text-slate-900 focus:border-orange-500 outline-none transition-all bg-slate-50/30"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="AD SOYAD"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Branş / Uzmanlık</label>
                    <select
                      className="w-full rounded-xl border border-slate-100 p-3 font-bold text-slate-900 focus:border-orange-500 outline-none transition-all bg-slate-50/30 appearance-none"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value as Branch})}
                    >
                      {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">E-Posta</label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-100 p-3 font-bold text-slate-800 focus:border-orange-500 outline-none transition-all bg-slate-50/30"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="E-POSTA"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Telefon</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-100 p-3 font-bold text-slate-800 focus:border-orange-500 outline-none transition-all bg-slate-50/30"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="TELEFON"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Yaş / Cinsiyet</label>
                    <div className="flex gap-2">
                       <input
                        type="number"
                        className="w-16 rounded-xl border border-slate-100 p-3 font-bold text-slate-900 outline-none bg-slate-50/30 text-center"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                      />
                      <select 
                        className="flex-1 rounded-xl border border-slate-100 p-3 font-bold text-slate-900 outline-none bg-slate-50/30"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
                      >
                         {['Belirtilmemiş', 'Kadın', 'Erkek'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
               </div>
            </div>

            {/* SAĞ: CV / DOSYA (Kompakt Dropzone) */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-4 p-6 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                formData.cvData ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 hover:border-orange-400 text-slate-400'
              }`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${formData.cvData ? 'bg-orange-600' : 'bg-white shadow-sm'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={formData.cvData ? "M5 13l4 4L19 7" : "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"} />
                </svg>
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest">{formData.cvData ? 'CV YÜKLENDİ' : 'CV / PORTFOLYO YÜKLE'}</h4>
              <p className="text-[8px] font-bold opacity-60 mt-1 uppercase">{formData.cvData ? formData.cvData.fileName : 'PDF / JPG (MAX 5MB)'}</p>
            </div>
          </div>

          {/* ORTA PANEL: AKADEMİK GEÇMİŞ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
             <div className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">02. Akademik Geçmiş</h3>
                <div className="grid grid-cols-1 gap-4">
                   <SearchableSelect label="Mezun Olunan Üniversite" options={TURKISH_UNIVERSITIES} value={formData.university} onChange={(v) => setFormData({...formData, university: v})} />
                   <SearchableSelect label="Mezun Olunan Bölüm" options={TURKISH_DEPARTMENTS} value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
                </div>
             </div>
             <div className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">03. Klinik Deneyim</h3>
                <div className="grid grid-cols-1 gap-4">
                   <div className="flex gap-4">
                      <div className="w-24 space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Tecrübe (Yıl)</label>
                        <input type="number" className="w-full rounded-xl border border-slate-100 p-3 font-black text-slate-900 outline-none bg-slate-50/30 text-center" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Daha Önceki Kurumlar</label>
                        <input type="text" className="w-full rounded-xl border border-slate-100 p-3 font-bold text-slate-800 outline-none bg-slate-50/30" value={formData.previousInstitutions} onChange={(e) => setFormData({...formData, previousInstitutions: e.target.value})} placeholder="Kurum adlarını virgülle ayırın..." />
                      </div>
                   </div>
                   <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100/50">
                      <p className="text-[10px] font-bold text-orange-800 leading-tight">
                        * Verdiğiniz deneyim bilgileri, senaryo testindeki liyakat puanlamanızı doğrudan etkileyecektir.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* ALT PANEL: SERTİFİKALAR (Kompakt Chip Dizilimi) */}
          <div className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">04. Akreditasyonlar ve Eğitimler</h3>
              <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full">{formData.allTrainings.length} SEÇİLİ</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATION_LIST.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleTraining(cert)}
                  className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border ${
                    formData.allTrainings.includes(cert)
                      ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {cert.split('(')[0].trim()}
                </button>
              ))}
              <div className="flex-1 min-w-[200px]">
                 <input
                  type="text"
                  className="w-full bg-slate-100 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 outline-none border border-transparent focus:border-orange-600"
                  value={otherTrainings}
                  onChange={(e) => setOtherTrainings(e.target.value)}
                  placeholder="Diğer eğitimleri buraya yazın..."
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-10 animate-fade-in">
        {questions.map((q: any, idx: number) => (
          <div key={q.id} className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-start gap-4 md:gap-6 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm md:text-lg font-black shrink-0 shadow-lg">
                {idx + 1}
              </div>
              <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight pt-1">
                {q.text}
              </h4>
            </div>
            
            <div className="grid grid-cols-1 gap-3 pl-0 md:pl-16">
              {q.type === 'radio' ? (
                q.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer(q.id, opt)}
                    className={`text-left p-4 md:p-5 rounded-2xl border-2 transition-all font-bold text-sm md:text-base relative ${
                      formData.answers[q.id] === opt 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-[1.01] z-10' 
                      : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.answers[q.id] === opt ? 'border-white bg-white' : 'border-slate-300'}`}>
                          {formData.answers[q.id] === opt && <div className="w-2 h-2 bg-orange-600 rounded-full"></div>}
                       </div>
                       <span>{opt}</span>
                    </div>
                  </button>
                ))
              ) : (
                <textarea
                  className="w-full rounded-2xl border-2 border-slate-100 p-6 h-40 focus:border-orange-500 outline-none font-semibold text-slate-800 resize-none bg-slate-50/30"
                  value={formData.answers[q.id] as string || ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder="Yaklaşımınızı ve teknik gerekçelerinizi buraya yazın..."
                />
              )}
            </div>
            {/* Arka Plan Dekorasyonu */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white">
        
        {/* HEADER: DİNAMİK PROGRESS */}
        <div className="bg-slate-900 p-8 md:p-12 text-white relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-orange-600 text-[10px] font-black uppercase rounded-lg tracking-widest">Adım {currentStep + 1} / {FORM_STEPS.length}</span>
               <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 transition-all duration-700" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2 leading-none">{FORM_STEPS[currentStep].title}</h1>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest opacity-80">{FORM_STEPS[currentStep].description}</p>
          </div>
          {/* Mobil İlerleme Halkası */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
             <div className="w-20 h-20 rounded-full border-4 border-white/5 flex items-center justify-center text-xl font-black text-orange-600">
               %{Math.round(progress)}
             </div>
          </div>
        </div>
        
        {/* FORM GÖVDESİ */}
        <div className="p-4 md:p-10 min-h-[500px]">
          {renderStepContent()}
        </div>

        {/* NAVİGASYON: ALT BAR */}
        <div className="p-6 md:p-10 bg-white border-t border-slate-100 flex justify-between items-center sticky bottom-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
            className={`px-6 py-3 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'}`}
          >
            ← GERİ DÖN
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleNext} 
              className="px-8 md:px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              {currentStep === FORM_STEPS.length - 1 ? (
                <>
                  <span>BAŞVURUYU TAMAMLA</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </>
              ) : (
                <>
                  <span>İLERLE</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER BİLGİ */}
      <div className="mt-8 text-center pb-10">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] leading-relaxed">
           YENİ GÜN AKADEMİ ADAY DEĞERLENDİRME SİSTEMİ <br />
           <span className="text-orange-600/50">LİYAKAT • BİLİMSEL TEMELLİ YAKLAŞIM • ETİK DEĞERLER</span>
         </p>
      </div>
    </div>
  );
};

export default CandidateForm;
