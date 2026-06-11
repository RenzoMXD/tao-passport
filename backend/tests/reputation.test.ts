import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateTrustScore, getReputationSignalCatalog } from '../src/services/reputation/reputationService.js';

test('calculates weighted trust score', () => {
  const score = calculateTrustScore([
    { name: 'A', score: 100, weight: 0.75, source: 'chain' },
    { name: 'B', score: 80, weight: 0.25, source: 'community' },
  ]);

  assert.equal(score, 95);
});

test('documents governance and community signal sources', () => {
  const catalog = getReputationSignalCatalog();
  const governance = catalog.signals.find((signal) => signal.signal === 'Governance activity');
  const community = catalog.signals.find((signal) => signal.signal === 'Community signal');

  assert.equal(Array.isArray(catalog.staleDataPolicy), true);
  assert.equal(catalog.staleDataPolicy.length > 0, true);
  assert.deepEqual(governance?.plannedInputs.includes('governance vote count'), true);
  assert.deepEqual(community?.plannedInputs.includes('verified ecosystem help'), true);
  assert.equal(governance?.limitations.includes('Current implementation only models vote count.'), true);
});
