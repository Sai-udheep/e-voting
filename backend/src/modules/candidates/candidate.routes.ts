import { Router } from 'express';
import * as candidateController from './candidate.controller';
import { authMiddleware, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// Candidate routes - submit nomination
router.post('/nominate', authMiddleware, candidateController.createNomination);

// Get user's own nominations
router.get('/my-nominations', authMiddleware, candidateController.getCandidatesByUser);

// Get candidates by election (public for active elections)
router.get('/election/:electionId', candidateController.getCandidatesByElection);

// Admin routes
router.get('/', authMiddleware, requireRole('ADMIN'), candidateController.getAllCandidates);
router.get('/pending', authMiddleware, requireRole('ADMIN'), candidateController.getPendingNominations);
router.patch('/:id/approve', authMiddleware, requireRole('ADMIN'), candidateController.approveCandidate);
router.patch('/:id/reject', authMiddleware, requireRole('ADMIN'), candidateController.rejectCandidate);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), candidateController.deleteCandidate);

export default router;

