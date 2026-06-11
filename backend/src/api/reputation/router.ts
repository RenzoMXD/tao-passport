import { Router } from 'express';
import {
  buildReputationSignals,
  getDemoLeaderboard,
  getReputationSignalCatalog,
} from '../../services/reputation/reputationService.js';
import { getWalletSnapshot } from '../../blockchain/bittensor/client.js';

export const reputationRouter = Router();

reputationRouter.get('/signals', (_request, response) => {
  const sampleInput = {
    validatorScore: 92,
    minerScore: 76,
    governanceVotes: 14,
    subnetsParticipated: 3,
    communityScore: 87,
  };

  response.json({
    sampleInput,
    sampleSignals: buildReputationSignals(sampleInput),
    documentation: getReputationSignalCatalog(),
  });
});

reputationRouter.get('/leaderboard', async (_request, response, next) => {
  try {
    void getWalletSnapshot;
    response.json(await getDemoLeaderboard());
  } catch (error) {
    next(error);
  }
});
