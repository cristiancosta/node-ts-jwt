import { v4 as uuidv4 } from 'uuid';
import { compareSync, hashSync } from 'bcryptjs';

// Errors
import { BadRequestError } from '../../../src/errors/bad-request';
import { ConflictError } from '../../../src/errors/conflict';
import { NotFoundError } from '../../../src/errors/not-found';
import { UnauthorizedError } from '../../../src/errors/unauthorized';

// Types
import { AuthService } from '../../../src/types/auth';
import { CreateJwtOptions, CreateJwtPayload } from '../../../src/types/jwt';
import { UserDto, UserRepository } from '../../../src/types/user';

// Services.
import { authService } from '../../../src/services/auth';

// Utils.
import { createJwt } from '../../../src/utils/create-jwt';
import { verifyJwt } from '../../../src/utils/verify-jwt';

jest.mock('uuid');
jest.mock('bcryptjs');
jest.mock('../../../src/utils/create-jwt');
jest.mock('../../../src/utils/verify-jwt');

const hashSyncMock = hashSync as jest.Mock;
const compareSyncMock = compareSync as jest.Mock;
const createJwtMock = createJwt as jest.Mock;
const uuidv4Mock = uuidv4 as jest.Mock;
const verifyJwtMock = verifyJwt as jest.Mock;

describe('Auth', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      getUserById: jest.fn(),
      getUserByUsername: jest.fn(),
      createUser: jest.fn(),
      updateRefreshUuid: jest.fn(),
      getUserByIdAndRefreshUuid: jest.fn()
    };
    service = authService(userRepository);
  });

  describe('signIn', () => {
    it('Should throw NotFoundError if user does not exist', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);
      await expect(
        service.signIn({ username: 'user', password: 'pass' })
      ).rejects.toThrow(NotFoundError);
      expect(userRepository.getUserByUsername).toHaveBeenCalledWith('user');
    });

    it('Should throw BadRequestError if password is invalid', async () => {
      userRepository.getUserByUsername.mockResolvedValue({
        id: 1,
        username: 'user',
        password: 'hashed',
        refreshUuid: 'uuid',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      compareSyncMock.mockReturnValue(false);
      await expect(
        service.signIn({ username: 'user', password: 'wrong' })
      ).rejects.toThrow(BadRequestError);
    });

    it('Should return access and refresh tokens on successful login', async () => {
      const user: UserDto = {
        id: 1,
        username: 'user',
        password: 'hashed',
        refreshUuid: 'uuid',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      userRepository.getUserByUsername.mockResolvedValue(user);
      compareSyncMock.mockReturnValue(true);
      uuidv4Mock.mockReturnValue('uuid-123');
      createJwtMock.mockImplementation(
        (payload: CreateJwtPayload, options: CreateJwtOptions) =>
          `${options.subject}-token-${payload.uuid || payload.id}`
      );

      const result = await service.signIn({
        username: 'user',
        password: 'valid'
      });
      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN-token-1',
        refreshToken: 'REFRESH_TOKEN-token-uuid-123'
      });
      expect(userRepository.updateRefreshUuid).toHaveBeenCalledWith(
        1,
        'uuid-123'
      );
    });
  });

  describe('signUp', () => {
    it('Should throw ConflictError if user already exists', async () => {
      userRepository.getUserByUsername.mockResolvedValue({
        username: 'user'
      } as UserDto);
      await expect(
        service.signUp({ username: 'user', password: 'pass' })
      ).rejects.toThrow(ConflictError);
    });

    it('Should hash password and create user', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);
      hashSyncMock.mockReturnValue('hashed');
      const createdUser = {
        password: '',
        refreshUuid: '',
        id: 1,
        username: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      userRepository.createUser.mockResolvedValue(createdUser);

      const result = await service.signUp({
        username: 'user',
        password: 'pass'
      });
      expect(result).toMatchObject({
        id: createdUser.id,
        username: createdUser.username
      });
      expect(userRepository.createUser).toHaveBeenCalledWith({
        username: 'user',
        password: 'hashed'
      });
    });
  });

  describe('refresh', () => {
    it('Should throw UnauthorizedError if token is invalid or user not found', async () => {
      verifyJwtMock.mockReturnValue({ id: 1, uuid: 'uuid' });
      userRepository.getUserByIdAndRefreshUuid.mockResolvedValue(null);
      await expect(service.refresh({ refreshToken: 'token' })).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('Should return new tokens and update uuid', async () => {
      verifyJwtMock.mockReturnValue({ id: 1, uuid: 'old-uuid' });
      const createdUser = {
        password: 'password',
        refreshUuid: 'new-uuid',
        id: 1,
        username: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      userRepository.getUserByIdAndRefreshUuid.mockResolvedValue(createdUser);
      uuidv4Mock.mockReturnValue('new-uuid');
      createJwtMock.mockImplementation(
        (payload: CreateJwtPayload, options: CreateJwtOptions) =>
          `${options.subject}-token-${payload.uuid || payload.id}`
      );

      const result = await service.refresh({ refreshToken: 'token' });

      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN-token-1',
        refreshToken: 'REFRESH_TOKEN-token-old-uuid'
      });
      expect(userRepository.updateRefreshUuid).toHaveBeenCalledWith(
        1,
        'new-uuid'
      );
    });
  });
});
