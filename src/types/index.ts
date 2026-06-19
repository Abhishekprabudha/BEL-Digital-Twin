export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'Watch';

export interface Asset {
  id: string;
  name: string;
  classification: string;
  owner: string;
  missionProfile: string;
  health: number;
  readiness: number;
  digitalThread: string;
  deployment: string;
}

export interface Subsystem {
  id: string;
  name: string;
  type: string;
  health: number;
  temperature: number;
  vibration: number;
  signalQuality: number;
  failureProbability: number;
  rul: number;
  models: string[];
  requirements: string[];
  tests: string[];
  recommendation: string;
}

export interface TelemetryPoint {
  tick: number;
  timestamp: string;
  ambientTemp: number;
  powerLoad: number;
  coolingEfficiency: number;
  vibration: number;
  syntheticInterferenceIndex: number;
  eoAtmosphericLoad: number;
  missionReadiness: number;
  rfQuality: number;
  eoClarity: number;
}

export interface Scenario {
  id: string;
  name: string;
  summary: string;
  environment: {
    ambientTemp: number;
    humidity: number;
    vibration: number;
    interferenceIndex: number;
    atmosphericLoad: number;
    duration: number;
  };
  timeline: string[];
  mitigations: string[];
}

export interface TraceabilityRow {
  requirementId: string;
  description: string;
  domain: string;
  designModel: string;
  simulationRun: string;
  telemetrySource: string;
  testCase: string;
  validationResult: string;
  defect: string;
  decisionLog: string;
  exportStatus: string;
}

export interface PredictiveRecord {
  componentId: string;
  component: string;
  rulHours: number;
  failureProbability: number;
  trend: string;
  anomalyScore: number;
  action: string;
  missionImpact: string;
}

export interface ScenarioImpact {
  thermalRisk: number;
  structuralFatigue: number;
  rfPerformance: number;
  eoClarity: number;
  reliabilityScore: number;
  missionReadiness: number;
  recommendedEnvelope: string;
  alerts: string[];
}
