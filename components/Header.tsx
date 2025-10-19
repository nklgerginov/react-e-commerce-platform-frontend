
import React from 'react';
import { useAuth } from '../contexts/AppContext';
import { useCart } from '../contexts/AppContext';
import { View } from '../App';
import { ShoppingCartIcon, UserCircleIcon, ArrowRightOnRectangleIcon, ClipboardDocumentListIcon } from './icons';

interface HeaderProps {
  navigateTo: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
          onClick={() => navigateTo({ name: 'home' })}
        >
          NGCommerce
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigateTo({ name: 'orders' })}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="My Orders"
              >
                <ClipboardDocumentListIcon className="w-6 h-6" />
                <span className="hidden md:inline ml-2">Orders</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                 <span className="hidden md:inline ml-2">Logout</span>
              </button>
               <span className="hidden lg:inline text-gray-700 dark:text-gray-300">|</span>
               <span className="hidden lg:flex items-center text-gray-600 dark:text-gray-300">
                <UserCircleIcon className="w-6 h-6 mr-2" />
                {user?.name}
              </span>
            </>
          ) : (
            <button
              onClick={() => navigateTo({ name: 'login' })}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <UserCircleIcon className="w-6 h-6" />
              <span className="hidden md:inline ml-2">Login</span>
            </button>
          )}

          <button
            onClick={() => navigateTo({ name: 'cart' })}
            className="relative flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
             <span className="hidden md:inline ml-2">Cart</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
