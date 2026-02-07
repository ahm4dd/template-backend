import express, { Router } from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../auth.ts';
import { config } from '../config/env.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { requestId } from './middleware/requestId.ts';
import { createHealthRouter } from './routes/health.route.ts';

export function createApp(): Express {
  const app = express();
  const corsOrigins = config.CORS_ORIGINS
    ? config.CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
  const corsOptions: cors.CorsOptions = {
    origin: corsOrigins.length > 0 ? corsOrigins : false,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(requestId);
  app.use('/api/auth', cors(corsOptions));
  app.options('/api/auth/*splat', cors(corsOptions));
  app.all('/api/auth/*splat', toNodeHandler(auth));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(createRoutes());
  app.use(errorHandler);

  return app;
}

function createRoutes(): Router {
  const router = Router();

  router.use('/health', createHealthRouter());

  return router;
}
