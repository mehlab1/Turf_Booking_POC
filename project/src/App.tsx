import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Grounds from './pages/Grounds';
import GroundDetails from './pages/GroundDetails';
import Bookings from './pages/Bookings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSlots from './pages/admin/AdminSlots';
import AdminPricing from './pages/admin/AdminPricing';
import AdminBookings from './pages/admin/AdminBookings';
import AdminTeams from './pages/admin/AdminTeams';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/grounds" element={
              <ProtectedRoute>
                <Grounds />
              </ProtectedRoute>
            } />
            
            <Route path="/ground/:id" element={
              <ProtectedRoute>
                <GroundDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/slots" element={
              <ProtectedRoute requireAdmin>
                <AdminSlots />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/pricing" element={
              <ProtectedRoute requireAdmin>
                <AdminPricing />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/bookings" element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/teams" element={
              <ProtectedRoute requireAdmin>
                <AdminTeams />
              </ProtectedRoute>
            } />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;