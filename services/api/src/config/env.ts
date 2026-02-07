import { z } from 'zod';
import { logger } from '@template/shared';

const ConfigSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.string(),
  AUTH_JWKS_URL: z.string(),
  AUTH_ISSUER: z.string(),
  AUTH_AUDIENCE: z.string(),
  CORS_ORIGINS: z.string().optional(),
});

const parsedConfig = ConfigSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  AUTH_JWKS_URL: process.env.AUTH_JWKS_URL,
  AUTH_ISSUER: process.env.AUTH_ISSUER,
  AUTH_AUDIENCE: process.env.AUTH_AUDIENCE,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
});

if (!parsedConfig.success) {
  const flattenedError = z.flattenError(parsedConfig.error);
  logger.error({ error: flattenedError }, 'Invalid environment configuration');
  process.exit(1);
}

export const config = parsedConfig.data;
