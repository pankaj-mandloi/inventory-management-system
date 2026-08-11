import { FiTag, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';
import Card from '../common/Card';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiTag className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-xs text-gray-500">
              {category.products?.length || 0} products
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {category.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {category.description}
        </p>
      )}

      {category.products?.length > 0 && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
          <FiPackage className="w-3 h-3" />
          <span>{category.products.length} products in this category</span>
        </div>
      )}
    </Card>
  );
};

export default CategoryCard;