import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

// Import routes
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import rfqRoutes from './routes/rfqRoutes';
import quoteRoutes from './routes/quoteRoutes';

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'Error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    status: 'Error',
    message: 'Internal server error'
  });
});

export default app;
