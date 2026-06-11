import { Router } from 'express';
import { assertBittensorDataAvailable } from '../../blockchain/bittensor/client.js';
import { buildReputationSignals, getDemoLeaderboard } from '../../services/reputation/reputationService.js';
import { getWalletSnapshot } from '../../blockchain/bittensor/client.js';

export const reputationRouter = Router();

<<<<<<< HEAD
reputationRouter.get('/signals', (_request, response, next) => {
  try {
    assertBittensorDataAvailable();
    response.json(buildReputationSignals());
  } catch (error) {
    next(error);
  }
});

reputationRouter.get('/leaderboard', (_request, response, next) => {
  try {
    assertBittensorDataAvailable();
    response.json(getDemoLeaderboard());
=======
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
>>>>>>> 3d30bfe7b19a81cc60c75aebff2b33d23861efe5
  } catch (error) {
    next(error);
  }
});
