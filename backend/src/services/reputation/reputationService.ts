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
