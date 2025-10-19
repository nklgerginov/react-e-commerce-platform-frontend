import React, { useState, FormEvent } from 'react';
import { useAuth, useCart, useSearch } from '../contexts/AppContext';
import { View } from '../App';
import { ShoppingCartIcon, UserCircleIcon, ArrowRightOnRectangleIcon, ClipboardDocumentListIcon, SearchIcon } from './icons';

interface HeaderProps {
  navigateTo: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    navigateTo({ name: 'home' });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <div 
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer whitespace-nowrap"
          onClick={() => navigateTo({ name: 'home' })}
        >
          NGCommerce
        </div>

        <div className="flex-grow max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
                <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-4 pr-10 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button type="submit" className="absolute right-0 top-0 mt-2 mr-3" aria-label="Search">
                    <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
            </form>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
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