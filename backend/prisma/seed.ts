import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords
  const voterPasswordHash = await hashPassword('voter123');
  const candidatePasswordHash = await hashPassword('candidate123');
  const adminPasswordHash = await hashPassword('admin123');

  // Normalize phone numbers (remove any non-digits)
  const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

  // Create Voter User
  const voterPhone = normalizePhone('9876543210');
  const voter = await prisma.user.upsert({
    where: { phone: voterPhone },
    update: {
      name: 'John Smith',
      email: 'voter@example.com',
      passwordHash: voterPasswordHash,
      role: UserRole.VOTER,
      isVerified: true, // Admin approved
      isPhoneVerified: true, // OTP verified
    },
    create: {
      name: 'John Smith',
      email: 'voter@example.com',
      phone: voterPhone,
      passwordHash: voterPasswordHash,
      role: UserRole.VOTER,
      isVerified: true, // Admin approved
      isPhoneVerified: true, // OTP verified
    },
  });
  console.log('✅ Created/Updated voter user:', voter.phone);

  // Create Candidate User
  const candidatePhone = normalizePhone('9876543211');
  const candidate = await prisma.user.upsert({
    where: { phone: candidatePhone },
    update: {
      name: 'Sarah Johnson',
      email: 'candidate@example.com',
      passwordHash: candidatePasswordHash,
      role: UserRole.CANDIDATE,
      isVerified: true, // Admin approved
      isPhoneVerified: true, // OTP verified
    },
    create: {
      name: 'Sarah Johnson',
      email: 'candidate@example.com',
      phone: candidatePhone,
      passwordHash: candidatePasswordHash,
      role: UserRole.CANDIDATE,
      isVerified: true, // Admin approved
      isPhoneVerified: true, // OTP verified
    },
  });
  console.log('✅ Created/Updated candidate user:', candidate.phone);

  // Create Admin User
  const adminPhone = normalizePhone('9876543212');
  const admin = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isVerified: true, // Admin is always verified
      isPhoneVerified: true, // OTP verified
    },
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      phone: adminPhone,
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isVerified: true, // Admin is always verified
      isPhoneVerified: true, // OTP verified
    },
  });
  console.log('✅ Created/Updated admin user:', admin.phone);

  console.log('\n📋 Test Users Created:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Voter:');
  console.log('   Phone: 9876543210');
  console.log('   Password: voter123');
  console.log('   Email: voter@example.com');
  console.log('\n👤 Candidate:');
  console.log('   Phone: 9876543211');
  console.log('   Password: candidate123');
  console.log('   Email: candidate@example.com');
  console.log('\n👤 Admin:');
  console.log('   Phone: 9876543212');
  console.log('   Password: admin123');
  console.log('   Email: admin@example.com');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

