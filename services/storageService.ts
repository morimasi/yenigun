import { Candidate, GlobalConfig } from '../types';

/**
 * Yeni Gün Akademi - Veri Zırhı v9.0 (Recovery & Hard-Sync)
 */
export const storageService = {
  async getCandidates(): Promise<Candidate[]> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
    
    console.log(`[Sync] Yerel bellek kontrol ediliyor: ${localData.length} kayıt bulundu.`);

    try {
      // 1. Sunucudan taze veriyi çek (Cache-Busting ekledik)
      const response = await fetch(`/api/candidates?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        const mergedMap = new Map<string, Candidate>();
        
        // Önce buluttaki verileri temele koy
        remoteData.forEach(remote => {
          if (remote && remote.id) mergedMap.set(remote.id, remote);
        });

        // Yerelde olup bulutta olmayan (veya yereldeki daha yeni olan) verileri tespit et
        const pendingUploads: Candidate[] = [];
        localData.forEach(local => {
          if (local && local.id) {
            const remoteMatch = mergedMap.get(local.id);
            // Eğer bulutta yoksa VEYA yereldeki veri buluttakinden daha yeniyse
            if (!remoteMatch || (local.timestamp || 0) > (remoteMatch.timestamp || 0)) {
              mergedMap.set(local.id, local);
              pendingUploads.push(local);
            }
          }
        });

        // BULUTA TAŞIMA OPERASYONU (Push Orphaned Data)
        if (pendingUploads.length > 0) {
          console.warn(`[Sync] ${pendingUploads.length} kayıt sadece yerelde bulundu. Buluta yedekleniyor...`);
          for (const c of pendingUploads) {
            try {
              await fetch('/api/candidates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(c)
              });
              console.log(`[Sync] Başarıyla taşındı: ${c.name}`);
            } catch (err) {
              console.error(`[Sync] Taşıma hatası (${c.name}):`, err);
            }
          }
        }

        const finalData = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.error("[Sync] Bulut erişim hatası, yerel verilerle devam ediliyor.");
    }

    return localData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  },

  async saveCandidate(candidate: Candidate): Promise<boolean> {
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const current: Candidate[] = localStr ? JSON.parse(localStr) : [];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));
    
    try {
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