import scenarios from '../data/scenarios.json';
import traceability from '../data/requirements_traceability.json';
import simulationRuns from '../data/simulation_runs.json';
import apiCatalog from '../data/api_catalog.json';
import type { Scenario, TraceabilityRow } from '../types';
import { calculateScenarioImpact } from '../utils/simulation';

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runScenarioJob(scenarioId: string) {
  await wait(650);
  const scenario = (scenarios as Scenario[]).find((item) => item.id === scenarioId) ?? (scenarios as Scenario[])[0];
  return {
    scenario,
    impact: calculateScenarioImpact(scenario),
    jobId: `JOB-${Math.round(Math.random() * 9000 + 1000)}`,
    status: 'Completed',
    evidenceId: `EV-${Math.round(Math.random() * 9000 + 1000)}`
  };
}

export async function generateTraceabilityReport() {
  await wait(300);
  return {
    reportId: `TR-${new Date().getFullYear()}-${Math.round(Math.random() * 900 + 100)}`,
    rows: traceability as TraceabilityRow[],
    status: 'Ready for IV&V package export'
  };
}

export async function mockGetApiCatalog() {
  await wait(180);
  return apiCatalog;
}

export async function mockGetSimulationRuns() {
  await wait(180);
  return simulationRuns;
}
