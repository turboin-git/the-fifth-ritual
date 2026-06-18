import ForgotPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ClientDashboard from './pages/client/Dashboard';
import ArtistDashboard from './pages/artist/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import Catalog from './pages/public/Catalog';
import UploadGallery from './pages/artist/UploadGallery';
import SmartBooking from './pages/client/SmartBooking';
import SelectArtist from './pages/client/SelectArtist';
import AdminLogin from './pages/auth/AdminLogin';
import AfterCare from './pages/client/AfterCare';
import ConsentForm from './pages/client/ConsentForm';
import Gallery from './pages/client/Gallery';
import PaymentCallback from './pages/client/PaymentCallback';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="CLIENT">
          <ClientDashboard />
        </ProtectedRoute>
      } />

      <Route path="/booking" element={
        <ProtectedRoute allowedRole="CLIENT">
          <SmartBooking />
        </ProtectedRoute>
      } />

      <Route path="/artist" element={
        <ProtectedRoute allowedRole="ARTIST">
          <ArtistDashboard />
        </ProtectedRoute>
      } />

      <Route path="/artist/gallery" element={
        <ProtectedRoute allowedRole="ARTIST">
          <UploadGallery />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/select-artist" element={
        <ProtectedRoute allowedRole="CLIENT">
          <SelectArtist />
        </ProtectedRoute>
      } />

      <Route path="/consent-form" element={
        <ProtectedRoute allowedRole="CLIENT">
          <ConsentForm />
        </ProtectedRoute>
      } />

      <Route path="/gallery" element={
  <ProtectedRoute allowedRole="CLIENT">
    <Gallery />
  </ProtectedRoute>
} />

      <Route path="/payment/callback" element={
  <ProtectedRoute allowedRole="CLIENT">
    <PaymentCallback />
  </ProtectedRoute>
} />

      <Route path="/care" element={
        <ProtectedRoute allowedRole="CLIENT">
          <AfterCare />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}