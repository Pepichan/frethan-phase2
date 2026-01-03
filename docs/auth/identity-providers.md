# Identity Providers (OAuth)

This document describes the OAuth login flows for **Google** and **Facebook** (plus a **WeChat demo placeholder**).

## 1) Endpoints

Backend routes (Express):
- `GET /api/auth/google` → redirects to Google consent
- `GET /api/auth/google/callback` → exchanges code, links user, issues JWT, redirects to frontend
- `GET /api/auth/facebook` → redirects to Facebook consent
- `GET /api/auth/facebook/callback` → exchanges code, links user, issues JWT, redirects to frontend
- `GET /api/auth/me` → returns current user (requires `Authorization: Bearer <jwt>`)

Frontend route (React):
- `/oauth/callback` → reads `?token=...` or `?error=...` and routes accordingly

WeChat:
- Demo endpoints:
   - `GET /api/auth/wechat` → **redirects to demo** when `WECHAT_DEMO_MODE=true`
   - `GET /api/auth/wechat/demo/login` → returns a QR-style mock page and auto-redirects
   - `GET /api/auth/wechat/demo/callback?state=...` → validates state, issues JWT, redirects to frontend
- Live OAuth endpoints (reserved):
   - `GET /api/auth/wechat` / `GET /api/auth/wechat/callback` exist, but **return 501** when demo mode is off.

## 2) Common Concepts

### Redirect URIs
- A "redirect URI" (a.k.a callback URL) is where the provider sends the user back after login.
- In local dev, backend is assumed to run at `http://localhost:5000`.

Recommended redirect URI patterns:
- Google: `http://localhost:5000/api/auth/google/callback`
- Facebook: `http://localhost:5000/api/auth/facebook/callback`
- WeChat (demo): `http://localhost:5000/api/auth/wechat/callback`

### Token / Session Strategy
- Backend callback issues an **app JWT** (`JWT_SECRET`) and redirects to the frontend callback route.
- Frontend stores token in `localStorage` and redirects to `/dashboard`.

### Error Handling
Provider callbacks may fail with:
- `error` query param from provider (user denied, invalid scope)
- missing/invalid `code`
- state mismatch (CSRF protection)

Current behavior:
- Backend callback redirects to `FRONTEND_OAUTH_REDIRECT` with either:
   - `?token=...` on success
   - `?error=...` on failure

## 3) Google OAuth

### Flow
1. Frontend starts login by navigating to: `GET /api/auth/google`
2. Backend redirects user to Google consent screen
3. Google calls back to: `GET /api/auth/google/callback?code=...&state=...`
4. Backend exchanges code for tokens and validates `id_token`
5. Backend links/creates user via `UserSocialAccount` and redirects to the frontend with `?token=...`

### Suggested scopes
- `openid`
- `email`
- `profile`

## 4) Facebook OAuth

### Flow
1. Frontend starts login by navigating to: `GET /api/auth/facebook`
2. Facebook calls back to: `GET /api/auth/facebook/callback?code=...&state=...`
3. Backend exchanges code for an access token, fetches `/me` (id/email), links user, redirects with `?token=...`

### Suggested scopes
- `email`
- `public_profile`

## 5) WeChat (demo)

WeChat OAuth setup differs (QR login is common). For W6 we implement a **simulated demo flow**:

### Feature flag
- `WECHAT_DEMO_MODE=true` → `GET /api/auth/wechat` starts the demo flow.
- `WECHAT_DEMO_MODE=false` → `/api/auth/wechat` returns `501 not_implemented` (live integration reserved).

### Demo flow
1. Frontend navigates to: `GET /api/auth/wechat`
2. Backend redirects to: `GET /api/auth/wechat/demo/login`
3. Demo login shows a QR-style page and simulates scanning + authorization
4. Browser is redirected to: `GET /api/auth/wechat/demo/callback?state=...`
5. Backend validates `state`, creates/links a **demo user**, issues JWT, and redirects to frontend:
   - `FRONTEND_OAUTH_REDIRECT?token=...`

Limitations:
- No real WeChat API calls
- No real user identity; a deterministic demo user is created/linked

## 6) Environment variables

Required:
- `JWT_SECRET`

Recommended:
- `FRONTEND_OAUTH_REDIRECT=http://localhost:5173/oauth/callback`

Google:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback`
- `GOOGLE_SCOPES=openid,email,profile`

Facebook:
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `FACEBOOK_REDIRECT_URI=http://localhost:5000/api/auth/facebook/callback`
- `FACEBOOK_SCOPES=email,public_profile`

WeChat demo:
- `WECHAT_DEMO_MODE=true`

## 7) Local Dev Quick Test

1. Start backend: `cd backend; npm run dev`
2. Start frontend: `cd frontend; npm run dev`
3. Open `http://localhost:5173/login`
4. Click "Continue with Google" or "Continue with Facebook"

Expected:
- Browser navigates through provider login, then returns to `/oauth/callback`
- Frontend stores `token` and redirects to `/dashboard`
