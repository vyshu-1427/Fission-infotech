import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Attempting to connect to MongoDB using:');
console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log(`\nSUCCESS: Connected to MongoDB! Host: ${conn.connection.host}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(`\nFAILURE: Could not connect to MongoDB.`);
    console.error(err);
    process.exit(1);
  });
