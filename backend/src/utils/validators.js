/**
 * Custom validation helpers for the inventory management system
 * These are additional validators beyond express-validator
 */

/**
 * Validate if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  if (!id) return false;
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

/**
 * Validate SKU format
 * @param {string} sku - SKU to validate
 * @returns {boolean} - True if valid SKU format
 */
export const validateSKU = (sku) => {
  if (!sku) return false;
  // SKU should contain only uppercase letters, numbers, and hyphens
  const skuPattern = /^[A-Z0-9-]+$/;
  return skuPattern.test(sku);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, errors: string[] }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate product quantity
 * @param {number} quantity - Quantity to validate
 * @returns {object} - { valid: boolean, error: string | null }
 */
export const validateQuantity = (quantity) => {
  if (quantity === undefined || quantity === null) {
    return { valid: false, error: 'Quantity is required' };
  }

  if (!Number.isInteger(quantity)) {
    return { valid: false, error: 'Quantity must be a whole number' };
  }

  if (quantity < 0) {
    return { valid: false, error: 'Quantity cannot be negative' };
  }

  if (quantity > 999999) {
    return { valid: false, error: 'Quantity cannot exceed 999,999' };
  }

  return { valid: true, error: null };
};

/**
 * Validate price
 * @param {number} price - Price to validate
 * @returns {object} - { valid: boolean, error: string | null }
 */
export const validatePrice = (price) => {
  if (price === undefined || price === null) {
    return { valid: false, error: 'Price is required' };
  }

  if (typeof price !== 'number') {
    return { valid: false, error: 'Price must be a number' };
  }

  if (price < 0) {
    return { valid: false, error: 'Price cannot be negative' };
  }

  if (price > 99999999.99) {
    return { valid: false, error: 'Price cannot exceed 99,999,999.99' };
  }

  // Check for more than 2 decimal places
  if (price.toString().includes('.') && price.toString().split('.')[1].length > 2) {
    return { valid: false, error: 'Price cannot have more than 2 decimal places' };
  }

  return { valid: true, error: null };
};

/**
 * Validate product name
 * @param {string} name - Product name to validate
 * @returns {object} - { valid: boolean, error: string | null }
 */
export const validateProductName = (name) => {
  if (!name) {
    return { valid: false, error: 'Product name is required' };
  }

  if (typeof name !== 'string') {
    return { valid: false, error: 'Product name must be a string' };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Product name must be at least 2 characters' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Product name cannot exceed 100 characters' };
  }

  // Check for special characters (allow basic ones)
  const invalidChars = /[<>{}|\\^~\[\]]/;
  if (invalidChars.test(trimmed)) {
    return { valid: false, error: 'Product name contains invalid characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validate category name
 * @param {string} name - Category name to validate
 * @returns {object} - { valid: boolean, error: string | null }
 */
export const validateCategoryName = (name) => {
  if (!name) {
    return { valid: false, error: 'Category name is required' };
  }

  if (typeof name !== 'string') {
    return { valid: false, error: 'Category name must be a string' };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Category name must be at least 2 characters' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Category name cannot exceed 50 characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validate description
 * @param {string} description - Description to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {object} - { valid: boolean, error: string | null }
 */
export const validateDescription = (description, maxLength = 500) => {
  if (!description) {
    return { valid: true, error: null }; // Description is optional
  }

  if (typeof description !== 'string') {
    return { valid: false, error: 'Description must be a string' };
  }

  const trimmed = description.trim();
  if (trimmed.length > maxLength) {
    return { 
      valid: false, 
      error: `Description cannot exceed ${maxLength} characters` 
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate supplier name
 * @param {string} supplier - Supplier name to validate
 * @returns {object} - { valid: boolean, error: string | null }
 */
export const validateSupplier = (supplier) => {
  if (!supplier) {
    return { valid: true, error: null }; // Supplier is optional
  }

  if (typeof supplier !== 'string') {
    return { valid: false, error: 'Supplier name must be a string' };
  }

  const trimmed = supplier.trim();
  if (trimmed.length > 100) {
    return { valid: false, error: 'Supplier name cannot exceed 100 characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validate URL (for image URLs)
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidURL = (url) => {
  if (!url) return true; // URL is optional
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize input string (remove dangerous characters)
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>{}|\\^~\[\]]/g, '') // Remove dangerous characters
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - { valid: boolean, errors: string[], page: number, limit: number }
 */
export const validatePagination = (page, limit) => {
  const errors = [];
  let validPage = parseInt(page) || 1;
  let validLimit = parseInt(limit) || 10;

  if (validPage < 1) {
    errors.push('Page must be at least 1');
    validPage = 1;
  }

  if (validLimit < 1) {
    errors.push('Limit must be at least 1');
    validLimit = 10;
  }

  if (validLimit > 100) {
    errors.push('Limit cannot exceed 100');
    validLimit = 100;
  }

  return {
    valid: errors.length === 0,
    errors,
    page: validPage,
    limit: validLimit
  };
};

/**
 * Validate stock adjustment
 * @param {number} quantity - Quantity to adjust
 * @param {number} currentStock - Current stock quantity
 * @param {string} action - 'increase' or 'decrease'
 * @returns {object} - { valid: boolean, error: string | null }
 */
export const validateStockAdjustment = (quantity, currentStock, action) => {
  if (!quantity || quantity <= 0) {
    return { 
      valid: false, 
      error: 'Quantity must be greater than 0' 
    };
  }

  if (!Number.isInteger(quantity)) {
    return { 
      valid: false, 
      error: 'Quantity must be a whole number' 
    };
  }

  if (action === 'decrease' && quantity > currentStock) {
    return { 
      valid: false, 
      error: `Cannot decrease stock. Current stock (${currentStock}) is less than requested quantity (${quantity})` 
    };
  }

  return { valid: true, error: null };
};

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 * @param {any} value - Value to check
 * @returns {boolean} - True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};