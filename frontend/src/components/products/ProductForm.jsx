import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { Loader } from '../common/Loader';
import { FiPackage, FiTag, FiDollarSign, FiUser, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    supplier: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('🔍 ProductForm mounted with id:', id);
    fetchCategories();
    
    // Check if we're editing (has ID parameter and not 'new')
    if (id && id !== 'new') {
      console.log('✏️ Edit mode - fetching product:', id);
      setIsEdit(true);
      fetchProduct(id);
    } else {
      console.log('➕ Create mode - new product');
      setIsEdit(false);
      // Generate SKU for new product
      generateSKU();
    }
  }, [id]);

  const generateSKU = () => {
    const prefix = 'PRD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setFormData(prev => ({
      ...prev,
      sku: `${prefix}-${timestamp}-${random}`
    }));
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProduct = async (productId) => {
    try {
      setFetching(true);
      console.log('📦 Fetching product:', productId);
      const response = await productService.getById(productId);
      const product = response.data;
      console.log('✅ Product fetched:', product);
      
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category?._id || product.category || '',
        description: product.description || '',
        quantity: product.quantity || 0,
        unitPrice: product.unitPrice || 0,
        supplier: product.supplier || '',
      });
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setFetching(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    else if (!/^[A-Z0-9-]+$/.test(formData.sku.toUpperCase())) {
      newErrors.sku = 'SKU must contain only uppercase letters, numbers, and hyphens';
    }
    
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.unitPrice < 0) {
      newErrors.unitPrice = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        sku: formData.sku.toUpperCase(),
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
      };

      if (isEdit) {
        console.log('📝 Updating product:', id, data);
        await productService.update(id, data);
        toast.success('Product updated successfully');
      } else {
        console.log('📝 Creating product:', data);
        await productService.create(data);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEdit ? 'Update product information' : 'Create a new product'}
        </p>
        {isEdit && (
          <p className="text-sm text-primary-600 mt-1">
            Editing product ID: {id}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="input-helper input-helper-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="input-label">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`input-field ${errors.sku ? 'input-error' : ''}`}
              placeholder="PRD-2024-001"
            />
            {errors.sku && (
              <p className="input-helper input-helper-error">{errors.sku}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Use uppercase letters, numbers, and hyphens only
            </p>
          </div>
        </div>

        <div>
          <label className="input-label">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input-field ${errors.category ? 'input-error' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="input-helper input-helper-error">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="input-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field resize-none"
            rows="3"
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`input-field ${errors.quantity ? 'input-error' : ''}`}
              placeholder="0"
              min="0"
            />
            {errors.quantity && (
              <p className="input-helper input-helper-error">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="input-label">Unit Price *</label>
            <input
              type="number"
              name="unitPrice"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              className={`input-field ${errors.unitPrice ? 'input-error' : ''}`}
              placeholder="0.00"
              min="0"
            />
            {errors.unitPrice && (
              <p className="input-helper input-helper-error">{errors.unitPrice}</p>
            )}
          </div>
        </div>

        <div>
          <label className="input-label">Supplier Name</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter supplier name"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;