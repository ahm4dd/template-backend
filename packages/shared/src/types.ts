export type AuthClaims = {
  sub: string;
  roles?: string[];
  tenantId?: string;
  email?: string;
};
