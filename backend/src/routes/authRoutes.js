import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegistration, validateLogin, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// IMPORTANT: The order of middleware matters
// validateRegistration -> handleValidationErrors -> register

// Public routes
router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;