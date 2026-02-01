import express from 'express';
import type { Express } from 'express';

type AppDependencies = {
    controllers: {};
    services: {};
    repos: {};
};

export function createApp(dependencies: AppDependencies = {}): Express {
    const app = express();

    return app;
}
