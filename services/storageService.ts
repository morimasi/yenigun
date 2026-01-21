import { Candidate, GlobalConfig } from '../types';

export const storageService = {
  async getCandidates(): Promise<Candidate[]> {
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
    
    try {
      const response = await fetch(`/api/candidates?_t=${Date.now()}`, { cache: 'no-store' });
      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        const mergedMap = new Map<string, Candidate>();
        
        // Önce buluttakileri ekle
        remoteData.forEach(r => mergedMap.set(r.id, r));

        // Yerelde daha yeni veri varsa veya bulutta yoksa bulutu güncelle
        const pendingUploads: Candidate[] = [];
        localData.forEach(l => {
          const remoteMatch = mergedMap.get(l.id);
          if (!remoteMatch || (l.timestamp || 0) > (remoteMatch.timestamp || 0)) {
            mergedMap.set(l.id, l);
            pendingUploads.push(l);
          }
        });

        // BULUTA PUSH (Background Sync)
        for (const c of pendingUploads) {
          fetch('/api/candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(c)
          }).catch(err => console.error("Sync Error:", err));
        }

        const finalData = Array.from(mergedMap.values()).sort((a, b) => b.timestamp - a.timestamp);
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("Offline Mode: Yerel veriler kullanılıyor.");
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
        method: 'POST', // Upsert için POST kullanıyoruz
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