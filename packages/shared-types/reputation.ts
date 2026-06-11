export type ProvenanceSourceCategory = 'chain' | 'gittensor' | 'community' | 'derived';

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

export type LeaderboardEntry = {
  rank: number;
  walletAddress: string;
  label: string;
  trustScore: number;
};
