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
- 🩵 Project Manager & 🟢 Database Engineer: Rie HAGIWARA (12203845@students.koi.edu.au)
- 🟣 Frontend Developer: Deepika THAPA KSHETRI (12301540@students.koi.edu.au)
- 🟡 Backend Developer: Anish DAHAL (20027258@students.koi.edu.au) & Dipesh NEPAL (20027131@students.koi.edu.au)
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
| **`feature/FRE-**-taskname`** | Individual branches for specific tasks (e.g., `feature/FRE-**-login`, `feature-FRE-**-rfq-api`). | 🧩 Created and managed by each developer. |

## ⚠️ Important Notes
- Do not push directly to the main branch.
All changes must go through dev and be tested before merging into main.
- Use lowercase letters and hyphens (-) for all branch names.
Example: feature/backend-api-auth
- Create one branch per feature or weekly task.
After merging into dev, old branches can be safely deleted.


---


# 🛠 Jira × GitHub Workflow Guide

To keep our project clean, consistent, and fully automated, please follow the rules below.  
These rules ensure that Jira automation works correctly with GitHub.

## 🔖 1. Always include the Jira Issue ID in your PR title and branch name

This is required for Jira to detect your work and move tasks automatically.

### ✔ Examples

**Branch names**
- feature/FRE-14-login-ui
- feature/FRE-21-auth-flow

**Pull Request titles**
- FRE-14: Add Login UI with Social Buttons
- FRE-21: Implement OAuth Flow (Google/Facebook)
- FRE-30: Fix Auth Callback Redirect

> If the PR title or branch name does NOT contain the Jira issue ID,  
> **automation will not work.**


## 🚧 2. When you start work, move the Jira issue to “In Progress”

This helps the PM track real progress and prevents the automatic “no progress” reminder email.


## 👀 3. When you create a Pull Request, Jira moves the issue to “In Review” automatically

This works only if the PR includes the correct Jira Issue ID.


## ❌ 4. If your PR is declined, fix the issues and submit again

Jira will send you an automatic message.  
Please review comments, apply fixes, and create a new PR with the **same Jira Issue ID**.


## ✅ 5. When your PR is merged, Jira will automatically move the issue to “Done”

No manual updates needed.  
This ensures consistency and saves time for everyone.


## ⏰ 6. Do not leave tasks inactive for more than 3 days

If no progress is detected, Jira sends an automatic reminder email to the assignee.  
To avoid this:
- Move the task to **In Progress**
- Update your branch or PR
- Leave a comment if you are blocked


# 🔗 Jira – GitHub Automation Summary

Our workspace includes the following automations:

### ✔ Move Issue to **Done** when a Pull Request is merged  
### ✔ Move Issue to **In Review** when a PR is created  
### ✔ Notify the team if a Pull Request is declined  
### ✔ Send reminder email when a task has no progress for 3 days  

These rules only work if the Jira Issue ID is correctly used in GitHub.


# 🙌 Need help?
If you're unsure about the workflow, naming, or Jira linking, please contact the PM before creating your Pull Request.

---

## 🪜 Branch Workflow
Always follow this workflow when you start **any new work** (Backend / Frontend / Database / Docs).

1. Pull the latest dev branch:
   
   ```
   git checkout dev       # Switch to dev branch
   git pull origin dev     # Get the latest changes from GitHub
   ```
   **Why?** So your local code is up to date with the team. This reduces merge conflicts.  
   💡 Do this before you start working each day and before you create a new branch.  


3. Create a new branch based on your role:
   ```
   git checkout -b feature/FRE-21-frontend-login-page
   ```
   **Why?** You should never work directly on dev or main. Each Jira issue/task should have its own feature branch.  


4. Commit and push your changes:
   After you finish a small logical part (not the whole project), do:
   ```
   git add .
   git commit -m "FRE-21: Add login page UI"   # Commit with Jira issue key
   git push -u origin feature/FRE-21-frontend-login-page
   ```

6. Create a Pull Request (PR) on GitHub:
   ```
   - Base branch: dev
   - Compare branch: your feature branch
   - Provide a short and clear PR title with Jira Issue ID and description.
   ```
   In the PR:
   - Title example: FRE-21: Add frontend login page
   - Description: What you changed, How to test (if needed), Mention related Jira issue (e.g. FRE-21)
  
