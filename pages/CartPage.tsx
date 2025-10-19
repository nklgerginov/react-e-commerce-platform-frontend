
import React, { useState } from 'react';
import { useCart } from '../contexts/AppContext';
import { useAuth } from '../contexts/AppContext';
import { TrashIcon } from '../components/icons';
import { View } from '../App';
import api from '../services/api';
import Spinner from '../components/Spinner';

interface CartPageProps {
  navigateTo: (view: View) => void;
}

const CartPage: React.FC<CartPageProps> = ({ navigateTo }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigateTo({ name: 'login' });
      return;
    }
    setIsCheckingOut(true);
    setError(null);
    try {
      if (!token) throw new Error("Authentication token is missing.");
      await api.createCheckoutSession(cart, token);
      // In a real app, we would redirect to Stripe here.
      // For this mock, we'll clear the cart and navigate to orders.
      alert('Mock Checkout Successful! Your order has been placed.');
      clearCart();
      navigateTo({ name: 'orders' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigateTo({ name: 'home' })}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shopping Cart ({cartCount} items)</h1>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {cart.map(item => (
          <div key={item.id} className="flex items-center py-4 flex-wrap">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">€{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg font-bold">-</button>
                <input type="number" value={item.quantity} readOnly className="w-12 text-center bg-transparent focus:outline-none" />
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg font-bold">+</button>
              </div>
              <p className="text-lg font-semibold w-24 text-right">€{(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-end items-center">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 ml-4">€{cartTotal.toFixed(2)}</span>
        </div>
        {error && <p className="text-red-500 text-right mt-2">{error}</p>}
        <div className="flex justify-end mt-6">
          <button 
            onClick={handleCheckout} 
            disabled={isCheckingOut}
            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-400"
          >
            {isCheckingOut ? <Spinner size="h-6 w-6" color="text-white"/> : (isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
