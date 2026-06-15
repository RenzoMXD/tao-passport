export type ProvenanceSourceCategory = 'chain' | 'community' | 'derived';

export type ProvenanceConfidence = 'high' | 'medium' | 'low';

export type ProvenanceEvidenceLink = {
  label: string;
  url: string;
};

export type ProvenanceMetadata = {
  sourceCategory: ProvenanceSourceCategory;
  sourceId: string;
  reference?: string;
  sourceUrl?: string;
  observedAt: string;
  scoringModelVersion: string;
  confidence: ProvenanceConfidence;
  evidenceLinks?: ProvenanceEvidenceLink[];
};

export type ReputationSignal = {
  name: string;
  score: number;
  weight: number;
  source: ProvenanceSourceCategory;
  provenance: ProvenanceMetadata;
};

export type LeaderboardSignalCategory =
  | 'all'
  | 'validator'
  | 'miner'
  | 'governance'
  | 'subnet'
  | 'community'
  | 'gittensor';

export type LeaderboardSort = 'trustScore:desc' | 'trustScore:asc';

export type LeaderboardEntry = {
  rank: number;
  walletAddress: string;
  label: string;
  trustScore: number;
  matchedCategories: Exclude<LeaderboardSignalCategory, 'all'>[];
};

export type LeaderboardResponse = {
  items: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  previousCursor: string | null;
  sort: LeaderboardSort;
  category: LeaderboardSignalCategory;
};
