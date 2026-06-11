import type { ProfileCacheMetadata, SubnetParticipation, SubnetRole } from '@tao-passport/shared-types';
import { createTtlCache } from '../../utils/ttlCache.js';

type RawSubnetParticipation = Omit<SubnetParticipation, 'recentActivity'>;

export type ChainWalletSnapshot = {
  walletAddress: string;
  validatorScore: number;
  minerScore: number;
  communityScore: number;
  governanceVotes: number;
  firstSeenAt: string;
  subnetParticipation: RawSubnetParticipation[];
};

type SubnetMetadata = {
  subnetId: number;
  recentActivity: string;
};

type CachedValue<T> = {
  value: T;
  cache: ProfileCacheMetadata;
};

const metadataTtlMs = Number(process.env.BITTENSOR_METADATA_TTL_MS ?? 5 * 60 * 1000);
const walletCache = createTtlCache<ChainWalletSnapshot>(metadataTtlMs);
const subnetCache = createTtlCache<SubnetMetadata>(metadataTtlMs);

const sampleWalletAddress = '5FAbc123TAOPassportDemoWalletAddress999999999999';

const walletFixtures: Record<string, Omit<ChainWalletSnapshot, 'walletAddress'>> = {
  [sampleWalletAddress]: {
    validatorScore: 92,
    minerScore: 76,
    communityScore: 87,
    governanceVotes: 14,
    firstSeenAt: '2023-02-01T00:00:00.000Z',
    subnetParticipation: [
      { subnetId: 1, role: 'validator', contributionWeight: 0.91, lastSeenAt: '2026-06-08T14:15:00.000Z' },
      { subnetId: 8, role: 'builder', contributionWeight: 0.84, lastSeenAt: '2026-06-07T09:30:00.000Z' },
      { subnetId: 19, role: 'miner', contributionWeight: 0.73, lastSeenAt: '2026-06-08T22:05:00.000Z' },
    ],
  },
  '5Fxyz789LongTermSubnetMinerWalletAddress999999999': {
    validatorScore: 68,
    minerScore: 94,
    communityScore: 79,
    governanceVotes: 9,
    firstSeenAt: '2022-08-17T00:00:00.000Z',
    subnetParticipation: [
      { subnetId: 19, role: 'miner', contributionWeight: 0.95, lastSeenAt: '2026-06-08T20:44:00.000Z' },
      { subnetId: 27, role: 'miner', contributionWeight: 0.86, lastSeenAt: '2026-06-08T18:11:00.000Z' },
    ],
  },
  '5Gdao456GovernanceParticipantWalletAddress99999999': {
    validatorScore: 71,
    minerScore: 63,
    communityScore: 83,
    governanceVotes: 21,
    firstSeenAt: '2023-05-12T00:00:00.000Z',
    subnetParticipation: [
      { subnetId: 1, role: 'delegate', contributionWeight: 0.66, lastSeenAt: '2026-06-06T11:05:00.000Z' },
      { subnetId: 8, role: 'builder', contributionWeight: 0.71, lastSeenAt: '2026-06-05T16:22:00.000Z' },
    ],
  },
};

const subnetMetadataFixtures: Record<number, SubnetMetadata> = {
  1: { subnetId: 1, recentActivity: 'Validator emissions remained above network median this week.' },
  8: { subnetId: 8, recentActivity: 'Builder activity included repository reviews and deployment updates.' },
  19: { subnetId: 19, recentActivity: 'Miner submissions stayed active through the latest scoring window.' },
  27: { subnetId: 27, recentActivity: 'Subnet participation expanded with durable miner uptime.' },
};

const metrics = {
  walletSnapshotLoads: 0,
  subnetMetadataLoads: 0,
};

function cloneSnapshot(walletAddress: string, fixture: Omit<ChainWalletSnapshot, 'walletAddress'>): ChainWalletSnapshot {
  return {
    walletAddress,
    validatorScore: fixture.validatorScore,
    minerScore: fixture.minerScore,
    communityScore: fixture.communityScore,
    governanceVotes: fixture.governanceVotes,
    firstSeenAt: fixture.firstSeenAt,
    subnetParticipation: fixture.subnetParticipation.map((entry) => ({ ...entry })),
  };
}

function resolveWalletFixture(walletAddress: string): ChainWalletSnapshot {
  const fixture = walletFixtures[walletAddress] ?? walletFixtures[sampleWalletAddress];
  return cloneSnapshot(walletAddress, fixture);
}

async function loadWalletSnapshot(walletAddress: string): Promise<ChainWalletSnapshot> {
  metrics.walletSnapshotLoads += 1;
  return resolveWalletFixture(walletAddress);
}

async function loadSubnetMetadata(subnetId: number): Promise<SubnetMetadata> {
  metrics.subnetMetadataLoads += 1;
  return subnetMetadataFixtures[subnetId] ?? { subnetId, recentActivity: 'Recent activity is being indexed for this subnet.' };
}

export async function getWalletSnapshot(walletAddress: string): Promise<CachedValue<ChainWalletSnapshot>> {
  const result = await walletCache.getOrLoad(walletAddress, () => loadWalletSnapshot(walletAddress));

  return {
    value: result.value,
    cache: {
      source: result.source,
      cachedAt: result.cachedAt,
      expiresAt: result.expiresAt,
      ttlMs: result.ttlMs,
    },
  };
}

export async function getWalletSubnetParticipation(walletAddress: string): Promise<SubnetParticipation[]> {
  const snapshot = await getWalletSnapshot(walletAddress);
  const enriched = await Promise.all(
    snapshot.value.subnetParticipation.map(async (entry) => {
      const metadata = await subnetCache.getOrLoad(String(entry.subnetId), () => loadSubnetMetadata(entry.subnetId));

      return {
        subnetId: entry.subnetId,
        role: entry.role,
        recentActivity: metadata.value.recentActivity,
        contributionWeight: entry.contributionWeight,
        lastSeenAt: entry.lastSeenAt,
      };
    }),
  );

  return enriched.sort((left, right) => right.contributionWeight - left.contributionWeight);
}

export function formatSubnetRole(role: SubnetRole): string {
  return `${role.slice(0, 1).toUpperCase()}${role.slice(1)}`;
}

export function getBittensorCacheMetrics() {
  return { ...metrics };
}

export function resetBittensorClientState() {
  metrics.walletSnapshotLoads = 0;
  metrics.subnetMetadataLoads = 0;
  walletCache.clear();
  subnetCache.clear();
}
