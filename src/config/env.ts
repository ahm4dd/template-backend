import { z } from 'zod';

const ConfigSchema = z.object({
    NODE_ENV: z.string(),
    PORT: z.string(),
});

const parsedConfig = ConfigSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
});

if (!parsedConfig.success) {
    const flattenedError = z.flattenError(parsedConfig.error);
    console.error(flattenedError);
    process.exit(1);
}

export const config = parsedConfig.data;
