# Vercel Deployment Setup Guide

## Environment Variables Required

Add these environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
- Navigate to your project: https://vercel.com/dashboard
- Click on your project
- Go to **Settings** → **Environment Variables**

### 2. Add the following variables:

#### `MONGO_URI`
- **Value**: Your MongoDB connection string
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- **Required**: Yes
- **Environment**: Production, Preview, Development (all)

#### `JWT_SECRET`
- **Value**: A strong random secret key for JWT token signing
- **Example**: Generate one using: `openssl rand -base64 32`
- **Required**: Yes
- **Environment**: Production, Preview, Development (all)
- **Note**: Use a different secret for production!

#### `FRONTEND_ORIGIN`
- **Value**: Your Vercel deployment URL (for CORS)
- **Example**: `https://your-project.vercel.app`
- **Required**: No (defaults to `*` if not set)
- **Environment**: Production, Preview, Development (all)

#### `PORT`
- **Value**: Port number (usually not needed for Vercel serverless)
- **Example**: `5001`
- **Required**: No
- **Environment**: Production, Preview, Development (all)

## Steps to Add Environment Variables:

1. Go to your Vercel project dashboard
2. Click **Settings**
3. Click **Environment Variables** in the sidebar
4. Click **Add New**
5. Enter the variable name (e.g., `MONGO_URI`)
6. Enter the variable value
7. Select which environments to apply it to (Production, Preview, Development)
8. Click **Save**
9. Repeat for each variable
10. **Redeploy** your project for changes to take effect

## After Adding Variables:

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Testing:

After deployment, test your API:
- Health check: `https://your-project.vercel.app/api/health`
- Should return: `{"ok":true}`

## Troubleshooting:

- If you get MongoDB connection errors, check your `MONGO_URI` is correct
- If you get JWT errors, make sure `JWT_SECRET` is set
- If CORS errors occur, check `FRONTEND_ORIGIN` matches your frontend URL

