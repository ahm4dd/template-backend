import { Pool } from 'pg';
import { config } from '../../config/env.ts';

export const pool = new Pool({
  connectionString: config.AUTH_DATABASE_URL,
});
