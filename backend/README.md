# Backend

## Postman / Newman (RFQ + Quote E2E)

This repo includes a runnable Postman collection and scripts to seed environment variables for local E2E runs.

### 1) Start Postgres (Docker)

From `backend/`:

- `docker compose up -d`

### 2) Configure env

- Copy `.env.example` to `.env` and adjust as needed

### 3) Migrate + start API

- `npm install`
- `npm run prisma:generate`
- `npx prisma migrate deploy`
- `npm run dev`

### 4) Seed Postman env + run Newman

In another terminal:

- `npm run postman:seed`
- `npm run postman:newman`

Note:
- `postman:seed` generates `postman/frethan.local.generated.postman_environment.json` (ignored by git).
