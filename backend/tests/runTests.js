import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import User from '../models/User.js';
import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';
import { seedDatabase } from '../seed/seedTables.js';

dotenv.config();

const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}/api`;
let server;

// Helper to wrap server listening in promise
const startServer = () => {
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`[TEST SERVER] Running on port ${PORT}`);
      resolve();
    });
  });
};

// Helper for HTTP requests
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();
  return { status: response.status, data };
};

const runTests = async () => {
  console.log('\n=== STARTING INTEGRATION TESTS ===\n');
  
  try {
    // 1. Connect to DB and clear test collections
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-reservation');
    console.log('Connected to MongoDB for testing.');
    
    // Clear collections to ensure deterministic tests
    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Cleared test database collections.');

    // Seed database
    await seedDatabase();

    // Start server
    await startServer();

    let customerToken;
    let adminToken;
    let customerId;
    let tableIdToDelete;

    // Test 1: Register Customer
    console.log('\nTest 1: Customer Registration...');
    const registerRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'customer123',
      },
    });
    if (registerRes.status === 201 && registerRes.data.success) {
      console.log('✓ Customer registered successfully.');
      customerToken = registerRes.data.data.token;
      customerId = registerRes.data.data._id;
    } else {
      throw new Error(`Customer registration failed: ${JSON.stringify(registerRes.data)}`);
    }

    // Test 2: Login Customer
    console.log('\nTest 2: Customer Login...');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'customer@test.com',
        password: 'customer123',
      },
    });
    if (loginRes.status === 200 && loginRes.data.success) {
      console.log('✓ Customer logged in successfully.');
    } else {
      throw new Error(`Customer login failed`);
    }

    // Test 3: Login Admin (Seeded during startup)
    console.log('\nTest 3: Admin Login...');
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@restaurant.com',
        password: 'adminpassword123',
      },
    });
    if (adminLoginRes.status === 200 && adminLoginRes.data.success) {
      console.log('✓ Admin logged in successfully.');
      adminToken = adminLoginRes.data.data.token;
    } else {
      throw new Error(`Admin login failed`);
    }

    // Test 4: Role-Based Authorization
    console.log('\nTest 4: Customer trying to access Admin route...');
    const forbiddenRes = await request('/admin/reservations', {
      method: 'GET',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (forbiddenRes.status === 403) {
      console.log('✓ Correctly returned 403 Forbidden.');
    } else {
      throw new Error(`Should have returned 403 Forbidden, but got: ${forbiddenRes.status}`);
    }

    // Test 5: Table assignment - Smallest available capacity selection
    // Table 1 (Cap 2), Table 2 (Cap 2), Table 3 (Cap 4), Table 4 (Cap 4), Table 5 (Cap 6), Table 6 (Cap 8)
    // Book 2 guests: Should assign Table 1 (Cap 2)
    console.log('\nTest 5: Auto-assign table (Smallest Capacity First)...');
    const bookRes1 = await request('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        reservationDate: '2026-08-20',
        timeSlot: '7:00 PM',
        numberOfGuests: 2,
      },
    });
    if (bookRes1.status === 201 && bookRes1.data.data.tableId.tableNumber === 1) {
      console.log('✓ Correctly assigned Table #1 (Capacity: 2) for 2 guests.');
    } else {
      throw new Error(`Incorrect table assignment: ${JSON.stringify(bookRes1.data)}`);
    }

    // Test 6: Overlap Reservation - Move to next available table
    // Book another 2 guests same date/time. Table 1 is booked. Should assign Table 2 (Cap 2)
    console.log('\nTest 6: Overlap booking moves to next suitable table...');
    const bookRes2 = await request('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        reservationDate: '2026-08-20',
        timeSlot: '7:00 PM',
        numberOfGuests: 2,
      },
    });
    if (bookRes2.status === 201 && bookRes2.data.data.tableId.tableNumber === 2) {
      console.log('✓ Correctly assigned Table #2 (Capacity: 2) as Table #1 was booked.');
    } else {
      throw new Error(`Incorrect table assignment on overlap: ${JSON.stringify(bookRes2.data)}`);
    }

    // Test 7: Booking capacity match sorting
    // Book 3 guests: Should assign Table 3 (Cap 4) since capacity 2 tables are too small
    console.log('\nTest 7: Assign smallest table matching capacity constraint...');
    const bookRes3 = await request('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        reservationDate: '2026-08-20',
        timeSlot: '7:00 PM',
        numberOfGuests: 3,
      },
    });
    if (bookRes3.status === 201 && bookRes3.data.data.tableId.tableNumber === 3) {
      console.log('✓ Correctly assigned Table #3 (Capacity: 4) for 3 guests.');
    } else {
      throw new Error(`Incorrect table assignment: ${JSON.stringify(bookRes3.data)}`);
    }

    // Test 8: Exhaust tables and trigger 409 Conflict
    // Book remaining tables for 7:00 PM, 2026-08-20:
    // Table 4 (Cap 4), Table 5 (Cap 6), Table 6 (Cap 8)
    console.log('\nTest 8: Exhausting all remaining tables for slot...');
    
    // Book for Table 4 (requires 4 guests)
    await request('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { reservationDate: '2026-08-20', timeSlot: '7:00 PM', numberOfGuests: 4 },
    });
    // Book for Table 5 (requires 6 guests)
    await request('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { reservationDate: '2026-08-20', timeSlot: '7:00 PM', numberOfGuests: 6 },
    });
    // Book for Table 6 (requires 8 guests)
    await request('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { reservationDate: '2026-08-20', timeSlot: '7:00 PM', numberOfGuests: 8 },
    });

    // All tables (1 to 6) are now booked for 2026-08-20 at 7:00 PM.
    // Try to book one more table (e.g. for 2 guests)
    console.log('Attempting booking when all tables are full...');
    const fullRes = await request('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        reservationDate: '2026-08-20',
        timeSlot: '7:00 PM',
        numberOfGuests: 2,
      },
    });
    if (fullRes.status === 409 && !fullRes.data.success) {
      console.log('✓ Correctly returned 409 Conflict: "No tables available for this time slot."');
    } else {
      throw new Error(`Expected 409 Conflict, but got: ${fullRes.status} ${JSON.stringify(fullRes.data)}`);
    }

    // Test 9: Create and Delete Tables (Safety Check)
    console.log('\nTest 9: Admin table creation and active deletion prevention...');
    // Create new table
    const createTableRes = await request('/tables', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        tableNumber: 10,
        capacity: 10,
        isActive: true,
      },
    });
    if (createTableRes.status === 201 && createTableRes.data.success) {
      console.log('✓ Table #10 successfully created by Admin.');
      tableIdToDelete = createTableRes.data.data._id;
    } else {
      throw new Error(`Table creation failed`);
    }

    // Attempt to delete active table (should fail)
    const deleteActiveRes = await request(`/tables/${tableIdToDelete}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (deleteActiveRes.status === 400 && !deleteActiveRes.data.success) {
      console.log('✓ Correctly prevented deletion of active Table (returned 400 Bad Request).');
    } else {
      throw new Error(`Should have blocked deletion, but returned: ${deleteActiveRes.status}`);
    }

    // Set table inactive
    await request(`/tables/${tableIdToDelete}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { isActive: false },
    });

    // Delete inactive table (should succeed)
    const deleteInactiveRes = await request(`/tables/${tableIdToDelete}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (deleteInactiveRes.status === 200 && deleteInactiveRes.data.success) {
      console.log('✓ Successfully deleted inactive Table #10.');
    } else {
      throw new Error(`Failed to delete inactive table: ${JSON.stringify(deleteInactiveRes.data)}`);
    }

    console.log('\n======================================');
    console.log('ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('======================================\n');
    
    // Exit cleanup
    server.close();
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error(`\n❌ TEST SUITE RUNTIME ERROR: ${error.message}`);
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

runTests();
