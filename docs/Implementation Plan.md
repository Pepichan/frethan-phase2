# 🎯 Implementation Plan – Frethan Project (Phase 2)
ICT302 – Information Technology Project 2    

---

## 1. 🚀 Introduction
This Implementation Plan outlines the full development workflow for ICT302 (Phase 2) of the Frethan Procurement Platform.  
The goal is to evolve the ICT301 prototype into a functional, scalable, and secure procurement system featuring:

- 🔐 Multi-provider authentication (Google, Facebook, WeChat Demo)  
- 🧾 RFQ → Quote → Order workflow  
- ⛓️ Blockchain-based Escrow (80/20)  
- 🗄️ PostgreSQL + Prisma ORM  
- ☁️ Deployment to Vercel + Render  
- 🧪 Complete QA cycle and documentation

This document serves as the master reference for development, testing, and project management.

---

# 3. 📅 Implementation Timeline (W3–W10)

| Week | Role | Tasks |
|------|------|-------|
| **Week 3 – Core System Planning** | 🩵PM | Configure CI/CD, repo guidelines |
| | 🟡Backend | Define REST API structure |
| | 🟢Database | Finalize ERD & schema |
| | 🟣Frontend | Initial routing & layouts |
| | ⚪UI/UX | Finalize Figma prototype |
| | 🔴QA | Create initial test plan |
| **Week 4 – DB & Authentication Foundation** | 🟢Database | Implement Prisma models & migrations |
| | 🟡Backend | Document OAuth flow (Google/Facebook/WeChat Demo) |
| | 🟣Frontend | Build Login UI with social login |
| | ⚪UI/UX | Add WeChat Demo flow |
| | 🩵PM | Draft Privacy Policy & Terms |
| | 🔴QA | Expand OAuth test plan |
| **Week 5 – RFQ Module & Auth E2E** | 🟡Backend | RFQ + Quote APIs / Google & Facebook OAuth (E2E) |
| | 🟢Database | RFQ/Quote/Order relations |
| | 🟣Frontend | RFQ & Quote UI + API integration |
| | ⚪UI/UX | Visual consistency check |
| | 🩵PM | Mid-phase review meeting |
| | 🔴QA | RFQ tests & OAuth E2E tests |
| **Week 6 – Order Module & WeChat Demo** | 🟡Backend | Order & Notification APIs / WeChat Demo login |
| | 🟢Database | Payment & Notification tables |
| | 🟣Frontend | Order Dashboard / Linked Accounts |
| | ⚪UI/UX | Usability testing |
| | 🩵PM | Document WeChat Demo limitations |
| | 🔴QA | Order flow + WeChat Demo testing |
| **Week 7 – Smart Contract Development** | 🟡Backend | Develop & deploy escrow smart contract (Sepolia) |
| | 🟢Database | ContractRef linkage |
| | 🟣Frontend | Contract tab & status UI |
| | ⚪UI/UX | Blockchain user journey mapping |
| | 🩵PM | Document blockchain architecture |
| | 🔴QA | Assist with deployment tests |
| **Week 8 – Blockchain Integration** | 🟡Backend | Integrate backend ↔ smart contract |
| | 🟢Database | Validate on/off-chain sync |
| | 🟣Frontend | Wire contract actions |
| | ⚪UI/UX | Final blockchain screens |
| | 🩵PM | Internal integration test session |
| | 🔴QA | Blockchain E2E + record Tx hashes |
| **Week 9 – System Testing & Optimization** | 🟡Backend | Logging, security fixes |
| | 🟢Database | Query optimization |
| | 🟣Frontend | UI polish & performance fixes |
| | ⚪UI/UX | Usability review |
| | 🩵PM | User Manual & Testing Report |
| | 🔴QA | Full system E2E + load testing |
| **Week 10 – Deployment & Presentation** | 🟡Backend | Deploy backend / verify Etherscan |
| | 🟣Frontend | Deploy frontend & env setup |
| | 🟢Database | Final validation & backup |
| | ⚪UI/UX | Demo video & slides |
| | 🩵PM | Final Report & rollback plan |
| | 🔴QA | Production QA & demo rehearsal |

---

# 4. 🔗 Dependencies Overview

| Dependency | Must Come Before |
|-----------|------------------|
| 🗄️ DB schema | API development / OAuth setup |
| 🔐 OAuth setup | Google/Facebook E2E tests |
| ⛓️ Smart contract | Blockchain integration |
| 📦 Order API | Order Dashboard integration |
| 🧪 Full E2E Test | Final Report writing |
| ☁️ Prod Deployment | Final QA & demo rehearsal |

---

# 5. 📦 Deliverables Summary

| Week | Deliverables |
|------|--------------|
| W3 | CI/CD, ERD, API Spec |
| W4 | DB schema, OAuth docs |
| W5 | RFQ Module + OAuth E2E |
| W6 | Order Module + WeChat Demo |
| W7 | Smart Contract v1 |
| W8 | Blockchain Integration |
| W9 | System E2E, Manuals, Security Review |
| W10 | Deployment, Demo Video, Final Report |

---

# 6. 🧪 Quality Assurance Strategy

- Unit & integration tests  
- OAuth E2E tests  
- Blockchain E2E tests  
- Load testing (k6)  
- Error handling verification  
- Production smoke tests  

All QA results stored under:  
`/testing/results/`

---

# 7. 📚 Documentation Structure

| Path | Description |
|------|-------------|
| `/docs/implementation/implementation-plan.md` | This plan |
| `/docs/auth/identity-providers.md` | OAuth + WeChat Demo setup |
| `/docs/blockchain/test-results.md` | Sepolia transaction evidence |
| `/docs/reports/` | Reports, QA summaries |
| `/docs/design/` | Figma exports |
| `/docs/deploy/rollback-plan.md` | Rollback procedure |

---

# 8. ✅ Conclusion
This Implementation Plan provides a structured roadmap from system planning to final deployment.  
By Week 10, the system will include:

- 🔐 Multi-provider authentication  
- 🧾 Full procurement workflow  
- ⛓️ Smart contract escrow  
- 🗄️ Database-driven transparency  
- ☁️ Cloud deployment and documentation  

A complete and ready-to-present platform will be delivered to the client.

