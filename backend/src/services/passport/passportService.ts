import type { TaoPassport } from '@tao-passport/shared-types';
import { getWalletSnapshot, getWalletSubnetParticipation } from '../../blockchain/bittensor/client.js';
import { getDemoAchievements } from '../achievements/achievementService.js';
import { buildReputationSignals, calculateTrustScore } from '../reputation/reputationService.js';
import { getDemoTimeline } from '../timeline/timelineService.js';

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
