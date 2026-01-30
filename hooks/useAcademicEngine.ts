
import { useState, useCallback, useEffect } from 'react';
import { Candidate, GlobalConfig } from '../types';
import { storageService } from '../services/storageService';
import { generateCandidateAnalysis } from '../geminiService';
import { calculateAlgorithmicAnalysis } from '../analysisUtils';

export const useAcademicEngine = (initialConfig: GlobalConfig) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<GlobalConfig>(initialConfig);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('yeni_gun_admin_token'));

  const loadData = useCallback(async (isManual = true) => {
    if (isManual) setIsProcessing(true);
    try {
      const data = await storageService.getCandidates(true);
      setCandidates(data);
      const remoteConfig = await storageService.getConfig();
      if (remoteConfig) setConfig(prev => ({ ...prev, ...remoteConfig }));
    } catch (e: any) {
      if (e.message === "UNAUTHORIZED") setIsLoggedIn(false);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const analyzeCandidate = async (candidateId: string) => {
    setIsProcessing(true);
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) throw new Error("Aday bulunamadı.");

      // Muhakeme motorunu tetikle
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      
      const updatedCandidate = JSON.parse(JSON.stringify({ 
        ...candidate, 
        report: aiReport, 
        algoReport: algoReport, 
        timestamp: Date.now() 
      }));
      
      // REAKTİF GÜNCELLEME: Global state'i mühürle
      setCandidates(prev => {
        const index = prev.findIndex(c => c.id === candidateId);
        if (index === -1) return prev;
        const newList = [...prev];
        newList[index] = updatedCandidate;
        return newList;
      });
      
      // Kalıcı depolama
      await storageService.updateCandidate(updatedCandidate);
      
      return { success: true };
    } catch (e) {
      console.error("Nöral Analiz Hatası:", e);
      return { success: false, error: "AI Analizi başarısız oldu. Model zaman aşımı." };
    } finally {
      setIsProcessing(false);
    }
  };

  const submitCandidate = async (formData: any) => {
    setIsProcessing(true);
    const candidateId = Math.random().toString(36).substr(2, 9);
    const newCandidate: Candidate = { ...formData, id: candidateId, timestamp: Date.now(), status: 'pending' };
    const result = await storageService.saveCandidate(newCandidate);
    if (result.success && isLoggedIn) await loadData(false);
    setIsProcessing(false);
    return result;
  };

  return {
    candidates, config, isProcessing, isLoading, isLoggedIn,
    setIsLoggedIn, loadData, submitCandidate, analyzeCandidate, logout: () => { localStorage.removeItem('yeni_gun_admin_token'); setIsLoggedIn(false); }, setConfig
  };
};
