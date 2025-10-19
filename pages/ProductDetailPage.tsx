
import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { useCart } from '../contexts/AppContext';
import { useAuth } from '../contexts/AppContext';
import { View } from '../App';
import api from '../services/api';
import Spinner from '../components/Spinner';
import StarRating from '../components/StarRating';

interface ProductDetailPageProps {
  product: Product;
  navigateTo: (view: View) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, navigateTo }) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated, token } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<string>('');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const fetchedReviews = await api.fetchReviews(product.id);
        setReviews(fetchedReviews);
      } catch (err) {
        setReviewError('Could not load reviews.');
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setNotification(`${quantity} x ${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || newComment.trim() === '') {
        setSubmitReviewError('Please provide a rating and a comment.');
        return;
    }
    if (!token || !user) {
        setSubmitReviewError('You must be logged in to submit a review.');
        return;
    }
    
    setSubmittingReview(true);
    setSubmitReviewError(null);
    try {
        const submittedReview = await api.submitReview(product.id, { rating: newRating, comment: newComment }, token, user);
        setReviews(prevReviews => [submittedReview, ...prevReviews]);
        setNewRating(0);
        setNewComment('');
    } catch (err) {
        setSubmitReviewError(err instanceof Error ? err.message : 'Failed to submit review.');
    } finally {
        setSubmittingReview(false);
    }
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
      
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">Customer Reviews</h2>
        
        {/* Review Submission Form */}
        {isAuthenticated ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
                        <StarRating rating={newRating} onRatingChange={setNewRating} size="h-7 w-7" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Comment</label>
                        <textarea 
                            id="comment" 
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800"
                            placeholder="Share your thoughts on the product..."
                        ></textarea>
                    </div>
                    {submitReviewError && <p className="text-red-500 text-sm mb-4">{submitReviewError}</p>}
                    <button type="submit" disabled={submittingReview} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 flex items-center justify-center">
                        {submittingReview ? <Spinner size="h-5 w-5" color="text-white"/> : 'Submit Review'}
                    </button>
                </form>
            </div>
        ) : (
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-8 text-center">
                <p>You must be <button onClick={() => navigateTo({ name: 'login' })} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">logged in</button> to leave a review.</p>
            </div>
        )}

        {/* Existing Reviews */}
        {loadingReviews ? (
            <Spinner />
        ) : reviewError ? (
            <p className="text-red-500">{reviewError}</p>
        ) : reviews.length > 0 ? (
            <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div className="flex items-center mb-2">
                            <StarRating rating={review.rating} readOnly />
                            <p className="ml-4 font-bold text-gray-800 dark:text-white">{review.userName}</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.comment}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
