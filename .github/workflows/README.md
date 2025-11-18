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
    branches: [ dev ]
  pull_request:
    branches: [ dev ]
