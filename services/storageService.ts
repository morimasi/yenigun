
import { Candidate, GlobalConfig } from '../types';

export interface StorageResult {
  success: boolean;
  error?: string;
}

// YEREL YEDEKLEME ANAHTARLARI
const STORAGE_KEYS = {
  TOKEN: 'yeni_gun_admin_token',
  CANDIDATES: 'yeni_gun_candidates',
  CONFIG: 'yeni_gun_config',
  STAFF: 'yeni_gun_staff'
};

export const storageService = {
  getAuthHeader() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
          return { success: true };
        }
        return { success: false, error: data.message };
      }
      throw new Error("API_FAIL");
    } catch (e) {
      // OFFLINE FALLBACK: Yerel doğrulama
      console.warn("Sunucu bağlantısı yok, yerel doğrulama yapılıyor.");
      if (username === 'admin' && password === 'yenigun2024') {
        const mockToken = btoa(`offline_session_${Date.now()}`);
        localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
        return { success: true };
      }
      return { success: false, error: 'Sunucuya ulaşılamadı ve yerel giriş başarısız.' };
    }
  },

  async getCandidates(forceRefresh = false): Promise<Candidate[]> {
    try {
      // API çağrısını dene
      if (forceRefresh) {
        const response = await fetch(`/api/candidates?_t=${Date.now()}`, { 
          headers: { 'Pragma': 'no-cache', ...this.getAuthHeader() }
        });
        if (response.ok) {
          const remoteData: Candidate[] = await response.json();
          localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(remoteData));
          return remoteData.sort((a, b) => b.timestamp - a.timestamp);
        }
      }
      throw new Error("USE_LOCAL");
    } catch (e: any) {
      // Hata durumunda (500, 404, Network Error) yerel veriyi dön
      const localStr = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
      return localData.sort((a, b) => b.timestamp - a.timestamp);
    }
  },

  async saveCandidate(candidate: Candidate): Promise<StorageResult> {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });
      if (!res.ok) throw new Error("API_FAIL");
      return { success: true };
    } catch (e) {
      // OFFLINE FALLBACK: LocalStorage'a kaydet
      const current = await this.getCandidates();
      const updated = [candidate, ...current.filter(c => c.id !== candidate.id)];
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(updated));
      return { success: true };
    }
  },

  async updateCandidate(candidate: Candidate): Promise<StorageResult> {
    return this.saveCandidate(candidate); // Save mantığı update ile aynı çalışır (Upsert)
  },

  async deleteCandidate(id: string): Promise<boolean> {
    try { 
      const res = await fetch(`/api/candidates?id=${id}`, { 
        method: 'DELETE',
        headers: this.getAuthHeader()
      }); 
      if (!res.ok) throw new Error("API_FAIL");
      return true;
    } catch (e) {
      // OFFLINE FALLBACK: Silme
      const current = await this.getCandidates();
      const filtered = current.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(filtered));
      return true;
    }
  },

  async deleteMultipleCandidates(ids: string[]): Promise<boolean> {
    // Toplu silme için offline logic
    const current = await this.getCandidates();
    const filtered = current.filter(c => !ids.includes(c.id));
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(filtered));
    return true;
  },

  async getConfig(): Promise<GlobalConfig | null> {
    try {
      const res = await fetch('/api/config', { headers: this.getAuthHeader() });
      if (res.ok) return await res.json();
      throw new Error("API_FAIL");
    } catch (e) {
      const local = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return local ? JSON.parse(local) : null;
    }
  },

  async saveConfig(config: GlobalConfig): Promise<boolean> {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config)); // Önce yerele yaz
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
        body: JSON.stringify(config)
      });
      return res.ok;
    } catch (e) {
      return true; // API hatası olsa bile yerel kayıt başarılı sayılır
    }
  }
};
