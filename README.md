# AIonOS Indigenous Digital Twin Mission Lab for BEL

A high-impact, front-end-first prototype for a safe, synthetic, non-classified Digital Twin Platform demonstration aligned to BEL's Expression of Interest for an Indigenous Digital Twin Platform.

## What this prototype demonstrates

- System-of-systems digital twin for a fictional Integrated EW-Radar-EO Payload
- Real-time synthetic telemetry
- 3D digital twin visualization with selectable subsystem overlays
- Multiphysics surrogate / ROM-ready simulation workbench
- Mission scenario engine using fictional, non-actionable scenarios
- Predictive maintenance and predictive operations dashboard
- Digital thread and traceability matrix
- Solver and API integration architecture
- Secure on-premise / air-gapped deployment blueprint
- Guided 7-minute demo story mode

## Safe data posture

All assets, telemetry, scenarios, models and recommendations are fictional and synthetic. The POC does not use real BEL data, classified defence information, actionable EW/radar parameters or real military tactics.

## Local setup

```bash
npm install
npm run dev
```

Open the printed local URL in your browser.

## Build for static hosting / GitHub Pages

```bash
npm run build
```

The production-ready static files will be generated in `dist/`.

For GitHub Pages, use the included GitHub Actions workflow instead of publishing the repository root from Pages settings. The root `index.html` is a Vite development entry that imports `/src/main.tsx`; GitHub Pages must receive the compiled `dist/` artifact produced by `npm run build`.

Recommended Pages setup:

1. Open repository **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main`/`master` or manually run **Deploy website to GitHub Pages** from the Actions tab.

## How this evolves into a real BEL platform

The POC is intentionally structured as a clean React + Vite + TypeScript application with JSON datasets and TypeScript surrogate models. In production, the mock services can be replaced with secure on-premise microservices, solver adapters, telemetry connectors, PLM/ALM integrations, audit services and HPC/GPU job queues.

## Final tagline

From design simulation to mission assurance — BEL-owned, indigenous, multiphysics digital twin infrastructure.
