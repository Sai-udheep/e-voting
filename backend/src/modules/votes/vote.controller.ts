import { Request, Response, NextFunction } from 'express';
import * as voteService from './vote.service';

export async function castVote(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { electionId, candidateId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!electionId || !candidateId) {
      return res.status(400).json({ message: 'Election ID and candidate ID are required' });
    }

    const vote = await voteService.castVote({
      voterId: userId,
      electionId,
      candidateId,
    });

    res.status(201).json({ message: 'Vote cast successfully', vote });
  } catch (err) {
    next(err);
  }
}

export async function getVoteHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const votes = await voteService.getVoteHistory(userId);
    res.json(votes);
  } catch (err) {
    next(err);
  }
}

export async function hasVoted(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { electionId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await voteService.hasVoted(userId, electionId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getElectionResults(req: Request, res: Response, next: NextFunction) {
  try {
    const { electionId } = req.params;
    const userRole = (req as any).user?.role;

    const results = await voteService.getElectionResults(electionId);

    // Allow admins to see results even if not published
    // For non-admins, only show if published
    if (!results.election.isResultsPublished && userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Results are not published yet' });
    }

    // Admins can always see results, regardless of published status
    res.json(results);
  } catch (err) {
    next(err);
  }
}

export async function getAllVotes(_req: Request, res: Response, next: NextFunction) {
  try {
    const votes = await voteService.getAllVotes();
    res.json(votes);
  } catch (err) {
    next(err);
  }
}

