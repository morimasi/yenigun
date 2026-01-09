
import { Candidate, GlobalConfig } from '../types';

export const storageService = {
  // Adayları getir ve senkronize et
  async getCandidates(): Promise<Candidate[]> {
    const local = localStorage.getItem('yeni_gun_candidates');
    let localData: Candidate[] = local ? JSON.parse(local) : [];

    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const remoteData = await response.json();
        if (Array.isArray(remoteData)) {
          const merged = [...remoteData];
          localData.forEach(lc => {
             if (!merged.find(rc => rc.id === lc.id)) {
                merged.push(lc);
             }
          });
          const sorted = merged.sort((a, b) => b.timestamp - a.timestamp);
          localStorage.setItem('yeni_gun_candidates', JSON.stringify(sorted));
          return sorted;
        }
      }
    } catch (e) {
      console.warn("Offline mod: Sadece yerel veriler kullanılıyor.");
    }
    return localData;
  },

  async saveCandidate(candidate: Candidate) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidate, ...current]));

    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async updateCandidate(candidate: Candidate) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    const updated = current.map((c: Candidate) => c.id === candidate.id ? candidate : c);
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(updated));

    try {
      await fetch('/api/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });
    } catch (e) {
      console.error("Bulut güncelleme başarısız.");
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
