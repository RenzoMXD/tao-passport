import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { achievementsRouter } from './api/achievements/router.js';
import { healthRouter } from './api/health/router.js';
import { passportRouter } from './api/passport/router.js';
import { reputationRouter } from './api/reputation/router.js';
import { pool } from './database/client.js';

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
  response.status(500).json({ error: error.message });
});

const server = app.listen(port, () => {
  console.log(`TAO Passport API listening on http://localhost:${port}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database pool...');
  await pool.end();
  server.close(() => {
    process.exit(0);
  });
});