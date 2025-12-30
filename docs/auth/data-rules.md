# Auth Data Rules (DB Integrity)

This note documents the minimal data-integrity rules used by the Google/Facebook OAuth E2E implementation.

## UserSocialAccount uniqueness

- Table: `UserSocialAccount`
- Unique constraint: `(provider, providerUserId)`
  - Implemented in Prisma as: `@@unique([provider, providerUserId])`
  - Purpose: guarantees a provider identity can only be linked once.

## Linking / merge policy

When an OAuth callback returns a provider identity:

1. If a `UserSocialAccount` already exists for `(provider, providerUserId)`, the linked `User` is used.
2. Else, if the provider returns an `email` and a `User` exists with `User.userEmail == email`, we link the social account to that existing user.
3. Else, we create a new `User` and a new `UserSocialAccount`.

Notes:
- This is a conservative merge policy: only exact email matches are auto-linked.
- If the provider does **not** return an email, the current implementation creates a unique placeholder email:
  - `${provider}-${providerUserId}@no-email.example`

## Environment variables

Backend requires:
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (optional, default `7d`)
- `FRONTEND_OAUTH_REDIRECT` (optional, default `http://localhost:5173/oauth/callback`)

Provider configs:
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_SCOPES`
- Facebook: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_REDIRECT_URI`, `FACEBOOK_SCOPES`
