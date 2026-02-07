import { config } from './src/config/env.ts';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: '../../infra/db/api/drizzle',
  schema: './src/infra/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
