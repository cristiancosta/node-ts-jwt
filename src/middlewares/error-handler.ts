import { NextFunction, Request, Response } from 'express';

// Errors.
import { BaseError } from '../errors/base';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof BaseError) {
    res
      .status(error.httpCode)
      .send({ message: error.message, errors: error.errors });
  } else {
    res.status(500).send({ message: 'INTERNAL_SERVER_ERROR' });
  }
};
