import dotenv from 'dotenv';
import app from '../app.js';
import connectDB from '../config/db.js';
import { seedDatabase } from '../seed/seedTables.js';

// Load environment variables
dotenv.config();

// Initialize DB connection and seed once (cached across warm invocations)
let isConnected = false;

const initializeDB = async () => {
  if (!isConnected) {
    await connectDB();
    await seedDatabase();
    isConnected = true;
  }
};

// Vercel serverless handler — exports the Express app
export default async (req, res) => {
  await initializeDB();
  app(req, res);
};
