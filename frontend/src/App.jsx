import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public & User Pages
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import ManageUsers from './admin/ManageUsers';
import ManageRestaurants from './admin/ManageRestaurants';
import ManageFoods from './admin/ManageFoods';
import ManageOrders from './admin/ManageOrders';
import ManageCoupons from './admin/ManageCoupons';

// Restaurant Owner Pages
import OwnerDashboard from './owner/OwnerDashboard';
import ManageMenu from './owner/ManageMenu';
import OwnerOrders from './owner/OwnerOrders';
import RestaurantSettings from './owner/RestaurantSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: {
                    primary: '#f97316',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Navbar />

            <main className="flex-grow">
              <Routes>
                {/* Public & Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurants/:id" element={<RestaurantDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <ManageUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/restaurants"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <ManageRestaurants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/foods"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <ManageFoods />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <ManageOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/coupons"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <ManageCoupons />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Restaurant Owner Routes */}
                <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
                <Route
                  path="/owner/dashboard"
                  element={
                    <ProtectedRoute roles={['restaurantOwner', 'admin']}>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/menu"
                  element={
                    <ProtectedRoute roles={['restaurantOwner', 'admin']}>
                      <ManageMenu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/orders"
                  element={
                    <ProtectedRoute roles={['restaurantOwner', 'admin']}>
                      <OwnerOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/settings"
                  element={
                    <ProtectedRoute roles={['restaurantOwner', 'admin']}>
                      <RestaurantSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
