import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { FiClock } from 'react-icons/fi';
import Card from '../common/Card';
import { Loader } from '../common/Loader';

const StockHistory = ({ productId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [productId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getHistory(productId);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (type) => {
    return type === 'INCREASE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) return <Loader />;

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No stock history available</p>
      </div>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiClock className="w-5 h-5 text-primary-600" />
        Stock History
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((entry) => (
              <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`badge ${getActionBadge(entry.type)}`}>
                    {entry.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">{entry.quantity}</td>
                <td className="px-4 py-3 text-sm">{entry.previousQuantity}</td>
                <td className="px-4 py-3 text-sm font-medium">{entry.newQuantity}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{entry.user?.name || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StockHistory;