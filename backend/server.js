import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabase } from './seed/seedTables.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(async () => {
  // Seed Database (Tables & Admin Account)
  await seedDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
