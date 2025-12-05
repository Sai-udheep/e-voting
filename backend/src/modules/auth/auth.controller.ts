import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, password, role, dateOfBirth } = req.body;
    const user = await authService.register({ name, email, phone, password, role, dateOfBirth });
    res.status(201).json({ message: 'Registered successfully. OTP sent to phone.', user });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, code } = req.body;
    const result = await authService.verifyOtp(phone, code);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password } = req.body;
    const result = await authService.login(phone, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Resend OTP endpoint
export async function resendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.body;
    const result = await authService.resendOtp(phone);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Development endpoint to retrieve OTP (for testing without Twilio)
export async function getOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.params;
    const otp = await authService.getLatestOtp(phone);
    if (!otp) {
      return res.status(404).json({ message: 'No OTP found for this phone number' });
    }
    res.json({ 
      phone, 
      code: otp.code, 
      expiresAt: otp.expiresAt,
      isUsed: otp.isUsed,
      createdAt: otp.createdAt
    });
  } catch (err) {
    next(err);
  }
}


