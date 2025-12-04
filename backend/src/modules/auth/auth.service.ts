import { prisma } from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { sendRegistrationOtp, verifyRegistrationOtp } from '../otp/otp.service';

// Normalize phone number for database (digits only, remove country code if present)
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  
  // Remove country codes if present
  // India: if starts with 91 and is 12 digits, remove 91
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.substring(2);
  }
  // US: if starts with 1 and is 11 digits, remove 1
  else if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.substring(1);
  }
  
  return digits;
}

export async function register(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'VOTER' | 'CANDIDATE';
}) {
  // Normalize phone number before checking/creating
  const normalizedPhone = normalizePhone(data.phone);
  
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: normalizedPhone }]
    }
  });

  // If user exists but phone is not verified, allow re-registration
  if (existing) {
    if (existing.isPhoneVerified || existing.isVerified) {
      const error: any = new Error('Email or phone already in use');
      error.status = 400;
      throw error;
    }
    // User exists but not verified - update and resend OTP
    const passwordHash = await hashPassword(data.password);
    
    const updatedUser = await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        email: data.email,
        phone: normalizedPhone,
        passwordHash,
        role: data.role,
        isVerified: false,
        isPhoneVerified: false
      }
    });

    await sendRegistrationOtp(normalizedPhone);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role
    };
  }

  // New user - create
  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: normalizedPhone, // Store normalized phone
      passwordHash,
      role: data.role,
      isVerified: false,
      isPhoneVerified: false
    }
  });

  await sendRegistrationOtp(normalizedPhone);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

export async function verifyOtp(phone: string, code: string) {
  // Normalize phone number
  const normalizedPhone = normalizePhone(phone);
  
  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) {
    const error: any = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const ok = await verifyRegistrationOtp(normalizedPhone, code);
  if (!ok) {
    const error: any = new Error('Invalid or expired OTP');
    error.status = 400;
    throw error;
  }

  await prisma.user.update({
    where: { phone: normalizedPhone },
    data: { isPhoneVerified: true }
  });

  return { message: 'Phone verified. Waiting for admin approval.' };
}

export async function resendOtp(phone: string) {
  // Normalize phone number
  const normalizedPhone = normalizePhone(phone);
  
  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) {
    const error: any = new Error('User not found');
    error.status = 404;
    throw error;
  }

  // If already verified, don't resend
  if (user.isPhoneVerified) {
    const error: any = new Error('Phone number already verified');
    error.status = 400;
    throw error;
  }

  // Send new OTP
  await sendRegistrationOtp(normalizedPhone);

  return { message: 'OTP resent successfully' };
}

export async function login(phone: string, password: string) {
  // Normalize phone number (remove any non-digits)
  const normalizedPhone = phone.replace(/\D/g, '');
  
  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) {
    const error: any = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const validPwd = await comparePassword(password, user.passwordHash);
  if (!validPwd) {
    const error: any = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  if (!user.isPhoneVerified) {
    const error: any = new Error('Phone not verified');
    error.status = 403;
    throw error;
  }

  if (!user.isVerified) {
    const error: any = new Error('Account pending admin approval');
    error.status = 403;
    throw error;
  }

  const token = signToken({ id: user.id, role: user.role as any });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  };
}

// Development helper to get latest OTP
export async function getLatestOtp(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  return prisma.otpCode.findFirst({
    where: { phone: normalizedPhone, type: 'REGISTRATION' },
    orderBy: { createdAt: 'desc' }
  });
}


