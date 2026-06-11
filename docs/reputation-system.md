# Reputation System

TAO Passport uses weighted reputation signals to calculate wallet trust. The current implementation is a scaffold backed by demo data, but the signal model is intended to stay explainable when live Bittensor and ecosystem integrations are added.

## Current Weighted Signals

The backend currently calculates the trust score from six signal groups:

| Signal | Current source | Weight | Current scoring note |
| --- | --- | --- | --- |
| Validator reliability | Chain | `0.28` | Uses the validator score from the wallet snapshot. |
| Miner participation | Chain | `0.16` | Uses the miner score from the wallet snapshot. |
| Governance activity | Chain | `0.14` | Starts at `60` and adds `2` points per recorded vote, capped at `100`. |
| Subnet participation | Derived | `0.12` | Starts at `55` and adds `7` points per participating subnet, capped at `100`. |
| GitTensor contribution | GitTensor | `0.25` | Fixed demo score in the current scaffold. |
| Community signal | Community | `0.05` | Uses the community score from the wallet snapshot. |

The current code lives in `backend/src/services/reputation/reputationService.ts`.

## Governance Signals

Governance signals are intended to represent protocol-level participation instead of financial value or social popularity.

### Planned source signals

| Signal | Intended collection source | Why it matters |
| --- | --- | --- |
| Vote participation count | On-chain governance events or indexed proposal vote history | Distinguishes active participants from passive holders. |
| Proposal participation recency | Indexed governance activity timestamps | Prevents old one-time participation from dominating the score forever. |
| Proposal coverage | Proposal IDs linked to a wallet over time | Adds context for breadth of governance engagement. |
| Delegate or proposer roles | Governance-specific chain events, when available | Recognizes higher-effort governance participation. |

### Collection assumptions

- Governance data should come from verifiable chain events or a reproducible indexer.
- Each recorded vote should include a proposal identifier, wallet address, timestamp, and source provenance.
- If multiple indexers are used, TAO Passport should reconcile duplicates by proposal ID and wallet address before scoring.

### Freshness and stale-data handling

- A wallet profile should show when governance data was last refreshed.
- Cached governance aggregates should expire on a bounded TTL, then be recomputed from source data.
- If the latest governance source is unavailable, the passport may continue showing the cached score, but the profile should expose that it is cached and when it expires.
- Governance signals should decay in influence when participation is very old, rather than treating a vote from years ago as equal to a recent vote.

### Scoring impact

- The current scaffold uses only `governanceVotes` and maps it into the `Governance activity` score.
- A production model should combine volume, recency, and breadth rather than raw vote count alone.
- Governance participation should remain a moderate-weight signal; it is important, but it should not overpower validator, miner, or builder history.

## Community Signals

Community signals are intended to capture durable ecosystem work that does not appear directly in validator, miner, or GitTensor records.

### Planned source signals

| Signal | Intended collection source | Why it matters |
| --- | --- | --- |
| Educational content or documentation | Public repositories, docs contributions, verified posts, ecosystem knowledge bases | Rewards repeatable ecosystem support work. |
| Event or moderation support | Public community roles, recorded event participation, moderation logs where publishable | Recognizes operational support outside code. |
| Verified ecosystem help | Public issue triage, support threads, answer history, maintainership signals | Captures durable non-code contribution. |
| Reputation endorsements | Curated attestations or signed references, if adopted later | Adds context, but should be weakly weighted and abuse-resistant. |

### Collection assumptions

- Community signals should only use public, auditable, or explicitly consented sources.
- Private chats, DMs, or non-public moderation records should not be ingested into passport scores.
- Source-specific heuristics must be documented because community work is easier to misclassify than chain activity.

### Freshness and stale-data handling

- Community inputs should include a last-seen timestamp and source label.
- Stale community records should either decay or fall out of the aggregate after a documented window.
- Manual or curated signals should be reviewable and reversible.

### Scoring impact

- The current scaffold uses a single `communityScore` input with a low weight of `0.05`.
- That low weight is deliberate: community signals are useful, but they are also the easiest to game if they are not sourced carefully.
- A production model should keep community scoring conservative unless the source quality and review process are strong.

## Passport Profile Representation

Governance and community signals should be visible both in profile summary data and the explainable trust breakdown.

### Current profile fields

- `profileMetadata.governanceVotes`
- `profileMetadata.cache`
- `communityScore`
- `reputationSignals[]`
- `timeline[]`

### Example profile interpretation

For a wallet with:

- `governanceVotes: 14`
- `communityScore: 87`
- `subnetsParticipated: 3`

The current scaffold derives:

- `Governance activity`: `88/100`
- `Community signal`: `87/100`

Those values appear in the trust breakdown, while the raw governance vote count appears in the passport card metadata.

## Limitations

- The repository is not yet connected to production Bittensor governance indexers.
- The GitTensor contribution score is still fixed demo data.
- Community signals are modeled conceptually, but not yet backed by a live ingestion pipeline.
- No negative governance or community events are modeled yet.
- No formal signal decay function is implemented yet; only cache metadata is exposed.

## Scoring Principles

- Scores must be explainable.
- Weights must be documented.
- Signals should prefer durable behavior over one-time actions.
- Public source provenance matters more than broad source coverage.
- Abuse risks should be reviewed before increasing a signal weight.
