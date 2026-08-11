import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiBox, 
  FiTag, 
  FiBarChart2,
  FiPackage,
  FiTrendingUp
} from 'react-icons/fi';
import Card from '../common/Card';

const QuickActions = ({ className = '' }) => {
  const actions = [
    { 
      title: 'Add Product', 
      icon: FiPlus, 
      link: '/products/new', 
      color: 'bg-primary-500 hover:bg-primary-600',
      variant: 'primary'
    },
    { 
      title: 'Update Stock', 
      icon: FiBox, 
      link: '/inventory', 
      color: 'bg-green-500 hover:bg-green-600',
      variant: 'success'
    },
    { 
      title: 'Add Category', 
      icon: FiTag, 
      link: '/categories', 
      color: 'bg-purple-500 hover:bg-purple-600',
      variant: 'secondary'
    },
    { 
      title: 'View Reports', 
      icon: FiBarChart2, 
      link: '/products', 
      color: 'bg-blue-500 hover:bg-blue-600',
      variant: 'info'
    },
  ];

  return (
    <Card className={className}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className={`${action.color} text-white px-4 py-3 rounded-lg 
                       transition-all duration-200 hover:shadow-lg 
                       flex items-center justify-center gap-2 font-medium text-sm`}
          >
            <action.icon className="w-4 h-4" />
            {action.title}
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;