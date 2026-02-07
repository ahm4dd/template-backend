import { z } from 'zod';
import { logger } from '@template/shared';

const ConfigSchema = z.object({
  NODE_ENV: z.string(),
  AUTH_DATABASE_URL: z.string(),
  PORT: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL: z.coerce.number().int().positive(),
  SESSION_UPDATE_AGE: z.coerce.number().int().positive().optional(),
  CORS_ORIGINS: z.string().optional(),
  TRUSTED_ORIGINS: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsedConfig = ConfigSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  AUTH_DATABASE_URL: process.env.AUTH_DATABASE_URL,
  PORT: process.env.PORT,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,
  SESSION_UPDATE_AGE: process.env.SESSION_UPDATE_AGE,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

if (!parsedConfig.success) {
  const flattenedError = z.flattenError(parsedConfig.error);
  logger.error({ error: flattenedError }, 'Invalid environment configuration');
  process.exit(1);
}

export const config = parsedConfig.data;
