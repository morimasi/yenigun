import { Candidate, GlobalConfig } from '../types';

/**
 * Yeni Gün Akademi - Bunker-Level Data Storage v8.0
 * Prensip: Veri kutsaldır. Bulut sadece bir yedekleme değil, bir mühürdür.
 */
export const storageService = {
  async getCandidates(): Promise<Candidate[]> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
    
    try {
      // 1. Sunucudan taze veriyi iste
      const response = await fetch('/api/candidates', {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        const mergedMap = new Map<string, Candidate>();
        
        // Önce yereldeki verileri "taslak" olarak haritaya koy (Kurtarma Modu)
        localData.forEach(local => {
          if (local && local.id) mergedMap.set(local.id, local);
        });

        // Sonra sunucudaki verileri üzerine yaz (Eğer sunucudaki daha yeniyse veya yerelde yoksa)
        remoteData.forEach(remote => {
          if (remote && remote.id) {
            const localMatch = mergedMap.get(remote.id);
            if (!localMatch || (remote.timestamp || 0) >= (localMatch.timestamp || 0)) {
              mergedMap.set(remote.id, remote);
            }
          }
        });

        const finalData = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // Yerelde eksik olup sunucuda olmayan (mülteci) verileri buluta tırmandır
        const missingOnRemote = finalData.filter(f => !remoteData.find(r => r.id === f.id));
        if (missingOnRemote.length > 0) {
          console.log(`Kurtarılan ${missingOnRemote.length} aday buluta mühürleniyor...`);
          for (const c of missingOnRemote) {
            fetch('/api/candidates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(c)
            }).catch(e => console.error("Sync Up Error:", e));
          }
        }

        // Yerel önbelleği her zaman mühürlü veriyle güncelle
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("Bulut Bağlantısı Kesildi: Çevrimdışı verilerle devam ediliyor.");
    }

    return localData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  },

  async saveCandidate(candidate: Candidate): Promise<boolean> {
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    
    // 1. Önce yereli güncelle (Anında UI tepkisi)
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const current: Candidate[] = localStr ? JSON.parse(localStr) : [];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));
    
    try {
      // 2. Sunucuya mühürle
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateWithTime)
      });
      return res.ok;
    } catch (e) { return false; }
  },

  async updateCandidate(candidate: Candidate): Promise<boolean> {
    const updatedCandidate = { ...candidate, timestamp: Date.now() };
    const localStr = localStorage.getItem('yeni_gun_candidates');
    if (localStr) {
      const current: Candidate[] = JSON.parse(localStr);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.map(c => c.id === candidate.id ? updatedCandidate : c)));
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
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter(c => c.id !== id)));
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