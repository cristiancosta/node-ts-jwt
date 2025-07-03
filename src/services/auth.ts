import { hashSync } from 'bcryptjs';

// Constants.
import { errorMessage } from '../constants/error-message';

// Errors.
import { ConflictError } from '../errors/conflict';

// Types.
import { AuthService, SignUpInputDto } from '../types/auth';
import { UserRepository } from '../types/user';

export const authService = (userRepository: UserRepository): AuthService => {
  const signUp = async (signUpDto: SignUpInputDto) => {
    const { username, password } = signUpDto;
    const user = await userRepository.getUserByUsername(username.trim());
    if (user) {
      throw new ConflictError(errorMessage.USER_ALREADY_EXIST);
    }
    const hashedPassword = hashSync(password.trim());
    const createdUser = await userRepository.createUser({
      username: username.trim(),
      password: hashedPassword
    });
    return {
      id: createdUser.id,
      username: createdUser.username,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt
    };
  };

  return {
    signUp
  };
};
