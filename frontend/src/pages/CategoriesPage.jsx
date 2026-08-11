import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiTag,
  FiPackage,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Loader } from '../components/common/Loader';
import ConfirmModal from '../components/common/ConfirmModal';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  
  // ✅ State for delete modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: null,
    categoryName: '',
    loading: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(formData);
        toast.success('Category created successfully');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  // ✅ Open delete confirmation modal
  const openDeleteModal = (category) => {
    setDeleteModal({
      isOpen: true,
      categoryId: category._id,
      categoryName: category.name,
      loading: false,
    });
  };

  // ✅ Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      categoryId: null,
      categoryName: '',
      loading: false,
    });
  };

  // ✅ Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      await categoryService.delete(deleteModal.categoryId);
      toast.success(`Category "${deleteModal.categoryName}" deleted successfully`);
      closeDeleteModal();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage your product categories</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.length === 0 ? (
            <div className="col-span-full">
              <div className="card text-center py-12">
                <FiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Categories Yet</h3>
                <p className="text-gray-500 mt-2">Create your first category to organize products</p>
                <button onClick={() => handleOpenModal()} className="btn-primary mt-4">
                  Create Category
                </button>
              </div>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="card hover:shadow-lg transition-all duration-200">
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
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
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
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Create Category'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="input-label">Category Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`input-field ${errors.name ? 'input-error' : ''}`}
                      placeholder="e.g., Electronics"
                    />
                    {errors.name && (
                      <p className="input-helper input-helper-error">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="input-label">Description (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Brief description of the category"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn-primary flex-1">
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.categoryName}"? This action cannot be undone.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        variant="danger"
        loading={deleteModal.loading}
      />
    </>
  );
};

export default CategoriesPage;