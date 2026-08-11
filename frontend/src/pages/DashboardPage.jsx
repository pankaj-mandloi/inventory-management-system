import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { 
  FiPackage, 
  FiTag, 
  FiBox, 
  FiAlertTriangle, 
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Loader } from '../components/common/Loader';
import { StatsCard, QuickActions, RecentActivity, StatusCard } from '../components/dashboard';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching dashboard data...');
      
      // Fetch stats
      try {
        const statsResponse = await productService.getDashboardStats();
        console.log('✅ Stats fetched:', statsResponse.data);
        setStats(statsResponse.data);
      } catch (statsError) {
        console.error('❌ Stats error:', statsError);
        // Don't fail the whole page for stats error
        toast.error('Failed to load stats');
      }
      
      // Fetch recent transactions
      try {
        const txResponse = await inventoryService.getAllTransactions({ limit: 5 });
        console.log('✅ Transactions fetched:', txResponse.data);
        setTransactions(txResponse.data || []);
      } catch (txError) {
        console.error('❌ Transactions error:', txError);
        // Don't fail the whole page for transactions error
      }
      
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary flex items-center gap-2">
            <FiRefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}! 🌿
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your inventory overview
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/products/new" className="btn-primary flex items-center gap-2">
            <FiPackage className="w-4 h-4" />
            Add Product
          </Link>
          <button onClick={fetchDashboardData} className="btn-secondary flex items-center gap-2">
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={FiPackage}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Total Categories"
          value={stats?.totalCategories || 0}
          icon={FiTag}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="Total Stock"
          value={stats?.totalStock || 0}
          icon={FiBox}
          color="green"
          trend={5}
          loading={loading}
        />
        <StatsCard
          title="Low Stock Items"
          value={stats?.lowStock || 0}
          icon={FiAlertTriangle}
          color="yellow"
          trend={-2}
          loading={loading}
        />
        <StatsCard
          title="Out of Stock"
          value={stats?.outOfStock || 0}
          icon={FiXCircle}
          color="red"
          trend={-8}
          loading={loading}
        />
      </div>

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions className="lg:col-span-1" />
        <StatusCard className="lg:col-span-1" />
        <RecentActivity 
          transactions={transactions} 
          loading={loading}
          className="lg:col-span-1"
        />
      </div>
    </div>
  );
};

export default DashboardPage;