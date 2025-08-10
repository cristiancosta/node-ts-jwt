// Errors.
import { NotFoundError } from '../errors/not-found';

// Types.
import { GetUserOutputDto, UserRepository, UserService } from '../types/user';

export const userService = (userRepository: UserRepository): UserService => {
  const getUser = async (id: number): Promise<GetUserOutputDto> => {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError('USER_NOT_FOUND');
    }
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  };

  return {
    getUser
  };
};
