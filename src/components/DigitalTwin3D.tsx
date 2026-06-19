import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, Mesh } from 'three';
import type { Subsystem } from '../types';

export type TwinMode = 'health' | 'heat' | 'stress' | 'rf' | 'eo';
export type TwinGeometry = 'payload' | 'radar-panel' | 'rotating-dish' | 'tilted-array' | 'pod' | 'rack' | 'gimbal';

interface DigitalTwin3DProps {
  subsystems: Subsystem[];
  selectedId?: string;
  mode: TwinMode;
  onSelect?: (subsystem: Subsystem) => void;
  compact?: boolean;
  showcase?: boolean;
  geometry?: TwinGeometry | string;
}

function colorForSubsystem(subsystem: Subsystem, mode: TwinMode) {
  if (mode === 'heat') return subsystem.temperature > 62 ? '#fb7185' : subsystem.temperature > 50 ? '#f6b73c' : '#2dd4ff';
  if (mode === 'stress') return subsystem.vibration > 0.34 ? '#fb7185' : subsystem.vibration > 0.22 ? '#f6b73c' : '#4ade80';
  if (mode === 'rf') return subsystem.signalQuality > 90 ? '#4ade80' : subsystem.signalQuality > 78 ? '#f6b73c' : '#fb7185';
  if (mode === 'eo') return subsystem.type.includes('Optics') ? '#2dd4ff' : '#64748b';
  return subsystem.health > 90 ? '#4ade80' : subsystem.health > 82 ? '#f6b73c' : '#fb7185';
}

function isRadarGeometry(geometry?: TwinGeometry | string) {
  return geometry === 'radar-panel' || geometry === 'rotating-dish' || geometry === 'tilted-array';
}

function RadarMeshSweep({ isDish }: { isDish: boolean }) {
  const sweep = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (sweep.current) sweep.current.rotation.z -= delta * 1.35;
  });

  return (
    <group ref={sweep} position={[0, 0, isDish ? 0.5 : 0.17]} rotation={[0, 0, -0.35]}>
      <mesh>
        <circleGeometry args={[isDish ? 1.08 : 1.28, 56, 0, Math.PI / 3.1]} />
        <meshStandardMaterial color="#2dd4ff" transparent opacity={0.28} emissive="#2dd4ff" emissiveIntensity={0.62} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, 0.22]}>
        <circleGeometry args={[isDish ? 0.72 : 0.9, 48, 0, Math.PI / 4.2]} />
        <meshStandardMaterial color="#4ade80" transparent opacity={0.18} emissive="#4ade80" emissiveIntensity={0.45} depthWrite={false} />
      </mesh>
    </group>
  );
}

function RadarSignalEffects({ isDish }: { isDish: boolean }) {
  const group = useRef<Group>(null);
  const ping = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.32;
    if (ping.current) {
      const scale = 1 + (Math.sin(clock.elapsedTime * 2.1) + 1) * 0.15;
      ping.current.scale.setScalar(scale);
    }
  });

  const z = isDish ? 0.54 : 0.19;

  return (
    <group ref={group} position={[0, 0, z]}>
      {[0.42, 0.7, 0.98].map((radius, idx) => (
        <mesh key={radius} position={[0, 0, idx * 0.012]}>
          <torusGeometry args={[radius, 0.008, 12, 96]} />
          <meshStandardMaterial color={idx === 1 ? '#4ade80' : '#2dd4ff'} emissive={idx === 1 ? '#4ade80' : '#2dd4ff'} emissiveIntensity={0.48} transparent opacity={0.56 - idx * 0.1} />
        </mesh>
      ))}
      <mesh ref={ping} position={[0.44, 0.32, 0.08]}>
        <sphereGeometry args={[0.055, 18, 12]} />
        <meshStandardMaterial color="#f6b73c" emissive="#f6b73c" emissiveIntensity={0.9} transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.58, -0.2, 0.08]}>
        <sphereGeometry args={[0.038, 16, 10]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.72} transparent opacity={0.82} />
      </mesh>
    </group>
  );
}

