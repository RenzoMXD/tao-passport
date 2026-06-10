import type { Achievement } from './achievement.js';
import type { ReputationSignal } from './reputation.js';

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  occurredAt: string;
  source: 'chain' | 'gittensor' | 'community';
};

export type GitTensorRepositoryContribution = {
  name: string;
  url: string;
  contributionCount: number;
  mergedPullRequests: number;
};

export type GitTensorActivity = {
  id: string;
  title: string;
  repository: string;
  occurredAt: string;
  type: 'commit' | 'pull_request' | 'issue' | 'review';
};

export type GitTensorContributionSummary = {
  totalContributions: number;
  mergedPullRequests: number;
  lastContributionAt: string;
  contributionFreshness: 'fresh' | 'active' | 'stale';
  repositories: GitTensorRepositoryContribution[];
  recentActivity: GitTensorActivity[];
};

export type TaoPassport = {
  walletAddress: string;
  summary: string;
  level: number;
  trustScore: number;
  validatorScore: number;
  minerScore: number;
  communityScore: number;
  yearsActive: number;
  gitTensor: GitTensorContributionSummary;
  achievements: Achievement[];
  reputationSignals: ReputationSignal[];
  timeline: TimelineEvent[];
};
