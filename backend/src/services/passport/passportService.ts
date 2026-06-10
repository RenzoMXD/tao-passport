import type { GitTensorContributionSummary, TaoPassport } from '@tao-passport/shared-types';
import { getWalletSnapshot } from '../../blockchain/bittensor/client.js';
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
  const reputationSignals = buildReputationSignals();

  return {
    walletAddress,
    summary: 'Experienced Bittensor participant with validator operations, governance activity, and GitTensor builder signals.',
    level: 18,
    trustScore: calculateTrustScore(reputationSignals),
    validatorScore: snapshot.validatorScore,
    minerScore: snapshot.minerScore,
    communityScore: 87,
    yearsActive: 2.4,
    gitTensor: getDemoGitTensorContributions(),
    achievements: getDemoAchievements(),
    reputationSignals,
    timeline: getDemoTimeline(),
  };
}
