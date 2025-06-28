import { sign } from 'jsonwebtoken';

// Constants.
import { errorMessage } from '../../../src/constants';

// Errors.
import { ConflictError } from '../../../src/errors/conflict';

// Configuration.
import configuration from '../../../src/configuration';

// Utils.
import { createJwt } from '../../../src/utils/create-jwt';

jest.mock('jsonwebtoken');

const signMock = sign as jest.Mock;

describe('createJwt', () => {
  const payload = { id: 123 };
  const secret = 'testsecret';
  const accessTokenDuration = '15m';
  const refreshTokenDuration = '7d';

  beforeEach(() => {
    configuration.jwt = {
      secret,
      accessTokenDuration,
      refreshTokenDuration
    };
    signMock.mockReset();
  });

  it('Should create an access token with correct parameters', () => {
    const mockedToken = 'access.token.mock';
    signMock.mockReturnValue(mockedToken);

    const result = createJwt(payload, { subject: 'ACCESS_TOKEN' });

    expect(result).toBe(mockedToken);
    expect(sign).toHaveBeenCalledWith(payload, secret, {
      algorithm: 'HS512',
      subject: 'ACCESS_TOKEN',
      expiresIn: '15m'
    });
  });

  it('should create a refresh token with correct parameters', () => {
    const mockedToken = 'refresh.token.mock';
    signMock.mockReturnValue(mockedToken);

    const result = createJwt(payload, { subject: 'REFRESH_TOKEN' });

    expect(result).toBe(mockedToken);
    expect(sign).toHaveBeenCalledWith(payload, secret, {
      algorithm: 'HS512',
      subject: 'REFRESH_TOKEN',
      expiresIn: '7d'
    });
  });

  it('should throw ConflictError on invalid subject', () => {
    // @ts-expect-error for testing invalid input
    expect(() => createJwt(payload, { subject: 'INVALID' })).toThrow(
      ConflictError
    );

    // @ts-expect-error for testing invalid input
    expect(() => createJwt(payload, { subject: 'INVALID' })).toThrow(
      errorMessage.INVALID_TOKEN_SUBJECT
    );

    expect(sign).not.toHaveBeenCalled();
  });
});
