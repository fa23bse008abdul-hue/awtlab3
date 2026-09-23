import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: any;
  public isOperational: boolean;

  constructor(statusCode: number, errorCode: string, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new AppError(
    404,
    'RESOURCE_NOT_FOUND',
    `The requested endpoint or resource was not found on this server: ${req.method} ${req.originalUrl}`
  );
  next(error);
}

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');
  const message = err.message || 'An unexpected internal error occurred on the server';

  // Standardized Enterprise JSON Error Schema as specified in Module 2
  const errorResponse = {
    success: false,
    error: {
      code: errorCode,
      error_code: errorCode, // Backwards compatible with legacy mobile SDKs
      message: message,
      details: err.details || null,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  };

  // Log in production/server console
  if (statusCode >= 500) {
    console.error(`[API ERROR 500] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json(errorResponse);
}
