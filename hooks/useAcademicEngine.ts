
import { useState, useCallback, useRef } from 'react';
import { Candidate, GlobalConfig } from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { calculateAlgorithmicAnalysis } from '../analysisUtils';

export const useAcademicEngine = (initialConfig: GlobalConfig) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<GlobalConfig>(initialConfig);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('yeni_gun_admin_token'));

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setIsProcessing(true);
    if (!isManual && candidates.length === 0) setIsLoading(true);

    try {
      const data = await storageService.getCandidates(isManual);
      setCandidates(data);
      
      const remoteConfig = await storageService.getConfig();
      if (remoteConfig) {
        setConfig(prev => ({ ...prev, ...remoteConfig }));
        document.documentElement.style.setProperty('--primary-color', remoteConfig.primaryColor);
      }
    } catch (e: any) {
      if (e.message === "UNAUTHORIZED") setIsLoggedIn(false);
      console.error("MIA Hook Error: Veri yüklenemedi", e);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [candidates.length]);

  const submitCandidate = async (formData: any) => {
    setIsProcessing(true);
    const candidateId = Math.random().toString(36).substr(2, 9);
    const newCandidate: Candidate = {
      ...formData,
      id: candidateId,
      timestamp: Date.now(),
      status: 'pending'
    };

    const result = await storageService.saveCandidate(newCandidate);
    if (result.success && isLoggedIn) loadData(true);
    setIsProcessing(false);
    return result;
  };

  const analyzeCandidate = async (candidateId: string) => {
    setIsProcessing(true);
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) throw new Error("Aday bulunamadı.");

      const algoReport = calculateAlgorithmicAnalysis(candidate);
      const aiReport = await aiService.analyzeCandidate(candidate, config);
      
      const updatedCandidate = { ...candidate, report: aiReport, algoReport, timestamp: Date.now() };
      await storageService.updateCandidate(updatedCandidate);
      
      setCandidates(prev => prev.map(c => c.id === candidateId ? updatedCandidate : c));
      return { success: true };
    } catch (e) {
      console.error("AI Analiz Hatası:", e);
      return { success: false, error: "AI Analizi başarısız." };
    } finally {
      setIsProcessing(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('yeni_gun_admin_token');
    setIsLoggedIn(false);
  };

  return {
    candidates,
    config,
    isProcessing,
    isLoading,
    isLoggedIn,
    setIsLoggedIn,
    loadData,
    submitCandidate,
    analyzeCandidate,
    logout,
    setConfig
  };
};
