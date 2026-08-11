import api from './api';

export const inventoryService = {
  increaseStock: async (data) => {
    try {
      const response = await api.post('/inventory/increase', data);
      return response.data;
    } catch (error) {
      console.error('❌ InventoryService.increaseStock error:', error);
      throw error;
    }
  },

  reduceStock: async (data) => {
    try {
      const response = await api.post('/inventory/reduce', data);
      return response.data;
    } catch (error) {
      console.error('❌ InventoryService.reduceStock error:', error);
      throw error;
    }
  },

  getHistory: async (productId, params = {}) => {
    try {
      const response = await api.get(`/inventory/history/${productId}`, { params });
      return response.data;
    } catch (error) {
      console.error('❌ InventoryService.getHistory error:', error);
      throw error;
    }
  },

  getAllTransactions: async (params = {}) => {
    try {
      const response = await api.get('/inventory/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('❌ InventoryService.getAllTransactions error:', error);
      throw error;
    }
  },
};