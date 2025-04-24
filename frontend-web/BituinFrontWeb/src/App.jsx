// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DestinationBrowser from './pages/DestinationBrowser';
import TourPackageDetails from './pages/TourPackageDetails';
import Wishlist from './pages/Wishlist';

function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Routes>
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

          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <DestinationBrowser />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/tour-package/:id" element={
            <ProtectedRoute>
              <TourPackageDetails />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute requiredRole="USER">
              <Wishlist />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
  );
}

export default App;