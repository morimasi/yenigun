
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
      console.warn("Sunucu bağlantısı yok.");
      return { success: false, error: 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.' };
    }
  },

  // CRITICAL UPDATE: NETWORK-FIRST STRATEGY
  async getCandidates(forceRefresh = true): Promise<Candidate[]> {
    try {
      // Her zaman sunucudan taze veri çekmeyi dene (Cache-Busting: _t parametresi)
      const response = await fetch(`/api/candidates?_t=${Date.now()}`, { 
        headers: { 
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate', 
          ...this.getAuthHeader() 
        }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        // Sunucudan veri geldiyse yerel yedeği güncelle
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(remoteData));
        return remoteData.sort((a, b) => b.timestamp - a.timestamp);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (e: any) {
      console.error("Veri Senkronizasyon Hatası:", e);
      // Sadece sunucu hatasında yerel veriyi göster, ama kullanıcı bilsin.
      const localStr = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
      return localData.sort((a, b) => b.timestamp - a.timestamp);
    }
  },

  // CRITICAL UPDATE: WRITE-THROUGH STRATEGY
  async saveCandidate(candidate: Candidate): Promise<StorageResult> {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
        body: JSON.stringify(candidate)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Veritabanı kayıt hatası");
      }
      
      // Kayıt başarılıysa, yerel listeyi hemen invalidate etmemiz gerekmez, 
      // bir sonraki getCandidates çağrısı güncel veriyi çekecektir.
      return { success: true };
    } catch (e: any) {
      console.error("Kayıt Hatası:", e);
      // DİKKAT: Artık sessizce LocalStorage'a kaydetmiyoruz. 
      // Veritabanına gitmeyen veri "Kaydedildi" sayılmaz.
      return { success: false, error: "Sunucuya bağlanılamadı. Kayıt MERKEZİ SİSTEME iletilemedi." };
    }
  },

  async updateCandidate(candidate: Candidate): Promise<StorageResult> {
    return this.saveCandidate(candidate);
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
      return false; // Silme işlemi sunucuda olmazsa başarısız say.
    }
  },

  async deleteMultipleCandidates(ids: string[]): Promise<boolean> {
    // Toplu silme henüz API tarafında yoksa tek tek sil
    try {
        await Promise.all(ids.map(id => this.deleteCandidate(id)));
        return true;
    } catch (e) {
        return false;
    }
  },

  async getConfig(): Promise<GlobalConfig | null> {
    try {
      const res = await fetch(`/api/config?_t=${Date.now()}`, { headers: this.getAuthHeader() });
      if (res.ok) return await res.json();
      throw new Error("API_FAIL");
    } catch (e) {
      const local = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return local ? JSON.parse(local) : null;
    }
  },

  async saveConfig(config: GlobalConfig): Promise<boolean> {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
};
