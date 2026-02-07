import type { AuthClaims } from '@template/shared';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      auth?: AuthClaims;
    }
  }
}

export {};
