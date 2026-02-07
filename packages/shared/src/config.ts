export type NodeEnv = 'development' | 'production' | 'test';

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export const nodeEnv = (process.env.NODE_ENV ?? 'development') as NodeEnv;
export const isProd = nodeEnv === 'production';
export const isDev = nodeEnv === 'development';
export const isTest = nodeEnv === 'test';

export function getEnvOptional(key: string, fallback?: string): string | undefined {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export function getEnvRequired(key: string, hint?: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    const suffix = hint ? ` (${hint})` : '';
    throw new ConfigError(`Missing required environment variable: ${key}${suffix}`);
  }

  return value;
}
