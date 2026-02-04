import { z } from 'zod';
import { logger } from '@template/shared';

const ConfigSchema = z.object({
    NODE_ENV: z.string(),
    DATABASE_URL: z.string(),
    PORT: z.string(),
});

const parsedConfig = ConfigSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
});

if (!parsedConfig.success) {
    const flattenedError = z.flattenError(parsedConfig.error);
    logger.error({ error: flattenedError }, 'Invalid environment configuration');
    process.exit(1);
}

export const config = parsedConfig.data;
