export type AchievementCategory =
  | 'validator'
  | 'miner'
  | 'governance'
  | 'community'
  | 'subnet';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  unlockedAt: string;
};
