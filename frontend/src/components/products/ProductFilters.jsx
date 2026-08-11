import { FiSearch } from 'react-icons/fi';

const ProductFilters = ({ filters, onFilterChange, categories }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <select
        value={filters.category || ''}
        onChange={(e) => handleChange('category', e.target.value)}
        className="input-field"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <select
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value)}
        className="input-field"
      >
        <option value="">All Status</option>
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>

      <select
        value={filters.sortBy || 'name'}
        onChange={(e) => handleChange('sortBy', e.target.value)}
        className="input-field"
      >
        <option value="name">Sort by Name</option>
        <option value="sku">Sort by SKU</option>
        <option value="quantity">Sort by Quantity</option>
        <option value="unitPrice">Sort by Price</option>
      </select>
    </div>
  );
};

export default ProductFilters;