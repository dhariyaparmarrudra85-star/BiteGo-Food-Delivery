import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    try {
      setCartLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.cart);
    } catch {
      // silently fail
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    try {
      const res = await api.post('/cart', { foodId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart!');
    } catch (error) {
      const { conflict, message } = error.response?.data || {};
      if (conflict) {
        if (window.confirm(`${message}\n\nClear cart and add new item?`)) {
          await clearCart();
          await addToCart(foodId, quantity);
        }
      } else {
        toast.error(message || 'Failed to add item');
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      setCart(res.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart(null);
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/cart/coupon', { code });
      toast.success(res.data.message);
      await fetchCart();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      return null;
    }
  };

  // Computed values
  const cartItems = cart?.items || [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart?.restaurant?.deliveryFee || 0;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const discount = cart?.discount || 0;
  const total = parseFloat((subtotal + deliveryFee + tax - discount).toFixed(2));

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      cartCount,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      cartLoading,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
};
