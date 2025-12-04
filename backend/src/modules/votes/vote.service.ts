import { prisma } from '../../config/db';

export interface CastVoteData {
  voterId: string;
  electionId: string;
  candidateId: string;
}

export async function castVote(data: CastVoteData) {
  // Check if voter exists
  const voter = await prisma.user.findUnique({
    where: { id: data.voterId },
  });

  if (!voter) {
    const error: any = new Error('Voter not found');
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

  if (!election.isActive) {
    const error: any = new Error('Election is not active');
    error.status = 400;
    throw error;
  }

  // Check if current date is within election period
  const now = new Date();
  if (now < election.startDate || now > election.endDate) {
    const error: any = new Error('Election is not currently open for voting');
    error.status = 400;
    throw error;
  }

  // Check if candidate exists and is approved
  const candidate = await prisma.candidate.findUnique({
    where: { id: data.candidateId },
  });

  if (!candidate) {
    const error: any = new Error('Candidate not found');
    error.status = 404;
    throw error;
  }

  if (candidate.electionId !== data.electionId) {
    const error: any = new Error('Candidate is not running in this election');
    error.status = 400;
    throw error;
  }

  if (candidate.status !== 'APPROVED') {
    const error: any = new Error('Candidate is not approved');
    error.status = 400;
    throw error;
  }

  // Check if voter has already voted in this election
  const existingVote = await prisma.vote.findUnique({
    where: {
      voterId_electionId: {
        voterId: data.voterId,
        electionId: data.electionId,
      },
    },
  });

  if (existingVote) {
    const error: any = new Error('You have already voted in this election');
    error.status = 400;
    throw error;
  }

  return prisma.vote.create({
    data: {
      voterId: data.voterId,
      electionId: data.electionId,
      candidateId: data.candidateId,
    },
    include: {
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
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

export async function getVoteHistory(voterId: string) {
  return prisma.vote.findMany({
    where: {
      voterId,
    },
    include: {
      election: {
        select: {
          id: true,
          name: true,
          endDate: true,
        },
      },
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function hasVoted(voterId: string, electionId: string) {
  const vote = await prisma.vote.findUnique({
    where: {
      voterId_electionId: {
        voterId,
        electionId,
      },
    },
  });

  return { hasVoted: !!vote };
}

export async function getElectionResults(electionId: string) {
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

  // Count total eligible voters (verified VOTER and CANDIDATE users)
  const totalEligibleVoters = await prisma.user.count({
    where: {
      role: {
        in: ['VOTER', 'CANDIDATE'],
      },
      isVerified: true,
    },
  });

  // Only return results if published or user is admin
  // This check should be done at controller level based on user role

  return {
    election: {
      id: election.id,
      name: election.name,
      description: election.description,
      isResultsPublished: election.isResultsPublished,
      totalVotes: election._count.votes,
      totalEligibleVoters,
    },
    candidates: election.candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.user.name,
      party: candidate.party,
      votes: candidate._count.votes,
    })),
  };
}

export async function getAllVotes() {
  return prisma.vote.findMany({
    include: {
      voter: {
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
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

