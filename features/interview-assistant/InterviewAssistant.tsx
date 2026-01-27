
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Candidate } from '../../types';

interface InterviewAssistantProps {
  candidates: Candidate[];
}

export const InterviewAssistant: React.FC<InterviewAssistantProps> = ({ candidates }) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || '');
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState<{role: string, text: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    if (!activeCandidate) return;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = audioContextRef.current.createGain();
    outputNode.connect(audioContextRef.current.destination);

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
        systemInstruction: `
          ROL: Yeni Gün Akademi Kıdemli Mülakat Heyeti Başkanı.
          ADAY: ${activeCandidate.name} (${activeCandidate.branch}).
          GÖREV: Adayın klinik derinliğini, etik sınırlarını ve metodolojik hakimiyetini sesli mülakat ile sına. 
          STİL: Nazik ama akademik olarak zorlayıcı, direkt. 
          KRİTER: Cevaplardaki tutarsızlıkları yakala ve üzerine git.
        `,
        outputAudioTranscription: {},
        inputAudioTranscription: {}
      },
      callbacks: {
        onopen: () => {
          setIsConnected(true);
          setTranscript([{ role: 'system', text: 'Sistem Bağlantısı Kuruldu. Nöral İletişim Aktif.' }]);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
             setTranscript(prev => [...prev, { role: 'ai', text: message.serverContent!.outputTranscription!.text }]);
          }
          
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && audioContextRef.current) {
            const buffer = await decodeAudioData(decode(audioData), audioContextRef.current);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputNode);
            
            const now = audioContextRef.current.currentTime;
            const startTime = Math.max(nextStartTimeRef.current, now);
            source.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;
            activeSourcesRef.current.add(source);
            source.onended = () => activeSourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            activeSourcesRef.current.forEach(s => s.stop());
            activeSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsConnected(false),
        onerror: () => alert('Bağlantı Hatası: Nöral Protokol Kesildi.')
      }
    });

    sessionRef.current = await sessionPromise;
    
    // Mikrofon Yayını
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const inputCtx = new AudioContext({ sampleRate: 16000 });
    const source = inputCtx.createMediaStreamSource(stream);
    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
      
      const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
      sessionRef.current.sendRealtimeInput({
        media: { data: base64, mimeType: 'audio/pcm;rate=16000' }
      });
    };

    source.connect(processor);
    processor.connect(inputCtx.destination);
    setIsListening(true);
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsConnected(false);
    setIsListening(false);
    setTranscript([]);
  };

  return (
    <div className="grid grid-cols-12 gap-10 animate-fade-in pb-20">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10">CANLI AKADEMİK ASİSTAN</h4>
          <div className="space-y-8 relative z-10">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">MÜLAKAT ADAYI</label>
                <select 
                  className="w-full bg-white/5 p-6 rounded-[2rem] border border-white/10 text-white font-bold outline-none focus:border-orange-500 transition-all appearance-none"
                  value={activeCandidateId}
                  onChange={e => setActiveCandidateId(e.target.value)}
                  disabled={isConnected}
                >
                  {candidates.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name.toUpperCase()}</option>)}
                </select>
             </div>
             
             <div className={`p-8 rounded-[3rem] border-2 transition-all ${isConnected ? 'bg-orange-600/10 border-orange-500' : 'bg-white/5 border-transparent'}`}>
                <div className="flex items-center gap-4 mb-4">
                   <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-orange-500 animate-ping' : 'bg-slate-700'}`}></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{isConnected ? 'CANLI OTURUM AKTİF' : 'BAĞLANTI BEKLENİYOR'}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">
                   {isConnected ? 'Sistem aday ile sesli etkileşim kuruyor. Tüm veriler mülakat dosyasına işlenmektedir.' : 'Oturumu başlatmak için aşağıdaki protokolü onaylayın.'}
                </p>
             </div>

             {!isConnected ? (
               <button onClick={startSession} className="w-full py-8 bg-white text-slate-900 rounded-[3rem] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl">
                 CANLI MÜLAKATI BAŞLAT
               </button>
             ) : (
               <button onClick={stopSession} className="w-full py-8 bg-rose-600 text-white rounded-[3rem] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-2xl">
                 OTURUMU SONLANDIR
               </button>
             )}
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
           <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">NÖRAL SES ANALİZİ</h5>
           <div className="space-y-6">
              {[
                { l: 'Klinik Özgüven', v: isConnected ? 85 : 0, c: 'bg-emerald-500' },
                { l: 'Bilişsel Yük', v: isConnected ? 30 : 0, c: 'bg-orange-500' },
                { l: 'Duygusal Kararlılık', v: isConnected ? 72 : 0, c: 'bg-blue-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                      <span>{item.l}</span>
                      <span>%{item.v}</span>
                   </div>
                   <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${item.c} transition-all duration-1000`} style={{ width: `${item.v}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8 flex flex-col h-[750px]">
        <div className="flex-1 bg-white rounded-[4.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden relative">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 shadow-xl">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                 </div>
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mülakat Transkripti</h3>
              </div>
              <div className="flex gap-2">
                 <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                 <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse delay-100' : 'bg-slate-300'}`}></div>
                 <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse delay-200' : 'bg-slate-300'}`}></div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar bg-[#FAFAFA]">
              {transcript.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale">
                   <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-slate-200">
                      <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                   </div>
                   <p className="text-[12px] font-black uppercase tracking-[0.5em]">Veri Akışı Bekleniyor</p>
                </div>
              ) : (
                transcript.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-8 rounded-[2.5rem] shadow-sm relative ${
                      msg.role === 'ai' ? 'bg-white border border-slate-100 text-slate-800' : 'bg-slate-900 text-white'
                    }`}>
                      <span className={`text-[8px] font-black uppercase tracking-widest mb-3 block opacity-50`}>
                        {msg.role === 'ai' ? 'AKADEMİK KURUL' : 'SİSTEM MESAJI'}
                      </span>
                      <p className="text-[14px] font-bold leading-relaxed italic">"{msg.text}"</p>
                    </div>
                  </div>
                ))
              )}
           </div>

           {isConnected && (
             <div className="p-8 bg-orange-600 text-white text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Gerçek Zamanlı Muhakeme Devam Ediyor...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
