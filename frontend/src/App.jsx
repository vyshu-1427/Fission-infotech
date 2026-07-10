import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import Profile from './pages/Profile.jsx';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import ReserveTable from './pages/customer/ReserveTable.jsx';
import MyReservations from './pages/customer/MyReservations.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageReservations from './pages/admin/ManageReservations.jsx';
import ManageTables from './pages/admin/ManageTables.jsx';

// Root redirect handler
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return user.role === 'admin' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show navigation navbar only if user is logged in */}
      {user && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Customer Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reserve"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ReserveTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageTables />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Root Redirect Route */}
          <Route path="/" element={<RootRedirect />} />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer */}
      {user && (
        <footer className="py-6 text-center text-xs text-dark-400 border-t border-white/5 bg-dark-950/20 backdrop-blur-md">
          &copy; {new Date().getFullYear()} FineDine Restaurant Reservation Management System. All rights reserved.
        </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
