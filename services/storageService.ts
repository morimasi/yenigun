import { Candidate, GlobalConfig } from '../types';

/**
 * Yeni Gün Akademi - Cloud-Centric Storage Service v5.0
 * Bu servis "Database is the King" (Veritabanı Kraldır) prensibiyle çalışır.
 */
export const storageService = {
  async getCandidates(): Promise<Candidate[]> {
    try {
      // 1. Önce sunucudan en güncel veriyi çek
      const response = await fetch('/api/candidates', {
        cache: 'no-store', // Tarayıcı cache'ini bypass et
        headers: { 'Pragma': 'no-cache' }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        
        // 2. Veritabanından gelen veriyi yerel belleğe "mutlak gerçek" olarak mühürle
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(remoteData));
        
        // 3. Sıralamayı sunucu tarafındaki zaman damgasına göre doğrula
        return remoteData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
    } catch (e) {
      console.error("KRİTİK: Veritabanı bağlantı hatası. Yerel önbellek (Cache) devreye alınıyor.");
    }

    // Sunucuya ulaşılamazsa fallback olarak yereli kullan
    const local = localStorage.getItem('yeni_gun_candidates');
    return local ? JSON.parse(local) : [];
  },

  async saveCandidate(candidate: Candidate): Promise<boolean> {
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    
    try {
      // DOĞRUDAN YAZIM: Yerel belleğe yazmadan ÖNCE sunucuya gönderilir.
      // Sunucu onay vermezse işlem başarısız sayılır.
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateWithTime)
      });
      
      if (res.ok) {
        // Sunucu onayladıysa yerel önbelleği güncelle
        const local = localStorage.getItem('yeni_gun_candidates');
        const current: Candidate[] = local ? JSON.parse(local) : [];
        localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));
        return true;
      }
      return false;
    } catch (e) { 
      console.error("Senkronizasyon Hatası: Veritabanına yazılamadı.");
      return false; 
    }
  },

  async updateCandidate(candidate: Candidate): Promise<boolean> {
    const updatedCandidate = { ...candidate, timestamp: Date.now() };
    
    try {
      const res = await fetch('/api/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCandidate)
      });

      if (res.ok) {
        const local = localStorage.getItem('yeni_gun_candidates');
        if (local) {
          const current: Candidate[] = JSON.parse(local);
          const updated = current.map(c => c.id === candidate.id ? updatedCandidate : c);
          localStorage.setItem('yeni_gun_candidates', JSON.stringify(updated));
        }
        return true;
      }
      return false;
    } catch (e) { 
      return false; 
    }
  },

  async deleteCandidate(id: string): Promise<boolean> {
    try { 
      const res = await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' }); 
      if (res.ok) {
        const local = localStorage.getItem('yeni_gun_candidates');
        if (local) {
          const current = JSON.parse(local);
          localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter((c: any) => c.id !== id)));
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  async deleteMultipleCandidates(ids: string[]): Promise<boolean> {
    try {
      const results = await Promise.all(ids.map(id => fetch(`/api/candidates?id=${id}`, { method: 'DELETE' })));
      const allOk = results.every(r => r.ok);
      if (allOk) {
        const local = localStorage.getItem('yeni_gun_candidates');
        if (local) {
          const current: Candidate[] = JSON.parse(local);
          localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter(c => !ids.includes(c.id))));
        }
      }
      return allOk;
    } catch (e) { 
      return false; 
    }
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