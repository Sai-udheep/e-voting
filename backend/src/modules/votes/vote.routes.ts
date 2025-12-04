import { Router } from 'express';
import * as voteController from './vote.controller';
import { authMiddleware, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// Voter routes
router.post('/cast', authMiddleware, voteController.castVote);
router.get('/history', authMiddleware, voteController.getVoteHistory);
router.get('/has-voted/:electionId', authMiddleware, voteController.hasVoted);

// Get results - requires auth to check if user is admin
// Public users can see if published, admins can always see
router.get('/results/:electionId', authMiddleware, voteController.getElectionResults);

// Admin routes
router.get('/all', authMiddleware, requireRole('ADMIN'), voteController.getAllVotes);

export default router;

