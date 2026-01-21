import { Candidate, GlobalConfig } from '../types';

export const storageService = {
  async getCandidates(): Promise<Candidate[]> {
    const local = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = local ? JSON.parse(local) : [];

    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        
        const mergedMap = new Map<string, Candidate>();
        
        // Önce yerel veriyi temel al (senkronize olmamış değişiklikler dahil)
        localData.forEach(c => { 
          if (c && c.id) mergedMap.set(c.id, c); 
        });

        // Uzak veriyi işle: Eğer uzak veri daha yeniyse veya yerelde hiç yoksa güncelle
        remoteData.forEach(remote => {
          if (remote && remote.id) {
            const localMatch = mergedMap.get(remote.id);
            // Kural: Uzaktaki veri her zaman "onaylanmış" veridir. 
            // Sadece yereldeki veri bariz daha yeniyse (kullanıcı henüz kaydetmişse) yereli koru.
            if (!localMatch || (remote.timestamp >= (localMatch.timestamp || 0))) {
              mergedMap.set(remote.id, remote);
            }
          }
        });

        const finalData = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("Kritik: API erişilemez durumda, yerel modda devam ediliyor.");
    }
    return localData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  },

  async saveCandidate(candidate: Candidate): Promise<boolean> {
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    
    // 1. Önce yerel önbelleğe anında yaz (UI tepkisi için)
    const local = localStorage.getItem('yeni_gun_candidates');
    const current: Candidate[] = local ? JSON.parse(local) : [];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));
    
    try {
      // 2. Hemen Veritabanına gönder
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateWithTime)
      });
      
      if (!res.ok) throw new Error("API Yazma Hatası");
      return true;
    } catch (e) { 
      console.error("Veritabanına yazılamadı, veri yerelde asılı kaldı.", e);
      return false; 
    }
  },

  async updateCandidate(candidate: Candidate) {
    // Güncelleme her zaman zaman damgasını yeniler
    const updatedCandidate = { ...candidate, timestamp: Date.now() };
    
    const local = localStorage.getItem('yeni_gun_candidates');
    if (local) {
      const current: Candidate[] = JSON.parse(local);
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
    } catch (e) { 
      return false; 
    }
  },

  async deleteCandidate(id: string) {
    const local = localStorage.getItem('yeni_gun_candidates');
    if (local) {
      const current = JSON.parse(local);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter((c: any) => c.id !== id)));
    }
    try { 
      await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' }); 
    } catch (e) {}
  },

  async deleteMultipleCandidates(ids: string[]) {
    const local = localStorage.getItem('yeni_gun_candidates');
    if (local) {
      const current: Candidate[] = JSON.parse(local);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter(c => !ids.includes(c.id))));
    }
    try {
      // Toplu silme işlemi API tarafında daha verimli bir endpoint ile yapılabilir
      // Şu an için paralel fetch kullanıyoruz
      await Promise.all(ids.map(id => fetch(`/api/candidates?id=${id}`, { method: 'DELETE' })));
    } catch (e) {}
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