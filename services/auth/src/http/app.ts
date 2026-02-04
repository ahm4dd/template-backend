import express, { Router } from 'express';
import type { Express } from 'express';
import { errorHandler } from './middleware/errorHandler.ts';
import { requestId } from './middleware/requestId.ts';
import { createHealthRouter } from './routes/health.route.ts';

export function createApp(): Express {
    const app = express();

    app.use(requestId);
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
