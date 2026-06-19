# Architecture

## Front-end prototype architecture

- React + Vite + TypeScript application shell
- Tailwind CSS for boardroom-grade command-center UI
- React Three Fiber / Three.js for simplified 3D payload twin
- Recharts for trend, risk and simulation charts
- Local JSON datasets for synthetic telemetry and metadata
- TypeScript utilities for deterministic surrogate / ROM-style calculations
- Mock service functions for scenario execution and traceability export

## Production evolution

The front-end can evolve into a secure on-premise architecture with:

1. Data ingestion and pre-processing services
2. Knowledge representation for geometry, meshes, volumes and telemetry
3. Solver orchestration for high-fidelity physics solvers and ROM generation
4. Enterprise and solver integration through REST APIs and secure queues
5. Analytics and decision layer
6. Role-based access control, audit logging and VAPT readiness
7. On-premise HPC / GPU job orchestration
8. Source-code and IP handover package for BEL autonomy
