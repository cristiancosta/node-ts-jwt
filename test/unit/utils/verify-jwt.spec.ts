import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';

// Configuration.
import { configuration } from '../../../src/configuration';

// Errors.
import { UnauthorizedError } from '../../../src/errors/unauthorized';

// Utils.
import { verifyJwt } from '../../../src/utils/verify-jwt';

jest.mock('jsonwebtoken');

const verifyMock = verify as jest.Mock;

describe('verifyJwt', () => {
  const token = 'fake.jwt.token';
  const secret = 'testsecret';
  const accessTokenDuration = '1 day';
  const refreshTokenDuration = '1 day';
  const expectedSubject = 'ACCESS_TOKEN';

  beforeEach(() => {
    configuration.jwt = { secret, accessTokenDuration, refreshTokenDuration };
    verifyMock.mockReset();
  });

  it('Should return payload if token is valid and subject matches', () => {
    const payload = { id: 1, sub: expectedSubject };
    verifyMock.mockReturnValue(payload);

    const result = verifyJwt(token, { subject: expectedSubject });
    expect(result).toEqual(payload);
    expect(verify).toHaveBeenCalledWith(token, secret, {
      subject: expectedSubject,
      algorithms: ['HS512'],
      complete: false
    });
  });

  it('Should throw UnauthorizedError if subject does not match', () => {
    const payload = { id: 1, sub: 'REFRESH_TOKEN' };
    verifyMock.mockReturnValue(payload);

    expect(() => verifyJwt(token, { subject: expectedSubject })).toThrow(
      UnauthorizedError
    );
  });

  it('Should throw UnauthorizedError if token is expired', () => {
    const error = new TokenExpiredError('jwt expired', new Date());
    verifyMock.mockImplementation(() => {
      throw error;
    });

    expect(() => verifyJwt(token, { subject: expectedSubject })).toThrow(
      UnauthorizedError
    );
  });

  it('Should throw UnauthorizedError if token is invalid', () => {
    const error = new JsonWebTokenError('invalid signature');
    verifyMock.mockImplementation(() => {
      throw error;
    });

    expect(() => verifyJwt(token, { subject: expectedSubject })).toThrow(
      UnauthorizedError
    );
  });
});
