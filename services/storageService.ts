import { Candidate, GlobalConfig } from '../types';

/**
 * Yeni Gün Akademi - Gelişmiş Hibrit Senkronizasyon Servisi v6.0
 * Prensip: Veritabanı otoritedir, ancak yerel veriler mühürlenene kadar korunur.
 */
export const storageService = {
  async getCandidates(): Promise<Candidate[]> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];

    try {
      const response = await fetch('/api/candidates', {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        
        // --- KRİTİK BİRLEŞTİRME MANTIĞI ---
        const mergedMap = new Map<string, Candidate>();
        
        // 1. Önce veritabanındaki (onaylanmış) verileri yükle
        remoteData.forEach(remote => {
          if (remote && remote.id) mergedMap.set(remote.id, remote);
        });

        // 2. Yerelde olup veritabanında henüz olmayanları (yeni başvurular) ekle
        localData.forEach(local => {
          if (local && local.id) {
            const remoteMatch = mergedMap.get(local.id);
            // Eğer veritabanında yoksa veya yereldeki veri daha güncelse (yeni işlem) koru
            if (!remoteMatch || (local.timestamp > (remoteMatch.timestamp || 0))) {
              mergedMap.set(local.id, local);
            }
          }
        });

        const finalData = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // Yerel önbelleği güncelle
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("Bulut senkronizasyonu başarısız, çevrimdışı mod aktif.");
    }

    return localData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  },

  async saveCandidate(candidate: Candidate): Promise<boolean> {
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    
    // 1. Önce yerel belleğe yaz (Anında görünürlük için)
    const local = localStorage.getItem('yeni_gun_candidates');
    const current: Candidate[] = local ? JSON.parse(local) : [];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));
    
    try {
      // 2. Veritabanına mühürle
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateWithTime)
      });
      
      return res.ok;
    } catch (e) { 
      console.error("Veritabanı bağlantı hatası, veri yerelde asılı kaldı.");
      return false; 
    }
  },

  async updateCandidate(candidate: Candidate): Promise<boolean> {
    const updatedCandidate = { ...candidate, timestamp: Date.now() };
    
    // Yerel güncelleme
    const localStr = localStorage.getItem('yeni_gun_candidates');
    if (localStr) {
      const current: Candidate[] = JSON.parse(localStr);
      const updated = current.map(c => c.id === candidate.id ? updatedCandidate : c);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(updated));
    }

    try {
      const res = await fetch('/api/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCandidate)
      });
      return res.ok;
    } catch (e) { return false; }
  },

  async deleteCandidate(id: string): Promise<boolean> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    if (localStr) {
      const current: Candidate[] = JSON.parse(localStr);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter((c: any) => c.id !== id)));
    }
    try { 
      const res = await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' }); 
      return res.ok;
    } catch (e) { return false; }
  },

  async deleteMultipleCandidates(ids: string[]): Promise<boolean> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    if (localStr) {
      const current: Candidate[] = JSON.parse(localStr);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter(c => !ids.includes(c.id))));
    }
    try {
      await Promise.all(ids.map(id => fetch(`/api/candidates?id=${id}`, { method: 'DELETE' })));
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