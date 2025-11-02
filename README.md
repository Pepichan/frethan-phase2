# 🧱 Frethan Project – ICT302 Phase 2
A web platform for supplier verification, RFQ management, and procurement transparency.

## 🛠️ Technology Stack
- 🩵 Project Manager: GitHub + Notion + Google Drive
- 🟣 Frontend: React + Vite + Tailwind + TypeScript  
- 🟡 Backend: Node.js + Express + Prisma + PostgreSQL
- 🟢 Database: PostgreSQL + Prisma + pgAdmin
- ⚪ UI/UX: Figma + Canva
- 🔴 QA/Tester: Postman + Web browser
- Hosting: Vercel (Frontend), Render (Backend), Neon (DB)

## 👥 Team Members
- 🩵 Project Manager: Rie HAGIWARA (12203845@students.koi.edu.au)
- 🟣 Frontend Developer: Deepika THAPA KSHETRI (12301540@students.koi.edu.au)
- 🟡 Backend Developer: Anish DAHAL (20027258@students.koi.edu.au)
- 🟢 Database Engineer: Dipesh NEPAL (20027131@students.koi.edu.au)
- ⚪ UI/UX Designer: Rupak GHIMIRE (12300071@students.koi.edu.au)
- 🔴 QA/Tester

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

## 🧩 Workflow Example

```bash
# 1. Switch to dev branch
git checkout dev
git pull origin dev

# 2. Create a new feature branch
git checkout -b feature-login

# 3. After coding, push your branch
git add .
git commit -m "Add login functionality"
git push origin feature-login

# 4. Open a Pull Request (PR) from feature-login → dev
