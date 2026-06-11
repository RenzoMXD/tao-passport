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
  source: 'chain' | 'community';
  provenance: ProvenanceMetadata;
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
