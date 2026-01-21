import { Candidate, GlobalConfig } from '../types';

export const storageService = {
  async getCandidates(): Promise<Candidate[]> {
    const local = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = local ? JSON.parse(local) : [];

    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        
        // Map yapısı ile ID çakışmalarını yönetelim
        const mergedMap = new Map<string, Candidate>();
        
        // Önce yerel veriyi yükle (Güvenli Alan)
        localData.forEach(c => { 
          if (c && c.id) mergedMap.set(c.id, c); 
        });

        // Uzak veriyi üstüne işle (Sadece daha yeni veya eksik verileri al)
        remoteData.forEach(remote => {
          if (remote && remote.id) {
            const existing = mergedMap.get(remote.id);
            // Eğer yerelde yoksa veya uzaktaki veri daha güncelse (veya eşitse) güncelle
            if (!existing || (remote.timestamp >= (existing.timestamp || 0))) {
              mergedMap.set(remote.id, remote);
            }
          }
        });

        const finalData = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // localStorage'ı güncelle ama yerel adayları asla kaybetme
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("API bağlantısı kurulamadı, yerel önbellek kullanılıyor.");
    }
    return localData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  },

  async saveCandidate(candidate: Candidate) {
    // timestamp'i garanti altına al
    const candidateWithTime = { ...candidate, timestamp: candidate.timestamp || Date.now() };
    
    // Önce yerel listeye ekle (Anında görünürlük için)
    const local = localStorage.getItem('yeni_gun_candidates');
    const current: Candidate[] = local ? JSON.parse(local) : [];
    
    // Mükerrer kaydı önle
    const filtered = current.filter(c => c.id !== candidate.id);
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...filtered]));
    
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateWithTime)
      });
      return res.ok;
    } catch { 
      return false; 
    }
  },

  async updateCandidate(candidate: Candidate) {
    const updatedCandidate = { ...candidate, timestamp: Date.now() };
    const local = localStorage.getItem('yeni_gun_candidates');
    if (local) {
      const current: Candidate[] = JSON.parse(local);
      const updated = current.map(c => c.id === candidate.id ? updatedCandidate : c);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(updated));
    }
    try {
      await fetch('/api/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCandidate)
      });
    } catch (e) { 
      console.error("Bulut senkronizasyonu başarısız."); 
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
      await Promise.all(ids.map(id => fetch(`/api/candidates?id=${id}`, { method: 'DELETE' })));
    } catch (e) { 
      console.error("Toplu silme hatası."); 
    }
  },

  async getConfig(): Promise<GlobalConfig | null> {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) { 
      console.error("Config yükleme hatası."); 
    }
    return null;
  },

  async saveConfig(config: GlobalConfig): Promise<boolean> {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};