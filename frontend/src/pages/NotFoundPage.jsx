import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { GiGreenhouse } from 'react-icons/gi';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <GiGreenhouse className="w-20 h-20 text-primary-200" />
        </div>
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 mt-6">
          <FiHome className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;