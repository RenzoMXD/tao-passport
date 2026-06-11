import type { ProvenanceMetadata, TimelineEvent } from '@tao-passport/shared-types';

const timelineScoringModelVersion = 'tao-passport-reputation/v1';

const timelineSourcePriority: Record<TimelineEvent['source'], number> = {
  chain: 0,
  community: 1,
};

function normalizeTimelineEvent(event: TimelineEvent): TimelineEvent {
  const occurredAt = new Date(event.occurredAt);

  if (Number.isNaN(occurredAt.getTime())) {
    throw new Error(`Invalid timeline timestamp for event "${event.id}"`);
  }

  return {
    ...event,
    occurredAt: occurredAt.toISOString(),
    provenance: {
      ...event.provenance,
      observedAt: new Date(event.provenance.observedAt).toISOString(),
    },
  };
}

function buildTimelineProvenance(
  sourceCategory: TimelineEvent['source'],
  sourceId: string,
  observedAt: string,
  reference: string,
  evidenceLinks?: ProvenanceMetadata['evidenceLinks'],
): ProvenanceMetadata {
  return {
    sourceCategory,
    sourceId,
    reference,
    observedAt,
    scoringModelVersion: timelineScoringModelVersion,
    confidence: sourceCategory === 'community' ? 'medium' : 'high',
    evidenceLinks,
  };
}

function compareTimelineEvents(left: TimelineEvent, right: TimelineEvent): number {
  const timestampDifference = Date.parse(left.occurredAt) - Date.parse(right.occurredAt);

  if (timestampDifference !== 0) {
    return timestampDifference;
  }

  const sourceDifference = timelineSourcePriority[left.source] - timelineSourcePriority[right.source];

  if (sourceDifference !== 0) {
    return sourceDifference;
  }

  const titleDifference = left.title.localeCompare(right.title);

  if (titleDifference !== 0) {
    return titleDifference;
  }

  return left.id.localeCompare(right.id);
}

export function normalizeTimelineEvents(events: TimelineEvent[]): TimelineEvent[] {
  return events.map(normalizeTimelineEvent).sort(compareTimelineEvents);
}

export function buildTimeline(...eventGroups: TimelineEvent[][]): TimelineEvent[] {
  return normalizeTimelineEvents(eventGroups.flat());
}

export function getDemoTimeline(): TimelineEvent[] {
  return buildTimeline(
    [
      {
        id: 'validator-active',
        title: 'Validator activity detected',
        description: 'Validator reliability contributed to the wallet reputation model.',
        occurredAt: '2024-06-10T00:00:00.000Z',
        source: 'chain',
        provenance: buildTimelineProvenance(
          'chain',
          'wallet:sample:validator-activity',
          '2026-06-08T14:15:00.000Z',
          'validator-activity-fixture',
          [{ label: 'Methodology', url: 'https://github.com/RenzoMXD/tao-passport/blob/main/docs/reputation-system.md' }],
        ),
      },
      {
        id: 'first-seen',
        title: 'Wallet first observed',
        description: 'Wallet began accumulating public Bittensor ecosystem history.',
        occurredAt: '2023-02-01',
        source: 'chain',
        provenance: buildTimelineProvenance(
          'chain',
          'wallet:sample:first-seen',
          '2023-02-01T00:00:00.000Z',
          'wallet-first-seen-fixture',
        ),
      },
    ],
    [
      {
        id: 'community-reputation',
        title: 'Community reputation milestone',
        description: 'Public ecosystem participation strengthened the wallet trust profile.',
        occurredAt: '2025-09-14T00:00:00.000Z',
        source: 'community',
        provenance: buildTimelineProvenance(
          'community',
          'wallet:sample:community-reputation',
          '2026-06-06T18:30:00.000Z',
          'community-reputation-fixture',
          [{ label: 'Methodology', url: 'https://github.com/RenzoMXD/tao-passport/blob/main/docs/reputation-system.md' }],
        ),
      },
    ],
  );
}
