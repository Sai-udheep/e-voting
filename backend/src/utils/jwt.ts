import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface JwtPayload {
  id: string;
  role: 'VOTER' | 'CANDIDATE' | 'ADMIN';
}

export function signToken(payload: JwtPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
}


