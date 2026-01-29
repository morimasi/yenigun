
import React, { useState, useMemo } from 'react';
import { Candidate, CommChannel, CommTemplate, NotificationLog } from '../../types';

interface CommunicationCenterProps {
  candidates: Candidate[];
  staff?: any[];
}

const DEFAULT_TEMPLATES: CommTemplate[] = [
  {
    id: 'interview_invite',
    name: 'Mülakat Daveti (Resmi)',
    subject: 'Akademik Mülakat Randevu Talebi',
    body: 'Sayın {name}, \n\nAkademi kurulumuzca yapılan ön değerlendirme neticesinde, uzmanlık profilinizi yakından tanımak adına sizinle bir mülakat gerçekleştirmek istiyoruz.\n\nTarih: {date}\nKonum: {location}',
    channels: ['email', 'whatsapp']
  },
  {
    id: 'rejection',
    name: 'Olumsuz Dönüş',
    subject: 'Başvuru Değerlendirme Sonucu',
    body: 'Sayın {name}, \n\nBaşvurunuz akademik kurulumuzca incelenmiş olup, şu aşamada olumlu bir ilerleme kaydedemeyeceğimizi üzülerek bildiririz. Dosyanız ileride değerlendirilmek üzere akademik arşivimize mühürlenmiştir.',
    channels: ['email']
  },
  {
    id: 'quick_wa',
    name: 'Hızlı WhatsApp İletişim',
    body: 'Merhaba {name}, Yeni Gün Akademi mülakat süreciniz hakkında sizinle görüşmek istiyorum. Müsait olduğunuzda dönebilir misiniz?',
    channels: ['whatsapp', 'sms']
  }
];

