import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateTrustScore } from '../src/services/reputation/reputationService.js';

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
