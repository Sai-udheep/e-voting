import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', authController.login);

// Development endpoint to get OTP (only in development)
if (process.env.NODE_ENV !== 'production') {
  router.get('/otp/:phone', authController.getOtp);
}

export default router;


