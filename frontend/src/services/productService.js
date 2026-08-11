import api from './api';

export const productService = {
  getAll: async (params = {}) => {
    try {
      console.log('📦 ProductService.getAll called with params:', params);
      const response = await api.get('/products', { params });
      console.log('✅ ProductService.getAll response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ProductService.getAll error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log('🔍 Getting product by ID:', id);
      const response = await api.get(`/products/${id}`);
      console.log('✅ Product fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ProductService.getById error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch (error) {
      console.error('❌ ProductService.create error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log('📝 Updating product:', id, data);
      const response = await api.put(`/products/${id}`, data);
      console.log('✅ Product updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ProductService.update error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ ProductService.delete error:', error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get('/products/stats/dashboard');
      return response.data;
    } catch (error) {
      console.error('❌ ProductService.getDashboardStats error:', error);
      throw error;
    }
  },
};