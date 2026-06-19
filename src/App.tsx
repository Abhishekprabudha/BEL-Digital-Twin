import { useState, type ReactNode } from 'react';
import Shell, { type PageKey } from './components/Shell';
import CommandCenter from './pages/CommandCenter';
import DigitalTwinPage from './pages/DigitalTwinPage';
import MultiphysicsWorkbench from './pages/MultiphysicsWorkbench';
import MissionScenarioEngine from './pages/MissionScenarioEngine';
import PredictiveOperations from './pages/PredictiveOperations';
import DigitalThread from './pages/DigitalThread';
import SolverIntegration from './pages/SolverIntegration';
import DeploymentBlueprint from './pages/DeploymentBlueprint';
import DemoStoryMode from './pages/DemoStoryMode';

const pages: Record<PageKey, ReactNode> = {
  command: <CommandCenter />,
  twin: <DigitalTwinPage />,
  workbench: <MultiphysicsWorkbench />,
  scenario: <MissionScenarioEngine />,
  predictive: <PredictiveOperations />,
  thread: <DigitalThread />,
  solver: <SolverIntegration />,
  deployment: <DeploymentBlueprint />,
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
