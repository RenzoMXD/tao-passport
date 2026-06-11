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
