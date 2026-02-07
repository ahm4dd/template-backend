# Sandbox Frontend

Disposable static frontend used to validate auth + protected API flow locally.

## Run

```bash
pnpm --filter @template/sandbox-frontend dev
```

Open: `http://localhost:4001`

## What it tests

- Email sign-up/sign-in through auth service
- Google OAuth redirect start
- Session check
- API JWT minting (`/api/auth/token`)
- Protected API request with Bearer token

Delete this service folder when no longer needed.
