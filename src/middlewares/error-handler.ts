import { NextFunction, Request, Response } from 'express';

// Constants.
import { errorMessage } from '../constants/error-message';
import { httpStatusCode } from '../constants/http-status-code';

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
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessage.INTERNAL_SERVER_ERROR });
  }
};
