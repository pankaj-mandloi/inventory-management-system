import { useState, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';
import toast from 'react-hot-toast';

export const useInventory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const increaseStock = async (data) => {
    try {
      setLoading(true);
      const response = await inventoryService.increaseStock(data);
      toast.success(`Added ${data.quantity} items to stock`);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to increase stock');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reduceStock = async (data) => {
    try {
      setLoading(true);
      const response = await inventoryService.reduceStock(data);
      toast.success(`Removed ${data.quantity} items from stock`);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reduce stock');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (productId, params = {}) => {
    try {
      setLoading(true);
      const response = await inventoryService.getHistory(productId, params);
      return response;
    } catch (error) {
      toast.error('Failed to fetch stock history');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllTransactions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await inventoryService.getAllTransactions(params);
      setTransactions(response.data);
      return response;
    } catch (error) {
      toast.error('Failed to fetch transactions');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
    loading,
    increaseStock,
    reduceStock,
    getHistory,
    getAllTransactions,
  };
};