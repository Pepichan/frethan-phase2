# Frethan RFQ System

A full-stack Request for Quote (RFQ) system with authentication and Purchase Order management.

## Features

- **User Authentication**: JWT-based authentication with buyer/seller roles
- **RFQ Management**: Buyers can create RFQs
- **Purchase Orders**: Sellers can view RFQs and convert them to Purchase Orders
- **Role-Based Access**: Separate dashboards for buyers and sellers

## Tech Stack

- **Frontend**: React, TypeScript, Vite, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken), bcryptjs

## Project Structure

```
frethan-rfq-new/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── api/              # Vercel serverless function entry point
└── vercel.json       # Vercel deployment configuration
```

## Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or Atlas)

### Setup

1. Clone the repository
```bash
git clone https://github.com/Rupak0071/RFQ.git
cd RFQ
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example file
cp .env.example backend/.env

# Edit backend/.env with your MongoDB URI and JWT secret
```

4. Start development servers
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5001
- Frontend: http://localhost:5173

## Environment Variables

See `.env.example` for required environment variables.

Required variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_ORIGIN`: Frontend URL for CORS (optional)
- `PORT`: Backend port (defaults to 5000)

## Deployment

### Vercel Deployment

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed Vercel deployment instructions.

Quick steps:
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### RFQs
- `GET /api/rfqs` - Get RFQs (buyers see their own, sellers see all)
- `POST /api/rfqs` - Create RFQ (buyers only)
- `GET /api/rfqs/:id` - Get single RFQ

### Purchase Orders
- `GET /api/pos` - Get POs
- `POST /api/pos` - Create PO from RFQ (sellers only)
- `GET /api/pos/:id` - Get single PO
- `PATCH /api/pos/:id` - Update PO status

## User Roles

### Buyer
- Can create RFQs
- Can view their own RFQs
- Can view POs created for their RFQs
- Can accept/reject POs

### Seller
- Can view all RFQs
- Can create Purchase Orders from RFQs
- Can view their own POs
- Can update PO details

## License

Private - All rights reserved
