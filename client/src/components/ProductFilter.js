import React from 'react';
import { FiX } from 'react-icons/fi';
import { categories, sortOptions } from '../utils/helpers';

const ProductFilter = ({ filters, setFilters, onClose }) => {
  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: null },
  ];

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category: filters.category === category ? '' : category, page: 1 });
  };

  const handlePriceChange = (min, max) => {
    setFilters({ ...filters, minPrice: min || '', maxPrice: max || '', page: 1 });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value, page: 1 });
  };

  const handleRatingChange = (rating) => {
    setFilters({ ...filters, minRating: filters.minRating === rating ? '' : rating, page: 1 });
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', minRating: '', sort: '-createdAt', search: '', page: 1 });
  };

  const hasFilters = filters.category || filters.minPrice || filters.maxRating || filters.minRating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={onClose} className="lg:hidden p-1"><FiX size={20} /></button>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">Clear all filters</button>
      )}

      <div>
        <h4 className="font-medium mb-2">Sort By</h4>
        <select value={filters.sort || '-createdAt'} onChange={handleSortChange} className="input-field text-sm">
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="font-medium mb-2">Categories</h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => handleCategoryChange(cat.name)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat.name ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="space-y-1">
          {priceRanges.map((range) => (
            <button key={range.label} onClick={() => handlePriceChange(range.min, range.max)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${Number(filters.minPrice) === range.min ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Rating</h4>
        {[4, 3, 2, 1].map((rating) => (
          <button key={rating} onClick={() => handleRatingChange(rating)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${Number(filters.minRating) === rating ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            {rating}+ Stars
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
