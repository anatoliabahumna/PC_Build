# FuturaForge PC Build Planner

A modern, high-speed personal PC build planning cockpit for brainstorming, comparing, budgeting, and tracking every step from parts lists to returns.

## Features
- Curated component library with category filters and rapid add-to-build actions.
- Build planner with live budget, wattage telemetry, and shareable notes.
- Comparison view to evaluate multiple builds with cost deltas and PSU headroom guidance.
- Order + return command center with status accents and quick RMA logging.
- Brainstorm board for capturing ideas, checklists, and tuning reminders.

## Getting started
```bash
npm install
npm run dev    # start Vite dev server
npm run build  # type-check + production build
npm test       # run automated Vitest suite
```

## Testing strategy
- UI regression tests cover core planner flows, filtering, order controls, and brainstorming additions.
- Utility unit tests verify budget, wattage, and status accent calculations.

## Tech stack
- React + TypeScript + Vite
- Vitest + @testing-library/react for automated coverage
- Futuristic dark-theme UI built with modern gradients and pill components
