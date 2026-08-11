import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from './Loader';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader fullScreen />
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    console.log('🔒 No user found - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the route
  console.log('✅ User authenticated - Rendering route');
  return <Outlet />;
};

export default PrivateRoute;