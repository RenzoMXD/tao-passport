import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { achievementsRouter } from './api/achievements/router.js';
import { healthRouter } from './api/health/router.js';
import { passportRouter } from './api/passport/router.js';
import { reputationRouter } from './api/reputation/router.js';
import { isBittensorDataUnavailableError } from './blockchain/bittensor/errors.js';
import { sendApiError } from './utils/http.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRouter);
app.use('/api/passport', passportRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/reputation', reputationRouter);

app.use((error: Error, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  void next;

  if (isBittensorDataUnavailableError(error)) {
    return sendApiError(response, 503, error.code, error.message, error.retryable, error.source);
  }

  return sendApiError(response, 500, 'INTERNAL_SERVER_ERROR', error.message, false, 'api');
});

app.listen(port, () => {
  console.log(`TAO Passport API listening on http://localhost:${port}`);
});
