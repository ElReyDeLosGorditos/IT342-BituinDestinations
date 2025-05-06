// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';
import AuthCallback from './pages/AuthCallback';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Unauthorized from './components/Unauthorized.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DestinationBrowser from './pages/user/DestinationBrowser.jsx';
import TourPackageDetails from './pages/user/TourPackageDetails.jsx';
import Wishlist from './pages/user/Wishlist.jsx';
import BookingConfirmation from './pages/user/BookingConfirmation.jsx';
import MyBookings from './pages/user/MyBookings.jsx';
import PaymentConfirmation from './pages/user/PaymentConfirmation.jsx';
import BookingReceipt from './pages/user/BookingReceipt.jsx';

function App() {
  return (
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* User Routes */}
          <Route path="/home" element={
            <ProtectedRoute requiredRole="USER">
              <DestinationBrowser />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/tour-package/:id" element={
            <ProtectedRoute requiredRole="USER">
              <TourPackageDetails />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute requiredRole="USER">
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/booking-confirmation/:bookingId" element={
            <ProtectedRoute requiredRole="USER">
              <BookingConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute requiredRole="USER">
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/payment-confirmation/:bookingId" element={
            <ProtectedRoute requiredRole="USER">
              <PaymentConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/booking-receipt/:bookingId" element={
            <ProtectedRoute requiredRole="USER">
              <BookingReceipt />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/destinations" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/tour-packages" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
  );
}

export default App;