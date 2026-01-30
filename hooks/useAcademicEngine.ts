
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
    if (isManual) setIsLoading(true);
    try {
      const data = await storageService.getCandidates(true);
      if (Array.isArray(data)) {
        setCandidates(data);
      }
      const remoteConfig = await storageService.getConfig();
      if (remoteConfig) setConfig(prev => ({ ...prev, ...remoteConfig }));
    } catch (e: any) {
      if (e.message === "UNAUTHORIZED") setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeCandidate = async (candidateId: string) => {
    setIsProcessing(true);
    try {
      // Önce veritabanından adayın full verisini çek (CV vb. için)
      const freshCandidates = await storageService.getCandidates(true);
      const candidate = freshCandidates.find(c => c.id === candidateId);
      if (!candidate) throw new Error("Aday dosyası bulunamadı.");

      // AI ve Algoritmik analizleri çalıştır
      const aiReport = await generateCandidateAnalysis(candidate, config);
      const algoReport = calculateAlgorithmicAnalysis(candidate, config);
      
      const updatedCandidate = { 
        ...candidate, 
        report: aiReport, 
        algoReport: algoReport, 
        timestamp: Date.now() 
      };
      
      // Veritabanına kaydet
      const saveResult = await storageService.updateCandidate(updatedCandidate);
      if (!saveResult.success) throw new Error("Veritabanı kayıt hatası");

      // Local state güncelle
      setCandidates(prev => prev.map(c => c.id === candidateId ? updatedCandidate : c));
      
      return { success: true };
    } catch (e) {
      console.error("Analiz Motoru Çökmesi:", e);
      return { success: false, error: "AI Analizi başarısız oldu. Teknik detay: JSON Truncation or DB Lock." };
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
    setIsLoggedIn, loadData, submitCandidate, analyzeCandidate, 
    logout: () => { localStorage.removeItem('yeni_gun_admin_token'); setIsLoggedIn(false); }, 
    setConfig
  };
};
