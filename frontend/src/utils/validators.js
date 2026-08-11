import { VALIDATION } from './constants';

export const validators = {
  // Required field validation
  required: (value) => {
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  // Email validation
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  // Password validation
  password: (value) => {
    if (!value) return null;
    if (value.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }
    return null;
  },

  // Confirm password validation
  confirmPassword: (value, password) => {
    if (!value) return null;
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },

  // Name validation
  name: (value) => {
    if (!value || value.trim() === '') {
      return 'Name is required';
    }
    if (value.trim().length < VALIDATION.NAME_MIN_LENGTH) {
      return `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
    }
    if (value.trim().length > VALIDATION.NAME_MAX_LENGTH) {
      return `Name cannot exceed ${VALIDATION.NAME_MAX_LENGTH} characters`;
    }
    return null;
  },

  // SKU validation
  sku: (value) => {
    if (!value || value.trim() === '') {
      return 'SKU is required';
    }
    if (!VALIDATION.SKU_PATTERN.test(value)) {
      return 'SKU must contain only uppercase letters, numbers, and hyphens';
    }
    return null;
  },

  // Quantity validation
  quantity: (value) => {
    const num = Number(value);
    if (isNaN(num)) {
      return 'Quantity must be a number';
    }
    if (num < VALIDATION.QUANTITY_MIN) {
      return `Quantity cannot be less than ${VALIDATION.QUANTITY_MIN}`;
    }
    if (!Number.isInteger(num)) {
      return 'Quantity must be a whole number';
    }
    return null;
  },

  // Price validation
  price: (value) => {
    const num = Number(value);
    if (isNaN(num)) {
      return 'Price must be a number';
    }
    if (num < VALIDATION.PRICE_MIN) {
      return `Price cannot be less than ${VALIDATION.PRICE_MIN}`;
    }
    return null;
  },

  // Description validation
  description: (value) => {
    if (!value) return null;
    if (value.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
      return `Description cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
    }
    return null;
  },

  // Supplier validation
  supplier: (value) => {
    if (!value) return null;
    if (value.trim().length > 100) {
      return 'Supplier name cannot exceed 100 characters';
    }
    return null;
  },

  // URL validation
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },
};

// Validation function for multiple fields
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    const value = data[field];
    
    for (const rule of fieldRules) {
      const error = rule(value, data);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validators;