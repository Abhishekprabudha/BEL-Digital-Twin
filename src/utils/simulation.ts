import type { Scenario, ScenarioImpact, Subsystem, TelemetryPoint } from '../types';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function calculateThermalRisk(ambientTemp: number, powerLoad: number, coolingEfficiency: number, duration: number): number {
  return clamp((ambientTemp * 0.72) + (powerLoad * 0.62) + (duration * 2.4) - (coolingEfficiency * 0.58));
}

export function calculateStructuralFatigue(vibration: number, missionDuration: number, loadFactor: number): number {
  return clamp((vibration * 130) + (missionDuration * 3.4) + (loadFactor * 8));
}

export function calculateRFPerformance(baseRFQuality: number, thermalRisk: number, componentAge: number, syntheticInterferenceIndex: number): number {
  return clamp(baseRFQuality - (thermalRisk * 0.15) - (componentAge * 0.08) - (syntheticInterferenceIndex * 0.13));
}

export function calculateEOClarity(vibration: number, thermalDrift: number, atmosphericLoad: number): number {
  return clamp(98 - (vibration * 42) - (thermalDrift * 0.14) - (atmosphericLoad * 0.22));
}

export function calculateReliabilityScore(temperature: number, cycles: number, loadFactor: number): number {
  const syntheticDecay = Math.pow(cycles / 1200, 1.6) * 18 + Math.max(0, temperature - 45) * 0.7 + loadFactor * 2.8;
  return clamp(100 - syntheticDecay);
}

export function calculateMissionReadiness(subsystemHealth: number, rfPerformance: number, eoClarity: number, thermalRisk: number, reliabilityScore: number): number {
  return clamp((subsystemHealth * 0.27) + (rfPerformance * 0.22) + (eoClarity * 0.18) + ((100 - thermalRisk) * 0.16) + (reliabilityScore * 0.17));
}

export function calculateRemainingUsefulLife(health: number, failureProbability: number, thermalRisk: number): number {
  return Math.max(40, Math.round((health * 9.5) - (failureProbability * 16) - (thermalRisk * 2.2)));
}

export function calculateScenarioImpact(scenario: Scenario, subsystemHealth = 89): ScenarioImpact {
  const env = scenario.environment;
  const thermalRisk = calculateThermalRisk(env.ambientTemp, 72 + env.interferenceIndex * 0.18, 84 - env.humidity * 0.06, env.duration);
  const structuralFatigue = calculateStructuralFatigue(env.vibration, env.duration, 1.25);
  const rfPerformance = calculateRFPerformance(96, thermalRisk, 180, env.interferenceIndex);
  const eoClarity = calculateEOClarity(env.vibration, thermalRisk, env.atmosphericLoad);
  const reliabilityScore = calculateReliabilityScore(env.ambientTemp + thermalRisk * 0.08, 420, 1.18);
  const missionReadiness = calculateMissionReadiness(subsystemHealth, rfPerformance, eoClarity, thermalRisk, reliabilityScore);
  const alerts = generateRecommendations({ thermalRisk, structuralFatigue, rfPerformance, eoClarity, reliabilityScore, missionReadiness });
  const recommendedEnvelope = missionReadiness > 82 ? 'Nominal synthetic operating envelope' : missionReadiness > 70 ? 'Reduced performance envelope with active monitoring' : 'Hold for engineering review / simulated mitigation required';
  return { thermalRisk, structuralFatigue, rfPerformance, eoClarity, reliabilityScore, missionReadiness, recommendedEnvelope, alerts };
}

export function generateRecommendations(impact: Pick<ScenarioImpact, 'thermalRisk' | 'structuralFatigue' | 'rfPerformance' | 'eoClarity' | 'reliabilityScore' | 'missionReadiness'>): string[] {
  const recs: string[] = [];
  if (impact.thermalRisk > 70) recs.push('Thermal risk rising — increase synthetic cooling profile and reduce duty cycle.');
  if (impact.structuralFatigue > 68) recs.push('Structural fatigue watch — run high-vibration inspection and mount validation.');
  if (impact.rfPerformance < 78) recs.push('RF performance degraded — operate under reduced synthetic performance envelope.');
  if (impact.eoClarity < 80) recs.push('EO clarity drift detected — run alignment and optics cleaning procedure.');
  if (impact.reliabilityScore < 78) recs.push('Reliability reserve reducing — schedule component reliability review.');
  if (impact.missionReadiness < 75) recs.push('Mission readiness below threshold — trigger operator what-if mitigation.');
  return recs.length ? recs : ['All synthetic indicators within boardroom POC thresholds. Continue telemetry monitoring.'];
}

export function blendTelemetryWithSubsystems(point: TelemetryPoint, subsystems: Subsystem[]): Subsystem[] {
  return subsystems.map((s, index) => {
    const modifier = Math.sin((point.tick + index) / 5) * 2;
    const thermalPenalty = Math.max(0, point.ambientTemp - 35) * 0.18;
    const vibrationPenalty = point.vibration * 6;
    const newHealth = clamp(s.health + modifier - thermalPenalty - vibrationPenalty * 0.12, 55, 99);
    const failureProbability = clamp(s.failureProbability + thermalPenalty * 0.4 + vibrationPenalty * 0.2 - modifier * 0.2, 1, 35);
    return {
      ...s,
      health: Math.round(newHealth),
      temperature: Math.round(s.temperature + (point.ambientTemp - 32) * 0.32 + point.powerLoad * 0.025),
      vibration: Number((s.vibration + point.vibration * 0.12).toFixed(2)),
      signalQuality: Math.round(clamp(s.signalQuality - point.syntheticInterferenceIndex * 0.04 - thermalPenalty * 0.2, 55, 99)),
      failureProbability: Number(failureProbability.toFixed(1)),
      rul: calculateRemainingUsefulLife(newHealth, failureProbability, thermalPenalty * 5)
    };
  });
}

export function riskLabel(score: number, inverse = false): 'Low' | 'Medium' | 'High' | 'Critical' {
  const value = inverse ? 100 - score : score;
  if (value < 35) return 'Low';
  if (value < 62) return 'Medium';
  if (value < 82) return 'High';
  return 'Critical';
}

export { clamp };
