
import { Candidate, GlobalConfig, StaffMember, IDP } from '../types';
import { MOCK_DATA } from './seedService';

export interface StorageResult {
  success: boolean;
  error?: string;
}

const STORAGE_KEYS = {
  TOKEN: 'yeni_gun_admin_token',
  CANDIDATES: 'yeni_gun_candidates',
  CONFIG: 'yeni_gun_config',
  STAFF: 'yeni_gun_staff'
};

export const storageService = {
  getAuthHeader() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  // --- SEEDING ENGINE (NEW) ---
  async seedDatabase(): Promise<StorageResult> {
    try {
      // 1. Seed Candidates
      for (const cand of MOCK_DATA.candidates) {
        await this.saveCandidate(cand as Candidate);
      }
      // 2. Seed Staff
      for (const s of MOCK_DATA.staff) {
          await fetch('/api/staff?action=register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({...s, password: 'demo123'})
          });
          // Update staff profile to be complete
          await fetch('/api/staff?action=update_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s)
          });
          // Save analysis report to staff
          await fetch('/api/staff?action=save_analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ staffId: s.id, report: s.report })
          });
      }
      // 3. Seed IDP
      await fetch('/api/staff?action=save_idp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ staffId: MOCK_DATA.idp.staffId, data: MOCK_DATA.idp })
      });
      // 4. Seed Simulation
      await fetch('/api/clinical-lab?action=save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              candidateId: MOCK_DATA.candidates[0].id,
              testType: MOCK_DATA.simulation.test_type,
              scenario: MOCK_DATA.simulation.scenario,
              stressLevel: MOCK_DATA.simulation.stress_level,
              resultData: MOCK_DATA.simulation.result_data
          })
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
          return { success: true };
        }
        return { success: false, error: data.message };
      }
      throw new Error("API_FAIL");
    } catch (e) {
      return { success: false, error: 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.' };
    }
  },

  async getCandidates(forceRefresh = true): Promise<Candidate[]> {
    try {
      const response = await fetch(`/api/candidates?_t=${Date.now()}`, { 
        headers: { 
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate', 
          ...this.getAuthHeader() 
        }
      });
      if (response.ok) {
        const remoteData: Candidate[] = await response.json();
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(remoteData));
        return remoteData.sort((a, b) => b.timestamp - a.timestamp);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (e: any) {
      const localStr = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      const localData: Candidate[] = localStr ? JSON.parse(localStr) : [];
      return localData.sort((a, b) => b.timestamp - a.timestamp);
    }
  },

  async saveCandidate(candidate: Candidate): Promise<StorageResult> {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
        body: JSON.stringify(candidate)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.message || "Sunucu hatası");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async updateCandidate(candidate: Candidate): Promise<StorageResult> {
    return this.saveCandidate(candidate);
  },

  async deleteCandidate(id: string): Promise<boolean> {
    try { 
      const res = await fetch(`/api/candidates?id=${id}`, { method: 'DELETE', headers: this.getAuthHeader() }); 
      return res.ok;
    } catch (e) { return false; }
  },

  async getConfig(): Promise<GlobalConfig | null> {
    try {
      const res = await fetch(`/api/config?_t=${Date.now()}`, { headers: this.getAuthHeader() });
      if (res.ok) return await res.json();
      return null;
    } catch (e) {
      const local = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return local ? JSON.parse(local) : null;
    }
  },

  async saveConfig(config: GlobalConfig): Promise<boolean> {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
        body: JSON.stringify(config)
      });
      if (res.ok) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      return res.ok;
    } catch (e) { return false; }
  }
};
