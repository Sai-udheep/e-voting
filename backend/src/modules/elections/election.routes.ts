import { Router } from 'express';
import * as electionController from './election.controller';
import { authMiddleware, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes - get active elections
router.get('/active', electionController.getActiveElections);

// Protected routes - get all elections (for admin)
router.get('/', authMiddleware, electionController.getAllElections);
router.get('/:id', authMiddleware, electionController.getElectionById);

// Admin only routes
router.post('/', authMiddleware, requireRole('ADMIN'), electionController.createElection);
router.put('/:id', authMiddleware, requireRole('ADMIN'), electionController.updateElection);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), electionController.deleteElection);
router.patch('/:id/toggle-active', authMiddleware, requireRole('ADMIN'), electionController.toggleElectionActive);
router.patch('/:id/toggle-results', authMiddleware, requireRole('ADMIN'), electionController.toggleResultsPublished);

export default router;

