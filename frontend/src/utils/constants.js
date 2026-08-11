// API Constants
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Pagination Constants
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Stock Status Constants
export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
  ADJUSTMENT: 'ADJUSTMENT',
};

// Product Sort Options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'sku', label: 'SKU' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'unitPrice', label: 'Price' },
  { value: 'createdAt', label: 'Date Added' },
  { value: 'updatedAt', label: 'Last Updated' },
];

// Product Filter Options
export const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: STOCK_STATUS.IN_STOCK, label: 'In Stock' },
  { value: STOCK_STATUS.LOW_STOCK, label: 'Low Stock' },
  { value: STOCK_STATUS.OUT_OF_STOCK, label: 'Out of Stock' },
];

// Validation Rules
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  SKU_PATTERN: /^[A-Z0-9-]+$/,
  PASSWORD_MIN_LENGTH: 6,
  QUANTITY_MIN: 0,
  PRICE_MIN: 0,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Messages
export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Welcome back! 🌿',
  REGISTER_SUCCESS: 'Registration successful! 🌱',
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGIN_FAILED: 'Login failed',
  REGISTER_FAILED: 'Registration failed',
  
  // Products
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  PRODUCT_FETCH_FAILED: 'Failed to fetch products',
  PRODUCT_CREATE_FAILED: 'Failed to create product',
  PRODUCT_UPDATE_FAILED: 'Failed to update product',
  PRODUCT_DELETE_FAILED: 'Failed to delete product',
  
  // Categories
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  
  // Inventory
  STOCK_INCREASED: 'Stock increased successfully',
  STOCK_DECREASED: 'Stock decreased successfully',
  STOCK_UPDATE_FAILED: 'Failed to update stock',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email',
  INVALID_SKU: 'SKU must contain only uppercase letters, numbers, and hyphens',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  QUANTITY_POSITIVE: 'Quantity must be a positive number',
  PRICE_POSITIVE: 'Price must be a positive number',
};

// Colors
export const COLORS = {
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  status: {
    'In Stock': 'bg-green-100 text-green-800',
    'Low Stock': 'bg-yellow-100 text-yellow-800',
    'Out of Stock': 'bg-red-100 text-red-800',
  },
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_EDIT: '/products/:id/edit',
  PRODUCT_NEW: '/products/new',
  CATEGORIES: '/categories',
  INVENTORY: '/inventory',
  NOT_FOUND: '*',
};