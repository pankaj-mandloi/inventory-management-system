import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { 
  validateQuantity, 
  validatePrice, 
  validateProductName,
  validateDescription,
  validateSupplier,
  isValidObjectId,
  sanitizeInput,
  validateSKU
} from '../utils/validators.js';
import { 
  getStockStatus, 
  parsePagination, 
  parseSort, 
  parseFilters,
  getPaginationMeta,
  generateSKU
} from '../utils/helpers.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, description, quantity, unitPrice, supplier } = req.body;

    console.log('📦 Creating product:', { name, sku, category });

    // Validate product name
    const nameValidation = validateProductName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({
        success: false,
        message: nameValidation.error
      });
    }

    // Validate quantity
    const quantityValidation = validateQuantity(quantity);
    if (!quantityValidation.valid) {
      return res.status(400).json({
        success: false,
        message: quantityValidation.error
      });
    }

    // Validate price
    const priceValidation = validatePrice(unitPrice);
    if (!priceValidation.valid) {
      return res.status(400).json({
        success: false,
        message: priceValidation.error
      });
    }

    // Validate SKU if provided, else generate one
    let finalSKU = sku;
    if (!sku) {
      finalSKU = generateSKU();
    } else {
      if (!validateSKU(sku)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid SKU format. Use only uppercase letters, numbers, and hyphens'
        });
      }
      finalSKU = sku.toUpperCase();
    }

    // Validate category
    if (!isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: finalSKU });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    // Validate description (optional)
    if (description) {
      const descValidation = validateDescription(description);
      if (!descValidation.valid) {
        return res.status(400).json({
          success: false,
          message: descValidation.error
        });
      }
    }

    // Validate supplier (optional)
    if (supplier) {
      const supplierValidation = validateSupplier(supplier);
      if (!supplierValidation.valid) {
        return res.status(400).json({
          success: false,
          message: supplierValidation.error
        });
      }
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedDescription = description ? sanitizeInput(description) : '';
    const sanitizedSupplier = supplier ? sanitizeInput(supplier) : '';

    // ✅ Calculate status based on quantity
    const status = getStockStatus(Number(quantity));

    // Create product with status
    const product = await Product.create({
      name: sanitizedName,
      sku: finalSKU,
      category,
      description: sanitizedDescription,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      supplier: sanitizedSupplier,
      status: status // ✅ Set status here
    });

    // Add product to category
    categoryExists.products.push(product._id);
    await categoryExists.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name');

    console.log('✅ Product created successfully:', product.name);

    return res.status(201).json({
      success: true,
      data: populatedProduct
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      status, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1, 
      limit = 10 
    } = req.query;

    console.log('📊 GetProducts - Query params:', { search, category, status, sortBy, sortOrder, page, limit });

    // Build filter object
    const filter = parseFilters({ search, category, status });
    
    // Parse sort
    const sort = parseSort(sortBy, sortOrder);

    // Parse pagination
    const { skip, limit: limitNum, page: pageNum, limitNum: parsedLimit } = parsePagination(page, limit);

    console.log('📊 GetProducts - Filter:', filter);
    console.log('📊 GetProducts - Sort:', sort);
    console.log('📊 GetProducts - Skip:', skip, 'Limit:', parsedLimit);

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit);

    const total = await Product.countDocuments(filter);

    // Get pagination metadata
    const paginationMeta = getPaginationMeta(total, pageNum, parsedLimit);

    console.log('📊 GetProducts - Total:', total, 'Products:', products.length);

    return res.json({
      success: true,
      data: products,
      pagination: paginationMeta
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req, res) => {
  try {
    // Validate ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    // Validate ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const { category, sku, name, quantity, unitPrice, description, supplier } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Validate name if provided
    if (name) {
      const nameValidation = validateProductName(name);
      if (!nameValidation.valid) {
        return res.status(400).json({
          success: false,
          message: nameValidation.error
        });
      }
      product.name = sanitizeInput(name);
    }

    // Validate quantity if provided
    if (quantity !== undefined) {
      const quantityValidation = validateQuantity(quantity);
      if (!quantityValidation.valid) {
        return res.status(400).json({
          success: false,
          message: quantityValidation.error
        });
      }
      product.quantity = Number(quantity);
      // ✅ Update status when quantity changes
      product.status = getStockStatus(Number(quantity));
    }

    // Validate price if provided
    if (unitPrice !== undefined) {
      const priceValidation = validatePrice(unitPrice);
      if (!priceValidation.valid) {
        return res.status(400).json({
          success: false,
          message: priceValidation.error
        });
      }
      product.unitPrice = Number(unitPrice);
    }

    // Validate SKU if provided
    if (sku) {
      if (!validateSKU(sku)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid SKU format. Use only uppercase letters, numbers, and hyphens'
        });
      }
      const newSKU = sku.toUpperCase();
      if (newSKU !== product.sku) {
        const existingProduct = await Product.findOne({ sku: newSKU });
        if (existingProduct) {
          return res.status(400).json({
            success: false,
            message: 'Product with this SKU already exists'
          });
        }
        product.sku = newSKU;
      }
    }

    // Validate category if provided
    if (category) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }
      
      if (category !== product.category.toString()) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        // Remove from old category
        const oldCategory = await Category.findById(product.category);
        if (oldCategory) {
          oldCategory.products = oldCategory.products.filter(
            p => p.toString() !== product._id.toString()
          );
          await oldCategory.save();
        }

        // Add to new category
        categoryExists.products.push(product._id);
        await categoryExists.save();
        product.category = category;
      }
    }

    // Validate description if provided
    if (description !== undefined) {
      const descValidation = validateDescription(description);
      if (!descValidation.valid) {
        return res.status(400).json({
          success: false,
          message: descValidation.error
        });
      }
      product.description = description ? sanitizeInput(description) : '';
    }

    // Validate supplier if provided
    if (supplier !== undefined) {
      const supplierValidation = validateSupplier(supplier);
      if (!supplierValidation.valid) {
        return res.status(400).json({
          success: false,
          message: supplierValidation.error
        });
      }
      product.supplier = supplier ? sanitizeInput(supplier) : '';
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category', 'name');

    console.log('✅ Product updated successfully:', updatedProduct.name);

    return res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    // Validate ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Remove from category
    const category = await Category.findById(product.category);
    if (category) {
      category.products = category.products.filter(
        p => p.toString() !== product._id.toString()
      );
      await category.save();
    }

    await product.deleteOne();

    console.log('✅ Product deleted successfully:', product.name);

    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/products/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const lowStock = await Product.countDocuments({ 
      status: 'Low Stock',
      quantity: { $gt: 0 }
    });
    const outOfStock = await Product.countDocuments({ quantity: 0 });

    return res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalStock: totalStock[0]?.total || 0,
        lowStock,
        outOfStock
      }
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};