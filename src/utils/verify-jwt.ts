import {
  verify,
  TokenExpiredError,
  JsonWebTokenError,
  JwtPayload
} from 'jsonwebtoken';

// Constants.
import { errorMessage } from '../constants/error-message';

// Configuration.
import { configuration } from '../configuration';

// Errors.
import { InternalServerError } from '../errors/internal-server';
import { UnauthorizedError } from '../errors/unauthorized';

// Types.
import { VerifyJwtOptions } from '../types/jwt';

export const verifyJwt = (
  token: string,
  options: VerifyJwtOptions
): JwtPayload => {
  let payload: JwtPayload;
  try {
    const { secret } = configuration.jwt;
    payload = verify(token, secret, {
      ...options,
      algorithms: ['HS512'],
      complete: false
    }) as JwtPayload;
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError(errorMessage.TOKEN_EXPIRED);
    } else if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError(errorMessage.INVALID_TOKEN);
    } else {
      console.error('verifyJwt#error', error);
      throw new InternalServerError(errorMessage.INTERNAL_SERVER_ERROR);
    }
  }
  if (payload.sub !== options.subject) {
    throw new UnauthorizedError(errorMessage.INVALID_TOKEN_SUBJECT);
  }
  return payload;
};
