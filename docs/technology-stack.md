# 🧰 Technology Stack – Frethan Procurement Platform (Phase 2)

This document outlines all technologies used across the full stack of the Frethan Procurement Platform.  
It includes frontend, backend, blockchain, database, DevOps, testing, and supporting tools for ICT302.

---

## 🎨 1. Frontend Stack

| Category | Tech | Purpose |
|----------|------|---------|
| Framework | **React + Vite + TypeScript** | Fast SPA development with modern tooling |
| Styling | **Tailwind CSS / Shadcn UI** | Utility-first design & consistent UI components |
| State / Data | **React Query** | Server-state management & API caching |
| Routing | **React Router** | Page navigation & protected routes |
| Icons | **Lucide Icons** | Clean, modern icons for UI |
| Bundling | **Vite** | Faster dev environment and builds |

---

## 🧠 2. Backend Stack

| Category | Tech | Purpose |
|----------|------|---------|
| Runtime | **Node.js (Express.js)** | REST API server |
| Auth | **JWT + OAuth2** | Authentication (Google, Facebook, WeChat Demo) |
| API Docs | **Swagger (OpenAPI)** | Auto-generated API documentation |
| Security | **Helmet / CORS** | HTTP header protection & origin control |
| Validation | **Zod / Validator** | Request validation & input sanitization |
| Utilities | **Nodemailer (optional)** | Email notifications (future scope) |

---

## ⛓️ 3. Blockchain Stack

| Category | Tech | Purpose |
|----------|------|---------|
| Smart Contracts | **Solidity** | Core logic for 80/20 escrow |
| Development | **Hardhat** | Contract testing & deployment |
| Interaction | **ethers.js** | Connect backend with smart contracts |
| Libraries | **OpenZeppelin** | Secure contract templates (Ownable, ReentrancyGuard) |
| Network | **Sepolia Testnet** | Ethereum test network for deployment |
| Explorer | **Etherscan** | Verify contracts & inspect transactions |

---

## 🗄️ 4. Database & ORM

| Category | Tech | Purpose |
|----------|------|---------|
| DB Engine | **PostgreSQL** | Relational database (orders, users, RFQs) |
| ORM | **Prisma** | Schema, migrations, type-safe DB queries |
| Tools | **pgAdmin** | Debugging & DB inspection |
| Schema | **Prisma Migrate** | Versioned data model management |

---

## ⚙️ 5. DevOps & Deployment

| Category | Tech | Purpose |
|----------|------|---------|
| CI/CD | **GitHub Actions** | Automated build/test pipelines |
| Frontend Hosting | **Vercel** | Fast CDN & global deployment |
| Backend Hosting | **Render / Railway** | App server & database hosting |
| Versioning | **Git + GitHub** | Repository, branches, PR reviews |
| Environment | **Dotenv** | Secure environment variable handling |
| Logging | **Winston / Morgan** | Centralized server logging |

---

## 🧪 6. Testing & Quality Assurance

| Category | Tech | Purpose |
|----------|------|---------|
| API Testing | **Postman** | Manual and automated API tests |
| Unit Testing | **Jest** | Backend unit test coverage |
| Load Testing | **k6** | Performance & stress testing |
| Blockchain Testing | **Hardhat test** | Smart contract verification |
| E2E Testing | **Manual / Postman collection** | Full RFQ→Order→Contract tests |

---

## 🎨 7. UI/UX & Prototyping

| Category | Tech | Purpose |
|----------|------|---------|
| Design Tools | **Figma** | High-fidelity prototypes & UI design |
| Guidelines | **Frethan Style Guide** | Colors, spacing, branding consistency |
| Assets | **SVG Icons / Logo Assets** | Consistent UI visuals |

---

## 📚 8. Documentation & PM Tools

| Category | Tech | Purpose |
|----------|------|---------|
| Docs | **Markdown (.md)** | GitHub documentation |
| PM | **GitHub Projects** | Task tracking & Kanban |
| Meetings | **Meeting Minutes (.md)** | Weekly update documentation |
| Reports | **PDF / DOCX** | Academic submissions |

---

## ✅ Conclusion
This technology stack provides a modern, scalable, and secure foundation for implementing the Frethan Procurement Platform.  
It ensures:

- ⚡ High-performance frontend  
- 🔐 Secure authentication  
- 💾 Reliable data storage  
- ⛓️ Trustless blockchain processing  
- 🧪 Proper testing coverage  
- 📦 Clean documentation & maintainability  


