import { useState, type ReactNode } from 'react';
import Shell, { type PageKey } from './components/Shell';
import CommandCenter from './pages/CommandCenter';
import DigitalTwinPage from './pages/DigitalTwinPage';
import ElectronicsPortfolio from './pages/ElectronicsPortfolio';
import MultiphysicsWorkbench from './pages/MultiphysicsWorkbench';
import MissionScenarioEngine from './pages/MissionScenarioEngine';
import PredictiveOperations from './pages/PredictiveOperations';
import DigitalThread from './pages/DigitalThread';
import SolverIntegration from './pages/SolverIntegration';
import DeploymentBlueprint from './pages/DeploymentBlueprint';
import DemoStoryMode from './pages/DemoStoryMode';
import EoiCompliance from './pages/EoiCompliance';

const pages: Record<PageKey, ReactNode> = {
  command: <CommandCenter />,
  portfolio: <ElectronicsPortfolio />,
  twin: <DigitalTwinPage />,
  workbench: <MultiphysicsWorkbench />,
  scenario: <MissionScenarioEngine />,
  predictive: <PredictiveOperations />,
  thread: <DigitalThread />,
  solver: <SolverIntegration />,
  deployment: <DeploymentBlueprint />,
  compliance: <EoiCompliance />,
  story: <DemoStoryMode />
};

export default function App() {
  const [active, setActive] = useState<PageKey>('command');
  return (
    <Shell active={active} onNavigate={setActive}>
      {pages[active]}
    </Shell>
  );
}
