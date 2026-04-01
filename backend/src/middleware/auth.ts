import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: User;
  userId?: string;
  userRole?: UserRole;
}

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

// Generate JWT token
export const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Middleware to protect routes
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'No token provided. Please log in to access this resource.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
    return;
  }

  req.userId = decoded.id;
  req.userRole = decoded.role;
  next();
};

// Middleware to check if user is admin
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.userRole && !['admin', 'owner'].includes(req.userRole)) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
    return;
  }
  next();
};

// Middleware to check specific roles
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
      return;
    }
    next();
  };
};

import dotenv from 'dotenv';