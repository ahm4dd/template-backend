import { logger } from '@template/shared';
import { config } from './config/env.ts';
import { createApp } from './http/app.ts';

const app = createApp();

const server = app.listen(config.PORT, () => {
  logger.info(`Auth service listening on ${config.PORT}`);
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
