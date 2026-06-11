# Reputation System

TAO Passport uses weighted reputation signals to calculate wallet trust.

## Starter Signal Groups

| Signal | Source | Purpose |
| --- | --- | --- |
| Validator reliability | Chain | Measures validator consistency and operational trust. |
| Miner participation | Chain | Rewards durable subnet mining activity. |
| Governance activity | Chain | Identifies users participating in protocol decisions. |
| Project contribution | (bittensor)Subnet | Rewards code, reviews, and ecosystem project building. |
| Community signal | Community | Captures durable non-code ecosystem contribution. |

## Scoring Principles

- Scores must be explainable.
- Weights must be documented.
- Signals should prefer durable behavior over one-time actions.
- Abuse risks should be reviewed before increasing a signal weight.

## Provenance Metadata

Each reputation signal and timeline event should carry provenance metadata so a score can be audited instead of treated as a black box.

### Provenance Fields

| Field | Purpose |
| --- | --- |
| `sourceCategory` | Classifies whether the evidence came from chain, GitTensor, community, or a derived aggregate. |
| `sourceId` | Stable identifier for the underlying source record or aggregate. |
| `reference` | Human-readable reference used during debugging and support review. |
| `observedAt` | Timestamp for when the source evidence was last observed or refreshed. |
| `scoringModelVersion` | Reputation model version used when the score component was produced. |
| `confidence` | Maintainer confidence in the evidence quality (`high`, `medium`, `low`). |
| `evidenceLinks` | Optional links to methodology or source material relevant to the signal. |

### Interpretation

- Chain and derived signals should usually have `high` confidence when sourced from fresh indexed data.
- Community signals may have lower confidence because they often require softer heuristics or manual review.
- `observedAt` should be shown with cache freshness metadata so stale evidence is visible.
- `scoringModelVersion` should change whenever scoring weights or source interpretation changes.
