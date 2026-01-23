
import { Candidate, GlobalConfig } from '../types';

export interface StorageResult {
  success: boolean;
  error?: string;
}

export const storageService = {
  async getCandidates(forceRefresh = false): Promise<Candidate[]> {
    try {
      const response = await fetch(`/api/candidates?_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(remoteData));
        return remoteData.sort((a, b) => b.timestamp - a.timestamp);
      }
    } catch (e) {
      console.warn("Bulut bağlantısı kurulamadı. Yerel yedek veriler yükleniyor...");
    }

    const localStr = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
    return localData.sort((a, b) => b.timestamp - a.timestamp);
  },

  async saveCandidate(candidate: Candidate): Promise<StorageResult> {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });
      
      if (res.ok) {
        const localStr = localStorage.getItem('yeni_gun_candidates');
        const current = localStr ? JSON.parse(localStr) : [];
        localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidate, ...current]));
        return { success: true };
      } else {
        const errorData = await res.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.message || `Sunucu Hatası (Kod: ${res.status})` 
        };
      }
    } catch (e) {
      return { 
        success: false, 
        error: "Ağ hatası: Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin." 
      };
    }
  },

  async updateCandidate(candidate: Candidate): Promise<StorageResult> {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });
      if (res.ok) {
        const localStr = localStorage.getItem('yeni_gun_candidates');
        if (localStr) {
          const current: Candidate[] = JSON.parse(localStr);
          localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.map(c => c.id === candidate.id ? candidate : c)));
        }
        return { success: true };
      } else {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, error: errorData.message || "Güncelleme başarısız." };
      }
    } catch (e) {
      return { success: false, error: "Sunucu bağlantı hatası." };
    }
  },

  async deleteCandidate(id: string): Promise<boolean> {
    try { 
      const res = await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' }); 
      if (res.ok) {
        const localStr = localStorage.getItem('yeni_gun_candidates');
        if (localStr) {
          const current: Candidate[] = JSON.parse(localStr);
          localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter(c => c.id !== id)));
        }
        return true;
      }
    } catch (e) { }
    return false;
  },

  async deleteMultipleCandidates(ids: string[]): Promise<boolean> {
    try {
      await Promise.all(ids.map(id => fetch(`/api/candidates?id=${id}`, { method: 'DELETE' })));
      const localStr = localStorage.getItem('yeni_gun_candidates');
      if (localStr) {
        const current: Candidate[] = JSON.parse(localStr);
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter(c => !ids.includes(c.id))));
      }
      return true;
    } catch (e) { return false; }
  },

  async getConfig(): Promise<GlobalConfig | null> {
    try {
      const res = await fetch('/api/config');
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  },

  async saveConfig(config: GlobalConfig): Promise<boolean> {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return res.ok;
    } catch (e) { return false; }
  }
};
