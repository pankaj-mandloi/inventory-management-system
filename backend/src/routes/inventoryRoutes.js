import express from 'express';
import {
  increaseStock,
  reduceStock,
  getStockHistory,
  getAllTransactions
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/increase', increaseStock);
router.post('/reduce', reduceStock);
router.get('/history/:productId', getStockHistory);
router.get('/transactions', getAllTransactions);

export default router;