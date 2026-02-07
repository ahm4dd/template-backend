import { createRequire } from 'node:module';
import pino from 'pino';
import type { Logger, LoggerOptions, TransportSingleOptions } from 'pino';
import { getEnvOptional, isProd } from './config.ts';

export type LoggerConfig = {
  name?: string;
  level?: string;
  pretty?: boolean;
};

const require = createRequire(import.meta.url);
const defaultLevel = isProd ? 'info' : 'debug';

function resolvePrettyTransport(): TransportSingleOptions | undefined {
  try {
    require.resolve('pino-pretty');
  } catch {
    return undefined;
  }

  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

function buildOptions(config: LoggerConfig = {}): LoggerOptions {
  const pretty = config.pretty ?? !isProd;
  const level = config.level ?? getEnvOptional('LOG_LEVEL') ?? defaultLevel;
  const options: LoggerOptions = {
    level,
    name: config.name,
  };

  if (pretty) {
    const transport = resolvePrettyTransport();
    if (transport) {
      options.transport = transport;
    }
  }

  return options;
}

export function createLogger(config: LoggerConfig = {}): Logger {
  return pino(buildOptions(config));
}

export const logger = createLogger();
