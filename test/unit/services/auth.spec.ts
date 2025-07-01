import { hashSync } from 'bcryptjs';

// Errors
import { ConflictError } from '../../../src/errors/conflict';

// Types
import { AuthService } from '../../../src/types/auth';
import { UserDto, UserRepository } from '../../../src/types/user';

// Services.
import { authService } from '../../../src/services/auth';

const hashSyncMock = hashSync as jest.Mock;

describe('Auth', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      getUserById: jest.fn(),
      getUserByUsername: jest.fn(),
      createUser: jest.fn()
    };
    service = authService(userRepository);
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
});
