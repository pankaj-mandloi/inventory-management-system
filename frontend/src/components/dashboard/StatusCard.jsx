import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import Card from '../common/Card';

const StatusCard = ({ className = '' }) => {
  const statuses = [
    {
      label: 'System Status',
      value: 'Operational',
      icon: FiCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      label: 'API Connection',
      value: 'Connected',
      icon: FiCheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Last Updated',
      value: new Date().toLocaleTimeString(),
      icon: FiAlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
  ];

  return (
    <Card className={className}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
      <div className="space-y-3">
        {statuses.map((status, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 ${status.bgColor} rounded-lg transition-colors`}
          >
            <div className="flex items-center gap-3">
              <status.icon className={`w-5 h-5 ${status.color}`} />
              <span className="text-sm text-gray-600">{status.label}</span>
            </div>
            <span className={`badge ${status.badgeColor}`}>
              {status.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatusCard;