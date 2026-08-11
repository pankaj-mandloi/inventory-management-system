import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import { 
  validateQuantity,
  isValidObjectId,
  sanitizeInput
} from '../utils/validators.js';
import { 
  getStockStatus,
  formatDate
} from '../utils/helpers.js';

// @desc    Increase stock
// @route   POST /api/inventory/increase
// @access  Private
export const increaseStock = async (req, res) => {
  try {
    const { productId, quantity, note } = req.body;

    // Validate product ID
    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
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

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const previousQuantity = product.quantity;
    product.quantity += quantity;
    // ✅ Update status
    product.status = getStockStatus(product.quantity);
    await product.save();

    // Create transaction record
    const transaction = await InventoryTransaction.create({
      product: productId,
      type: 'INCREASE',
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      note: note ? sanitizeInput(note) : '',
      user: req.user.id
    });

    return res.json({
      success: true,
      data: {
        product: {
          ...product.toObject(),
          status: getStockStatus(product.quantity)
        },
        transaction
      }
    });
  } catch (error) {
    console.error('❌ Increase stock error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reduce stock
// @route   POST /api/inventory/reduce
// @access  Private
export const reduceStock = async (req, res) => {
  try {
    const { productId, quantity, note } = req.body;

    // Validate product ID
    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
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

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check for negative inventory
    if (product.quantity - quantity < 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot reduce stock below 0. Current quantity: ${product.quantity}`
      });
    }

    const previousQuantity = product.quantity;
    product.quantity -= quantity;
    // ✅ Update status
    product.status = getStockStatus(product.quantity);
    await product.save();

    // Create transaction record
    const transaction = await InventoryTransaction.create({
      product: productId,
      type: 'DECREASE',
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      note: note ? sanitizeInput(note) : '',
      user: req.user.id
    });

    return res.json({
      success: true,
      data: {
        product: {
          ...product.toObject(),
          status: getStockStatus(product.quantity)
        },
        transaction
      }
    });
  } catch (error) {
    console.error('❌ Reduce stock error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get stock history for a product
// @route   GET /api/inventory/history/:productId
// @access  Private
export const getStockHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 50 } = req.query;

    // Validate product ID
    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const transactions = await InventoryTransaction.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 50);

    // Format dates for better readability
    const formattedTransactions = transactions.map(t => ({
      ...t.toObject(),
      formattedDate: formatDate(t.createdAt)
    }));

    return res.json({
      success: true,
      data: formattedTransactions
    });
  } catch (error) {
    console.error('❌ Get stock history error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all stock transactions
// @route   GET /api/inventory/transactions
// @access  Private
export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await InventoryTransaction.find()
      .populate('product', 'name sku')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await InventoryTransaction.countDocuments();

    return res.json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};