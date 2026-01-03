# IMPORTANT: Vercel Root Directory Configuration

## The Problem
Vercel can't find the `frontend` directory when building because it's running from the monorepo root.

## The Solution
Configure Vercel to use `frontend` as the root directory.

## Steps to Fix:

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Click on your project

2. **Open Settings**
   - Click **Settings** in the top navigation
   - Click **General** in the left sidebar

3. **Set Root Directory**
   - Scroll down to **Root Directory**
   - Click **Edit**
   - Enter: `frontend`
   - Click **Save**

4. **Update vercel.json** (Already done - see below)

5. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on latest deployment
   - Click **Redeploy**

## What This Does:
- Vercel will treat `frontend/` as the project root
- Build commands run from `frontend/` directory
- No need to `cd frontend` in build commands
- API functions still work from root `api/` directory

## Updated vercel.json:
The vercel.json has been updated to work with `frontend` as root directory:
- `buildCommand`: `npm install && npm run build` (runs in frontend/)
- `outputDirectory`: `dist` (relative to frontend/)
- API function path: `../api/index.ts` (goes up to root for API)

## After Setting Root Directory:
The deployment should work immediately. The build will:
1. Run from `frontend/` directory
2. Install frontend dependencies
3. Build the frontend
4. Deploy from `frontend/dist/`

