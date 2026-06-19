import { useEffect, useMemo, useState } from 'react';
import telemetry from '../data/telemetry_stream.json';
import subsystemsData from '../data/subsystems.json';
import type { Subsystem, TelemetryPoint } from '../types';
import { blendTelemetryWithSubsystems } from '../utils/simulation';

export function useTelemetry(speedMs = 1400) {
  const points = telemetry as TelemetryPoint[];
  const baselineSubsystems = subsystemsData as Subsystem[];
  const [index, setIndex] = useState(0);
  const point = points[index % points.length];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % points.length), speedMs);
    return () => window.clearInterval(timer);
  }, [points.length, speedMs]);

  const subsystems = useMemo(() => blendTelemetryWithSubsystems(point, baselineSubsystems), [point, baselineSubsystems]);
  return { point, subsystems, index, points };
}
