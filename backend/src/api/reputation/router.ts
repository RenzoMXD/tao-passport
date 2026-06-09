import { Router } from 'express';
import { assertBittensorDataAvailable } from '../../blockchain/bittensor/client.js';
import { buildReputationSignals, getDemoLeaderboard } from '../../services/reputation/reputationService.js';

export const reputationRouter = Router();

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
  } catch (error) {
    next(error);
  }
});
