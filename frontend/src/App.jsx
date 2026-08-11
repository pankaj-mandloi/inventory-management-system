import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import InventoryPage from './pages/InventoryPage';
import NotFoundPage from './pages/NotFoundPage';

// ✅ Import ProductForm
import ProductForm from './components/products/ProductForm';

// Layout component for protected routes
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-primary-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Product Routes */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<ProductForm />} />
                {/* ✅ EDIT ROUTE - Must be BEFORE /products/:id */}
                <Route path="/products/:id/edit" element={<ProductForm />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                
                {/* Other Routes */}
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
              </Route>
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1F2937',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;