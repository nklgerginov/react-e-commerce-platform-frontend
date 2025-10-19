
import React, { useState, useCallback } from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import { Product } from './types';

export type View =
  | { name: 'home' }
  | { name: 'product'; product: Product }
  | { name: 'cart' }
  | { name: 'orders' }
  | { name: 'login' };


const App: React.FC = () => {
  const [view, setView] = useState<View>({ name: 'home' });

  const navigateTo = useCallback((newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
  }, []);

  const renderView = () => {
    switch (view.name) {
      case 'home':
        return <ProductListPage navigateTo={navigateTo} />;
      case 'product':
        return <ProductDetailPage product={view.product} navigateTo={navigateTo} />;
      case 'cart':
        return <CartPage navigateTo={navigateTo} />;
      case 'orders':
        return <OrdersPage />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      default:
        return <ProductListPage navigateTo={navigateTo} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        <Header navigateTo={navigateTo} />
        <main className="container mx-auto px-4 py-8">
          {renderView()}
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
            <div className="container mx-auto py-6 px-4 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} NGCommerce . All rights reserved.</p>
                <p className="text-sm mt-1">A Frontend Demo by a Nikolay Gerginov</p>
            </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