const CommunicationCenter: React.FC<CommunicationCenterProps> = ({ candidates }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTemplate, setActiveTemplate] = useState<CommTemplate | null>(null);
  const [customBody, setCustomBody] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [activeChannels, setActiveChannels] = useState<CommChannel[]>(['email']);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const targets = useMemo(() => candidates.filter(c => selectedIds.has(c.id)), [candidates, selectedIds]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleApplyTemplate = (temp: CommTemplate) => {
    setActiveTemplate(temp);
    setCustomBody(temp.body);
    setCustomSubject(temp.subject || '');
    setActiveChannels(temp.channels);
  };

  const processQueue = async () => {
    if (targets.length === 0) return alert("Lütfen en az bir alıcı seçiniz.");
    if (!customBody) return alert("Mesaj içeriği boş olamaz.");

    setIsProcessing(true);
    setProgress(0);
    const newLogs: NotificationLog[] = [];

    for (let i = 0; i < targets.length; i++) {
      const candidate = targets[i];
      for (const channel of activeChannels) {
        // Dinamik Değişkenleri Yerleştir
        const finalizedBody = customBody
          .replace(/{name}/g, candidate.name)
          .replace(/{date}/g, candidate.interviewSchedule?.date || '[Tarih Belirlenmedi]')
          .replace(/{location}/g, 'Yeni Gün Akademi Merkez Kampüsü');

        try {
          const res = await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetEmail: candidate.email,
              targetPhone: candidate.phone,
              targetName: candidate.name,
              channel,
              subject: customSubject,
              body: finalizedBody
            })
          });

          if (!res.ok) throw new Error("API_ERROR");

          newLogs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            targetId: candidate.id,
            targetName: candidate.name,
            channel,
            status: 'sent',
            timestamp: Date.now()
          });
        } catch (e) {
          newLogs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            targetId: candidate.id,
            targetName: candidate.name,
            channel,
            status: 'failed',
            timestamp: Date.now(),
            errorMessage: 'Bağlantı hatası'
          });
        }
      }
      setProgress(Math.round(((i + 1) / targets.length) * 100));
      await new Promise(r => setTimeout(r, 200)); // Nöral Gecikme
    }

    setLogs(prev => [...newLogs, ...prev]);
    setIsProcessing(false);
    alert("Operasyon tamamlandı.");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-32 items-stretch h-[85vh]">
      
      {/* SOL: ALICI HAVUZU */}
      <div className="lg:w-[320px] bg-white rounded-[3rem] border border-slate-100 shadow-xl flex flex-col overflow-hidden no-print">
         <div className="p-8 border-b border-slate-50">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">ALICI SEÇİMİ ({selectedIds.size})</h4>
            <div className="flex gap-2">
               <button onClick={() => setSelectedIds(new Set(candidates.map(c => c.id)))} className="flex-1 py-2 bg-slate-50 text-[9px] font-black uppercase rounded-lg hover:bg-slate-900 hover:text-white transition-all">TÜMÜ</button>
               <button onClick={() => setSelectedIds(new Set())} className="flex-1 py-2 bg-slate-50 text-[9px] font-black uppercase rounded-lg hover:bg-rose-500 hover:text-white transition-all">TEMİZLE</button>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {candidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => toggleSelect(c.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  selectedIds.has(c.id) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-500'
                }`}
              >
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${selectedIds.has(c.id) ? 'bg-orange-600' : 'bg-slate-200'}`}>{c.name.charAt(0)}</div>
                 <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black uppercase truncate">{c.name}</p>
                    <p className="text-[8px] font-bold opacity-60 truncate">{c.email}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* ORTA: MESAJ KOMPOZİSYON KANVASI */}
      <div className="flex-1 flex flex-col gap-6">
         <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl space-y-8 flex-1 flex flex-col">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Bildirim Merkezi</h3>
               <div className="flex gap-3">
                  {(['email', 'whatsapp', 'sms'] as CommChannel[]).map(ch => (
                     <button 
                       key={ch}
                       onClick={() => setActiveChannels(prev => prev.includes(ch) ? prev.filter(x => x !== ch) : [...prev, ch])}
                       className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                         activeChannels.includes(ch) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white text-slate-300'
                       }`}
                     >
                        {ch}
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
               {DEFAULT_TEMPLATES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => handleApplyTemplate(t)}
                    className="px-6 py-3 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase whitespace-nowrap border border-orange-100 hover:bg-orange-600 hover:text-white transition-all"
                  >
                     {t.name}
                  </button>
               ))}
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
               {activeChannels.includes('email') && (
                 <input 
                   type="text"
                   placeholder="E-Posta Konusu..."
                   className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-orange-500 outline-none transition-all"
                   value={customSubject}
                   onChange={e => setCustomSubject(e.target.value)}
                 />
               )}
               <textarea 
                 placeholder="Mesaj içeriğini buraya yazın veya şablon seçin. Değişkenler: {name}, {date}, {location}"
                 className="w-full flex-1 bg-slate-50 p-8 rounded-[2.5rem] font-bold text-base border-2 border-transparent focus:border-orange-500 outline-none transition-all resize-none shadow-inner"
                 value={customBody}
                 onChange={e => setCustomBody(e.target.value)}
               />
            </div>

            <div className="pt-4 border-t border-slate-50">
               <button 
                 onClick={processQueue}
                 disabled={isProcessing}
                 className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
               >
                  {isProcessing ? `İLETİLİYOR %${progress}` : `${targets.length} ADRESE GÖNDERİMİ BAŞLAT`}
               </button>
            </div>
         </div>
      </div>

      {/* SAĞ: CANLI LOG & GEÇMİŞ */}
      <div className="lg:w-[400px] bg-slate-950 rounded-[4rem] shadow-3xl border border-white/5 flex flex-col overflow-hidden relative group">
         <div className="p-10 border-b border-white/5 relative z-10">
            <h4 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.5em]">İLETİŞİM GÜNCESİ</h4>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 relative z-10">
            {logs.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-10">
                  <svg className="w-16 h-16 text-white mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest leading-relaxed">Aktif gönderim kaydı bulunamadı.</p>
               </div>
            ) : (
               logs.map(log => (
                  <div key={log.id} className="p-5 bg-white/5 rounded-[2rem] border border-white/5 flex items-start gap-5 group/log hover:bg-white/10 transition-all">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${log.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           {log.status === 'sent' ? <path d="M5 13l4 4L19 7" /> : <path d="M6 18L18 6M6 6l12 12" />}
                        </svg>
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center mb-1">
                           <p className="text-[11px] font-black text-white uppercase truncate">{log.targetName}</p>
                           <span className="text-[8px] font-bold text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{log.channel} aracılığıyla {log.status === 'sent' ? 'iletildi' : 'hata oluştu'}</p>
                     </div>
                  </div>
               ))
            )}
         </div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default CommunicationCenter;
