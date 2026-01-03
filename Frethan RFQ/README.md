# Frethan RFQ System

A full-stack Request for Quote (RFQ) system with role-based access and Purchase Order management.

## Features

- **Role-Based Access**: Buyers can create RFQs, Sellers can view RFQs and create Purchase Orders
- **RFQ Management**: Complete RFQ creation and submission system
- **Purchase Orders**: Sellers can convert RFQs into Purchase Orders with quoted prices
- **MongoDB Integration**: All data stored in MongoDB

## Tech Stack

- **Frontend**: React, TypeScript, Vite, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (Frontend + API)

## Project Structure

```
Frethan RFQ/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── api/              # Vercel serverless function entry point
└── vercel.json       # Vercel deployment configuration
```

## Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB database

### Setup

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
```bash
# Create backend/.env with:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
FRONTEND_ORIGIN=http://localhost:5173
```

3. Start development servers
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5001
- Frontend: http://localhost:5173

## API Endpoints

### RFQs
- `GET /api/rfqs` - Get all RFQs
- `POST /api/rfqs` - Create RFQ
- `GET /api/rfqs/:id` - Get single RFQ

### Purchase Orders
- `GET /api/pos` - Get all POs
- `POST /api/pos` - Create PO from RFQ
- `GET /api/pos/:id` - Get single PO
- `PATCH /api/pos/:id` - Update PO status

## User Roles

### Buyer
- Can create RFQs
- Can view all RFQs
- Can view Purchase Orders

### Seller
- Can view all RFQs
- Can create Purchase Orders from RFQs
- Can view and manage their POs

## License

Private - All rights reserved
