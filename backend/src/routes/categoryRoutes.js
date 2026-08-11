import express from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { validateCategory, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

router.post('/', validateCategory, handleValidationErrors, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id', validateCategory, handleValidationErrors, updateCategory);
router.delete('/:id', deleteCategory);

export default router;