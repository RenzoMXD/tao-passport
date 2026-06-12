import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateTrustScore, getPaginatedLeaderboard } from '../src/services/reputation/reputationService.js';

test('calculates weighted trust score', () => {
  const score = calculateTrustScore([
    {
      name: 'A',
      score: 100,
      weight: 0.75,
      source: 'chain',
      provenance: {
        sourceCategory: 'chain',
        sourceId: 'wallet:test:a',
        observedAt: '2026-06-08T00:00:00.000Z',
        scoringModelVersion: 'tao-passport-reputation/v1',
        confidence: 'high',
      },
    },
    {
      name: 'B',
      score: 80,
      weight: 0.25,
      source: 'community',
      provenance: {
        sourceCategory: 'community',
        sourceId: 'wallet:test:b',
        observedAt: '2026-06-08T00:00:00.000Z',
        scoringModelVersion: 'tao-passport-reputation/v1',
        confidence: 'medium',
      },
    },
  ]);

  assert.equal(score, 95);
});

test('buildReputationSignals adds provenance metadata for auditability', async () => {
  const { buildReputationSignals } = await import('../src/services/reputation/reputationService.js');
  const signals = buildReputationSignals({
    walletAddress: '5FAbc123TAOPassportDemoWalletAddress999999999999',
    validatorScore: 92,
    minerScore: 76,
    governanceVotes: 14,
    subnetParticipation: [
      { subnetId: 1, role: 'validator', contributionWeight: 0.91, lastSeenAt: '2026-06-08T14:15:00.000Z' },
      { subnetId: 19, role: 'miner', contributionWeight: 0.73, lastSeenAt: '2026-06-08T22:05:00.000Z' },
    ],
    communityScore: 87,
    observedAt: '2026-06-08T22:05:00.000Z',
  });

  assert.equal(signals.every((signal) => signal.provenance.scoringModelVersion === 'tao-passport-reputation/v1'), true);
  assert.equal(signals.every((signal) => signal.provenance.sourceId.length > 0), true);
});

test('getPaginatedLeaderboard paginates deterministically by page', async () => {
  const pageOne = await getPaginatedLeaderboard({ limit: 2, page: 1, sort: 'trustScore:desc' });
  const pageTwo = await getPaginatedLeaderboard({ limit: 2, page: 2, sort: 'trustScore:desc' });

  assert.equal(pageOne.items.length, 2);
  assert.equal(pageOne.hasNextPage, true);
  assert.equal(pageTwo.items.length, 1);
  assert.equal(pageTwo.hasPreviousPage, true);
  assert.deepEqual(
    [...pageOne.items, ...pageTwo.items].map((entry) => entry.walletAddress),
    [
      '5FAbc123TAOPassportDemoWalletAddress999999999999',
      '5Fxyz789LongTermSubnetMinerWalletAddress999999999',
      '5Gdao456GovernanceParticipantWalletAddress99999999',
    ],
  );
});

test('getPaginatedLeaderboard filters by category and supports empty GitTensor state', async () => {
  const minerResults = await getPaginatedLeaderboard({ category: 'miner', limit: 10, page: 1 });
  const gitTensorResults = await getPaginatedLeaderboard({ category: 'gittensor', limit: 10, page: 1 });

  assert.equal(minerResults.items.every((entry) => entry.matchedCategories.includes('miner')), true);
  assert.equal(gitTensorResults.total, 0);
  assert.equal(gitTensorResults.items.length, 0);
});
