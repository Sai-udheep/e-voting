import Twilio from 'twilio';
import { addMinutes } from 'date-fns';
import { ENV } from '../../config/env';
import { prisma } from '../../config/db';

// Initialize Twilio client only if credentials are available
function getTwilioClient() {
  if (ENV.TWILIO_ACCOUNT_SID && ENV.TWILIO_AUTH_TOKEN) {
    return Twilio(ENV.TWILIO_ACCOUNT_SID, ENV.TWILIO_AUTH_TOKEN);
  }
  return null;
}

// Normalize phone for database storage (digits only)
function normalizePhoneForDb(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Format phone for Twilio (E.164 format: +[country code][number])
function formatPhoneForTwilio(phone: string): string {
  // Remove all non-digits (phone should already be normalized, but just in case)
  const digits = phone.replace(/\D/g, '');
  
  // If already starts with +, return as is (assuming it's already in E.164)
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // If starts with 0, remove it (common in some countries)
  let cleaned = digits.startsWith('0') ? digits.substring(1) : digits;
  
  // If already has country code (11+ digits starting with country code), add +
  // Check if it starts with known country codes
  if (cleaned.length >= 11) {
    // If starts with 91 (India), it's already 919701696553, return as +919701696553
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    // If starts with 1 (US), it's already 15551234567, return as +15551234567
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      return `+${cleaned}`;
    }
    // Otherwise, assume it has country code
    return `+${cleaned}`;
  }
  
  // India: 10-digit numbers starting with 6, 7, 8, or 9
  if (cleaned.length === 10 && (cleaned.startsWith('9') || cleaned.startsWith('8') || cleaned.startsWith('7') || cleaned.startsWith('6'))) {
    return `+91${cleaned}`;
  }
  
  // US: 10-digit numbers
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // Default: assume India (+91) for 10-digit numbers
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // Return as is if can't determine (shouldn't happen, but safety)
  return `+${cleaned}`;
}

export async function sendRegistrationOtp(phone: string): Promise<void> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Normalize phone number for database (digits only)
  // Phone should already be normalized from register function, but normalize again to be safe
  const normalizedPhone = normalizePhoneForDb(phone);
  
  // If phone has country code (12 digits starting with 91 for India), extract just the number
  let dbPhone = normalizedPhone;
  if (normalizedPhone.length === 12 && normalizedPhone.startsWith('91')) {
    // Remove country code for database storage (store as 10 digits)
    dbPhone = normalizedPhone.substring(2);
  } else if (normalizedPhone.length === 11 && normalizedPhone.startsWith('1')) {
    // US number with country code
    dbPhone = normalizedPhone.substring(1);
  }

  // Always store OTP in database with normalized phone (10 digits for India, etc.)
  await prisma.otpCode.create({
    data: {
      phone: dbPhone,
      code,
      type: 'REGISTRATION',
      expiresAt: addMinutes(new Date(), 10)
    }
  });

  // Check if Twilio is configured
  if (!ENV.TWILIO_ACCOUNT_SID || !ENV.TWILIO_AUTH_TOKEN || !ENV.TWILIO_FROM_NUMBER) {
    // eslint-disable-next-line no-console
    console.warn('Twilio environment variables are not fully configured. OTP SMS will not be sent.');
    // eslint-disable-next-line no-console
    console.log(`\n📱 OTP CODE for ${dbPhone}: ${code}\n`);
    // eslint-disable-next-line no-console
    console.log('💡 Tip: Check the console or use GET /auth/otp/:phone to retrieve OTP codes during development.\n');
    return;
  }

  // Send SMS via Twilio
  try {
    const client = getTwilioClient();
    if (client) {
      // Format phone number for Twilio (E.164 format)
      // Use the original phone or normalized phone to format
      const twilioPhone = formatPhoneForTwilio(dbPhone);
      
      await client.messages.create({
        from: ENV.TWILIO_FROM_NUMBER,
        to: twilioPhone,
        body: `Your verification code is ${code}`
      });
      // eslint-disable-next-line no-console
      console.log(`✅ OTP SMS sent to ${twilioPhone} (stored as ${dbPhone})`);
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error sending OTP via Twilio:', error.message || error);
    // eslint-disable-next-line no-console
    console.log(`\n📱 OTP CODE for ${dbPhone}: ${code} (SMS failed, use this code)\n`);
    // eslint-disable-next-line no-console
    console.log('💡 Tip: Phone number format issue. Twilio requires E.164 format (+[country code][number])\n');
  }
}

export async function verifyRegistrationOtp(phone: string, code: string): Promise<boolean> {
  // Normalize phone number for database lookup (digits only)
  const normalizedPhone = normalizePhoneForDb(phone);
  
  const otp = await prisma.otpCode.findFirst({
    where: {
      phone: normalizedPhone,
      code: code.trim(),
      type: 'REGISTRATION',
      isUsed: false,
      expiresAt: { gt: new Date() }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!otp) {
    // Log for debugging
    const allOtps = await prisma.otpCode.findMany({
      where: { phone: normalizedPhone, type: 'REGISTRATION' },
      orderBy: { createdAt: 'desc' },
      take: 1
    });
    
    if (allOtps.length > 0) {
      const latest = allOtps[0];
      // eslint-disable-next-line no-console
      console.log('OTP Verification Failed:', {
        providedCode: code,
        storedCode: latest.code,
        isUsed: latest.isUsed,
        expired: new Date(latest.expiresAt) < new Date(),
        expiresAt: latest.expiresAt,
        now: new Date()
      });
    }
    return false;
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { isUsed: true }
  });

  return true;
}


