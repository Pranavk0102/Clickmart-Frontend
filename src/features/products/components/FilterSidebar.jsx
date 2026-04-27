import { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    brands: [],
    discount: null,
    rating: null,
    priceRange: [0, 100000],
  });

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

  const handleBrandToggle = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDiscountChange = (discount) => {
    const newFilters = { ...filters, discount: filters.discount === discount ? null : discount };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...filters, rating: filters.rating === rating ? null : rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const newFilters = { ...filters, priceRange: [0, value] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      brands: [],
      discount: null,
      rating: null,
      priceRange: [0, 100000],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = filters.brands.length > 0 || filters.discount || filters.rating || filters.priceRange[1] < 100000;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="filter-section">
          <h4>Brand</h4>
          <div className="filter-options">
            {brands.map(brand => (
              <label key={brand} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Discount Filter */}
      <div className="filter-section">
        <h4>Discount</h4>
        <div className="filter-options">
          {[10, 20, 30, 40, 50].map(discount => (
            <label key={discount} className="filter-radio">
              <input
                type="radio"
                name="discount"
                checked={filters.discount === discount}
                onChange={() => handleDiscountChange(discount)}
              />
              <span>{discount}% or more</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="filter-section">
        <h4>Customer Rating</h4>
        <div className="filter-options">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="filter-radio">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
              />
              <span>
                {rating}â˜… & above
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={filters.priceRange[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
          <div className="price-labels">
            <span>â‚¹0</span>
            <span>â‚¹{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
