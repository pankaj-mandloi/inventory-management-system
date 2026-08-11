import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (data) => {
    try {
      const response = await categoryService.create(data);
      toast.success('Category created successfully');
      await fetchCategories();
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
      throw error;
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const response = await categoryService.update(id, data);
      toast.success('Category updated successfully');
      await fetchCategories();
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.delete(id);
      toast.success('Category deleted successfully');
      await fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      throw error;
    }
  };

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};