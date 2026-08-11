import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  trend,
  loading = false,
  className = ''
}) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return trendColors.up;
    if (trendValue < 0) return trendColors.down;
    return trendColors.neutral;
  };

  return (
    <div className={`stat-card border-l-4 border-${color}-500 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? (
              <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              value
            )}
          </p>
        </div>
        <div className={`stat-icon ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={getTrendColor(trend)}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
            {Math.abs(trend)}%
          </span>
          <span className="text-gray-500">this month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;