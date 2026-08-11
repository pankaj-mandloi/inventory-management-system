import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { 
  FiPlus, 
  FiMinus, 
  FiClock, 
  FiPackage,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Loader } from '../components/common/Loader';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockAction, setStockAction] = useState('increase'); // 'increase' or 'decrease'
  const [formData, setFormData] = useState({
    quantity: 1,
    note: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll({ limit: 100 });
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await inventoryService.getAllTransactions({ limit: 50 });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product, action) => {
    setSelectedProduct(product);
    setStockAction(action);
    setFormData({ quantity: 1, note: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData({ quantity: 1, note: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (stockAction === 'decrease' && selectedProduct && formData.quantity > selectedProduct.quantity) {
      newErrors.quantity = `Cannot reduce more than current stock (${selectedProduct.quantity})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = {
        productId: selectedProduct._id,
        quantity: parseInt(formData.quantity),
        note: formData.note || '',
      };

      if (stockAction === 'increase') {
        await inventoryService.increaseStock(data);
        toast.success(`Added ${formData.quantity} items to ${selectedProduct.name}`);
      } else {
        await inventoryService.reduceStock(data);
        toast.success(`Removed ${formData.quantity} items from ${selectedProduct.name}`);
      }

      handleCloseModal();
      fetchProducts();
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600 mt-1">Manage your inventory stock levels</p>
        </div>
        <button onClick={() => fetchProducts()} className="btn-secondary flex items-center gap-2">
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full">
            <div className="card text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Products Found</h3>
              <p className="text-gray-500 mt-2">Add products to start managing inventory</p>
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="card hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                </div>
                <span className={`badge ${getStatusBadge(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{product.quantity}</p>
                <p className="text-xs text-gray-500">Current Stock</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleOpenModal(product, 'increase')}
                  className="flex-1 btn-success text-sm py-2 flex items-center justify-center gap-1"
                >
                  <FiPlus className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => handleOpenModal(product, 'decrease')}
                  disabled={product.quantity === 0}
                  className="flex-1 btn-danger text-sm py-2 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiClock className="w-5 h-5 text-primary-600" />
          Recent Transactions
        </h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {transaction.product?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getActionBadge(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{transaction.quantity}</td>
                    <td className="px-4 py-3 text-sm">{transaction.previousQuantity}</td>
                    <td className="px-4 py-3 text-sm font-medium">{transaction.newQuantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{transaction.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {stockAction === 'increase' ? 'Add Stock' : 'Remove Stock'}
              </h2>
              <p className="text-gray-600 mb-4">
                {selectedProduct.name} (Current: {selectedProduct.quantity})
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 });
                      if (errors.quantity) setErrors({ ...errors, quantity: '' });
                    }}
                    className={`input-field ${errors.quantity ? 'input-error' : ''}`}
                    min="1"
                  />
                  {errors.quantity && (
                    <p className="input-helper input-helper-error">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="input-label">Note (Optional)</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="input-field"
                    placeholder="Add a note for this transaction..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className={`flex-1 ${stockAction === 'increase' ? 'btn-success' : 'btn-danger'}`}>
                    {stockAction === 'increase' ? 'Add Stock' : 'Remove Stock'}
                  </button>
                  <button type="button" onClick={handleCloseModal} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;