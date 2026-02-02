import { config } from './config/env.ts';
import { createApp } from './http/app.ts';

const app = createApp();

const server = app.listen(config.PORT, () => {
    console.log(`Program running on ${config.PORT}`);
});

async function shutdown(signal: string) {
    console.log(`Shutting down with the signal: ${signal}`);
    await new Promise((resolve) => server.close(resolve));

    process.exit(0);
}

process.on('SIGINT', () => {
    shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    shutdown('SIGTERM');
});
