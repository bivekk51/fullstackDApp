import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Distributions from './pages/Distributions';
import CreateDonation from './pages/CreateDonation';
import CreateDistribution from './pages/CreateDistribution';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
        <Route path="/distributions" element={<ProtectedRoute><Distributions /></ProtectedRoute>} />
        <Route path="/create-donation" element={<ProtectedRoute><CreateDonation /></ProtectedRoute>} />
        <Route path="/create-distribution" element={<ProtectedRoute><CreateDistribution /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
