import { prisma } from '../../config/db';

export interface CreateElectionData {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateElectionData {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  isResultsPublished?: boolean;
}

export async function createElection(data: CreateElectionData) {
  // Validate dates
  if (data.endDate <= data.startDate) {
    const error: any = new Error('End date must be after start date');
    error.status = 400;
    throw error;
  }

  return prisma.election.create({
    data: {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: false,
      isResultsPublished: false,
    },
  });
}

export async function getAllElections() {
  return prisma.election.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      candidates: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          votes: true,
          candidates: true,
        },
      },
    },
  });
}

export async function getElectionById(electionId: string) {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      candidates: {
        where: {
          status: 'APPROVED',
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
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  if (!election) {
    const error: any = new Error('Election not found');
    error.status = 404;
    throw error;
  }

  return election;
}

export async function getActiveElections() {
  return prisma.election.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      candidates: {
        where: {
          status: 'APPROVED',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function updateElection(electionId: string, data: UpdateElectionData) {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    const error: any = new Error('Election not found');
    error.status = 404;
    throw error;
  }

  // Validate dates if both are provided
  if (data.startDate && data.endDate && data.endDate <= data.startDate) {
    const error: any = new Error('End date must be after start date');
    error.status = 400;
    throw error;
  }

  return prisma.election.update({
    where: { id: electionId },
    data,
  });
}

export async function deleteElection(electionId: string) {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      _count: {
        select: {
          votes: true,
          candidates: true,
        },
      },
    },
  });

  if (!election) {
    const error: any = new Error('Election not found');
    error.status = 404;
    throw error;
  }

  // Prevent deletion if there are votes
  if (election._count.votes > 0) {
    const error: any = new Error('Cannot delete election with existing votes');
    error.status = 400;
    throw error;
  }

  await prisma.election.delete({
    where: { id: electionId },
  });

  return { message: 'Election deleted successfully' };
}

export async function toggleElectionActive(electionId: string) {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    const error: any = new Error('Election not found');
    error.status = 404;
    throw error;
  }

  return prisma.election.update({
    where: { id: electionId },
    data: {
      isActive: !election.isActive,
    },
  });
}

export async function toggleResultsPublished(electionId: string) {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    const error: any = new Error('Election not found');
    error.status = 404;
    throw error;
  }

  return prisma.election.update({
    where: { id: electionId },
    data: {
      isResultsPublished: !election.isResultsPublished,
    },
  });
}

