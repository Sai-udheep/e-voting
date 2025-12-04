import { Request, Response, NextFunction } from 'express';
import * as electionService from './election.service';

export async function createElection(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, startDate, endDate } = req.body;
    
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, startDate, and endDate are required' });
    }

    const election = await electionService.createElection({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    res.status(201).json(election);
  } catch (err) {
    next(err);
  }
}

export async function getAllElections(_req: Request, res: Response, next: NextFunction) {
  try {
    const elections = await electionService.getAllElections();
    res.json(elections);
  } catch (err) {
    next(err);
  }
}

export async function getElectionById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const election = await electionService.getElectionById(id);
    res.json(election);
  } catch (err) {
    next(err);
  }
}

export async function getActiveElections(_req: Request, res: Response, next: NextFunction) {
  try {
    const elections = await electionService.getActiveElections();
    res.json(elections);
  } catch (err) {
    next(err);
  }
}

export async function updateElection(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData: any = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.startDate) updateData.startDate = new Date(req.body.startDate);
    if (req.body.endDate) updateData.endDate = new Date(req.body.endDate);
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
    if (req.body.isResultsPublished !== undefined) updateData.isResultsPublished = req.body.isResultsPublished;

    const election = await electionService.updateElection(id, updateData);
    res.json(election);
  } catch (err) {
    next(err);
  }
}

export async function deleteElection(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await electionService.deleteElection(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function toggleElectionActive(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const election = await electionService.toggleElectionActive(id);
    res.json(election);
  } catch (err) {
    next(err);
  }
}

export async function toggleResultsPublished(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const election = await electionService.toggleResultsPublished(id);
    res.json(election);
  } catch (err) {
    next(err);
  }
}

