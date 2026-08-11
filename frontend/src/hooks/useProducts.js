import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data) => {
    try {
      const response = await productService.create(data);
      toast.success('Product created successfully');
      await fetchProducts();
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
      throw error;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await productService.update(id, data);
      toast.success('Product updated successfully');
      await fetchProducts();
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  };

  const changePage = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const changeFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 });
  };

  return {
    products,
    loading,
    pagination,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    changePage,
    changeFilters,
    setFilters,
  };
};