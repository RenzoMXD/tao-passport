import type { Achievement } from '@tao-passport/shared-types';

export function getDemoAchievements(): Achievement[] {
  return [
    {
      id: 'validator-2-years',
      name: 'Validator 2 Years',
      description: 'Maintained validator participation across multiple market cycles.',
      category: 'validator',
      icon: '🏆',
      unlockedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'governance-voter',
      name: 'Governance Participant',
      description: 'Participated in protocol governance decisions.',
      category: 'governance',
      icon: '🗳️',
      unlockedAt: '2025-11-03T00:00:00.000Z',
    },
    {
      id: 'subnet-explorer',
      name: 'Subnet Explorer',
      description: 'Participated in several Bittensor subnet economies.',
      category: 'subnet',
      icon: '🌐',
      unlockedAt: '2026-01-09T00:00:00.000Z',
    },
    {
      id: 'community-signal',
      name: 'Community Signal',
      description: 'Earned durable ecosystem trust through long-term public participation.',
      category: 'community',
      icon: '🤝',
      unlockedAt: '2025-10-04T00:00:00.000Z',
    },
  ];
}
