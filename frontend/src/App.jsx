import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import FxBackground from './components/FxBackground.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import Profile from './pages/Profile.jsx';
import Landing from './pages/Landing.jsx';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import ReserveTable from './pages/customer/ReserveTable.jsx';
import MyReservations from './pages/customer/MyReservations.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageReservations from './pages/admin/ManageReservations.jsx';
import ManageTables from './pages/admin/ManageTables.jsx';



const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative">
      {/* Global background — only shown when logged in to avoid double bg on auth pages */}
      {user && <FxBackground />}

      {/* Sidebar nav */}
      {user && <Navbar />}

      {/* Main content — offset right of sidebar on desktop */}
      <main
        className="relative z-10 min-h-screen"
        style={{
          marginLeft: user ? undefined : 0,
          paddingLeft: user ? undefined : 0,
        }}
      >
        {/* Sidebar spacer on desktop */}
        <div className={user ? 'md:pl-[244px]' : ''} style={{ minHeight: '100vh' }}>
          <div className={user ? 'pt-4 md:pt-0 mt-14 md:mt-0' : ''}>
            <Routes>
              <Route path="/login"        element={<Login />} />
              <Route path="/register"     element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route path="/dashboard"    element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/reserve"      element={<ProtectedRoute allowedRoles={['customer']}><ReserveTable /></ProtectedRoute>} />
              <Route path="/reservations" element={<ProtectedRoute allowedRoles={['customer']}><MyReservations /></ProtectedRoute>} />

              <Route path="/admin/dashboard"    element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/reservations" element={<ProtectedRoute allowedRoles={['admin']}><ManageReservations /></ProtectedRoute>} />
              <Route path="/admin/tables"       element={<ProtectedRoute allowedRoles={['admin']}><ManageTables /></ProtectedRoute>} />

              <Route path="/profile" element={<ProtectedRoute allowedRoles={['customer','admin']}><Profile /></ProtectedRoute>} />
              <Route path="/"        element={<Landing />} />
              <Route path="*"        element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
