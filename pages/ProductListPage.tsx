import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import api from '../services/api';
import { Product } from '../types';
import { useCart, useSearch } from '../contexts/AppContext';
import { View } from '../App';
import Spinner from '../components/Spinner';
import PaginationControls from '../components/PaginationControls';
import FeaturedProductCard from '../components/FeaturedProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/icons';


const ITEMS_PER_PAGE = 6;

interface ProductListPageProps {
  navigateTo: (view: View) => void;
}

const ProductCard: React.FC<{ product: Product, onAddToCart: (product: Product) => void, onViewProduct: (product: Product) => void }> = ({ product, onAddToCart, onViewProduct }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group flex flex-col">
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
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

const ProductListPage: React.FC<ProductListPageProps> = ({ navigateTo }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [notification, setNotification] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch state for the carousel
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsData, featuredData] = await Promise.all([
            api.fetchProducts(),
            api.fetchFeaturedProducts()
        ]);
        setProducts(productsData);
        setFeaturedProducts(featuredData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
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
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredProducts]);

  // Carousel Logic
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
  }, [featuredProducts.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? featuredProducts.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) {
      // Swiped left
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -75) {
      // Swiped right
      prevSlide();
    }
  };
  
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const slideInterval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
      return () => clearInterval(slideInterval);
    }
  }, [featuredProducts.length, nextSlide]);


  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      {/* Featured Products Carousel */}
      {!loading && featuredProducts.length > 0 && (
         <section className="mb-16 relative group">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Featured Products</h2>
            <div className="overflow-hidden relative h-96" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div 
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map(product => (
                    <FeaturedProductCard 
                      key={product.id}
                      product={product}
                      onViewProduct={() => navigateTo({ name: 'product', product })}
                    />
                ))}
              </div>
            </div>
            {/* Slider Controls */}
            <button onClick={prevSlide} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 z-10" aria-label="Previous slide">
                <ChevronLeftIcon className="h-6 w-6"/>
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 z-10" aria-label="Next slide">
                <ChevronRightIcon className="h-6 w-6"/>
            </button>
            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {featuredProducts.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50 hover:bg-white'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
      )}
      
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

      {loading ? <Spinner /> : filteredProducts.length > 0 ? (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onViewProduct={(p) => navigateTo({ name: 'product', product: p })}
                />
                ))}
            </div>
            {totalPages > 1 && (
                <PaginationControls 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
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