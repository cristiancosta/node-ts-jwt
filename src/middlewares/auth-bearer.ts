import { NextFunction, Request, Response } from 'express';

// Constants.
import { errorMessage } from '../constants/error-message';

// Errors.
import { ConflictError } from '../errors/conflict';
import { UnauthorizedError } from '../errors/unauthorized';

// Utils.
import { verifyJwt } from '../utils/verify-jwt';

export const authBearer = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (authorization === undefined) {
    throw new UnauthorizedError(errorMessage.MISSING_AUTHORIZATION_HEADER);
  } else if (authorization === '') {
    throw new UnauthorizedError(
      errorMessage.MISSING_AUTHORIZATION_HEADER_VALUE
    );
  } else {
    const [prefix, token] = authorization.split(' ');
    if (prefix.toLowerCase() === 'bearer') {
      verifyJwt(token, { subject: 'ACCESS_TOKEN' });
      next();
    } else {
      throw new ConflictError(errorMessage.INVALID_AUTHORIZATION_PREFIX);
    }
  }
};
