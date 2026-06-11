import type { GitTensorContributionSummary, TaoPassport } from '@tao-passport/shared-types';
import { getWalletSnapshot, getWalletSubnetParticipation } from '../../blockchain/bittensor/client.js';
import { getDemoAchievements } from '../achievements/achievementService.js';
import { buildReputationSignals, calculateTrustScore } from '../reputation/reputationService.js';
import { getDemoTimeline } from '../timeline/timelineService.js';

export function getDemoGitTensorContributions(): GitTensorContributionSummary {
  return {
    totalContributions: 128,
    mergedPullRequests: 23,
    lastContributionAt: '2025-09-14T00:00:00.000Z',
    contributionFreshness: 'fresh',
    repositories: [
      {
        name: 'opentensor/bittensor',
        url: 'https://github.com/opentensor/bittensor',
        contributionCount: 54,
        mergedPullRequests: 9,
      },
      {
        name: 'gittensor/validator-tooling',
        url: 'https://github.com/gittensor/validator-tooling',
        contributionCount: 41,
        mergedPullRequests: 8,
      },
      {
        name: 'tao-community/subnet-indexer',
        url: 'https://github.com/tao-community/subnet-indexer',
        contributionCount: 33,
        mergedPullRequests: 6,
      },
    ],
    recentActivity: [
      {
        id: 'gittensor-pr-217',
        title: 'Merged validator telemetry improvements',
        repository: 'gittensor/validator-tooling',
        occurredAt: '2025-09-14T00:00:00.000Z',
        type: 'pull_request',
      },
      {
        id: 'gittensor-review-184',
        title: 'Reviewed subnet scoring patch',
        repository: 'opentensor/bittensor',
        occurredAt: '2025-08-28T00:00:00.000Z',
        type: 'review',
      },
      {
        id: 'gittensor-issue-72',
        title: 'Triaged indexer sync edge case',
        repository: 'tao-community/subnet-indexer',
        occurredAt: '2025-08-09T00:00:00.000Z',
        type: 'issue',
      },
    ],
  };
}

export async function buildPassport(walletAddress: string): Promise<TaoPassport> {
  const snapshot = await getWalletSnapshot(walletAddress);
  const subnetParticipation = await getWalletSubnetParticipation(walletAddress);
  const reputationSignals = buildReputationSignals({
    walletAddress,
    validatorScore: snapshot.value.validatorScore,
    minerScore: snapshot.value.minerScore,
    governanceVotes: snapshot.value.governanceVotes,
    subnetParticipation,
    communityScore: snapshot.value.communityScore,
    observedAt: snapshot.cache.cachedAt,
  });
  const yearsActive = Math.max(
    0.1,
    Number((((Date.now() - new Date(snapshot.value.firstSeenAt).getTime()) / (1000 * 60 * 60 * 24 * 365.25))).toFixed(1)),
  );

  return {
    walletAddress,
    summary: 'Experienced Bittensor participant with validator operations, subnet activity, governance signals, and GitTensor builder history.',
    level: 18,
    trustScore: calculateTrustScore(reputationSignals),
    validatorScore: snapshot.value.validatorScore,
    minerScore: snapshot.value.minerScore,
    communityScore: snapshot.value.communityScore,
    yearsActive,
    gitTensor: getDemoGitTensorContributions(),
    subnetParticipation,
    profileMetadata: {
      firstSeenAt: snapshot.value.firstSeenAt,
      governanceVotes: snapshot.value.governanceVotes,
      subnetsParticipated: subnetParticipation.length,
      cache: snapshot.cache,
    },
    achievements: getDemoAchievements(),
    reputationSignals,
    timeline: getDemoTimeline(),
  };
}
