import { Link } from 'react-router-dom';
import { FiPackage, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, onDelete }) => {
  const getStatusBadge = (status) => {
    const badges = {
      'In Stock': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-yellow-100 text-yellow-800',
      'Out of Stock': 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
            <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
          </div>
        </div>
        <span className={`badge ${getStatusBadge(product.status)}`}>
          {product.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-gray-500">Quantity</p>
          <p className="font-medium text-gray-900">{product.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Price</p>
          <p className="font-medium text-gray-900">${product.unitPrice?.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-500">Category</p>
        <p className="text-sm text-gray-700">{product.category?.name || 'N/A'}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/products/${product._id}`}
          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
        >
          <FiEye className="w-4 h-4" />
          View
        </Link>
        <Link
          to={`/products/${product._id}/edit`}
          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
        >
          <FiEdit className="w-4 h-4" />
          Edit
        </Link>
        <button
          onClick={() => onDelete(product._id)}
          className="btn-danger text-sm py-2 px-3 flex items-center justify-center"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

export default ProductCard;