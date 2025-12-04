import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';

export async function getPendingVoters(_req: Request, res: Response, next: NextFunction) {
  try {
    const voters = await adminService.listPendingVoters();
    res.json(voters);
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await adminService.listAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function approveVoter(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body;
    const voter = await adminService.approveVoter(userId);
    res.json({ message: 'User approved successfully', user: voter });
  } catch (err) {
    next(err);
  }
}

export async function approveUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body;
    const user = await adminService.approveUser(userId);
    res.json({ message: 'User approved successfully', user });
  } catch (err) {
    next(err);
  }
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const result = await adminService.removeUser(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getAdminStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getAdminStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}


