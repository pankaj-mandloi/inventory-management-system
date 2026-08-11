import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { 
  validateCategoryName,
  validateDescription,
  isValidObjectId,
  sanitizeInput
} from '../utils/validators.js';

// @desc    Create category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    console.log('📦 Creating category:', { name });

    // Validate category name
    const nameValidation = validateCategoryName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({
        success: false,
        message: nameValidation.error
      });
    }

    // Validate description (optional)
    if (description) {
      const descValidation = validateDescription(description, 200);
      if (!descValidation.valid) {
        return res.status(400).json({
          success: false,
          message: descValidation.error
        });
      }
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedDescription = description ? sanitizeInput(description) : '';

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: sanitizedName });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name: sanitizedName,
      description: sanitizedDescription
    });

    console.log('✅ Category created successfully:', category.name);

    return res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('❌ Create category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('products', 'name sku quantity status');

    return res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (req, res) => {
  try {
    // Validate ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(req.params.id)
      .populate('products', 'name sku quantity status unitPrice');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('❌ Get category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    // Validate ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Validate and update name
    if (name) {
      const nameValidation = validateCategoryName(name);
      if (!nameValidation.valid) {
        return res.status(400).json({
          success: false,
          message: nameValidation.error
        });
      }
      
      const sanitizedName = sanitizeInput(name);
      if (sanitizedName !== category.name) {
        const existingCategory = await Category.findOne({ name: sanitizedName });
        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: 'Category with this name already exists'
          });
        }
        category.name = sanitizedName;
      }
    }

    // Validate and update description
    if (description !== undefined) {
      const descValidation = validateDescription(description, 200);
      if (!descValidation.valid) {
        return res.status(400).json({
          success: false,
          message: descValidation.error
        });
      }
      category.description = description ? sanitizeInput(description) : '';
    }

    await category.save();

    console.log('✅ Category updated successfully:', category.name);

    return res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('❌ Update category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    // Validate ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    if (category.products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with associated products. Remove or reassign products first.'
      });
    }

    await category.deleteOne();

    console.log('✅ Category deleted successfully:', category.name);

    return res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};