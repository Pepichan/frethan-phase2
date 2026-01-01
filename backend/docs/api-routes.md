# API Routes

Base URL: `/api`

## Auth

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me` (JWT required)

## RFQ

- `POST /rfqs` (JWT required)
- `GET /rfqs/:id` (JWT required)
- `PUT /rfqs/:id` (JWT required)
- `DELETE /rfqs/:id` (JWT required)

## Quote

- `POST /quotes` (JWT required)
- `GET /quotes/:id` (JWT required)
- `PUT /quotes/:id` (JWT required)
- `DELETE /quotes/:id` (JWT required)

## Orders (W6)

### Endpoints

- `POST /orders` (JWT required)
  - **Buyer/Admin**: create an order from a `quoteId`
- `GET /orders/:id` (JWT required)
  - **Buyer**: can view own orders
  - **Supplier**: can view orders for own supplier profile
  - **Admin**: can view any order
- `PUT /orders/:id` (JWT required)
  - **Supplier**: can update `status` for orders assigned to their supplier profile (see transition rules below)
  - **Admin**: can update order fields (including `status`)
- `DELETE /orders/:id` (JWT required)
  - **Admin**: delete any order
  - **Buyer**: can delete own order only while status is `PENDING`

### Status transitions

Supplier transitions are restricted:

- `PENDING` → `IN_PROGRESS`
- `CONFIRMED` → `IN_PROGRESS`
- `IN_PROGRESS` → `COMPLETED`

(Admin can override transitions.)

## Notifications (W6)

### Endpoints

- `GET /notifications` (JWT required)
  - Returns: `notifications[]` and `unreadCount`
- `PATCH /notifications/:id/read` (JWT required)
  - Marks a single notification as read
  - Returns: updated `notification` and new `unreadCount`

### Access control

Notifications are always scoped to the authenticated user.
