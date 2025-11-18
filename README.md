# 🧱 Frethan Project – ICT302 Phase 2
A web platform for supplier verification, RFQ management, and procurement transparency.

## 🛠️ Technology Stack
- 🩵 Project Manager: GitHub + Notion + Google Drive
- 🟣 Frontend: React + Vite + Tailwind + TypeScript  
- 🟡 Backend: Node.js + Express + Prisma + PostgreSQL
- 🟢 Database: PostgreSQL + Prisma + pgAdmin
- ⚪ UI/UX: Figma + Canva
- 🔴 QA/Tester: Postman + Web browser
- Smart Contract: Solidity + Hardhat + ethers.js
- Hosting: Vercel (Frontend), Render (Backend), Neon (DB)

## 👥 Team Members
- 🩵 Project Manager: Rie HAGIWARA (12203845@students.koi.edu.au)
- 🟣 Frontend Developer: Deepika THAPA KSHETRI (12301540@students.koi.edu.au)
- 🟡 Backend Developer: Anish DAHAL (20027258@students.koi.edu.au)
- 🟢 Database Engineer: Dipesh NEPAL (20027131@students.koi.edu.au)
- ⚪ UI/UX Designer: Rupak GHIMIRE (12300071@students.koi.edu.au)
- 🔴 QA & Blockchain Support: Nischal BHANDARI (20028654@students.koi.edu.au)

## 🔗 Useful Links
- Client: Frethan Technology (Brisbane)
- Supervisor: Mr. Vito Wu (project1@chinadirectsourcing.com.au)

## 📂 Folder Structure
- `/frontend` – UI implementation (React)
- `/backend` – API implementation (Express)
- `/docs` – Documentation & Reports
- `/database` – Prisma schema, migrations

## 🌿 Branch Structure (Development Workflow)

We use a **three-branch structure** to maintain clean and collaborative development.

|   Branch   |   Purpose   |   Permissions   |
|---------|----------|-------------|
| **`main`** | Final, production-ready code. Used for submission and deployment. | 🔒 Only PM merges here. |
| **`dev`** | Shared development branch where all new features are tested. | ✅ All developers can merge their work here. |
| **`feature-*`** | Individual branches for specific tasks (e.g., `feature-login`, `feature-rfq-api`). | 🧩 Created and managed by each developer. |

## ⚠️ Important Notes
- Do not push directly to the main branch.
All changes must go through dev and be tested before merging into main.
- Use lowercase letters and hyphens (-) for all branch names.
Example: feature/backend-api-auth
- Create one branch per feature or weekly task.
After merging into dev, old branches can be safely deleted.

## 🌿 Branch Naming Rules

To maintain a clear and consistent workflow, all team members must create branches following the role-based naming convention below.
This ensures that each branch reflects the contributor’s responsibility and task type.

## 🧭 Naming Format
- feature/role-taskname
- Example: feature/frontend-login-page, feature/backend-apiauth

## 🪜 Branch Workflow

1. Pull the latest dev branch:
   ```
   git checkout dev
   git pull origin dev
   ```

2. Create a new branch based on your role:
   ```
   git checkout -b feature/frontend-login-page
   ```

3. Commit and push your changes:
   ```
   git add .
   git commit -m "Add login page UI"
   git push -u origin feature/frontend-login-page
   ```

4. Create a Pull Request (PR) on GitHub:
   ```
   - Base branch: dev
   - Compare branch: your feature branch
   - Provide a short and clear PR title and description.
   ```
