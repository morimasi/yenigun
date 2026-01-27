
import { analyzeCandidate } from './services/ai/matrixService';
import { simulateCrisis } from './services/ai/simulationService';

/**
 * Yeni Gün Akademi MIA (Modular Intelligence Architecture) Entry Point
 * Faz 2: Mantıksal Çözülme (Decoupling) sonrası tüm AI servislerini dağıtır.
 */

export const generateCandidateAnalysis = analyzeCandidate;
export const runStresSimulation = simulateCrisis;

// Gelecekteki projeksiyon motoru için placeholder
export const generateNeuralProjection = async (candidate: any) => {
    // Projeksiyon servisi Faz 5'te buraya eklenecek
    return { status: 'pending' };
};
