# W6: DB Schema Updates (Payment + Notification)

Date: 2026-01-01

## Purpose

Extend the Prisma schema to include `Payment` + `Notification` tables and connect them with `Orders` and `Users`.

## What Exists

### Notification

- Model: `Notification`
- Relations:
  - `Notification.userId` → `User.id`
  - `Notification.orderId` → `Order.id` (optional)
- Indexes:
  - `@@index([userId, createdAt])`
  - `@@index([orderId])`

Migration:
- `backend/prisma/migrations/20251210091436_add_notification_table`

### Payment

- Model: `Payment`
- Relations:
  - `Payment.buyerId` → `User.id`
  - `Payment.orderId` → `Order.id` (optional)
- Indexes:
  - `@@index([buyerId, receivedAt])`
  - `@@index([orderId])`
  - `@@index([status])`

Migration:
- `backend/prisma/migrations/20260101044221_add_payment_order_relation`

## How To Apply

From `backend/`:

- Generate Prisma client: `npm run prisma:generate`
- Apply migrations (CI-like): `npx prisma migrate deploy`

## How To Verify (pgAdmin)

1. Connect to the configured database from `DATABASE_URL`.
2. Confirm tables exist: `Payment`, `Notification`.
3. Confirm columns:
   - `Notification.userId`, `Notification.orderId`, `Notification.isRead`, `Notification.createdAt`
   - `Payment.buyerId`, `Payment.orderId`
4. Confirm indexes exist for:
   - `Notification(userId, createdAt)`, `Notification(orderId)`
   - `Payment(orderId)`
5. Confirm foreign keys:
   - `Notification.userId` → `User.id`
   - `Notification.orderId` → `Order.id`
   - `Payment.orderId` → `Order.id`
