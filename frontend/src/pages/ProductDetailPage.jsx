import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiTrash2, 
  FiPackage,
  FiTag,
  FiBox,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Loader } from '../components/common/Loader';
import ConfirmModal from '../components/common/ConfirmModal';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ State for delete modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    loading: false,
  });

  useEffect(() => {
    fetchProduct();
    fetchHistory();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id);
      setProduct(response.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await inventoryService.getHistory(id);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open delete confirmation modal
  const openDeleteModal = () => {
    setDeleteModal({
      isOpen: true,
      loading: false,
    });
  };

  // ✅ Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      loading: false,
    });
  };

  // ✅ Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      await productService.delete(id);
      toast.success(`Product "${product?.name}" deleted successfully`);
      closeDeleteModal();
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'In Stock': 'badge-success',
      'Low Stock': 'badge-warning',
      'Out of Stock': 'badge-danger',
    };
    return badges[status] || 'badge-info';
  };

  const getActionBadge = (type) => {
    return type === 'INCREASE' ? 'badge-success' : 'badge-danger';
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
          <FiArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Product Header */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <FiPackage className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-sm font-mono text-gray-500">{product.sku}</span>
                  <span className={`badge ${getStatusBadge(product.status)}`}>{product.status}</span>
                  <span className="badge badge-info">{product.category?.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/products/${id}/edit`} className="btn-secondary flex items-center gap-2">
                <FiEdit className="w-4 h-4" />
                Edit
              </Link>
              {/* ✅ Updated: Use custom modal instead of window.confirm */}
              <button onClick={openDeleteModal} className="btn-danger flex items-center gap-2">
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="stat-icon stat-icon-primary">
                <FiBox className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-xl font-bold text-gray-900">{product.quantity}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="stat-icon stat-icon-success">
                <FiDollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit Price</p>
                <p className="text-xl font-bold text-gray-900">${product.unitPrice?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="stat-icon stat-icon-warning">
                <FiUser className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="text-xl font-bold text-gray-900">{product.supplier || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="stat-icon stat-icon-info">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Added</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        )}

        {/* Stock History */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiClock className="w-5 h-5 text-primary-600" />
            Stock History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No stock history available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {history.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`badge ${getActionBadge(entry.type)}`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{entry.quantity}</td>
                      <td className="px-4 py-3 text-sm">{entry.previousQuantity}</td>
                      <td className="px-4 py-3 text-sm font-medium">{entry.newQuantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.user?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        loading={deleteModal.loading}
      />
    </>
  );
};

export default ProductDetailPage;