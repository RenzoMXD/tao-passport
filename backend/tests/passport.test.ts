import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPassport } from '../src/services/passport/passportService.js';

test('buildPassport exposes normalized GitTensor contribution fields', async () => {
  const passport = await buildPassport('5FAbc123TAOPassportDemoWalletAddress999999999999');

  assert.equal(passport.gitTensor.totalContributions, 128);
  assert.equal(passport.gitTensor.mergedPullRequests, 23);
  assert.equal(passport.gitTensor.contributionFreshness, 'fresh');
  assert.equal(passport.gitTensor.repositories.length, 3);
  assert.equal(passport.gitTensor.recentActivity[0]?.type, 'pull_request');
});