function RadarSurfaceMesh({ geometry }: { geometry?: TwinGeometry | string }) {
  const isDish = geometry === 'rotating-dish';
  const isTilted = geometry === 'tilted-array';
  const surfaceRotation: [number, number, number] = isDish ? [0, 0, 0] : [isTilted ? -0.18 : 0, 0, 0];
  const gridColumns = Array.from({ length: 11 }, (_, idx) => -1.25 + idx * 0.25);
  const gridRows = Array.from({ length: 7 }, (_, idx) => -0.66 + idx * 0.22);

  return (
    <group position={[0, 0, 1.04]} rotation={surfaceRotation}>
      {isDish ? (
        <>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[1.22, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2.7]} />
            <meshStandardMaterial color="#243f63" emissive="#0b5d7a" emissiveIntensity={0.18} roughness={0.28} metalness={0.42} transparent opacity={0.86} />
          </mesh>
          <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[1.24, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2.7]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#2dd4ff" emissiveIntensity={0.34} transparent opacity={0.42} wireframe />
          </mesh>
          <RadarMeshSweep isDish />
          <RadarSignalEffects isDish />
          <mesh position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.025, 16, 128]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#2dd4ff" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.48]}>
            <sphereGeometry args={[0.16, 24, 16]} />
            <meshStandardMaterial color="#f6b73c" emissive="#f6b73c" emissiveIntensity={0.25} metalness={0.25} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
            <mesh key={angle} position={[Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, 0.16]} rotation={[Math.PI / 2, 0, angle]}>
              <boxGeometry args={[0.72, 0.025, 0.025]} />
              <meshStandardMaterial color="#8fb8d8" emissive="#2dd4ff" emissiveIntensity={0.14} />
            </mesh>
          ))}
        </>
      ) : (
        <>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.65, 1.42, 0.08]} />
            <meshStandardMaterial color="#1b3554" emissive="#0b5d7a" emissiveIntensity={0.14} roughness={0.34} metalness={0.34} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.085]}>
            <boxGeometry args={[2.7, 1.46, 0.035, 24, 14, 1]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#2dd4ff" emissiveIntensity={0.36} transparent opacity={0.46} wireframe />
          </mesh>
          {gridColumns.map((x) => (
            <mesh key={`grid-col-${x}`} position={[x, 0, 0.14]}>
              <boxGeometry args={[0.012, 1.36, 0.018]} />
              <meshStandardMaterial color="#2dd4ff" emissive="#2dd4ff" emissiveIntensity={0.28} transparent opacity={0.54} />
            </mesh>
          ))}
          {gridRows.map((y) => (
            <mesh key={`grid-row-${y}`} position={[0, y, 0.145]}>
              <boxGeometry args={[2.52, 0.012, 0.018]} />
              <meshStandardMaterial color="#2dd4ff" emissive="#2dd4ff" emissiveIntensity={0.28} transparent opacity={0.54} />
            </mesh>
          ))}
          <RadarMeshSweep isDish={false} />
          <RadarSignalEffects isDish={false} />
          {Array.from({ length: 48 }).map((_, idx) => {
            const col = idx % 8;
            const row = Math.floor(idx / 8);
            const active = (idx + row) % 3 === 0;
            return (
              <mesh key={idx} position={[-1.14 + col * 0.325, -0.52 + row * 0.205, 0.11]}>
                <boxGeometry args={[0.19, 0.105, 0.035]} />
                <meshStandardMaterial color={active ? '#2dd4ff' : '#8fb8d8'} emissive={active ? '#2dd4ff' : '#0b5d7a'} emissiveIntensity={active ? 0.34 : 0.12} roughness={0.3} metalness={0.3} />
              </mesh>
            );
          })}
          {[-0.72, 0, 0.72].map((x) => (
            <mesh key={x} position={[x, 0.76, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 1.5, 16]} />
              <meshStandardMaterial color="#7dd3fc" emissive="#2dd4ff" emissiveIntensity={0.25} />
            </mesh>
          ))}
          <mesh position={[0, -0.86, -0.03]}>
            <boxGeometry args={[2.85, 0.18, 0.16]} />
            <meshStandardMaterial color="#172554" roughness={0.42} metalness={0.42} />
          </mesh>
        </>
      )}
      <mesh position={[0, -0.95, -0.18]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.72, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.55} metalness={0.35} />
      </mesh>
    </group>
  );
}

