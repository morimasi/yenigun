
import { Candidate, GlobalConfig } from '../types';

export interface StorageResult {
  success: boolean;
  error?: string;
}

export const storageService = {
  getAuthHeader() {
    const token = localStorage.getItem('yeni_gun_admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('yeni_gun_admin_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.message || 'Giriş başarısız.' };
    } catch (e) {
      return { success: false, error: 'Sunucuya bağlanılamadı.' };
    }
  },

  async getCandidates(forceRefresh = false): Promise<Candidate[]> {
    try {
      const response = await fetch(`/api/candidates?_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 
          'Pragma': 'no-cache',
          ...this.getAuthHeader()
        }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(remoteData));
        return remoteData.sort((a, b) => b.timestamp - a.timestamp);
      } else if (response.status === 401) {
        localStorage.removeItem('yeni_gun_admin_token');
        throw new Error("UNAUTHORIZED");
      }
    } catch (e: any) {
      if (e.message === "UNAUTHORIZED") throw e;
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
        return { success: true };
      } else {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, error: errorData.message || `Sunucu Hatası (${res.status})` };
      }
    } catch (e) {
      return { success: false, error: "Ağ hatası: Sunucuya ulaşılamıyor." };
    }
  },

  async updateCandidate(candidate: Candidate): Promise<StorageResult> {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(candidate)
      });
      if (res.ok) return { success: true };
      return { success: false, error: "Güncelleme başarısız." };
    } catch (e) {
      return { success: false, error: "Sunucu bağlantı hatası." };
    }
  },

  async deleteCandidate(id: string): Promise<boolean> {
    try { 
      const res = await fetch(`/api/candidates?id=${id}`, { 
        method: 'DELETE',
        headers: this.getAuthHeader()
      }); 
      return res.ok;
    } catch (e) { return false; }
  },

  async deleteMultipleCandidates(ids: string[]): Promise<boolean> {
    try {
      const results = await Promise.all(ids.map(id => fetch(`/api/candidates?id=${id}`, { 
        method: 'DELETE',
        headers: this.getAuthHeader()
      })));
      return results.every(r => r.ok);
    } catch (e) { return false; }
  },

  async getConfig(): Promise<GlobalConfig | null> {
    try {
      const res = await fetch('/api/config', { headers: this.getAuthHeader() });
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  },

  async saveConfig(config: GlobalConfig): Promise<boolean> {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(config)
      });
      return res.ok;
    } catch (e) { return false; }
  }
};
