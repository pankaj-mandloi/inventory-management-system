import React from 'react';
import { FiClock, FiPackage, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import Card from '../common/Card';

const RecentActivity = ({ transactions = [], loading = false, className = '' }) => {
  const getActivityIcon = (type) => {
    if (type === 'INCREASE') {
      return <FiTrendingUp className="w-4 h-4 text-green-500" />;
    }
    if (type === 'DECREASE') {
      return <FiTrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <FiPackage className="w-4 h-4 text-blue-500" />;
  };

  const getActivityColor = (type) => {
    if (type === 'INCREASE') return 'bg-green-50';
    if (type === 'DECREASE') return 'bg-red-50';
    return 'bg-blue-50';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card className={className}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiClock className="w-5 h-5 text-primary-600" />
        Recent Activity
      </h2>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction._id} 
              className={`flex items-center gap-3 p-3 rounded-lg ${getActivityColor(transaction.type)} transition-colors`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                {getActivityIcon(transaction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.product?.name || 'Unknown Product'}
                  </p>
                  <span className="text-xs font-medium text-gray-500">
                    {transaction.quantity} units
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-gray-500">
                    {transaction.type === 'INCREASE' ? 'Added' : 'Removed'} by {transaction.user?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTime(transaction.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;