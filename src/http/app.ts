import express from 'express';
import type { Express } from 'express';
import { requestId } from './middleware/requestId.ts';

type AppDependencies = {
    controllers: {};
    services: {};
    repos: {};
};

export function createApp(deps: AppDependencies = {}): Express {
    const app = express();

    app.use(requestId);
    app.use(express.json());
    app.use;
    return app;
}
