# Backend API Routes (Planned)

This document outlines the planned REST API structure for key modules.

## Base
- Base URL: `/api`

## Health
- `GET /api/health` — Service health check

## Authentication (planned)
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login and obtain token
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user profile
- `POST /api/auth/oauth/google` — Start Google OAuth
- `GET /api/auth/oauth/google/callback` — OAuth callback

## Users (initial)
- `GET /api/users` — List users
- `GET /api/users/:id` — Get user by id
- `POST /api/users` — Create user
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

## Suppliers (planned)
- `GET /api/suppliers` — List suppliers
- `GET /api/suppliers/:id` — Get supplier profile
- `POST /api/suppliers` — Create supplier profile
- `PATCH /api/suppliers/:id` — Update supplier profile

## RFQ (planned)
- `GET /api/rfqs` — List RFQs
- `GET /api/rfqs/:id` — Get RFQ details
- `POST /api/rfqs` — Create RFQ
- `PATCH /api/rfqs/:id` — Update RFQ
- `POST /api/rfqs/:id/items` — Add RFQ item

## Orders (planned)
- `GET /api/orders` — List orders
- `GET /api/orders/:id` — Get order details
- `POST /api/orders` — Create order
- `PATCH /api/orders/:id` — Update order status

## Notes
- Auth requirements and response schemas will be added as endpoints are implemented.
