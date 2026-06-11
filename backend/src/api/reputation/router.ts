import { Router } from 'express';
import { buildReputationSignals, getDemoLeaderboard } from '../../services/reputation/reputationService.js';
import { getWalletSnapshot } from '../../blockchain/bittensor/client.js';

export const reputationRouter = Router();

reputationRouter.get('/signals', (_request, response) => {
  response.json(
    buildReputationSignals({
      validatorScore: 92,
      minerScore: 76,
      governanceVotes: 14,
      subnetsParticipated: 3,
      communityScore: 87,
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
