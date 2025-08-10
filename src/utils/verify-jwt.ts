import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

// Configuration.
import { configuration } from '../configuration';

// Errors.
import { InternalServerError } from '../errors/internal-server';
import { UnauthorizedError } from '../errors/unauthorized';

// Types.
import { VerifyJwtOptions, VerifyJwtPayload } from '../types/jwt';

export const verifyJwt = (
  token: string,
  options: VerifyJwtOptions
): VerifyJwtPayload => {
  let payload: VerifyJwtPayload;
  try {
    const { secret } = configuration.jwt;
    payload = verify(token, secret, {
      ...options,
      algorithms: ['HS512'],
      complete: false
    }) as VerifyJwtPayload;
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError('TOKEN_EXPIRED');
    } else if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError('INVALID_TOKEN');
    } else {
      console.error('verifyJwt#error', error);
      throw new InternalServerError('INTERNAL_SERVER_ERROR');
    }
  }
  return payload;
};
