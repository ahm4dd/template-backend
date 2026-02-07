import { betterAuth } from 'better-auth';
import { bearer, jwt } from 'better-auth/plugins';
import { config } from './config/env.ts';
import { pool } from './infra/db/pool.ts';

const googleEnabled = Boolean(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET);
const trustedOrigins = config.TRUSTED_ORIGINS
  ? config.TRUSTED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];
let socialProviders:
  | {
      google: {
        clientId: string;
        clientSecret: string;
      };
    }
  | undefined;

if (googleEnabled) {
  socialProviders = {
    google: {
      clientId: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
    },
  };
}

export const auth = betterAuth({
  database: pool,
  secret: config.BETTER_AUTH_SECRET,
  baseURL: config.BETTER_AUTH_URL,
  ...(trustedOrigins.length > 0 ? { trustedOrigins } : {}),
  session: {
    // Session acts as the refresh token store.
    expiresIn: config.REFRESH_TOKEN_TTL,
    updateAge: config.SESSION_UPDATE_AGE ?? 86_400,
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt({
      jwt: {
        issuer: config.BETTER_AUTH_URL,
        audience: config.BETTER_AUTH_URL,
        expirationTime: config.ACCESS_TOKEN_TTL,
      },
    }),
    bearer(),
  ],
  ...(socialProviders ? { socialProviders } : {}),
});
