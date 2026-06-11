import assert from 'node:assert/strict';
import test from 'node:test';
import { getBittensorCacheMetrics, resetBittensorClientState } from '../src/blockchain/bittensor/client.js';
import { sampleWalletAddress } from '../src/repositories/passportRepository.js';
import { findPassport } from '../src/repositories/passportRepository.js';
import { getDemoLeaderboard } from '../src/services/reputation/reputationService.js';

test('reuses cached wallet and subnet metadata across profile and leaderboard flows', async () => {
  resetBittensorClientState();

  await findPassport(sampleWalletAddress);
  const afterPassport = getBittensorCacheMetrics();

  assert.equal(afterPassport.walletSnapshotLoads, 1);
  assert.equal(afterPassport.subnetMetadataLoads, 3);

  await findPassport(sampleWalletAddress);
  const afterSecondPassport = getBittensorCacheMetrics();

  assert.deepEqual(afterSecondPassport, afterPassport);

  await getDemoLeaderboard();
  const afterLeaderboard = getBittensorCacheMetrics();

  assert.equal(afterLeaderboard.walletSnapshotLoads, 3);
  assert.equal(afterLeaderboard.subnetMetadataLoads, 3);
});
