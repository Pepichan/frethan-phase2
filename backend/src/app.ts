import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./openapi";

// Import routes
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import rfqRoutes from './routes/rfqRoutes';
import quoteRoutes from './routes/quoteRoutes';
import orderRoutes from "./routes/orderRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

// TODO: Later move Prisma client to a separate config file (e.g. src/config/prisma.ts)
const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev')); // Changed to 'dev' for better readability
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/quotes', quoteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get("/api/openapi.json", (req, res) => {
  res.status(200).json(openapiSpec);
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Test database connection
if (process.env.NODE_ENV === 'development') {
  app.get('/api/test-db', async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        status: 'OK',
        message: 'Database connection successful',
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
