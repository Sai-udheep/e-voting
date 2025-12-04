import { Router } from 'express';
import * as adminController from './admin.controller';
import { authMiddleware, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/pending-voters', adminController.getPendingVoters);
router.get('/stats', adminController.getAdminStats);
router.post('/approve-voter', adminController.approveVoter);
router.post('/approve-user', adminController.approveUser);
router.delete('/users/:userId', adminController.removeUser);

export default router;


