import { Request, Response, NextFunction } from 'express';
import * as candidateService from './candidate.service';

export async function createNomination(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { electionId, party } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!electionId || !party) {
      return res.status(400).json({ message: 'Election ID and party are required' });
    }

    const nomination = await candidateService.createNomination({
      userId,
      electionId,
      party,
    });

    res.status(201).json(nomination);
  } catch (err) {
    next(err);
  }
}

export async function getAllCandidates(_req: Request, res: Response, next: NextFunction) {
  try {
    const candidates = await candidateService.getAllCandidates();
    res.json(candidates);
  } catch (err) {
    next(err);
  }
}

export async function getCandidatesByElection(req: Request, res: Response, next: NextFunction) {
  try {
    const { electionId } = req.params;
    const candidates = await candidateService.getCandidatesByElection(electionId);
    res.json(candidates);
  } catch (err) {
    next(err);
  }
}

export async function getCandidatesByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const candidates = await candidateService.getCandidatesByUser(userId);
    res.json(candidates);
  } catch (err) {
    next(err);
  }
}

export async function getPendingNominations(_req: Request, res: Response, next: NextFunction) {
  try {
    const nominations = await candidateService.getPendingNominations();
    res.json(nominations);
  } catch (err) {
    next(err);
  }
}

export async function approveCandidate(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const candidate = await candidateService.updateCandidateStatus(id, 'APPROVED');
    res.json({ message: 'Candidate approved successfully', candidate });
  } catch (err) {
    next(err);
  }
}

export async function rejectCandidate(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const candidate = await candidateService.updateCandidateStatus(id, 'REJECTED');
    res.json({ message: 'Candidate rejected successfully', candidate });
  } catch (err) {
    next(err);
  }
}

export async function deleteCandidate(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await candidateService.deleteCandidate(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

