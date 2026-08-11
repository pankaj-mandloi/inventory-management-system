import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiRefreshCw,
  FiPackage,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Loader } from '../components/common/Loader';
import ConfirmModal from '../components/common/ConfirmModal';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  
  // State for delete modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: '',
    loading: false,
  });

  // ✅ Fetch products whenever filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]); // ✅ Add pagination.page as dependency

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching products with params:', {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      const response = await productService.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      console.log('✅ Products fetched:', response);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (product) => {
    setDeleteModal({
      isOpen: true,
      productId: product._id,
      productName: product.name,
      loading: false,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: null,
      productName: '',
      loading: false,
    });
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      await productService.delete(deleteModal.productId);
      toast.success(`Product "${deleteModal.productName}" deleted successfully`);
      closeDeleteModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
    // ✅ Reset to page 1 when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    // ✅ Reset to page 1 when filtering
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // ✅ Fixed: Properly handle page change
  const handlePageChange = (newPage) => {
    console.log('📄 Changing to page:', newPage);
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      // ✅ Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (id) => {
    navigate(`/products/${id}/edit`);
  };

  const handleViewProduct = (id) => {
    navigate(`/products/${id}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'In Stock': 'badge-success',
      'Low Stock': 'badge-warning',
      'Out of Stock': 'badge-danger',
    };
    return badges[status] || 'badge-info';
  };

  // ✅ Generate page numbers for pagination
  const getPageNumbers = () => {
    const { page, pages } = pagination;
    const pageNumbers = [];
    const maxVisible = 5;
    
    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (page >= pages - 2) {
        for (let i = pages - 4; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    return pageNumbers;
  };

  if (loading && products.length === 0) return <Loader fullScreen />;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <button 
            onClick={handleAddProduct} 
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={filters.search}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="name">Sort by Name</option>
              <option value="sku">Sort by SKU</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="unitPrice">Sort by Price</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="table-container">
          <table className="table">
            <thead className="table-head">
              <tr>
                <th className="table-head-cell">Product</th>
                <th className="table-head-cell">SKU</th>
                <th className="table-head-cell">Category</th>
                <th className="table-head-cell">Quantity</th>
                <th className="table-head-cell">Price</th>
                <th className="table-head-cell">Status</th>
                <th className="table-head-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FiPackage className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">No products found</p>
                      <button onClick={handleAddProduct} className="btn-primary text-sm">
                        Add your first product
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="table-row-hover">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell font-mono text-sm">{product.sku}</td>
                    <td className="table-cell">
                      <span className="badge badge-info">{product.category?.name || 'N/A'}</span>
                    </td>
                    <td className="table-cell font-medium">{product.quantity}</td>
                    <td className="table-cell font-medium">${product.unitPrice?.toFixed(2)}</td>
                    <td className="table-cell">
                      <span className={`badge ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewProduct(product._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Product"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination - Fixed */}
        {pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            </p>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pageNum === pagination.page
                        ? 'bg-primary-600 text-white cursor-default'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        loading={deleteModal.loading}
      />
    </>
  );
};

export default ProductsPage;