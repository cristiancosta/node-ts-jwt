import { sign, SignOptions } from 'jsonwebtoken';

// Configuration.
import { configuration } from '../configuration';

// Errors.
import { ConflictError } from '../errors/conflict';

// Types.
import { CreateJwtOptions, CreateJwtPayload } from '../types/jwt';

export const createJwt = (
  payload: CreateJwtPayload,
  options: CreateJwtOptions
): string => {
  const { subject } = options;
  const { secret, accessTokenDuration, refreshTokenDuration } =
    configuration.jwt;
  switch (subject) {
    case 'ACCESS_TOKEN': {
      const accessToken = sign(payload, secret, {
        ...options,
        algorithm: 'HS512',
        subject,
        expiresIn: accessTokenDuration
      } as SignOptions);
      return accessToken;
    }
    case 'REFRESH_TOKEN': {
      const refreshToken = sign(payload, secret, {
        ...options,
        algorithm: 'HS512',
        subject,
        expiresIn: refreshTokenDuration
      } as SignOptions);
      return refreshToken;
    }
    default:
      throw new ConflictError('INVALID_TOKEN_SUBJECT');
  }
};
