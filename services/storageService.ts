
import { Candidate, GlobalConfig } from '../types';

export const storageService = {
  async getCandidates(forceRefresh = false): Promise<Candidate[]> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
    
    try {
      // Force refresh durumunda veya normalde buluttan en güncel halini iste
      const response = await fetch(`/api/candidates?_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' }
      });

      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        
        // BULUTU MUTLAK GERÇEK KABUL ET
        // Yerelde olup bulutta olmayanları (internet kesikken eklenenleri) koru
        const remoteMap = new Map<string, Candidate>();
        remoteData.forEach(r => remoteMap.set(r.id, r));

        const pendingUploads: Candidate[] = [];
        localData.forEach(l => {
          if (!remoteMap.has(l.id)) {
            pendingUploads.push(l);
          } else {
            // Eğer yereldeki veri, buluttakinden DAHA YENİ ise (timestamp ile kontrol)
            const remoteMatch = remoteMap.get(l.id)!;
            if ((l.timestamp || 0) > (remoteMatch.timestamp || 0)) {
              pendingUploads.push(l);
            }
          }
        });

        // BEKLEYEN VERİLERİ BULUTA BAS
        if (pendingUploads.length > 0) {
          console.log(`${pendingUploads.length} adet yerel değişiklik buluta senkronize ediliyor...`);
          for (const c of pendingUploads) {
            await fetch('/api/candidates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(c)
            }).catch(err => console.error("Sync Error for ID:", c.id, err));
          }
          // Buluta bastıktan sonra tekrar güncel listeyi çek ki ID'ler ve timestamp'ler eşitlensin
          const finalRes = await fetch(`/api/candidates?_t=${Date.now() + 1}`, { cache: 'no-store' });
          const finalData: Candidate[] = await finalRes.json();
          localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
          return finalData.sort((a, b) => b.timestamp - a.timestamp);
        }

        // Değişiklik yoksa direkt buluttakini mühürle ve dön
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(remoteData));
        return remoteData.sort((a, b) => b.timestamp - a.timestamp);
      }
    } catch (e) {
      console.warn("Bulut bağlantısı kurulamadı. Çevrimdışı mod aktif.");
    }
    return localData.sort((a, b) => b.timestamp - a.timestamp);
  },

  async saveCandidate(candidate: Candidate): Promise<boolean> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const current = localStr ? JSON.parse(localStr) : [];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidate, ...current]));
    
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });
      return res.ok;
    } catch (e) { return false; }
  },

  async updateCandidate(candidate: Candidate): Promise<boolean> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    if (localStr) {
      const current: Candidate[] = JSON.parse(localStr);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.map(c => c.id === candidate.id ? candidate : c)));
    }
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
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
