import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleWalletAddress } from '../src/repositories/passportRepository.js';
import { buildPassport } from '../src/services/passport/passportService.js';

test('builds passport with subnet participation and profile metadata', async () => {
  const passport = await buildPassport(sampleWalletAddress);

  assert.equal(passport.profileMetadata.subnetsParticipated, passport.subnetParticipation.length);
  assert.equal(passport.subnetParticipation.length > 0, true);
  assert.equal(passport.subnetParticipation[0]?.recentActivity.length > 0, true);
  assert.match(passport.profileMetadata.cache.cachedAt, /\d{4}-\d{2}-\d{2}T/);
  assert.equal(passport.profileMetadata.governanceVotes > 0, true);
  assert.equal(passport.reputationSignals.every((signal) => signal.provenance.sourceId.length > 0), true);
  assert.equal(passport.timeline.every((event) => event.provenance.sourceId.length > 0), true);
});

test('buildPassport exposes normalized GitTensor contribution fields', async () => {
  const passport = await buildPassport(sampleWalletAddress);

  assert.equal(passport.gitTensor.totalContributions, 128);
  assert.equal(passport.gitTensor.mergedPullRequests, 23);
  assert.equal(passport.gitTensor.contributionFreshness, 'fresh');
  assert.equal(passport.gitTensor.repositories.length, 3);
  assert.equal(passport.gitTensor.recentActivity[0]?.type, 'pull_request');
});
