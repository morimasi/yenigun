
import { analyzeCandidate } from './services/ai/matrixService';
// @fix: Imported simulateCrisis to re-export it as runStresSimulation for component compatibility.
import { simulateCrisis } from './services/ai/simulationService';

/**
 * Yeni Gün Akademi MIA (Modular Intelligence Architecture) Entry Point
 * Faz 2: Mantıksal Çözülme (Decoupling) sonrası tüm AI servislerini dağıtır.
 * Klinik Laboratuvar modülü Faz 3 kapsamında tamamen kaldırılmıştır.
 */

export const generateCandidateAnalysis = analyzeCandidate;

// @fix: Exported runStresSimulation member.
export const runStresSimulation = simulateCrisis;

// Gelecekteki projeksiyon motoru için placeholder
export const generateNeuralProjection = async (candidate: any) => {
    // Projeksiyon servisi Faz 5'te buraya eklenecek
    return { status: 'pending' };
};
