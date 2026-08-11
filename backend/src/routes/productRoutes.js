import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { validateProduct, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/stats/dashboard', getDashboardStats);
router.post('/', validateProduct, handleValidationErrors, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', validateProduct, handleValidationErrors, updateProduct);
router.delete('/:id', deleteProduct);

export default router;