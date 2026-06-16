import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { achievementsRouter } from './api/achievements/router.js';
import { docsRouter } from './api/docs/router.js';
import { healthRouter } from './api/health/router.js';
import { passportRouter } from './api/passport/router.js';
import { reputationRouter } from './api/reputation/router.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

// Swagger UI ships inline styles/scripts that the default helmet CSP blocks, so
// the docs surface gets a relaxed CSP. It is registered before the global helmet
// so the rest of the API keeps its strict security headers.
app.use('/api-docs', helmet({ contentSecurityPolicy: false }), docsRouter);

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

app.listen(port, () => {
  console.log(`TAO Passport API listening on http://localhost:${port}`);
});
