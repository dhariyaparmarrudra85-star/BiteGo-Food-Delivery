import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, Menu, X, ChefHat, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin, isOwner } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-dark-900">
              Bite<span className="text-primary-500">Go</span>
            </span>
          </Link>

          {/* Location (desktop) */}
          <button className="hidden md:flex items-center gap-1.5 text-sm text-dark-600 hover:text-primary-500 transition-colors ml-6">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="font-medium">Ahmedabad</span>
            <span className="text-gray-400">▾</span>
          </button>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                className="input-field pl-10 py-2.5 text-sm"
                onFocus={() => navigate('/search')}
                readOnly
              />
            </div>
          </div>

          {/* Right nav (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-dark-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-primary-600 font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-dark-700">{user.name?.split(' ')[0]}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 hover:bg-gray-50">
                      <ShoppingCart className="w-4 h-4" /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 font-medium">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    {isOwner && (
                      <Link to="/owner" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 font-medium">
                        <ChefHat className="w-4 h-4" /> Restaurant Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-dark-600 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="input-field pl-10 py-2.5 text-sm"
              onFocus={() => { navigate('/search'); setMobileOpen(false); }}
              readOnly
            />
          </div>
          <Link to="/restaurants" onClick={() => setMobileOpen(false)} className="block py-2 text-dark-700 font-medium">Restaurants</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-dark-700 font-medium">
            Cart {cartCount > 0 && <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-dark-700">Profile</Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-dark-700">My Orders</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-primary-600 font-medium">Admin</Link>}
              {isOwner && <Link to="/owner" onClick={() => setMobileOpen(false)} className="block py-2 text-primary-600 font-medium">Restaurant</Link>}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-500">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 text-center text-sm py-2">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm py-2">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
