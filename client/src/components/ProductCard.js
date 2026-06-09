import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiHeart } from 'react-icons/fi';
import { formatPrice, getDiscountPercent } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const discount = getDiscountPercent(product.price, product.comparePrice);

  return (
    <div className="card group">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          {product.ratingsCount > 0 && (
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={14} className={i < Math.round(product.ratingsAverage) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.ratingsCount})</span>
            </div>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
            {product.comparePrice > 0 && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
