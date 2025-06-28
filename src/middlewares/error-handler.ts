import { NextFunction, Request, Response } from 'express';

// Constants.
import { errorMessage, httpStatusCode } from '../constants';

// Errors.
import { BaseError } from '../errors/base';

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
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

export default errorHandler;
