import { prisma } from '../../config/db';

export async function listPendingVoters() {
  return prisma.user.findMany({
    where: {
      role: 'VOTER',
      isPhoneVerified: true,
      isVerified: false
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}

export async function listAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isPhoneVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function approveUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error: any = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isVerified: true }
  });
}

export async function approveVoter(userId: string) {
  return approveUser(userId);
}

export async function removeUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error: any = new Error('User not found');
    error.status = 404;
    throw error;
  }

  // Prevent deleting admin users
  if (user.role === 'ADMIN') {
    const error: any = new Error('Cannot delete admin users');
    error.status = 403;
    throw error;
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { message: 'User deleted successfully' };
}

export async function getAdminStats() {
  const [
    totalVoters,
    totalCandidates,
    pendingApprovals,
    totalVotes,
    activeElections,
    approvedCandidates
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'VOTER' } }),
    prisma.user.count({ where: { role: 'CANDIDATE' } }),
    prisma.user.count({ 
      where: { 
        isPhoneVerified: true,
        isVerified: false 
      } 
    }),
    prisma.vote.count(),
    prisma.election.count({ where: { isActive: true } }),
    prisma.candidate.count({ where: { status: 'APPROVED' } })
  ]);

  return {
    totalVoters,
    totalCandidates,
    pendingApprovals,
    totalVotes,
    activeElections,
    approvedCandidates
  };
}