function Payload({ subsystems, selectedId, mode, onSelect, compact = false, showcase = false, geometry = 'payload' }: DigitalTwin3DProps) {
  const group = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.13;
  });

  const positions = useMemo(() => {
    const base: [number, number, number][] = [
      [-1.6, 0.35, 0.82], [1.55, 0.30, 0.72], [0, 0.62, 1.12],
      [-0.82, -0.58, 0.85], [0.78, -0.58, 0.85], [-1.65, -0.45, -0.2],
      [1.6, -0.45, -0.2], [-0.68, 0.22, -1.05], [0.68, 0.22, -1.05], [0, -0.75, -0.65]
    ];
    if (geometry === 'rack') return base.map(([x, _y, z], idx) => [x * 0.68, 0.62 - idx * 0.34, z * 0.45] as [number, number, number]);
    if (geometry === 'gimbal') return base.map(([x, y, z]) => [x * 0.72, y * 0.9, z * 0.72] as [number, number, number]);
    if (isRadarGeometry(geometry)) return base.map(([x, y, z], idx) => [x * 0.74, y * 0.78 - (idx > 4 ? 0.16 : 0), z * 0.7] as [number, number, number]);
    return base;
  }, [geometry]);

  return (
    <group ref={group} scale={showcase ? 1.32 : compact ? 0.95 : 1.08} position={showcase ? [0, 0.02, 0] : [0, 0, 0]}>
      <mesh position={[0, 0, 0]} rotation={geometry === 'tilted-array' ? [0, 0, -0.22] : [0, 0, 0]}>
        <boxGeometry args={geometry === 'rack' ? [2.1, 2.2, 1.15] : geometry === 'pod' ? [3.4, 0.95, 1.25] : isRadarGeometry(geometry) ? [3.0, 1.15, 1.45] : [3.1, 1.28, 1.75]} />
        <meshStandardMaterial color="#152842" roughness={0.38} metalness={0.35} transparent opacity={0.92} />
      </mesh>
      {isRadarGeometry(geometry) ? (
        <RadarSurfaceMesh geometry={geometry} />
      ) : (
        <mesh position={[0, 0, geometry === 'rack' ? 0.7 : 1.03]} rotation={geometry === 'tilted-array' ? [0, 0, -0.22] : [0, 0, 0]}>
          <boxGeometry args={geometry === 'gimbal' ? [1.45, 0.9, 0.14] : [2.25, 0.9, 0.12]} />
          <meshStandardMaterial color="#203a5f" emissive="#0b5d7a" emissiveIntensity={0.18} />
        </mesh>
      )}
      <mesh position={[0, 0.78, 0.05]}>
        <sphereGeometry args={geometry === 'gimbal' ? [0.58, 32, 16] : [0.42, 32, 16]} />
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
  const camera = props.showcase
    ? { position: [2.8, 1.7, 4.2] as [number, number, number], fov: 34 }
    : { position: [3.8, 2.7, 4.4] as [number, number, number], fov: 44 };

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-belcyan/20 bg-[#050b15] shadow-glow">
      {isRadarGeometry(props.geometry) && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(45,212,255,0.22),transparent_34%),radial-gradient(circle_at_74%_22%,rgba(246,183,60,0.12),transparent_26%)]" />
      )}
      <Canvas camera={camera}>
        <ambientLight intensity={isRadarGeometry(props.geometry) ? 0.72 : 0.58} />
        <pointLight position={[3, 5, 4]} intensity={isRadarGeometry(props.geometry) ? 2.1 : 1.6} color="#2dd4ff" />
        <pointLight position={[-3, 2, -4]} intensity={isRadarGeometry(props.geometry) ? 1.35 : 1.1} color="#f6b73c" />
        {isRadarGeometry(props.geometry) && <pointLight position={[0, 0, 3]} intensity={1.15} color="#4ade80" />}
        <Payload {...props} />
      </Canvas>
      <div className="pointer-events-none -mt-14 px-4 pb-4 text-xs text-slate-400">
        <span className="rounded-full border border-belcyan/20 bg-belcyan/10 px-3 py-1">Interactive synthetic 3D twin · component mesh + surface detail · mode: {props.mode} · geometry: {props.geometry ?? 'payload'}</span>
      </div>
    </div>
  );
}
