# Architecture

TAO Passport is structured as a TypeScript monorepo with separate frontend, backend, shared type, shared utility, database, and documentation boundaries.

## System Flow

1. A user enters or opens a Bittensor wallet address.
2. The backend resolves chain, GitTensor, governance, subnet, and community signals.
3. The reputation service calculates weighted trust signals.
4. The achievement service maps historical behavior into badges.
5. The frontend renders a wallet passport, timeline, achievements, and leaderboard.

## Frontend

The frontend is a React + TypeScript + TailwindCSS app. It intentionally uses a small internal router state for the initial scaffold. A production version can move to React Router when deep links and indexed pages are required.

## Backend

The backend is an Express API with feature-oriented route modules. Services isolate business logic from HTTP handlers. Blockchain adapters live under `backend/src/blockchain` so live Bittensor APIs can replace mock data without rewriting API routes.

The reputation API currently exposes both weighted signal values and signal metadata. That metadata is the contract that documents expected governance and community inputs, freshness rules, limitations, and score interpretation for frontend or third-party consumers.

## Database

PostgreSQL stores wallet identity records, aggregate passport scores, achievements, and timeline events. The current schema is intentionally minimal and should be expanded as live data ingestion matures.
