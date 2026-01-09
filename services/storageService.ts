
import { Candidate, GlobalConfig } from '../types';

export const storageService = {
  /**
   * Konflikt Çözümleyici Gelişmiş Senkronizasyon (LWW - Last Write Wins)
   * Yerel ve uzak verileri ID bazında karşılaştırır, en yeni zaman damgalı olanı korur.
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

        // Önce yerel verileri ekle
        localData.forEach(c => mergedMap.set(c.id, c));

        // Uzak verileri kontrol ederek ekle/güncelle (Timestamp karşılaştırması)
        remoteData.forEach(remote => {
          const existing = mergedMap.get(remote.id);
          if (!existing || (remote.timestamp > existing.timestamp)) {
            mergedMap.set(remote.id, remote);
          }
        });

        const finalData = Array.from(mergedMap.values()).sort((a, b) => b.timestamp - a.timestamp);
        
        // Yerel belleği en güncel veriyle senkronize et
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("Sistem offline: Senkronizasyon atlandı, yerel cache kullanılıyor.");
    }
    
    return localData.sort((a, b) => b.timestamp - a.timestamp);
  },

  async saveCandidate(candidate: Candidate) {
    // Kayıt anında zaman damgasını sabitle
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));

    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateWithTime)
      });
      
      if (res.ok) {
        const data = await res.json();
        // Sunucu tarafından üretilen kesin zaman damgasını al
        if (data.timestamp) {
          candidateWithTime.timestamp = data.timestamp;
          this.updateLocalEntry(candidateWithTime);
        }
      }
      return res.ok;
    } catch {
      return false;
    }
  },

  async updateCandidate(candidate: Candidate) {
    // Her güncellemede zaman damgasını yenile
    const updatedCandidate = { ...candidate, timestamp: Date.now() };
    this.updateLocalEntry(updatedCandidate);

    try {
      const res = await fetch('/api/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCandidate)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.timestamp) {
          updatedCandidate.timestamp = data.timestamp;
          this.updateLocalEntry(updatedCandidate);
        }
      }
    } catch (e) {
      console.error("Bulut senkronizasyonu başarısız, değişiklikler yerel olarak saklandı.");
    }
  },

  updateLocalEntry(candidate: Candidate) {
    const local = localStorage.getItem('yeni_gun_candidates');
    if (local) {
      const current: Candidate[] = JSON.parse(local);
      const updated = current.map(c => c.id === candidate.id ? candidate : c);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(updated));
    }
  },

  async deleteCandidate(id: string) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(current.filter((c: any) => c.id !== id)));
    try {
      await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
  }
};
