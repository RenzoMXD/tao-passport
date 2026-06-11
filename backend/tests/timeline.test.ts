import assert from 'node:assert/strict';
import test from 'node:test';
import type { TimelineEvent } from '@tao-passport/shared-types';
import { buildTimeline, getDemoTimeline, normalizeTimelineEvents } from '../src/services/timeline/timelineService.js';

test('normalizes timestamps and sorts merged timeline events deterministically', () => {
  const events: TimelineEvent[] = [
    {
      id: 'community-1',
      title: 'Community milestone',
      description: 'Community event',
      occurredAt: '2026-01-05T00:00:00.000Z',
      source: 'community',
      provenance: {
        sourceCategory: 'community',
        sourceId: 'community:event:1',
        observedAt: '2026-01-05T00:00:00.000Z',
        scoringModelVersion: 'tao-passport-reputation/v1',
        confidence: 'medium',
      },
    },
    {
      id: 'chain-1',
      title: 'Chain milestone',
      description: 'Chain event',
      occurredAt: '2025-01-03',
      source: 'chain',
      provenance: {
        sourceCategory: 'chain',
        sourceId: 'chain:event:1',
        observedAt: '2025-01-03',
        scoringModelVersion: 'tao-passport-reputation/v1',
        confidence: 'high',
      },
    },
    {
      id: 'community-2',
      title: 'Community milestone two',
      description: 'Community event',
      occurredAt: '2026-01-05',
<<<<<<< HEAD
      source: 'gittensor',
      provenance: {
        sourceCategory: 'gittensor',
        sourceId: 'gittensor:event:1',
        observedAt: '2026-01-05',
        scoringModelVersion: 'tao-passport-reputation/v1',
        confidence: 'high',
      },
=======
      source: 'community',
>>>>>>> 7358433 (fix: external contribution for all users)
    },
    {
      id: 'chain-2',
      title: 'Another chain milestone',
      description: 'Chain event',
      occurredAt: '2026-01-05T00:00:00.000Z',
      source: 'chain',
      provenance: {
        sourceCategory: 'chain',
        sourceId: 'chain:event:2',
        observedAt: '2026-01-05T00:00:00.000Z',
        scoringModelVersion: 'tao-passport-reputation/v1',
        confidence: 'high',
      },
    },
  ];

  const normalized = normalizeTimelineEvents(events);

  assert.deepEqual(
    normalized.map((event) => [event.id, event.occurredAt]),
    [
      ['chain-1', '2025-01-03T00:00:00.000Z'],
      ['chain-2', '2026-01-05T00:00:00.000Z'],
      ['community-1', '2026-01-05T00:00:00.000Z'],
      ['community-2', '2026-01-05T00:00:00.000Z'],
    ],
  );
});

test('buildTimeline flattens service outputs before sorting', () => {
  const timeline = buildTimeline(
    [
      {
        id: 'later',
        title: 'Later',
        description: 'Later event',
        occurredAt: '2025-10-01T00:00:00.000Z',
<<<<<<< HEAD
        source: 'gittensor',
        provenance: {
          sourceCategory: 'gittensor',
          sourceId: 'gittensor:event:later',
          observedAt: '2025-10-01T00:00:00.000Z',
          scoringModelVersion: 'tao-passport-reputation/v1',
          confidence: 'high',
        },
=======
        source: 'community',
>>>>>>> 7358433 (fix: external contribution for all users)
      },
    ],
    [
      {
        id: 'earlier',
        title: 'Earlier',
        description: 'Earlier event',
        occurredAt: '2024-10-01T00:00:00.000Z',
        source: 'chain',
        provenance: {
          sourceCategory: 'chain',
          sourceId: 'chain:event:earlier',
          observedAt: '2024-10-01T00:00:00.000Z',
          scoringModelVersion: 'tao-passport-reputation/v1',
          confidence: 'high',
        },
      },
    ],
  );

  assert.deepEqual(
    timeline.map((event) => event.id),
    ['earlier', 'later'],
  );
});

test('getDemoTimeline returns ordered server-side timeline data', () => {
  assert.deepEqual(
    getDemoTimeline().map((event) => event.id),
    ['first-seen', 'validator-active', 'community-reputation'],
  );
});

test('getDemoTimeline includes provenance metadata', () => {
  const timeline = getDemoTimeline();

  assert.equal(timeline.every((event) => event.provenance.scoringModelVersion === 'tao-passport-reputation/v1'), true);
  assert.equal(timeline.every((event) => event.provenance.sourceId.length > 0), true);
});
