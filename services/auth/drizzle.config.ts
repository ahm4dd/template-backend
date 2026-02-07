import { defineConfig } from 'drizzle-kit';
import { config } from './src/config/env.ts';

export default defineConfig({
  out: '../../infra/db/auth/drizzle',
  schema: './src/infra/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.AUTH_DATABASE_URL,
  },
});
