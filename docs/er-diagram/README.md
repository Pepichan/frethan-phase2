# 🗂️ Frethan Project – Database ER Diagram

This folder contains the **Entity–Relationship (ER)** diagram for the Frethan Phase 2 (ICT302) backend system.  
It serves as the **source of truth** for all Prisma models, PostgreSQL database tables, and backend API data structures.

---

## 📁 1. Files

- **`frethan-er-v1.png`**  
  Final ER diagram used in Phase 2 for database development.

> 📌 **Path:** `docs/er-diagram/frethan-er-v1.png`

---

## 🧠 2. Overview of the Data Model

The ER diagram reflects Frethan’s complete procurement workflow.

### 👤 User & Role
- The `User` table stores all platform accounts.
- The `Role` table defines user permissions (ADMIN / BUYER / SUPPLIER).

### 🏭 Supplier & Products
- `SupplierProfile` stores supplier-company information.
- `Product` represents catalog items.
- `MaterialCategory` groups products into hierarchical categories.

### 📄 RFQ → Quote → Order
- `RFQ` is created by a buyer to request quotations.
- Each RFQ contains multiple `RFQItem`s.
- Suppliers reply using `Quote` and `QuoteItem`s.
- Orders are created from accepted quotes.

### 📦 Delivery & Tracking
- `Shipment` stores shipment-level information.
- `ShipmentUpdate` logs shipment events.
- `GoodsReceipt` and `GoodsReceiptItem` record receiving and inspection details.

### 💰 Invoice & Payment
- `Invoice` and `InvoiceItem` track billing and line-level costs.
- `Payment` records payment transactions.
- `PaymentAllocation` maps payments to invoices.

### 🧾 Compliance
- `ComplianceCertificate` stores product/supplier certificates.
- Supports optional `blockchainTxId` for future blockchain integration.

---

## 🔗 3. Relationship Highlights

- **1 Role → many Users**  
- **1 SupplierProfile → many Products / Quotes / Orders**  
- **1 RFQ → many RFQItems → many QuoteItems**  
- **1 Quote → many QuoteItems → many Orders**  
- **1 Order → many OrderItems / Shipments / GoodsReceipts / Invoices**  
- **1 Shipment → many ShipmentUpdates / many GoodsReceipts**  
- **1 Payment → many PaymentAllocations → many Invoices**

These relationships are mapped using Prisma `@relation` fields inside: backend/prisma/schema.prisma

---

## 🛠️ 4. Mapping to Prisma & PostgreSQL

The ER diagram corresponds to Prisma models defined in: backend/prisma/schema.prisma

Prisma generates PostgreSQL tables using: cd backend → npx prisma migrate dev --name init

This command creates **20+ tables** inside the `frethan_db` database.

---

## 🧾 5. How to Update the ER Diagram

Follow this process whenever the database structure changes:

1. Open the ERD source file (draw.io / diagrams.net).  
2. Apply changes (new tables, fields, or relationships).  
3. Export as PNG: File → Export → PNG → frethan-er-vX.png
4. Replace the file in this folder.  
5. Update:
   - `schema.prisma`
   - Prisma migrations (`npx prisma migrate dev`)

> 💡 **Always update the ER diagram before making schema changes**  
> to keep documentation consistent with the actual database.

---

## 📌 6. Notes

- The ER diagram is the **official reference** for backend architecture.  
- It is used for:
  - Database development  
  - API contract design  
  - Frontend data structures  
  - ICT302 final report documentation  
- Future features (blockchain, analytics, automation) should extend this model.






