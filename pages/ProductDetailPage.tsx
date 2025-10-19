
import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/AppContext';
import { View } from '../App';

interface ProductDetailPageProps {
  product: Product;
  navigateTo: (view: View) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, navigateTo }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<string>('');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setNotification(`${quantity} x ${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
      {notification && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div>
          <button onClick={() => navigateTo({ name: 'home' })} className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4">&larr; Back to products</button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{product.category}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">€{product.price.toFixed(2)}</span>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg font-bold">-</button>
              <input type="number" value={quantity} readOnly className="w-16 text-center bg-transparent border-l border-r border-gray-300 dark:border-gray-600 focus:outline-none" />
              <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))} className="px-4 py-2 text-lg font-bold">+</button>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="flex-grow bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
