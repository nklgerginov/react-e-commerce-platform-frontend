import React from 'react';
import { Product } from '../types';

interface FeaturedProductCardProps {
  product: Product;
  onViewProduct: () => void;
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product, onViewProduct }) => {
  return (
    <div 
      onClick={onViewProduct}
      className="relative w-full h-full flex-shrink-0 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
      role="group"
      aria-label={product.name}
    >
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <p className="text-gray-200 text-sm font-medium uppercase tracking-wider">{product.category}</p>
        <h3 className="text-white text-2xl font-bold mt-1">{product.name}</h3>
      </div>
    </div>
  );
};

export default FeaturedProductCard;