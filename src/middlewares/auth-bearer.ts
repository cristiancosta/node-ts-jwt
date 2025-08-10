import { NextFunction, Request, Response } from 'express';

// Errors.
import { ConflictError } from '../errors/conflict';
import { UnauthorizedError } from '../errors/unauthorized';

// Utils.
import { verifyJwt } from '../utils/verify-jwt';

export const authBearer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;
  if (authorization === undefined) {
    throw new UnauthorizedError('MISSING_AUTHORIZATION_HEADER');
  } else if (authorization === '') {
    throw new UnauthorizedError('MISSING_AUTHORIZATION_HEADER_VALUE');
  } else {
    const [prefix, token] = authorization.split(' ');
    if (prefix.toLowerCase() === 'bearer') {
      verifyJwt(token, { subject: 'ACCESS_TOKEN' });
      next();
    } else {
      throw new ConflictError('INVALID_AUTHORIZATION_PREFIX');
    }
  }
};
