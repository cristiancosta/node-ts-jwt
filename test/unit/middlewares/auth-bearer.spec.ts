import { Request, Response } from 'express';

// Constants.
import { errorMessage } from '../../../src/constants/error-message';

// Errors.
import { UnauthorizedError } from '../../../src/errors/unauthorized';
import { ConflictError } from '../../../src/errors/conflict';

// Middlewares.
import { authBearer } from '../../../src/middlewares/auth-bearer';

// Utils.
import { verifyJwt } from '../../../src/utils/verify-jwt';

jest.mock('../../../src/utils/verify-jwt');

const verifyJwtMock = verifyJwt as jest.Mock;

describe('authBearer', () => {
  const createMockReq = (authHeader: string | undefined): Request => {
    return {
      headers: { authorization: authHeader }
    } as unknown as Request;
  };
  const res = {} as unknown as Response;
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UnauthorizedError when Authorization header is missing', () => {
    const req = createMockReq(undefined);
    expect(() => authBearer(req, res, next)).toThrow(UnauthorizedError);
    expect(() => authBearer(req, res, next)).toThrow(
      errorMessage.MISSING_AUTHORIZATION_HEADER
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when Authorization header is empty', () => {
    const req = createMockReq('');
    expect(() => authBearer(req, res, next)).toThrow(UnauthorizedError);
    expect(() => authBearer(req, res, next)).toThrow(
      errorMessage.MISSING_AUTHORIZATION_HEADER_VALUE
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw ConflictError when Authorization prefix is not Bearer', () => {
    const req = createMockReq('Token abc.def.ghi');
    expect(() => authBearer(req, res, next)).toThrow(ConflictError);
    expect(() => authBearer(req, res, next)).toThrow(
      errorMessage.INVALID_AUTHORIZATION_PREFIX
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call verifyJwt and next() when token is valid and prefix is Bearer', () => {
    const token = 'abc.def.ghi';
    const req = createMockReq(`Bearer ${token}`);

    verifyJwtMock.mockReturnValue({ id: 1 });

    authBearer(req, res, next);

    expect(verifyJwtMock).toHaveBeenCalledWith(token, {
      subject: 'ACCESS_TOKEN'
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
