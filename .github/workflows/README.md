# 🚀 CI/CD Setup Guide (GitHub Actions)

This document explains how our project uses **CI/CD (Continuous Integration / Continuous Delivery)** with GitHub Actions for both **Frontend** and **Backend**.

---

## 📌 1. What is CI/CD?

### **CI (Continuous Integration)**
Automatically checks the code every time someone pushes to a branch or creates a Pull Request.

CI helps us:
- Prevent broken code from reaching `dev` / `main`
- Ensure frontend & backend always build correctly
- Run automated tests (later in Week 4+)
- Maintain code quality using linting

---

### **CD (Continuous Delivery/Deployment)**
Automatically prepares code for deployment.  
*(Deployment will be added in later weeks — Vercel for frontend, Render/Neon for backend.)*

Each file controls **automatic checks** for its part of the system.

- `frontend-ci.yml` → React + Vite build, lint, tests
- `backend-ci.yml` → Node.js + Express + Prisma build, lint, tests

---

## 🔄 3. When CI Runs

CI is triggered automatically on:

```yaml
on:
  push:
    branches: [ "dev", "main" ]
  pull_request:
    branches: [ "dev", "main" ]
```
🎯 Automatic Path Filtering
- Each workflow runs only if files in its area changed:
- `backend-ci.yml` → triggered by `backend/**`
- `frontend-ci.yml` → triggered by `frontend/**`

---

## 🟡 Backend CI Details (backend-ci.yml)

Working directory: `backend/`

### 🛠️ Steps

1. `npm ci`
2. `npx prisma generate` (generate Prisma client)
3. `npm run lint` (ESLint for TS)
4. `npm run build` (TypeScript compile → dist/)
5. `npm test` (Jest integration tests)
   
🔍 If any step fails, CI stops and the PR is marked as ❌ failed.

## 🟣 Frontend CI Details (frontend-ci.yml)

Working directory: `frontend/`

### 🛠️ Steps

1. npm ci
2. npm run lint (ESLint + React + TS)
3. npm run build (Vite production build)
4. npm test (Vitest + React Testing Library)
   
🧪 Test files are stored under:
```
src/__tests__/
src/test/
```
