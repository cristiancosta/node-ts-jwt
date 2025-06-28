import { sign, SignOptions } from 'jsonwebtoken';

// Constants.
import { errorMessage } from '../constants';

// Configuration.
import configuration from '../configuration';

// Errors.
import { ConflictError } from '../errors/conflict';

// Types.
import { CreateJwtOptions } from '../types/jwt';

export const createJwt = (payload: object, options: CreateJwtOptions) => {
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
      throw new ConflictError(errorMessage.INVALID_TOKEN_SUBJECT);
  }
};
