import type { Achievement } from './achievement.js';
import type { ProvenanceMetadata, ReputationSignal } from './reputation.js';

export type SubnetRole = 'validator' | 'miner' | 'delegate';

export type SubnetParticipation = {
  subnetId: number;
  role: SubnetRole;
  recentActivity: string;
  contributionWeight: number;
  lastSeenAt: string;
};

export type ProfileCacheMetadata = {
  source: 'live' | 'cache';
  cachedAt: string;
  expiresAt: string;
  ttlMs: number;
};

export type ProfileMetadata = {
  firstSeenAt: string;
  governanceVotes: number;
  subnetsParticipated: number;
  cache: ProfileCacheMetadata;
};

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  occurredAt: string;
<<<<<<< HEAD
  source: 'chain' | 'gittensor' | 'community';
  provenance: ProvenanceMetadata;
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
=======
  source: 'chain' | 'community';
>>>>>>> 7358433 (fix: external contribution for all users)
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
  subnetParticipation: SubnetParticipation[];
  profileMetadata: ProfileMetadata;
  achievements: Achievement[];
  reputationSignals: ReputationSignal[];
  timeline: TimelineEvent[];
};
