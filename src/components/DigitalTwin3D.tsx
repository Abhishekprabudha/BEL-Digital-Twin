import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import type { Subsystem } from '../types';

export type TwinMode = 'health' | 'heat' | 'stress' | 'rf' | 'eo';

interface DigitalTwin3DProps {
  subsystems: Subsystem[];
  selectedId?: string;
  mode: TwinMode;
  onSelect?: (subsystem: Subsystem) => void;
  compact?: boolean;
}

function colorForSubsystem(subsystem: Subsystem, mode: TwinMode) {
  if (mode === 'heat') return subsystem.temperature > 62 ? '#fb7185' : subsystem.temperature > 50 ? '#f6b73c' : '#2dd4ff';
  if (mode === 'stress') return subsystem.vibration > 0.34 ? '#fb7185' : subsystem.vibration > 0.22 ? '#f6b73c' : '#4ade80';
  if (mode === 'rf') return subsystem.signalQuality > 90 ? '#4ade80' : subsystem.signalQuality > 78 ? '#f6b73c' : '#fb7185';
  if (mode === 'eo') return subsystem.type.includes('Optics') ? '#2dd4ff' : '#64748b';
  return subsystem.health > 90 ? '#4ade80' : subsystem.health > 82 ? '#f6b73c' : '#fb7185';
}

function Payload({ subsystems, selectedId, mode, onSelect, compact = false }: DigitalTwin3DProps) {
  const group = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.13;
  });

  const positions = useMemo(() => [
    [-1.6, 0.35, 0.82], [1.55, 0.30, 0.72], [0, 0.62, 1.12],
    [-0.82, -0.58, 0.85], [0.78, -0.58, 0.85], [-1.65, -0.45, -0.2],
    [1.6, -0.45, -0.2], [-0.68, 0.22, -1.05], [0.68, 0.22, -1.05], [0, -0.75, -0.65]
  ] as [number, number, number][], []);

  return (
    <group ref={group} scale={compact ? 0.95 : 1.08}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.1, 1.28, 1.75]} />
        <meshStandardMaterial color="#152842" roughness={0.38} metalness={0.35} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0, 1.03]}>
        <boxGeometry args={[2.25, 0.9, 0.12]} />
        <meshStandardMaterial color="#203a5f" emissive="#0b5d7a" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 0.78, 0.05]}>
        <sphereGeometry args={[0.42, 32, 16]} />
        <meshStandardMaterial color="#1dd3ff" roughness={0.2} metalness={0.15} transparent opacity={0.68} />
      </mesh>
      <mesh position={[0, -0.98, 0]}>
        <boxGeometry args={[3.8, 0.18, 2.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      {subsystems.map((subsystem, idx) => (
        <mesh
          key={subsystem.id}
          position={positions[idx]}
          onClick={(event) => { event.stopPropagation(); onSelect?.(subsystem); }}
          scale={selectedId === subsystem.id ? 1.25 : 1}
        >
          <boxGeometry args={[0.42, 0.34, 0.28]} />
          <meshStandardMaterial color={colorForSubsystem(subsystem, mode)} emissive={colorForSubsystem(subsystem, mode)} emissiveIntensity={selectedId === subsystem.id ? 0.34 : 0.13} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[2.18, 0.012, 16, 128]} />
        <meshStandardMaterial color="#2dd4ff" emissive="#2dd4ff" emissiveIntensity={0.28} transparent opacity={0.45} />
      </mesh>
      {mode === 'rf' && (
        <mesh position={[0, 0, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.75, 2.4, 64, 1, true]} />
          <meshStandardMaterial color="#2dd4ff" transparent opacity={0.14} emissive="#2dd4ff" emissiveIntensity={0.15} />
        </mesh>
      )}
    </group>
  );
}

export default function DigitalTwin3D(props: DigitalTwin3DProps) {
  return (
    <div className="h-full min-h-[320px] overflow-hidden rounded-2xl border border-belcyan/20 bg-[#050b15] shadow-glow">
      <Canvas camera={{ position: [3.8, 2.7, 4.4], fov: 44 }}>
        <ambientLight intensity={0.58} />
        <pointLight position={[3, 5, 4]} intensity={1.6} color="#2dd4ff" />
        <pointLight position={[-3, 2, -4]} intensity={1.1} color="#f6b73c" />
        <Payload {...props} />
      </Canvas>
      <div className="pointer-events-none -mt-14 px-4 pb-4 text-xs text-slate-400">
        <span className="rounded-full border border-belcyan/20 bg-belcyan/10 px-3 py-1">Interactive synthetic 3D twin · mode: {props.mode}</span>
      </div>
    </div>
  );
}
