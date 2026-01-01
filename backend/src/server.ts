import "dotenv/config";

import app from './app';
import { prisma } from './app';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`��� Server running on port ${PORT}`);
      console.log(`��� Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`��� Health check: http://localhost:${PORT}/api/health`);
      console.log(`���️  DB test: http://localhost:${PORT}/api/test-db`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('��� Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('��� Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
