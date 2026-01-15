
import React from 'react';
import { AIReport, Candidate } from '../types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export interface ReportCustomizationOptions {
  showPersonalDetails: boolean;
  showAcademicBackground: boolean;
  showAIAnalysis: boolean;
  showSWOT: boolean;
  showCompetencyMap: boolean;
  showInterviewNotes: boolean;
  headerTitle?: string;
}

interface CandidateReportProps {
  report?: AIReport;
  candidate: Candidate;
  options?: ReportCustomizationOptions;
}

const defaultOptions: ReportCustomizationOptions = {
  showPersonalDetails: true,
  showAcademicBackground: true,
  showAIAnalysis: true,
  showSWOT: true,
  showCompetencyMap: true,
  showInterviewNotes: true
};

const SectionHeader: React.FC<{ title: string; number: string }> = ({ title, number }) => (
  <div className="flex items-center gap-4 mb-6 border-b-2 border-slate-900 pb-2 break-after-avoid mt-8 first:mt-0">
    <span className="text-[12px] font-black bg-slate-900 text-white px-3 py-1 rounded-md">{number}</span>
    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{title}</h3>
  </div>
);

const AnalysisRow: React.FC<{ title: string; data: any }> = ({ title, data }) => {
  if (!data) return null;
  return (
    <div className="py-6 border-b border-slate-100 last:border-0 break-inside-avoid">
      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-4">
          <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</h5>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-slate-900">%{data.score || 0}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600" style={{ width: `${data.score || 0}%` }}></div>
            </div>
          </div>
        </div>
        <div className="col-span-8">
          <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-4">"{data.comment || ''}"</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[7px] font-black text-orange-600 uppercase block mb-1">Klinik Avantaj</span>
              <p className="text-[9px] font-bold text-slate-600 leading-tight">{data.shortTermImpact || 'Beyan Yok'}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Kurumsal Risk</span>
              <p className="text-[9px] font-bold text-slate-600 leading-tight">{data.longTermImplication || 'Beyan Yok'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateReport: React.FC<CandidateReportProps> = ({ report, candidate, options = defaultOptions }) => {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white p-[15mm] w-[210mm] text-slate-900 relative" id="report-export-area" style={{ minHeight: '297mm' }}>
      
      {/* PROFESSIONAL HEADER */}
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10 mb-10 break-after-avoid">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl">YG</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Yeni Gün Akademi</p>
              <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.1em]">{options.headerTitle || 'Akademik Liyakat ve Uzmanlık Raporu'}</h2>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-slate-900">{candidate.name}</h1>
            <p className="text-sm font-black text-orange-600 uppercase tracking-widest">{candidate.branch}</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-1">Kümülatif Skor</p>
            <p className="text-5xl font-black">%{report?.score || '?'}</p>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {dateStr} <br />
            ID: {candidate.id.toUpperCase().slice(0, 12)}
          </div>
        </div>
      </div>

      {/* SECTION I: PERSONAL & BACKGROUND */}
      {options.showPersonalDetails && (
        <section className="mb-12 break-inside-avoid">
          <SectionHeader title="Aday Tanımlama ve Profil Verileri" number="01" />
          <div className="grid grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[7px] font-black text-slate-400 uppercase block mb-1.5">Kıdem ve Uzmanlık</span>
              <p className="text-[11px] font-bold text-slate-900">{candidate.branch}</p>
              <p className="text-[10px] font-black text-orange-600 uppercase mt-1">{candidate.experienceYears} Yıllık Deneyim</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[7px] font-black text-slate-400 uppercase block mb-1.5">İletişim Portu</span>
              <p className="text-[10px] font-bold text-slate-800">{candidate.email}</p>
              <p className="text-[10px] font-bold text-slate-800">{candidate.phone}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[7px] font-black text-slate-400 uppercase block mb-1.5">Demografik Profil</span>
              <p className="text-[10px] font-bold text-slate-800">{candidate.age} Yaş / {candidate.gender}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Status: {candidate.status.toUpperCase()}</p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION II: ACADEMIC HISTORY */}
      {options.showAcademicBackground && (
        <section className="mb-12 break-inside-avoid">
          <SectionHeader title="Akademik Geçmiş ve Teknik Donanım" number="02" />
          <div className="space-y-6">
            <div className="p-8 bg-white border-2 border-slate-50 rounded-3xl relative overflow-hidden">
              <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4">Mesleki Yolculuk ve Önemli Kurumlar</h4>
              <p className="text-[11px] font-bold text-slate-700 leading-relaxed whitespace-pre-wrap italic">
                {candidate.previousInstitutions || 'Geçmiş kurum bilgisi paylaşılmamıştır.'}
              </p>
            </div>

            <div className="p-8 bg-white border-2 border-slate-50 rounded-3xl">
              <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4">Sertifikalar ve Akreditasyonlar</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.allTrainings && candidate.allTrainings.length > 0 ? (
                  candidate.allTrainings.map((train, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-tight">
                      {train}
                    </span>
                  ))
                ) : (
                  <p className="text-[10px] font-bold text-slate-400 italic">Akredite eğitim beyanı bulunmuyor.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION III: FULL AI ANALYSIS */}
      {options.showAIAnalysis && report && (
        <section className="mb-12">
          <SectionHeader title="Yapay Zeka Destekli Stratejik Analiz" number="03" />
          <div className="p-10 bg-slate-900 rounded-[2rem] text-white shadow-xl mb-10 break-inside-avoid">
            <p className="text-sm font-bold italic leading-relaxed text-center">"{report.summary}"</p>
          </div>

          <div className="space-y-2">
             <AnalysisRow title="Metodolojik Pedagoji" data={report.detailedAnalysis.pedagogy} />
             <AnalysisRow title="Klinik Muhakeme" data={report.detailedAnalysis.clinicalWisdom} />
             <AnalysisRow title="Etik Bütünlük" data={report.detailedAnalysis.ethics} />
             <AnalysisRow title="Duygusal Dayanıklılık" data={report.detailedAnalysis.emotionalResilience} />
             <AnalysisRow title="Kurumsal Uyum" data={report.detailedAnalysis.institutionalFit} />
             <AnalysisRow title="Kriz ve Stres Yönetimi" data={report.detailedAnalysis.stressResponse} />
          </div>
        </section>
      )}

      {/* SECTION IV: SWOT & COMPETENCY */}
      {(options.showCompetencyMap || options.showSWOT) && report && (
        <section className="mb-12 break-inside-avoid">
          <SectionHeader title="Yetkinlik Matrisi ve SWOT Analizi" number="04" />
          <div className="grid grid-cols-2 gap-10">
            {options.showCompetencyMap && (
              <div className="h-[350px] bg-white border-2 border-slate-100 rounded-[2rem] p-8">
                <h4 className="text-[8px] font-black text-slate-900 uppercase tracking-widest text-center mb-6">Yetkinlik Haritası (Klinik & Akademik)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={report.competencies}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 7, fontWeight: 900, fill: '#64748b' }} />
                      <Radar dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {options.showSWOT && (
              <div className="flex flex-col gap-6">
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <span className="text-[7px] font-black text-emerald-700 uppercase block mb-3 tracking-widest">Güçlü Yönler (Stratejik Varlıklar)</span>
                  <ul className="space-y-2">
                    {report.swot.strengths.map((s, i) => (
                      <li key={i} className="text-[9px] font-bold text-emerald-800 leading-tight flex gap-2">
                        <span className="text-emerald-400">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                  <span className="text-[7px] font-black text-rose-700 uppercase block mb-3 tracking-widest">Kritik Risk Alanları (Projeksiyon)</span>
                  <ul className="space-y-2">
                    {report.swot.weaknesses.map((w, i) => (
                      <li key={i} className="text-[9px] font-bold text-rose-800 leading-tight flex gap-2">
                        <span className="text-rose-400">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 p-6 bg-slate-50 border-l-4 border-orange-600 rounded-r-3xl">
             <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">Karar ve Atama Önerisi</h4>
             <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
               {report.recommendation}
             </p>
          </div>
        </section>
      )}

      {/* SECTION V: INTERVIEW NOTES */}
      {options.showInterviewNotes && (
        <section className="mb-12 break-inside-avoid">
          <SectionHeader title="Mülakat Gözlemleri ve Kurul Notları" number="05" />
          <div className="space-y-6">
             <div className="p-10 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] min-h-[350px] relative">
                <div className="grid grid-cols-1 gap-8">
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} className="h-px bg-slate-100 w-full mt-8"></div>
                   ))}
                </div>
                <div className="absolute top-10 left-10 opacity-30">
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Kurul Üyesi El Yazısı Notları...</span>
                </div>
             </div>
             <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                   <div className="space-y-4">
                      {['OLUMLU', 'BEKLEMEDE', 'OLUMSUZ'].map(s => (
                        <div key={s} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border-2 border-slate-300"></div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="col-span-2 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-end justify-between px-10">
                   <div className="text-center">
                     <div className="w-40 h-px bg-slate-300 mb-2"></div>
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Üye İmzası</span>
                   </div>
                   <div className="text-center">
                     <div className="w-40 h-px bg-slate-300 mb-2"></div>
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Kurul Başkanı Onayı</span>
                   </div>
                </div>
             </div>
          </div>
        </section>
      )}

      {/* PROFESSIONAL FOOTER */}
      <div className="mt-20 pt-8 border-t-2 border-slate-900 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] break-inside-avoid">
        <div className="space-y-1">
          <span>YENİ GÜN AKADEMİ AKADEMİK KURUL DENETİM RAPORU</span>
          <div className="flex gap-2 text-rose-600">
            <span>• GİZLİ VERİ</span>
            <span>• RESMİ KAYITTIR</span>
          </div>
        </div>
        <div className="text-right">
          <span>VERIFY: {Math.random().toString(36).substr(2, 10).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
