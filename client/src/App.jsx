import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// User pages
import Dashboard from './pages/Dashboard';
import Compose from './pages/Compose';
import SentMail from './pages/SentMail';
import MailDetail from './pages/MailDetail';
import Profile from './pages/Profile';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminEmails from './pages/AdminEmails';

const App = () => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Protected user routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/compose" element={<ProtectedRoute><Compose /></ProtectedRoute>} />
        <Route path="/sent-mails" element={<ProtectedRoute><SentMail /></ProtectedRoute>} />
        <Route path="/mail/:id" element={<ProtectedRoute><MailDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/emails" element={<ProtectedRoute adminOnly><AdminEmails /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
