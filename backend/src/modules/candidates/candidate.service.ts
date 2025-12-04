import { prisma } from '../../config/db';

export interface CreateNominationData {
  userId: string;
  electionId: string;
  party: string;
}

export async function createNomination(data: CreateNominationData) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    const error: any = new Error('User not found');
    error.status = 404;
    throw error;
  }

  // Check if election exists and is active
  const election = await prisma.election.findUnique({
    where: { id: data.electionId },
  });

  if (!election) {
    const error: any = new Error('Election not found');
    error.status = 404;
    throw error;
  }

  // Check if nomination already exists
  const existingNomination = await prisma.candidate.findUnique({
    where: {
      userId_electionId: {
        userId: data.userId,
        electionId: data.electionId,
      },
    },
  });

  if (existingNomination) {
    const error: any = new Error('Nomination already exists for this election');
    error.status = 400;
    throw error;
  }

  return prisma.candidate.create({
    data: {
      userId: data.userId,
      electionId: data.electionId,
      party: data.party,
      status: 'PENDING',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      election: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getAllCandidates() {
  return prisma.candidate.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      election: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getCandidatesByElection(electionId: string) {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    const error: any = new Error('Election not found');
    error.status = 404;
    throw error;
  }

  return prisma.candidate.findMany({
    where: {
      electionId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getCandidatesByUser(userId: string) {
  return prisma.candidate.findMany({
    where: {
      userId,
    },
    include: {
      election: {
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          isActive: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getPendingNominations() {
  return prisma.candidate.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      election: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function updateCandidateStatus(
  candidateId: string,
  status: 'APPROVED' | 'REJECTED'
) {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    const error: any = new Error('Candidate not found');
    error.status = 404;
    throw error;
  }

  return prisma.candidate.update({
    where: { id: candidateId },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      election: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function deleteCandidate(candidateId: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: {
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  if (!candidate) {
    const error: any = new Error('Candidate not found');
    error.status = 404;
    throw error;
  }

  // Prevent deletion if there are votes
  if (candidate._count.votes > 0) {
    const error: any = new Error('Cannot delete candidate with existing votes');
    error.status = 400;
    throw error;
  }

  await prisma.candidate.delete({
    where: { id: candidateId },
  });

  return { message: 'Candidate removed successfully' };
}

