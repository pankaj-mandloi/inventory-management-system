/**
 * Helper functions for the inventory management system
 */

/**
 * Generate a random SKU
 * @param {string} prefix - Optional prefix for SKU
 * @returns {string} - Generated SKU
 */
export const generateSKU = (prefix = 'PRD') => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Get stock status based on quantity
 * @param {number} quantity - Current stock quantity
 * @returns {string} - 'In Stock', 'Low Stock', or 'Out of Stock'
 */
export const getStockStatus = (quantity) => {
  if (quantity === undefined || quantity === null) return 'Out of Stock';
  
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= 10) return 'Low Stock';
  return 'In Stock';
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = '$') => {
  if (amount === undefined || amount === null) return `${currency}0.00`;
  return `${currency}${amount.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} - Discount percentage
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!discountedPrice || discountedPrice >= originalPrice) return 0;
  
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Check if a value is a valid number
 * @param {any} value - Value to check
 * @returns {boolean} - True if valid number
 */
export const isValidNumber = (value) => {
  if (typeof value === 'number' && !isNaN(value)) return true;
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }
  return false;
};

/**
 * Parse query parameters for filtering
 * @param {object} query - Query object from request
 * @returns {object} - Parsed filter object
 */
export const parseFilters = (query) => {
  const filters = {};
  
  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { sku: { $regex: query.search.toUpperCase(), $options: 'i' } }
    ];
  }
  
  if (query.category) {
    filters.category = query.category;
  }
  
  if (query.status) {
    filters.status = query.status;
  }
  
  if (query.minPrice) {
    filters.unitPrice = { $gte: parseFloat(query.minPrice) };
  }
  
  if (query.maxPrice) {
    filters.unitPrice = { 
      ...filters.unitPrice, 
      $lte: parseFloat(query.maxPrice) 
    };
  }
  
  return filters;
};

/**
 * Parse sort parameters
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {object} - Sort object for MongoDB
 */
export const parseSort = (sortBy = 'name', sortOrder = 'asc') => {
  const sort = {};
  const validFields = ['name', 'sku', 'quantity', 'unitPrice', 'createdAt', 'updatedAt'];
  
  if (!validFields.includes(sortBy)) {
    sortBy = 'name';
  }
  
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  return sort;
};

/**
 * Validate and parse pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - { skip, limit, page, limitNum }
 */
export const parsePagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;
  
  return { skip, limit: limitNum, page: pageNum, limitNum };
};

/**
 * Generate pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} - Pagination metadata
 */
export const getPaginationMeta = (total, page, limit) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };
};

/**
 * Sanitize object (remove undefined and null values)
 * @param {object} obj - Object to sanitize
 * @returns {object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Check if a value is a valid MongoDB ObjectId
 * @param {string} id - ID to check
 * @returns {boolean} - True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  if (!id) return false;
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get current timestamp in ISO format
 * @returns {string} - ISO timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if a value is a valid email
 * @param {string} email - Email to check
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} - Random ID
 */
export const generateRandomId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};