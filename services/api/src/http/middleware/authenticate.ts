import type { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UnauthorizedError } from '@template/shared';
import { config } from '../../config/env.ts';
import type { AuthClaims } from '@template/shared';

const jwks = createRemoteJWKSet(new URL(config.AUTH_JWKS_URL));

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing bearer token'));
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    return next(new UnauthorizedError('Missing bearer token'));
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: config.AUTH_ISSUER,
      audience: config.AUTH_AUDIENCE,
    });
    req.auth = payload as AuthClaims;
    return next();
  } catch {
    return next(new UnauthorizedError('Invalid token'));
  }
}
