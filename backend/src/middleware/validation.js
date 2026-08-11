import { body, validationResult } from 'express-validator';

// Registration validation rules
export const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Login validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Product validation rules
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('SKU must contain only uppercase letters, numbers, and hyphens'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a positive number'),
  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('supplier')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Supplier name cannot exceed 100 characters')
];

// Category validation rules
export const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters')
];

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  // Log the request body for debugging
  console.log('🔍 Validation - Request Body:', req.body);
  console.log('🔍 Validation - Content-Type:', req.headers['content-type']);

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log('❌ Validation Errors:', errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  console.log('✅ Validation Passed');
  next();
};