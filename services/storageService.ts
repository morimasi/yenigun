
import { Candidate } from '../types';

export const storageService = {
  /**
   * Konflikt Çözümleyici Gelişmiş Senkronizasyon (Deterministic Merge)
   * ID bazlı haritalama yaparak hiçbir adayın kaybolmamasını sağlar.
   */
  async getCandidates(): Promise<Candidate[]> {
    const local = localStorage.getItem('yeni_gun_candidates');
    const localData: Candidate[] = local ? JSON.parse(local) : [];

    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        
        // ID bazlı birleştirme haritası
        const mergedMap = new Map<string, Candidate>();

        // Yerel verileri haritaya ekle
        localData.forEach(c => {
          if (c && c.id) mergedMap.set(c.id, c);
        });

        // Uzak verileri ekle/güncelle (Uzak veri her zaman otoritedir)
        remoteData.forEach(remote => {
          if (remote && remote.id) {
            const existing = mergedMap.get(remote.id);
            // Eğer uzak veri daha güncelse veya yerelde yoksa güncelle
            if (!existing || (remote.timestamp >= (existing.timestamp || 0))) {
              mergedMap.set(remote.id, remote);
            }
          }
        });

        const finalData = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // Yerel belleği en güncel veriyle senkronize et
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("API bağlantısı kurulamadı, yerel önbellek kullanılıyor.");
    }
    
    return localData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  },

  async saveCandidate(candidate: Candidate) {
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    
    // Önce yerelde güvenli kaydet
    const local = localStorage.getItem('yeni_gun_candidates');
    const current = local ? JSON.parse(local) : [];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));

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
    
    // Yerel güncelleme
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
  }
};
