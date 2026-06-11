import type { LeaderboardEntry, ReputationSignal } from '@tao-passport/shared-types';
import { weightedAverage } from '@tao-passport/shared-utils';
import { formatSubnetRole, getWalletSnapshot } from '../../blockchain/bittensor/client.js';

type ReputationSignalInput = {
  validatorScore: number;
  minerScore: number;
  governanceVotes: number;
  subnetsParticipated: number;
  communityScore: number;
};

type ReputationSignalDocumentation = {
  signal: string;
  source: 'chain' | 'gittensor' | 'community' | 'derived';
  weight: number;
  currentScoring: string;
  plannedInputs: string[];
  freshnessPolicy: string;
  limitations: string[];
};

export type ReputationSignalCatalog = {
  summary: string;
  staleDataPolicy: string[];
  signals: ReputationSignalDocumentation[];
};

export function buildReputationSignals(input: ReputationSignalInput): ReputationSignal[] {
  const governanceScore = Math.min(100, 60 + input.governanceVotes * 2);
  const subnetScore = Math.min(100, 55 + input.subnetsParticipated * 7);

  return [
    { name: 'Validator reliability', score: input.validatorScore, weight: 0.28, source: 'chain' },
    { name: 'Miner participation', score: input.minerScore, weight: 0.16, source: 'chain' },
    { name: 'Governance activity', score: governanceScore, weight: 0.14, source: 'chain' },
    { name: 'Subnet participation', score: subnetScore, weight: 0.12, source: 'derived' },
    { name: 'GitTensor contribution', score: 94, weight: 0.25, source: 'gittensor' },
    { name: 'Community signal', score: input.communityScore, weight: 0.05, source: 'community' },
  ];
}

export function calculateTrustScore(signals: ReputationSignal[]): number {
  return weightedAverage(signals);
}

export function getReputationSignalCatalog(): ReputationSignalCatalog {
  return {
    summary: 'Explainable signal catalog for TAO Passport reputation scoring.',
    staleDataPolicy: [
      'Profiles expose cache metadata with cachedAt, expiresAt, source, and ttlMs.',
      'Governance and community aggregates should be recomputed from verifiable sources after cache expiry.',
      'Older governance and community activity should decay over time instead of keeping permanent full weight.',
    ],
    signals: [
      {
        signal: 'Validator reliability',
        source: 'chain',
        weight: 0.28,
        currentScoring: 'Uses the validator score from the wallet snapshot.',
        plannedInputs: ['validator uptime', 'consistency over time', 'subnet performance history'],
        freshnessPolicy: 'Refresh from chain or indexer snapshots on cache expiry.',
        limitations: ['Current implementation uses demo wallet snapshot data.'],
      },
      {
        signal: 'Miner participation',
        source: 'chain',
        weight: 0.16,
        currentScoring: 'Uses the miner score from the wallet snapshot.',
        plannedInputs: ['mining history', 'subnet role continuity', 'recent miner activity'],
        freshnessPolicy: 'Refresh from chain or indexer snapshots on cache expiry.',
        limitations: ['Current implementation uses demo wallet snapshot data.'],
      },
      {
        signal: 'Governance activity',
        source: 'chain',
        weight: 0.14,
        currentScoring: 'Starts at 60 and adds 2 points per recorded governance vote, capped at 100.',
        plannedInputs: ['governance vote count', 'proposal participation recency', 'proposal coverage breadth'],
        freshnessPolicy: 'Use verifiable governance events, keep cached metadata visible, and decay very old participation.',
        limitations: ['Current implementation only models vote count.', 'No proposal-level provenance is stored yet.'],
      },
      {
        signal: 'Subnet participation',
        source: 'derived',
        weight: 0.12,
        currentScoring: 'Starts at 55 and adds 7 points per participating subnet, capped at 100.',
        plannedInputs: ['subnet count', 'role diversity', 'contribution weight history'],
        freshnessPolicy: 'Recompute from current subnet participation snapshots.',
        limitations: ['Current implementation is derived from demo subnet participation fixtures.'],
      },
      {
        signal: 'GitTensor contribution',
        source: 'gittensor',
        weight: 0.25,
        currentScoring: 'Uses a fixed demo score of 94 in the current scaffold.',
        plannedInputs: ['merged pull requests', 'reviews', 'issue work', 'maintained ecosystem repositories'],
        freshnessPolicy: 'Refresh from GitTensor-linked public contribution sources on cache expiry.',
        limitations: ['The score is currently fixed demo data.'],
      },
      {
        signal: 'Community signal',
        source: 'community',
        weight: 0.05,
        currentScoring: 'Uses the community score from the wallet snapshot.',
        plannedInputs: ['public support work', 'documentation or educational contributions', 'verified ecosystem help'],
        freshnessPolicy: 'Use only public or consented sources, track last-seen timestamps, and decay stale records.',
        limitations: ['Current implementation uses a single aggregate input.', 'No live community ingestion pipeline exists yet.'],
      },
    ],
  };
}

const leaderboardWallets = [
  '5FAbc123TAOPassportDemoWalletAddress999999999999',
  '5Fxyz789LongTermSubnetMinerWalletAddress999999999',
  '5Gdao456GovernanceParticipantWalletAddress99999999',
];

export async function getDemoLeaderboard(): Promise<LeaderboardEntry[]> {
  const entries = await Promise.all(
    leaderboardWallets.map(async (walletAddress) => {
      const snapshot = await getWalletSnapshot(walletAddress);
      const subnetCount = snapshot.value.subnetParticipation.length;
      const topRole = snapshot.value.subnetParticipation
        .slice()
        .sort((left, right) => right.contributionWeight - left.contributionWeight)[0]?.role;
      const signals = buildReputationSignals({
        validatorScore: snapshot.value.validatorScore,
        minerScore: snapshot.value.minerScore,
        governanceVotes: snapshot.value.governanceVotes,
        subnetsParticipated: subnetCount,
        communityScore: snapshot.value.communityScore,
      });

      return {
        walletAddress,
        label: `${formatSubnetRole(topRole ?? 'builder')} across ${subnetCount} subnet${subnetCount === 1 ? '' : 's'}`,
        trustScore: calculateTrustScore(signals),
      };
    }),
  );

  return entries
    .sort((left, right) => right.trustScore - left.trustScore)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
