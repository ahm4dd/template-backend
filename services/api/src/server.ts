import { config } from './config/env.ts';
import { createApp } from './http/app.ts';
import { logger } from '@template/shared';

const app = createApp();

const server = app.listen(config.PORT, () => {
    logger.info(`Program running on ${config.PORT}`);
});

async function shutdown(signal: string) {
    logger.info(`Shutting down with the signal: ${signal}`);
    await new Promise((resolve) => server.close(resolve));

    process.exit(0);
}

process.on('SIGINT', () => {
    shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    shutdown('SIGTERM');
});
