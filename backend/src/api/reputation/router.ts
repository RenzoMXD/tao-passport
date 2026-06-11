import { Router } from 'express';
import { buildReputationSignals, getDemoLeaderboard } from '../../services/reputation/reputationService.js';
import { getWalletSnapshot } from '../../blockchain/bittensor/client.js';

export const reputationRouter = Router();

reputationRouter.get('/signals', (_request, response) => {
  response.json(
    buildReputationSignals({
      walletAddress: '5FAbc123TAOPassportDemoWalletAddress999999999999',
      validatorScore: 92,
      minerScore: 76,
      governanceVotes: 14,
      subnetParticipation: [
        { subnetId: 1, role: 'validator', contributionWeight: 0.91, lastSeenAt: '2026-06-08T14:15:00.000Z' },
        { subnetId: 8, role: 'builder', contributionWeight: 0.84, lastSeenAt: '2026-06-07T09:30:00.000Z' },
        { subnetId: 19, role: 'miner', contributionWeight: 0.73, lastSeenAt: '2026-06-08T22:05:00.000Z' },
      ],
      communityScore: 87,
      observedAt: '2026-06-08T22:05:00.000Z',
    }),
  );
});

reputationRouter.get('/leaderboard', async (_request, response, next) => {
  try {
    void getWalletSnapshot;
    response.json(await getDemoLeaderboard());
  } catch (error) {
    next(error);
  }
});
