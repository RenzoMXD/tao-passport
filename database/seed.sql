INSERT INTO wallets (wallet_address, label, first_seen_at)
VALUES ('5FAbc123TAOPassportDemoWalletAddress999999999999', 'Demo validator and subnet participant', '2023-02-01T00:00:00Z')
ON CONFLICT (wallet_address) DO NOTHING;

INSERT INTO passport_scores (wallet_address, level, trust_score, validator_score, miner_score, community_score, years_active)
VALUES ('5FAbc123TAOPassportDemoWalletAddress999999999999', 18, 95, 92, 76, 87, 2.4)
ON CONFLICT (wallet_address) DO NOTHING;
