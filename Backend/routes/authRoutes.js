import express from 'express';
import { registerUser, loginUser, loginAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/login-admin', loginAdmin); 

export default router;