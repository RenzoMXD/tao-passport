
# TAO Passport

<p align="center">
  <img src="frontend/public/tao-passport.svg" alt="TAO Passport" width="120" />
</p>

<p align="center">
  <strong>A portable identity and reputation layer for Bittensor wallets.</strong>
</p>

<p align="center">
  <img width="922" height="614" alt="TAO Passport product preview" src="https://github.com/user-attachments/assets/e2548909-ab6a-4117-964e-0a56308049fa" />
</p>

<p align="center">
  <a href="https://bittensor.com/"><img alt="Bittensor" src="https://img.shields.io/badge/ecosystem-Bittensor-blue" /></a>
  <a href="https://github.com/RenzoMXD/tao-passport/issues"><img alt="Issues" src="https://img.shields.io/github/issues/RenzoMXD/tao-passport" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey" /></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/stack-TypeScript-3178c6" />
</p>

TAO Passport turns a raw TAO wallet address into a readable public profile: validator and miner history, subnet participation, governance activity, contributions, achievements, reputation signals, and a timeline of meaningful ecosystem activity.

It is built for the Bittensor ecosystem, where wallet identity alone is not enough to understand trust, contribution quality, or long-term participation.

---

## What This Is

TAO Passport is an initial full-stack scaffold for a Bittensor wallet reputation product.

| Surface | Purpose |
| --- | --- |
| Wallet passport | A public profile for a TAO wallet with level, score, summary, and activity history. |
| Reputation engine | Weighted signals from validator/miner activity, subnet participation, governance, GitTensor, and community behavior. |
| Achievement system | Badges for durable ecosystem participation such as validating, mining, voting, building, and contributing. |
| Timeline | Chronological wallet activity across chain, subnet, contribution, and community events. |
| Leaderboard | Discovery surface for high-signal Bittensor ecosystem participants. |

## What This Is Not

- It is not a wallet custody app.
- It is not a financial risk score.
- It is not a guarantee that a wallet owner is trustworthy.
- It is not yet connected to production Bittensor indexers.

The current implementation is a realistic product scaffold with demo data, API boundaries, shared types, database schema, and UI flows ready for live integrations.

---

## Why TAO Passport

Bittensor activity is spread across wallets, validators, miners, subnets, governance, GitHub/GitTensor contributions, and community channels. That makes it difficult to answer practical questions:

- Has this wallet participated consistently over time?
- Is this address connected to validator, miner, or builder activity?
- Which subnets does this participant contribute to?
- What signals explain the reputation score?
- Which achievements or timeline events support the profile?

TAO Passport gives each wallet a portable identity surface so users can inspect reputation instead of guessing from an address.

---

## Product Preview

The frontend currently includes:

- Landing page for the Bittensor reputation layer.
- Sample passport profile.
- Achievement grid.
- Trust score breakdown.
- Activity timeline.
- Leaderboard and search surfaces.

Core UI files live under `frontend/src/pages` and `frontend/src/components`.

---

## Repository Structure

```text
tao-passport/
├── backend/                 # Express API, services, blockchain adapters
├── database/                # PostgreSQL schema, migration, seed data
├── docs/                    # Architecture,scoring, achievements
├── frontend/                # React + Vite passport application
├── packages/
│   ├── shared-types/        # Passport, reputation, achievement contracts
│   └── shared-utils/        # Shared formatting and scoring helpers
├── scripts/                 # Data and maintenance scripts
├── docker-compose.yml       # Local PostgreSQL service
└── package.json             # npm workspace root
```

---

## Quick Start

Requirements:

- Node.js 20+
- npm 10+
- Docker, if running PostgreSQL locally

```bash
git clone https://github.com/RenzoMXD/tao-passport.git
cd tao-passport
cp .env.example .env
npm install
npm run dev
```

Default local services:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:4000` |
| Health check | `http://localhost:4000/health` |

Start PostgreSQL when database-backed development is needed:

```bash
docker compose up -d postgres
```

---

## Environment Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://tao_passport:tao_passport@localhost:5432/tao_passport` |
| `PORT` | Backend API port | `4000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:4000` |
| `BITTENSOR_NETWORK` | Target Bittensor network | `finney` |

Copy `.env.example` before running locally:

```bash
cp .env.example .env
```

---

## Development Commands

```bash
# Run frontend and backend together
npm run dev

# Build all workspaces
npm run build

# Run lint checks
npm run lint

# Run type checks
npm run typecheck

# Run tests where configured
npm run test
```

Workspace-specific commands:

```bash
npm run dev --workspace frontend
npm run dev --workspace backend
npm run build --workspace frontend
npm run build --workspace backend
```

---

## API Surface

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | API health check. |
| `GET` | `/api/passport/sample` | Returns the demo passport profile. |
| `GET` | `/api/passport/:walletAddress` | Looks up a wallet passport by Substrate-style address. |
| `GET` | `/api/achievements` | Lists available achievement definitions. |
| `GET` | `/api/reputation/signals` | Returns reputation signal metadata. |
| `GET` | `/api/reputation/leaderboard` | Returns ranked reputation profiles. |

Example:

```bash
curl http://localhost:4000/api/passport/sample
```

---

## Reputation Model

TAO Passport is designed around explainable reputation. A score should be traceable to specific signals instead of appearing as a black box.

| Signal Group | Example Inputs | Why It Matters |
| --- | --- | --- |
| Validator reliability | uptime, consistency, subnet performance | Shows operational trust and long-term network contribution. |
| Miner participation | mining history, subnet role, recent activity | Captures durable work across Bittensor subnets. |
| Governance activity | proposal voting, participation frequency | Identifies protocol-level engagement. |
| GitTensor contribution | merged PRs, reviews, issue work, recency | Rewards builder activity and open-source contribution. |
| Community signal | durable non-code contribution, ecosystem support | Adds context outside pure chain metrics. |

See `docs/reputation-system.md` for the starter scoring principles.

### Governance and Community Signals

Issue `#3` asks for explicit documentation of governance and community signal sources. That is now documented in `docs/reputation-system.md`, including:

- planned governance vote and proposal-participation inputs
- planned community contribution inputs
- source and provenance expectations
- stale-data and cache handling expectations
- current scoring weights and limitations
- an example of how those signals appear in a passport profile

---

## Architecture

The project uses a TypeScript monorepo with isolated boundaries:

1. The user opens or searches a Bittensor wallet address.
2. The backend resolves passport data through repository and service layers.
3. Blockchain adapters provide a replaceable boundary for live Bittensor queries.
4. Reputation and achievement services transform raw signals into profile data.
5. The frontend renders the passport card, achievements, trust breakdown, timeline, and leaderboard.

Read more in `docs/architecture.md`.

---

## Security and Privacy Notes

- TAO Passport should never require wallet custody or private keys.
- Public profiles should explain signal sources and freshness.
- GitHub or GitTensor integrations should avoid exposing private contribution context.
- Reputation scores should be transparent, versioned, and auditable.
- Public endpoints should use validation, rate limits, and cache controls before production use.

---

## Useful Docs

- [Architecture](docs/architecture.md)
- [Reputation System](docs/reputation-system.md)
- [Achievements](docs/achievements.md)
- [Contributing](CONTRIBUTING.md)

---
## 🙌 Contributing
TAO passport will flourish via open-source collaboration. In this spirit, we embrace diverse contributions from the community. If you would like to be a part, review our Contribution Guidelines first.

[Contributing](CONTRIBUTING.md)

---

MIT — see `LICENSE`.
