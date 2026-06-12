import type {
  LeaderboardEntry,
  LeaderboardResponse,
  LeaderboardSignalCategory,
  LeaderboardSort,
  ProvenanceMetadata,
  ReputationSignal,
} from '@tao-passport/shared-types';
import { weightedAverage } from '@tao-passport/shared-utils';
import { formatSubnetRole, getWalletSnapshot } from '../../blockchain/bittensor/client.js';

type ReputationSignalInput = {
  walletAddress: string;
  validatorScore: number;
  minerScore: number;
  governanceVotes: number;
  subnetParticipation: Array<{
    subnetId: number;
    role: string;
    contributionWeight: number;
    lastSeenAt: string;
  }>;
  communityScore: number;
  observedAt: string;
};

export const reputationScoringModelVersion = 'tao-passport-reputation/v1';

function toIsoTimestamp(value: string): string {
  return new Date(value).toISOString();
}

function getObservedAtFromRoles(
  subnetParticipation: ReputationSignalInput['subnetParticipation'],
  roles: string[],
  fallbackObservedAt: string,
): string {
  const timestamps = subnetParticipation
    .filter((entry) => roles.includes(entry.role))
    .map((entry) => Date.parse(entry.lastSeenAt))
    .filter((timestamp) => !Number.isNaN(timestamp));

  if (timestamps.length === 0) {
    return fallbackObservedAt;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function buildSignalProvenance(
  sourceCategory: ReputationSignal['source'],
  sourceId: string,
  observedAt: string,
  reference: string,
  evidenceLinks?: ProvenanceMetadata['evidenceLinks'],
): ProvenanceMetadata {
  return {
    sourceCategory,
    sourceId,
    reference,
    observedAt: toIsoTimestamp(observedAt),
    scoringModelVersion: reputationScoringModelVersion,
    confidence: sourceCategory === 'community' ? 'medium' : 'high',
    evidenceLinks,
  };
}

export function buildReputationSignals(input: ReputationSignalInput): ReputationSignal[] {
  const governanceScore = Math.min(100, 60 + input.governanceVotes * 2);
  const subnetScore = Math.min(100, 55 + input.subnetParticipation.length * 7);
  const validatorObservedAt = getObservedAtFromRoles(input.subnetParticipation, ['validator'], input.observedAt);
  const minerObservedAt = getObservedAtFromRoles(input.subnetParticipation, ['miner'], input.observedAt);
  const subnetObservedAt = getObservedAtFromRoles(
    input.subnetParticipation,
    ['validator', 'miner', 'delegate', 'builder'],
    input.observedAt,
  );
  const evidenceLinks = [
    {
      label: 'Methodology',
      url: 'https://github.com/RenzoMXD/tao-passport/blob/main/docs/reputation-system.md',
    },
  ];

  return [
    {
      name: 'Validator reliability',
      score: input.validatorScore,
      weight: 0.32,
      source: 'chain',
      provenance: buildSignalProvenance(
        'chain',
        `wallet:${input.walletAddress}:validator`,
        validatorObservedAt,
        'validator-reliability-fixture',
        evidenceLinks,
      ),
    },
    {
      name: 'Miner participation',
      score: input.minerScore,
      weight: 0.2,
      source: 'chain',
      provenance: buildSignalProvenance(
        'chain',
        `wallet:${input.walletAddress}:miner`,
        minerObservedAt,
        'miner-participation-fixture',
        evidenceLinks,
      ),
    },
    {
      name: 'Governance activity',
      score: governanceScore,
      weight: 0.18,
      source: 'chain',
      provenance: buildSignalProvenance(
        'chain',
        `wallet:${input.walletAddress}:governance`,
        input.observedAt,
        'governance-vote-fixture',
        evidenceLinks,
      ),
    },
    {
      name: 'Subnet participation',
      score: subnetScore,
      weight: 0.18,
      source: 'derived',
      provenance: buildSignalProvenance(
        'derived',
        `wallet:${input.walletAddress}:subnet-participation`,
        subnetObservedAt,
        'subnet-participation-aggregate',
        evidenceLinks,
      ),
    },
    {
      name: 'Community signal',
      score: input.communityScore,
      weight: 0.12,
      source: 'community',
      provenance: buildSignalProvenance(
        'community',
        `wallet:${input.walletAddress}:community`,
        '2026-06-05T12:00:00.000Z',
        'community-signal-fixture',
        evidenceLinks,
      ),
    },
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

function getMatchedCategories(input: {
  communityScore: number;
  governanceVotes: number;
  minerScore: number;
  subnetParticipation: ReputationSignalInput['subnetParticipation'];
  validatorScore: number;
}): LeaderboardEntry['matchedCategories'] {
  const roles = new Set(input.subnetParticipation.map((entry) => entry.role));
  const highestContributionWeight = input.subnetParticipation.reduce(
    (highestWeight, entry) => Math.max(highestWeight, entry.contributionWeight),
    0,
  );
  const matchedCategories: LeaderboardEntry['matchedCategories'] = [];

  if (input.validatorScore >= 80 || roles.has('validator')) {
    matchedCategories.push('validator');
  }

  if (input.minerScore >= 80 || roles.has('miner')) {
    matchedCategories.push('miner');
  }

  if (input.governanceVotes >= 12) {
    matchedCategories.push('governance');
  }

  if (input.subnetParticipation.length >= 2 && highestContributionWeight >= 0.7) {
    matchedCategories.push('subnet');
  }

  if (input.communityScore >= 80) {
    matchedCategories.push('community');
  }

  return matchedCategories;
}

function compareLeaderboardEntries(
  left: Pick<LeaderboardEntry, 'trustScore' | 'walletAddress'>,
  right: Pick<LeaderboardEntry, 'trustScore' | 'walletAddress'>,
  sort: LeaderboardSort,
): number {
  const trustScoreDifference =
    sort === 'trustScore:asc' ? left.trustScore - right.trustScore : right.trustScore - left.trustScore;

  if (trustScoreDifference !== 0) {
    return trustScoreDifference;
  }

  return left.walletAddress.localeCompare(right.walletAddress);
}

export async function getDemoLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  const entries = await Promise.all(
    leaderboardWallets.map(async (walletAddress) => {
      const snapshot = await getWalletSnapshot(walletAddress);
      const subnetCount = snapshot.value.subnetParticipation.length;
      const topRole = snapshot.value.subnetParticipation
        .slice()
        .sort((left, right) => right.contributionWeight - left.contributionWeight)[0]?.role;
      const signals = buildReputationSignals({
        walletAddress,
        validatorScore: snapshot.value.validatorScore,
        minerScore: snapshot.value.minerScore,
        governanceVotes: snapshot.value.governanceVotes,
        subnetParticipation: snapshot.value.subnetParticipation,
        communityScore: snapshot.value.communityScore,
        observedAt: snapshot.cache.cachedAt,
      });

      return {
        walletAddress,
        label: `${formatSubnetRole(topRole ?? 'delegate')} across ${subnetCount} subnet${subnetCount === 1 ? '' : 's'}`,
        trustScore: calculateTrustScore(signals),
        matchedCategories: getMatchedCategories({
          validatorScore: snapshot.value.validatorScore,
          minerScore: snapshot.value.minerScore,
          governanceVotes: snapshot.value.governanceVotes,
          subnetParticipation: snapshot.value.subnetParticipation,
          communityScore: snapshot.value.communityScore,
        }),
      };
    }),
  );

  return entries
    .sort((left, right) => compareLeaderboardEntries(left, right, 'trustScore:desc'))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export async function getDemoLeaderboard(): Promise<LeaderboardEntry[]> {
  return getDemoLeaderboardEntries();
}

export async function getPaginatedLeaderboard(input?: {
  category?: LeaderboardSignalCategory;
  limit?: number;
  page?: number;
  cursor?: string | null;
  sort?: LeaderboardSort;
}): Promise<LeaderboardResponse> {
  const category = input?.category ?? 'all';
  const limit = input?.limit ?? 10;
  const sort = input?.sort ?? 'trustScore:desc';
  const entries = await getDemoLeaderboardEntries();
  const filteredEntries = category === 'all' ? entries : entries.filter((entry) => entry.matchedCategories.includes(category));
  const sortedEntries = filteredEntries
    .slice()
    .sort((left, right) => compareLeaderboardEntries(left, right, sort))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
  const cursorOffset = input?.cursor ? Number(Buffer.from(input.cursor, 'base64url').toString('utf8')) : Number.NaN;
  const offset = Number.isInteger(cursorOffset) && cursorOffset >= 0 ? cursorOffset : ((input?.page ?? 1) - 1) * limit;
  const safeOffset = Math.max(0, Math.min(offset, sortedEntries.length));
  const pagedItems = sortedEntries.slice(safeOffset, safeOffset + limit);
  const page = sortedEntries.length === 0 ? 1 : Math.floor(safeOffset / limit) + 1;
  const nextOffset = safeOffset + limit;
  const previousOffset = Math.max(0, safeOffset - limit);

  return {
    items: pagedItems,
    total: sortedEntries.length,
    page,
    limit,
    hasNextPage: nextOffset < sortedEntries.length,
    hasPreviousPage: safeOffset > 0,
    nextCursor: nextOffset < sortedEntries.length ? Buffer.from(String(nextOffset)).toString('base64url') : null,
    previousCursor: safeOffset > 0 ? Buffer.from(String(previousOffset)).toString('base64url') : null,
    sort,
    category,
  };
}
