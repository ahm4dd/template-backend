import { z } from 'zod';
import { logger } from '@template/shared';

const ConfigSchema = z.object({
    NODE_ENV: z.string(),
    AUTH_DATABASE_URL: z.string(),
    PORT: z.string(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsedConfig = ConfigSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    AUTH_DATABASE_URL: process.env.AUTH_DATABASE_URL,
    PORT: process.env.PORT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

if (!parsedConfig.success) {
    const flattenedError = z.flattenError(parsedConfig.error);
    logger.error({ error: flattenedError }, 'Invalid environment configuration');
    process.exit(1);
}

export const config = parsedConfig.data;
