# Contributing to TAO Passport

TAO Passport is a Bittensor ecosystem project for turning TAO wallet activity into a readable reputation profile. Contributions should improve one of three things: signal quality, product clarity, or operational reliability.

This guide is intentionally specific. TAO Passport touches wallets, validator/miner activity, subnet participation, governance, reputation scoring, and community signals, so changes need to be explainable and easy to review.

---

## Good First Contribution Areas

| Area | Useful Work |
| --- | --- |
| Wallet profiles | Better SS58/Substrate validation, profile empty states, wallet summary formatting. |
| Bittensor data | Chain query adapters, subnet participation mapping, validator/miner activity snapshots. |
| Reputation | Transparent scoring weights, signal provenance, normalization, abuse-resistance reviews. |
| Subnet data | Subnet participation mapping, governance activity, role coverage, freshness handling. |
| Achievements | New badge definitions, deterministic ordering, unlock criteria documentation. |
| Frontend | Passport cards, timeline filters, leaderboard UX, accessibility, loading/error states. |
| Backend | API validation, caching, rate limiting, repository implementations, tests. |
| Docs | Architecture, scoring methodology, setup, deployment, troubleshooting. |

---

## What To Avoid

- Do not add opaque reputation signals that users cannot audit.
- Do not require wallet custody, private keys, seed phrases, or signing for basic profile views.
- Do not commit secrets, GitHub tokens, production database URLs, or private chain credentials.
- Do not mix unrelated UI, API, and scoring changes in one pull request.
- Do not optimize for score farming without documenting abuse risks.

---

## Local Development

Requirements:

- Node.js 20+
- npm 10+
- Docker, if running PostgreSQL locally

```bash
git clone https://github.com/RenzoMXD/tao-passport.git
cd tao-passport
cp .env.example .env
npm install
docker compose up -d postgres
npm run dev
```

Default services:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:4000` |
| Health check | `http://localhost:4000/health` |

---

## Validation Commands

Run the narrowest checks that cover your change, then broader checks before opening a PR.

```bash
# TypeScript builds across workspaces
npm run build

# ESLint across workspaces
npm run lint

# Type-only checks
npm run typecheck

# Tests where configured
npm run test
```

Workspace-specific checks:

```bash
npm run build --workspace frontend
npm run build --workspace backend
npm run lint --workspace frontend
npm run lint --workspace backend
```

---

## Pull Request Standard

A good TAO Passport PR should include:

1. A clear problem statement.
2. A focused implementation with minimal unrelated churn.
3. Screenshots or short recordings for UI changes.
4. Tests or validation notes for API, scoring, and data-mapping changes.
5. Documentation updates for setup, public APIs, scoring behavior, or architecture changes.

Suggested PR title format:

```text
feat: add subnet participation section
fix: validate wallet input before passport lookup
docs: document reputation scoring methodology
perf: cache Bittensor metadata lookups
```

---

## Reputation Model Requirements

Reputation changes have a higher review bar because they affect user trust.

Any new or modified scoring signal must document:

- **Source**: where the data comes from.
- **Weight**: how strongly it affects the final score.
- **Freshness**: how often it updates and when it becomes stale.
- **Normalization**: how raw values become comparable score inputs.
- **Abuse risk**: how the signal can be gamed and how the design reduces that risk.
- **User explanation**: how the UI or docs should explain the signal.

Prefer durable behavior over one-time events. Validator reliability, long-term miner participation, and sustained governance/community activity should matter more than easy-to-spam signals.

---

## API and Backend Guidelines

- Validate wallet and route input at the API boundary.
- Keep HTTP handlers thin; put business logic in services.
- Keep blockchain access behind adapters under `backend/src/blockchain`.
- Return stable error shapes for user-facing failures.
- Add caching or rate limiting when a route can trigger expensive external lookups.
- Keep demo data clearly separated from live integration code.

---

## Frontend Guidelines

- Make trust signals visible and explainable.
- Show useful empty, loading, and error states.
- Keep passport pages scannable: summary first, evidence next.
- Avoid presenting reputation as a guarantee of safety.
- Prefer deterministic ordering for achievements, timeline events, and leaderboard rows.
- Keep components small and aligned with `frontend/src/components`.

---

## Documentation Guidelines

Update documentation when changing:

- Setup or environment variables.
- API routes or response shapes.
- Reputation scoring behavior.
- Achievement definitions.
- Data-source assumptions.
- Deployment or security expectations.

Useful docs:

- `README.md`
- `docs/architecture.md`
- `docs/reputation-system.md`
- `docs/achievements.md`

---

## Security Notes

TAO Passport should be safe by design:

- Never request private keys or seed phrases.
- Rate-limit public lookup endpoints before production use.
- Keep scoring inputs auditable and versioned.

If you find a serious security issue, avoid publishing exploit details in a public issue. Open a minimal report and coordinate privately with the maintainer.

---

## Maintainer Review Checklist

Before merging, verify:

- The change is scoped to one clear problem.
- The implementation matches the stated behavior.
- Reputation changes are documented and explainable.
- User-facing states are understandable.
- Validation commands were run or skipped with a clear reason.
- No secrets or private credentials are included.

---

## Conduct

Be direct, respectful, and evidence-driven. Technical disagreement is welcome when it improves the product. Keep discussions focused on trustworthy Bittensor identity, transparent reputation, and useful wallet profiles.
