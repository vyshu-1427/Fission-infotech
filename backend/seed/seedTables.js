import Table from '../models/Table.js';
import User from '../models/User.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Tables
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      const defaultTables = [
        { tableNumber: 1, capacity: 2, isActive: true },
        { tableNumber: 2, capacity: 2, isActive: true },
        { tableNumber: 3, capacity: 4, isActive: true },
        { tableNumber: 4, capacity: 4, isActive: true },
        { tableNumber: 5, capacity: 6, isActive: true },
        { tableNumber: 6, capacity: 8, isActive: true },
      ];

      await Table.insertMany(defaultTables);
      console.log('Restaurant tables successfully seeded.');
    } else {
      console.log('Tables already seeded.');
    }

    // 2. Seed Default Admin User
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const defaultAdmin = new User({
        name: 'Restaurant Admin',
        email: 'admin@restaurant.com',
        password: 'adminpassword123', // Will be hashed by userSchema pre-save middleware
        role: 'admin',
      });
      await defaultAdmin.save();
      console.log('Default Admin user successfully seeded (admin@restaurant.com / adminpassword123).');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};
