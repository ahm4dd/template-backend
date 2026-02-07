import { Pool } from 'pg';
import { config } from '../../config/env.ts';

export const pool = new Pool({
  // Single pool for the entire process
  connectionString: config.DATABASE_URL,
});
