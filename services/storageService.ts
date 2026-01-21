import { Candidate, GlobalConfig } from '../types';

/**
 * Yeni Gün Akademi - Veri Koruma ve Kurtarma Servisi v7.0
 * Prensip: Yerel veriyi asla silme, buluta taşınana kadar mühürle.
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
        const mergedMap = new Map<string, Candidate>();
        
        // 1. Önce sunucudaki verileri haritaya ekle
        remoteData.forEach(remote => {
          if (remote && remote.id) mergedMap.set(remote.id, remote);
        });

        // 2. Yereldeki verileri kontrol et
        const pendingUploads: Candidate[] = [];
        localData.forEach(local => {
          if (local && local.id) {
            const remoteMatch = mergedMap.get(local.id);
            if (!remoteMatch) {
              // VERİ KURTARMA: Bu veri sunucuda yok! Kaybetmek yerine "gönderilecekler" listesine al.
              mergedMap.set(local.id, local);
              pendingUploads.push(local);
            } else if ((local.timestamp || 0) > (remoteMatch.timestamp || 0)) {
              // GÜNCELLEME: Yereldeki veri daha yeni, sunucuyu güncellemek gerekecek.
              mergedMap.set(local.id, local);
              pendingUploads.push(local);
            }
          }
        });

        // 3. Arka planda eksik verileri sunucuya gönder (Taşıma işlemi)
        if (pendingUploads.length > 0) {
          console.log(`${pendingUploads.length} adet veri buluta taşınıyor...`);
          // Teker teker veya toplu gönderim denenebilir
          pendingUploads.forEach(c => {
            fetch('/api/candidates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(c)
            }).catch(err => console.error("Taşıma başarısız:", err));
          });
        }

        const finalData = Array.from(mergedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // Yerel önbelleği sadece başarılı birleşimden sonra güncelle
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(finalData));
        return finalData;
      }
    } catch (e) {
      console.warn("Bulut senkronizasyonu başarısız, veriler yerel modda korunuyor.");
    }

    return localData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  },

  async saveCandidate(candidate: Candidate): Promise<boolean> {
    const candidateWithTime = { ...candidate, timestamp: Date.now() };
    
    // 1. Önce yerel belleğe yaz (KAYIP RİSKİNE KARŞI İLK ÖNLEM)
    const localStr = localStorage.getItem('yeni_gun_candidates');
    const current: Candidate[] = localStr ? JSON.parse(localStr) : [];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidateWithTime, ...current]));
    
    try {
      // 2. Şimdi sunucuya gönder
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateWithTime)
      });
      
      // Sunucuya yazıldıysa bile yereli silmiyoruz, getCandidates bir sonraki seferde eşitleyecek
      return res.ok;
    } catch (e) { 
      // Sunucu hatası olsa bile veri yerelde duruyor (Silinmedi!)
      return false; 
    }
  },

  async updateCandidate(candidate: Candidate): Promise<boolean> {
    const updatedCandidate = { ...candidate, timestamp: Date.now() };
    
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
    // Yerelden siliyoruz
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