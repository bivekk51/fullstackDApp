import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, Heart, Share, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">CharityChain</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-6">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                  <Link 
                    to="/donations" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Donations</span>
                  </Link>
                  <Link 
                    to="/distributions" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Share className="w-4 h-4" />
                    <span className="text-sm font-medium">Distributions</span>
                  </Link>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  {user.role === 'donor' && (
                    <Link 
                      to="/create-donation" 
                      className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Donate</span>
                    </Link>
                  )}
                  
                  {user.role === 'ngo' && (
                    <Link 
                      to="/create-distribution" 
                      className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Distribute</span>
                    </Link>
                  )}

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm font-medium">{user.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
