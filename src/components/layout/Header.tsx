import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Upload, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-indigo-900 font-bold text-xl"
          >
            <Home className="h-6 w-6" />
            <span>RealReview</span>
          </Link>

          {/* Search bar - hide on mobile */}
          <div className="hidden md:block flex-grow max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by location, amenities, etc."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/upload" 
              className="text-gray-700 hover:text-indigo-700 flex items-center space-x-1"
            >
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="text-gray-700 hover:text-red-600 flex items-center space-x-1"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-700"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search - show when menu is closed */}
        {!isMenuOpen && (
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden flex flex-col space-y-4 pb-4">
            <Link 
              to="/upload" 
              className="text-gray-700 hover:text-indigo-700 flex items-center space-x-2 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-indigo-700 flex items-center space-x-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="text-gray-700 hover:text-red-600 flex items-center space-x-2 py-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;