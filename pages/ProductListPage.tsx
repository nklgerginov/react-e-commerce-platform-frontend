import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Product } from '../types';
import { useCart, useSearch } from '../contexts/AppContext';
import { View } from '../App';
import Spinner from '../components/Spinner';

interface ProductListPageProps {
  navigateTo: (view: View) => void;
}

const ProductCard: React.FC<{ product: Product, onAddToCart: (product: Product) => void, onViewProduct: (product: Product) => void }> = ({ product, onAddToCart, onViewProduct }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group">
    <div className="relative">
      <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
       <div 
        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={() => onViewProduct(product)}
      >
        <span className="text-white text-lg font-semibold border-2 border-white rounded-full px-4 py-2">View Details</span>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 truncate">{product.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{product.description.substring(0, 70)}...</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">€{product.price.toFixed(2)}</span>
        <button 
          onClick={() => onAddToCart(product)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

const ProductListPage: React.FC<ProductListPageProps> = ({ navigateTo }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await api.fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };
  
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">Our Products</h1>
      
      {searchQuery && (
        <div className="text-center mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-lg">
                Showing results for: <strong className="text-indigo-600 dark:text-indigo-400">"{searchQuery}"</strong>
            </p>
            <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
                Clear Search
            </button>
        </div>
      )}

      {notification && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onViewProduct={(p) => navigateTo({ name: 'product', product: p })}
            />
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Products Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                We couldn't find any products matching your search. Try a different term!
            </p>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
